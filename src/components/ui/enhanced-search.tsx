import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Filter, X, Clock, TrendingUp, FileText, Users, Building } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

// Search result types
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  type: 'customer' | 'property' | 'document' | 'transaction' | 'user' | 'other';
  url?: string;
  metadata?: Record<string, any>;
  relevance?: number;
}

// Search filter types
export interface SearchFilter {
  id: string;
  label: string;
  type: 'select' | 'date' | 'range' | 'boolean';
  options?: { value: string; label: string }[];
  value?: any;
}

// Search suggestion types
export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'suggestion';
  count?: number;
}

interface EnhancedSearchProps {
  placeholder?: string;
  onSearch?: (query: string, filters?: Record<string, any>) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  suggestions?: SearchSuggestion[];
  filters?: SearchFilter[];
  isLoading?: boolean;
  showFilters?: boolean;
  showSuggestions?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const EnhancedSearch: React.FC<EnhancedSearchProps> = ({
  placeholder = 'Search across all modules...',
  onSearch,
  onResultSelect,
  results = [],
  suggestions = [],
  filters = [],
  isLoading = false,
  showFilters = true,
  showSuggestions = true,
  className,
  size = 'md'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Size variants
  const sizeClasses = {
    sm: 'h-8 text-sm',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base'
  };

  // Handle search
  const handleSearch = useCallback((searchQuery: string = query) => {
    if (searchQuery.trim()) {
      onSearch?.(searchQuery, activeFilters);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 5);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
        return updated;
      });
    }
  }, [query, activeFilters, onSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(true);
    
    // Debounced search for suggestions
    if (value.length > 2) {
      const timeoutId = setTimeout(() => {
        handleSearch(value);
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterId: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
  };

  // Clear filter
  const clearFilter = (filterId: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      delete updated[filterId];
      return updated;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setActiveFilters({});
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
    setIsOpen(false);
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    onResultSelect?.(result);
    setIsOpen(false);
  };

  // Get result icon
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'customer': return <Users className="w-4 h-4" />;
      case 'property': return <Building className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'user': return <Users className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  // Get suggestion icon
  const getSuggestionIcon = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent': return <Clock className="w-4 h-4" />;
      case 'popular': return <TrendingUp className="w-4 h-4" />;
      default: return <Search className="w-4 h-4" />;
    }
  };

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const hasActiveFilters = Object.keys(activeFilters).length > 0;
  const combinedSuggestions = [
    ...recentSearches.map(search => ({
      id: `recent-${search}`,
      text: search,
      type: 'recent' as const
    })),
    ...suggestions
  ];

  return (
    <div ref={searchRef} className={cn('relative w-full max-w-2xl', className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
              setIsOpen(false);
            }
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          className={cn(
            'pl-10 pr-20',
            sizeClasses[size],
            hasActiveFilters && 'border-primary'
          )}
        />
        
        {/* Filter Button */}
        {showFilters && (
          <Button
            variant={showFilterPanel ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <Filter className="w-3 h-3" />
          </Button>
        )}
        
        {/* Clear Button */}
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(activeFilters).map(([filterId, value]) => {
            const filter = filters.find(f => f.id === filterId);
            if (!filter || !value) return null;
            
            return (
              <Badge key={filterId} variant="secondary" className="text-xs">
                {filter.label}: {String(value)}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(filterId)}
                  className="ml-1 h-3 w-3 p-0 hover:bg-transparent"
                >
                  <X className="w-2 h-2" />
                </Button>
              </Badge>
            );
          })}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Filter Panel */}
      {showFilterPanel && showFilters && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-lg">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map(filter => (
                <div key={filter.id} className="space-y-2">
                  <label className="text-sm font-medium">{filter.label}</label>
                  {filter.type === 'select' && filter.options && (
                    <select
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md text-sm"
                    >
                      <option value="">All</option>
                      {filter.options.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {filter.type === 'date' && (
                    <Input
                      type="date"
                      value={activeFilters[filter.id] || ''}
                      onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                      className="text-sm"
                    />
                  )}
                  {filter.type === 'boolean' && (
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={activeFilters[filter.id] || false}
                        onChange={(e) => handleFilterChange(filter.id, e.target.checked)}
                        className="rounded border-border"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Dropdown */}
      {isOpen && (showSuggestions || results.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg max-h-96 overflow-hidden">
          <CardContent className="p-0">
            {/* Loading State */}
            {isLoading && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Searching...
              </div>
            )}

            {/* Results */}
            {!isLoading && results.length > 0 && (
              <div>
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted">
                  Results ({results.length})
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {results.map(result => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                        {getResultIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">{result.title}</div>
                        {result.description && (
                          <div className="text-xs text-muted-foreground truncate">
                            {result.description}
                          </div>
                        )}
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {result.type}
                          </Badge>
                          {result.relevance && (
                            <span className="text-xs text-muted-foreground">
                              {Math.round(result.relevance * 100)}% match
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suggestions */}
            {!isLoading && showSuggestions && combinedSuggestions.length > 0 && (
              <div>
                {results.length > 0 && <Separator />}
                <div className="px-3 py-2 text-xs font-medium text-muted-foreground bg-muted">
                  {recentSearches.length > 0 ? 'Recent & Suggestions' : 'Suggestions'}
                </div>
                <div className="max-h-32 overflow-y-auto">
                  {combinedSuggestions.slice(0, 8).map(suggestion => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full px-3 py-2 text-left hover:bg-accent transition-colors flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0 text-muted-foreground">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1 text-sm">{suggestion.text}</div>
                      {suggestion.count && (
                        <div className="text-xs text-muted-foreground">
                          {suggestion.count}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results */}
            {!isLoading && query.length > 2 && results.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No results found for "{query}"
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Global Search Hook
export const useGlobalSearch = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const openSearch = useCallback(() => {
    setIsSearchOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsSearchOpen(false);
    setSearchResults([]);
  }, []);

  const performSearch = useCallback(async (query: string, filters?: Record<string, any>) => {
    setIsLoading(true);
    try {
      // Simulate API call - replace with actual search implementation
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock results - replace with actual search results
      const mockResults: SearchResult[] = [
        {
          id: '1',
          title: `Customer: ${query}`,
          description: 'Customer management record',
          type: 'customer',
          url: '/customers/1'
        },
        {
          id: '2',
          title: `Property: ${query}`,
          description: 'Property management record',
          type: 'property',
          url: '/properties/1'
        }
      ];
      
      setSearchResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSearchOpen,
    searchResults,
    isLoading,
    openSearch,
    closeSearch,
    performSearch
  };
}; 