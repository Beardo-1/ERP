import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  Calendar,
  DollarSign,
  MapPin,
  Building,
  Users,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/components/SimpleLanguageSwitcher';

interface SearchFilters {
  query: string;
  propertyType: string[];
  status: string[];
  priceRange: [number, number];
  location: string[];
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
  agentId: string[];
  collectionStatus: string[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  searchType: 'properties' | 'customers' | 'collections';
  className?: string;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ 
  onSearch, 
  searchType, 
  className = '' 
}) => {
  const { t, isRTL } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    propertyType: [],
    status: [],
    priceRange: [0, 50000000], // 0 to 50M SAR
    location: [],
    dateRange: { from: null, to: null },
    agentId: [],
    collectionStatus: []
  });

  // Search options based on type
  const getSearchOptions = () => {
    switch (searchType) {
      case 'properties':
        return {
          propertyTypes: [
            { value: 'commercial', label: isRTL ? 'تجاري' : 'Commercial' },
            { value: 'residential', label: isRTL ? 'سكني' : 'Residential' },
            { value: 'industrial', label: isRTL ? 'صناعي' : 'Industrial' },
            { value: 'land', label: isRTL ? 'أرض' : 'Land' }
          ],
          statuses: [
            { value: 'available', label: isRTL ? 'متاح' : 'Available' },
            { value: 'leased', label: isRTL ? 'مؤجر' : 'Leased' },
            { value: 'sold', label: isRTL ? 'مباع' : 'Sold' },
            { value: 'maintenance', label: isRTL ? 'صيانة' : 'Maintenance' }
          ]
        };
      case 'customers':
        return {
          customerTypes: [
            { value: 'individual', label: isRTL ? 'فرد' : 'Individual' },
            { value: 'company', label: isRTL ? 'شركة' : 'Company' },
            { value: 'government', label: isRTL ? 'حكومي' : 'Government' }
          ],
          statuses: [
            { value: 'active', label: isRTL ? 'نشط' : 'Active' },
            { value: 'inactive', label: isRTL ? 'غير نشط' : 'Inactive' },
            { value: 'prospect', label: isRTL ? 'محتمل' : 'Prospect' }
          ]
        };
      case 'collections':
        return {
          collectionStatuses: [
            { value: 'collected', label: isRTL ? 'محصل' : 'Collected' },
            { value: 'pending', label: isRTL ? 'معلق' : 'Pending' },
            { value: 'overdue', label: isRTL ? 'متأخر' : 'Overdue' },
            { value: 'partial', label: isRTL ? 'جزئي' : 'Partial' }
          ]
        };
      default:
        return {};
    }
  };

  const locations = [
    { value: 'north_riyadh', label: t('dashboard.northRiyadh') },
    { value: 'south_riyadh', label: t('dashboard.southRiyadh') },
    { value: 'east_riyadh', label: t('dashboard.eastRiyadh') },
    { value: 'west_riyadh', label: t('dashboard.westRiyadh') },
    { value: 'central_riyadh', label: t('dashboard.centralRiyadh') }
  ];

  const agents = [
    { value: 'ahmed_rashid', label: 'Ahmed Al-Rashid' },
    { value: 'fatima_zahra', label: 'Fatima Al-Zahra' },
    { value: 'mohammed_saud', label: 'Mohammed Al-Saud' },
    { value: 'aisha_mansouri', label: 'Aisha Al-Mansouri' },
    { value: 'omar_khalil', label: 'Omar Al-Khalil' }
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const handleArrayFilterToggle = (key: keyof SearchFilters, value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    handleFilterChange(key, newArray);
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      propertyType: [],
      status: [],
      priceRange: [0, 50000000],
      location: [],
      dateRange: { from: null, to: null },
      agentId: [],
      collectionStatus: []
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return isRTL ? `${(price / 1000000).toFixed(1)} مليون ريال` : `${(price / 1000000).toFixed(1)}M SAR`;
    } else if (price >= 1000) {
      return isRTL ? `${(price / 1000).toFixed(0)} ألف ريال` : `${(price / 1000).toFixed(0)}K SAR`;
    }
    return isRTL ? `${price} ريال` : `${price} SAR`;
  };

  const activeFiltersCount = 
    filters.propertyType.length + 
    filters.status.length + 
    filters.location.length + 
    filters.agentId.length + 
    filters.collectionStatus.length +
    (filters.query ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000000 ? 1 : 0);

  const searchOptions = getSearchOptions();

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4`} />
          <Input
            placeholder={
              searchType === 'properties' 
                ? (isRTL ? 'البحث في العقارات...' : 'Search properties...')
                : searchType === 'customers'
                ? (isRTL ? 'البحث في العملاء...' : 'Search customers...')
                : (isRTL ? 'البحث في التحصيلات...' : 'Search collections...')
            }
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className={`${isRTL ? 'pr-10' : 'pl-10'} h-11`}
          />
        </div>
        
        <Button
          variant={isExpanded ? "default" : "outline"}
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-11 px-4"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          {isRTL ? 'فلاتر' : 'Filters'}
          {activeFiltersCount > 0 && (
            <Badge className="ml-2 bg-blue-500 text-white">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            onClick={clearFilters}
            className="h-11 text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            {isRTL ? 'مسح' : 'Clear'}
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  {isRTL ? 'فلاتر متقدمة' : 'Advanced Filters'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Property Type / Customer Type Filter */}
                  {(searchType === 'properties' && searchOptions.propertyTypes) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        {isRTL ? 'نوع العقار' : 'Property Type'}
                      </Label>
                      <div className="space-y-2">
                        {searchOptions.propertyTypes.map((type) => (
                          <div key={type.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={type.value}
                              checked={filters.propertyType.includes(type.value)}
                              onCheckedChange={() => handleArrayFilterToggle('propertyType', type.value)}
                            />
                            <Label htmlFor={type.value} className="text-sm">
                              {type.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Filter */}
                  {searchOptions.statuses && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        {isRTL ? 'الحالة' : 'Status'}
                      </Label>
                      <div className="space-y-2">
                        {searchOptions.statuses.map((status) => (
                          <div key={status.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={status.value}
                              checked={filters.status.includes(status.value)}
                              onCheckedChange={() => handleArrayFilterToggle('status', status.value)}
                            />
                            <Label htmlFor={status.value} className="text-sm">
                              {status.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collection Status Filter */}
                  {(searchType === 'collections' && searchOptions.collectionStatuses) && (
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        {isRTL ? 'حالة التحصيل' : 'Collection Status'}
                      </Label>
                      <div className="space-y-2">
                        {searchOptions.collectionStatuses.map((status) => (
                          <div key={status.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={status.value}
                              checked={filters.collectionStatus.includes(status.value)}
                              onCheckedChange={() => handleArrayFilterToggle('collectionStatus', status.value)}
                            />
                            <Label htmlFor={status.value} className="text-sm">
                              {status.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      {isRTL ? 'المنطقة' : 'Location'}
                    </Label>
                    <div className="space-y-2">
                      {locations.map((location) => (
                        <div key={location.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={location.value}
                            checked={filters.location.includes(location.value)}
                            onCheckedChange={() => handleArrayFilterToggle('location', location.value)}
                          />
                          <Label htmlFor={location.value} className="text-sm">
                            {location.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Agent Filter */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">
                      <Users className="w-4 h-4 inline mr-1" />
                      {isRTL ? 'المندوب' : 'Agent'}
                    </Label>
                    <div className="space-y-2">
                      {agents.map((agent) => (
                        <div key={agent.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={agent.value}
                            checked={filters.agentId.includes(agent.value)}
                            onCheckedChange={() => handleArrayFilterToggle('agentId', agent.value)}
                          />
                          <Label htmlFor={agent.value} className="text-sm">
                            {agent.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  {searchType === 'properties' && (
                    <div className="space-y-3 md:col-span-2">
                      <Label className="text-sm font-medium">
                        <DollarSign className="w-4 h-4 inline mr-1" />
                        {isRTL ? 'نطاق السعر' : 'Price Range'}
                      </Label>
                      <div className="space-y-4">
                        <Slider
                          value={filters.priceRange}
                          onValueChange={(value) => handleFilterChange('priceRange', value)}
                          max={50000000}
                          min={0}
                          step={100000}
                          className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600">
                          <span>{formatPrice(filters.priceRange[0])}</span>
                          <span>{formatPrice(filters.priceRange[1])}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-700">
                        {isRTL ? 'الفلاتر النشطة:' : 'Active Filters:'}
                      </span>
                      
                      {filters.query && (
                        <Badge variant="secondary" className="gap-1">
                          {isRTL ? 'البحث:' : 'Search:'} {filters.query}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleFilterChange('query', '')}
                          />
                        </Badge>
                      )}

                      {filters.propertyType.map(type => (
                        <Badge key={type} variant="secondary" className="gap-1">
                          {searchOptions.propertyTypes?.find(pt => pt.value === type)?.label}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleArrayFilterToggle('propertyType', type)}
                          />
                        </Badge>
                      ))}

                      {filters.status.map(status => (
                        <Badge key={status} variant="secondary" className="gap-1">
                          {searchOptions.statuses?.find(s => s.value === status)?.label}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleArrayFilterToggle('status', status)}
                          />
                        </Badge>
                      ))}

                      {filters.location.map(location => (
                        <Badge key={location} variant="secondary" className="gap-1">
                          {locations.find(l => l.value === location)?.label}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleArrayFilterToggle('location', location)}
                          />
                        </Badge>
                      ))}

                      {filters.agentId.map(agentId => (
                        <Badge key={agentId} variant="secondary" className="gap-1">
                          {agents.find(a => a.value === agentId)?.label}
                          <X 
                            className="w-3 h-3 cursor-pointer" 
                            onClick={() => handleArrayFilterToggle('agentId', agentId)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdvancedSearch; 