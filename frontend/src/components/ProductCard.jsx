// src/components/ProductCard.jsx

import React from 'react';
import { Card, Text, Group, Badge } from '@mantine/core';

/**
 * A flexible product card component.
 * @param {object} product - The product data to display.
 * @param {function} onCardClick - Function to call when the card's main body is clicked.
 * @param {React.ReactNode} actions - React components to render in the actions area (e.g., buttons, icons).
 * @param {React.ReactNode} footerContent - Optional content to display in the footer, left of actions.
 */
function ProductCard({ product, onCardClick, actions, footerContent }) {
  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Card.Section 
        onClick={onCardClick} 
        style={{ cursor: onCardClick ? 'pointer' : 'default', padding: 'var(--mantine-spacing-lg)' }}
      >
        <Group justify="space-between">
          <Text fw={500} size="lg">{product.name}</Text>
          <Badge color={product.status === 'AVAILABLE' ? 'green' : 'gray'} variant="light">
            {product.status}
          </Badge>
        </Group>

        <Group mt="xs">
          {product.categories?.map(cat => <Badge key={cat.id} color="pink" variant="light">{cat.name}</Badge>)}
        </Group>
        
        <Text size="sm" c="dimmed" mt="md" lineClamp={3}>
          {product.description}
        </Text>

        <Group mt="md">
          <Text fw={500}>Sale: ${product.priceForSale.toFixed(2)}</Text>
          <Text fw={500}>Rent: ${product.priceForRent.toFixed(2)} / day</Text>
        </Group>
      </Card.Section>

      <Group justify="space-between" mt="md">
        {/* Render the custom footer content */}
        <div>{footerContent || <Text c="dimmed" size="xs">Posted: {formattedDate}</Text>}</div>
        
        {/* Render the custom actions */}
        <Group spacing="xs">
          {actions}
        </Group>
      </Group>
    </Card>
  );
}

export default ProductCard;