import { useState, useEffect, useCallback, useRef } from 'react';

// Simple toast notification function (can be replaced with actual toast library)
const toast = {
  success: (message: string) => console.log('✅ Success:', message),
  error: (message: string) => console.error('❌ Error:', message),
};

// Generic API hook interface
interface UseApiOptions {
  immediate?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
}

// Simple in-memory cache
class ApiCache {
  private cache = new Map<string, { data: any; timestamp: number; duration: number }>();

  set(key: string, data: any, duration: number = 5 * 60 * 1000) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      duration,
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > cached.duration;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear(key?: string) {
    if (key) {
      this.cache.delete(key);
    } else {
      this.cache.clear();
    }
  }
}

const apiCache = new ApiCache();

// Generic API hook
export function useApi<T = any>(
  apiFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions = {}
): UseApiState<T> {
  const {
    immediate = false,
    onSuccess,
    onError,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minutes default
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setLoading(true);
        setError(null);

        // Check cache first
        if (cacheKey) {
          const cachedData = apiCache.get(cacheKey);
          if (cachedData) {
            if (mountedRef.current) {
              setData(cachedData);
              setLoading(false);
            }
            return cachedData;
          }
        }

        const response = await apiFunction(...args);
        const responseData = response.data || response;

        if (mountedRef.current) {
          setData(responseData);
          setLoading(false);

          // Cache the data
          if (cacheKey) {
            apiCache.set(cacheKey, responseData, cacheDuration);
          }

          if (onSuccess) {
            onSuccess(responseData);
          }
        }

        return responseData;
      } catch (err: any) {
        if (mountedRef.current) {
          const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
          setError(errorMessage);
          setLoading(false);

          if (onError) {
            onError(err);
          } else {
            toast.error(errorMessage);
          }
        }
        return null;
      }
    },
    [apiFunction, onSuccess, onError, cacheKey, cacheDuration]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
    if (cacheKey) {
      apiCache.clear(cacheKey);
    }
  }, [cacheKey]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, execute]);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

// Specialized hooks for different modules

// Dashboard hooks
export function useDashboardMetrics() {
  return useApi(
    async () => {
      // Mock data for now
      return {
        totalRevenue: 2847392,
        totalExpenses: 1923847,
        netProfit: 923545,
        activeProjects: 156,
        totalCustomers: 2847,
        inventoryValue: 890000,
        openOrders: 342,
        activeEmployees: 127,
      };
    },
    {
      immediate: true,
      cacheKey: 'dashboard-metrics',
      cacheDuration: 2 * 60 * 1000, // 2 minutes
    }
  );
}

// Sales hooks
export function useSalesData() {
  return useApi(
    async () => {
      // Mock data
      return {
        leads: [
          { id: '1', name: 'ABC Corp', value: 50000, status: 'qualified' },
          { id: '2', name: 'XYZ Ltd', value: 75000, status: 'proposal' },
        ],
        opportunities: [
          { id: '1', name: 'Office Lease', value: 120000, probability: 80 },
          { id: '2', name: 'Warehouse Rental', value: 95000, probability: 60 },
        ],
      };
    },
    {
      immediate: true,
      cacheKey: 'sales-data',
    }
  );
}

// Project hooks
export function useProjects() {
  return useApi(
    async () => {
      // Mock data
      return [
        {
          id: 'PRJ001',
          name: 'Downtown Office Complex',
          status: 'active',
          progress: 65,
          budget: 2500000,
          spent: 1625000,
        },
        {
          id: 'PRJ002',
          name: 'Residential Tower A',
          status: 'planning',
          progress: 15,
          budget: 3200000,
          spent: 480000,
        },
      ];
    },
    {
      immediate: true,
      cacheKey: 'projects',
    }
  );
}

// Inventory hooks
export function useInventoryItems() {
  return useApi(
    async () => {
      // Mock data
      return [
        {
          id: 'INV001',
          name: 'Steel Beams - Grade A',
          sku: 'STL-BM-001',
          currentStock: 150,
          minStock: 50,
          status: 'in-stock',
          unitPrice: 450,
          totalValue: 67500,
        },
        {
          id: 'INV002',
          name: 'Concrete Mix - Premium',
          sku: 'CON-MX-002',
          currentStock: 25,
          minStock: 30,
          status: 'low-stock',
          unitPrice: 85,
          totalValue: 2125,
        },
      ];
    },
    {
      immediate: true,
      cacheKey: 'inventory-items',
    }
  );
}

// HR hooks
export function useEmployees() {
  return useApi(
    async () => {
      // Mock data
      return [
        {
          id: 'EMP001',
          name: 'John Doe',
          position: 'Senior Project Manager',
          department: 'Operations',
          salary: 85000,
          status: 'active',
          performance: 92,
        },
        {
          id: 'EMP002',
          name: 'Jane Smith',
          position: 'Lead Developer',
          department: 'Technology',
          salary: 78000,
          status: 'active',
          performance: 88,
        },
      ];
    },
    {
      immediate: true,
      cacheKey: 'employees',
    }
  );
}

// Financial hooks
export function useFinancialData() {
  return useApi(
    async () => {
      // Mock data
      return {
        transactions: [
          {
            id: 'TXN001',
            date: '2024-01-15',
            description: 'Property Sale Commission',
            amount: 25000,
            type: 'income',
            status: 'completed',
          },
          {
            id: 'TXN002',
            date: '2024-01-14',
            description: 'Office Rent Payment',
            amount: -8500,
            type: 'expense',
            status: 'completed',
          },
        ],
        invoices: [
          {
            id: 'INV001',
            customerName: 'ABC Corporation',
            amount: 45000,
            dueDate: '2024-02-15',
            status: 'sent',
          },
          {
            id: 'INV002',
            customerName: 'XYZ Properties',
            amount: 32000,
            dueDate: '2024-01-20',
            status: 'overdue',
          },
        ],
      };
    },
    {
      immediate: true,
      cacheKey: 'financial-data',
    }
  );
}

// Workflow hooks
export function useWorkflows() {
  return useApi(
    async () => {
      // Mock data
      return [
        {
          id: 'WF001',
          name: 'Invoice Approval Process',
          status: 'active',
          executions: 234,
          successRate: 96.5,
          category: 'Finance',
        },
        {
          id: 'WF002',
          name: 'Employee Onboarding',
          status: 'active',
          executions: 45,
          successRate: 100,
          category: 'HR',
        },
      ];
    },
    {
      immediate: true,
      cacheKey: 'workflows',
    }
  );
}

// Custom hook for form submissions
export function useFormSubmit<T = any>(
  submitFunction: (data: any) => Promise<any>,
  options: UseApiOptions = {}
) {
  const { onSuccess, onError } = options;

  return useApi<T>(submitFunction, {
    onSuccess: (data) => {
      toast.success('Operation completed successfully');
      if (onSuccess) onSuccess(data);
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Operation failed';
      toast.error(message);
      if (onError) onError(error);
    },
    ...options,
  });
}

// Custom hook for data mutations (create, update, delete)
export function useMutation<T = any>(
  mutationFunction: (...args: any[]) => Promise<any>,
  options: UseApiOptions & {
    invalidateCache?: string[];
  } = {}
) {
  const { invalidateCache = [], ...apiOptions } = options;

  return useApi<T>(mutationFunction, {
    ...apiOptions,
    onSuccess: (data) => {
      // Invalidate related cache entries
      invalidateCache.forEach((key) => {
        apiCache.clear(key);
      });

      if (apiOptions.onSuccess) {
        apiOptions.onSuccess(data);
      }
    },
  });
}

// Utility function to clear all cache
export function clearAllCache() {
  apiCache.clear();
}

// Utility function to clear specific cache
export function clearCache(key: string) {
  apiCache.clear(key);
}

export default useApi; 