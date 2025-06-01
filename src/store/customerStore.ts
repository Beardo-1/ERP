import { create } from 'zustand';
import { Customer, Contact, Note, CustomerStatus } from '../types';
import { customers } from '../data/mockData';

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  isLoading: boolean;
  error: string | null;
  loadCustomers: () => Promise<void>;
  getCustomer: (id: string) => Promise<void>;
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>;
  addContact: (customerId: string, contact: Omit<Contact, 'id'>) => Promise<void>;
  addNote: (customerId: string, content: string, createdBy: string) => Promise<void>;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
  
  loadCustomers: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      set({ 
        customers: customers,
        isLoading: false 
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load customers'
      });
    }
  },
  
  getCustomer: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const customer = customers.find(c => c.id === id);
      
      if (customer) {
        set({ 
          selectedCustomer: customer,
          isLoading: false 
        });
      } else {
        set({
          selectedCustomer: null,
          isLoading: false,
          error: 'Customer not found'
        });
      }
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to load customer details'
      });
    }
  },
  
  addCustomer: async (customerData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      set(state => ({ 
        customers: [...state.customers, newCustomer],
        isLoading: false 
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to add customer'
      });
    }
  },
  
  updateCustomer: async (id, data) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set(state => {
        const updatedCustomers = state.customers.map(customer => 
          customer.id === id 
            ? { 
                ...customer, 
                ...data, 
                updatedAt: new Date() 
              } 
            : customer
        );
        
        const updatedSelectedCustomer = state.selectedCustomer && state.selectedCustomer.id === id
          ? { ...state.selectedCustomer, ...data, updatedAt: new Date() }
          : state.selectedCustomer;
        
        return { 
          customers: updatedCustomers,
          selectedCustomer: updatedSelectedCustomer,
          isLoading: false 
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to update customer'
      });
    }
  },
  
  addContact: async (customerId, contactData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newContact: Contact = {
        ...contactData,
        id: Date.now().toString()
      };
      
      set(state => {
        const updatedCustomers = state.customers.map(customer => {
          if (customer.id === customerId) {
            const updatedContacts = customer.contacts 
              ? [...customer.contacts, newContact]
              : [newContact];
              
            return {
              ...customer,
              contacts: updatedContacts,
              updatedAt: new Date()
            };
          }
          return customer;
        });
        
        const updatedSelectedCustomer = state.selectedCustomer && state.selectedCustomer.id === customerId
          ? {
              ...state.selectedCustomer,
              contacts: state.selectedCustomer.contacts 
                ? [...state.selectedCustomer.contacts, newContact]
                : [newContact],
              updatedAt: new Date()
            }
          : state.selectedCustomer;
        
        return {
          customers: updatedCustomers,
          selectedCustomer: updatedSelectedCustomer,
          isLoading: false
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to add contact'
      });
    }
  },
  
  addNote: async (customerId, content, createdBy) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 400));
      
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        createdBy,
        createdAt: new Date()
      };
      
      set(state => {
        const updatedCustomers = state.customers.map(customer => {
          if (customer.id === customerId) {
            const updatedNotes = customer.notes 
              ? [...customer.notes, newNote]
              : [newNote];
              
            return {
              ...customer,
              notes: updatedNotes,
              updatedAt: new Date()
            };
          }
          return customer;
        });
        
        const updatedSelectedCustomer = state.selectedCustomer && state.selectedCustomer.id === customerId
          ? {
              ...state.selectedCustomer,
              notes: state.selectedCustomer.notes 
                ? [...state.selectedCustomer.notes, newNote]
                : [newNote],
              updatedAt: new Date()
            }
          : state.selectedCustomer;
        
        return {
          customers: updatedCustomers,
          selectedCustomer: updatedSelectedCustomer,
          isLoading: false
        };
      });
    } catch (error) {
      set({
        isLoading: false,
        error: 'Failed to add note'
      });
    }
  }
}));