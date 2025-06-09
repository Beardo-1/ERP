import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth tokens
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API response interface
interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  total?: number;
  page?: number;
  limit?: number;
}

// Generic API service class
class ApiService {
  // Generic CRUD operations
  async get<T>(endpoint: string, params?: any): Promise<ApiResponse<T>> {
    const response = await apiClient.get(endpoint, { params });
    return response.data;
  }

  async post<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  }

  async put<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await apiClient.delete(endpoint);
    return response.data;
  }

  async patch<T>(endpoint: string, data: any): Promise<ApiResponse<T>> {
    const response = await apiClient.patch(endpoint, data);
    return response.data;
  }
}

// Create service instance
const apiService = new ApiService();

// Dashboard API
export const dashboardApi = {
  getMetrics: () => apiService.get('/dashboard/metrics'),
  getRecentActivity: () => apiService.get('/dashboard/activity'),
  getChartData: (type: string, period: string) => 
    apiService.get(`/dashboard/charts/${type}`, { period }),
};

// Sales & CRM API
export const salesApi = {
  getLeads: (params?: any) => apiService.get('/sales/leads', params),
  createLead: (data: any) => apiService.post('/sales/leads', data),
  updateLead: (id: string, data: any) => apiService.put(`/sales/leads/${id}`, data),
  deleteLead: (id: string) => apiService.delete(`/sales/leads/${id}`),
  
  getOpportunities: (params?: any) => apiService.get('/sales/opportunities', params),
  createOpportunity: (data: any) => apiService.post('/sales/opportunities', data),
  updateOpportunity: (id: string, data: any) => apiService.put(`/sales/opportunities/${id}`, data),
  
  getCustomers: (params?: any) => apiService.get('/sales/customers', params),
  createCustomer: (data: any) => apiService.post('/sales/customers', data),
  updateCustomer: (id: string, data: any) => apiService.put(`/sales/customers/${id}`, data),
};

// Project Management API
export const projectsApi = {
  getProjects: (params?: any) => apiService.get('/projects', params),
  createProject: (data: any) => apiService.post('/projects', data),
  updateProject: (id: string, data: any) => apiService.put(`/projects/${id}`, data),
  deleteProject: (id: string) => apiService.delete(`/projects/${id}`),
  
  getTasks: (projectId: string, params?: any) => 
    apiService.get(`/projects/${projectId}/tasks`, params),
  createTask: (projectId: string, data: any) => 
    apiService.post(`/projects/${projectId}/tasks`, data),
  updateTask: (projectId: string, taskId: string, data: any) => 
    apiService.put(`/projects/${projectId}/tasks/${taskId}`, data),
  
  getTimeEntries: (projectId: string) => 
    apiService.get(`/projects/${projectId}/time-entries`),
  createTimeEntry: (projectId: string, data: any) => 
    apiService.post(`/projects/${projectId}/time-entries`, data),
};

// Financial Management API
export const financeApi = {
  getTransactions: (params?: any) => apiService.get('/finance/transactions', params),
  createTransaction: (data: any) => apiService.post('/finance/transactions', data),
  updateTransaction: (id: string, data: any) => apiService.put(`/finance/transactions/${id}`, data),
  deleteTransaction: (id: string) => apiService.delete(`/finance/transactions/${id}`),
  
  getInvoices: (params?: any) => apiService.get('/finance/invoices', params),
  createInvoice: (data: any) => apiService.post('/finance/invoices', data),
  updateInvoice: (id: string, data: any) => apiService.put(`/finance/invoices/${id}`, data),
  sendInvoice: (id: string) => apiService.post(`/finance/invoices/${id}/send`, {}),
  
  getReports: (type: string, params?: any) => 
    apiService.get(`/finance/reports/${type}`, params),
  
  getBudgets: () => apiService.get('/finance/budgets'),
  createBudget: (data: any) => apiService.post('/finance/budgets', data),
  updateBudget: (id: string, data: any) => apiService.put(`/finance/budgets/${id}`, data),
};

// Inventory Management API
export const inventoryApi = {
  getItems: (params?: any) => apiService.get('/inventory/items', params),
  createItem: (data: any) => apiService.post('/inventory/items', data),
  updateItem: (id: string, data: any) => apiService.put(`/inventory/items/${id}`, data),
  deleteItem: (id: string) => apiService.delete(`/inventory/items/${id}`),
  
  getStockMovements: (itemId: string) => 
    apiService.get(`/inventory/items/${itemId}/movements`),
  createStockMovement: (itemId: string, data: any) => 
    apiService.post(`/inventory/items/${itemId}/movements`, data),
  
  getSuppliers: () => apiService.get('/inventory/suppliers'),
  createSupplier: (data: any) => apiService.post('/inventory/suppliers', data),
  updateSupplier: (id: string, data: any) => apiService.put(`/inventory/suppliers/${id}`, data),
  
  getLowStockAlerts: () => apiService.get('/inventory/alerts/low-stock'),
  getInventoryReports: (type: string) => apiService.get(`/inventory/reports/${type}`),
};

// Human Resources API
export const hrApi = {
  getEmployees: (params?: any) => apiService.get('/hr/employees', params),
  createEmployee: (data: any) => apiService.post('/hr/employees', data),
  updateEmployee: (id: string, data: any) => apiService.put(`/hr/employees/${id}`, data),
  deleteEmployee: (id: string) => apiService.delete(`/hr/employees/${id}`),
  
  getAttendance: (employeeId: string, params?: any) => 
    apiService.get(`/hr/employees/${employeeId}/attendance`, params),
  recordAttendance: (employeeId: string, data: any) => 
    apiService.post(`/hr/employees/${employeeId}/attendance`, data),
  
  getPayroll: (params?: any) => apiService.get('/hr/payroll', params),
  processPayroll: (data: any) => apiService.post('/hr/payroll/process', data),
  
  getPerformanceReviews: (employeeId: string) => 
    apiService.get(`/hr/employees/${employeeId}/performance`),
  createPerformanceReview: (employeeId: string, data: any) => 
    apiService.post(`/hr/employees/${employeeId}/performance`, data),
  
  getLeaveRequests: (params?: any) => apiService.get('/hr/leave-requests', params),
  createLeaveRequest: (data: any) => apiService.post('/hr/leave-requests', data),
  approveLeaveRequest: (id: string) => apiService.patch(`/hr/leave-requests/${id}/approve`, {}),
  rejectLeaveRequest: (id: string, reason: string) => 
    apiService.patch(`/hr/leave-requests/${id}/reject`, { reason }),
};

// Workflow Automation API
export const workflowApi = {
  getWorkflows: (params?: any) => apiService.get('/workflows', params),
  createWorkflow: (data: any) => apiService.post('/workflows', data),
  updateWorkflow: (id: string, data: any) => apiService.put(`/workflows/${id}`, data),
  deleteWorkflow: (id: string) => apiService.delete(`/workflows/${id}`),
  
  activateWorkflow: (id: string) => apiService.patch(`/workflows/${id}/activate`, {}),
  deactivateWorkflow: (id: string) => apiService.patch(`/workflows/${id}/deactivate`, {}),
  
  getWorkflowExecutions: (workflowId: string, params?: any) => 
    apiService.get(`/workflows/${workflowId}/executions`, params),
  
  getWorkflowTemplates: () => apiService.get('/workflows/templates'),
  createFromTemplate: (templateId: string, data: any) => 
    apiService.post(`/workflows/templates/${templateId}/create`, data),
};

// Property Management API (Real Estate specific)
export const propertyApi = {
  getProperties: (params?: any) => apiService.get('/properties', params),
  createProperty: (data: any) => apiService.post('/properties', data),
  updateProperty: (id: string, data: any) => apiService.put(`/properties/${id}`, data),
  deleteProperty: (id: string) => apiService.delete(`/properties/${id}`),
  
  getLeases: (propertyId: string) => apiService.get(`/properties/${propertyId}/leases`),
  createLease: (propertyId: string, data: any) => 
    apiService.post(`/properties/${propertyId}/leases`, data),
  updateLease: (propertyId: string, leaseId: string, data: any) => 
    apiService.put(`/properties/${propertyId}/leases/${leaseId}`, data),
  
  getMaintenanceRequests: (propertyId: string) => 
    apiService.get(`/properties/${propertyId}/maintenance`),
  createMaintenanceRequest: (propertyId: string, data: any) => 
    apiService.post(`/properties/${propertyId}/maintenance`, data),
  
  getPropertyReports: (propertyId: string, type: string) => 
    apiService.get(`/properties/${propertyId}/reports/${type}`),
};

// Reports & Analytics API
export const reportsApi = {
  getReportList: () => apiService.get('/reports'),
  generateReport: (type: string, params: any) => 
    apiService.post(`/reports/generate/${type}`, params),
  getReportData: (reportId: string) => apiService.get(`/reports/${reportId}`),
  downloadReport: (reportId: string, format: string) => 
    apiService.get(`/reports/${reportId}/download/${format}`, { responseType: 'blob' }),
  
  getAnalytics: (module: string, params?: any) => 
    apiService.get(`/analytics/${module}`, params),
  getKPIs: (module: string) => apiService.get(`/analytics/${module}/kpis`),
};

// Settings & Configuration API
export const settingsApi = {
  getSettings: () => apiService.get('/settings'),
  updateSettings: (data: any) => apiService.put('/settings', data),
  
  getUsers: () => apiService.get('/settings/users'),
  createUser: (data: any) => apiService.post('/settings/users', data),
  updateUser: (id: string, data: any) => apiService.put(`/settings/users/${id}`, data),
  deleteUser: (id: string) => apiService.delete(`/settings/users/${id}`),
  
  getRoles: () => apiService.get('/settings/roles'),
  createRole: (data: any) => apiService.post('/settings/roles', data),
  updateRole: (id: string, data: any) => apiService.put(`/settings/roles/${id}`, data),
  
  getPermissions: () => apiService.get('/settings/permissions'),
  updatePermissions: (roleId: string, permissions: string[]) => 
    apiService.put(`/settings/roles/${roleId}/permissions`, { permissions }),
  
  getIntegrations: () => apiService.get('/settings/integrations'),
  updateIntegration: (id: string, data: any) => 
    apiService.put(`/settings/integrations/${id}`, data),
};

// Authentication API
export const authApi = {
  login: (credentials: { email: string; password: string }) => 
    apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout', {}),
  register: (userData: any) => apiService.post('/auth/register', userData),
  forgotPassword: (email: string) => apiService.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => 
    apiService.post('/auth/reset-password', { token, password }),
  refreshToken: () => apiService.post('/auth/refresh', {}),
  verifyEmail: (token: string) => apiService.post('/auth/verify-email', { token }),
};

// File Upload API
export const fileApi = {
  uploadFile: (file: File, folder?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);
    
    return apiClient.post('/files/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  deleteFile: (fileId: string) => apiService.delete(`/files/${fileId}`),
  getFileUrl: (fileId: string) => `${API_BASE_URL}/files/${fileId}`,
};

// Export the main API client for custom requests
export { apiClient };

// Export default service
export default apiService; 