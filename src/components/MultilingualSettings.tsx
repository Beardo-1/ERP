import React, { useState } from 'react';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Globe, 
  Calendar, 
  DollarSign, 
  Clock,
  MapPin,
  Palette,
  Bell,
  Save,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface SettingsSection {
  id: string;
  title: string;
  titleAr: string;
  icon: React.ReactNode;
  color: string;
}

const MultilingualSettings: React.FC = () => {
  const { t, isRTL, language, setLanguage } = useLanguage();
  const [settings, setSettings] = useState({
    language: language,
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    numberFormat: 'arabic-indic',
    rtlLayout: language === 'ar',
    notifications: {
      email: true,
      sms: true,
      push: true,
      language: language
    },
    regional: {
      country: 'SA',
      region: 'Riyadh',
      calendar: 'gregorian'
    }
  });
  const [saved, setSaved] = useState(false);

  const settingsSections: SettingsSection[] = [
    {
      id: 'language',
      title: 'Language & Localization',
      titleAr: 'اللغة والتوطين',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'regional',
      title: 'Regional Settings',
      titleAr: 'الإعدادات الإقليمية',
      icon: <MapPin className="w-5 h-5" />,
      color: 'bg-green-500'
    },
    {
      id: 'format',
      title: 'Format Preferences',
      titleAr: 'تفضيلات التنسيق',
      icon: <Calendar className="w-5 h-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      titleAr: 'إعدادات الإشعارات',
      icon: <Bell className="w-5 h-5" />,
      color: 'bg-orange-500'
    }
  ];

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleNestedSettingChange = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof prev] as Record<string, any>),
        [key]: value
      }
    }));
  };

  const handleSave = () => {
    // Apply language change
    if (settings.language !== language) {
      setLanguage(settings.language);
    }
    
    // Save other settings to localStorage
    localStorage.setItem('erp-settings', JSON.stringify(settings));
    
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    const defaultSettings = {
      language: 'en',
      dateFormat: 'dd/mm/yyyy',
      timeFormat: '24h',
      currency: 'SAR',
      timezone: 'Asia/Riyadh',
      numberFormat: 'western',
      rtlLayout: false,
      notifications: {
        email: true,
        sms: true,
        push: true,
        language: 'en'
      },
      regional: {
        country: 'SA',
        region: 'Riyadh',
        calendar: 'gregorian'
      }
    };
    setSettings(defaultSettings);
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-400" />
                <div>
                  <CardTitle className="text-white">
                    {language === 'ar' ? 'إعدادات النظام متعدد اللغات' : 'Multilingual System Settings'}
                  </CardTitle>
                  <p className="text-slate-400 text-sm mt-1">
                    {language === 'ar' 
                      ? 'تخصيص تفضيلات اللغة والتوطين للنظام'
                      : 'Customize language and localization preferences for the system'
                    }
                  </p>
                </div>
              </div>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 text-green-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm">
                    {language === 'ar' ? 'تم الحفظ' : 'Saved'}
                  </span>
                </motion.div>
              )}
            </div>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="language" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-slate-800">
                {settingsSections.map((section) => (
                  <TabsTrigger 
                    key={section.id} 
                    value={section.id}
                    className="data-[state=active]:bg-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span className="hidden sm:inline">
                        {language === 'ar' ? section.titleAr : section.title}
                      </span>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="language" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'لغة الواجهة' : 'Interface Language'}
                      </Label>
                      <Select 
                        value={settings.language} 
                        onValueChange={(value) => handleSettingChange('language', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="ar">🇸🇦 العربية</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="text-white">
                        {language === 'ar' ? 'تخطيط من اليمين إلى اليسار' : 'Right-to-Left Layout'}
                      </Label>
                      <Switch
                        checked={settings.rtlLayout}
                        onCheckedChange={(checked) => handleSettingChange('rtlLayout', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'تنسيق الأرقام' : 'Number Format'}
                      </Label>
                      <Select 
                        value={settings.numberFormat} 
                        onValueChange={(value) => handleSettingChange('numberFormat', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="western">Western (1,234.56)</SelectItem>
                          <SelectItem value="arabic-indic">Arabic-Indic (١٬٢٣٤٫٥٦)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Card className="bg-slate-800/50 border-slate-700">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-white">
                          {language === 'ar' ? 'معاينة' : 'Preview'}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div className="text-sm text-slate-300">
                          <span className="text-slate-400">
                            {language === 'ar' ? 'التاريخ:' : 'Date:'}
                          </span>{' '}
                          {settings.language === 'ar' ? '٢٠٢٤/١٢/١٥' : '15/12/2024'}
                        </div>
                        <div className="text-sm text-slate-300">
                          <span className="text-slate-400">
                            {language === 'ar' ? 'المبلغ:' : 'Amount:'}
                          </span>{' '}
                          {settings.numberFormat === 'arabic-indic' ? '١٬٢٣٤٫٥٦' : '1,234.56'} {settings.currency}
                        </div>
                        <div className="text-sm text-slate-300">
                          <span className="text-slate-400">
                            {language === 'ar' ? 'الوقت:' : 'Time:'}
                          </span>{' '}
                          {settings.timeFormat === '24h' ? '14:30' : '2:30 PM'}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="regional" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'البلد' : 'Country'}
                      </Label>
                      <Select 
                        value={settings.regional.country} 
                        onValueChange={(value) => handleNestedSettingChange('regional', 'country', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SA">🇸🇦 Saudi Arabia</SelectItem>
                          <SelectItem value="AE">🇦🇪 UAE</SelectItem>
                          <SelectItem value="KW">🇰🇼 Kuwait</SelectItem>
                          <SelectItem value="QA">🇶🇦 Qatar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'المنطقة' : 'Region'}
                      </Label>
                      <Select 
                        value={settings.regional.region} 
                        onValueChange={(value) => handleNestedSettingChange('regional', 'region', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Riyadh">الرياض - Riyadh</SelectItem>
                          <SelectItem value="Jeddah">جدة - Jeddah</SelectItem>
                          <SelectItem value="Dammam">الدمام - Dammam</SelectItem>
                          <SelectItem value="Mecca">مكة - Mecca</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}
                      </Label>
                      <Select 
                        value={settings.timezone} 
                        onValueChange={(value) => handleSettingChange('timezone', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Asia/Riyadh">Asia/Riyadh (UTC+3)</SelectItem>
                          <SelectItem value="Asia/Dubai">Asia/Dubai (UTC+4)</SelectItem>
                          <SelectItem value="Asia/Kuwait">Asia/Kuwait (UTC+3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'نوع التقويم' : 'Calendar Type'}
                      </Label>
                      <Select 
                        value={settings.regional.calendar} 
                        onValueChange={(value) => handleNestedSettingChange('regional', 'calendar', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gregorian">
                            {language === 'ar' ? 'الميلادي' : 'Gregorian'}
                          </SelectItem>
                          <SelectItem value="hijri">
                            {language === 'ar' ? 'الهجري' : 'Hijri'}
                          </SelectItem>
                          <SelectItem value="both">
                            {language === 'ar' ? 'كلاهما' : 'Both'}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="format" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'تنسيق التاريخ' : 'Date Format'}
                      </Label>
                      <Select 
                        value={settings.dateFormat} 
                        onValueChange={(value) => handleSettingChange('dateFormat', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                          <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                          <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                          <SelectItem value="dd-mm-yyyy">DD-MM-YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'تنسيق الوقت' : 'Time Format'}
                      </Label>
                      <Select 
                        value={settings.timeFormat} 
                        onValueChange={(value) => handleSettingChange('timeFormat', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="24h">24 Hour (14:30)</SelectItem>
                          <SelectItem value="12h">12 Hour (2:30 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-white">
                        {language === 'ar' ? 'العملة' : 'Currency'}
                      </Label>
                      <Select 
                        value={settings.currency} 
                        onValueChange={(value) => handleSettingChange('currency', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SAR">SAR - Saudi Riyal</SelectItem>
                          <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      {language === 'ar' ? 'إشعارات البريد الإلكتروني' : 'Email Notifications'}
                    </Label>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'email', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      {language === 'ar' ? 'إشعارات الرسائل النصية' : 'SMS Notifications'}
                    </Label>
                    <Switch
                      checked={settings.notifications.sms}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'sms', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-white">
                      {language === 'ar' ? 'الإشعارات الفورية' : 'Push Notifications'}
                    </Label>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) => handleNestedSettingChange('notifications', 'push', checked)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">
                      {language === 'ar' ? 'لغة الإشعارات' : 'Notification Language'}
                    </Label>
                    <Select 
                      value={settings.notifications.language} 
                      onValueChange={(value) => handleNestedSettingChange('notifications', 'language', value)}
                    >
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="both">Both Languages</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between pt-6 border-t border-slate-700">
              <Button
                variant="outline"
                onClick={handleReset}
                className="border-slate-700 hover:bg-slate-800"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </Button>
              
              <Button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {language === 'ar' ? 'حفظ الإعدادات' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default MultilingualSettings; 