// src/components/layout/Tabs.tsx

import React from 'react'
import { TabContainer, Tab } from './StyledComponents'

interface TabsProps {
  activeTab: 'home' | 'settings';
  onTabChange: (tab: 'home' | 'settings') => void;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => (
  <TabContainer>
    <Tab 
      active={activeTab === 'home'} 
      onClick={() => onTabChange('home')}
    >
      Home
    </Tab>
    <Tab 
      active={activeTab === 'settings'} 
      onClick={() => onTabChange('settings')}
    >
      Settings
    </Tab>
  </TabContainer>
)