import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '../../store/authStore';

interface LoginFormProps {
  onSuccess?: () => void;
}

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const { login, isLoading, error } = useAuthStore();
  const [showHint, setShowHint] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    await login(data.email, data.password);
    if (onSuccess) onSuccess();
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">Welcome back</h1>
        <p className="text-neutral-500 mt-2">Sign in to access your account</p>
      </div>
      
      {error && (
        <div className="mb-6 p-3 bg-error-50 text-error-700 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {showHint && (
        <div className="mb-6 p-3 bg-primary-50 text-primary-700 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium">Demo Credentials</p>
            <p className="text-xs mt-1">Use any email from the mock data with any non-empty password.</p>
            <p className="text-xs mt-1">Example: john.doe@nexuserp.com / password</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          leftIcon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        
        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          leftIcon={<Lock size={18} />}
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required'
          })}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
              {...register('rememberMe')}
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">
              Remember me
            </label>
          </div>
          
          <button
            type="button"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </>
          ) : (
            <>
              <LogIn size={18} className="mr-2" />
              Sign in
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
};