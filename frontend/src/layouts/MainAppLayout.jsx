// src/layouts/MainAppLayout.jsx

import React from 'react';
import { AppShell, Group, Title, Button, Container, Text } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function MainAppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header p="xs">
        <Group justify="space-between" h="100%" px="md">
          
          <Title 
            order={3} 
            onClick={() => navigate('/my-products')} 
            style={{ cursor: 'pointer' }}
          >
            ClearCart
          </Title>

          <Group>
            {user && <Text size="sm">Welcome, {user.firstName}!</Text>}
            <Button color="red" size="xs" onClick={logout}>
              Logout
            </Button>
          </Group>

        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Container size="lg">
          {children}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default MainAppLayout;
