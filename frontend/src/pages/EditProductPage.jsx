import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { useForm } from '@mantine/form';
import {
  GET_PRODUCT_QUERY,
  GET_CATEGORIES_QUERY,
  MY_PRODUCTS_QUERY,
} from '../api/queries/productQueries';
import { UPDATE_PRODUCT_MUTATION } from '../api/mutations/productMutations';
import {
  TextInput,
  Textarea,
  NumberInput,
  Button,
  Title,
  Paper,
  Group,
  Loader,
  Center,
  Alert,
  MultiSelect,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconAlertCircle, IconCheck, IconX } from '@tabler/icons-react';

function EditProductPage() {
  const { productId } = useParams(); // Get the product ID from the URL
  const navigate = useNavigate();

  // --- Data Fetching ---
  const { data: productData, loading: productLoading } = useQuery(GET_PRODUCT_QUERY, {
    variables: { id: productId },
  });
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES_QUERY);

  // --- Form Management ---
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
      priceForSale: 0,
      priceForRent: 0,
      categoryIds: [],
    },
  });

  const [updateProduct, { loading: updateLoading, error: updateError }] = useMutation(UPDATE_PRODUCT_MUTATION, {
    onCompleted: () => {
      notifications.show({
        title: 'Success!',
        message: 'Your product has been updated successfully.',
        color: 'green',
        icon: <IconCheck size="1.1rem" />,
      });
      navigate('/my-products');
    },
    onError: (error) => {
      notifications.show({
        title: 'Update Failed',
        message: error.message,
        color: 'red',
        icon: <IconX size="1.1rem" />,
      });
    },
    refetchQueries: [{ query: MY_PRODUCTS_QUERY }],
  });

  // --- Logic to pre-fill the form once data arrives ---
  useEffect(() => {
    if (productData?.product) {
      const { name, description, priceForSale, priceForRent, categories } = productData.product;
      form.setValues({
        name,
        description,
        priceForSale,
        priceForRent,
        categoryIds: categories.map((cat) => cat.id.toString()), // MultiSelect expects string IDs
      });
    }
  }, [productData]); // This effect runs when productData changes

  // --- Submission Handler ---
  const handleSubmit = (values) => {
    // Prepare the input object for the mutation
    const input = {
      ...values,
      // Convert string IDs from the form back to numbers for the API
      categoryIds: values.categoryIds.map(Number),
    };
    updateProduct({ variables: { id: productId, input } });
  };
  
  // --- UI Rendering ---
  if (productLoading || categoriesLoading) {
    return <Center style={{ height: '80vh' }}><Loader /></Center>;
  }

  const categoryOptions = categoriesData?.categories.map((cat) => ({
    value: cat.id.toString(), // The value must be a string for MultiSelect
    label: cat.name,
  })) || [];

  return (
    <Paper withBorder shadow="md" p={30} mt="lg" radius="md">
      <Title order={2} mb="xl">
        Edit Product
      </Title>

      {updateError && (
        <Alert icon={<IconAlertCircle size="1rem" />} title="Update Failed!" color="red" withCloseButton mb="md">
          {updateError.message}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput label="Title" required {...form.getInputProps('name')} />
        <Textarea mt="md" label="Description" minRows={4} {...form.getInputProps('description')} />
        
        <MultiSelect
          mt="md"
          data={categoryOptions}
          label="Categories"
          placeholder="Select categories"
          searchable
          {...form.getInputProps('categoryIds')}
        />

        <Group grow mt="md">
          <NumberInput label="Price (for Sale)" precision={2} min={0} {...form.getInputProps('priceForSale')} />
          <NumberInput label="Price (for Rent, per day)" precision={2} min={0} {...form.getInputProps('priceForRent')} />
        </Group>

        <Group position="right" mt="xl">
          <Button variant="default" onClick={() => navigate('/my-products')}>
            Cancel
          </Button>
          <Button type="submit" loading={updateLoading}>
            Save Changes
          </Button>
        </Group>
      </form>
    </Paper>
  );
}

export default EditProductPage;