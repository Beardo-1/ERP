import React from 'react';
import { motion } from 'framer-motion';
import { LoginForm } from '../components/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center p-4">
      <motion.div 
        className="bg-white shadow-card rounded-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="md:w-1/2 bg-primary-700 p-8 flex flex-col justify-center text-white hidden md:block">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Nexus ERP/CRM</h1>
            <p className="mt-2 text-primary-100">All-in-one business management platform</p>
          </div>
          
          <ul className="space-y-4">
            <li className="flex items-start">
              <div className="rounded-full bg-primary-500 p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Customer Management</h3>
                <p className="text-sm text-primary-200 mt-1">Track all your customer interactions in one place</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="rounded-full bg-primary-500 p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Sales Pipeline</h3>
                <p className="text-sm text-primary-200 mt-1">Visualize and optimize your entire sales process</p>
              </div>
            </li>
            
            <li className="flex items-start">
              <div className="rounded-full bg-primary-500 p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Project Management</h3>
                <p className="text-sm text-primary-200 mt-1">Plan, track, and manage all your projects efficiently</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <LoginForm />
        </div>
      </motion.div>
    </div>
  );
};