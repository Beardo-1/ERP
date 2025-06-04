
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

// Real Estate specific data simulation
const fetchRealEstateKPIs = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const baseRevenue = 15750000; // $15.75M monthly revenue
  const variance = (Math.random() - 0.5) * 0.15; // ±7.5% variance
  
  return {
    totalRevenue: Math.round(baseRevenue * (1 + variance)),
    activeListing: Math.round(342 * (1 + variance * 0.6)),
    propertiesSold: Math.round(28 * (1 + variance * 0.8)),
    avgPropertyValue: Math.round(875000 * (1 + variance * 0.3)),
    lastUpdated: new Date().toLocaleTimeString()
  };
};

const fetchPropertySalesData = async () => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map(month => ({
    month,
    residential: Math.round(12000000 + Math.random() * 8000000),
    commercial: Math.round(8000000 + Math.random() * 5000000),
    luxury: Math.round(15000000 + Math.random() * 10000000),
    revenue: Math.round(250000 + Math.random() * 200000), // Add revenue for LiveRevenueChart
    expenses: Math.round(180000 + Math.random() * 120000) // Add expenses for LiveRevenueChart
  }));
};

const fetchPropertyTypesData = async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  const propertyTypes = ["Single Family", "Condos", "Townhomes", "Commercial", "Luxury Homes", "Land/Lots"];
  return propertyTypes.map(type => ({
    type,
    available: Math.round(45 + Math.random() * 80),
    pending: Math.round(8 + Math.random() * 25),
    sold: Math.round(3 + Math.random() * 15),
    avgPrice: Math.round(650000 + Math.random() * 400000),
    // Add properties for LiveInventoryChart compatibility
    inStock: Math.round(45 + Math.random() * 80),
    lowStock: Math.round(8 + Math.random() * 25),
    outOfStock: Math.round(2 + Math.random() * 8)
  }));
};

const fetchMarketTrendsData = async () => {
  await new Promise(resolve => setTimeout(resolve, 350));
  
  const areas = ["Downtown", "Suburbs", "Waterfront", "Historic District", "New Development", "Mountain View"];
  return areas.map(area => ({
    area,
    avgPrice: Math.round(750000 + Math.random() * 500000),
    priceChange: ((Math.random() - 0.5) * 20).toFixed(1), // ±10% change
    volume: Math.round(15 + Math.random() * 35),
    daysOnMarket: Math.round(25 + Math.random() * 40)
  }));
};

export const useRealTimeKPIs = () => {
  return useQuery({
    queryKey: ['real-estate-kpis'],
    queryFn: fetchRealEstateKPIs,
    refetchInterval: 30000,
    refetchIntervalInBackground: true,
  });
};

export const useRealTimeRevenue = () => {
  return useQuery({
    queryKey: ['property-sales-data'],
    queryFn: fetchPropertySalesData,
    refetchInterval: 60000,
    refetchIntervalInBackground: true,
  });
};

export const useRealTimeInventory = () => {
  return useQuery({
    queryKey: ['property-types-data'],
    queryFn: fetchPropertyTypesData,
    refetchInterval: 45000,
    refetchIntervalInBackground: true,
  });
};

export const useMarketTrends = () => {
  return useQuery({
    queryKey: ['market-trends-data'],
    queryFn: fetchMarketTrendsData,
    refetchInterval: 50000,
    refetchIntervalInBackground: true,
  });
};

export const useAutoRefresh = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return lastRefresh;
};
