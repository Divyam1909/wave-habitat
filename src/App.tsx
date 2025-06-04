import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import ControlCard from './components/ControlCard';
import WaterMetricCard from './components/WaterMetricCard';
import Bubbles from './components/Bubbles';
import BackgroundAnimation from './components/BackgroundAnimation';
import { GlobalStyles } from './styles/GlobalStyles';

const App: React.FC = () => {
  return (
    <MainWrapper>
      <GlobalStyles />
      <OceanBackground>
        <BackgroundAnimation />
        <Bubbles />
        
        <ContentContainer>
          <Header>
            <Title>
              <WaveIcon>
                <FontAwesomeIcon icon={faWater} />
              </WaveIcon>
              Wave Habitat
            </Title>
          </Header>
          
          <MainContent>
            <ControlPanel>
              <ControlCard title="Main Light" icon="lightbulb" />
              <ControlCard title="Night Light" icon="moon" />
            </ControlPanel>
            
            <MetricsPanel>
              <WaterMetricCard
                title="Temperature"
                unit="°C"
                baseValue={25}
                variance={2}
                color="#00c3ff"
                icon="🌡️"
                minDomain={20}
                maxDomain={30}
              />
              <WaterMetricCard
                title="Salinity"
                unit="PPT"
                baseValue={35}
                variance={1}
                color="#44ff44"
                icon="🌊"
                minDomain={33}
                maxDomain={37}
              />
              <WaterMetricCard
                title="pH Level"
                unit="pH"
                baseValue={8.2}
                variance={0.4}
                color="#ff9900"
                icon="⚗️"
                minDomain={7.6}
                maxDomain={8.8}
              />
              <WaterMetricCard
                title="Dissolved O₂"
                unit="mg/L"
                baseValue={6.5}
                variance={1}
                color="#ff44ff"
                icon="💧"
                minDomain={4}
                maxDomain={9}
              />
            </MetricsPanel>
          </MainContent>
        </ContentContainer>
      </OceanBackground>
    </MainWrapper>
  );
};

const MainWrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
`;

const OceanBackground = styled.div`
  min-height: 100vh;
  background: linear-gradient(180deg, #041c2c 0%, #0a4a7a 100%);
  position: relative;
  overflow: hidden;
  z-index: 0;
`;

const ContentContainer = styled.div`
  position: relative;
  z-index: 20;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;

  @media (max-width: 768px) {
    margin-bottom: 30px;
  }
`;

const Title = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  font-size: 2.5em;
  color: #fff;
  margin: 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 2em;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.8em;
  }
`;

const WaveIcon = styled.span`
  color: #00c3ff;
  font-size: 1.2em;

  @media (max-width: 768px) {
    font-size: 1.1em;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 768px) {
    gap: 25px;
  }
`;

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  padding: 30px;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 25px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 20px;
  }
`;

const MetricsPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  padding: 20px;
  max-width: 1100px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 15px;
  }
`;

export default App;
