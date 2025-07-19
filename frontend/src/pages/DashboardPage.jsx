// src/pages/DashboardPage.jsx

import React from 'react';
import { useQuery } from '@apollo/client';
import { Container, Title, Loader, Alert, Center, SimpleGrid, Box, Text, Paper } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { GET_DASHBOARD_DATA } from '../api/queries/dashboardQueries';
import ProductCard from '../components/ProductCard';

// A small helper component to render each section
const DashboardSection = ({ title, products, emptyMessage, showOwner = false }) => (
  <Box mb="xl">
    <Title order={2} mb="lg">{title}</Title>
    {products && products.length > 0 ? (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onCardClick={null} // Card is not clickable
            actions={null}     // No actions (edit/delete)
            footerContent={    // Custom footer to show who the owner was
              showOwner && product.owner ? (
                <Text c="dimmed" size="xs">
                  From: {product.owner.firstName}
                </Text>
              ) : null
            }
          />
        ))}
      </SimpleGrid>
    ) : (
      <Paper withBorder p="lg" radius="md" style={{ textAlign: 'center' }}>
        <Text c="dimmed">{emptyMessage}</Text>
      </Paper>
    )}
  </Box>
);

function DashboardPage() {
  const { loading, error, data } = useQuery(GET_DASHBOARD_DATA);

  if (loading) {
    return (
      <Center style={{ height: '50vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">
          Failed to load dashboard data. <br />
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{error.message}</pre>
        </Alert>
      </Container>
    );
  }

  const { bought, sold, rented, lent } = data.dashboard;

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        My Dashboard
      </Title>

      <DashboardSection
        title="Products I've Sold"
        products={sold}
        emptyMessage="You haven't sold any products yet."
      />

      <DashboardSection
        title="Products I've Lent"
        products={lent}
        emptyMessage="You haven't lent out any products yet."
      />

      <DashboardSection
        title="Products I've Bought"
        products={bought}
        emptyMessage="You haven't bought any products."
        showOwner={true} // Show who you bought it from
      />
      
      <DashboardSection
        title="Products I've Rented"
        products={rented}
        emptyMessage="You haven't rented any products."
        showOwner={true} // Show who you rented it from
      />
    </Container>
  );
}

export default DashboardPage;