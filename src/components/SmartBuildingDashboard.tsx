import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { 
  Thermometer, 
  Lightbulb, 
  Shield, 
  Zap, 
  Droplets, 
  Wind, 
  Camera, 
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle,
  Activity,
  Users,
  Car,
  Wifi,
  Battery,
  Settings,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff
} from 'lucide-react';

interface Device {
  id: string;
  nameKey: string;
  type: 'lighting' | 'hvac' | 'security' | 'energy' | 'water' | 'access';
  status: 'online' | 'offline' | 'maintenance';
  value: number;
  unit: string;
  locationKey: string;
  lastUpdate: string;
  isActive: boolean;
  baseValue: number;
  trend: 'up' | 'down' | 'stable';
}

interface SecurityEvent {
  id: string;
  type: 'access' | 'alarm' | 'camera' | 'door';
  messageKey: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high';
  locationKey: string;
}

interface EnergyData {
  timestamp: string;
  consumption: number;
  production: number;
  cost: number;
}

const SmartBuildingDashboard = () => {
  const { t } = useLanguage();
  const [selectedFloor, setSelectedFloor] = useState('1');
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [temperatureTarget, setTemperatureTarget] = useState([22]);
  const [lightingLevel, setLightingLevel] = useState([75]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [occupancyCount, setOccupancyCount] = useState(342);
  const [energyEfficiency, setEnergyEfficiency] = useState(87);

  // Enhanced IoT devices data with real-time simulation
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      nameKey: 'smartBuilding.devices.mainLobbyTemperature',
      type: 'hvac',
      status: 'online',
      value: 22.5,
      baseValue: 22.5,
      unit: '°C',
      locationKey: 'smartBuilding.locations.floor1Lobby',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'stable'
    },
    {
      id: '2',
      nameKey: 'smartBuilding.devices.conferenceRoomLights',
      type: 'lighting',
      status: 'online',
      value: 85,
      baseValue: 85,
      unit: '%',
      locationKey: 'smartBuilding.locations.floor2ConferenceRoomA',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'stable'
    },
    {
      id: '3',
      nameKey: 'smartBuilding.devices.mainEntranceCamera',
      type: 'security',
      status: 'online',
      value: 100,
      baseValue: 100,
      unit: '%',
      locationKey: 'smartBuilding.locations.floor1MainEntrance',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'stable'
    },
    {
      id: '4',
      nameKey: 'smartBuilding.devices.solarPanelSystem',
      type: 'energy',
      status: 'online',
      value: 12.5,
      baseValue: 12.5,
      unit: 'kW',
      locationKey: 'smartBuilding.locations.rooftop',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'up'
    },
    {
      id: '5',
      nameKey: 'smartBuilding.devices.waterFlowSensor',
      type: 'water',
      status: 'online',
      value: 45.2,
      baseValue: 45.2,
      unit: 'L/min',
      locationKey: 'smartBuilding.locations.floor3Utilities',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'stable'
    },
    {
      id: '6',
      nameKey: 'smartBuilding.devices.executiveAccessControl',
      type: 'access',
      status: 'online',
      value: 1,
      baseValue: 1,
      unit: t('smartBuilding.status.active') || 'active',
      locationKey: 'smartBuilding.locations.floor5ExecutiveSuite',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'stable'
    },
    {
      id: '7',
      nameKey: 'smartBuilding.devices.parkingGarageLights',
      type: 'lighting',
      status: 'online',
      value: 60,
      baseValue: 60,
      unit: '%',
      locationKey: 'smartBuilding.locations.basementParking',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'stable'
    },
    {
      id: '8',
      nameKey: 'smartBuilding.devices.rooftopWindSensor',
      type: 'hvac',
      status: 'online',
      value: 15.3,
      baseValue: 15.3,
      unit: 'km/h',
      locationKey: 'smartBuilding.locations.rooftop',
      lastUpdate: t('smartBuilding.justNow') || 'Just now',
      isActive: true,
      trend: 'up'
    }
  ]);

  // Dynamic security events
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([
    {
      id: '1',
      type: 'access',
      messageKey: 'smartBuilding.securityMessages.authorizedAccess',
      timestamp: '10:30 AM',
      severity: 'low',
      locationKey: 'smartBuilding.locations.floor5'
    },
    {
      id: '2',
      type: 'camera',
      messageKey: 'smartBuilding.securityMessages.motionDetectedCorridor',
      timestamp: '10:25 AM',
      severity: 'medium',
      locationKey: 'smartBuilding.locations.basement'
    },
    {
      id: '3',
      type: 'door',
      messageKey: 'smartBuilding.securityMessages.emergencyExitAccessed',
      timestamp: '10:20 AM',
      severity: 'high',
      locationKey: 'smartBuilding.locations.floor3'
    }
  ]);

  // Dynamic energy data
  const [energyData, setEnergyData] = useState<EnergyData[]>([
    { timestamp: '08:00', consumption: 45, production: 12, cost: 15.2 },
    { timestamp: '09:00', consumption: 52, production: 18, cost: 18.5 },
    { timestamp: '10:00', consumption: 48, production: 22, cost: 16.8 },
    { timestamp: '11:00', consumption: 55, production: 25, cost: 19.2 }
  ]);

  // Real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Update device values with realistic fluctuations
      setDevices(prevDevices => 
        prevDevices.map(device => {
          let newValue = device.value;
          let newTrend = device.trend;
          
          switch (device.type) {
            case 'hvac':
              // Temperature fluctuates ±2°C from base
              const tempVariation = (Math.random() - 0.5) * 0.5;
              newValue = Math.max(18, Math.min(28, device.baseValue + tempVariation));
              newTrend = newValue > device.value ? 'up' : newValue < device.value ? 'down' : 'stable';
              break;
              
            case 'lighting':
              // Lighting varies ±10% from base
              const lightVariation = (Math.random() - 0.5) * 10;
              newValue = Math.max(0, Math.min(100, device.baseValue + lightVariation));
              break;
              
            case 'energy':
              // Solar energy varies with time of day simulation
              const hour = new Date().getHours();
              const solarMultiplier = hour >= 6 && hour <= 18 ? 
                Math.sin((hour - 6) * Math.PI / 12) : 0;
              newValue = Math.max(0, device.baseValue * solarMultiplier + Math.random() * 5);
              newTrend = newValue > device.value ? 'up' : newValue < device.value ? 'down' : 'stable';
              break;
              
            case 'water':
              // Water flow varies ±20% from base
              const waterVariation = (Math.random() - 0.5) * 20;
              newValue = Math.max(0, device.baseValue + waterVariation);
              break;
              
            case 'security':
              // Security cameras occasionally go to 95-100%
              newValue = Math.random() > 0.1 ? 100 : 95 + Math.random() * 5;
              break;
              
            default:
              newValue = device.value;
          }
          
          return {
            ...device,
            value: Math.round(newValue * 10) / 10,
            trend: newTrend,
            lastUpdate: t('smartBuilding.justNow') || 'Just now'
          };
        })
      );

      // Randomly update occupancy
      if (Math.random() > 0.7) {
        setOccupancyCount(prev => Math.max(200, Math.min(500, prev + Math.floor((Math.random() - 0.5) * 20))));
      }

      // Update energy efficiency
      if (Math.random() > 0.8) {
        setEnergyEfficiency(prev => Math.max(70, Math.min(95, prev + Math.floor((Math.random() - 0.5) * 5))));
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [t]);

  // Generate new security events periodically
  useEffect(() => {
    const eventInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const eventTypes = ['access', 'camera', 'door', 'alarm'] as const;
        const severities = ['low', 'medium', 'high'] as const;
        const locationKeys = [
          'smartBuilding.locations.floor1',
          'smartBuilding.locations.floor2',
          'smartBuilding.locations.floor3',
          'smartBuilding.locations.floor4',
          'smartBuilding.locations.floor5',
          'smartBuilding.locations.basement',
          'smartBuilding.locations.rooftop'
        ];
        
        const messageKeys = {
          access: [
            'smartBuilding.securityMessages.authorizedAccess',
            'smartBuilding.securityMessages.badgeScanSuccessful',
            'smartBuilding.securityMessages.visitorAccessGranted',
            'smartBuilding.securityMessages.afterHoursAccess'
          ],
          camera: [
            'smartBuilding.securityMessages.motionDetectedCorridor',
            'smartBuilding.securityMessages.unusualActivity',
            'smartBuilding.securityMessages.personInRestrictedArea',
            'smartBuilding.securityMessages.cameraFeedRestored'
          ],
          door: [
            'smartBuilding.securityMessages.doorLeftOpen',
            'smartBuilding.securityMessages.emergencyExitAccessed',
            'smartBuilding.securityMessages.unauthorizedDoorOpening',
            'smartBuilding.securityMessages.doorSensorTriggered'
          ],
          alarm: [
            'smartBuilding.securityMessages.fireAlarmTest',
            'smartBuilding.securityMessages.securityAlarmTriggered',
            'smartBuilding.securityMessages.smokeDetectorActivated',
            'smartBuilding.securityMessages.systemMaintenanceAlert'
          ]
        };

        const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
        const newEvent: SecurityEvent = {
          id: Date.now().toString(),
          type: eventType,
          messageKey: messageKeys[eventType][Math.floor(Math.random() * messageKeys[eventType].length)],
          timestamp: currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          severity: severities[Math.floor(Math.random() * severities.length)],
          locationKey: locationKeys[Math.floor(Math.random() * locationKeys.length)]
        };

        setSecurityEvents(prev => [newEvent, ...prev.slice(0, 9)]); // Keep only last 10 events
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(eventInterval);
  }, [currentTime, t]);

  // Update energy data periodically
  useEffect(() => {
    const energyInterval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setEnergyData(prev => {
        const newData: EnergyData = {
          timestamp: timeString,
          consumption: 40 + Math.random() * 30,
          production: Math.max(0, 10 + Math.random() * 20),
          cost: 12 + Math.random() * 15
        };
        
        return [newData, ...prev.slice(0, 11)]; // Keep last 12 entries
      });
    }, 30000); // Update every 30 seconds

    return () => clearInterval(energyInterval);
  }, []);

  const toggleDevice = (deviceId: string) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, isActive: !device.isActive }
        : device
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-600';
      case 'offline': return 'bg-red-600';
      case 'maintenance': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-600';
      case 'medium': return 'bg-yellow-600';
      case 'high': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'hvac': return <Thermometer className="w-5 h-5" />;
      case 'lighting': return <Lightbulb className="w-5 h-5" />;
      case 'security': return <Camera className="w-5 h-5" />;
      case 'energy': return <Zap className="w-5 h-5" />;
      case 'water': return <Droplets className="w-5 h-5" />;
      case 'access': return <Lock className="w-5 h-5" />;
      default: return <Settings className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-gray-400" />;
    }
  };

  const activateEmergencyMode = () => {
    setIsEmergencyMode(true);
    // In emergency mode, turn on all lights, unlock emergency exits, etc.
    setDevices(devices.map(device => ({
      ...device,
      isActive: device.type === 'lighting' || device.type === 'access' ? true : device.isActive
    })));
  };

  const deactivateEmergencyMode = () => {
    setIsEmergencyMode(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-400" />
              {t('smartBuilding.title') || 'Smart Building IoT Dashboard'}
              <div className="flex items-center gap-2 ml-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-lg text-green-400">{t('smartBuilding.live') || 'LIVE'}</span>
              </div>
            </h1>
            <p className="text-xl text-gray-300">
              {t('smartBuilding.subtitle') || 'Real-time monitoring and control of building systems'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {t('smartBuilding.lastUpdated') || 'Last updated'}: {currentTime.toLocaleTimeString()}
            </p>
          </div>
          
          {/* Emergency Mode Toggle */}
          <div className="flex items-center gap-4">
            <Badge 
              variant="secondary" 
              className={`${isEmergencyMode ? 'bg-red-600 text-white animate-pulse' : 'bg-green-600 text-white'} px-4 py-2`}
            >
              {isEmergencyMode ? `🚨 ${t('smartBuilding.emergencyMode') || 'EMERGENCY MODE'}` : `✅ ${t('smartBuilding.normalMode') || 'NORMAL MODE'}`}
            </Badge>
            <Button
              onClick={isEmergencyMode ? deactivateEmergencyMode : activateEmergencyMode}
              className={`${isEmergencyMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white`}
            >
              {isEmergencyMode ? (t('smartBuilding.deactivateEmergency') || 'Deactivate Emergency') : (t('smartBuilding.activateEmergency') || 'Emergency Mode')}
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-green-600 to-green-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-100">{t('smartBuilding.devicesOnline') || 'Devices Online'}</p>
                  <p className="text-3xl font-bold">
                    {devices.filter(d => d.status === 'online').length}/{devices.length}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-100">{t('smartBuilding.energyEfficiency') || 'Energy Efficiency'}</p>
                  <p className="text-3xl font-bold">{energyEfficiency}%</p>
                </div>
                <Zap className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-100">{t('smartBuilding.securityStatus') || 'Security Status'}</p>
                  <p className="text-3xl font-bold">{t('smartBuilding.secure') || 'Secure'}</p>
                </div>
                <Shield className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600 to-orange-700 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-100">{t('smartBuilding.occupancy') || 'Occupancy'}</p>
                  <p className="text-3xl font-bold">{occupancyCount}</p>
                </div>
                <Users className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="devices" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-md">
            <TabsTrigger value="devices" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
              {t('smartBuilding.deviceControl') || 'Device Control'}
            </TabsTrigger>
            <TabsTrigger value="climate" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
              {t('smartBuilding.climateControl') || 'Climate Control'}
            </TabsTrigger>
            <TabsTrigger value="security" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
              {t('smartBuilding.security') || 'Security'}
            </TabsTrigger>
            <TabsTrigger value="energy" className="text-white data-[state=active]:bg-white data-[state=active]:text-gray-900">
              {t('smartBuilding.energyManagement') || 'Energy Management'}
            </TabsTrigger>
          </TabsList>

          {/* Device Control Tab */}
          <TabsContent value="devices" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <Card key={device.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getDeviceIcon(device.type)}
                        <CardTitle className="text-white text-sm">{t(device.nameKey) || device.nameKey}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(device.status)} ${device.status === 'online' ? 'animate-pulse' : ''}`} />
                        <Switch
                          checked={device.isActive}
                          onCheckedChange={() => toggleDevice(device.id)}
                        />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-white">
                            {device.value} {device.unit}
                          </span>
                          {getTrendIcon(device.trend)}
                        </div>
                        <Badge variant="secondary" className="bg-white/20 text-white">
                          {t(`smartBuilding.status.${device.status}`) || device.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-300">
                        <p>{t(device.locationKey) || device.locationKey}</p>
                        <p>{t('smartBuilding.lastUpdate') || 'Last update'}: {device.lastUpdate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Climate Control Tab */}
          <TabsContent value="climate" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Thermometer className="w-5 h-5" />
                    {t('smartBuilding.temperatureControl') || 'Temperature Control'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {temperatureTarget[0]}°C
                    </div>
                    <p className="text-gray-300">{t('smartBuilding.targetTemperature') || 'Target Temperature'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm">{t('smartBuilding.adjustTemperature') || 'Adjust Temperature'}</label>
                    <Slider
                      value={temperatureTarget}
                      onValueChange={setTemperatureTarget}
                      max={30}
                      min={16}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>16°C</span>
                      <span>30°C</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-300">{t('smartBuilding.current') || 'Current'}</p>
                      <p className="text-xl font-bold text-white">
                        {devices.find(d => d.type === 'hvac')?.value || 22.5}°C
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-300">{t('smartBuilding.humidity') || 'Humidity'}</p>
                      <p className="text-xl font-bold text-white">
                        {Math.floor(40 + Math.random() * 20)}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Lightbulb className="w-5 h-5" />
                    {t('smartBuilding.lightingControl') || 'Lighting Control'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white mb-2">
                      {lightingLevel[0]}%
                    </div>
                    <p className="text-gray-300">{t('smartBuilding.lightingLevel') || 'Lighting Level'}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white text-sm">{t('smartBuilding.adjustBrightness') || 'Adjust Brightness'}</label>
                    <Slider
                      value={lightingLevel}
                      onValueChange={setLightingLevel}
                      max={100}
                      min={0}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>0%</span>
                      <span>100%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white/20"
                      onClick={() => setLightingLevel([30])}
                    >
                      {t('smartBuilding.dim') || 'Dim'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white/20"
                      onClick={() => setLightingLevel([75])}
                    >
                      {t('smartBuilding.normal') || 'Normal'}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-white border-white/20"
                      onClick={() => setLightingLevel([100])}
                    >
                      {t('smartBuilding.bright') || 'Bright'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    {t('smartBuilding.securityEvents') || 'Security Events'}
                    <Badge variant="secondary" className="bg-blue-600 text-white ml-2">
                      {securityEvents.length} {t('smartBuilding.events') || 'Events'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className={`w-3 h-3 rounded-full mt-2 ${getSeverityColor(event.severity)} ${event.severity === 'high' ? 'animate-pulse' : ''}`} />
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{t(event.messageKey) || event.messageKey}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-gray-300">{t(event.locationKey) || event.locationKey}</span>
                            <span className="text-xs text-gray-300">{event.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    {t('smartBuilding.accessControl') || 'Access Control'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Unlock className="w-4 h-4 mr-2" />
                      {t('smartBuilding.unlockAll') || 'Unlock All'}
                    </Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      <Lock className="w-4 h-4 mr-2" />
                      {t('smartBuilding.lockAll') || 'Lock All'}
                    </Button>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white text-sm">{t('smartBuilding.mainEntrance') || 'Main Entrance'}</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">{t('smartBuilding.unlocked') || 'Unlocked'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white text-sm">{t('smartBuilding.executiveSuite') || 'Executive Suite'}</span>
                      <Badge variant="secondary" className="bg-red-600 text-white">{t('smartBuilding.locked') || 'Locked'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white text-sm">{t('smartBuilding.emergencyExits') || 'Emergency Exits'}</span>
                      <Badge variant="secondary" className="bg-green-600 text-white">{t('smartBuilding.unlocked') || 'Unlocked'}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/5 rounded">
                      <span className="text-white text-sm">{t('smartBuilding.serverRoom') || 'Server Room'}</span>
                      <Badge variant="secondary" className="bg-red-600 text-white">{t('smartBuilding.locked') || 'Locked'}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Energy Management Tab */}
          <TabsContent value="energy" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    {t('smartBuilding.energyConsumption') || 'Energy Consumption'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-white">
                        {energyData[0]?.consumption.toFixed(1) || '52.3'} kW
                      </div>
                      <p className="text-gray-300">{t('smartBuilding.currentUsage') || 'Current Usage'}</p>
                    </div>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {energyData.slice(0, 8).map((data, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-white/5 rounded">
                          <span className="text-white text-sm">{data.timestamp}</span>
                          <div className="flex gap-4 text-sm">
                            <span className="text-red-300">{data.consumption.toFixed(1)}kW</span>
                            <span className="text-green-300">+{data.production.toFixed(1)}kW</span>
                            <span className="text-yellow-300">${data.cost.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Battery className="w-5 h-5" />
                    {t('smartBuilding.solarProduction') || 'Solar Production'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white">
                      {devices.find(d => d.type === 'energy')?.value.toFixed(1) || '25.8'} kW
                    </div>
                    <p className="text-gray-300">{t('smartBuilding.currentProduction') || 'Current Production'}</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white text-sm">{t('smartBuilding.efficiency') || 'Efficiency'}</span>
                      <span className="text-green-300 font-bold">{energyEfficiency}%</span>
                    </div>
                    <Progress value={energyEfficiency} className="h-2" />
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-gray-300">{t('smartBuilding.today') || 'Today'}</p>
                        <p className="text-lg font-bold text-white">
                          {Math.floor(200 + Math.random() * 100)} kWh
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-300">{t('smartBuilding.thisMonth') || 'This Month'}</p>
                        <p className="text-lg font-bold text-white">
                          {(7 + Math.random() * 3).toFixed(1)} MWh
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SmartBuildingDashboard; 