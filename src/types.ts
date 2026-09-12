export type DisasterCategory =
  | 'wildfire'
  | 'flood'
  | 'landslide'
  | 'earthquake'
  | 'storm'
  | 'women_safety'
  | 'medical_emergency'
  | 'other';

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';

export type AlertStatus = 'active' | 'monitoring' | 'contained' | 'resolved';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  phoneNumber?: string;
  role?: 'resident' | 'volunteer' | 'coordinator' | 'medical';
  isAdmin?: boolean;
  isMasterAdmin?: boolean;
  photoURL?: string;
  joinedAt?: string;
  bio?: string;
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bloodGroup?: string;
  verifiedEmail?: boolean;
}

export interface SystemAdmin {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'master_admin' | 'appointed_admin';
  password?: string;
  addedBy?: string;
  addedAt?: string;
}

export interface DisasterAlert {
  id: string;
  title: string;
  category: DisasterCategory;
  severity: SeverityLevel;
  status: AlertStatus;
  locationName: string;
  coordinates: Coordinates;
  radiusMeters: number;
  affectedPopulation: number;
  timestamp: string;
  verifiedCount: number;
  source: string;
  description: string;
  userId?: string;
  authorEmail?: string;
  authorName?: string;
  hazardMetrics?: {
    temperatureC?: number;
    windSpeedKmh?: number;
    windDirection?: string;
    humidityPct?: number;
    riverLevelMeters?: number;
    riverThresholdMeters?: number;
    seismicMagnitude?: number;
    soilSaturationPct?: number;
    aqiIndex?: number;
  };
  recommendedActions: string[];
  evacuationRoutes?: string[];
}

export interface WomenSafetyAlert {
  id: string;
  userId: string;
  authorEmail?: string;
  authorName?: string;
  authorPhone?: string;
  codeName: string;
  status: 'active_sos' | 'responder_en_route' | 'safe_resolved' | 'discreet_watch';
  coordinates: Coordinates;
  addressApprox: string;
  timestamp: string;
  emergencyContactsNotified: number;
  nearbyRespondersPledged: number;
  notes?: string;
  audioBeaconActive: boolean;
  batteryLevel?: number;
  matchedGuardian?: {
    name: string;
    distanceMeters: number;
    etaMinutes: number;
    phoneMasked: string;
  };
}

export type AidCategory =
  | 'shelter'
  | 'manpower'
  | 'food_water'
  | 'clothing'
  | 'medical'
  | 'power_transport'
  | 'wildfire_evac';

export type AidUrgency = 'immediate_life_threat' | 'within_2_hours' | 'today' | 'within_48_hours';

export interface HelpRequest {
  id: string;
  userId?: string;
  authorEmail?: string;
  requesterName: string;
  phoneMasked: string;
  locationName: string;
  coordinates: Coordinates;
  category: AidCategory;
  subCategory: string;
  urgency: AidUrgency;
  peopleCount: number;
  description: string;
  specialNeeds: string[];
  status: 'open' | 'matched' | 'in_progress' | 'fulfilled';
  createdAt: string;
  offersCount: number;
  matchedVolunteer?: {
    id: string;
    name: string;
    phoneMasked: string;
    etaMinutes: number;
    skill: string;
  };
}

export interface VolunteerOffer {
  id: string;
  userId?: string;
  authorEmail?: string;
  volunteerName: string;
  phoneMasked: string;
  roleSkills: string[];
  coordinates: Coordinates;
  locationName: string;
  radiusCoveredKm: number;
  capacityDetails: string;
  isAvailable: boolean;
  verifiedStatus: boolean;
  missionsCompleted: number;
  joinedDate: string;
}

export interface SafeHavenPoint {
  id: string;
  name: string;
  type: 'verified_shelter' | 'community_safe_haven' | 'medical_point' | 'water_distribution' | 'firebreak_station';
  coordinates: Coordinates;
  capacityTotal: number;
  capacityOccupied: number;
  amenities: string[];
  isOpen: boolean;
  contactPhone: string;
  address: string;
}

export interface CommunityReport {
  id: string;
  userId?: string;
  authorEmail?: string;
  authorName: string;
  category: DisasterCategory;
  title: string;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  severity: SeverityLevel;
  timestamp: string;
  upvotes: number;
  downvotes: number;
  userVoted?: 'up' | 'down';
  verifiedByGuardians: boolean;
  imageUrl?: string;
  aiHazardAnalysis?: {
    riskScore: number;
    primaryHazards: string[];
    recommendedActions: string[];
  };
}

export type WeatherHazardType =
  | 'flood'
  | 'landslide'
  | 'storm'
  | 'heatwave'
  | 'wildfire_weather'
  | 'freeze_frost'
  | 'dense_fog'
  | 'air_quality';

export interface WeatherCondition {
  label: string;
  icon: string;
  code: string;
}

export interface CurrentWeatherState {
  temperatureC: number;
  temperatureF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  condition: string;
  conditionIcon: string;
  conditionDescription: string;
  humidityPct: number;
  windSpeedKmh: number;
  windGustKmh: number;
  windDirection: string;
  barometricPressureHpa: number;
  pressureTrend: 'rising' | 'falling' | 'steady';
  uvIndex: number;
  aqiIndex: number;
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy for Sensitive' | 'Unhealthy' | 'Hazardous';
  visibilityKm: number;
  dewPointC: number;
  cloudCoverPct: number;
  precipitationProbability: number;
  precipitationMm: number;
  // Risk Indices (0-100)
  floodRiskIndex: number;
  landslideRiskIndex: number;
  fireWeatherIndex: number;
  heatStressIndex: number;
  stormSeverityIndex: number;
  sunrise: string;
  sunset: string;
  lastUpdated: string;
  locationName: string;
}

export interface HourlyWeatherForecast {
  time: string;
  tempC: number;
  tempF: number;
  condition: string;
  conditionIcon: string;
  rainProbability: number;
  rainVolumeMm: number;
  windSpeedKmh: number;
  windGustKmh: number;
  hazardLevel: 'normal' | 'caution' | 'warning' | 'danger';
}

export interface DailyWeatherForecast {
  dayName: string;
  dateStr: string;
  tempMaxC: number;
  tempMaxF: number;
  tempMinC: number;
  tempMinF: number;
  condition: string;
  conditionIcon: string;
  precipitationProb: number;
  precipitationTotalMm: number;
  windSpeedMaxKmh: number;
  uvMax: number;
  aqiMax: number;
  hazardType?: WeatherHazardType;
  hazardSeverity?: 'low' | 'moderate' | 'high' | 'critical';
  hazardHeadline?: string;
  actionAdvice?: string;
}

export interface ClimateTrendInsight {
  metric: string;
  currentValue: string;
  historicalBaseline: string;
  anomalyDiff: string;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  riskInterpretation: string;
  climateImpactCategory: 'precipitation_flooding' | 'wildfire_drought' | 'extreme_heat' | 'storm_surges';
}

export interface WeatherChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  personaUsed?: 'general' | 'farmer' | 'fisherman' | 'commuter' | 'trekker' | 'sdma' | 'rural';
  language?: string;
  voiceNoteDuration?: string;
  waveHeightM?: number;
  isWeatherAlert?: boolean;
  structuredHazard?: {
    hazardType: WeatherHazardType;
    severity: 'advisory' | 'watch' | 'warning' | 'emergency';
    riskScore: number;
    recommendedActions: string[];
    affectedRadiusKm: number;
    communityAidTriggers?: string[];
  };
  audioPlaying?: boolean;
}

export interface WeatherAlertNotice {
  id: string;
  type: WeatherHazardType;
  severity: 'advisory' | 'watch' | 'warning' | 'emergency';
  title: string;
  headline: string;
  affectedZone: string;
  startTime: string;
  expiresTime: string;
  description: string;
  safetyInstructions: string[];
  recommendedAidCategories: AidCategory[];
  verifiedVolunteersCount: number;
}

// ==========================================
// SIH 26068: NWP (Numerical Weather Prediction)
// ==========================================
export interface NWPModelPoint {
  time: string;
  timeLabel: string;
  tempC_gfs: number;
  tempC_ecmwf: number;
  tempC_icon: number;
  tempC_wrf_downscaled: number;
  precipMm_gfs: number;
  precipMm_ecmwf: number;
  precipMm_icon: number;
  precipMm_wrf_downscaled: number;
  windKmh_gfs: number;
  windKmh_ecmwf: number;
  windKmh_icon: number;
  cape_gfs: number;
  cape_ecmwf: number;
  liftedIndex_gfs: number;
  agreementPct: number;
}

export interface NWPModelComparisonData {
  locationName: string;
  coordinates: Coordinates;
  generatedAt: string;
  resolutionInfo: string;
  soundingAnalysis: {
    capeJkg: number;
    liftedIndex: number;
    convectiveInhibitionCin: number;
    pblHeightMeters: number;
    stormPotential: 'low' | 'marginal' | 'slight' | 'enhanced' | 'severe';
    interpretation: string;
  };
  ensembleSpread: {
    tempSpreadC: number;
    precipSpreadMm: number;
    modelConsensus: string;
    confidenceRating: 'High (85%+)' | 'Moderate (65-85%)' | 'Divergent (<65%)';
  };
  models: {
    gfs: { name: string; run: string; agency: string; gridRes: string };
    ecmwf: { name: string; run: string; agency: string; gridRes: string };
    icon: { name: string; run: string; agency: string; gridRes: string };
    wrf: { name: string; run: string; agency: string; gridRes: string };
  };
  timeline: NWPModelPoint[];
}

// ==========================================
// SIH 26068: Agro-Meteorological Advisory (Kisan)
// ==========================================
export interface CropAdvisory {
  cropName: string;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Annual';
  currentStage: string;
  idealTempRange: string;
  waterRequirement: string;
  suitabilityRating: 'optimal' | 'favorable' | 'moderate' | 'stress';
  advisoryNote: string;
  pestDiseaseRisk: {
    pestName: string;
    riskLevel: 'low' | 'moderate' | 'high' | 'severe';
    triggerCondition: string;
    preventiveMeasure: string;
  };
}

export interface AgroAdvisoryData {
  locationName: string;
  coordinates: Coordinates;
  evapotranspirationEt0Mm: number;
  soilMoistureIndexPct: number;
  sprayWindowSuitability: {
    isFavorable: boolean;
    score: number;
    bestWindow: string;
    limitingFactor?: string;
  };
  irrigationAdvice: {
    needed: boolean;
    volumeMm: number;
    timing: string;
  };
  heatFrostStress: {
    status: 'none' | 'heat_stress' | 'cold_frost_risk';
    advice: string;
  };
  crops: CropAdvisory[];
}

// ==========================================
// SIH 26068: IMD 4-Stage Color Warning & CAP
// ==========================================
export type IMDColorCode = 'green' | 'yellow' | 'orange' | 'red';

export interface IMDColorAlert {
  id: string;
  colorCode: IMDColorCode;
  colorLabel: string;
  headline: string;
  hazardCategory: 'heavy_rainfall' | 'heatwave' | 'thunderstorm_lightning' | 'cyclone_surge' | 'dense_fog' | 'coldwave';
  affectedArea: string;
  validFrom: string;
  validTo: string;
  criteriaThresholdMet: string;
  capSeverity: 'Minor' | 'Moderate' | 'Severe' | 'Extreme';
  capUrgency: 'Past' | 'Future' | 'Expected' | 'Immediate';
  capCertainty: 'Unlikely' | 'Possible' | 'Likely' | 'Observed';
  instructions: string[];
  civilianMutualAidAction?: string;
}

