import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move3D, 
  Eye,
  Users,
  Settings,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Camera,
  Video,
  Mic,
  MicOff,
  Share,
  Download,
  Upload,
  Globe,
  Building,
  Home,
  TreePine,
  Car,
  Palette,
  Sun,
  Moon,
  Cloud,
  Gamepad2
} from 'lucide-react';

interface Property3D {
  id: string;
  name: string;
  type: 'residential' | 'commercial' | 'industrial' | 'mixed';
  location: string;
  price: number;
  size: number;
  rooms?: number;
  floors: number;
  virtualTourUrl: string;
  thumbnailUrl: string;
  features: string[];
  isVRReady: boolean;
  lastUpdated: string;
}

interface Avatar {
  id: string;
  name: string;
  type: 'realistic' | 'cartoon' | 'robot' | 'custom';
  outfit: string;
  accessories: string[];
  position: { x: number; y: number; z: number };
  isActive: boolean;
}

interface VirtualEnvironment {
  id: string;
  name: string;
  type: 'city' | 'nature' | 'space' | 'underwater' | 'fantasy';
  lighting: 'day' | 'night' | 'sunset' | 'custom';
  weather: 'clear' | 'cloudy' | 'rainy' | 'snowy';
  ambientSound: boolean;
  backgroundMusic: boolean;
}

const MetaverseViewer = () => {
  const [selectedProperty, setSelectedProperty] = useState<Property3D | null>(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [viewerPosition, setViewerPosition] = useState({ x: 0, y: 0, z: 5 });
  const [cameraAngle, setCameraAngle] = useState([45]);
  const [zoomLevel, setZoomLevel] = useState([100]);
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);
  const [currentEnvironment, setCurrentEnvironment] = useState<VirtualEnvironment | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Mock 3D properties data
  const properties3D: Property3D[] = [
    {
      id: '1',
      name: 'Luxury Penthouse Suite',
      type: 'residential',
      location: 'Manhattan, NY',
      price: 5500000,
      size: 3500,
      rooms: 4,
      floors: 2,
      virtualTourUrl: '/tours/penthouse-manhattan',
      thumbnailUrl: '/api/placeholder/400/300',
      features: ['Ocean View', 'Smart Home', 'Private Elevator', 'Rooftop Terrace'],
      isVRReady: true,
      lastUpdated: '2024-01-15'
    },
    {
      id: '2',
      name: 'Modern Office Complex',
      type: 'commercial',
      location: 'Silicon Valley, CA',
      price: 12000000,
      size: 15000,
      floors: 8,
      virtualTourUrl: '/tours/office-silicon-valley',
      thumbnailUrl: '/api/placeholder/400/300',
      features: ['Tech Hub', 'Conference Centers', 'Parking Garage', 'Cafeteria'],
      isVRReady: true,
      lastUpdated: '2024-01-12'
    },
    {
      id: '3',
      name: 'Eco-Friendly Villa',
      type: 'residential',
      location: 'Malibu, CA',
      price: 8500000,
      size: 4200,
      rooms: 5,
      floors: 3,
      virtualTourUrl: '/tours/villa-malibu',
      thumbnailUrl: '/api/placeholder/400/300',
      features: ['Solar Panels', 'Garden', 'Pool', 'Guest House'],
      isVRReady: false,
      lastUpdated: '2024-01-10'
    }
  ];

  // Mock avatars
  const avatars: Avatar[] = [
    {
      id: '1',
      name: 'Professional Alex',
      type: 'realistic',
      outfit: 'Business Suit',
      accessories: ['Glasses', 'Watch'],
      position: { x: 0, y: 0, z: 0 },
      isActive: true
    },
    {
      id: '2',
      name: 'Casual Sam',
      type: 'cartoon',
      outfit: 'Casual Wear',
      accessories: ['Cap', 'Sneakers'],
      position: { x: 2, y: 0, z: 0 },
      isActive: false
    },
    {
      id: '3',
      name: 'Futuristic Bot',
      type: 'robot',
      outfit: 'Metallic Armor',
      accessories: ['LED Lights', 'Jetpack'],
      position: { x: -2, y: 0, z: 0 },
      isActive: false
    }
  ];

  // Mock environments
  const environments: VirtualEnvironment[] = [
    {
      id: '1',
      name: 'Urban Cityscape',
      type: 'city',
      lighting: 'day',
      weather: 'clear',
      ambientSound: true,
      backgroundMusic: false
    },
    {
      id: '2',
      name: 'Peaceful Forest',
      type: 'nature',
      lighting: 'sunset',
      weather: 'clear',
      ambientSound: true,
      backgroundMusic: true
    },
    {
      id: '3',
      name: 'Space Station',
      type: 'space',
      lighting: 'custom',
      weather: 'clear',
      ambientSound: false,
      backgroundMusic: true
    }
  ];

  const toggleVRMode = () => {
    setIsVRMode(!isVRMode);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen && viewerRef.current) {
      viewerRef.current.requestFullscreen();
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const startVirtualTour = (property: Property3D) => {
    setSelectedProperty(property);
    // Simulate starting virtual tour
    console.log(`Starting virtual tour for ${property.name}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'residential': return <Home className="h-5 w-5" />;
      case 'commercial': return <Building className="h-5 w-5" />;
      case 'industrial': return <Car className="h-5 w-5" />;
      case 'mixed': return <Globe className="h-5 w-5" />;
      default: return <Building className="h-5 w-5" />;
    }
  };

  const getEnvironmentIcon = (type: string) => {
    switch (type) {
      case 'city': return <Building className="h-5 w-5" />;
      case 'nature': return <TreePine className="h-5 w-5" />;
      case 'space': return <Globe className="h-5 w-5" />;
      case 'underwater': return <Cloud className="h-5 w-5" />;
      case 'fantasy': return <Palette className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Metaverse Property Viewer
            </h1>
            <p className="text-gray-300">
              Immersive 3D property exploration and virtual reality experiences
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Badge className={`${isVRMode ? 'bg-purple-600' : 'bg-gray-600'} text-white`}>
              {isVRMode ? 'VR Mode' : '3D Mode'}
            </Badge>
            <Button
              variant={isVRMode ? "default" : "outline"}
              onClick={toggleVRMode}
              className="text-white border-white/20"
            >
              {isVRMode ? 'Exit VR' : 'Enter VR'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main 3D Viewer */}
          <div className="lg:col-span-3">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 h-[600px]">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">
                    {selectedProperty ? selectedProperty.name : '3D Property Viewer'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-white border-white/20"
                    >
                      {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsMicOn(!isMicOn)}
                      className="text-white border-white/20"
                    >
                      {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`text-white border-white/20 ${isRecording ? 'bg-red-600' : ''}`}
                    >
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={toggleFullscreen}
                      className="text-white border-white/20"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-full">
                <div 
                  ref={viewerRef}
                  className="w-full h-full bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center relative overflow-hidden"
                >
                  {selectedProperty ? (
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Move3D className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">
                        Virtual Tour Active
                      </h3>
                      <p className="text-gray-300 mb-4">
                        Exploring {selectedProperty.name}
                      </p>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                          <Play className="h-4 w-4 mr-2" />
                          Play Tour
                        </Button>
                        <Button size="sm" variant="outline" className="text-white border-white/20">
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset View
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                        <Eye className="h-16 w-16 text-white" />
                      </div>
                      <h3 className="text-white text-xl font-semibold mb-2">
                        Select a Property
                      </h3>
                      <p className="text-gray-300">
                        Choose a property from the list to start your virtual tour
                      </p>
                    </div>
                  )}
                  
                  {/* 3D Controls Overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label className="text-white text-sm">Camera Angle</Label>
                          <Slider
                            value={cameraAngle}
                            onValueChange={setCameraAngle}
                            max={360}
                            min={0}
                            step={1}
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-sm">Zoom Level</Label>
                          <Slider
                            value={zoomLevel}
                            onValueChange={setZoomLevel}
                            max={200}
                            min={50}
                            step={5}
                            className="mt-2"
                          />
                        </div>
                        <div className="flex items-end gap-2">
                          <Button size="sm" variant="outline" className="text-white border-white/20">
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-white border-white/20">
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-white border-white/20">
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="properties" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-sm">
                <TabsTrigger value="properties" className="text-white text-xs">Properties</TabsTrigger>
                <TabsTrigger value="avatars" className="text-white text-xs">Avatars</TabsTrigger>
                <TabsTrigger value="settings" className="text-white text-xs">Settings</TabsTrigger>
              </TabsList>

              {/* Properties Tab */}
              <TabsContent value="properties">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Available Properties</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {properties3D.map((property) => (
                      <div
                        key={property.id}
                        className={`p-4 rounded-lg cursor-pointer transition-all ${
                          selectedProperty?.id === property.id
                            ? 'bg-purple-600/30 border border-purple-400'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => startVirtualTour(property)}
                      >
                        <div className="flex items-start gap-3">
                          {getPropertyIcon(property.type)}
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm">{property.name}</h4>
                            <p className="text-gray-400 text-xs">{property.location}</p>
                            <p className="text-green-400 font-semibold text-sm">
                              {formatCurrency(property.price)}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${property.isVRReady ? 'bg-green-600' : 'bg-gray-600'}`}
                              >
                                {property.isVRReady ? 'VR Ready' : '3D Only'}
                              </Badge>
                              <span className="text-gray-400 text-xs">
                                {property.size.toLocaleString()} sq ft
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Avatars Tab */}
              <TabsContent value="avatars">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Choose Avatar</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {avatars.map((avatar) => (
                      <div
                        key={avatar.id}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          selectedAvatar?.id === avatar.id
                            ? 'bg-purple-600/30 border border-purple-400'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                        onClick={() => setSelectedAvatar(avatar)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold text-sm">{avatar.name}</h4>
                            <p className="text-gray-400 text-xs">{avatar.outfit}</p>
                            <div className="flex gap-1 mt-1">
                              {avatar.accessories.map((accessory, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {accessory}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Environment Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white text-sm">Environment</Label>
                      <div className="space-y-2 mt-2">
                        {environments.map((env) => (
                          <div
                            key={env.id}
                            className={`p-2 rounded cursor-pointer transition-all ${
                              currentEnvironment?.id === env.id
                                ? 'bg-purple-600/30'
                                : 'bg-white/5 hover:bg-white/10'
                            }`}
                            onClick={() => setCurrentEnvironment(env)}
                          >
                            <div className="flex items-center gap-2">
                              {getEnvironmentIcon(env.type)}
                              <span className="text-white text-sm">{env.name}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-white text-sm">Ambient Sound</Label>
                        <Switch />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-white text-sm">Background Music</Label>
                        <Switch />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-white text-sm">Motion Controls</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex justify-between items-center">
                        <Label className="text-white text-sm">Hand Tracking</Label>
                        <Switch />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/20">
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700">
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                        <Button size="sm" variant="outline" className="text-white border-white/20">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Eye className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-gray-400 text-sm">Active Viewers</p>
                  <p className="text-white text-lg font-semibold">1,247</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Building className="h-6 w-6 text-green-400" />
                <div>
                  <p className="text-gray-400 text-sm">Properties Available</p>
                  <p className="text-white text-lg font-semibold">{properties3D.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Gamepad2 className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="text-gray-400 text-sm">VR Sessions</p>
                  <p className="text-white text-lg font-semibold">89</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-yellow-400" />
                <div>
                  <p className="text-gray-400 text-sm">Online Users</p>
                  <p className="text-white text-lg font-semibold">342</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MetaverseViewer;
