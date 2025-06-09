// API Service Layer for ERP System
// Centralized service for handling external API integrations

import { defaultAPIConfig } from '../config/apiConfig';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  windSpeed: number;
  location: string;
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
  lastUpdated: string;
}

export interface SMSNotification {
  to: string;
  message: string;
  status: 'sent' | 'pending' | 'failed';
}

export interface EmailNotification {
  to: string[];
  subject: string;
  body: string;
  attachments?: string[];
}

class APIService {
  private config = defaultAPIConfig;

  // Weather API for construction planning
  async getWeatherData(city: string): Promise<APIResponse<WeatherData>> {
    try {
      // Using OpenWeatherMap API (available on APIVault)
      const response = await fetch(
        `${this.config.endpoints.weather}?q=${city}&appid=${this.config.apiKeys.weather}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data fetch failed');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          temperature: data.main.temp,
          humidity: data.main.humidity,
          description: data.weather[0].description,
          windSpeed: data.wind.speed,
          location: data.name
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Currency Exchange API for international projects
  async getCurrencyRate(from: string, to: string): Promise<APIResponse<CurrencyRate>> {
    try {
      // Using ExchangeRate API (available on APIVault)
      const response = await fetch(
        `${this.config.endpoints.currency}/${from}`
      );
      
      if (!response.ok) {
        throw new Error('Currency rate fetch failed');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          from,
          to,
          rate: data.rates[to],
          lastUpdated: data.date
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // SMS Notification API for agent communications
  async sendSMS(phoneNumber: string, message: string): Promise<APIResponse<SMSNotification>> {
    try {
      // Using Twilio API or similar SMS service
      const response = await fetch(this.config.endpoints.sms, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKeys.sms}`
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message
        })
      });

      if (!response.ok) {
        throw new Error('SMS send failed');
      }

      const data = await response.json();
      
      return {
        success: true,
        data: {
          to: phoneNumber,
          message,
          status: 'sent'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Email API for automated notifications
  async sendEmail(emailData: EmailNotification): Promise<APIResponse<string>> {
    try {
      const response = await fetch(this.config.endpoints.email, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKeys.email}`
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Email send failed');
      }

      return {
        success: true,
        data: 'Email sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Geocoding API for location services
  async getLocationCoordinates(address: string): Promise<APIResponse<{lat: number, lng: number}>> {
    try {
      const response = await fetch(
        `${this.config.endpoints.geocoding}?q=${encodeURIComponent(address)}&key=${this.config.apiKeys.geocoding}`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }

      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const location = data.results[0].geometry;
        return {
          success: true,
          data: {
            lat: location.lat,
            lng: location.lng
          }
        };
      }

      throw new Error('No location found');
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Machine Learning API for predictive analytics
  async getPredictiveAnalytics(data: any): Promise<APIResponse<any>> {
    try {
      const response = await fetch(this.config.endpoints.machineLearning, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKeys.textAnalysis}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('ML prediction failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Text Analysis API for AI Assistant enhancement
  async analyzeText(text: string): Promise<APIResponse<{sentiment: string, keywords: string[]}>> {
    try {
      const response = await fetch(this.config.endpoints.textAnalysis, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKeys.textAnalysis}`
        },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Text analysis failed');
      }

      const result = await response.json();
      
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

export const apiService = new APIService();
export default apiService; 