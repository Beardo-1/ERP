# Agent-Client Management System

## Overview

The Agent-Client Management System is a comprehensive module that provides detailed insights into the relationship between collection agents and their assigned clients (tenants). This system enables efficient management of agent-client relationships, performance tracking, and client risk assessment.

## Features

### 1. Agent Overview Dashboard
- **Agent Performance Metrics**: Collection rates, client counts, outstanding amounts
- **Client Distribution**: Active vs. overdue clients per agent
- **Expandable Client Lists**: Detailed view of each agent's assigned clients
- **Performance Filtering**: Filter agents by performance levels and regions

### 2. Client Management
- **Comprehensive Client Profiles**: Complete tenant information with payment history
- **Risk Assessment**: Automated risk scoring based on payment behavior
- **Payment Trend Analysis**: Visual indicators for improving/declining payment patterns
- **Contact History Tracking**: Record of all agent-client interactions

### 3. Advanced Analytics
- **Risk Scoring Algorithm**: Multi-factor risk assessment including:
  - Payment status (current/overdue/partial)
  - Days overdue calculation
  - Outstanding amount relative to rent
  - Historical payment performance
- **Performance Metrics**: Agent efficiency and client satisfaction scores
- **Trend Analysis**: Payment behavior patterns and predictions

## How to Access

1. Navigate to **Property Management** page (`/properties`)
2. Click the **"Agent-Client Manager"** button (teal-colored button with Users icon)
3. The system will load all agent-client relationships automatically

## Interface Components

### Main Dashboard

#### Agent Overview Tab
- **Search & Filter**: Find agents by name, email, region, or performance level
- **Agent Cards**: Each card displays:
  - Agent basic information (name, region, employee ID)
  - Collection rate badge with color coding
  - Summary statistics (total clients, active, overdue, outstanding amount)
  - Expandable client list with individual client details

#### All Clients Tab
- **Client Grid View**: All clients across all agents
- **Quick Actions**: Call, email, and view details buttons
- **Status Indicators**: Visual payment status badges
- **Agent Assignment**: Shows which agent is responsible for each client

### Client Detail Modal

When clicking on a client, you get access to:

#### Property Information
- Project name and unit details
- Monthly rent amount
- Lease information

#### Payment Status
- Current payment status with trend indicators
- Outstanding amount (if any)
- Days overdue calculation
- Payment trend visualization (improving/declining/stable)

#### Risk Assessment
- Automated risk score (0-100)
- Color-coded risk levels:
  - **Green (0-39)**: Low risk
  - **Yellow (40-69)**: Medium risk
  - **Red (70-100)**: High risk
- Progress bar visualization

#### Contact Information
- Phone and email with quick action buttons
- Assigned agent information
- Last contact date
- Contact history access

#### Payment History
- Recent payment transactions
- Payment methods and dates
- Transaction status tracking
- Reference numbers and notes

### Contact History Modal

Detailed tracking of all agent-client interactions:
- **Contact Types**: Call, visit, email, SMS
- **Outcomes**: Successful, no answer, promised payment, dispute
- **Timestamps**: Date and time of each interaction
- **Notes**: Detailed notes from each contact attempt
- **Agent Attribution**: Which agent made the contact

## Risk Scoring Algorithm

The system uses a sophisticated risk scoring algorithm that considers:

### Payment Status Weight (40 points max)
- **Overdue**: 40 points
- **Partial**: 20 points
- **Current**: 0 points

### Days Overdue Weight (30 points max)
- **60+ days**: 30 points
- **31-60 days**: 20 points
- **16-30 days**: 10 points
- **0-15 days**: 0 points

### Outstanding Amount Weight (20 points max)
- **3+ months rent**: 20 points
- **2-3 months rent**: 15 points
- **1-2 months rent**: 10 points
- **Less than 1 month**: 0 points

### Payment History Weight (10 points max)
- Based on recent payment failures in last 6 transactions
- Calculated as: (failed payments / total payments) × 10

## Agent Performance Metrics

### Collection Rate Calculation
```
Collection Rate = (Monthly Collected / Monthly Target) × 100
```

### Client Distribution Metrics
- **Total Clients**: All assigned tenants
- **Active Clients**: Clients with current payment status
- **Overdue Clients**: Clients with overdue payments
- **Total Outstanding**: Sum of all outstanding amounts

### Performance Badges
- **High Performance**: 90%+ collection rate (Green)
- **Good Performance**: 80-89% collection rate (Blue)
- **Needs Attention**: <80% collection rate (Red)

## Filtering and Search Options

### Agent Filters
- **Region Filter**: Riyadh, Jeddah, Mecca, Medina, Dammam
- **Performance Filter**:
  - High Performance (90%+ collection rate)
  - Needs Attention (<80% collection rate)
  - Has Overdue Clients (agents with overdue clients)

### Search Functionality
- Search by agent name or email
- Real-time filtering as you type
- Case-insensitive search

## Data Integration

### Real-Time Data Sources
- **Agent Data**: From dataService.getAgents()
- **Tenant Data**: From dataService.getTenants()
- **Project Data**: From dataService.getProjects()
- **Payment Records**: From tenant payment history

### Relationship Mapping
- Agents are linked to projects via `assigned_projects` array
- Tenants are linked to projects via `project_id`
- Agent-client relationships are established through project assignments

## Business Intelligence Features

### Trend Analysis
- **Payment Trends**: Improving, declining, or stable patterns
- **Visual Indicators**: Color-coded trend arrows
- **Historical Analysis**: Based on last 3 payment transactions

### Performance Insights
- **Average Payment Delay**: Calculated for agents with overdue clients
- **Client Satisfaction Score**: Based on agent ratings
- **Collection Efficiency**: Monthly collected vs. target ratios

## Mobile Responsiveness

The system is fully responsive and optimized for:
- **Desktop**: Full feature access with expanded layouts
- **Tablet**: Optimized grid layouts and touch-friendly controls
- **Mobile**: Stacked layouts with essential information prioritized

## Security and Permissions

### Data Access Control
- Role-based access to sensitive client information
- Audit trail for all client interactions
- Secure handling of payment and contact data

### Privacy Compliance
- Client data protection measures
- Consent tracking for communications
- Data retention policies

## Integration with Other Modules

### Project Management
- Seamless integration with project data
- Cross-referencing of project performance and agent efficiency

### Payment Processing
- Real-time payment status updates
- Integration with payment history tracking

### Communication Systems
- Direct integration with call and email systems
- SMS communication tracking
- Automated follow-up scheduling

## Reporting and Analytics

### Available Reports
- **Agent Performance Summary**: Collection rates, client counts, outstanding amounts
- **Client Risk Assessment**: High-risk clients requiring attention
- **Payment Trend Analysis**: Improving vs. declining payment patterns
- **Contact Efficiency**: Success rates of different contact methods

### Export Capabilities
- CSV export of agent-client data
- Detailed client reports with payment history
- Risk assessment summaries

## Best Practices

### For Collection Agents
1. **Regular Contact**: Maintain consistent communication with clients
2. **Risk Monitoring**: Focus on high-risk clients (score >70)
3. **Trend Awareness**: Address declining payment trends early
4. **Documentation**: Record all client interactions thoroughly

### For Managers
1. **Performance Monitoring**: Regular review of agent collection rates
2. **Resource Allocation**: Assign high-risk clients to experienced agents
3. **Training Needs**: Identify agents needing additional support
4. **Client Retention**: Monitor satisfaction scores and address issues

### For System Administrators
1. **Data Quality**: Ensure accurate agent-project assignments
2. **Regular Updates**: Keep client information current
3. **Performance Optimization**: Monitor system response times
4. **Backup Procedures**: Regular data backups and recovery testing

## Troubleshooting

### Common Issues

#### Data Not Loading
- Check internet connection
- Verify API service availability
- Refresh the page and try again

#### Missing Client Information
- Verify agent-project assignments are correct
- Check if tenant data is properly linked to projects
- Ensure data service is returning complete records

#### Risk Scores Not Calculating
- Verify payment history data is available
- Check if payment dates are in correct format
- Ensure outstanding amounts are properly calculated

### Support Contacts
- **Technical Support**: IT Department
- **Business Process**: Operations Manager
- **Data Issues**: Database Administrator

## Future Enhancements

### Planned Features
- **Automated Alerts**: Real-time notifications for high-risk clients
- **Predictive Analytics**: AI-powered payment behavior predictions
- **Mobile App**: Dedicated mobile application for field agents
- **Integration APIs**: Third-party system integrations

### Feedback and Suggestions
The system is continuously improved based on user feedback. Please submit suggestions through the feedback system or contact the development team.

---

*Last Updated: December 2024*
*Version: 1.0* 