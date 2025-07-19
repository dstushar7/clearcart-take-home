// src/pages/MarketplacePage.jsx

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_PRODUCTS } from '../api/queries/productQueries';
import { BUY_PRODUCT_MUTATION, RENT_PRODUCT_MUTATION } from '../api/mutations/productMutations';
import {
  Container,
  Title,
  SimpleGrid,
  Loader,
  Alert,
  Center,
  Button,
  Group,
  Text,
  Modal,
  Space,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';
import ProductCard from '../components/ProductCard';

// Helper function to format dates to YYYY-MM-DD
const formatDate = (dateInput) => {
  // 1. Handle null or undefined input gracefully
  if (!dateInput) {
    return null;
  }

  // 2. Check if the input is already a Date object
  if (dateInput instanceof Date) {
    // If it is, format it directly
    return dateInput.toISOString().split('T')[0];
  }

  // 3. If it's not a Date object, try to create one from the input (e.g., from a string)
  const date = new Date(dateInput);

  // 4. Verify that the new date is valid before trying to format it
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }

  // 5. If it's an invalid date, log an error and return null
  console.error("Failed to format an invalid date:", dateInput);
  return null;
};

function MarketplacePage() {
  const { data, loading, error, refetch } = useQuery(GET_ALL_PRODUCTS, {
    fetchPolicy: 'cache-and-network',
  });

  // State for modals
  const [productToBuy, setProductToBuy] = useState(null);
  const [productToRent, setProductToRent] = useState(null);

  // State for the rent modal date picker
  const [rentDates, setRentDates] = useState([null, null]);
  const [totalRentPrice, setTotalRentPrice] = useState(0);

  // --- Mutations ---
  const [buyProduct, { loading: buyLoading }] = useMutation(BUY_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      notifications.show({
        title: 'Purchase Successful!',
        message: `You have successfully bought the product.`,
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      setProductToBuy(null); // Close modal
      refetch(); // Refresh the marketplace list
    },
    onError: (err) => {
      notifications.show({
        title: 'Purchase Failed',
        message: err.message,
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    },
  });

  const [rentProduct, { loading: rentLoading }] = useMutation(RENT_PRODUCT_MUTATION, {
    onCompleted: (data) => {
      notifications.show({
        title: 'Rental Successful!',
        message: `You have successfully rented the product. Check your dashboard for details.`,
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      setProductToRent(null); // Close modal
      refetch(); // Refresh the marketplace list
    },
    onError: (err) => {
      notifications.show({
        title: 'Rental Failed',
        message: err.message,
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    },
  });

  // --- Handlers ---
  const handleBuyConfirm = () => {
    buyProduct({ variables: { productId: productToBuy.id } });
  };

  const handleRentConfirm = () => {
    const [start, end] = rentDates;
    if (productToRent && start && end) {
      rentProduct({
        variables: {
          input: {
            productId: parseInt(productToRent.id),
            rentStartDate: formatDate(start),
            rentEndDate: formatDate(end),
          },
        },
      });
    }
  };

  // Effect to calculate rental price dynamically
  useEffect(() => {
    // Check if both dates are valid Date objects
    if (productToRent && rentDates[0] instanceof Date && rentDates[1] instanceof Date) {
      const [start, end] = rentDates;

      // Ensure the end date is not before the start date
      if (end < start) {
        setTotalRentPrice(0);
        return;
      }
      // Normalize dates to the start of the day (midnight) to avoid timezone issues
      const startOfDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endOfDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      const timeDiff = endOfDay.getTime() - startOfDay.getTime();

      // Calculate the number of full days and add 1 because rentals are inclusive
      const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24)) + 1;
      setTotalRentPrice(dayDiff * productToRent.priceForRent);
    } else {
      setTotalRentPrice(0);
    }
  }, [rentDates, productToRent]);

  // Reset rent dates when rent modal is opened
  useEffect(() => {
    if (productToRent) {
      setRentDates([null, null]);
    }
  }, [productToRent]);


  if (loading) return <Center style={{ height: '80vh' }}><Loader /></Center>;
  if (error) return <Alert icon={<IconAlertCircle size="1rem" />} title="Error!" color="red">{error.message}</Alert>;

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Marketplace</Title>
      
      {data && data.products.length > 0 ? (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
          {data.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              footerContent={
                <Text c="dimmed" size="xs">
                  Seller: {product.owner.firstName}
                </Text>
              }
              actions={
                <Group>
                  <Button variant="light" color="blue" size="xs" onClick={() => setProductToRent(product)}>Rent</Button>
                  <Button variant="light" color="teal" size="xs" onClick={() => setProductToBuy(product)}>Buy</Button>
                </Group>
              }
            />
          ))}
        </SimpleGrid>
      ) : (
        <Center style={{ height: '40vh' }}>
          <Text c="dimmed">The marketplace is currently empty. Check back later!</Text>
        </Center>
      )}

      {/* --- Modals --- */}
      {/* Buy Confirmation Modal */}
      <Modal opened={!!productToBuy} onClose={() => setProductToBuy(null)} title="Confirm Purchase" centered>
        <Text>Are you sure you want to buy <strong>{productToBuy?.name}</strong> for <strong>${productToBuy?.priceForSale.toFixed(2)}</strong>?</Text>
        <Space h="md" />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setProductToBuy(null)}>Cancel</Button>
          <Button color="teal" loading={buyLoading} onClick={handleBuyConfirm}>Confirm Purchase</Button>
        </Group>
      </Modal>

      {/* Rent Product Modal */}
      <Modal opened={!!productToRent} onClose={() => setProductToRent(null)} title={`Rent: ${productToRent?.name}`} centered>
        <Text>Select your rental period. Price is <strong>${productToRent?.priceForRent.toFixed(2)} / day</strong>.</Text>
        <DatePickerInput
          type="range"
          label="Rental Dates"
          placeholder="Pick dates"
          value={rentDates}
          onChange={setRentDates}
          minDate={new Date()}
          mt="md"
          required
        />
        {totalRentPrice > 0 && (
            <Text mt="md" fw={700} ta="right">Total Cost: ${totalRentPrice.toFixed(2)}</Text>
        )}
        <Space h="md" />
        <Group justify="flex-end">
          <Button variant="default" onClick={() => setProductToRent(null)}>Cancel</Button>
          <Button color="blue" loading={rentLoading} onClick={handleRentConfirm} disabled={!rentDates[0] || !rentDates[1]}>Confirm Rental</Button>
        </Group>
      </Modal>
    </Container>
  );
}

export default MarketplacePage;