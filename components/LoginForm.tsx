// src/components/auth/LoginForm.tsx
import React from 'react'
import { 
  Container, 
  Form, 
  Input, 
  Button, 
  Title, 
  ErrorText, 
  LinkText 
} from './StyledComponents'

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isRegistering: boolean;
  setIsRegistering: (isRegistering: boolean) => void;
  error: string;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  isRegistering,
  setIsRegistering,
  error,
  onSubmit
}) => (
  <Container>
    <Title>{isRegistering ? "Create Account" : "Login"}</Title>
    <Form onSubmit={onSubmit}>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit">
        {isRegistering ? "Register" : "Login"}
      </Button>
    </Form>
    <LinkText onClick={() => setIsRegistering(!isRegistering)}>
      {isRegistering ? "Already have an account? Login" : "Need an account? Register"}
    </LinkText>
  </Container>
)