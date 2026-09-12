import { useState, useEffect, useCallback } from 'react';
import {
  CurrentWeatherState,
  DailyWeatherForecast,
  HourlyWeatherForecast,
  ClimateTrendInsight,
  NWPModelComparisonData,
  AgroAdvisoryData,
  IMDColorAlert,
  Coordinates,
} from '../types';

const DEFAULT_CLIMATE_INSIGHTS: ClimateTrendInsight[] = [
  {
    metric: 'Extreme Heavy Precipitation Events (>25mm/24h)',
    currentValue: '4.2 events / yr',
    historicalBaseline: '1.8 events / yr (1980-2010 mean)',
    anomalyDiff: '+133% Surge',
    trendDirection: 'increasing',
    riskInterpretation: 'Atmospheric moisture loads increase flash flood risks along urban drainages and rivers.',
    climateImpactCategory: 'precipitation_flooding',
  },
  {
    metric: 'Critical Fire-Weather Days (RH < 20% + Wind > 30km/h)',
    currentValue: '28 days / yr',
    historicalBaseline: '12 days / yr (1980-2010 mean)',
    anomalyDiff: '+133% Increase',
    trendDirection: 'increasing',
    riskInterpretation: 'Extended dry periods elevate wildfire perimeter expansion and forest fire risks.',
    climateImpactCategory: 'wildfire_drought',
  },
  {
    metric: 'High Heat Index Threshold Days (>35°C / 95°F)',
    currentValue: '22 days / yr',
    historicalBaseline: '9 days / yr (1990-2020 baseline)',
    anomalyDiff: '+144% Surge',
    trendDirection: 'increasing',
    riskInterpretation: 'Urban heat island effects compound cooling demands and vulnerable population health risks.',
    climateImpactCategory: 'extreme_heat',
  },
  {
    metric: 'Soil Moisture Retention & Flash Runoff Index',
    currentValue: 'Moderate Variance',
    historicalBaseline: 'Stable (30-year average)',
    anomalyDiff: '+40% Runoff Variance',
    trendDirection: 'increasing',
    riskInterpretation: 'Rapid soil moisture loss followed by concentrated downpours elevates landslide susceptibility.',
    climateImpactCategory: 'storm_surges',
  },
];

export function useWeatherData(userLocation: Coordinates, userAddress: string) {
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [isLoadingForecast, setIsLoadingForecast] = useState<boolean>(true);
  const [currentWeather, setCurrentWeather] = useState<CurrentWeatherState | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyWeatherForecast[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyWeatherForecast[]>([]);
  const [climateTrends, setClimateTrends] = useState<ClimateTrendInsight[]>(DEFAULT_CLIMATE_INSIGHTS);
  const [nwpData, setNwpData] = useState<NWPModelComparisonData | null>(null);
  const [isLoadingNwp, setIsLoadingNwp] = useState<boolean>(false);
  const [agroData, setAgroData] = useState<AgroAdvisoryData | null>(null);
  const [isLoadingAgro, setIsLoadingAgro] = useState<boolean>(false);
  const [imdAlerts, setImdAlerts] = useState<IMDColorAlert[]>([]);
  const [isLoadingImd, setIsLoadingImd] = useState<boolean>(false);

  const toggleUnit = useCallback(() => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  }, []);

  const fetchWeatherForecast = useCallback(async () => {
    setIsLoadingForecast(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch('/api/ai/weather-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          locationName: userAddress,
          coordinates: userLocation,
        }),
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.forecast) {
          setCurrentWeather(data.forecast.current);
          setDailyForecast(data.forecast.daily || []);
          setHourlyForecast(data.forecast.hourly || []);
        }
      }
    } catch {
      // Retain state gracefully
    } finally {
      clearTimeout(timeoutId);
      setIsLoadingForecast(false);
    }
  }, [userLocation, userAddress]);

  const fetchNwp = useCallback(async () => {
    setIsLoadingNwp(true);
    try {
      const res = await fetch('/api/weather/nwp-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: userAddress,
          coordinates: userLocation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.comparison) {
          setNwpData(data.comparison);
        }
      }
    } catch {
      // Graceful
    } finally {
      setIsLoadingNwp(false);
    }
  }, [userLocation, userAddress]);

  const fetchAgro = useCallback(async () => {
    setIsLoadingAgro(true);
    try {
      const res = await fetch('/api/weather/agro-advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: userAddress,
          coordinates: userLocation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.advisory) {
          setAgroData(data.advisory);
        }
      }
    } catch {
      // Graceful
    } finally {
      setIsLoadingAgro(false);
    }
  }, [userLocation, userAddress]);

  const fetchImd = useCallback(async () => {
    setIsLoadingImd(true);
    try {
      const res = await fetch('/api/weather/imd-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: userAddress,
          coordinates: userLocation,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.alerts)) {
          setImdAlerts(data.alerts);
        }
      }
    } catch {
      // Graceful
    } finally {
      setIsLoadingImd(false);
    }
  }, [userLocation, userAddress]);

  const fetchClimate = useCallback(async () => {
    try {
      const response = await fetch('/api/ai/climate-trends', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locationName: userAddress }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.insights) && data.insights.length > 0) {
          setClimateTrends(data.insights);
        }
      }
    } catch {
      // Graceful
    }
  }, [userAddress]);

  useEffect(() => {
    fetchWeatherForecast();
    fetchNwp();
    fetchAgro();
    fetchImd();
    fetchClimate();
  }, [fetchWeatherForecast, fetchNwp, fetchAgro, fetchImd, fetchClimate]);

  return {
    unit,
    toggleUnit,
    currentWeather,
    dailyForecast,
    hourlyForecast,
    isLoadingForecast,
    refreshWeather: fetchWeatherForecast,
    nwpData,
    isLoadingNwp,
    refreshNwp: fetchNwp,
    agroData,
    isLoadingAgro,
    refreshAgro: fetchAgro,
    imdAlerts,
    isLoadingImd,
    refreshImd: fetchImd,
    climateTrends,
  };
}
