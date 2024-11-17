// src/components/Header.tsx
import styled from 'styled-components'

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4285f4;
  padding: 12px 20px;
  margin: -20px -20px 20px -20px;
`

const HeaderTitle = styled.h1`
  color: white;
  font-size: 18px;
  margin: 0;
  font-weight: 500;
`

const LogoutButton = styled.button`
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => (
  <HeaderContainer>
    <HeaderTitle>NeoFlow Data Integrator</HeaderTitle>
    <LogoutButton onClick={onLogout}>Logout</LogoutButton>
  </HeaderContainer>
)