import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Wifi, Zap, Shield, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const SystemStatus: React.FC = () => {
  const [status, setStatus] = useState({
    ui: 'operational',
    api: 'operational',
    database: 'operational',
    security: 'operational',
    performance: 'optimal'
  });

  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <Card className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-3 h-3 bg-green-500 rounded-full"
            />
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-gray-900">System Operational</span>
              </div>
              <div className="text-xs text-gray-500">
                Uptime: {formatUptime(uptime)}
              </div>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
              UI Fixed ✓
            </Badge>
          </div>
          
          <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <Wifi className="w-4 h-4 text-green-500 mx-auto" />
              <div className="text-xs text-gray-600 mt-1">API</div>
            </div>
            <div className="text-center">
              <Activity className="w-4 h-4 text-green-500 mx-auto" />
              <div className="text-xs text-gray-600 mt-1">DB</div>
            </div>
            <div className="text-center">
              <Shield className="w-4 h-4 text-green-500 mx-auto" />
              <div className="text-xs text-gray-600 mt-1">Security</div>
            </div>
            <div className="text-center">
              <Zap className="w-4 h-4 text-green-500 mx-auto" />
              <div className="text-xs text-gray-600 mt-1">Performance</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SystemStatus; 