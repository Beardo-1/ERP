import React, { createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Translation context
interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation data
const translations = {
  en: {
    'navigation.dashboard': 'Executive Dashboard',
    'navigation.projects': 'Projects',
    'navigation.agents': 'Collection Agents',
    'navigation.collections': 'Collections',
    'navigation.tenants': 'Tenant Management',
    'navigation.finance': 'Finance',
    'navigation.contracts': 'Contracts',
    'navigation.renewals': 'Renewals',
    'navigation.settings': 'Settings',
    'navigation.help': 'Help & Support',
    'navigation.agentDashboard': 'Agent Dashboard',
    'navigation.commandCenter': 'Command Center',
    'navigation.communications': 'Communications',
    'navigation.analytics': 'AI Analytics',
    'dashboard.title': 'Executive Dashboard',
    'dashboard.subtitle': 'Real-time business intelligence',
    'dashboard.totalRevenue': 'Total Revenue',
    'dashboard.collectionRate': 'Collection Rate',
    'dashboard.activeProjects': 'Active Projects',
    'dashboard.totalAgents': 'Collection Agents',
    'dashboard.monthlyTarget': 'Monthly Target',
    'dashboard.todayCollection': "Today's Collection",
    'dashboard.overduePayments': 'Overdue Payments',
    'dashboard.renewalsThisMonth': 'Renewals This Month',
    'dashboard.revenueGrowth': 'Revenue Growth',
    'dashboard.collectionTrends': 'Collection Trends',
    'dashboard.projectDistribution': 'Project Distribution',
    'dashboard.agentPerformance': 'Agent Performance',
    'dashboard.riyadhRegions': 'Riyadh Regions',
    'dashboard.northRiyadh': 'North Riyadh',
    'dashboard.southRiyadh': 'South Riyadh',
    'dashboard.eastRiyadh': 'East Riyadh',
    'dashboard.westRiyadh': 'West Riyadh',
    'dashboard.centralRiyadh': 'Central Riyadh',
    'common.loading': 'Loading...',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.currency': 'SAR',
    'executiveDashboard': 'Loading Executive Dashboard...',
    'commercialLeasingDashboard': 'Commercial Leasing Dashboard',
    'realTimeCollectionPerformanceCenter': 'Real-time Collection & Performance Center',
    'monthlyCollection': 'Monthly Collection',
    'target': 'Target',
    'activeProjects': 'Active Projects',
    'activeLeases': 'Active Leases',
    'collectionRate': 'Collection Rate',
    'thisMonth': 'This Month',
    'pendingActions': 'Pending Actions',
    'renewals': 'Renewals',
    'overdue': 'Overdue',
    'collectionPerformanceTrends': 'Collection Performance Trends',
    'projectsByRegion': 'Projects by Region',
    'collectionAgentPerformance': 'Collection Agent Performance',
    'projects': 'projects',
    'recentCollections': 'Recent Collections',
    'by': 'by'
  },
  ar: {
    'navigation.dashboard': 'لوحة القيادة التنفيذية',
    'navigation.projects': 'المشاريع',
    'navigation.agents': 'مندوبي التحصيل',
    'navigation.collections': 'التحصيلات',
    'navigation.tenants': 'إدارة المستأجرين',
    'navigation.finance': 'المالية',
    'navigation.contracts': 'العقود',
    'navigation.renewals': 'التجديدات',
    'navigation.settings': 'الإعدادات',
    'navigation.help': 'المساعدة والدعم',
    'navigation.agentDashboard': 'لوحة المندوب',
    'navigation.commandCenter': 'مركز القيادة',
    'navigation.communications': 'الاتصالات',
    'navigation.analytics': 'التحليلات الذكية',
    'dashboard.title': 'لوحة القيادة التنفيذية',
    'dashboard.subtitle': 'ذكاء الأعمال في الوقت الفعلي',
    'dashboard.totalRevenue': 'إجمالي الإيرادات',
    'dashboard.collectionRate': 'معدل التحصيل',
    'dashboard.activeProjects': 'المشاريع النشطة',
    'dashboard.totalAgents': 'مندوبي التحصيل',
    'dashboard.monthlyTarget': 'الهدف الشهري',
    'dashboard.todayCollection': 'تحصيل اليوم',
    'dashboard.overduePayments': 'المدفوعات المتأخرة',
    'dashboard.renewalsThisMonth': 'التجديدات هذا الشهر',
    'dashboard.revenueGrowth': 'نمو الإيرادات',
    'dashboard.collectionTrends': 'اتجاهات التحصيل',
    'dashboard.projectDistribution': 'توزيع المشاريع',
    'dashboard.agentPerformance': 'أداء المندوبين',
    'dashboard.riyadhRegions': 'مناطق الرياض',
    'dashboard.northRiyadh': 'شمال الرياض',
    'dashboard.southRiyadh': 'جنوب الرياض',
    'dashboard.eastRiyadh': 'شرق الرياض',
    'dashboard.westRiyadh': 'غرب الرياض',
    'dashboard.centralRiyadh': 'وسط الرياض',
    'common.loading': 'جاري التحميل...',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.currency': 'ريال',
    'executiveDashboard': 'جاري تحميل لوحة القيادة التنفيذية...',
    'commercialLeasingDashboard': 'لوحة قيادة التأجير التجاري',
    'realTimeCollectionPerformanceCenter': 'مركز التحصيل والأداء في الوقت الفعلي',
    'monthlyCollection': 'التحصيل الشهري',
    'target': 'الهدف',
    'activeProjects': 'المشاريع النشطة',
    'activeLeases': 'العقود النشطة',
    'collectionRate': 'معدل التحصيل',
    'thisMonth': 'هذا الشهر',
    'pendingActions': 'الإجراءات المعلقة',
    'renewals': 'التجديدات',
    'overdue': 'المتأخرة',
    'collectionPerformanceTrends': 'اتجاهات أداء التحصيل',
    'projectsByRegion': 'المشاريع حسب المنطقة',
    'collectionAgentPerformance': 'أداء مندوبي التحصيل',
    'projects': 'مشاريع',
    'recentCollections': 'التحصيلات الأخيرة',
    'by': 'بواسطة'
  }
};

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦'
  }
];

// Language Provider Component
export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('preferred-language') || 'en';
  });

  const isRTL = language === 'ar';

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('preferred-language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  const t = (key: string): string => {
    const langTranslations = translations[language as keyof typeof translations] || translations.en;
    return langTranslations[key as keyof typeof langTranslations] || key;
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Language Switcher Component
const SimpleLanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const handleLanguageChange = (languageCode: string) => {
    setLanguage(languageCode);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 hover:bg-white/10 text-white"
        >
          <Globe className="w-4 h-4" />
          <span className="text-lg">{currentLanguage.flag}</span>
          <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-48 bg-white/95 backdrop-blur-md border border-white/20"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className="flex items-center justify-between cursor-pointer hover:bg-blue-50"
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{lang.flag}</span>
              <div>
                <div className="font-medium">{lang.nativeName}</div>
                <div className="text-xs text-gray-500">{lang.name}</div>
              </div>
            </div>
            {language === lang.code && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <Check className="w-4 h-4 text-blue-600" />
              </motion.div>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default SimpleLanguageSwitcher; 