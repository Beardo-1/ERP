import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import { useToast } from '@/components/ui/use-toast';
import { dataService, type Project, type Agent } from '@/services/dataService';
import { apiService } from '@/services/apiService';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Users, 
  Calendar,
  FileText,
  Upload,
  Plus,
  Trash2,
  Save,
  AlertTriangle,
  CheckCircle,
  Camera,
  Paperclip
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ProjectFormData {
  name: string;
  description: string;
  location: string;
  region: string;
  propertyType: string[];
  totalUnits: number;
  totalArea: number;
  estimatedValue: number;
  monthlyTarget: number;
  assignedAgent: string;
  startDate: string;
  expectedCompletion: string;
  status: 'planning' | 'development' | 'active' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  amenities: string[];
  documents: File[];
  images: File[];
  coordinates: { lat: number; lng: number } | null;
  contactPerson: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
  financialDetails: {
    totalBudget: number;
    spentAmount: number;
    fundingSource: string;
    paymentTerms: string;
  };
  legalDetails: {
    licenseNumber: string;
    approvalStatus: string;
    complianceNotes: string;
  };
}

interface ProjectAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: Project) => void;
  agents: Array<{ id: string; name: string; }>;
}

const ProjectAddModal: React.FC<ProjectAddModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  agents 
}) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [availableAgents, setAvailableAgents] = useState<Agent[]>([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    location: '',
    region: '',
    propertyType: [],
    totalUnits: 0,
    totalArea: 0,
    estimatedValue: 0,
    monthlyTarget: 0,
    assignedAgent: '',
    startDate: '',
    expectedCompletion: '',
    status: 'planning',
    priority: 'medium',
    amenities: [],
    documents: [],
    images: [],
    coordinates: null,
    contactPerson: {
      name: '',
      phone: '',
      email: '',
      role: ''
    },
    financialDetails: {
      totalBudget: 0,
      spentAmount: 0,
      fundingSource: '',
      paymentTerms: ''
    },
    legalDetails: {
      licenseNumber: '',
      approvalStatus: 'pending',
      complianceNotes: ''
    }
  });

  const steps = [
    { id: 1, title: t('projects.basicInfo') || 'Basic Information', icon: <Building2 className="w-5 h-5" /> },
    { id: 2, title: t('projects.locationDetails') || 'Location & Details', icon: <MapPin className="w-5 h-5" /> },
    { id: 3, title: t('projects.financialInfo') || 'Financial Information', icon: <DollarSign className="w-5 h-5" /> },
    { id: 4, title: t('projects.documentsMedia') || 'Documents & Media', icon: <FileText className="w-5 h-5" /> },
    { id: 5, title: t('projects.review') || 'Review & Submit', icon: <CheckCircle className="w-5 h-5" /> }
  ];

  const propertyTypes = [
    'Warehouse', 'Office', 'Retail', 'Industrial', 'Mixed-Use', 'Storage', 'Logistics'
  ];

  const amenitiesList = [
    'Parking', 'Security', 'CCTV', 'Air Conditioning', 'Elevator', 'Generator', 
    'Fire Safety', 'Loading Dock', 'Conference Room', 'Cafeteria', 'Prayer Room',
    'Gym', 'Medical Center', 'WiFi', 'Backup Power', 'Water Storage'
  ];

  const riyadhRegions = [
    'North Riyadh', 'South Riyadh', 'East Riyadh', 'West Riyadh', 
    'Central Riyadh', 'Industrial City', 'King Khalid Airport Area'
  ];

  // Load agents on component mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const agentsData = await dataService.getAgents();
        setAvailableAgents(agentsData);
      } catch (error) {
        console.error('Failed to load agents:', error);
        toast({
          title: "Error",
          description: "Failed to load agents list",
          variant: "destructive"
        });
      }
    };

    if (isOpen) {
      loadAgents();
    }
  }, [isOpen, toast]);

  // Set default coordinates for Saudi regions
  const setDefaultCoordinates = (region: string) => {
    const regionCoordinates: Record<string, { lat: number; lng: number }> = {
      'North Riyadh': { lat: 24.8047, lng: 46.6753 },
      'South Riyadh': { lat: 24.6238, lng: 46.6753 },
      'East Riyadh': { lat: 24.7136, lng: 46.7713 },
      'West Riyadh': { lat: 24.7136, lng: 46.5793 },
      'Central Riyadh': { lat: 24.7136, lng: 46.6753 },
      'Industrial City': { lat: 24.6408, lng: 46.7728 },
      'King Khalid Airport Area': { lat: 24.9576, lng: 46.6988 }
    };

    const coordinates = regionCoordinates[region] || { lat: 24.7136, lng: 46.6753 };
    setFormData(prev => ({
      ...prev,
      coordinates
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Project name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.propertyType.length === 0) newErrors.propertyType = 'At least one property type is required';
        break;
      case 2:
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        if (!formData.region) newErrors.region = 'Region is required';
        if (formData.totalUnits <= 0) newErrors.totalUnits = 'Total units must be greater than 0';
        if (formData.totalArea <= 0) newErrors.totalArea = 'Total area must be greater than 0';
        break;
      case 3:
        if (formData.estimatedValue <= 0) newErrors.estimatedValue = 'Estimated value is required';
        if (formData.monthlyTarget <= 0) newErrors.monthlyTarget = 'Monthly target is required';
        if (!formData.assignedAgent) newErrors.assignedAgent = 'Assigned agent is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof ProjectFormData] as any,
        [field]: value
      }
    }));
  };

  const handleArrayToggle = (field: 'propertyType' | 'amenities', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleFileUpload = (field: 'documents' | 'images', files: FileList | null) => {
    if (files) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...Array.from(files)]
      }));
    }
  };

  const removeFile = (field: 'documents' | 'images', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    
    try {
      // Convert form data to Project format
      const projectData: Partial<Project> = {
        name: formData.name,
        description: formData.description,
        region: formData.region,
        city: formData.region, // Using region as city for now
        address: formData.location,
        coordinates: formData.coordinates || { lat: 24.7136, lng: 46.6753 },
        total_units: formData.totalUnits,
        occupied_units: 0,
        available_units: formData.totalUnits,
        monthly_target: formData.monthlyTarget,
        monthly_collected: 0,
        collection_rate: 0,
        assigned_agent: availableAgents.find(a => a.id === formData.assignedAgent)?.name || '',
        agent_id: formData.assignedAgent,
        property_types: formData.propertyType,
        total_area: formData.totalArea,
        average_rent: formData.estimatedValue / formData.totalUnits || 0,
        contract_renewals_due: 0,
        overdue_payments: 0,
        status: formData.status,
        start_date: formData.startDate,
        expected_completion: formData.expectedCompletion,
        budget: formData.financialDetails.totalBudget,
        completion_percentage: 0,
        amenities: formData.amenities,
        images: [], // File URLs would be handled by upload service
        legal_info: {
          license_number: formData.legalDetails.licenseNumber,
          approval_status: formData.legalDetails.approvalStatus,
          municipality_approval: false,
          environmental_clearance: false
        },
        financial_info: {
          total_investment: formData.financialDetails.totalBudget,
          funding_source: formData.financialDetails.fundingSource,
          payment_terms: formData.financialDetails.paymentTerms,
          roi_projection: 0
        },
        contact_person: formData.contactPerson
      };

      // Create project using data service
      const newProject = await dataService.createProject(projectData);
      
      toast({
        title: "Success!",
        description: `Project "${newProject.name}" has been created successfully`,
        variant: "default"
      });
      
      onSubmit(newProject);
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        location: '',
        region: '',
        propertyType: [],
        totalUnits: 0,
        totalArea: 0,
        estimatedValue: 0,
        monthlyTarget: 0,
        assignedAgent: '',
        startDate: '',
        expectedCompletion: '',
        status: 'planning',
        priority: 'medium',
        amenities: [],
        documents: [],
        images: [],
        coordinates: null,
        contactPerson: { name: '', phone: '', email: '', role: '' },
        financialDetails: { totalBudget: 0, spentAmount: 0, fundingSource: '', paymentTerms: '' },
        legalDetails: { licenseNumber: '', approvalStatus: 'pending', complianceNotes: '' }
      });
      setCurrentStep(1);
      setErrors({});
    } catch (error) {
      console.error('Error submitting project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('projects.projectName') || 'Project Name'} *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder={t('projects.enterProjectName') || 'Enter project name'}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">{t('projects.priority') || 'Priority'}</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('projects.description') || 'Description'} *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder={t('projects.enterDescription') || 'Enter project description'}
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t('projects.propertyTypes') || 'Property Types'} *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {propertyTypes.map(type => (
                  <Button
                    key={type}
                    type="button"
                    variant={formData.propertyType.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleArrayToggle('propertyType', type)}
                    className="justify-start"
                  >
                    {type}
                  </Button>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-500 text-sm">{errors.propertyType}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">{t('projects.startDate') || 'Start Date'}</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedCompletion">{t('projects.expectedCompletion') || 'Expected Completion'}</Label>
                <Input
                  id="expectedCompletion"
                  type="date"
                  value={formData.expectedCompletion}
                  onChange={(e) => handleInputChange('expectedCompletion', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location">{t('projects.location') || 'Location'} *</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder={t('projects.enterLocation') || 'Enter detailed address'}
                  className={errors.location ? 'border-red-500' : ''}
                />
                {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="region">{t('projects.region') || 'Region'} *</Label>
                <Select value={formData.region} onValueChange={(value) => {
                  handleInputChange('region', value);
                  setDefaultCoordinates(value);
                }}>
                  <SelectTrigger className={errors.region ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {riyadhRegions.map(region => (
                      <SelectItem key={region} value={region}>{region}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.region && <p className="text-red-500 text-sm">{errors.region}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="totalUnits">{t('projects.totalUnits') || 'Total Units'} *</Label>
                <Input
                  id="totalUnits"
                  type="number"
                  value={formData.totalUnits || ''}
                  onChange={(e) => handleInputChange('totalUnits', parseInt(e.target.value) || 0)}
                  placeholder="Enter number of units"
                  className={errors.totalUnits ? 'border-red-500' : ''}
                />
                {errors.totalUnits && <p className="text-red-500 text-sm">{errors.totalUnits}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalArea">{t('projects.totalArea') || 'Total Area (sqm)'} *</Label>
                <Input
                  id="totalArea"
                  type="number"
                  value={formData.totalArea || ''}
                  onChange={(e) => handleInputChange('totalArea', parseInt(e.target.value) || 0)}
                  placeholder="Enter area in square meters"
                  className={errors.totalArea ? 'border-red-500' : ''}
                />
                {errors.totalArea && <p className="text-red-500 text-sm">{errors.totalArea}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('projects.amenities') || 'Amenities'}</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {amenitiesList.map(amenity => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={formData.amenities.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleArrayToggle('amenities', amenity)}
                    className="justify-start text-xs"
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{t('projects.contactPerson') || 'Contact Person'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Contact name"
                  value={formData.contactPerson.name}
                  onChange={(e) => handleNestedInputChange('contactPerson', 'name', e.target.value)}
                />
                <Input
                  placeholder="Phone number"
                  value={formData.contactPerson.phone}
                  onChange={(e) => handleNestedInputChange('contactPerson', 'phone', e.target.value)}
                />
                <Input
                  placeholder="Email address"
                  value={formData.contactPerson.email}
                  onChange={(e) => handleNestedInputChange('contactPerson', 'email', e.target.value)}
                />
                <Input
                  placeholder="Role/Position"
                  value={formData.contactPerson.role}
                  onChange={(e) => handleNestedInputChange('contactPerson', 'role', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimatedValue">{t('projects.estimatedValue') || 'Estimated Value (SAR)'} *</Label>
                <Input
                  id="estimatedValue"
                  type="number"
                  value={formData.estimatedValue || ''}
                  onChange={(e) => handleInputChange('estimatedValue', parseInt(e.target.value) || 0)}
                  placeholder="Enter estimated value"
                  className={errors.estimatedValue ? 'border-red-500' : ''}
                />
                {errors.estimatedValue && <p className="text-red-500 text-sm">{errors.estimatedValue}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyTarget">{t('projects.monthlyTarget') || 'Monthly Target (SAR)'} *</Label>
                <Input
                  id="monthlyTarget"
                  type="number"
                  value={formData.monthlyTarget || ''}
                  onChange={(e) => handleInputChange('monthlyTarget', parseInt(e.target.value) || 0)}
                  placeholder="Enter monthly collection target"
                  className={errors.monthlyTarget ? 'border-red-500' : ''}
                />
                {errors.monthlyTarget && <p className="text-red-500 text-sm">{errors.monthlyTarget}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignedAgent">{t('projects.assignedAgent') || 'Assigned Agent'} *</Label>
              <Select value={formData.assignedAgent} onValueChange={(value) => handleInputChange('assignedAgent', value)}>
                <SelectTrigger className={errors.assignedAgent ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select an agent" />
                </SelectTrigger>
                <SelectContent>
                  {availableAgents.map(agent => (
                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.assignedAgent && <p className="text-red-500 text-sm">{errors.assignedAgent}</p>}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{t('projects.financialDetails') || 'Financial Details'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Total Budget (SAR)"
                  type="number"
                  value={formData.financialDetails.totalBudget || ''}
                  onChange={(e) => handleNestedInputChange('financialDetails', 'totalBudget', parseInt(e.target.value) || 0)}
                />
                <Input
                  placeholder="Funding Source"
                  value={formData.financialDetails.fundingSource}
                  onChange={(e) => handleNestedInputChange('financialDetails', 'fundingSource', e.target.value)}
                />
                <Input
                  placeholder="Payment Terms"
                  value={formData.financialDetails.paymentTerms}
                  onChange={(e) => handleNestedInputChange('financialDetails', 'paymentTerms', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{t('projects.legalDetails') || 'Legal Details'}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="License Number"
                  value={formData.legalDetails.licenseNumber}
                  onChange={(e) => handleNestedInputChange('legalDetails', 'licenseNumber', e.target.value)}
                />
                <Select 
                  value={formData.legalDetails.approvalStatus} 
                  onValueChange={(value) => handleNestedInputChange('legalDetails', 'approvalStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Approval Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                placeholder="Compliance Notes"
                value={formData.legalDetails.complianceNotes}
                onChange={(e) => handleNestedInputChange('legalDetails', 'complianceNotes', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('projects.documents') || 'Documents'}
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  onChange={(e) => handleFileUpload('documents', e.target.files)}
                  className="hidden"
                  id="documents-upload"
                />
                <label htmlFor="documents-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload documents</p>
                  <p className="text-sm text-gray-400">PDF, DOC, XLS files supported</p>
                </label>
              </div>
              {formData.documents.length > 0 && (
                <div className="space-y-2">
                  {formData.documents.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-sm">{file.name}</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile('documents', index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Camera className="w-5 h-5" />
                {t('projects.images') || 'Images'}
              </h4>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload('images', e.target.files)}
                  className="hidden"
                  id="images-upload"
                />
                <label htmlFor="images-upload" className="cursor-pointer">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Click to upload images</p>
                  <p className="text-sm text-gray-400">JPG, PNG, GIF files supported</p>
                </label>
              </div>
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => removeFile('images', index)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                {t('projects.reviewProject') || 'Review Project Details'}
              </h4>
              <p className="text-blue-700 text-sm">
                {t('projects.reviewMessage') || 'Please review all information before submitting the project.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Region:</strong> {formData.region}</div>
                  <div><strong>Property Types:</strong> {formData.propertyType.join(', ')}</div>
                  <div><strong>Priority:</strong> {formData.priority}</div>
                  <div><strong>Status:</strong> {formData.status}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Estimated Value:</strong> {formData.estimatedValue.toLocaleString()} SAR</div>
                  <div><strong>Monthly Target:</strong> {formData.monthlyTarget.toLocaleString()} SAR</div>
                  <div><strong>Total Units:</strong> {formData.totalUnits}</div>
                  <div><strong>Total Area:</strong> {formData.totalArea.toLocaleString()} sqm</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location & Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Location:</strong> {formData.location}</div>
                  <div><strong>Contact:</strong> {formData.contactPerson.name}</div>
                  <div><strong>Phone:</strong> {formData.contactPerson.phone}</div>
                  <div><strong>Email:</strong> {formData.contactPerson.email}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Attachments</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div><strong>Documents:</strong> {formData.documents.length} files</div>
                  <div><strong>Images:</strong> {formData.images.length} files</div>
                  <div><strong>Amenities:</strong> {formData.amenities.length} selected</div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            {t('projects.addNewProject') || 'Add New Project'}
          </DialogTitle>
          <DialogDescription>
            {t('projects.addProjectDescription') || 'Create a new commercial real estate project with detailed information.'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4">
            {steps[currentStep - 1]?.title}
          </h3>
          {renderStepContent()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            {currentStep < steps.length ? (
              <Button
                type="button"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-4 h-4 mr-2"
                    >
                      <Save className="w-4 h-4" />
                    </motion.div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectAddModal; 