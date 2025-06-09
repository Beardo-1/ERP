import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { dataService, type Project as DataProject, type Agent as DataAgent } from '@/services/dataService';
import { 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  DollarSign, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  Users,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  MoreVertical,
  UserCheck,
  Download,
  Upload,
  RefreshCw,
  Cloud,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingButton, DataLoadingWrapper, SkeletonTable, LoadingSpinner } from '@/components/ui/loading';
import { EnhancedSearch } from '@/components/ui/enhanced-search';
import { PermissionGate, Permission } from '@/components/ui/role-based-ui';
import ProjectAddModal from '@/components/ProjectAddModal';
import AgentBulkUpload from '@/components/AgentBulkUpload';
import AgentPhotoManager from '@/components/AgentPhotoManager';
import AIAssistant from '@/components/AIAssistant';
import NotificationCenter from '@/components/NotificationCenter';
import WeatherDashboard from '@/components/WeatherDashboard';
import AgentClientManager from '@/components/AgentClientManager';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Use the data service types
type Project = DataProject;
type CollectionAgent = DataAgent;

const ProjectManagement: React.FC = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<CollectionAgent[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'projects' | 'agents'>('projects');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showPhotoManager, setShowPhotoManager] = useState(false);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiMinimized, setAiMinimized] = useState(false);
  const [showWeatherDashboard, setShowWeatherDashboard] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showAgentClientManager, setShowAgentClientManager] = useState(false);

  // Load data from service
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [projectsData, agentsData] = await Promise.all([
          dataService.getProjects(),
          dataService.getAgents()
        ]);
        
        setProjects(projectsData);
        setAgents(agentsData);
        setFilteredProjects(projectsData);
        
        toast({
          title: "Data Loaded",
          description: `${projectsData.length} projects and ${agentsData.length} agents loaded successfully`,
          variant: "default"
        });
      } catch (error) {
        console.error('Failed to load data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [toast]);



  // Enhanced search functionality
  const handleSearch = (query: string) => {
    setSearchTerm(query);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const [projectsData, agentsData] = await Promise.all([
        dataService.getProjects(),
        dataService.getAgents()
      ]);
      
      setProjects(projectsData);
      setAgents(agentsData);
      setFilteredProjects(projectsData);
      
      toast({
        title: "Data Refreshed",
        description: "All data has been refreshed successfully",
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to refresh data:', error);
      toast({
        title: "Error",
        description: "Failed to refresh data",
        variant: "destructive"
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Generate CSV data
      const csvHeaders = [
        'Project Name', 'Region', 'Total Units', 'Occupied Units', 'Monthly Target', 
        'Monthly Collected', 'Collection Rate', 'Assigned Agent', 'Status'
      ];
      
      const csvData = filteredProjects.map(project => [
        project.name,
        project.region,
        project.total_units,
        project.occupied_units,
        project.monthly_target,
        project.monthly_collected,
        project.collection_rate + '%',
        project.assigned_agent,
        project.status
      ]);
      
      const csvContent = [csvHeaders.join(','), ...csvData.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `projects_export_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: `${filteredProjects.length} projects exported successfully`,
        variant: "default"
      });
    } catch (error) {
      console.error('Failed to export data:', error);
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };



  useEffect(() => {
    let filtered = projects;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.assigned_agent.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Region filter
    if (selectedRegion !== 'all') {
      filtered = filtered.filter(project => project.region === selectedRegion);
    }

    // Agent filter
    if (selectedAgent !== 'all') {
      filtered = filtered.filter(project => project.agent_id === selectedAgent);
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(project => project.status === selectedStatus);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, selectedRegion, selectedAgent, selectedStatus]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'maintenance': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'full': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'development': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCollectionRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-500';
    if (rate >= 85) return 'text-yellow-500';
    return 'text-red-500';
  };

  const ProjectCard: React.FC<{ project: Project; index: number }> = ({ project, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                {project.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{project.region}</span>
              </div>
            </div>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Collection Performance */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Collection Rate</span>
              <span className={`text-lg font-bold ${getCollectionRateColor(project.collection_rate)}`}>
                {project.collection_rate}%
              </span>
            </div>
            <Progress value={project.collection_rate} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Collected: {formatCurrency(project.monthly_collected)}</span>
              <span>Target: {formatCurrency(project.monthly_target)}</span>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">{project.occupied_units}/{project.total_units}</div>
              <div className="text-xs text-gray-600">Occupied Units</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="text-lg font-bold text-green-600">{formatCurrency(project.average_rent)}</div>
              <div className="text-xs text-gray-600">Avg. Rent</div>
            </div>
          </div>

          {/* Agent & Alerts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-700">{project.assigned_agent}</span>
            </div>
            
            {(project.contract_renewals_due > 0 || project.overdue_payments > 0) && (
              <div className="flex gap-2">
                {project.contract_renewals_due > 0 && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {project.contract_renewals_due} renewals due
                  </Badge>
                )}
                {project.overdue_payments > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    {project.overdue_payments} overdue
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1" onClick={() => setSelectedProject(project)}>
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Project
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Users className="w-4 h-4 mr-2" />
                  Manage Tenants
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <DollarSign className="w-4 h-4 mr-2" />
                  Collection History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const AgentCard: React.FC<{ agent: CollectionAgent; index: number }> = ({ agent, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Card className="overflow-hidden bg-white/95 backdrop-blur-sm border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
              {agent.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-600">{agent.assigned_projects.length} Projects</p>
            </div>
            <Badge className={`${getCollectionRateColor(agent.collection_rate)} bg-opacity-20`}>
              {agent.collection_rate}%
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Performance */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Monthly Performance</span>
              <span className="text-lg font-bold text-blue-600">
                {formatCurrency(agent.monthly_collected)}
              </span>
            </div>
            <Progress value={agent.collection_rate} className="h-2" />
            <div className="text-xs text-gray-500 mt-1">
              Target: {formatCurrency(agent.monthly_target)}
            </div>
          </div>

          {/* Contact & Stats */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📞 {agent.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>📧 {agent.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="w-4 h-4" />
              <span>{agent.total_tenants} Total Tenants</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="w-4 h-4 mr-1" />
              View Projects
            </Button>
            <Button variant="outline" size="sm">
              <Target className="w-4 h-4 mr-1" />
              Performance
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <DataLoadingWrapper
            isLoading={true}
            skeleton={<SkeletonTable rows={8} columns={6} />}
          >
            <div />
          </DataLoadingWrapper>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Project Management</h1>
                <p className="text-muted-foreground">Manage commercial leasing projects across Riyadh</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                variant="outline"
                size="sm"
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <LoadingSpinner size="sm" className="mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
              
              <PermissionGate permission={Permission.EXPORT_DATA}>
                <Button
                  onClick={handleExport}
                  variant="outline"
                  size="sm"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isExporting ? 'Exporting...' : 'Export'}
                </Button>
              </PermissionGate>
            </div>
            
            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'projects' ? 'default' : 'outline'}
                onClick={() => setViewMode('projects')}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Building2 className="w-4 h-4 mr-2" />
                Projects ({projects.length})
              </Button>
              <Button
                variant={viewMode === 'agents' ? 'default' : 'outline'}
                onClick={() => setViewMode('agents')}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                <Users className="w-4 h-4 mr-2" />
                Agents ({agents.length})
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-sm text-gray-600">Total Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(projects.reduce((sum, p) => sum + p.monthly_collected, 0))}
                  </p>
                  <p className="text-sm text-gray-600">Monthly Collection</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.round(projects.reduce((sum, p) => sum + p.collection_rate, 0) / projects.length)}%
                  </p>
                  <p className="text-sm text-gray-600">Avg Collection Rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {projects.reduce((sum, p) => sum + p.contract_renewals_due + p.overdue_payments, 0)}
                  </p>
                  <p className="text-sm text-gray-600">Pending Actions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        {viewMode === 'projects' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="North Riyadh">North Riyadh</SelectItem>
                      <SelectItem value="South Riyadh">South Riyadh</SelectItem>
                      <SelectItem value="East Riyadh">East Riyadh</SelectItem>
                      <SelectItem value="West Riyadh">West Riyadh</SelectItem>
                      <SelectItem value="Central Riyadh">Central Riyadh</SelectItem>
                      <SelectItem value="Industrial City">Industrial City</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Agent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Agents</SelectItem>
                      {agents.map(agent => (
                        <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => setShowProjectModal(true)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                    
                    <Button 
                      onClick={() => setShowBulkUpload(true)}
                      variant="outline"
                      className="border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Bulk Upload
                    </Button>
                    
                    <Button 
                      onClick={() => setShowPhotoManager(true)}
                      variant="outline"
                      className="border-purple-600 text-purple-600 hover:bg-purple-50"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Photo Manager
                    </Button>
                    
                    <Button 
                      onClick={() => setShowAgentClientManager(true)}
                      variant="outline"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Agent-Client Manager
                    </Button>
                    
                    <Button 
                      onClick={() => setShowWeatherDashboard(true)}
                      variant="outline"
                      className="border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      <Cloud className="w-4 h-4 mr-2" />
                      Weather
                    </Button>
                    
                    <Button 
                      onClick={() => setShowAIAssistant(true)}
                      variant="outline"
                      className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      AI Assistant
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between"
        >
          <p className="text-gray-600">
            {viewMode === 'projects' 
              ? `Showing ${filteredProjects.length} of ${projects.length} projects`
              : `Showing ${agents.length} collection agents`
            }
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {viewMode === 'projects' 
            ? filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
              ))
            : agents.map((agent, index) => (
                <AgentCard key={agent.id} agent={agent} index={index} />
              ))
          }
        </div>

        {viewMode === 'projects' && filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or add a new project.</p>
          </motion.div>
        )}
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProject.name}</DialogTitle>
                <DialogDescription>
                  {selectedProject.region} • Managed by {selectedProject.assigned_agent}
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Project Overview</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Units:</span>
                        <span className="ml-2 font-medium">{selectedProject.total_units}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Occupied:</span>
                        <span className="ml-2 font-medium">{selectedProject.occupied_units}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Area:</span>
                        <span className="ml-2 font-medium">{selectedProject.total_area.toLocaleString()} sqm</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Avg Rent:</span>
                        <span className="ml-2 font-medium">{formatCurrency(selectedProject.average_rent)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Property Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.property_types.map((type, idx) => (
                        <Badge key={idx} variant="outline">{type}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Collection Performance</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span>Collection Rate</span>
                        <span className={`font-bold ${getCollectionRateColor(selectedProject.collection_rate)}`}>
                          {selectedProject.collection_rate}%
                        </span>
                      </div>
                      <Progress value={selectedProject.collection_rate} className="mb-2" />
                      <div className="text-sm text-gray-600">
                        <div>Collected: {formatCurrency(selectedProject.monthly_collected)}</div>
                        <div>Target: {formatCurrency(selectedProject.monthly_target)}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Alerts & Actions</h3>
                    <div className="space-y-2">
                      {selectedProject.contract_renewals_due > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded">
                          <Calendar className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm">{selectedProject.contract_renewals_due} contracts due for renewal</span>
                        </div>
                      )}
                      {selectedProject.overdue_payments > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-red-50 rounded">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-sm">{selectedProject.overdue_payments} overdue payments</span>
                        </div>
                      )}
                      {selectedProject.contract_renewals_due === 0 && selectedProject.overdue_payments === 0 && (
                        <div className="flex items-center gap-2 p-2 bg-green-50 rounded">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">All payments up to date</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New Feature Modals and Components */}
      {showProjectModal && (
        <ProjectAddModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onSubmit={async (projectData) => {
            try {
              // Add the new project to the list
              setProjects(prev => [...prev, projectData]);
              setFilteredProjects(prev => [...prev, projectData]);
              setShowProjectModal(false);
              
              toast({
                title: "Project Created",
                description: `Project "${projectData.name}" has been created successfully`,
                variant: "default"
              });
            } catch (error) {
              console.error('Failed to add project:', error);
              toast({
                title: "Error",
                description: "Failed to create project",
                variant: "destructive"
              });
            }
          }}
          agents={agents.map(agent => ({ id: agent.id, name: agent.name }))}
        />
      )}

      {showBulkUpload && (
        <AgentBulkUpload
          isOpen={showBulkUpload}
          onClose={() => setShowBulkUpload(false)}
          onUpload={async (newAgents) => {
            try {
              // Add the new agents to the list
              setAgents(prev => [...prev, ...newAgents]);
              setShowBulkUpload(false);
              
              toast({
                title: "Agents Imported",
                description: `${newAgents.length} agents have been imported successfully`,
                variant: "default"
              });
            } catch (error) {
              console.error('Failed to import agents:', error);
              toast({
                title: "Error",
                description: "Failed to import agents",
                variant: "destructive"
              });
            }
          }}
        />
      )}

      {showPhotoManager && (
        <AgentPhotoManager
          isOpen={showPhotoManager}
          onClose={() => setShowPhotoManager(false)}
          agents={agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            phone: agent.phone,
            email: agent.email,
            region: agent.region,
            employeeId: agent.employeeId,
            profilePhoto: agent.profile_image,
            status: agent.status as 'active' | 'inactive' | 'training',
            monthlyTarget: agent.monthly_target,
            monthlyCollected: agent.monthly_collected,
            collectionRate: agent.collection_rate,
            totalProjects: agent.assigned_projects.length,
            lastActivity: agent.last_activity,
            joiningDate: agent.joiningDate,
            performanceScore: agent.performance_score
          }))}
          onPhotoUpdate={async (agentId, photos) => {
            try {
              console.log('Photo update for agent:', agentId, photos);
              toast({
                title: "Photos Updated",
                description: "Agent photos have been updated successfully",
                variant: "default"
              });
            } catch (error) {
              console.error('Failed to update photos:', error);
              toast({
                title: "Error",
                description: "Failed to update photos",
                variant: "destructive"
              });
            }
          }}
        />
      )}

      {showWeatherDashboard && (
        <Dialog open={showWeatherDashboard} onOpenChange={setShowWeatherDashboard}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Weather Dashboard</DialogTitle>
              <DialogDescription>
                Construction project weather monitoring and alerts
              </DialogDescription>
            </DialogHeader>
            <WeatherDashboard />
          </DialogContent>
        </Dialog>
      )}

      {/* AI Assistant */}
      {showAIAssistant && (
        <AIAssistant
          isOpen={showAIAssistant}
          onClose={() => setShowAIAssistant(false)}
          isMinimized={aiMinimized}
          onToggleMinimize={() => setAiMinimized(!aiMinimized)}
        />
      )}

      {/* Agent-Client Manager */}
      {showAgentClientManager && (
        <AgentClientManager
          isOpen={showAgentClientManager}
          onClose={() => setShowAgentClientManager(false)}
        />
      )}

      {/* Notification Center in Header */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationCenter />
      </div>
    </div>
  );
};

export default ProjectManagement; 