
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { BoardroomHeader } from "@/components/dashboard/BoardroomHeader";
import { LiveKPICards } from "@/components/dashboard/LiveKPICards";
import { PropertySalesChart } from "@/components/dashboard/PropertySalesChart";
import { PropertyInventoryChart } from "@/components/dashboard/PropertyInventoryChart";
import { EmployeeMetrics } from "@/components/dashboard/EmployeeMetrics";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { RealEstateAnalytics } from "@/components/dashboard/RealEstateAnalytics";

const Index = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <BoardroomHeader />
        
        <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
          <LiveKPICards />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="animate-fade-in" style={{ animationDelay: '400ms' }}>
            <PropertySalesChart />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
            <PropertyInventoryChart />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="animate-fade-in" style={{ animationDelay: '800ms' }}>
            <EmployeeMetrics />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '1000ms' }}>
            <RecentTransactions />
          </div>
          <div className="animate-fade-in" style={{ animationDelay: '1200ms' }}>
            <RealEstateAnalytics />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
