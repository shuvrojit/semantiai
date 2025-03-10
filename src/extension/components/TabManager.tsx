import React, { useState } from 'react';
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

  const filteredTabs = tabs.filter(tab =>
    tab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tab.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-[400px] max-h-[600px] bg-white overflow-y-auto rounded-lg shadow">
      {/* Action Buttons - Reorganized into 3 columns */}
      <div className="p-4 flex justify-between">
        {/* Column 1: Close All & Restore Session */}
        <div className="flex flex-col gap-5">
          <Button 
            onClick={() => onBulkAction?.('closeAll')}
            className="w-full"
            size="sm"
          >
            Close All Tabs
          </Button>
          <Button
            onClick={() => onBulkAction?.('restoreSession')}
            className="w-full"
            size="sm"
          >
            Restore Session
          </Button>
        </div>
        
        {/* Column 2: Bookmark & Favorite */}
        <div className="flex flex-col gap-5 items-center">
          <Button
            onClick={() => onBulkAction?.('bookmark')}
            iconOnly
            size="sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
            </svg>
          </Button>
          <Button
            onClick={() => onBulkAction?.('star')}
            iconOnly
            size="sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
          </Button>
        </div>
        
        {/* Column 3: Save Tab & Save Session */}
        <div className="flex flex-col gap-5">
          <Button
            onClick={() => onBulkAction?.('saveTab')}
            className="w-full"
            size="sm"
          >
            Save Tab
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

      {/* Tabs Section Header */}
      <div className="px-4 py-3 border-t border-b border-gray-200">
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
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Search tabs..."
              className="w-48 px-2 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Tabs List */}
      {isDropdownOpen && (
        <div className="space-y-2 p-4">
          {filteredTabs.map((tab) => (
            <div 
              key={tab.id}
              className="bg-gray-50 rounded-lg p-3"
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
              <div className="grid grid-cols-4 gap-2 mt-3">
                <Button
                  onClick={() => onTabAction('summary', tab.id)}
                  variant="purple"
                  size="sm"
                >
                  Summary
                </Button>
                <Button
                  onClick={() => onTabAction('overview', tab.id)}
                  variant="purple"
                  size="sm"
                >
                  Detailed Overview
                </Button>
                <Button
                  onClick={() => onTabAction('info', tab.id)}
                  variant="purple"
                  size="sm"
                >
                  Page Info
                </Button>
                <Button
                  onClick={() => onTabAction('save', tab.id)}
                  variant="purple"
                  size="sm"
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
