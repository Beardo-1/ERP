import React, { useState } from 'react';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import { motion } from 'framer-motion';
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  FileImage, 
  Calendar,
  Filter,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
} from '@/components/ui/dialog';

interface ExportOption {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  format: 'pdf' | 'excel' | 'csv' | 'json';
  icon: React.ReactNode;
  color: string;
}

const ExportManager: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const [selectedExport, setSelectedExport] = useState<string>('');
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportComplete, setExportComplete] = useState<boolean>(false);

  const exportOptions: ExportOption[] = [
    {
      id: 'financial-report',
      name: 'Financial Report',
      nameAr: 'التقرير المالي',
      description: 'Complete financial overview with revenue, expenses, and profit analysis',
      descriptionAr: 'نظرة شاملة على الوضع المالي مع تحليل الإيرادات والمصروفات والأرباح',
      format: 'pdf',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'collection-data',
      name: 'Collection Data',
      nameAr: 'بيانات التحصيل',
      description: 'Detailed collection records and agent performance metrics',
      descriptionAr: 'سجلات التحصيل التفصيلية ومقاييس أداء المندوبين',
      format: 'excel',
      icon: <FileSpreadsheet className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'project-summary',
      name: 'Project Summary',
      nameAr: 'ملخص المشاريع',
      description: 'Overview of all projects across Riyadh regions',
      descriptionAr: 'نظرة عامة على جميع المشاريع في مناطق الرياض',
      format: 'pdf',
      icon: <FileImage className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'tenant-database',
      name: 'Tenant Database',
      nameAr: 'قاعدة بيانات المستأجرين',
      description: 'Complete tenant information and lease details',
      descriptionAr: 'معلومات المستأجرين الكاملة وتفاصيل العقود',
      format: 'csv',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-orange-500'
    }
  ];

  // Enhanced CSV export with BOM for Arabic text compatibility
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      '\uFEFF', // UTF-8 BOM for Arabic text compatibility
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape quotes and wrap in quotes if contains comma, quote, or newline
          if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${language}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Enhanced export with proper localization
  const handleExport = async (exportId: string) => {
    setIsExporting(true);
    setExportProgress(0);
    setExportComplete(false);

    // Simulate export progress
    const progressInterval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsExporting(false);
          setExportComplete(true);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const selectedOption = exportOptions.find(opt => opt.id === exportId);
      
      if (selectedOption?.format === 'csv') {
        // Mock data for demonstration
        const mockData = [
          { 
            name: language === 'ar' ? 'أحمد محمد' : 'Ahmed Mohammed',
            project: language === 'ar' ? 'مشروع الرياض الجديد' : 'New Riyadh Project',
            amount: 50000,
            date: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')
          },
          {
            name: language === 'ar' ? 'فاطمة علي' : 'Fatima Ali', 
            project: language === 'ar' ? 'مجمع الأعمال التجاري' : 'Commercial Business Complex',
            amount: 75000,
            date: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US')
          }
        ];
        
        exportToCSV(mockData, selectedOption.name);
      } else {
        // Handle other formats (PDF, Excel, etc.)
        console.log(`Exporting ${exportId} in ${language} format: ${selectedOption?.format}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border-slate-700/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <Download className="w-6 h-6 text-blue-400" />
              {language === 'ar' ? 'مدير التصدير' : 'Export Manager'}
            </CardTitle>
            <p className="text-slate-400">
              {language === 'ar' 
                ? 'تصدير البيانات والتقارير بصيغ مختلفة مع دعم اللغة العربية'
                : 'Export data and reports in various formats with multilingual support'
              }
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exportOptions.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedExport(option.id)}
                >
                  <Card className={`border-2 transition-all duration-300 ${
                    selectedExport === option.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-slate-700 hover:border-slate-600'
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${option.color}/20`}>
                          {option.icon}
                        </div>
                        <div className="flex-1 space-y-2">
                          <h3 className="font-semibold text-white">
                            {language === 'ar' ? option.nameAr : option.name}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {language === 'ar' ? option.descriptionAr : option.description}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {option.format.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {selectedExport && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="space-y-4 pt-4 border-t border-slate-700"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select defaultValue="last-30-days">
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">
                        {language === 'ar' ? 'آخر 7 أيام' : 'Last 7 days'}
                      </SelectItem>
                      <SelectItem value="last-30-days">
                        {language === 'ar' ? 'آخر 30 يوم' : 'Last 30 days'}
                      </SelectItem>
                      <SelectItem value="last-quarter">
                        {language === 'ar' ? 'الربع الأخير' : 'Last quarter'}
                      </SelectItem>
                      <SelectItem value="last-year">
                        {language === 'ar' ? 'السنة الماضية' : 'Last year'}
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select defaultValue={language}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {language === 'ar' ? 'جاري التصدير...' : 'Exporting...'}
                      </span>
                      <span className="text-white">{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="h-2" />
                  </div>
                )}

                {exportComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 p-3 bg-green-500/20 border border-green-500/30 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">
                      {language === 'ar' ? 'تم التصدير بنجاح!' : 'Export completed successfully!'}
                    </span>
                  </motion.div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={() => handleExport(selectedExport)}
                    disabled={isExporting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {language === 'ar' ? 'تصدير' : 'Export'}
                  </Button>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-slate-700">
                        <Settings className="w-4 h-4 mr-2" />
                        {language === 'ar' ? 'خيارات متقدمة' : 'Advanced Options'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-slate-700">
                      <DialogHeader>
                        <DialogTitle className="text-white">
                          {language === 'ar' ? 'خيارات التصدير المتقدمة' : 'Advanced Export Options'}
                        </DialogTitle>
                        <DialogDescription className="text-slate-400">
                          {language === 'ar' 
                            ? 'تخصيص إعدادات التصدير حسب احتياجاتك'
                            : 'Customize export settings according to your needs'
                          }
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">
                            {language === 'ar' ? 'تنسيق التاريخ' : 'Date Format'}
                          </label>
                          <Select defaultValue="dd/mm/yyyy">
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                              <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                              <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white">
                            {language === 'ar' ? 'العملة' : 'Currency'}
                          </label>
                          <Select defaultValue="sar">
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sar">SAR (ريال سعودي)</SelectItem>
                              <SelectItem value="usd">USD (دولار أمريكي)</SelectItem>
                              <SelectItem value="eur">EUR (يورو)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ExportManager; 