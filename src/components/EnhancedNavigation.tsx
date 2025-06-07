import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faSliders, faTimes } from '@fortawesome/free-solid-svg-icons';

interface EnhancedNavigationProps {
  activeTab: 'controls' | 'metrics';
  setActiveTab: (tab: 'controls' | 'metrics') => void;
  mobileMenuOpen: boolean;
  toggleMobileMenu?: () => void;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

const EnhancedNavigation: React.FC<EnhancedNavigationProps> = ({
  activeTab,
  setActiveTab,
  mobileMenuOpen,
  toggleMobileMenu,
  setMobileMenuOpen
}) => {
  // Handle mobile menu toggle based on which prop is provided
  const handleMobileMenuToggle = () => {
    if (toggleMobileMenu) {
      toggleMobileMenu();
    } else if (setMobileMenuOpen) {
      setMobileMenuOpen(!mobileMenuOpen);
    }
  };

  return (
    <NavigationContainer mobileOpen={mobileMenuOpen}>
      <MobileCloseButton onClick={handleMobileMenuToggle}>
        <FontAwesomeIcon icon={faTimes} />
      </MobileCloseButton>
      
      <NavTabs>
        <NavTab 
          active={activeTab === 'controls'} 
          onClick={() => setActiveTab('controls')}
          aria-label="Controls Tab"
        >
          <TabIconWrapper active={activeTab === 'controls'}>
            <FontAwesomeIcon icon={faSliders} />
          </TabIconWrapper>
          <TabText>Controls</TabText>
          {activeTab === 'controls' && <ActiveIndicator />}
        </NavTab>
        
        <NavTab 
          active={activeTab === 'metrics'} 
          onClick={() => setActiveTab('metrics')}
          aria-label="Metrics Tab"
        >
          <TabIconWrapper active={activeTab === 'metrics'}>
            <FontAwesomeIcon icon={faChartLine} />
          </TabIconWrapper>
          <TabText>Metrics</TabText>
          {activeTab === 'metrics' && <ActiveIndicator />}
        </NavTab>
      </NavTabs>
    </NavigationContainer>
  );
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const NavigationContainer = styled.nav<{ mobileOpen: boolean }>`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 80%;
    max-width: 300px;
    background: rgba(4, 28, 44, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 60px 20px 20px;
    z-index: 1000;
    box-shadow: -5px 0 25px rgba(0, 0, 0, 0.5);
    transform: ${props => props.mobileOpen ? 'translateX(0)' : 'translateX(100%)'};
    transition: transform 0.3s ease-in-out;
    animation: ${props => props.mobileOpen ? css`${slideIn} 0.3s ease-in-out` : 'none'};
  }
`;

const MobileCloseButton = styled.button`
  display: none;
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const NavTabs = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

const TabIconWrapper = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  color: ${props => props.active ? '#4fc3f7' : 'rgba(255, 255, 255, 0.7)'};
`;

const TabText = styled.span`
  font-weight: 500;
  transition: all 0.3s ease;
`;

const slideUp = keyframes`
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #4fc3f7, #0ea5e9);
  border-radius: 3px;
  transform-origin: left center;
  animation: ${slideUp} 0.3s ease-out forwards;
  
  @media (max-width: 768px) {
    left: auto;
    right: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    height: 100%;
  }
`;

const NavTab = styled.button<{ active: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${props => props.active ? 'rgba(14, 165, 233, 0.15)' : 'transparent'};
  color: ${props => props.active ? '#4fc3f7' : 'white'};
  border: 1px solid ${props => props.active ? 'rgba(14, 165, 233, 0.3)' : 'rgba(255, 255, 255, 0.1)'};
  padding: 12px 20px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  overflow: hidden;
  
  &:hover {
    background: ${props => props.active ? 'rgba(14, 165, 233, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    width: 100%;
    padding: 15px 20px;
    justify-content: flex-start;
    border-radius: 8px;
  }
`;

export default EnhancedNavigation;