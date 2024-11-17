// src/components/auth/WebsiteConfirm.tsx
import React from 'react'
import { 
  Container, 
  Title, 
  Text, 
  ConfirmButton, 
  ErrorText 
} from './StyledComponents'

interface WebsiteConfirmProps {
  userEmail: string;
  currentWebsite: string;
  savedWebsite?: string;
  onConfirm: () => Promise<void>;
  showError?: boolean;
}

export const WebsiteConfirm: React.FC<WebsiteConfirmProps> = ({
  userEmail,
  currentWebsite,
  savedWebsite,
  onConfirm,
  showError
}) => {
  if (showError && savedWebsite) {
    return (
      <Container>
        <Title>Hello, {userEmail}</Title>
        <ErrorText>
          You have chosen to use this extension on {savedWebsite}. If you want to
          use it for a different website, please uninstall and reinstall the
          extension.
        </ErrorText>
      </Container>
    )
  }

  return (
    <Container>
      <Title>Hello, {userEmail}</Title>
      <Text>
        Do you want to use this extension on: {currentWebsite}?
      </Text>
      <ConfirmButton onClick={onConfirm}>
        Confirm Website
      </ConfirmButton>
    </Container>
  )
}