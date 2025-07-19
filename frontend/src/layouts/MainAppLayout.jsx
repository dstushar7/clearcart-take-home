// src/layouts/MainAppLayout.jsx

import React from 'react';
import { AppShell, Group, Title, Button, Container, Text } from '@mantine/core';
import { useAuth } from '../contexts/AuthContext';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './MainAppLayout.module.css';

function MainAppLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { link: '/my-products', label: 'My Products' },
    { link: '/dashboard', label: 'Dashboard' },
    { link: '/marketplace', label: 'Marketplace' },
  ];

  const items = navLinks.map((item) => (
    <NavLink
      to={item.link}
      key={item.label}
      className={({ isActive }) => `${classes.link} ${isActive ? classes.linkActive : ''}`}
    >
      {item.label}
    </NavLink>
  ));

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

          <Group ml="xl" gap="md" visibleFrom="sm">
              {items}
          </Group>

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
