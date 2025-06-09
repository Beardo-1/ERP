import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Eye, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import apiService, { WeatherData } from '../services/apiService';

interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
}

interface ProjectWeatherAlert {
  projectId: string;
  projectName: string;
  location: string;
  alertType: 'rain' | 'wind' | 'temperature' | 'humidity';
  severity: 'low' | 'medium' | 'high';
  message: string;
  impact: string;
}

const WeatherDashboard: React.FC = () => {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [selectedCity, setSelectedCity] = useState('Riyadh');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<ProjectWeatherAlert[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Saudi cities for construction projects
  const saudiCities = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 
    'Dhahran', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hail', 'Najran'
  ];

  // Sample project weather alerts
  const sampleAlerts: ProjectWeatherAlert[] = [
    {
      projectId: '1',
      projectName: 'Al-Noor Residential Complex',
      location: 'Riyadh',
      alertType: 'rain',
      severity: 'high',
      message: 'Heavy rain expected for next 3 days',
      impact: 'Concrete pouring and outdoor work should be postponed'
    },
    {
      projectId: '2',
      projectName: 'King Abdullah Business District',
      location: 'Jeddah',
      alertType: 'wind',
      severity: 'medium',
      message: 'Strong winds up to 45 km/h',
      impact: 'Crane operations may be affected'
    },
    {
      projectId: '3',
      projectName: 'Green Valley Villas',
      location: 'Dammam',
      alertType: 'temperature',
      severity: 'high',
      message: 'Extreme heat above 45°C',
      impact: 'Adjust working hours to early morning and evening'
    }
  ];

  // Sample 7-day forecast
  const sampleForecast: WeatherForecast[] = [
    {
      date: new Date().toISOString().split('T')[0],
      temperature: { min: 28, max: 42 },
      description: 'Sunny',
      humidity: 35,
      windSpeed: 12,
      precipitation: 0
    },
    {
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      temperature: { min: 30, max: 44 },
      description: 'Partly Cloudy',
      humidity: 40,
      windSpeed: 15,
      precipitation: 10
    },
    {
      date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      temperature: { min: 26, max: 38 },
      description: 'Thunderstorms',
      humidity: 65,
      windSpeed: 25,
      precipitation: 80
    },
    {
      date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      temperature: { min: 24, max: 35 },
      description: 'Rainy',
      humidity: 70,
      windSpeed: 20,
      precipitation: 90
    },
    {
      date: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
      temperature: { min: 27, max: 39 },
      description: 'Cloudy',
      humidity: 50,
      windSpeed: 18,
      precipitation: 20
    },
    {
      date: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      temperature: { min: 29, max: 41 },
      description: 'Sunny',
      humidity: 38,
      windSpeed: 14,
      precipitation: 5
    },
    {
      date: new Date(Date.now() + 6 * 86400000).toISOString().split('T')[0],
      temperature: { min: 31, max: 43 },
      description: 'Hot',
      humidity: 32,
      windSpeed: 10,
      precipitation: 0
    }
  ];

  useEffect(() => {
    fetchWeatherData();
    setForecast(sampleForecast);
    setWeatherAlerts(sampleAlerts);
  }, [selectedCity]);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiService.getWeatherData(selectedCity);
      
      if (result.success && result.data) {
        setCurrentWeather(result.data);
        setLastUpdated(new Date());
      } else {
        // Fallback to sample data if API fails
        setCurrentWeather({
          temperature: 38,
          humidity: 42,
          description: 'Clear Sky',
          windSpeed: 15,
          location: selectedCity
        });
        setLastUpdated(new Date());
        setError('Using sample data - API unavailable');
      }
    } catch (err) {
      setError('Failed to fetch weather data');
      // Fallback to sample data
      setCurrentWeather({
        temperature: 38,
        humidity: 42,
        description: 'Clear Sky',
        windSpeed: 15,
        location: selectedCity
      });
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('rain') || desc.includes('storm')) {
      return <CloudRain className="w-8 h-8 text-blue-500" />;
    } else if (desc.includes('cloud')) {
      return <Cloud className="w-8 h-8 text-gray-500" />;
    } else {
      return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-50 border-red-200 text-red-800';
      case 'medium': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'rain': return <CloudRain className="w-5 h-5" />;
      case 'wind': return <Wind className="w-5 h-5" />;
      case 'temperature': return <Thermometer className="w-5 h-5" />;
      case 'humidity': return <Droplets className="w-5 h-5" />;
      default: return <AlertTriangle className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Weather Dashboard</h2>
      <p>Construction project weather monitoring</p>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weather Dashboard</h2>
          <p className="text-gray-600">Construction project weather monitoring</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {saudiCities.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <button
            onClick={fetchWeatherData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
            <span className="text-yellow-800">{error}</span>
          </div>
        </div>
      )}

      {/* Current Weather */}
      {currentWeather && (
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-medium">{currentWeather.location}</span>
              </div>
              <div className="text-4xl font-bold mb-2">
                {Math.round(currentWeather.temperature)}°C
              </div>
              <p className="text-blue-100 capitalize">{currentWeather.description}</p>
              {lastUpdated && (
                <p className="text-blue-200 text-sm mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="text-right">
              {getWeatherIcon(currentWeather.description)}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  <span>{currentWeather.humidity}% Humidity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4" />
                  <span>{currentWeather.windSpeed} km/h Wind</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Weather Alerts</h3>
          <div className="space-y-4">
            {weatherAlerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getAlertColor(alert.severity)}`}
              >
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.alertType)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{alert.projectName}</h4>
                      <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-50">
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <p className="text-xs opacity-75">
                      <strong>Impact:</strong> {alert.impact}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs opacity-75">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7-Day Forecast */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Forecast</h3>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {forecast.map((day, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="text-sm font-medium text-gray-600 mb-2">
                {formatDate(day.date)}
              </div>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.description)}
              </div>
              <div className="text-sm text-gray-900 mb-2 capitalize">
                {day.description}
              </div>
              <div className="text-lg font-bold text-gray-900 mb-2">
                {day.temperature.max}°
              </div>
              <div className="text-sm text-gray-500 mb-3">
                {day.temperature.min}°
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Droplets className="w-3 h-3" />
                  <span>{day.precipitation}%</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <Wind className="w-3 h-3" />
                  <span>{day.windSpeed}km/h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Construction Impact Guidelines */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Construction Weather Guidelines</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <CloudRain className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">Rain/Storms</span>
            </div>
            <ul className="text-sm text-red-700 space-y-1">
              <li>• Stop concrete pouring</li>
              <li>• Cover materials</li>
              <li>• Halt electrical work</li>
              <li>• Secure loose items</li>
            </ul>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">High Winds</span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Limit crane operations</li>
              <li>• Secure scaffolding</li>
              <li>• Postpone roofing work</li>
              <li>• Check safety barriers</li>
            </ul>
          </div>
          
          <div className="p-4 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-800">Extreme Heat</span>
            </div>
            <ul className="text-sm text-orange-700 space-y-1">
              <li>• Adjust work hours</li>
              <li>• Increase water breaks</li>
              <li>• Monitor workers</li>
              <li>• Protect materials</li>
            </ul>
          </div>
          
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Low Visibility</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Reduce vehicle speed</li>
              <li>• Use additional lighting</li>
              <li>• Increase safety measures</li>
              <li>• Limit heavy machinery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard; 