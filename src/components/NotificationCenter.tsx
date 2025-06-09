import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  DollarSign,
  Calendar,
  Users,
  Building,
  Clock,
  Mail,
  MessageSquare,
  AlertCircle,
  Send,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';
import apiService from '../services/apiService';

interface Notification {
  id: string;
  type: 'email' | 'sms' | 'system' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  recipient?: string;
  status?: 'pending' | 'sent' | 'failed';
}

interface NotificationTemplate {
  id: string;
  name: string;
  type: 'email' | 'sms';
  subject?: string;
  body: string;
  variables: string[];
}

const NotificationCenter: React.FC = () => {
  const { t, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<'notifications' | 'send' | 'templates'>('notifications');
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Send notification form state
  const [sendForm, setSendForm] = useState({
    type: 'email' as 'email' | 'sms',
    recipient: '',
    subject: '',
    message: '',
    template: ''
  });

  // Notification templates
  const [templates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'Agent Welcome',
      type: 'email',
      subject: 'Welcome to Our Team, {{agentName}}!',
      body: 'Dear {{agentName}},\n\nWelcome to our collection team! Your employee ID is {{employeeId}}.\n\nBest regards,\nManagement Team',
      variables: ['agentName', 'employeeId']
    },
    {
      id: '2',
      name: 'Payment Reminder',
      type: 'sms',
      body: 'Dear {{clientName}}, your payment of {{amount}} SAR is due on {{dueDate}}. Please contact us for assistance.',
      variables: ['clientName', 'amount', 'dueDate']
    },
    {
      id: '3',
      name: 'Project Update',
      type: 'email',
      subject: 'Project {{projectName}} Status Update',
      body: 'Dear {{clientName}},\n\nYour project {{projectName}} is now {{status}}. Completion is expected by {{expectedDate}}.\n\nRegards,\nProject Team',
      variables: ['clientName', 'projectName', 'status', 'expectedDate']
    }
  ]);

  // Sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        type: 'system',
        title: 'New Agent Registered',
        message: 'Ahmed Al-Rashid has been successfully added to the system',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
        priority: 'medium'
      },
      {
        id: '2',
        type: 'alert',
        title: 'Payment Overdue',
        message: 'Client payment of 50,000 SAR is 15 days overdue',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        read: false,
        priority: 'high'
      },
      {
        id: '3',
        type: 'email',
        title: 'Email Sent Successfully',
        message: 'Project update sent to 15 clients',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: true,
        priority: 'low',
        status: 'sent'
      }
    ];
    
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);

  const handleSendNotification = async () => {
    if (!sendForm.recipient || !sendForm.message) return;

    const newNotification: Notification = {
      id: Date.now().toString(),
      type: sendForm.type,
      title: `${sendForm.type.toUpperCase()} Notification`,
      message: `Sent to ${sendForm.recipient}`,
      timestamp: new Date(),
      read: false,
      priority: 'medium',
      recipient: sendForm.recipient,
      status: 'pending'
    };

    setNotifications(prev => [newNotification, ...prev]);

    try {
      if (sendForm.type === 'email') {
        const result = await apiService.sendEmail({
          to: [sendForm.recipient],
          subject: sendForm.subject,
          body: sendForm.message
        });

        if (result.success) {
          updateNotificationStatus(newNotification.id, 'sent');
        } else {
          updateNotificationStatus(newNotification.id, 'failed');
        }
      } else if (sendForm.type === 'sms') {
        const result = await apiService.sendSMS(sendForm.recipient, sendForm.message);

        if (result.success) {
          updateNotificationStatus(newNotification.id, 'sent');
        } else {
          updateNotificationStatus(newNotification.id, 'failed');
        }
      }
    } catch (error) {
      updateNotificationStatus(newNotification.id, 'failed');
    }

    // Reset form
    setSendForm({
      type: 'email',
      recipient: '',
      subject: '',
      message: '',
      template: ''
    });
  };

  const updateNotificationStatus = (id: string, status: 'sent' | 'failed') => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, status }
          : notification
      )
    );
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const applyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setSendForm(prev => ({
        ...prev,
        type: template.type,
        subject: template.subject || '',
        message: template.body,
        template: templateId
      }));
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'alert': return <AlertCircle className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'sent': return 'text-green-600';
      case 'failed': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700/50"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Notification Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute top-12 ${isRTL ? 'left-0' : 'right-0'} w-96 z-50`}
            >
              <Card className="bg-slate-800/95 border-slate-700 backdrop-blur-xl shadow-2xl">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      {isRTL ? 'الإشعارات' : 'Notifications'}
                    </h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            markAllAsRead();
                            setIsOpen(false);
                          }}
                          className="text-xs text-slate-400 hover:text-white"
                        >
                          {isRTL ? 'قراءة الكل' : 'Mark all read'}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsOpen(false)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b">
                  {[
                    { key: 'notifications', label: 'Notifications', icon: Bell },
                    { key: 'send', label: 'Send', icon: Send },
                    { key: 'templates', label: 'Templates', icon: Settings }
                  ].map(({ key, label, icon: Icon }) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key as any)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors ${
                        activeTab === key
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Content */}
                <div className="max-h-96 overflow-y-auto">
                  {activeTab === 'notifications' && (
                    <div className="p-4 space-y-3">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400">
                          <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>{isRTL ? 'لا توجد إشعارات' : 'No notifications'}</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 rounded-lg border transition-colors ${
                              notification.read ? 'bg-gray-50' : 'bg-white border-blue-200'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3 flex-1">
                                <div className={`p-1 rounded ${getPriorityColor(notification.priority)}`}>
                                  {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="text-sm font-medium text-gray-900 truncate">
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {notification.message}
                                  </p>
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    <span>{notification.timestamp.toLocaleTimeString()}</span>
                                    {notification.status && (
                                      <span className={`font-medium ${getStatusColor(notification.status)}`}>
                                        • {notification.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Mark as read"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteNotification(notification.id)}
                                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                                  title="Delete"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'send' && (
                    <div className="p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notification Type
                        </label>
                        <select
                          value={sendForm.type}
                          onChange={(e) => setSendForm(prev => ({ ...prev, type: e.target.value as 'email' | 'sms' }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="email">Email</option>
                          <option value="sms">SMS</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Template (Optional)
                        </label>
                        <select
                          value={sendForm.template}
                          onChange={(e) => applyTemplate(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a template</option>
                          {templates
                            .filter(t => t.type === sendForm.type)
                            .map(template => (
                              <option key={template.id} value={template.id}>
                                {template.name}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipient
                        </label>
                        <input
                          type={sendForm.type === 'email' ? 'email' : 'tel'}
                          value={sendForm.recipient}
                          onChange={(e) => setSendForm(prev => ({ ...prev, recipient: e.target.value }))}
                          placeholder={sendForm.type === 'email' ? 'email@example.com' : '+966501234567'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      {sendForm.type === 'email' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={sendForm.subject}
                            onChange={(e) => setSendForm(prev => ({ ...prev, subject: e.target.value }))}
                            placeholder="Email subject"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Message
                        </label>
                        <textarea
                          value={sendForm.message}
                          onChange={(e) => setSendForm(prev => ({ ...prev, message: e.target.value }))}
                          placeholder="Enter your message here..."
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <button
                        onClick={handleSendNotification}
                        disabled={!sendForm.recipient || !sendForm.message}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Send {sendForm.type === 'email' ? 'Email' : 'SMS'}
                      </button>
                    </div>
                  )}

                  {activeTab === 'templates' && (
                    <div className="p-4 space-y-3">
                      {templates.map((template) => (
                        <div key={template.id} className="p-3 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              template.type === 'email' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {template.type.toUpperCase()}
                            </span>
                          </div>
                          {template.subject && (
                            <p className="text-sm text-gray-600 mb-1">
                              <strong>Subject:</strong> {template.subject}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mb-2">
                            {template.body.substring(0, 100)}...
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              Variables: {template.variables.join(', ')}
                            </div>
                            <button
                              onClick={() => applyTemplate(template.id)}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Use Template
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationCenter; 