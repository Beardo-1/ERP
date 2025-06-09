import { useLanguage } from '../components/SimpleLanguageSwitcher';

// Date formatting with Hijri calendar support
export const formatDate = (date: Date, language: string = 'en', includeHijri: boolean = false): string => {
  if (language === 'ar') {
    const gregorianDate = new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      calendar: 'gregory'
    }).format(date);

    if (includeHijri) {
      try {
        const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }).format(date);
        return `${gregorianDate} (${hijriDate})`;
      } catch {
        return gregorianDate;
      }
    }
    return gregorianDate;
  }
  
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

// Currency formatting with proper SAR placement
export const formatCurrency = (amount: number, language: string = 'en', currency: string = 'SAR'): string => {
  if (language === 'ar') {
    const formatted = new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: currency,
      currencyDisplay: 'name',
      useGrouping: true
    }).format(amount);
    
    // Replace "SAR" with Arabic "ريال سعودي"
    return formatted.replace(/SAR|ر\.س\.?/g, 'ريال سعودي');
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  }).format(amount);
};

// Number formatting with Arabic-Indic numerals option
export const formatNumber = (
  number: number, 
  language: string = 'en', 
  useArabicNumerals: boolean = false
): string => {
  if (language === 'ar' && useArabicNumerals) {
    const formatted = new Intl.NumberFormat('ar-SA-u-nu-arab', {
      useGrouping: true
    }).format(number);
    return formatted;
  }
  
  if (language === 'ar') {
    return new Intl.NumberFormat('ar-SA', {
      useGrouping: true
    }).format(number);
  }
  
  return new Intl.NumberFormat('en-US', {
    useGrouping: true
  }).format(number);
};

// Percentage formatting
export const formatPercentage = (value: number, language: string = 'en'): string => {
  return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value / 100);
};

// Time formatting
export const formatTime = (date: Date, language: string = 'en'): string => {
  return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
};

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date: Date, language: string = 'en'): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  const rtf = new Intl.RelativeTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
    numeric: 'auto'
  });
  
  if (diffInSeconds < 60) {
    return rtf.format(-diffInSeconds, 'second');
  } else if (diffInSeconds < 3600) {
    return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
  } else if (diffInSeconds < 86400) {
    return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
  } else {
    return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
  }
};

// Phone number formatting for Saudi Arabia
export const formatPhoneNumber = (phone: string, language: string = 'en'): string => {
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  // Saudi phone number format: +966 XX XXX XXXX
  if (cleaned.startsWith('966') && cleaned.length === 12) {
    const formatted = `+966 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
    return formatted;
  } else if (cleaned.startsWith('0') && cleaned.length === 10) {
    // Local format: 0XX XXX XXXX
    const formatted = `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return formatted;
  }
  
  return phone; // Return original if format not recognized
};

// Address formatting for Saudi Arabia
export const formatAddress = (address: {
  street?: string;
  district?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}, language: string = 'en'): string => {
  const parts = [];
  
  if (language === 'ar') {
    // Arabic address format: Street, District, City, Region, Postal Code
    if (address.street) parts.push(address.street);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.postalCode) parts.push(address.postalCode);
  } else {
    // English address format
    if (address.street) parts.push(address.street);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    if (address.region) parts.push(address.region);
    if (address.postalCode) parts.push(address.postalCode);
  }
  
  return parts.join(', ');
};

// Pluralization rules for Arabic
export const getArabicPluralForm = (count: number): string => {
  if (count === 0) return 'zero';
  if (count === 1) return 'one';
  if (count === 2) return 'two';
  if (count >= 3 && count <= 10) return 'few';
  if (count >= 11 && count <= 99) return 'many';
  return 'other';
};

// Text direction utilities
export const getTextDirection = (language: string): 'ltr' | 'rtl' => {
  return language === 'ar' ? 'rtl' : 'ltr';
};

export const getTextAlign = (language: string): 'left' | 'right' => {
  return language === 'ar' ? 'right' : 'left';
};

// Localized sorting
export const createLocalizedSort = (language: string) => {
  const collator = new Intl.Collator(language === 'ar' ? 'ar-SA' : 'en-US', {
    numeric: true,
    sensitivity: 'base'
  });
  
  return (a: string, b: string) => collator.compare(a, b);
};

// Export utility hook
export const useLocalization = () => {
  const { language } = useLanguage();
  
  return {
    formatDate: (date: Date, includeHijri?: boolean) => formatDate(date, language, includeHijri),
    formatCurrency: (amount: number, currency?: string) => formatCurrency(amount, language, currency),
    formatNumber: (number: number, useArabicNumerals?: boolean) => formatNumber(number, language, useArabicNumerals),
    formatPercentage: (value: number) => formatPercentage(value, language),
    formatTime: (date: Date) => formatTime(date, language),
    formatRelativeTime: (date: Date) => formatRelativeTime(date, language),
    formatPhoneNumber: (phone: string) => formatPhoneNumber(phone, language),
    formatAddress: (address: any) => formatAddress(address, language),
    getTextDirection: () => getTextDirection(language),
    getTextAlign: () => getTextAlign(language),
    createSort: () => createLocalizedSort(language),
    isRTL: language === 'ar'
  };
}; 