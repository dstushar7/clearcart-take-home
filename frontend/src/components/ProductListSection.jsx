// src/components/ProductListSection.jsx

import React from 'react';
import { Title, Paper, Text, SimpleGrid, Box } from '@mantine/core';
import ProductCard from './ProductCard';

function ProductListSection({ title, products, emptyMessage }) {
  // We don't want action buttons (Edit/Delete) on the dashboard cards
  // So we pass a function that returns null to the ProductCard
  const renderCardActions = () => null;

  return (
    <Box mb="xl">
      <Title order={3} mb="md">{title}</Title>
      {products.length > 0 ? (
        <SimpleGrid
          cols={{ base: 1, sm: 2, lg: 3 }}
          spacing={{ base: 'md', sm: 'xl' }}
        >
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              renderActions={renderCardActions} 
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
}

export default ProductListSection;