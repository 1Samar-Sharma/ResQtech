import React, { Component, useState, useMemo, useEffect, ReactNode, ErrorInfo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  MapCameraChangedEvent,
  useApiLoadingStatus,
  APILoadingStatus,
} from '@vis.gl/react-google-maps';
import {
  DisasterAlert,
  WomenSafetyAlert,
  HelpRequest,
  VolunteerOffer,
  SafeHavenPoint,
  Coordinates,
} from '../../types';
import {
  Flame,
  Shield,
  HeartHandshake,
  Crosshair,
  Compass,
  PhoneCall,
  CheckCircle,
  Radio,
  Radar,
  ArrowLeft,
  X,
  ExternalLink,
  Layers,
  MapPin,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { calculateDistanceKm, formatDistance } from '../../utils/geo';
import { GoogleMapCircle } from './GoogleMapCircle';
import { useAuth } from '../../context/AuthContext';
import {
  resolveWomenSafetyAlertDoc,
  updateHelpRequestStatusDoc,
} from '../../lib/firebase';

interface GoogleMapsViewProps {
  apiKey: string;
  alerts: DisasterAlert[];
  womenAlerts: WomenSafetyAlert[];
  helpRequests: HelpRequest[];
  volunteers: VolunteerOffer[];
  safeHavens: SafeHavenPoint[];
  userLocation: Coordinates;
  userAddress?: string;
  activeSignal?: any | null;
  onSelectAlert?: (alert: DisasterAlert) => void;
  onSelectSOS?: (sos: WomenSafetyAlert) => void;
  onSelectHelpRequest?: (req: HelpRequest) => void;
  onSelectSafeHaven?: (haven: SafeHavenPoint) => void;
  onRequestAidAtLocation?: (coords: Coordinates) => void;
  onOpenBroadcastModal?: () => void;
  onSwitchToLeaflet?: () => void;
}

const ApiStatusHandler: React.FC<{ onSwitchToLeaflet?: () => void }> = ({ onSwitchToLeaflet }) => {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.AUTH_FAILURE || status === APILoadingStatus.FAILED) {
    return (
      <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 backdrop-blur-2xl">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-xl">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">Google Maps JavaScript API Not Activated</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          The API key requires the <span className="text-amber-300 font-semibold">Maps JavaScript API</span> to be enabled in Google Cloud Console. The fully featured OpenStreetMap (Leaflet) engine is ready.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onSwitchToLeaflet && (
            <button
              onClick={onSwitchToLeaflet}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Switch to OpenStreetMap (Leaflet)</span>
            </button>
          )}
          <a
            href="https://console.cloud.google.com/apis/library/maps-backend.googleapis.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-medium text-sm border border-white/10 transition-all flex items-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Enable in Cloud Console</span>
          </a>
        </div>
      </div>
    );
  }

  if (status === APILoadingStatus.LOADING) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm pointer-events-none">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mb-2" />
        <p className="text-xs text-slate-400 font-medium">Connecting to Google Maps Platform...</p>
      </div>
    );
  }

  return null;
};

interface MapErrorBoundaryProps {
  onSwitchToLeaflet?: () => void;
  children: React.ReactNode;
}

interface MapErrorBoundaryState {
  hasError: boolean;
}

class MapErrorBoundary extends Component<MapErrorBoundaryProps, MapErrorBoundaryState> {
  declare props: MapErrorBoundaryProps;
  state: MapErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): MapErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: ErrorInfo) {
    console.warn('[Map Engine] GoogleMapsView caught error:', error, info);
    if (this.props.onSwitchToLeaflet) {
      this.props.onSwitchToLeaflet();
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-slate-950/95 backdrop-blur-2xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-xl">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-100 mb-2">Google Maps Initialization Notice</h3>
          <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
            Google Maps Platform encountered an initialization issue. OpenStreetMap (Leaflet) is ready to power full live disaster telemetry.
          </p>
          {this.props.onSwitchToLeaflet && (
            <button
              onClick={this.props.onSwitchToLeaflet}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Switch to OpenStreetMap (Leaflet)</span>
            </button>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export const GoogleMapsView: React.FC<GoogleMapsViewProps> = ({
  apiKey,
  alerts = [],
  womenAlerts = [],
  helpRequests = [],
  volunteers = [],
  safeHavens = [],
  userLocation,
  userAddress = 'Your Current Area',
  activeSignal = null,
  onSelectAlert,
  onSelectSOS,
  onSelectHelpRequest,
  onSelectSafeHaven,
  onRequestAidAtLocation,
  onOpenBroadcastModal,
  onSwitchToLeaflet,
}) => {
  const { isAuthorOrAdmin } = useAuth();

  const [mapType, setMapType] = useState<google.maps.MapTypeId>(
    'roadmap' as unknown as google.maps.MapTypeId
  );
  const [show5kmRadar, setShow5kmRadar] = useState<boolean>(true);
  const [activeLayerFilter, setActiveLayerFilter] = useState<
    'all' | 'wildfire' | 'flood' | 'sos' | 'shelter' | 'aid' | 'volunteers'
  >('all');

  const [selectedItem, setSelectedItem] = useState<{
    type: 'alert' | 'sos' | 'request' | 'volunteer' | 'haven';
    data: any;
    position: google.maps.LatLngLiteral;
  } | null>(null);

  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const [camera, setCamera] = useState<{
    center: google.maps.LatLngLiteral;
    zoom: number;
  }>({
    center: {
      lat: userLocation && Number.isFinite(userLocation.lat) ? userLocation.lat : 28.6139,
      lng: userLocation && Number.isFinite(userLocation.lng) ? userLocation.lng : 77.2090,
    },
    zoom: 13,
  });

  const handleCameraChange = (e: MapCameraChangedEvent) => {
    setCamera(e.detail);
  };

  // Keep camera centered when userLocation coordinates change
  React.useEffect(() => {
    if (userLocation && Number.isFinite(userLocation.lat) && Number.isFinite(userLocation.lng)) {
      setCamera((prev) => ({
        ...prev,
        center: { lat: userLocation.lat, lng: userLocation.lng },
      }));
    }
  }, [userLocation?.lat, userLocation?.lng]);

  const handleRecenter = () => {
    const lat = userLocation && Number.isFinite(userLocation.lat) ? userLocation.lat : 28.6139;
    const lng = userLocation && Number.isFinite(userLocation.lng) ? userLocation.lng : 77.2090;
    setCamera({
      center: {
        lat,
        lng,
      },
      zoom: 14,
    });
  };

  // Filtered lists
  const filteredAlerts = useMemo(() => {
    if (activeLayerFilter === 'all') return alerts;
    if (activeLayerFilter === 'wildfire') return alerts.filter((a) => a.category === 'wildfire');
    if (activeLayerFilter === 'flood') return alerts.filter((a) => a.category === 'flood');
    return [];
  }, [alerts, activeLayerFilter]);

  const filteredSOS = useMemo(() => {
    if (activeLayerFilter === 'all' || activeLayerFilter === 'sos') {
      return womenAlerts.filter((s) => s.status === 'active_sos' || s.status === 'responder_en_route' || (s.status as string) === 'active');
    }
    return [];
  }, [womenAlerts, activeLayerFilter]);

  const filteredRequests = useMemo(() => {
    if (activeLayerFilter === 'all' || activeLayerFilter === 'aid') {
      return helpRequests.filter((r) => r.status === 'open' || r.status === 'matched' || r.status === 'in_progress' || (r.status as string) === 'in-progress');
    }
    return [];
  }, [helpRequests, activeLayerFilter]);

  const filteredVolunteers = useMemo(() => {
    if (activeLayerFilter === 'all' || activeLayerFilter === 'volunteers') {
      return volunteers.filter((v) => v.isAvailable !== false || (v as any).status === 'available');
    }
    return [];
  }, [volunteers, activeLayerFilter]);

  const filteredHavens = useMemo(() => {
    if (activeLayerFilter === 'all' || activeLayerFilter === 'shelter') {
      return safeHavens;
    }
    return [];
  }, [safeHavens, activeLayerFilter]);

  const handleResolveSOS = async (sosId: string) => {
    try {
      await resolveWomenSafetyAlertDoc(sosId);
      setActionSuccess('Emergency beacon resolved successfully.');
      setSelectedItem(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveAid = async (reqId: string) => {
    try {
      await updateHelpRequestStatusDoc(reqId, 'fulfilled');
      setActionSuccess('Aid request marked as fulfilled!');
      setSelectedItem(null);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const prevAuthFailure = (window as any).gm_authFailure;
    (window as any).gm_authFailure = () => {
      console.warn('Google Maps authentication failed (e.g. ApiNotActivatedMapError). Falling back to Leaflet OSM.');
      if (onSwitchToLeaflet) {
        onSwitchToLeaflet();
      }
      if (prevAuthFailure) prevAuthFailure();
    };
    return () => {
      (window as any).gm_authFailure = prevAuthFailure;
    };
  }, [onSwitchToLeaflet]);

  if (!apiKey) {
    return (
      <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 font-sans flex flex-col items-center justify-center p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4 text-amber-400 shadow-xl">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-100 mb-2">Google Maps JavaScript API Setup</h3>
        <p className="text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
          To display Google Maps, activate the Maps JavaScript API in Google Cloud Console. OpenStreetMap (Leaflet) is actively powering the map.
        </p>
        {onSwitchToLeaflet && (
          <button
            onClick={onSwitchToLeaflet}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg transition-all flex items-center gap-2 cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Switch to OpenStreetMap (Leaflet)</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-slate-950 font-sans">
      <MapErrorBoundary onSwitchToLeaflet={onSwitchToLeaflet}>
        <APIProvider
          apiKey={apiKey}
          libraries={['marker', 'geometry']}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        >
          <ApiStatusHandler onSwitchToLeaflet={onSwitchToLeaflet} />
          <Map
          mapId="DEMO_MAP_ID"
          center={camera.center}
          zoom={camera.zoom}
          onCameraChanged={handleCameraChange}
          mapTypeId={mapType}
          disableDefaultUI={true}
          gestureHandling="greedy"
          style={{ width: '100%', height: '100%' }}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          onClick={(e) => {
            if (e.detail.latLng && onRequestAidAtLocation) {
              onRequestAidAtLocation({
                lat: e.detail.latLng.lat,
                lng: e.detail.latLng.lng,
              });
            }
          }}
        >
          {/* 5km Radius Radar Circle Around User */}
          {show5kmRadar && userLocation && Number.isFinite(userLocation.lat) && Number.isFinite(userLocation.lng) && (
            <GoogleMapCircle
              center={{ lat: userLocation.lat, lng: userLocation.lng }}
              radius={5000}
              strokeColor="#06b6d4"
              strokeOpacity={0.8}
              strokeWeight={2}
              fillColor="#06b6d4"
              fillOpacity={0.08}
            />
          )}

          {/* Active 5km Emergency Signal Broadcast */}
          {activeSignal && (() => {
            const sigCoords = activeSignal.coordinates || activeSignal.location;
            if (!sigCoords || !Number.isFinite(sigCoords.lat) || !Number.isFinite(sigCoords.lng)) return null;
            return (
              <GoogleMapCircle
                center={{ lat: sigCoords.lat, lng: sigCoords.lng }}
                radius={5000}
                strokeColor="#ef4444"
                strokeOpacity={0.9}
                strokeWeight={3}
                fillColor="#ef4444"
                fillOpacity={0.18}
              />
            );
          })()}

          {/* User Location Marker */}
          {userLocation && Number.isFinite(userLocation.lat) && Number.isFinite(userLocation.lng) && (
            <AdvancedMarker
              position={{ lat: userLocation.lat, lng: userLocation.lng }}
              title="Your Location"
              zIndex={100}
            >
              <div className="relative flex items-center justify-center">
                <span className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-cyan-400/40 animate-ping" />
                <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-white shadow-xl flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-950" />
                </div>
              </div>
            </AdvancedMarker>
          )}

          {/* Disaster Alerts */}
          {filteredAlerts.map((alert) => {
            const coords = alert.coordinates || (alert as any).location;
            if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return null;
            return (
              <AdvancedMarker
                key={alert.id}
                position={{ lat: coords.lat, lng: coords.lng }}
                title={alert.title}
                onClick={() => {
                  setSelectedItem({
                    type: 'alert',
                    data: alert,
                    position: { lat: coords.lat, lng: coords.lng },
                  });
                  onSelectAlert?.(alert);
                }}
              >
                <div className="w-9 h-9 rounded-2xl bg-amber-500 text-slate-950 border-2 border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <Flame className="w-5 h-5 fill-slate-950" />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Women Safety SOS */}
          {filteredSOS.map((sos) => {
            const coords = sos.coordinates || (sos as any).location;
            if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return null;
            return (
              <AdvancedMarker
                key={sos.id}
                position={{ lat: coords.lat, lng: coords.lng }}
                title={`SOS Beacon: ${sos.codeName || sos.authorName || 'SOS'}`}
                zIndex={90}
                onClick={() => {
                  setSelectedItem({
                    type: 'sos',
                    data: sos,
                    position: { lat: coords.lat, lng: coords.lng },
                  });
                  onSelectSOS?.(sos);
                }}
              >
                <div className="relative flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-rose-500/50 animate-ping" />
                  <div className="w-9 h-9 rounded-2xl bg-rose-600 text-white border-2 border-white shadow-2xl flex items-center justify-center">
                    <Shield className="w-5 h-5 fill-white" />
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Mutual Aid Requests */}
          {filteredRequests.map((req) => {
            const coords = req.coordinates || (req as any).location;
            if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return null;
            return (
              <AdvancedMarker
                key={req.id}
                position={{ lat: coords.lat, lng: coords.lng }}
                title={`Aid: ${req.description || req.category}`}
                onClick={() => {
                  setSelectedItem({
                    type: 'request',
                    data: req,
                    position: { lat: coords.lat, lng: coords.lng },
                  });
                  onSelectHelpRequest?.(req);
                }}
              >
                <div className="w-9 h-9 rounded-2xl bg-emerald-500 text-slate-950 border-2 border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <HeartHandshake className="w-5 h-5 fill-slate-950" />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Volunteers */}
          {filteredVolunteers.map((vol) => {
            const coords = vol.coordinates || (vol as any).location;
            if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return null;
            return (
              <AdvancedMarker
                key={vol.id}
                position={{ lat: coords.lat, lng: coords.lng }}
                title={`Volunteer: ${vol.volunteerName || (vol as any).name || 'Volunteer'}`}
                onClick={() => {
                  setSelectedItem({
                    type: 'volunteer',
                    data: vol,
                    position: { lat: coords.lat, lng: coords.lng },
                  });
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500 text-white border-2 border-white shadow-2xl flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4" />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Safe Havens */}
          {filteredHavens.map((haven) => {
            const coords = haven.coordinates || (haven as any).location;
            if (!coords || !Number.isFinite(coords.lat) || !Number.isFinite(coords.lng)) return null;
            return (
              <AdvancedMarker
                key={haven.id}
                position={{ lat: coords.lat, lng: coords.lng }}
                title={haven.name}
                onClick={() => {
                  setSelectedItem({
                    type: 'haven',
                    data: haven,
                    position: { lat: coords.lat, lng: coords.lng },
                  });
                  onSelectSafeHaven?.(haven);
                }}
              >
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white border border-white/80 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <span className="text-xs font-black">
                    {haven.type === 'hospital' ? '🏥' : haven.type === 'fire_station' ? '🚒' : '🛡️'}
                  </span>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Interactive InfoWindow */}
          {selectedItem && (
            <InfoWindow
              position={selectedItem.position}
              onCloseClick={() => setSelectedItem(null)}
            >
              <div className="p-2 text-slate-900 max-w-xs space-y-2">
                {selectedItem.type === 'alert' && (
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 uppercase tracking-wider">
                      {selectedItem.data.category} Hazard
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-950 mt-1">
                      {selectedItem.data.title}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {selectedItem.data.description}
                    </p>
                    <div className="text-[11px] text-slate-600 mt-2 flex items-center justify-between font-semibold">
                      <span>Severity: {selectedItem.data.severity}</span>
                      <span>
                        {formatDistance(
                          calculateDistanceKm(userLocation, selectedItem.data.coordinates)
                        )}{' '}
                        away
                      </span>
                    </div>
                  </div>
                )}

                {selectedItem.type === 'sos' && (
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 uppercase tracking-wider animate-pulse">
                      🚨 Women Emergency Beacon
                    </span>
                    <h4 className="font-extrabold text-sm text-rose-950 mt-1">
                      {selectedItem.data.name}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1">
                      {selectedItem.data.message || 'Immediate assistance requested.'}
                    </p>
                    <div className="mt-2 space-y-1.5">
                      {selectedItem.data.phone && (
                        <a
                          href={`tel:${selectedItem.data.phone}`}
                          className="w-full flex items-center justify-center gap-1.5 py-1 px-3 rounded-lg bg-rose-600 text-white text-xs font-bold shadow-md hover:bg-rose-500"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call ({selectedItem.data.phone})</span>
                        </a>
                      )}
                      {isAuthorOrAdmin(
                        selectedItem.data.userId,
                        selectedItem.data.authorEmail
                      ) && (
                        <button
                          onClick={() => handleResolveSOS(selectedItem.data.id)}
                          className="w-full py-1 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 flex items-center justify-center gap-1"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Mark Resolved</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {selectedItem.type === 'request' && (
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                      🤝 Mutual Aid Request
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-950 mt-1">
                      {selectedItem.data.title}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1">{selectedItem.data.description}</p>
                    <div className="text-[11px] text-slate-600 mt-1 font-semibold">
                      Urgency: {selectedItem.data.urgency} • Needs:{' '}
                      {selectedItem.data.category}
                    </div>
                    {isAuthorOrAdmin(
                      selectedItem.data.userId,
                      selectedItem.data.authorEmail
                    ) && (
                      <button
                        onClick={() => handleResolveAid(selectedItem.data.id)}
                        className="mt-2 w-full py-1 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold shadow-md hover:bg-emerald-500 flex items-center justify-center gap-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Mark Fulfilled</span>
                      </button>
                    )}
                  </div>
                )}

                {selectedItem.type === 'haven' && (
                  <div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 uppercase tracking-wider">
                      Verified Safe Haven
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-950 mt-1">
                      {selectedItem.data.name}
                    </h4>
                    <p className="text-xs text-slate-700 mt-1">{selectedItem.data.address}</p>
                    {selectedItem.data?.coordinates && Number.isFinite(selectedItem.data.coordinates.lat) && Number.isFinite(selectedItem.data.coordinates.lng) && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${selectedItem.data.coordinates.lat},${selectedItem.data.coordinates.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 w-full flex items-center justify-center gap-1 py-1 px-3 rounded-lg bg-sky-600 text-white text-xs font-bold shadow-md hover:bg-sky-500"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Google Maps Directions</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
      </MapErrorBoundary>

      {/* Floating Top Control Bar */}
      <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-10">
        {/* Layer Filters */}
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl pointer-events-auto">
          <button
            onClick={() => setActiveLayerFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeLayerFilter === 'all'
                ? 'bg-cyan-500 text-slate-950 shadow-md'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Hazards
          </button>
          <button
            onClick={() => setActiveLayerFilter('sos')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeLayerFilter === 'sos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-300 hover:bg-rose-500/20'
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>SOS ({womenAlerts.length})</span>
          </button>
          <button
            onClick={() => setActiveLayerFilter('aid')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeLayerFilter === 'aid'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-emerald-300 hover:bg-emerald-500/20'
            }`}
          >
            <HeartHandshake className="w-3 h-3" />
            <span>Aid ({helpRequests.length})</span>
          </button>
          <button
            onClick={() => setActiveLayerFilter('wildfire')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              activeLayerFilter === 'wildfire'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-amber-300 hover:bg-amber-500/20'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Fire</span>
          </button>
        </div>

        {/* Map Mode & Radar Toggles */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Map Type Switcher */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 backdrop-blur-xl border border-white/10 shadow-2xl">
            <button
              onClick={() =>
                setMapType('roadmap' as unknown as google.maps.MapTypeId)
              }
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mapType === ('roadmap' as unknown as google.maps.MapTypeId)
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Default
            </button>
            <button
              onClick={() =>
                setMapType('satellite' as unknown as google.maps.MapTypeId)
              }
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mapType === ('satellite' as unknown as google.maps.MapTypeId)
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() =>
                setMapType('hybrid' as unknown as google.maps.MapTypeId)
              }
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mapType === ('hybrid' as unknown as google.maps.MapTypeId)
                  ? 'bg-white/20 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Hybrid
            </button>
          </div>

          {/* 5km Radar Toggle */}
          <button
            onClick={() => setShow5kmRadar(!show5kmRadar)}
            className={`p-2.5 rounded-2xl border backdrop-blur-xl shadow-2xl transition-all ${
              show5kmRadar
                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                : 'bg-slate-950/80 text-slate-400 border-white/10 hover:text-white'
            }`}
            title="Toggle 5km Radar Zone"
          >
            <Radar className="w-4 h-4" />
          </button>

          {/* Recenter */}
          <button
            onClick={handleRecenter}
            className="p-2.5 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-white/10 backdrop-blur-xl shadow-2xl transition-all"
            title="Recenter Map to My Coordinates"
          >
            <Crosshair className="w-4 h-4" />
          </button>

          {/* Switch to Leaflet fallback if user prefers */}
          {onSwitchToLeaflet && (
            <button
              onClick={onSwitchToLeaflet}
              className="px-3 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-300 border border-white/10 backdrop-blur-xl shadow-2xl text-xs font-bold transition-all"
              title="Switch to Leaflet OpenStreetMap"
            >
              OSM Map
            </button>
          )}
        </div>
      </div>

      {/* Floating Bottom Broadcast / Action Trigger */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none z-10">
        <div className="p-2.5 rounded-2xl bg-slate-950/90 backdrop-blur-xl border border-white/10 text-xs text-slate-300 pointer-events-auto flex items-center gap-2 shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-white">Google Maps Platform Active</span>
          <span className="text-slate-400">|</span>
          <span>{userAddress}</span>
        </div>

        {onOpenBroadcastModal && (
          <button
            onClick={onOpenBroadcastModal}
            className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-2xl border border-rose-400/40 pointer-events-auto flex items-center gap-2 transition-all"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            <span>Send 5km Signal</span>
          </button>
        )}
      </div>

      {/* Action Notification Toast */}
      {actionSuccess && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl bg-emerald-500 text-slate-950 font-black text-xs shadow-2xl z-50 animate-bounce">
          {actionSuccess}
        </div>
      )}
    </div>
  );
};
