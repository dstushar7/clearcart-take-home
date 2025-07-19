// src/pages/MyProductsPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { MY_PRODUCTS_QUERY } from '../api/queries/productQueries';
import { DELETE_PRODUCT_MUTATION } from '../api/mutations/productMutations';
import {
  Title,
  Button,
  SimpleGrid,
  Loader,
  Alert,
  Group,
  Modal,
  Text,
  Space,
  Center,
  ActionIcon, // <-- Import ActionIcon
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconX, IconPencil, IconTrash } from '@tabler/icons-react'; // <-- Import Icons
import ProductCard from '../components/ProductCard';

function MyProductsPage() {
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  const { data, loading, error, refetch } = useQuery(MY_PRODUCTS_QUERY, {
    fetchPolicy: 'cache-and-network', // Ensure we get the freshest data
  });

  const [deleteProduct, { loading: deleteLoading }] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => {
      notifications.show({
        title: 'Product Deleted',
        message: 'The product has been successfully removed.',
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      setProductToDelete(null);
      refetch(); // Refetch the list of products
    },
    onError: (err) => {
      notifications.show({
        title: 'Deletion Failed',
        message: err.message,
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    },
  });

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct({ variables: { id: productToDelete.id } });
    }
  };

  const handleEditClick = (e, productId) => {
    e.stopPropagation(); // Prevent the main card click from firing
    navigate(`/products/edit/${productId}`);
  };

  const handleDeleteClick = (e, product) => {
    e.stopPropagation(); // Prevent the main card click from firing
    setProductToDelete(product);
  };


  if (loading) return <Center style={{ height: '80vh' }}><Loader /></Center>;
  if (error) return <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">{error.message}</Alert>;

  return (
    <>
      <Group justify="space-between" mb="xl">
        <Title order={2}>MY PRODUCTS</Title>
        <Button onClick={() => navigate('/add-product')}>
          Add New Product
        </Button>
      </Group>

      {data && data.myProducts.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {data.myProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              // Define what happens when the main card area is clicked
              onCardClick={() => navigate(`/products/edit/${product.id}`)}
              // Pass the Edit and Delete buttons as the 'actions' prop
              actions={
                <>
                  <ActionIcon variant="subtle" onClick={(e) => handleEditClick(e, product.id)}>
                    <IconPencil size="1.1rem" />
                  </ActionIcon>
                  <ActionIcon variant="subtle" color="red" onClick={(e) => handleDeleteClick(e, product)}>
                    <IconTrash size="1.1rem" />
                  </ActionIcon>
                </>
              }
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center style={{ height: '40vh', flexDirection: 'column' }}>
            <Text c="dimmed">You haven't added any products yet.</Text>
            <Text c="dimmed">Click the button above to get started!</Text>
        </Center>
      )}

      {/* The Delete Confirmation Modal remains unchanged */}
      <Modal
        opened={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirm Deletion"
        centered
      >
        <Text>Are you sure you want to delete the product: "{productToDelete?.name}"?</Text>
        <Space h="md" />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setProductToDelete(null)}>Cancel</Button>
          <Button color="red" onClick={handleDeleteConfirm} loading={deleteLoading}>Delete</Button>
        </Group>
      </Modal>
    </>
  );
}

export default MyProductsPage;
