import React from 'react';
import { Card, Text, Group, ActionIcon, Badge } from '@mantine/core';
import { IconTrash, IconPencil } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function ProductCard({ product, onDeleteClick }) {
  const navigate = useNavigate();

  const formattedDate = new Date(product.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  // The main card content will navigate to the edit page on click
  const handleCardClick = () => {
    navigate(`/products/edit/${product.id}`);
  };

  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <div onClick={handleCardClick} style={{ cursor: 'pointer' }}>
        <Group position="apart">
          <Text weight={500} size="lg">{product.name}</Text>
          <Badge color={product.status === 'AVAILABLE' ? 'green' : 'gray'} variant="light">
            {product.status}
          </Badge>
        </Group>

        <Group mt="xs">
          {product.categories.map(cat => <Badge key={cat.id} color="pink" variant="light">{cat.name}</Badge>)}
        </Group>
        
        <Text size="sm" color="dimmed" mt="md" lineClamp={3}>
          {product.description}
        </Text>

        <Group mt="md">
          <Text weight={500}>Sale: ${product.priceForSale}</Text>
          <Text weight={500}>Rent: ${product.priceForRent} / day</Text>
        </Group>
      </div>

      <Group position="apart" mt="md">
        <Text color="dimmed" size="xs">Date posted: {formattedDate}</Text>
        <Group spacing="xs">
          <ActionIcon onClick={handleCardClick}>
            <IconPencil size="1rem" />
          </ActionIcon>
          <ActionIcon color="red" onClick={onDeleteClick}>
            <IconTrash size="1rem" />
          </ActionIcon>
        </Group>
      </Group>
    </Card>
  );
}

export default ProductCard;