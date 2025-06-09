import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Calendar, 
  Users, 
  Clock, 
  Target,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Kanban,
  List,
  Calendar as CalendarIcon
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress: number;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  teamMembers: string[];
  manager: string;
  tasksTotal: number;
  tasksCompleted: number;
}

interface Task {
  id: string;
  title: string;
  projectId: string;
  assignee: string;
  status: 'todo' | 'in-progress' | 'review' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  estimatedHours: number;
  actualHours: number;
}

const ProjectsModule: React.FC = () => {
  const [activeView, setActiveView] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  // Sample data
  const projects: Project[] = [
    {
      id: 'PRJ001',
      name: 'Downtown Office Complex',
      description: 'Modern office building with 20 floors and retail space',
      status: 'active',
      priority: 'high',
      progress: 65,
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      budget: 2500000,
      spent: 1625000,
      teamMembers: ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'],
      manager: 'John Doe',
      tasksTotal: 45,
      tasksCompleted: 29
    },
    {
      id: 'PRJ002',
      name: 'Residential Tower A',
      description: 'Luxury residential tower with 30 floors',
      status: 'planning',
      priority: 'medium',
      progress: 15,
      startDate: '2024-03-01',
      endDate: '2025-06-30',
      budget: 3200000,
      spent: 480000,
      teamMembers: ['Alice Brown', 'Bob Davis', 'Carol White'],
      manager: 'Alice Brown',
      tasksTotal: 67,
      tasksCompleted: 10
    },
    {
      id: 'PRJ003',
      name: 'Shopping Mall Renovation',
      description: 'Complete renovation of existing shopping center',
      status: 'completed',
      priority: 'low',
      progress: 100,
      startDate: '2023-06-01',
      endDate: '2023-12-15',
      budget: 1800000,
      spent: 1750000,
      teamMembers: ['David Lee', 'Emma Taylor', 'Frank Miller'],
      manager: 'David Lee',
      tasksTotal: 38,
      tasksCompleted: 38
    },
    {
      id: 'PRJ004',
      name: 'Industrial Warehouse',
      description: 'Large-scale warehouse facility for logistics',
      status: 'on-hold',
      priority: 'medium',
      progress: 35,
      startDate: '2024-02-01',
      endDate: '2024-08-31',
      budget: 1500000,
      spent: 525000,
      teamMembers: ['Grace Chen', 'Henry Wilson'],
      manager: 'Grace Chen',
      tasksTotal: 28,
      tasksCompleted: 10
    }
  ];

  const tasks: Task[] = [
    {
      id: 'TSK001',
      title: 'Foundation Design Review',
      projectId: 'PRJ001',
      assignee: 'John Doe',
      status: 'completed',
      priority: 'high',
      dueDate: '2024-02-15',
      estimatedHours: 40,
      actualHours: 38
    },
    {
      id: 'TSK002',
      title: 'Structural Engineering Analysis',
      projectId: 'PRJ001',
      assignee: 'Jane Smith',
      status: 'in-progress',
      priority: 'high',
      dueDate: '2024-02-28',
      estimatedHours: 60,
      actualHours: 35
    },
    {
      id: 'TSK003',
      title: 'Environmental Impact Assessment',
      projectId: 'PRJ002',
      assignee: 'Alice Brown',
      status: 'review',
      priority: 'medium',
      dueDate: '2024-03-15',
      estimatedHours: 32,
      actualHours: 30
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'active':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'planning':
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      case 'on-hold':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'review':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'active':
      case 'in-progress':
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case 'on-hold':
        return <PauseCircle className="w-4 h-4 text-orange-600" />;
      case 'planning':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const renderProjectsList = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{projects.length}</p>
              </div>
              <Briefcase className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {projects.filter(p => p.status === 'active').length}
                </p>
              </div>
              <PlayCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {projects.filter(p => p.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                </p>
              </div>
              <Target className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Projects Overview</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Project
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="flex items-center">
                          {getStatusIcon(project.status)}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{project.name}</div>
                            <div className="text-sm text-gray-500">{project.id}</div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>{project.progress}%</span>
                          <span>{project.tasksCompleted}/{project.tasksTotal} tasks</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div className="font-medium">${project.budget.toLocaleString()}</div>
                        <div className="text-gray-500">Spent: ${project.spent.toLocaleString()}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{project.teamMembers.length}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(project.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderKanbanView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {['planning', 'active', 'on-hold', 'completed'].map((status) => (
          <Card key={status} className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium capitalize flex items-center justify-between">
                {status.replace('-', ' ')}
                <Badge variant="secondary">
                  {projects.filter(p => p.status === status).length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projects
                .filter(p => p.status === status)
                .map((project) => (
                  <Card key={project.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-medium">{project.name}</h4>
                        <Badge className={getPriorityColor(project.priority)} size="sm">
                          {project.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">{project.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center">
                          <Users className="w-3 h-3 mr-1" />
                          {project.teamMembers.length}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(project.endDate).toLocaleDateString()}
                        </span>
                      </div>
                      <Progress value={project.progress} className="h-1" />
                    </div>
                  </Card>
                ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
          <p className="text-gray-600 mt-1">Manage projects, tasks, and team collaboration</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Reports
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={activeView === 'list' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('list')}
        >
          <List className="w-4 h-4 mr-2" />
          List View
        </Button>
        <Button
          variant={activeView === 'kanban' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('kanban')}
        >
          <Kanban className="w-4 h-4 mr-2" />
          Kanban
        </Button>
        <Button
          variant={activeView === 'gantt' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveView('gantt')}
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          Gantt Chart
        </Button>
      </div>

      {/* Content */}
      {activeView === 'list' && renderProjectsList()}
      {activeView === 'kanban' && renderKanbanView()}
      {activeView === 'gantt' && (
        <div className="text-center py-12">
          <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Gantt Chart View</h3>
          <p className="text-gray-500">Interactive Gantt chart coming soon</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsModule; 