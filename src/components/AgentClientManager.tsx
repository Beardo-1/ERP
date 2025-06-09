import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Eye, Phone, Mail, Calendar, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Clock, Banknote, CreditCard, Home, Building, ChevronRight, ChevronDown, Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { dataService, Agent, Tenant, ContactRecord } from '@/services/dataService';

interface AgentClientManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentWithClients extends Agent {
  clients: Tenant[];
  totalClients: number;
  activeClients: number;
  overdueClients: number;
  totalOutstanding: number;
  avgPaymentDelay: number;
  clientSatisfactionScore: number;
}

interface ClientDetail extends Tenant {
  agent_name: string;
  project_name: string;
  days_overdue: number;
  payment_trend: 'improving' | 'declining' | 'stable';
  risk_score: number;
  last_contact: string;
  contact_history: ContactRecord[];
}

const AgentClientManager: React.FC<AgentClientManagerProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [agentsWithClients, setAgentsWithClients] = useState<AgentWithClients[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientDetail | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [showClientDetail, setShowClientDetail] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadAgentClientData();
    }
  }, [isOpen]);

  const loadAgentClientData = async () => {
    try {
      setLoading(true);
      const [agents, tenants, projects] = await Promise.all([
        dataService.getAgents(),
        dataService.getTenants(),
        dataService.getProjects()
      ]);
      const agentsWithClientData: AgentWithClients[] = agents.map(agent => {
        const agentTenants = tenants.filter(tenant => agent.assigned_projects.includes(tenant.project_id));
        const activeClients = agentTenants.filter(t => t.payment_status === 'current').length;
        const overdueClients = agentTenants.filter(t => t.payment_status === 'overdue').length;
        const totalOutstanding = agentTenants.reduce((sum, t) => sum + t.outstanding_amount, 0);
        const overduePayments = agentTenants.filter(t => t.payment_status === 'overdue');
        const avgPaymentDelay = overduePayments.length > 0 
          ? overduePayments.reduce((sum, t) => {
              const daysSinceLastPayment = Math.floor((new Date().getTime() - new Date(t.last_payment).getTime()) / (1000 * 60 * 60 * 24));
              return sum + daysSinceLastPayment;
            }, 0) / overduePayments.length
          : 0;
        return {
          ...agent,
          clients: agentTenants,
          totalClients: agentTenants.length,
          activeClients,
          overdueClients,
          totalOutstanding,
          avgPaymentDelay: Math.round(avgPaymentDelay),
          clientSatisfactionScore: agent.ratings.customer_satisfaction
        };
      });
      setAgentsWithClients(agentsWithClientData);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load agent-client data', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleViewClientDetails = async (client: Tenant, agent: AgentWithClients) => {
    try {
      const [projects, contactHistory] = await Promise.all([
        dataService.getProjects(),
        dataService.getContactHistory(client.id)
      ]);
      const project = projects.find(p => p.id === client.project_id);
      const daysSinceLastPayment = Math.floor((new Date().getTime() - new Date(client.last_payment).getTime()) / (1000 * 60 * 60 * 24));
      const paymentTrend = client.payment_history.length >= 3 
        ? (client.payment_history.slice(-3).every((p, i, arr) => i === 0 || p.amount >= arr[i-1].amount) ? 'improving' : 'declining')
        : 'stable';
      const riskScore = calculateRiskScore(client, daysSinceLastPayment);
      const lastContact = contactHistory.length > 0 ? contactHistory[0].date : 'No contact recorded';
      const clientDetail: ClientDetail = {
        ...client,
        agent_name: agent.name,
        project_name: project?.name || 'Unknown Project',
        days_overdue: client.payment_status === 'overdue' ? daysSinceLastPayment : 0,
        payment_trend: paymentTrend as 'improving' | 'declining' | 'stable',
        risk_score: riskScore,
        last_contact: lastContact,
        contact_history: contactHistory
      };
      setSelectedClient(clientDetail);
      setShowClientDetail(true);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load client details', variant: 'destructive' });
    }
  };

  const calculateRiskScore = (client: Tenant, daysOverdue: number): number => {
    let score = 0;
    if (client.payment_status === 'overdue') score += 40;
    else if (client.payment_status === 'partial') score += 20;
    if (daysOverdue > 60) score += 30;
    else if (daysOverdue > 30) score += 20;
    else if (daysOverdue > 15) score += 10;
    if (client.outstanding_amount > client.monthly_rent * 3) score += 20;
    else if (client.outstanding_amount > client.monthly_rent * 2) score += 15;
    else if (client.outstanding_amount > client.monthly_rent) score += 10;
    if(client.payment_history.length > 0) {
      const recentPayments = client.payment_history.slice(-6);
      const latePayments = recentPayments.filter(p => p.status === 'failed').length;
      if (recentPayments.length > 0) {
        score += (latePayments / recentPayments.length) * 10;
      }
    }
    return Math.min(100, Math.max(0, Math.round(score)));
  };

  const filteredAgents = useMemo(() => agentsWithClients.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || agent.region === filterRegion;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'high_performance' && agent.collection_rate >= 90) ||
      (filterStatus === 'needs_attention' && agent.collection_rate < 80) ||
      (filterStatus === 'overdue_clients' && agent.overdueClients > 0);
    return matchesSearch && matchesRegion && matchesStatus;
  }), [agentsWithClients, searchTerm, filterRegion, filterStatus]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'overdue': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'partial': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  const getRiskColor = (score: number) => {
    if (score >= 70) return 'text-red-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-green-500';
  };
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'declining': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <Activity className="w-4 h-4 text-blue-500" />;
    }
  };

  const AgentCard = ({ agent }: { agent: AgentWithClients }) => (
    <Card key={agent.id} className="w-full bg-gray-800/20 border-gray-700/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img src={agent.profile_image || '/user-placeholder.png'} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-primary" />
            <div>
              <CardTitle className="text-xl text-white">{agent.name}</CardTitle>
              <p className="text-sm text-gray-400">{agent.email}</p>
              <p className="text-sm text-gray-400">Region: {agent.region}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}>
            {expandedAgent === agent.id ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </div>
      </CardHeader>
      <AnimatePresence>
        {expandedAgent === agent.id && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                <div><p className="text-2xl font-bold">{agent.totalClients}</p><p className="text-sm text-gray-400">Total Clients</p></div>
                <div><p className="text-2xl font-bold">{agent.activeClients}</p><p className="text-sm text-gray-400">Active</p></div>
                <div><p className="text-2xl font-bold text-red-500">{agent.overdueClients}</p><p className="text-sm text-gray-400">Overdue</p></div>
                <div><p className="text-2xl font-bold">{agent.collection_rate}%</p><p className="text-sm text-gray-400">Collection Rate</p></div>
              </div>
              <Tabs defaultValue="clients">
                <TabsList>
                  <TabsTrigger value="clients">Clients ({agent.clients.length})</TabsTrigger>
                </TabsList>
                <TabsContent value="clients">
                  <div className="max-h-60 overflow-y-auto">
                    {agent.clients.map(client => (
                      <div key={client.id} className="flex justify-between items-center p-2 hover:bg-gray-700/50 rounded-md">
                        <div>
                          <p className="font-semibold">{client.name}</p>
                          <p className="text-xs text-gray-400">Unit: {client.unit_number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(client.payment_status)}>{client.payment_status}</Badge>
                          <Button size="sm" variant="outline" onClick={() => handleViewClientDetails(client, agent)}>
                            <Eye className="w-4 h-4 mr-2" /> Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );

  const ClientDetailModal = () => (
    <Dialog open={showClientDetail} onOpenChange={setShowClientDetail}>
      <DialogContent className="max-w-3xl bg-gray-900 border-gray-700 text-white">
        {selectedClient && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedClient.name}</DialogTitle>
              <p className="text-sm text-gray-400">Assigned to: {selectedClient.agent_name}</p>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div>
                <h4 className="font-semibold mb-2 text-primary">Client & Property</h4>
                <p><User className="inline-block w-4 h-4 mr-2" /> {selectedClient.national_id}</p>
                <p><Phone className="inline-block w-4 h-4 mr-2" /> {selectedClient.phone}</p>
                <p><Mail className="inline-block w-4 h-4 mr-2" /> {selectedClient.email}</p>
                <p><Building className="inline-block w-4 h-4 mr-2" /> {selectedClient.project_name}</p>
                <p><Home className="inline-block w-4 h-4 mr-2" /> Unit {selectedClient.unit_number}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-primary">Financial Status</h4>
                <p><Banknote className="inline-block w-4 h-4 mr-2" /> Rent: {formatCurrency(selectedClient.monthly_rent)}</p>
                <p className={selectedClient.payment_status === 'overdue' ? 'text-red-400' : ''}>
                  <CreditCard className="inline-block w-4 h-4 mr-2" /> Status: {selectedClient.payment_status}
                </p>
                <p className="text-red-400"><AlertTriangle className="inline-block w-4 h-4 mr-2" /> Overdue: {formatCurrency(selectedClient.outstanding_amount)}</p>
                <p><Calendar className="inline-block w-4 h-4 mr-2" /> Last Payment: {new Date(selectedClient.last_payment).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="mt-6">
              <h4 className="font-semibold mb-2 text-primary">Risk & Contact</h4>
              <div className="flex items-center gap-8">
                <div>
                  <p>Risk Score</p>
                  <p className={`text-3xl font-bold ${getRiskColor(selectedClient.risk_score)}`}>{selectedClient.risk_score}</p>
                </div>
                <div>
                  <p>Payment Trend</p>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(selectedClient.payment_trend)}
                    <span className="capitalize">{selectedClient.payment_trend}</span>
                  </div>
                </div>
                <div>
                  <p>Last Contact</p>
                  <p>{selectedClient.last_contact !== 'No contact recorded' ? new Date(selectedClient.last_contact).toLocaleString() : 'No contact recorded'}</p>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Tabs defaultValue="contact_history">
                <TabsList>
                  <TabsTrigger value="contact_history">Contact History</TabsTrigger>
                  <TabsTrigger value="payment_history">Payment History</TabsTrigger>
                </TabsList>
                <TabsContent value="contact_history" className="max-h-48 overflow-y-auto">
                  {selectedClient.contact_history.map(record => (
                    <div key={record.id} className="p-2 border-b border-gray-700">
                      <p className="font-semibold">
                        {new Date(record.date).toLocaleString()} - <span className="capitalize">{record.type}</span> ({record.outcome})
                      </p>
                      <p className="text-sm text-gray-300">{record.notes}</p>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="payment_history" className="max-h-48 overflow-y-auto">
                  {selectedClient.payment_history.map(record => (
                    <div key={record.id} className="p-2 border-b border-gray-700 flex justify-between">
                      <div>
                        <p className="font-semibold">{formatCurrency(record.amount)} via {record.payment_method}</p>
                        <p className="text-sm text-gray-300">{record.reference_number}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{new Date(record.payment_date).toLocaleDateString()}</p>
                        <Badge className={record.status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}>{record.status}</Badge>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="max-w-7xl max-h-[90vh] bg-gray-900 border-gray-800 text-white overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Users className="w-8 h-8 text-primary" />
            Agent-Client Relationship Manager
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col sm:flex-row gap-4 p-1">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input 
              placeholder="Search agents by name or email..." 
              className="pl-10 bg-gray-800 border-gray-700"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="high_performance">High Performance</SelectItem>
              <SelectItem value="needs_attention">Needs Attention</SelectItem>
              <SelectItem value="overdue_clients">With Overdue Clients</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterRegion} onValueChange={setFilterRegion}>
            <SelectTrigger className="w-full sm:w-[180px] bg-gray-800 border-gray-700">
              <SelectValue placeholder="Filter by region" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white">
              <SelectItem value="all">All Regions</SelectItem>
              {[...new Set(agentsWithClients.map(a => a.region))].map(region => (
                <SelectItem key={region} value={region}>{region}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={loadAgentClientData} variant="outline"><RefreshCw className="w-4 h-4 mr-2" /> Refresh</Button>
        </div>
        <div className="flex-grow overflow-y-auto mt-4 p-1">
          {loading ? (
            <div className="flex justify-center items-center h-full"><p>Loading data...</p></div>
          ) : (
            <div className="space-y-4">
              {filteredAgents.map(agent => <AgentCard key={agent.id} agent={agent} />)}
            </div>
          )}
        </div>
        <ClientDetailModal />
      </DialogContent>
    </Dialog>
  );
};

export default AgentClientManager; 