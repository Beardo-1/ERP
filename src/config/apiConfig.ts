// API Configuration for ERP System
// Centralized configuration for external API integrations

export interface APIConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  apiKeys: {
    weather: string;
    sms: string;
    email: string;
    geocoding: string;
    currency: string;
    textAnalysis: string;
  };
  endpoints: {
    weather: string;
    sms: string;
    email: string;
    geocoding: string;
    currency: string;
    textAnalysis: string;
    machineLearning: string;
  };
}

// Default configuration
export const defaultAPIConfig: APIConfig = {
  baseURL: 'https://api.apivault.dev',
  timeout: 10000, // 10 seconds
  retryAttempts: 3,
  apiKeys: {
    weather: import.meta.env?.VITE_WEATHER_API_KEY || 'demo_key',
    sms: import.meta.env?.VITE_SMS_API_KEY || 'demo_key',
    email: import.meta.env?.VITE_EMAIL_API_KEY || 'demo_key',
    geocoding: import.meta.env?.VITE_GEOCODING_API_KEY || 'demo_key',
    currency: import.meta.env?.VITE_CURRENCY_API_KEY || 'demo_key',
    textAnalysis: import.meta.env?.VITE_TEXT_ANALYSIS_API_KEY || 'demo_key'
  },
  endpoints: {
    weather: 'https://api.openweathermap.org/data/2.5/weather',
    sms: '/api/sms/send',
    email: '/api/email/send',
    geocoding: 'https://api.opencagedata.com/geocode/v1/json',
    currency: 'https://api.exchangerate-api.com/v4/latest',
    textAnalysis: '/api/text/analyze',
    machineLearning: '/api/ml/predict'
  }
};

// API Vault Categories and Available APIs
export const apiVaultCategories = {
  weather: [
    {
      name: 'OpenWeatherMap',
      url: 'https://openweathermap.org/api',
      description: 'Current weather, forecasts, and historical data',
      features: ['Current Weather', '5-day Forecast', 'Weather Maps', 'Weather Alerts']
    },
    {
      name: 'WeatherAPI',
      url: 'https://www.weatherapi.com/',
      description: 'Real-time weather data and forecasts',
      features: ['Real-time Weather', 'Forecast', 'Historical Data', 'Weather Alerts']
    }
  ],
  sms: [
    {
      name: 'Twilio',
      url: 'https://www.twilio.com/sms',
      description: 'SMS messaging service',
      features: ['Send SMS', 'Receive SMS', 'Message Status', 'International SMS']
    },
    {
      name: 'MessageBird',
      url: 'https://messagebird.com/',
      description: 'Global SMS messaging platform',
      features: ['SMS API', 'Voice API', 'WhatsApp Business', 'Verify API']
    }
  ],
  email: [
    {
      name: 'SendGrid',
      url: 'https://sendgrid.com/',
      description: 'Email delivery service',
      features: ['Transactional Email', 'Marketing Email', 'Email Templates', 'Analytics']
    },
    {
      name: 'Mailgun',
      url: 'https://www.mailgun.com/',
      description: 'Email automation service',
      features: ['Email API', 'Email Validation', 'Inbound Routing', 'Analytics']
    }
  ],
  geocoding: [
    {
      name: 'OpenCage Geocoding',
      url: 'https://opencagedata.com/',
      description: 'Forward and reverse geocoding',
      features: ['Address to Coordinates', 'Coordinates to Address', 'Batch Geocoding', 'Global Coverage']
    },
    {
      name: 'Google Geocoding',
      url: 'https://developers.google.com/maps/documentation/geocoding',
      description: 'Google Maps geocoding service',
      features: ['Geocoding', 'Reverse Geocoding', 'Address Validation', 'Place Details']
    }
  ],
  currency: [
    {
      name: 'ExchangeRate-API',
      url: 'https://exchangerate-api.com/',
      description: 'Real-time currency exchange rates',
      features: ['Live Rates', 'Historical Data', 'Currency Conversion', '168 Currencies']
    },
    {
      name: 'Fixer.io',
      url: 'https://fixer.io/',
      description: 'Foreign exchange rates API',
      features: ['Real-time Rates', 'Historical Data', 'Currency Conversion', 'Time-series Data']
    }
  ],
  textAnalysis: [
    {
      name: 'TextRazor',
      url: 'https://www.textrazor.com/',
      description: 'Text analysis and natural language processing',
      features: ['Entity Extraction', 'Sentiment Analysis', 'Topic Classification', 'Language Detection']
    },
    {
      name: 'IBM Watson',
      url: 'https://www.ibm.com/watson/services/natural-language-understanding/',
      description: 'Natural language understanding',
      features: ['Sentiment Analysis', 'Entity Recognition', 'Keyword Extraction', 'Emotion Analysis']
    }
  ],
  machineLearning: [
    {
      name: 'Google Cloud ML',
      url: 'https://cloud.google.com/ml-engine',
      description: 'Machine learning platform',
      features: ['Custom Models', 'Pre-trained Models', 'AutoML', 'Prediction API']
    },
    {
      name: 'Azure ML',
      url: 'https://azure.microsoft.com/en-us/services/machine-learning/',
      description: 'Azure machine learning service',
      features: ['Model Training', 'Model Deployment', 'AutoML', 'MLOps']
    }
  ]
};

// Saudi Arabia specific configurations
export const saudiConfig = {
  cities: [
    'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 
    'Dhahran', 'Tabuk', 'Buraidah', 'Khamis Mushait', 'Hail', 'Najran',
    'Abha', 'Yanbu', 'Al Jubail', 'Taif', 'Qatif', 'Sakaka'
  ],
  phoneFormat: '+966',
  currency: 'SAR',
  timezone: 'Asia/Riyadh',
  workingHours: {
    start: '07:00',
    end: '15:00',
    breakStart: '12:00',
    breakEnd: '13:00'
  },
  constructionSeasons: {
    optimal: ['November', 'December', 'January', 'February', 'March'],
    challenging: ['June', 'July', 'August', 'September'],
    moderate: ['April', 'May', 'October']
  }
};

// API Rate Limits and Usage Guidelines
export const apiLimits = {
  weather: {
    requestsPerMinute: 60,
    requestsPerDay: 1000,
    cacheDuration: 600000 // 10 minutes
  },
  sms: {
    requestsPerMinute: 10,
    requestsPerDay: 100,
    cacheDuration: 0 // No caching for SMS
  },
  email: {
    requestsPerMinute: 20,
    requestsPerDay: 500,
    cacheDuration: 0 // No caching for emails
  },
  geocoding: {
    requestsPerMinute: 30,
    requestsPerDay: 2500,
    cacheDuration: 86400000 // 24 hours
  },
  currency: {
    requestsPerMinute: 100,
    requestsPerDay: 1000,
    cacheDuration: 3600000 // 1 hour
  },
  textAnalysis: {
    requestsPerMinute: 50,
    requestsPerDay: 1000,
    cacheDuration: 1800000 // 30 minutes
  }
};

// Error handling configurations
export const errorConfig = {
  retryDelays: [1000, 2000, 4000], // Exponential backoff
  timeoutMessages: {
    weather: 'Weather service is temporarily unavailable',
    sms: 'SMS service is temporarily unavailable',
    email: 'Email service is temporarily unavailable',
    geocoding: 'Location service is temporarily unavailable',
    currency: 'Currency service is temporarily unavailable',
    textAnalysis: 'Text analysis service is temporarily unavailable'
  },
  fallbackData: {
    weather: {
      temperature: 35,
      humidity: 40,
      description: 'Clear Sky',
      windSpeed: 10,
      location: 'Riyadh'
    },
    currency: {
      USD: 3.75,
      EUR: 4.10,
      GBP: 4.65,
      AED: 1.02
    }
  }
};

export default defaultAPIConfig; 