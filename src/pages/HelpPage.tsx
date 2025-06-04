import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '../components/ui/card';

const HelpPage: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [activeCategory, setActiveCategory] = useState('getting-started');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: '', email: '', message: '' });
  };

  const categories = [
    { id: 'getting-started', name: 'Getting Started', icon: '🚀' },
    { id: 'account', name: 'Account & Billing', icon: '👤' },
    { id: 'features', name: 'Features', icon: '⚡' },
    { id: 'troubleshooting', name: 'Troubleshooting', icon: '🔧' },
    { id: 'api', name: 'API & Integrations', icon: '🔗' },
  ];

  const faqs = {
    'getting-started': [
      {
        question: 'How do I get started with Nexus ERP?',
        answer: 'Welcome to Nexus ERP! Start by setting up your company profile in Settings, then add your first customers and properties. Our onboarding wizard will guide you through the essential steps.'
      },
      {
        question: 'How do I add a new customer?',
        answer: 'Navigate to the Customers module and click "Add New Customer". Fill in the required information including name, email, and contact details. You can also add additional contacts and notes.'
      },
      {
        question: 'How do I create my first property listing?',
        answer: 'Go to the Property Management section and click "Add New Property". Enter the property details, upload images, and set the status to make it available for leasing or sale.'
      }
    ],
    'account': [
      {
        question: 'How do I reset my password?',
        answer: 'Go to Settings > Security and click "Change Password". You can also use the "Forgot Password" link on the login page to receive a reset email.'
      },
      {
        question: 'How do I upgrade my subscription?',
        answer: 'Visit Settings > Billing to view available plans and upgrade your subscription. Changes take effect immediately and you\'ll be prorated for the current billing period.'
      },
      {
        question: 'How do I update my billing information?',
        answer: 'In Settings > Billing, click "Update Payment" to change your credit card or billing address. All changes are processed securely through our payment provider.'
      }
    ],
    'features': [
      {
        question: 'How do I use the dashboard widgets?',
        answer: 'Dashboard widgets can be customized by clicking the settings icon. You can resize, move, and configure each widget to display the data most relevant to your business.'
      },
      {
        question: 'How do I generate reports?',
        answer: 'Visit the Reports & Analytics section to create custom reports. Select your date range, filters, and metrics to generate insights about your business performance.'
      },
      {
        question: 'How do I manage document uploads?',
        answer: 'Use the Document Management section to upload, organize, and share files. You can categorize documents by type and associate them with specific properties or customers.'
      }
    ],
    'troubleshooting': [
      {
        question: 'Why can\'t I see my data?',
        answer: 'Check your internet connection and refresh the page. If the issue persists, verify your account permissions or contact support for assistance.'
      },
      {
        question: 'The application is running slowly',
        answer: 'Clear your browser cache and cookies. Ensure you\'re using a supported browser version. Large datasets may take longer to load - consider using filters to improve performance.'
      },
      {
        question: 'I\'m getting error messages',
        answer: 'Note the exact error message and the steps that led to it. Try refreshing the page or logging out and back in. Contact support with the error details if the problem continues.'
      }
    ],
    'api': [
      {
        question: 'How do I access the API?',
        answer: 'API access is available on Professional and Enterprise plans. Generate your API key in Settings > Integrations and refer to our API documentation for endpoints and authentication.'
      },
      {
        question: 'What integrations are available?',
        answer: 'We support integrations with popular CRM systems, accounting software, and marketing platforms. Check our integrations marketplace for the full list of available connections.'
      },
      {
        question: 'How do I set up webhooks?',
        answer: 'Configure webhooks in Settings > Integrations to receive real-time notifications about events in your account. You can customize which events trigger notifications to your endpoint.'
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Help & Support Center
          </h1>
          <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto">
            Find answers to common questions, browse our knowledge base, or get in touch with our support team
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="p-6 text-center">
              <div className="bg-blue-400 bg-opacity-30 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Browse FAQ</h3>
              <p className="text-blue-100">Find quick answers to common questions</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="p-6 text-center">
              <div className="bg-green-400 bg-opacity-30 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Documentation</h3>
              <p className="text-green-100">Comprehensive guides and tutorials</p>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="p-6 text-center">
              <div className="bg-purple-400 bg-opacity-30 p-4 rounded-xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Live Chat</h3>
              <p className="text-purple-100">Chat with our support team</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FAQ Section */}
        <div className="lg:col-span-2">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeCategory === category.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50 border border-gray-200'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* FAQ Items */}
              <div className="space-y-4">
                {faqs[activeCategory as keyof typeof faqs]?.map((faq, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all duration-200">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="space-y-6">
          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Support</h3>
              <p className="text-gray-600 text-sm mb-6">
                Can't find what you're looking for? Send us a message and we'll get back to you within 24 hours.
              </p>
              
              {sent && (
                <div className="mb-4 p-3 bg-green-100 border border-green-200 rounded-xl text-green-800 text-sm flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Message sent successfully!
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
                
                <div>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium resize-none"
                    placeholder="How can we help you?"
                    value={form.message}
                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  Send Message
                </Button>
      </form>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">support@nexuserp.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Business Hours</p>
                    <p className="text-sm text-gray-600">Mon-Fri, 9 AM - 6 PM EST</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Services</span>
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Database</span>
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File Storage</span>
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Operational
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4 text-gray-600 border-gray-200 hover:bg-gray-50">
                View Status Page
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpPage; 
