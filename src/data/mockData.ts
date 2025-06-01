import { 
  User, UserRole, Customer, CustomerStatus, Contact, Note, 
  Deal, DealStage, Product, Project, ProjectStatus, 
  Task, TaskStatus, Priority,
  Property, PropertyType, PropertyStatus,
  Lease, LeaseStatus,
  FinancialTransaction, TransactionType,
  MarketingCampaign, CampaignType, CampaignStatus,
  Document, DocumentType
} from '../types';

// Mock Users
export const users: User[] = [
  {
    id: '1',
    email: 'john.doe@nexuserp.com',
    firstName: 'John',
    lastName: 'Doe',
    role: UserRole.ADMIN,
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2024-10-15'),
    lastLogin: new Date('2025-04-10T09:30:00'),
  },
  {
    id: '2',
    email: 'jane.smith@nexuserp.com',
    firstName: 'Jane',
    lastName: 'Smith',
    role: UserRole.MANAGER,
    avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2024-11-05'),
    lastLogin: new Date('2025-04-09T14:15:00'),
  },
  {
    id: '3',
    email: 'mike.johnson@nexuserp.com',
    firstName: 'Mike',
    lastName: 'Johnson',
    role: UserRole.STAFF,
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2024-12-10'),
    lastLogin: new Date('2025-04-10T08:45:00'),
  },
  {
    id: '4',
    email: 'ceo@nexuserp.com',
    firstName: 'Alex',
    lastName: 'Boss',
    role: UserRole.CEO,
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
    createdAt: new Date('2024-09-01'),
    lastLogin: new Date('2025-04-11T10:00:00'),
  },
];

// Generate 2000 mock real estate customers
function generateCustomers(count = 2000) {
  const statuses = ['lead', 'prospect', 'customer', 'inactive'];
  const companies = ['Skyline Realty', 'Urban Estates', 'GreenLeaf Homes', 'Sunset Properties', 'Harbor Realty', 'Metro Living', 'Blue Ridge Realty', 'Golden Gate Estates'];
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Miami', 'Dallas', 'San Francisco'];
  const firstNames = ['John', 'Jane', 'Alex', 'Emily', 'Chris', 'Olivia', 'Michael', 'Sophia', 'David', 'Emma', 'Daniel', 'Ava', 'James', 'Mia', 'Matthew', 'Charlotte'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Martinez', 'Lopez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson'];

  const customers = [];
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
    const company = companies[Math.floor(Math.random() * companies.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    customers.push({
      id: i.toString(),
      name,
      email,
      phone: `+1 (555) ${100 + (i % 900)}-${1000 + (i % 9000)}`,
      company,
      status,
      industry: 'Real Estate',
      address: {
        street: `${100 + (i % 900)} Main St`,
        city,
        state: 'CA',
        zipCode: `${90000 + (i % 10000)}`,
        country: 'USA',
      },
      contacts: [],
      notes: [],
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      updatedAt: new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
    });
  }
  return customers;
}

export const customers = generateCustomers(2000);

// Mock Deals
export const deals: Deal[] = [
  {
    id: '1',
    name: 'Annual Software License',
    customerId: '1',
    amount: 75000,
    stage: DealStage.PROPOSAL,
    probability: 70,
    expectedCloseDate: new Date('2025-05-30'),
    assignedTo: '2',
    notes: [
      {
        id: '2',
        content: 'Client requested additional features',
        createdBy: '2',
        createdAt: new Date('2025-04-01T11:45:00'),
      }
    ],
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: '2',
    name: 'IT Infrastructure Upgrade',
    customerId: '2',
    amount: 125000,
    stage: DealStage.NEEDS_ANALYSIS,
    probability: 50,
    expectedCloseDate: new Date('2025-06-15'),
    assignedTo: '1',
    createdAt: new Date('2025-03-10'),
    updatedAt: new Date('2025-03-25'),
  },
  {
    id: '3',
    name: 'Supply Chain Optimization',
    customerId: '1',
    amount: 45000,
    stage: DealStage.CLOSED_WON,
    probability: 100,
    expectedCloseDate: new Date('2025-04-01'),
    actualCloseDate: new Date('2025-03-29'),
    assignedTo: '3',
    createdAt: new Date('2025-01-20'),
    updatedAt: new Date('2025-03-29'),
  },
];

// Mock Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Enterprise CRM Suite',
    sku: 'CRM-ENT-001',
    description: 'Complete customer relationship management solution for enterprise clients',
    price: 2499.99,
    category: 'Software',
    inStock: 999,
    createdAt: new Date('2024-08-10'),
    updatedAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    name: 'Cloud Storage Solution',
    sku: 'CLD-STR-001',
    description: 'Secure cloud storage with enhanced encryption and access controls',
    price: 599.99,
    category: 'Services',
    inStock: 999,
    createdAt: new Date('2024-09-05'),
    updatedAt: new Date('2025-02-20'),
  },
  {
    id: '3',
    name: 'Smart Analytics Platform',
    sku: 'ANL-PLT-001',
    description: 'AI-powered business intelligence and analytics platform',
    price: 1299.99,
    category: 'Software',
    inStock: 50,
    lowStockThreshold: 20,
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2025-03-10'),
  },
];

// Mock Projects
export const projects: Project[] = [
  {
    id: '1',
    name: 'CRM Implementation',
    description: 'Full implementation of Nexus CRM system',
    customerId: '1',
    status: ProjectStatus.IN_PROGRESS,
    startDate: new Date('2025-02-01'),
    endDate: new Date('2025-06-30'),
    budget: 150000,
    team: ['1', '2', '3'],
    createdAt: new Date('2025-01-15'),
    updatedAt: new Date('2025-04-05'),
  },
  {
    id: '2',
    name: 'IT Infrastructure Assessment',
    description: 'Comprehensive assessment of current IT infrastructure',
    customerId: '2',
    status: ProjectStatus.PLANNED,
    startDate: new Date('2025-05-15'),
    endDate: new Date('2025-06-15'),
    budget: 45000,
    team: ['1', '3'],
    createdAt: new Date('2025-03-20'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: '3',
    name: 'Digital Transformation Strategy',
    description: 'Development of digital transformation roadmap',
    customerId: '3',
    status: ProjectStatus.ON_HOLD,
    startDate: new Date('2025-03-01'),
    budget: 75000,
    team: ['2'],
    createdAt: new Date('2025-02-10'),
    updatedAt: new Date('2025-03-25'),
  },
];

// Mock Tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Initial client meeting',
    description: 'Conduct kickoff meeting with Acme Corp',
    status: TaskStatus.DONE,
    priority: Priority.HIGH,
    assignedTo: '1',
    dueDate: new Date('2025-02-10'),
    completedAt: new Date('2025-02-09'),
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-09'),
  },
  {
    id: '2',
    title: 'Prepare project proposal',
    description: 'Create detailed proposal for TechNova',
    status: TaskStatus.IN_PROGRESS,
    priority: Priority.MEDIUM,
    assignedTo: '2',
    dueDate: new Date('2025-04-15'),
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-05'),
  },
  {
    id: '3',
    title: 'System architecture design',
    description: 'Design system architecture for CRM implementation',
    status: TaskStatus.TODO,
    priority: Priority.HIGH,
    assignedTo: '3',
    dueDate: new Date('2025-04-20'),
    createdAt: new Date('2025-04-05'),
    updatedAt: new Date('2025-04-05'),
  },
  {
    id: '4',
    title: 'Review contract terms',
    description: 'Legal review of GreenLeaf contract',
    status: TaskStatus.REVIEW,
    priority: Priority.URGENT,
    assignedTo: '1',
    dueDate: new Date('2025-04-12'),
    createdAt: new Date('2025-04-03'),
    updatedAt: new Date('2025-04-08'),
  },
];

// Sales Statistics for Dashboard
export const salesStatistics = {
  currentMonth: 325000,
  previousMonth: 290000,
  growth: 12.1,
  forecast: 360000,
  bySalesStage: [
    { stage: 'Qualification', value: 150000 },
    { stage: 'Needs Analysis', value: 225000 },
    { stage: 'Proposal', value: 320000 },
    { stage: 'Negotiation', value: 180000 },
    { stage: 'Closed Won', value: 275000 },
  ],
  byMonth: [
    { month: 'Jan', value: 210000 },
    { month: 'Feb', value: 230000 },
    { month: 'Mar', value: 290000 },
    { month: 'Apr', value: 325000 },
  ],
};

// Customer Growth Statistics
export const customerGrowth = {
  total: 87,
  newThisMonth: 12,
  growth: 16.2,
  byStatus: [
    { status: 'Lead', count: 32 },
    { status: 'Prospect', count: 18 },
    { status: 'Customer', count: 37 },
  ],
  byMonth: [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 72 },
    { month: 'Mar', value: 75 },
    { month: 'Apr', value: 87 },
  ],
};

// Activity Feed
export const activityFeed = [
  {
    id: '1',
    type: 'deal_created',
    content: 'New deal created: Data Analytics Platform',
    user: 'Jane Smith',
    timestamp: new Date('2025-04-10T09:15:00'),
  },
  {
    id: '2',
    type: 'task_completed',
    content: 'Task completed: Initial client meeting',
    user: 'John Doe',
    timestamp: new Date('2025-04-09T16:30:00'),
  },
  {
    id: '3',
    type: 'customer_created',
    content: 'New customer added: GreenLeaf Organics',
    user: 'Mike Johnson',
    timestamp: new Date('2025-04-08T11:45:00'),
  },
  {
    id: '4',
    type: 'project_status',
    content: 'Project status updated: CRM Implementation (In Progress)',
    user: 'John Doe',
    timestamp: new Date('2025-04-07T14:20:00'),
  },
  {
    id: '5',
    type: 'deal_stage',
    content: 'Deal stage updated: Annual Software License (Proposal)',
    user: 'Jane Smith',
    timestamp: new Date('2025-04-06T10:10:00'),
  },
];

// Mock Properties
export const properties: Property[] = [
  {
    id: '1',
    title: 'Modern Family Home',
    description: 'A beautiful 4-bedroom family home with a large garden.',
    type: PropertyType.RESIDENTIAL,
    status: PropertyStatus.AVAILABLE,
    address: {
      street: '101 Maple Ave',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62704',
      country: 'USA',
    },
    price: 350000,
    area: 2500,
    bedrooms: 4,
    bathrooms: 3,
    images: [],
    ownerId: '1',
    agentId: '2',
    listedDate: new Date('2025-04-01'),
    createdAt: new Date('2025-04-01'),
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: '2',
    title: 'Downtown Office Space',
    type: PropertyType.COMMERCIAL,
    status: PropertyStatus.UNDER_OFFER,
    address: {
      street: '500 Market St',
      city: 'Metropolis',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    price: 1200000,
    area: 8000,
    images: [],
    ownerId: '2',
    agentId: '3',
    listedDate: new Date('2025-03-15'),
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-04-10'),
  },
];

// Mock Leases
export const leases: Lease[] = [
  {
    id: '1',
    propertyId: '1',
    tenantId: '3',
    startDate: new Date('2025-05-01'),
    rentAmount: 2200,
    depositAmount: 4400,
    status: LeaseStatus.PENDING,
    createdAt: new Date('2025-04-15'),
    updatedAt: new Date('2025-04-15'),
  },
];

// Mock Financial Transactions
export const transactions: FinancialTransaction[] = [
  {
    id: '1',
    propertyId: '1',
    type: TransactionType.RENT,
    amount: 2200,
    date: new Date('2025-05-01'),
    createdBy: '3',
    createdAt: new Date('2025-05-01'),
  },
  {
    id: '2',
    propertyId: '2',
    type: TransactionType.SALE,
    amount: 1200000,
    date: new Date('2025-04-10'),
    createdBy: '2',
    createdAt: new Date('2025-04-10'),
  },
];

// Mock Marketing Campaigns
export const campaigns: MarketingCampaign[] = [
  {
    id: '1',
    name: 'Spring Sale Email Blast',
    type: CampaignType.EMAIL,
    startDate: new Date('2025-03-20'),
    endDate: new Date('2025-04-20'),
    properties: ['1', '2'],
    budget: 5000,
    status: CampaignStatus.COMPLETED,
    createdAt: new Date('2025-03-15'),
    updatedAt: new Date('2025-04-20'),
  },
];

// Mock Documents
export const documents: Document[] = [
  {
    id: '1',
    name: 'Lease Agreement - Modern Family Home',
    url: '/docs/lease-agreement-1.pdf',
    type: DocumentType.CONTRACT,
    uploadedBy: '2',
    uploadedAt: new Date('2025-04-15'),
  },
  {
    id: '2',
    name: 'Deed - Downtown Office Space',
    url: '/docs/deed-2.pdf',
    type: DocumentType.DEED,
    uploadedBy: '1',
    uploadedAt: new Date('2025-04-10'),
  },
];