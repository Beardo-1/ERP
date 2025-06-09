# ERP System Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory with the following variables:

```env
# Weather API (OpenWeatherMap) - Free tier available
VITE_WEATHER_API_KEY=your_openweathermap_api_key

# SMS API (Twilio) - Free trial available
VITE_SMS_API_KEY=your_twilio_api_key

# Email API (SendGrid) - Free tier available
VITE_EMAIL_API_KEY=your_sendgrid_api_key

# Geocoding API (OpenCage) - Free tier available
VITE_GEOCODING_API_KEY=your_opencage_api_key

# Currency API (ExchangeRate-API) - Free tier available
VITE_CURRENCY_API_KEY=your_currency_api_key

# Text Analysis API (TextRazor) - Free tier available
VITE_TEXT_ANALYSIS_API_KEY=your_textrazor_api_key
```

### 3. Get Free API Keys

#### Weather API (OpenWeatherMap)
1. Visit: https://openweathermap.org/api
2. Sign up for free account
3. Get your API key from dashboard
4. Free tier: 1,000 calls/day

#### SMS API (Twilio)
1. Visit: https://www.twilio.com/
2. Sign up for free trial
3. Get your Account SID and Auth Token
4. Free trial: $15 credit

#### Email API (SendGrid)
1. Visit: https://sendgrid.com/
2. Sign up for free account
3. Create API key in settings
4. Free tier: 100 emails/day

#### Geocoding API (OpenCage)
1. Visit: https://opencagedata.com/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 2,500 requests/day

#### Currency API (ExchangeRate-API)
1. Visit: https://exchangerate-api.com/
2. Sign up for free account
3. Get API key from dashboard
4. Free tier: 1,500 requests/month

#### Text Analysis API (TextRazor)
1. Visit: https://www.textrazor.com/
2. Sign up for free account
3. Get API key from account page
4. Free tier: 500 requests/day

### 4. Start Development Server
```bash
npm run dev
```

## 🔧 Development Mode

The system works with demo data even without API keys. All external API calls have fallback mechanisms:

- **Weather**: Shows sample weather data for Riyadh
- **SMS/Email**: Simulates successful sending
- **Geocoding**: Uses default coordinates
- **Currency**: Shows static exchange rates
- **Text Analysis**: Returns mock sentiment data

## 🌟 Features Available

### Without API Keys (Demo Mode)
- ✅ Project management
- ✅ Agent bulk upload
- ✅ Photo management
- ✅ AI assistant (with mock responses)
- ✅ Weather dashboard (with sample data)
- ✅ Notification center (local notifications)

### With API Keys (Full Functionality)
- ✅ Real-time weather data
- ✅ Actual SMS/Email sending
- ✅ Live geocoding
- ✅ Current exchange rates
- ✅ AI text analysis
- ✅ Enhanced AI responses

## 🚨 Troubleshooting

### Common Issues

#### 1. "process is not defined" Error
- **Solution**: Use `import.meta.env` instead of `process.env`
- **Fixed**: Already updated in the codebase

#### 2. API Key Not Working
- **Check**: Ensure `.env` file is in root directory
- **Check**: Variable names start with `VITE_`
- **Check**: Restart development server after adding keys

#### 3. CORS Errors
- **Solution**: APIs are configured with proper CORS headers
- **Fallback**: Demo data will be used automatically

#### 4. Rate Limit Exceeded
- **Solution**: System automatically handles rate limits
- **Fallback**: Cached data or demo data will be used

### Environment Variables Debug

Add this to check if environment variables are loaded:

```javascript
console.log('Environment check:', {
  weather: import.meta.env?.VITE_WEATHER_API_KEY ? '✅ Loaded' : '❌ Missing',
  sms: import.meta.env?.VITE_SMS_API_KEY ? '✅ Loaded' : '❌ Missing',
  email: import.meta.env?.VITE_EMAIL_API_KEY ? '✅ Loaded' : '❌ Missing',
});
```

## 📱 Mobile Development

The system is fully responsive and works on:
- 📱 Mobile devices
- 📱 Tablets
- 💻 Desktop computers
- 🖥️ Large screens

## 🔐 Security Notes

- Never commit `.env` file to version control
- Use different API keys for development/production
- Regularly rotate API keys
- Monitor API usage and costs
- Enable rate limiting on production

## 📊 Performance Tips

1. **API Caching**: Responses are cached automatically
2. **Lazy Loading**: Components load on demand
3. **Image Optimization**: Photos are compressed
4. **Code Splitting**: Reduces initial bundle size

## 🎯 Next Steps

1. Set up API keys for full functionality
2. Customize the UI theme and branding
3. Add your company logo and colors
4. Configure email templates
5. Set up production deployment

## 📞 Support

For technical support:
- Check the API_INTEGRATION_GUIDE.md
- Review component documentation
- Check browser console for errors
- Verify API key configuration

---

**Happy coding! 🚀** 