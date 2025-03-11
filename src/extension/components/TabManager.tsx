import React, { useState, useRef, useEffect } from 'react';
import Button from './Button';

interface TabManagerProps {
  tabs: Array<{
    id: number;
    title: string;
    url: string;
    favIconUrl?: string;
    active: boolean;
    pinned: boolean;
  }>;
  onTabAction: (action: string, tabId: number) => void;
  onBulkAction?: (action: string) => void;
}

const TabManager: React.FC<TabManagerProps> = ({ tabs, onTabAction, onBulkAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(true);
  const [filterOption, setFilterOption] = useState('active'); // Changed default to 'active'
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredTabs = tabs.filter(tab => {
    const matchesSearch = tab.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        tab.url.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply additional filters
    switch (filterOption) {
      case 'active':
        // Show only currently active (open) tabs
        return matchesSearch && tab.active;
      case 'saved':
        // This would filter for saved tabs once that functionality is implemented
        // For now, we'll show pinned tabs as an example
        return matchesSearch && tab.pinned;
      case 'today': {
        // For demo purposes - this would require tab creation timestamp
        // Normally would check if tab was opened today
        return matchesSearch && tab.active;
      }
      case 'week': {
        // Would check if tab was opened in the last week
        return matchesSearch;
      }
      case 'month': {
        // Would check if tab was opened in the last month
        return matchesSearch;
      }
      case 'all':
      default:
        return matchesSearch;
    }
  });

  const filterOptions = [
    { id: 'all', label: 'All Tabs' },
    { id: 'active', label: 'Active Tabs' },
    { id: 'saved', label: 'Saved Tabs' },
    { id: 'today', label: 'Opened Today' },
    { id: 'week', label: 'Opened This Week' },
    { id: 'month', label: 'Opened This Month' }
  ];

  const selectedFilter = filterOptions.find(option => option.id === filterOption) || filterOptions[0];

  return (
    <div className="w-auto max-h-[600px] bg-white rounded-lg shadow">
      {/* Action Buttons - 2x2 Grid Layout */}
      <div className="p-6 border border-gray-200 rounded-lg m-8">
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onBulkAction?.('closeAll')}
            className="w-full"
            size="sm"
          >
            Close All Tabs
          </Button>
          <Button
            onClick={() => onBulkAction?.('saveTab')}
            className="w-full"
            size="sm"
          >
            Save Tab
          </Button>
          <Button
            onClick={() => onBulkAction?.('restoreSession')}
            className="w-full"
            size="sm"
          >
            Restore Session
          </Button>
          <Button
            onClick={() => onBulkAction?.('saveSession')}
            className="w-full"
            size="sm"
          >
            Save Session
          </Button>
        </div>
      </div>

      {/* Search and Filter Row */}
      <div className="px-6 py-3 mb-2 flex items-center space-x-3">
        <div className="bg-green-300 h-8 flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tabs..."
            className="w-full m-4 pl-10 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Filter Dropdown - Enhanced Styling */}
        <div className="relative" ref={filterDropdownRef}>
          <Button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            variant={filterOption !== 'all' ? "primary" : "secondary"}
            size="sm"
            className="whitespace-nowrap font-medium shadow-sm"
          >
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>{selectedFilter.label}</span>
              <svg className={`w-4 h-4 ml-1 transition-transform duration-200 ${showFilterDropdown ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </Button>
          
          {showFilterDropdown && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg z-10 py-1 border border-gray-200 overflow-hidden">
              {filterOptions.map(option => (
                <div
                  key={option.id}
                  className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between transition-colors duration-150 ${option.id === filterOption ? 'bg-blue-50 text-blue-700 font-medium' : ''}`}
                  onClick={() => {
                    setFilterOption(option.id);
                    setShowFilterDropdown(false);
                  }}
                >
                  <span>{option.label}</span>
                  {option.id === filterOption && (
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs Section Header */}
      <div className="px-6 py-4 border-t border-b border-gray-200 mx-4">
        <div className="flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="font-semibold">Tabs</span>
            <svg 
              className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </div>
          <div className="text-sm text-gray-500">
            {filteredTabs.length} of {tabs.length} tabs
          </div>
        </div>
      </div>

      {/* Tabs List */}
      <h1 className="px-6 py-2 font-bold">hey</h1>
      {isDropdownOpen && (
        <div className="space-y-4 px-6 py-4 overflow-y-auto max-h-[400px]">
          {filteredTabs.map((tab) => (
            <div 
              key={tab.id}
              className="bg-gray-50 rounded-lg p-4 border border-gray-100 shadow-sm"
            >
              {/* Tab Header */}
              <div className="flex items-start gap-3">
                <img 
                  src={tab.favIconUrl || 'default-favicon.png'} 
                  className="w-8 h-8 rounded-full bg-gray-200"
                  alt=""
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{tab.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{tab.url}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${tab.active ? 'bg-black' : 'bg-gray-300'}`}/>
                  <Button
                    onClick={() => onTabAction('pin', tab.id)}
                    variant="secondary"
                    size="sm"
                    iconOnly
                    className={tab.pinned ? 'text-blue-600' : ''}
                    title="Pin tab"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v2a2 2 0 01-2 2H7a2 2 0 01-2-2V5z"/>
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                    </svg>
                  </Button>
                  <Button
                    onClick={() => onTabAction('close', tab.id)}
                    variant="danger"
                    size="sm"
                    iconOnly
                    title="Close tab"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </Button>
                </div>
              </div>
              
              {/* Tab Actions */}
              <div className="grid grid-cols-4 gap-3 mt-4">
                <Button
                  onClick={() => onTabAction('summary', tab.id)}
                  variant="purple"
                  size="sm"
                  className="w-full"
                >
                  Summary
                </Button>
                <Button
                  onClick={() => onTabAction('overview', tab.id)}
                  variant="purple"
                  size="sm"
                  className="w-full"
                >
                  Detailed Overview
                </Button>
                <Button
                  onClick={() => onTabAction('info', tab.id)}
                  variant="purple"
                  size="sm"
                  className="w-full"
                >
                  Page Info
                </Button>
                <Button
                  onClick={() => onTabAction('save', tab.id)}
                  variant="purple"
                  size="sm"
                  className="w-full"
                >
                  save
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TabManager;
