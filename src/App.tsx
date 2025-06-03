import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWater } from '@fortawesome/free-solid-svg-icons';
import ControlCard from './components/ControlCard';
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
              Aquarium Control Panel
            </Title>
          </Header>
          
          <ControlPanel>
            <ControlCard title="Main Light" icon="lightbulb" />
            <ControlCard title="Night Light" icon="moon" />
          </ControlPanel>
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
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;

const Title = styled.h1`
  display: inline-flex;
  align-items: center;
  gap: 15px;
  font-size: 2.5em;
  color: #fff;
  margin: 0;
  font-weight: 500;
`;

const WaveIcon = styled.span`
  color: #00c3ff;
  font-size: 1.2em;
`;

const ControlPanel = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
`;

export default App;
