import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { UserModeProvider } from './contexts/UserModeContext';
import { GroupsProvider } from './contexts/GroupsContext';
import ControlCard from './components/ControlCard';
import EnhancedMetricCard from './components/EnhancedMetricCard';
import EnhancedModeToggleButton from './components/EnhancedModeToggleButton';
import GroupManager from './components/GroupManager';
import EnhancedOceanBackground from './components/EnhancedOceanBackground';
import EnhancedBubbles from './components/EnhancedBubbles';
import EnhancedNavigation from './components/EnhancedNavigation';
import GroupControlList from './components/GroupControlList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater, faTimes, faSliders } from '@fortawesome/free-solid-svg-icons';

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 0 15px rgba(14, 165, 233, 0.6); }
  50% { transform: scale(1.05); box-shadow: 0 0 20px rgba(14, 165, 233, 0.8); }
  100% { transform: scale(1); box-shadow: 0 0 15px rgba(14, 165, 233, 0.6); }
`;

const pulseAnimation = css`${pulse}`;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'controls' | 'metrics'>('controls');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Generate sample chart data for metrics
  const generateChartData = (baseValue: number, variance: number, count: number = 24) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const time = new Date();
      time.setHours(time.getHours() - (count - i));
      const timeString = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const randomVariance = (Math.random() * 2 - 1) * variance;
      const value = baseValue + randomVariance;
      
      data.push({
        time: timeString,
        value
      });
    }
    return data;
  };

  return (
    <UserModeProvider>
      <GroupsProvider>
        <MainWrapper>
          <EnhancedOceanBackground />
          <EnhancedBubbles />
          
          <ContentContainer>
            <Header>
              <Title>
                <WaveIcon>
                  <FontAwesomeIcon icon={faWater} />
                </WaveIcon>
                Wave Habitat
              </Title>

              <HeaderControls>
                <EnhancedModeToggleButton />
                <MobileMenuButton onClick={toggleMobileMenu}>
                  {mobileMenuOpen ? (
                    <FontAwesomeIcon icon={faTimes} />
                  ) : (
                    <FontAwesomeIcon icon={faSliders} />
                  )}
                </MobileMenuButton>
              </HeaderControls>
            </Header>

            <EnhancedNavigation 
              activeTab={activeTab} 
              setActiveTab={setActiveTab} 
              mobileMenuOpen={mobileMenuOpen} 
              setMobileMenuOpen={setMobileMenuOpen} 
            />
            
            <ScrollableContent>
              {activeTab === 'controls' && (
                <SectionContainer>
                  <SectionTitle>Control Panel</SectionTitle>
                  <ControlPanelContainer>
                    <GroupsSection>
                      <GroupManager />
                      <GroupControlList />
                    </GroupsSection>
                    <ControlsSection>
                      <ControlPanel>
                        <ControlCard title="Wave Generator" icon="lightbulb" controlId="1" groupId="1" groupName="Lighting" />
                        <ControlCard title="Oxygen Pump" icon="lightbulb" controlId="3" groupId="2" groupName="Water Systems" />
                        <ControlCard title="Temperature" icon="lightbulb" controlId="5" groupId="3" groupName="Environment" />
                        <ControlCard title="Lighting" icon="lightbulb" controlId="2" groupId="1" groupName="Lighting" />
                        <ControlCard title="Feeding System" icon="moon" controlId="6" groupId="3" groupName="Environment" />
                        <ControlCard title="Water Filter" icon="moon" controlId="4" groupId="2" groupName="Water Systems" />
                      </ControlPanel>
                    </ControlsSection>
                  </ControlPanelContainer>
                </SectionContainer>
              )}
              
              {activeTab === 'metrics' && (
                <SectionContainer>
                  <SectionTitle>Water Metrics</SectionTitle>
                  <MetricsPanel>
                    <EnhancedMetricCard 
                      title="Oxygen Levels" 
                      icon="oxygen"
                      currentValue={8.5} 
                      unit="mg/L" 
                      minValue={7.0} 
                      maxValue={10.0} 
                      chartData={generateChartData(8.5, 0.5)}
                      isLive={true}
                      trend="up"
                      color="#4fc3f7"
                    />
                    <EnhancedMetricCard 
                      title="Temperature" 
                      icon="temperature"
                      currentValue={24.2} 
                      unit="°C" 
                      minValue={22.0} 
                      maxValue={26.0} 
                      chartData={generateChartData(24.2, 0.3)}
                      isLive={true}
                      trend="stable"
                      color="#ff9800"
                    />
                    <EnhancedMetricCard 
                      title="pH Level" 
                      icon="ph"
                      currentValue={7.8} 
                      unit="pH" 
                      minValue={7.0} 
                      maxValue={8.5} 
                      chartData={generateChartData(7.8, 0.2)}
                      isLive={true}
                      trend="stable"
                      color="#4caf50"
                    />
                    <EnhancedMetricCard 
                      title="Salinity" 
                      icon="water"
                      currentValue={35.2} 
                      unit="ppt" 
                      minValue={34.0} 
                      maxValue={36.5} 
                      chartData={generateChartData(35.2, 0.4)}
                      isLive={true}
                      trend="down"
                      color="#9c27b0"
                    />
                    <EnhancedMetricCard 
                      title="Turbidity" 
                      icon="water"
                      currentValue={1.2} 
                      unit="NTU" 
                      minValue={0.5} 
                      maxValue={2.0} 
                      chartData={generateChartData(1.2, 0.3)}
                      isLive={true}
                      trend="stable"
                      color="#795548"
                    />
                    <EnhancedMetricCard 
                      title="Ammonia" 
                      icon="water"
                      currentValue={0.05} 
                      unit="ppm" 
                      minValue={0.0} 
                      maxValue={0.1} 
                      chartData={generateChartData(0.05, 0.02)}
                      isLive={true}
                      trend="stable"
                      color="#f44336"
                    />
                  </MetricsPanel>
                </SectionContainer>
              )}
            </ScrollableContent>
          </ContentContainer>
        </MainWrapper>
      </GroupsProvider>
    </UserModeProvider>
  );
};

// Add this new styled component
const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  @media (max-width: 768px) {
    gap: 10px;
  }
`;

const MainWrapper = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: transparent;
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100vh;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
    gap: 12px;
  }
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  @media (max-width: 768px) {
    padding: 12px 0;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
  margin: 0;
  color: #fff;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    font-size: 1.8rem;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    gap: 8px;
  }
`;

const WaveIcon = styled.div`
  width: 36px;
  height: 36px;
  background-color: #0ea5e9;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.6);
  animation: ${props => css`${pulseAnimation} 2s ease-in-out infinite;`};

  svg {
    width: 22px;
    height: 22px;
    color: white;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    
    svg {
      width: 20px;
      height: 20px;
    }
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    
    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const ControlPanelContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  height: 100%;
  overflow: hidden;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const GroupsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  padding-right: 10px;
  
  @media (max-width: 768px) {
    gap: 12px;
    padding-right: 5px;
  }
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const ControlsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;
  height: 100%;
  
  @media (max-width: 768px) {
    gap: 15px;
    padding-right: 5px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MetricsPanel = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  overflow-y: auto;
  padding-right: 10px;
  height: 100%;
  
  @media (max-width: 768px) {
    gap: 15px;
    padding-right: 5px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 10px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Navigation component has been replaced with EnhancedNavigation

// NavTab component has been replaced with EnhancedNavigation

const ScrollableContent = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  height: 100%;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: #fff;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

export default App;
