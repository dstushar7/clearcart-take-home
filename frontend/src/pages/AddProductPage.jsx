import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCheck, IconX } from '@tabler/icons-react';
import {
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  NumberInput,
  MultiSelect,
  Paper,
  Title,
  Text,
  Stack,
  Divider,
  Center,
  Loader
} from '@mantine/core';

import { CREATE_PRODUCT_MUTATION } from '../api/mutations/productMutations';
import { GET_CATEGORIES_QUERY, MY_PRODUCTS_QUERY } from '../api/queries/productQueries';

function AddProductPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  // --- Data Fetching & Mutation ---
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES_QUERY);
  const [createProduct, { loading: createLoading }] = useMutation(CREATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      notifications.show({
        title: 'Success!',
        message: 'Your product has been listed.',
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      navigate('/my-products');
    },
    onError: (error) => {
      notifications.show({
        title: 'Creation Failed',
        message: error.message,
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    },
    // Refetch the products list so our new product appears
    refetchQueries: [{ query: MY_PRODUCTS_QUERY }],
  });

  // --- Form State Management ---
  // A single form to hold the state for all steps.
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      priceForSale: 0,
      priceForRent: 0,
      categoryIds: [],
    },
    // We can add validation for each step
    validate: (values) => {
      if (active === 0 && !values.name.trim()) {
        return { name: 'Product title is required' };
      }
      if (active === 1 && values.categoryIds.length === 0) {
        return { categoryIds: 'Please select at least one category' };
      }
      return {};
    },
  });

  // --- Stepper Navigation ---
  const nextStep = () =>
    setActive((current) => {
      if (form.validate().hasErrors) {
        return current;
      }
      return current < 4 ? current + 1 : current;
    });

  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  
  // --- Submission ---
  const handleSubmit = () => {
    const { hasErrors } = form.validate();
    if (!hasErrors) {
      createProduct({ 
        variables: { 
          input: {
            ...form.values,
            categoryIds: form.values.categoryIds.map(Number) // Convert to numbers
          } 
        } 
      });
    }
  };

  if (categoriesLoading) {
    return <Center><Loader /></Center>;
  }

  const categoryOptions = categoriesData?.categories.map((cat) => ({
    value: cat.id.toString(),
    label: cat.name,
  })) || [];

  return (
    <Paper withBorder shadow="md" p={30} mt="lg" radius="md">
      <Title order={2} mb="xl">Create Product</Title>
      
      <Stepper active={active} onStepClick={setActive} breakpoint="sm">
        <Stepper.Step label="Title" description="Give your product a name">
          <TextInput mt="xl" label="Product Title" required {...form.getInputProps('name')} />
        </Stepper.Step>

        <Stepper.Step label="Categories" description="Help others find your product">
          <MultiSelect mt="xl" data={categoryOptions} label="Categories" required {...form.getInputProps('categoryIds')} />
        </Stepper.Step>

        <Stepper.Step label="Description" description="Provide details">
          <Textarea mt="xl" label="Product Description" minRows={4} {...form.getInputProps('description')} />
        </Stepper.Step>

        <Stepper.Step label="Pricing" description="Set your price">
          <Group grow mt="xl">
            <NumberInput label="Price (for Sale)" required precision={2} min={0} {...form.getInputProps('priceForSale')} />
            <NumberInput label="Price (for Rent, per day)" required precision={2} min={0} {...form.getInputProps('priceForRent')} />
          </Group>
        </Stepper.Step>

        <Stepper.Completed>
          <Title order={4} mt="xl">Summary</Title>
          <Stack mt="md">
            <Text><b>Title:</b> {form.values.name}</Text>
            <Text><b>Categories:</b> {form.values.categoryIds.map(id => categoryOptions.find(opt => opt.value === id)?.label).join(', ')}</Text>
            <Text><b>Description:</b> {form.values.description || 'N/A'}</Text>
            <Text><b>Price:</b> ${form.values.priceForSale} to sell, ${form.values.priceForRent}/day to rent</Text>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      <Group position="center" mt="xl">
        {active > 0 && (
          <Button variant="default" onClick={prevStep}>
            Back
          </Button>
        )}
        {active < 4 ? (
          <Button onClick={nextStep}>Next step</Button>
        ) : (
          <Button color="green" onClick={handleSubmit} loading={createLoading}>
            Submit Product
          </Button>
        )}
      </Group>
    </Paper>
  );
}

export default AddProductPage;