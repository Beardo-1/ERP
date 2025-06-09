// Real Data Service for ERP System
import { apiService } from './apiService';

// Enhanced Interfaces
export interface Project {
  id: string;
  name: string;
  description: string;
  region: string;
  city: string;
  address: string;
  coordinates: { lat: number; lng: number };
  total_units: number;
  occupied_units: number;
  available_units: number;
  monthly_target: number;
  monthly_collected: number;
  collection_rate: number;
  assigned_agent: string;
  agent_id: string;
  property_types: string[];
  total_area: number;
  average_rent: number;
  contract_renewals_due: number;
  overdue_payments: number;
  status: 'active' | 'maintenance' | 'full' | 'development' | 'planning';
  created_at: string;
  last_collection: string;
  budget: number;
  completion_percentage: number;
  start_date: string;
  expected_completion: string;
  amenities: string[];
  documents: ProjectDocument[];
  images: string[];
  legal_info: {
    license_number: string;
    approval_status: string;
    municipality_approval: boolean;
    environmental_clearance: boolean;
  };
  financial_info: {
    total_investment: number;
    funding_source: string;
    payment_terms: string;
    roi_projection: number;
  };
  contact_person: {
    name: string;
    phone: string;
    email: string;
    role: string;
  };
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploaded_at: string;
  size: number;
}

export interface Agent {
  id: string;
  name: string;
  phone: string;
  email: string;
  nationalId: string;
  region: string;
  employeeId: string;
  joiningDate: string;
  assigned_projects: string[];
  monthly_target: number;
  monthly_collected: number;
  collection_rate: number;
  total_tenants: number;
  status: 'active' | 'inactive' | 'on_leave' | 'terminated';
  performance_score: number;
  last_activity: string;
  profile_image?: string;
  address: string;
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
  bank_details: {
    account_number: string;
    bank_name: string;
    iban: string;
  };
  commission_rate: number;
  total_commissions: number;
  ratings: {
    customer_satisfaction: number;
    punctuality: number;
    communication: number;
    overall: number;
  };
}

export interface AgentPhoto {
  id: string;
  agent_id: string;
  url: string;
  type: 'profile' | 'field_work' | 'meeting' | 'achievement' | 'training';
  title: string;
  description: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  uploaded_at: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  tags: string[];
  metadata: {
    camera: string;
    timestamp: string;
    weather?: string;
  };
}

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  email: string;
  national_id: string;
  project_id: string;
  unit_number: string;
  lease_start: string;
  lease_end: string;
  monthly_rent: number;
  security_deposit: number;
  payment_status: 'current' | 'overdue' | 'partial';
  last_payment: string;
  outstanding_amount: number;
  payment_history: PaymentRecord[];
  contact_history: ContactRecord[];
  emergency_contact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export interface PaymentRecord {
  id: string;
  tenant_id: string;
  amount: number;
  payment_date: string;
  payment_method: 'cash' | 'bank_transfer' | 'check' | 'card';
  reference_number: string;
  collected_by: string;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
}

export interface ContactRecord {
  id: string;
  tenant_id: string;
  agent_id: string;
  date: string;
  type: 'call' | 'visit' | 'email' | 'sms';
  outcome: 'successful' | 'no_answer' | 'promised_payment' | 'dispute' | 'follow_up_required' | 'escalated';
  notes: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  read: boolean;
  action_required: boolean;
  action_url?: string;
  category: 'payment' | 'maintenance' | 'contract' | 'system' | 'agent';
  related_id?: string;
}

class DataService {
  private projects: Project[] = [];
  private agents: Agent[] = [];
  private tenants: Tenant[] = [];
  private agentPhotos: AgentPhoto[] = [];
  private notifications: Notification[] = [];
  private paymentRecords: PaymentRecord[] = [];
  private contactHistoryRecords: ContactRecord[] = [];

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Initialize with comprehensive Saudi Arabia real estate data
    this.projects = this.generateProjects();
    this.agents = this.generateAgents();
    this.tenants = this.generateTenants();
    this.agentPhotos = this.generateAgentPhotos();
    this.notifications = this.generateNotifications();
    this.paymentRecords = this.tenants.flatMap(t => t.payment_history);
    this.contactHistoryRecords = this.tenants.flatMap(t => t.contact_history);
  }

  private generateProjects(): Project[] {
    const saudiCities = [
      { name: 'Riyadh', lat: 24.7136, lng: 46.6753 },
      { name: 'Jeddah', lat: 21.4858, lng: 39.1925 },
      { name: 'Mecca', lat: 21.3891, lng: 39.8579 },
      { name: 'Medina', lat: 24.5247, lng: 39.5692 },
      { name: 'Dammam', lat: 26.4207, lng: 50.0888 },
      { name: 'Khobar', lat: 26.2172, lng: 50.1971 },
      { name: 'Tabuk', lat: 28.3998, lng: 36.5700 }
    ];

    const propertyTypes = ['Residential', 'Commercial', 'Mixed-Use', 'Retail', 'Office'];
    const amenities = ['Parking', 'Security', 'Gym', 'Pool', 'Garden', 'Mosque', 'Shopping', 'School'];

    return Array.from({ length: 25 }, (_, i) => {
      const city = saudiCities[i % saudiCities.length];
      const totalUnits = Math.floor(Math.random() * 200) + 50;
      const occupiedUnits = Math.floor(totalUnits * (0.6 + Math.random() * 0.3));
      const monthlyTarget = totalUnits * (2000 + Math.random() * 3000);
      const monthlyCollected = monthlyTarget * (0.7 + Math.random() * 0.25);

      return {
        id: `proj_${i + 1}`,
        name: `${city.name} ${['Heights', 'Plaza', 'Towers', 'Complex', 'Gardens'][i % 5]}`,
        description: `Premium ${propertyTypes[i % propertyTypes.length].toLowerCase()} development in ${city.name}`,
        region: city.name,
        city: city.name,
        address: `${Math.floor(Math.random() * 9999) + 1000} King ${['Fahd', 'Abdul Aziz', 'Faisal'][i % 3]} Road`,
        coordinates: { lat: city.lat + (Math.random() - 0.5) * 0.1, lng: city.lng + (Math.random() - 0.5) * 0.1 },
        total_units: totalUnits,
        occupied_units: occupiedUnits,
        available_units: totalUnits - occupiedUnits,
        monthly_target: monthlyTarget,
        monthly_collected: monthlyCollected,
        collection_rate: Math.round((monthlyCollected / monthlyTarget) * 100),
        assigned_agent: `Agent ${i + 1}`,
        agent_id: `agent_${i + 1}`,
        property_types: [propertyTypes[i % propertyTypes.length]],
        total_area: totalUnits * (80 + Math.random() * 120),
        average_rent: 2000 + Math.random() * 3000,
        contract_renewals_due: Math.floor(Math.random() * 15),
        overdue_payments: Math.floor(Math.random() * 8),
        status: ['active', 'maintenance', 'full', 'development'][Math.floor(Math.random() * 4)] as any,
        created_at: new Date(2024 - Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        last_collection: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString(),
        budget: 50000000 + Math.random() * 200000000,
        completion_percentage: Math.floor(Math.random() * 100),
        start_date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        expected_completion: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        amenities: amenities.slice(0, 3 + Math.floor(Math.random() * 5)),
        documents: this.generateProjectDocuments(`proj_${i + 1}`),
        images: Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, j) => 
          `https://images.unsplash.com/photo-${1500000000000 + i * 1000 + j}?w=800&h=600&fit=crop`
        ),
        legal_info: {
          license_number: `LIC-${city.name.toUpperCase()}-${2024}-${String(i + 1).padStart(4, '0')}`,
          approval_status: ['approved', 'pending', 'conditional'][Math.floor(Math.random() * 3)],
          municipality_approval: Math.random() > 0.2,
          environmental_clearance: Math.random() > 0.1
        },
        financial_info: {
          total_investment: 50000000 + Math.random() * 200000000,
          funding_source: ['Bank Loan', 'Private Investment', 'Government Grant', 'Mixed Funding'][Math.floor(Math.random() * 4)],
          payment_terms: ['30 days', '60 days', '90 days'][Math.floor(Math.random() * 3)],
          roi_projection: 8 + Math.random() * 12
        },
        contact_person: {
          name: `${['Ahmed', 'Mohammed', 'Abdullah', 'Khalid', 'Omar'][i % 5]} ${['Al-Rashid', 'Al-Saud', 'Al-Otaibi', 'Al-Ghamdi'][i % 4]}`,
          phone: `+966 5${Math.floor(Math.random() * 90000000) + 10000000}`,
          email: `contact.proj${i + 1}@company.sa`,
          role: ['Project Manager', 'Site Engineer', 'Development Lead'][Math.floor(Math.random() * 3)]
        }
      };
    });
  }

  private generateProjectDocuments(projectId: string): ProjectDocument[] {
    const docTypes = ['Contract', 'License', 'Blueprint', 'Permit', 'Insurance', 'Survey'];
    return Array.from({ length: 3 + Math.floor(Math.random() * 5) }, (_, i) => ({
      id: `doc_${projectId}_${i + 1}`,
      name: `${docTypes[i % docTypes.length]}_${projectId}.pdf`,
      type: docTypes[i % docTypes.length],
      url: `/documents/${projectId}/${docTypes[i % docTypes.length].toLowerCase()}.pdf`,
      uploaded_at: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      size: 1024 * (100 + Math.random() * 900) // KB
    }));
  }

  private generateAgents(): Agent[] {
    const saudiNames = [
      'Ahmed Al-Rashid', 'Mohammed Al-Saud', 'Abdullah Al-Otaibi', 'Khalid Al-Ghamdi', 'Omar Al-Harbi',
      'Fahd Al-Mutairi', 'Saud Al-Dosari', 'Faisal Al-Qahtani', 'Turki Al-Shehri', 'Bandar Al-Anzi',
      'Nasser Al-Subai', 'Majed Al-Zahrani', 'Saad Al-Malki', 'Rayan Al-Juhani', 'Ziad Al-Shamri'
    ];

    const regions = ['Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk'];

    return Array.from({ length: 15 }, (_, i) => {
      const monthlyTarget = 50000 + Math.random() * 100000;
      const monthlyCollected = monthlyTarget * (0.6 + Math.random() * 0.35);
      const collectionRate = (monthlyCollected / monthlyTarget) * 100;

      return {
        id: `agent_${i + 1}`,
        name: saudiNames[i],
        phone: `+966 5${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: `${saudiNames[i].toLowerCase().replace(/\s+/g, '.').replace('al-', '')}@company.sa`,
        nationalId: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        region: regions[i % regions.length],
        employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
        joiningDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        assigned_projects: this.projects.slice(i, i + 2).map(p => p.id),
        monthly_target: monthlyTarget,
        monthly_collected: monthlyCollected,
        collection_rate: Math.round(collectionRate),
        total_tenants: Math.floor(Math.random() * 50) + 20,
        status: ['active', 'inactive', 'on_leave'][Math.floor(Math.random() * 3)] as any,
        performance_score: Math.round(collectionRate),
        last_activity: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString(),
        profile_image: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=200&h=200&fit=crop&crop=face`,
        address: `${Math.floor(Math.random() * 9999) + 1000} ${regions[i % regions.length]} District`,
        emergency_contact: {
          name: `Emergency Contact ${i + 1}`,
          phone: `+966 5${Math.floor(Math.random() * 90000000) + 10000000}`,
          relationship: ['Spouse', 'Parent', 'Sibling'][Math.floor(Math.random() * 3)]
        },
        bank_details: {
          account_number: `${Math.floor(Math.random() * 900000000000) + 100000000000}`,
          bank_name: ['Al Rajhi Bank', 'Saudi National Bank', 'Riyad Bank', 'SABB'][Math.floor(Math.random() * 4)],
          iban: `SA${Math.floor(Math.random() * 90) + 10}${Math.floor(Math.random() * 900000000000000000) + 100000000000000000}`
        },
        commission_rate: 2 + Math.random() * 3,
        total_commissions: monthlyCollected * (2 + Math.random() * 3) / 100,
        ratings: {
          customer_satisfaction: 3 + Math.random() * 2,
          punctuality: 3 + Math.random() * 2,
          communication: 3 + Math.random() * 2,
          overall: 3 + Math.random() * 2
        }
      };
    });
  }

  private generateTenants(): Tenant[] {
    const tenantNames = [
      'Ali Al-Mansouri', 'Sara Al-Zahra', 'Hassan Al-Kindi', 'Fatima Al-Nouri', 'Yusuf Al-Tamimi',
      'Aisha Al-Farisi', 'Ibrahim Al-Hashimi', 'Maryam Al-Qureshi', 'Khalil Al-Baghdadi', 'Zainab Al-Basri'
    ];

    return Array.from({ length: 50 }, (_, i) => {
      const project = this.projects[Math.floor(Math.random() * this.projects.length)];
      const tenantId = `tenant_${i + 1}`;
      const monthlyRent = 1500 + Math.random() * 4500;
      
      const agentIdForTenant = project.agent_id || this.agents[0].id;
      const paymentHistory = this.generatePaymentHistory(tenantId, monthlyRent);
      const contactHistory = this.generateContactHistory(tenantId, agentIdForTenant);

      return {
        id: tenantId,
        name: tenantNames[i % tenantNames.length] + ` ${i + 1}`,
        phone: `+966 5${Math.floor(Math.random() * 90000000) + 10000000}`,
        email: `tenant${i + 1}@email.com`,
        national_id: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
        project_id: project.id,
        unit_number: `${Math.floor(Math.random() * 20) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 5))}`,
        lease_start: new Date(2023 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        lease_end: new Date(2025 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        monthly_rent: monthlyRent,
        security_deposit: monthlyRent * 2,
        payment_status: Math.random() > 0.7 ? 'overdue' : (Math.random() > 0.1 ? 'current' : 'partial') as any,
        last_payment: new Date(2024, 11, Math.floor(Math.random() * 28) + 1).toISOString(),
        outstanding_amount: Math.random() > 0.7 ? monthlyRent * (Math.random() * 2) : 0,
        payment_history: paymentHistory,
        contact_history: contactHistory,
        emergency_contact: {
          name: `Relative of ${tenantNames[i % tenantNames.length]}`,
          phone: `+966 5${Math.floor(Math.random() * 90000000) + 10000000}`,
          relationship: ['Spouse', 'Parent', 'Sibling', 'Friend'][Math.floor(Math.random() * 4)]
        }
      };
    });
  }

  private generatePaymentHistory(tenantId: string, monthlyRent: number): PaymentRecord[] {
    const records: PaymentRecord[] = [];
    const numRecords = Math.floor(Math.random() * 12) + 6;

    for (let i = 0; i < numRecords; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * Math.floor(Math.random() * 10) + 5));
      
      const amount = monthlyRent + (Math.random() - 0.5) * 200;
      const paymentMethod = ['bank_transfer', 'cash', 'check', 'card'][Math.floor(Math.random() * 4)] as any;
      const referenceNumber = `REF${Math.floor(Math.random() * 900000) + 100000}`;
      const collectedBy = `agent_${Math.floor(Math.random() * 15) + 1}`;
      const status = Math.random() > 0.05 ? 'completed' : 'pending' as any;
      const notes = Math.random() > 0.7 ? 'Late payment fee applied' : undefined;

      records.push({
        id: `payment_${tenantId}_${i + 1}`,
        tenant_id: tenantId,
        amount: amount,
        payment_date: date.toISOString(),
        payment_method: paymentMethod,
        reference_number: referenceNumber,
        collected_by: collectedBy,
        status: status,
        notes: notes
      });
    }
    return records.sort((a, b) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime());
  }

  private generateContactHistory(tenantId: string, agentId: string): ContactRecord[] {
    const types: ('call' | 'visit' | 'email' | 'sms')[] = ['call', 'visit', 'email', 'sms'];
    const outcomes: ('successful' | 'no_answer' | 'promised_payment' | 'dispute' | 'follow_up_required' | 'escalated')[] = 
      ['successful', 'no_answer', 'promised_payment', 'dispute', 'follow_up_required', 'escalated'];
    
    const records: ContactRecord[] = [];
    const numRecords = Math.floor(Math.random() * 8) + 2;

    for (let i = 0; i < numRecords; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (i * Math.floor(Math.random() * 10) + 5));
      
      const outcome = outcomes[Math.floor(Math.random() * outcomes.length)];
      records.push({
        id: `contact_${tenantId}_${i}`,
        tenant_id: tenantId,
        agent_id: agentId,
        date: date.toISOString(),
        type: types[Math.floor(Math.random() * types.length)],
        outcome: outcome,
        notes: `Contact attempt on ${date.toLocaleDateString()}. Outcome: ${outcome}.`,
      });
    }
    return records.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private generateAgentPhotos(): AgentPhoto[] {
    const photoTypes = ['profile', 'field_work', 'meeting', 'achievement', 'training'] as const;
    const locations = ['Riyadh Office', 'Client Site', 'Project Location', 'Training Center', 'Field Visit'];

    return Array.from({ length: 100 }, (_, i) => ({
      id: `photo_${i + 1}`,
      agent_id: `agent_${Math.floor(Math.random() * 15) + 1}`,
      url: `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=800&h=600&fit=crop`,
      type: photoTypes[Math.floor(Math.random() * photoTypes.length)],
      title: `${photoTypes[Math.floor(Math.random() * photoTypes.length)].replace('_', ' ')} Photo ${i + 1}`,
      description: `Professional photo taken during ${photoTypes[Math.floor(Math.random() * photoTypes.length)].replace('_', ' ')} activity`,
      location: locations[Math.floor(Math.random() * locations.length)],
      coordinates: Math.random() > 0.5 ? { lat: 24.7136 + (Math.random() - 0.5) * 0.1, lng: 46.6753 + (Math.random() - 0.5) * 0.1 } : undefined,
      uploaded_at: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
      status: Math.random() > 0.3 ? 'approved' : 'pending' as any,
      approved_by: Math.random() > 0.3 ? 'CEO' : undefined,
      approved_at: Math.random() > 0.3 ? new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString() : undefined,
      tags: ['professional', 'work', 'saudi', 'real-estate'].slice(0, 2 + Math.floor(Math.random() * 3)),
      metadata: {
        camera: ['iPhone 15 Pro', 'Samsung Galaxy S24', 'Canon EOS R5'][Math.floor(Math.random() * 3)],
        timestamp: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString(),
        weather: Math.random() > 0.5 ? ['Sunny', 'Cloudy', 'Clear'][Math.floor(Math.random() * 3)] : undefined
      }
    }));
  }

  private generateNotifications(): Notification[] {
    const notificationTypes = [
      { title: 'Payment Overdue', message: 'Tenant payment is overdue', type: 'warning', category: 'payment' },
      { title: 'Contract Renewal', message: 'Contract renewal required', type: 'info', category: 'contract' },
      { title: 'Maintenance Request', message: 'New maintenance request submitted', type: 'info', category: 'maintenance' },
      { title: 'Agent Performance', message: 'Monthly performance report ready', type: 'success', category: 'agent' },
      { title: 'System Update', message: 'System maintenance scheduled', type: 'info', category: 'system' }
    ];

    return Array.from({ length: 20 }, (_, i) => {
      const notif = notificationTypes[i % notificationTypes.length];
      return {
        id: `notif_${i + 1}`,
        title: notif.title,
        message: `${notif.message} - Item ${i + 1}`,
        type: notif.type as any,
        priority: ['low', 'medium', 'high', 'urgent'][Math.floor(Math.random() * 4)] as any,
        created_at: new Date(2024, 11, Math.floor(Math.random() * 30) + 1).toISOString(),
        read: Math.random() > 0.4,
        action_required: Math.random() > 0.6,
        action_url: Math.random() > 0.6 ? `/action/${i + 1}` : undefined,
        category: notif.category as any,
        related_id: `related_${i + 1}`
      };
    });
  }

  // Public API Methods
  async getProjects(): Promise<Project[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...this.projects];
  }

  async getProject(id: string): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.projects.find(p => p.id === id) || null;
  }

  async createProject(projectData: Partial<Project>): Promise<Project> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newProject: Project = {
      id: `proj_${Date.now()}`,
      name: projectData.name || '',
      description: projectData.description || '',
      region: projectData.region || '',
      city: projectData.city || '',
      address: projectData.address || '',
      coordinates: projectData.coordinates || { lat: 24.7136, lng: 46.6753 },
      total_units: projectData.total_units || 0,
      occupied_units: 0,
      available_units: projectData.total_units || 0,
      monthly_target: projectData.monthly_target || 0,
      monthly_collected: 0,
      collection_rate: 0,
      assigned_agent: projectData.assigned_agent || '',
      agent_id: projectData.agent_id || '',
      property_types: projectData.property_types || [],
      total_area: projectData.total_area || 0,
      average_rent: projectData.average_rent || 0,
      contract_renewals_due: 0,
      overdue_payments: 0,
      status: projectData.status || 'planning',
      created_at: new Date().toISOString(),
      last_collection: new Date().toISOString(),
      budget: projectData.budget || 0,
      completion_percentage: 0,
      start_date: projectData.start_date || new Date().toISOString(),
      expected_completion: projectData.expected_completion || new Date().toISOString(),
      amenities: projectData.amenities || [],
      documents: [],
      images: projectData.images || [],
      legal_info: projectData.legal_info || {
        license_number: '',
        approval_status: 'pending',
        municipality_approval: false,
        environmental_clearance: false
      },
      financial_info: projectData.financial_info || {
        total_investment: 0,
        funding_source: '',
        payment_terms: '',
        roi_projection: 0
      },
      contact_person: projectData.contact_person || {
        name: '',
        phone: '',
        email: '',
        role: ''
      }
    };

    this.projects.push(newProject);
    return newProject;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.projects[index] = { ...this.projects[index], ...updates };
    return this.projects[index];
  }

  async deleteProject(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) return false;

    this.projects.splice(index, 1);
    return true;
  }

  async getAgents(): Promise<Agent[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.agents];
  }

  async getAgent(id: string): Promise<Agent | null> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.agents.find(a => a.id === id) || null;
  }

  async createAgent(agentData: Partial<Agent>): Promise<Agent> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newAgent: Agent = {
      id: `agent_${Date.now()}`,
      name: agentData.name || '',
      phone: agentData.phone || '',
      email: agentData.email || '',
      nationalId: agentData.nationalId || '',
      region: agentData.region || '',
      employeeId: agentData.employeeId || '',
      joiningDate: agentData.joiningDate || new Date().toISOString(),
      assigned_projects: [],
      monthly_target: agentData.monthly_target || 0,
      monthly_collected: 0,
      collection_rate: 0,
      total_tenants: 0,
      status: agentData.status || 'active',
      performance_score: 0,
      last_activity: new Date().toISOString(),
      profile_image: agentData.profile_image,
      address: agentData.address || '',
      emergency_contact: agentData.emergency_contact || { name: '', phone: '', relationship: '' },
      bank_details: agentData.bank_details || { account_number: '', bank_name: '', iban: '' },
      commission_rate: agentData.commission_rate || 0,
      total_commissions: 0,
      ratings: agentData.ratings || { customer_satisfaction: 0, punctuality: 0, communication: 0, overall: 0 }
    };

    this.agents.push(newAgent);
    return newAgent;
  }

  async bulkCreateAgents(agentsData: Partial<Agent>[]): Promise<Agent[]> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newAgents = agentsData.map(agentData => ({
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: agentData.name || '',
      phone: agentData.phone || '',
      email: agentData.email || '',
      nationalId: agentData.nationalId || '',
      region: agentData.region || '',
      employeeId: agentData.employeeId || '',
      joiningDate: agentData.joiningDate || new Date().toISOString(),
      assigned_projects: [],
      monthly_target: agentData.monthly_target || 0,
      monthly_collected: 0,
      collection_rate: 0,
      total_tenants: 0,
      status: agentData.status || 'active',
      performance_score: 0,
      last_activity: new Date().toISOString(),
      profile_image: agentData.profile_image,
      address: agentData.address || '',
      emergency_contact: agentData.emergency_contact || { name: '', phone: '', relationship: '' },
      bank_details: agentData.bank_details || { account_number: '', bank_name: '', iban: '' },
      commission_rate: agentData.commission_rate || 0,
      total_commissions: 0,
      ratings: agentData.ratings || { customer_satisfaction: 0, punctuality: 0, communication: 0, overall: 0 }
    }));

    this.agents.push(...newAgents);
    return newAgents;
  }

  async getAgentPhotos(agentId?: string): Promise<AgentPhoto[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return agentId 
      ? this.agentPhotos.filter(photo => photo.agent_id === agentId)
      : [...this.agentPhotos];
  }

  async uploadAgentPhoto(photoData: Partial<AgentPhoto>): Promise<AgentPhoto> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newPhoto: AgentPhoto = {
      id: `photo_${Date.now()}`,
      agent_id: photoData.agent_id || '',
      url: photoData.url || '',
      type: photoData.type || 'profile',
      title: photoData.title || '',
      description: photoData.description || '',
      location: photoData.location || '',
      coordinates: photoData.coordinates,
      uploaded_at: new Date().toISOString(),
      status: 'pending',
      tags: photoData.tags || [],
      metadata: photoData.metadata || { camera: '', timestamp: new Date().toISOString() }
    };

    this.agentPhotos.push(newPhoto);
    return newPhoto;
  }

  async approveAgentPhoto(photoId: string, approvedBy: string): Promise<AgentPhoto | null> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const photo = this.agentPhotos.find(p => p.id === photoId);
    if (!photo) return null;

    photo.status = 'approved';
    photo.approved_by = approvedBy;
    photo.approved_at = new Date().toISOString();
    
    return photo;
  }

  async getTenants(projectId?: string): Promise<Tenant[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    return projectId 
      ? this.tenants.filter(tenant => tenant.project_id === projectId)
      : [...this.tenants];
  }

  async getNotifications(): Promise<Notification[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.notifications].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async markNotificationAsRead(id: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const notification = this.notifications.find(n => n.id === id);
    if (!notification) return false;

    notification.read = true;
    return true;
  }

  async getPaymentRecords(tenantId?: string): Promise<PaymentRecord[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return tenantId 
      ? this.paymentRecords.filter(record => record.tenant_id === tenantId)
      : [...this.paymentRecords];
  }

  async recordPayment(paymentData: Partial<PaymentRecord>): Promise<PaymentRecord> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newPayment: PaymentRecord = {
      id: `payment_${Date.now()}`,
      tenant_id: paymentData.tenant_id || '',
      amount: paymentData.amount || 0,
      payment_date: paymentData.payment_date || new Date().toISOString(),
      payment_method: paymentData.payment_method || 'bank_transfer',
      reference_number: paymentData.reference_number || `REF${Date.now()}`,
      collected_by: paymentData.collected_by || '',
      status: paymentData.status || 'completed',
      notes: paymentData.notes
    };

    this.paymentRecords.push(newPayment);
    
    // Update tenant payment status
    const tenant = this.tenants.find(t => t.id === newPayment.tenant_id);
    if (tenant) {
      tenant.last_payment = newPayment.payment_date;
      tenant.outstanding_amount = Math.max(0, tenant.outstanding_amount - newPayment.amount);
      tenant.payment_status = tenant.outstanding_amount > 0 ? 'partial' : 'current';
      tenant.payment_history.unshift(newPayment);
    }

    return newPayment;
  }

  // Analytics and Reports
  async getDashboardStats(): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter(p => p.status === 'active').length;
    const totalUnits = this.projects.reduce((sum, p) => sum + p.total_units, 0);
    const occupiedUnits = this.projects.reduce((sum, p) => sum + p.occupied_units, 0);
    const totalRevenue = this.projects.reduce((sum, p) => sum + p.monthly_collected, 0);
    const totalTarget = this.projects.reduce((sum, p) => sum + p.monthly_target, 0);
    const overallCollectionRate = totalTarget > 0 ? (totalRevenue / totalTarget) * 100 : 0;
    
    const activeAgents = this.agents.filter(a => a.status === 'active').length;
    const totalTenants = this.tenants.length;
    const overdueTenants = this.tenants.filter(t => t.payment_status === 'overdue').length;

    return {
      projects: {
        total: totalProjects,
        active: activeProjects,
        occupancy_rate: totalUnits > 0 ? (occupiedUnits / totalUnits) * 100 : 0
      },
      financial: {
        total_revenue: totalRevenue,
        total_target: totalTarget,
        collection_rate: overallCollectionRate,
        outstanding_amount: this.tenants.reduce((sum, t) => sum + t.outstanding_amount, 0)
      },
      agents: {
        total: this.agents.length,
        active: activeAgents,
        average_performance: this.agents.reduce((sum, a) => sum + a.performance_score, 0) / this.agents.length
      },
      tenants: {
        total: totalTenants,
        current: this.tenants.filter(t => t.payment_status === 'current').length,
        overdue: overdueTenants,
        partial: this.tenants.filter(t => t.payment_status === 'partial').length
      }
    };
  }

  // Search functionality
  async searchAll(query: string): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const lowerQuery = query.toLowerCase();
    
    const projects = this.projects.filter(p => 
      p.name.toLowerCase().includes(lowerQuery) ||
      p.region.toLowerCase().includes(lowerQuery) ||
      p.assigned_agent.toLowerCase().includes(lowerQuery)
    );

    const agents = this.agents.filter(a => 
      a.name.toLowerCase().includes(lowerQuery) ||
      a.email.toLowerCase().includes(lowerQuery) ||
      a.region.toLowerCase().includes(lowerQuery)
    );

    const tenants = this.tenants.filter(t => 
      t.name.toLowerCase().includes(lowerQuery) ||
      t.email.toLowerCase().includes(lowerQuery) ||
      t.unit_number.toLowerCase().includes(lowerQuery)
    );

    return {
      projects: projects.slice(0, 5),
      agents: agents.slice(0, 5),
      tenants: tenants.slice(0, 5)
    };
  }

  async getContactHistory(tenantId: string): Promise<ContactRecord[]> {
    return new Promise(resolve => {
      setTimeout(() => {
        const history = this.contactHistoryRecords.filter(rec => rec.tenant_id === tenantId);
        resolve(history);
      }, 200);
    });
  }
}

export const dataService = new DataService(); 