import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import { useToast } from '@/components/ui/use-toast';
import { dataService, type Agent } from '@/services/dataService';
import { 
  X, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Save,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ValidationError {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

interface AgentUploadData {
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  region: string;
  employeeId: string;
  joiningDate: string;
  monthlyTarget: number;
  commissionRate: number;
  status: 'active' | 'inactive' | 'on_leave';
  address?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  bankName?: string;
  accountNumber?: string;
  iban?: string;
}

interface AgentBulkUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (agents: Agent[]) => void;
}

const AgentBulkUpload: React.FC<AgentBulkUploadProps> = ({ 
  isOpen, 
  onClose, 
  onUpload 
}) => {
  const { t, isRTL } = useLanguage();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedData, setUploadedData] = useState<AgentUploadData[]>([]);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showErrors, setShowErrors] = useState(true);
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState<AgentUploadData | null>(null);

  const saudiRegions = [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk',
    'Abha', 'Buraidah', 'Khamis Mushait', 'Hail', 'Najran', 'Jazan', 'Yanbu'
  ];

  const saudiBanks = [
    'Al Rajhi Bank', 'Saudi National Bank', 'Riyad Bank', 'SABB',
    'Banque Saudi Fransi', 'Arab National Bank', 'Saudi Investment Bank',
    'Alinma Bank', 'Bank AlBilad', 'Bank AlJazira'
  ];

  const steps = [
    { id: 1, title: 'Upload File', icon: <Upload className="w-5 h-5" /> },
    { id: 2, title: 'Validate Data', icon: <CheckCircle className="w-5 h-5" /> },
    { id: 3, title: 'Review & Import', icon: <Users className="w-5 h-5" /> }
  ];

  // Generate sample CSV template
  const generateTemplate = () => {
    const headers = [
      'name', 'phone', 'email', 'nationalId', 'region', 'employeeId', 
      'joiningDate', 'monthlyTarget', 'commissionRate', 'status',
      'address', 'emergencyContactName', 'emergencyContactPhone',
      'bankName', 'accountNumber', 'iban'
    ];

    const sampleData = [
      [
        'Ahmed Al-Rashid', '+966501234567', 'ahmed.rashid@company.sa', '1234567890',
        'Riyadh', 'EMP001', '2024-01-15', '75000', '2.5', 'active',
        '123 King Fahd Road, Riyadh', 'Fatima Al-Rashid', '+966509876543',
        'Al Rajhi Bank', '1234567890123456', 'SA1234567890123456789012'
      ],
      [
        'Mohammed Al-Saud', '+966502345678', 'mohammed.saud@company.sa', '2345678901',
        'Jeddah', 'EMP002', '2024-02-01', '80000', '3.0', 'active',
        '456 Prince Sultan Road, Jeddah', 'Aisha Al-Saud', '+966508765432',
        'Saudi National Bank', '2345678901234567', 'SA2345678901234567890123'
      ]
    ];

    const csvContent = [headers.join(','), ...sampleData.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'agent_upload_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded successfully",
      variant: "default"
    });
  };

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    const saudiPhoneRegex = /^\+966[5][0-9]{8}$/;
    return saudiPhoneRegex.test(phone);
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateNationalId = (id: string): boolean => {
    return /^\d{10}$/.test(id);
  };

  const validateIBAN = (iban: string): boolean => {
    return /^SA\d{22}$/.test(iban);
  };

  const validateEmployeeId = (id: string, existingIds: string[]): boolean => {
    return id.length >= 3 && !existingIds.includes(id);
  };

  // Comprehensive data validation
  const validateData = (data: AgentUploadData[]): ValidationError[] => {
    const errors: ValidationError[] = [];
    const existingEmployeeIds: string[] = [];
    const existingEmails: string[] = [];
    const existingNationalIds: string[] = [];

    data.forEach((agent, index) => {
      const row = index + 1;

      // Required field validations
      if (!agent.name?.trim()) {
        errors.push({ row, field: 'name', message: 'Name is required', severity: 'error' });
      }

      if (!agent.phone?.trim()) {
        errors.push({ row, field: 'phone', message: 'Phone is required', severity: 'error' });
      } else if (!validatePhone(agent.phone)) {
        errors.push({ row, field: 'phone', message: 'Invalid Saudi phone format (+966XXXXXXXXX)', severity: 'error' });
      }

      if (!agent.email?.trim()) {
        errors.push({ row, field: 'email', message: 'Email is required', severity: 'error' });
      } else if (!validateEmail(agent.email)) {
        errors.push({ row, field: 'email', message: 'Invalid email format', severity: 'error' });
      } else if (existingEmails.includes(agent.email)) {
        errors.push({ row, field: 'email', message: 'Duplicate email address', severity: 'error' });
      } else {
        existingEmails.push(agent.email);
      }

      if (!agent.nationalId?.trim()) {
        errors.push({ row, field: 'nationalId', message: 'National ID is required', severity: 'error' });
      } else if (!validateNationalId(agent.nationalId)) {
        errors.push({ row, field: 'nationalId', message: 'National ID must be 10 digits', severity: 'error' });
      } else if (existingNationalIds.includes(agent.nationalId)) {
        errors.push({ row, field: 'nationalId', message: 'Duplicate National ID', severity: 'error' });
      } else {
        existingNationalIds.push(agent.nationalId);
      }

      if (!agent.region?.trim()) {
        errors.push({ row, field: 'region', message: 'Region is required', severity: 'error' });
      } else if (!saudiRegions.includes(agent.region)) {
        errors.push({ row, field: 'region', message: 'Invalid region', severity: 'warning' });
      }

      if (!agent.employeeId?.trim()) {
        errors.push({ row, field: 'employeeId', message: 'Employee ID is required', severity: 'error' });
      } else if (!validateEmployeeId(agent.employeeId, existingEmployeeIds)) {
        errors.push({ row, field: 'employeeId', message: 'Invalid or duplicate Employee ID', severity: 'error' });
      } else {
        existingEmployeeIds.push(agent.employeeId);
      }

      if (!agent.joiningDate?.trim()) {
        errors.push({ row, field: 'joiningDate', message: 'Joining date is required', severity: 'error' });
      } else {
        const date = new Date(agent.joiningDate);
        if (isNaN(date.getTime())) {
          errors.push({ row, field: 'joiningDate', message: 'Invalid date format', severity: 'error' });
        } else if (date > new Date()) {
          errors.push({ row, field: 'joiningDate', message: 'Joining date cannot be in the future', severity: 'warning' });
        }
      }

      if (agent.monthlyTarget <= 0) {
        errors.push({ row, field: 'monthlyTarget', message: 'Monthly target must be greater than 0', severity: 'error' });
      } else if (agent.monthlyTarget < 10000) {
        errors.push({ row, field: 'monthlyTarget', message: 'Monthly target seems low (< 10,000 SAR)', severity: 'warning' });
      }

      if (agent.commissionRate <= 0 || agent.commissionRate > 10) {
        errors.push({ row, field: 'commissionRate', message: 'Commission rate should be between 0.1% and 10%', severity: 'warning' });
      }

      if (!['active', 'inactive', 'on_leave'].includes(agent.status)) {
        errors.push({ row, field: 'status', message: 'Status must be active, inactive, or on_leave', severity: 'error' });
      }

      // Optional field validations
      if (agent.iban && !validateIBAN(agent.iban)) {
        errors.push({ row, field: 'iban', message: 'Invalid Saudi IBAN format', severity: 'warning' });
      }

      if (agent.bankName && !saudiBanks.includes(agent.bankName)) {
        errors.push({ row, field: 'bankName', message: 'Bank name not recognized', severity: 'warning' });
      }
    });

    return errors;
  };

  // File upload handler
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let data: AgentUploadData[] = [];

        if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
          // Parse CSV
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim());
          
          data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
            const agent: any = {};
            headers.forEach((header, index) => {
              agent[header] = values[index] || '';
            });
            
            // Convert numeric fields
            agent.monthlyTarget = parseFloat(agent.monthlyTarget) || 0;
            agent.commissionRate = parseFloat(agent.commissionRate) || 0;
            
            return agent as AgentUploadData;
          });
        } else if (file.type === 'application/json' || file.name.endsWith('.json')) {
          // Parse JSON
          data = JSON.parse(e.target?.result as string);
        }

        setUploadedData(data);
        setCurrentStep(2);
        
        // Validate immediately
        const errors = validateData(data);
        setValidationErrors(errors);

        toast({
          title: "File Uploaded",
          description: `${data.length} records loaded. ${errors.filter(e => e.severity === 'error').length} errors found.`,
          variant: errors.filter(e => e.severity === 'error').length > 0 ? "destructive" : "default"
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description: "Failed to parse file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  // Edit row functionality
  const startEdit = (index: number) => {
    setEditingRow(index);
    setEditData({ ...uploadedData[index] });
  };

  const saveEdit = () => {
    if (editingRow !== null && editData) {
      const newData = [...uploadedData];
      newData[editingRow] = editData;
      setUploadedData(newData);
      
      // Re-validate
      const errors = validateData(newData);
      setValidationErrors(errors);
      
      setEditingRow(null);
      setEditData(null);
      
      toast({
        title: "Row Updated",
        description: "Data has been updated and re-validated",
        variant: "default"
      });
    }
  };

  const cancelEdit = () => {
    setEditingRow(null);
    setEditData(null);
  };

  const deleteRow = (index: number) => {
    const newData = uploadedData.filter((_, i) => i !== index);
    setUploadedData(newData);
    
    // Re-validate
    const errors = validateData(newData);
    setValidationErrors(errors);
    
    toast({
      title: "Row Deleted",
      description: "Record has been removed",
      variant: "default"
    });
  };

  // Final import
  const handleImport = async () => {
    const errorCount = validationErrors.filter(e => e.severity === 'error').length;
    if (errorCount > 0) {
      toast({
        title: "Cannot Import",
        description: `Please fix ${errorCount} errors before importing`,
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Convert to Agent format and create
      const agentPromises = uploadedData.map(data => 
        dataService.createAgent({
          name: data.name,
          phone: data.phone,
          email: data.email,
          nationalId: data.nationalId,
          region: data.region,
          employeeId: data.employeeId,
          joiningDate: data.joiningDate,
          monthly_target: data.monthlyTarget,
          commission_rate: data.commissionRate,
          status: data.status,
          address: data.address || '',
          emergency_contact: {
            name: data.emergencyContactName || '',
            phone: data.emergencyContactPhone || '',
            relationship: 'Emergency Contact'
          },
          bank_details: {
            account_number: data.accountNumber || '',
            bank_name: data.bankName || '',
            iban: data.iban || ''
          }
        })
      );

      const newAgents = await Promise.all(agentPromises);
      
      onUpload(newAgents);
      onClose();
      
      toast({
        title: "Import Successful",
        description: `${newAgents.length} agents have been imported successfully`,
        variant: "default"
      });

      // Reset state
      setCurrentStep(1);
      setUploadedData([]);
      setValidationErrors([]);
    } catch (error) {
      console.error('Import failed:', error);
      toast({
        title: "Import Failed",
        description: "Failed to import agents. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Upload Agent Data</h3>
              <p className="text-gray-600 mb-6">
                Upload a CSV or JSON file containing agent information
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Download Template</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Download a sample CSV template with the correct format
                  </p>
                  <Button onClick={generateTemplate} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download CSV Template
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upload File</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <input
                      type="file"
                      accept=".csv,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload file</p>
                      <p className="text-sm text-gray-400">CSV or JSON files only</p>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">Required Fields</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
                <div>• Name</div>
                <div>• Phone (+966XXXXXXXXX)</div>
                <div>• Email</div>
                <div>• National ID (10 digits)</div>
                <div>• Region</div>
                <div>• Employee ID</div>
                <div>• Joining Date</div>
                <div>• Monthly Target</div>
                <div>• Commission Rate</div>
                <div>• Status</div>
              </div>
            </div>
          </div>
        );

      case 2:
        const errorCount = validationErrors.filter(e => e.severity === 'error').length;
        const warningCount = validationErrors.filter(e => e.severity === 'warning').length;

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Data Validation</h3>
                <p className="text-gray-600">
                  {uploadedData.length} records uploaded
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowErrors(!showErrors)}
                >
                  {showErrors ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  {showErrors ? 'Hide' : 'Show'} Errors
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const errors = validateData(uploadedData);
                    setValidationErrors(errors);
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Re-validate
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <div className="font-semibold">{uploadedData.length - new Set(validationErrors.map(e => e.row)).size}</div>
                      <div className="text-sm text-gray-600">Valid Records</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="font-semibold text-red-600">{errorCount}</div>
                      <div className="text-sm text-gray-600">Errors</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <div className="font-semibold text-yellow-600">{warningCount}</div>
                      <div className="text-sm text-gray-600">Warnings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {showErrors && validationErrors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Validation Issues</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {validationErrors.map((error, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 p-2 rounded text-sm ${
                          error.severity === 'error' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span>Row {error.row}: {error.field} - {error.message}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Data Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Region</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {uploadedData.map((agent, index) => {
                        const rowErrors = validationErrors.filter(e => e.row === index + 1);
                        const hasErrors = rowErrors.some(e => e.severity === 'error');
                        
                        return (
                          <TableRow key={index} className={hasErrors ? 'bg-red-50' : ''}>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {index + 1}
                                {rowErrors.length > 0 && (
                                  <Badge variant={hasErrors ? 'destructive' : 'secondary'}>
                                    {rowErrors.length}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {editingRow === index ? (
                                <Input
                                  value={editData?.name || ''}
                                  onChange={(e) => setEditData(prev => prev ? {...prev, name: e.target.value} : null)}
                                  className="w-32"
                                />
                              ) : (
                                agent.name
                              )}
                            </TableCell>
                            <TableCell>
                              {editingRow === index ? (
                                <Input
                                  value={editData?.phone || ''}
                                  onChange={(e) => setEditData(prev => prev ? {...prev, phone: e.target.value} : null)}
                                  className="w-32"
                                />
                              ) : (
                                agent.phone
                              )}
                            </TableCell>
                            <TableCell>
                              {editingRow === index ? (
                                <Input
                                  value={editData?.email || ''}
                                  onChange={(e) => setEditData(prev => prev ? {...prev, email: e.target.value} : null)}
                                  className="w-40"
                                />
                              ) : (
                                agent.email
                              )}
                            </TableCell>
                            <TableCell>
                              {editingRow === index ? (
                                <Select
                                  value={editData?.region || ''}
                                  onValueChange={(value) => setEditData(prev => prev ? {...prev, region: value} : null)}
                                >
                                  <SelectTrigger className="w-32">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {saudiRegions.map(region => (
                                      <SelectItem key={region} value={region}>{region}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                agent.region
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={agent.status === 'active' ? 'default' : 'secondary'}>
                                {agent.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                {editingRow === index ? (
                                  <>
                                    <Button size="sm" variant="ghost" onClick={saveEdit}>
                                      <Save className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={cancelEdit}>
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button size="sm" variant="ghost" onClick={() => startEdit(index)}>
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => deleteRow(index)}>
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back to Upload
              </Button>
              <Button 
                onClick={() => setCurrentStep(3)}
                disabled={errorCount > 0}
              >
                Continue to Review
              </Button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Users className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Ready to Import</h3>
              <p className="text-gray-600">
                {uploadedData.length} agents are ready to be imported
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Import Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Records:</span>
                    <span className="font-semibold">{uploadedData.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valid Records:</span>
                    <span className="font-semibold text-green-600">
                      {uploadedData.length - new Set(validationErrors.filter(e => e.severity === 'error').map(e => e.row)).size}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Warnings:</span>
                    <span className="font-semibold text-yellow-600">
                      {validationErrors.filter(e => e.severity === 'warning').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Regions:</span>
                    <span className="font-semibold">
                      {new Set(uploadedData.map(a => a.region)).size}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Regional Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(
                      uploadedData.reduce((acc, agent) => {
                        acc[agent.region] = (acc[agent.region] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([region, count]) => (
                      <div key={region} className="flex justify-between text-sm">
                        <span>{region}:</span>
                        <span className="font-semibold">{count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Import Process</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Agent accounts will be created with provided information</li>
                <li>• Default passwords will be generated and sent via email</li>
                <li>• Agents will be assigned to their respective regions</li>
                <li>• Performance tracking will begin immediately</li>
              </ul>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back to Validation
              </Button>
              <Button 
                onClick={handleImport}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Import {uploadedData.length} Agents
                  </>
                )}
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Agent Bulk Upload
          </DialogTitle>
          <DialogDescription>
            Upload multiple agents at once using CSV or JSON files
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-300 text-gray-400'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  step.icon
                )}
              </div>
              <div className="ml-3">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default AgentBulkUpload; 