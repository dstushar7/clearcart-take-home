import React from 'react';
import { AppShell, Group, Title, Button, Container, Text } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function MainAppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      padding="md"
      header={
        <AppShell.Header height={60} p="xs">
          {/* This Group will span the full width of the header */}
          <Group position="apart" sx={{ height: '100%' }} px="md">
            
            <Title 
              order={3} 
              onClick={() => navigate('/my-products')} 
              style={{ cursor: 'pointer' }}
            >
              ClearCart
            </Title>

            <Group>
              {user && <Text size="sm">Welcome, {user.firstName}!</Text>}
              <Button color="red" compact onClick={logout}>
                Logout
              </Button>
            </Group>

          </Group>
        </AppShell.Header>
      }
    >
      {/* The actual page content will be rendered here */}
      <Container size="lg">
        {children}
      </Container>
    </AppShell>
  );
}

export default MainAppLayout;