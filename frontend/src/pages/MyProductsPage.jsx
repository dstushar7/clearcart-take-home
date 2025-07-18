import React, { useState } from 'react';
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
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import ProductCard from '../components/ProductCard';

function MyProductsPage() {
  // We no longer need the `logout` function here; it's handled in the layout.
  const [productToDelete, setProductToDelete] = useState(null);

  const { data, loading, error, refetch } = useQuery(MY_PRODUCTS_QUERY);

  const [deleteProduct, { loading: deleteLoading, error: deleteError }] = useMutation(DELETE_PRODUCT_MUTATION, {
    onCompleted: () => {
      notifications.show({
        title: 'Product Deleted',
        message: 'The product has been successfully removed.',
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      setProductToDelete(null);
      refetch();
    },
    onError: (error) => {
      notifications.show({
        title: 'Deletion Failed',
        message: error.message,
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

  if (loading) return <Center style={{ height: '80vh' }}><Loader /></Center>;
  if (error) return <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">{error.message}</Alert>;

  return (
    <>
      <Title order={2} mb="xl">
        MY PRODUCTS
      </Title>

      {data.myProducts.length > 0 ? (
        <SimpleGrid cols={2} spacing="lg" breakpoints={[{ maxWidth: 'sm', cols: 1 }]}>
          {data.myProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onDeleteClick={() => setProductToDelete(product)}
            />
          ))}
        </SimpleGrid>
      ) : (
        <Text>You haven't added any products yet.</Text>
      )}

      <Button fullWidth size="lg" mt="xl">
        Add Product
      </Button>

      {/* The Modal remains here as it's specific to this page's logic */}
      <Modal
        opened={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        title="Confirm Deletion"
        centered
      >
        <Text>Are you sure you want to delete the product: "{productToDelete?.name}"?</Text>
        <Space h="md" />
        <Group position="right">
          <Button variant="default" onClick={() => setProductToDelete(null)}>No</Button>
          <Button color="red" onClick={handleDeleteConfirm} loading={deleteLoading}>Yes</Button>
        </Group>
      </Modal>
    </>
  );
}

export default MyProductsPage;