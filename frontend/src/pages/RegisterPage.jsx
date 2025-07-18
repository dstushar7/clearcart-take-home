import React from 'react';
import { useForm } from '@mantine/form';
import {
  Text,
  TextInput,
  PasswordInput,
  Button,
  Box,
  Title,
  Paper,
  Alert,
  Group,
  Anchor,
  Center,
} from '@mantine/core';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { IconAlertCircle } from '@tabler/icons-react';

// Import our updated mutation from the dedicated file
import { REGISTER_MUTATION } from '../api/mutations/authMutations';

function RegisterPage() {
  const navigate = useNavigate();

  // The useMutation hook from Apollo Client.
  // We provide the mutation and get back a function to call it (registerUser),
  // along with loading and error states.
  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION, {
    // onCompleted is a callback that runs when the mutation is successful.
    // This is the perfect place to handle side-effects like navigation.
    onCompleted: (data) => {
      console.log('Registration successful:', data);
      // After successful registration, send the user to the login page.
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });

  // Mantine's useForm hook handles state, validation, and submission for us.
  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
    // Define validation rules for each field.
    validate: {
      firstName: (value) => (value.trim().length < 2 ? 'First name must have at least 2 letters' : null),
      lastName: (value) => (value.trim().length < 2 ? 'Last name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters long' : null),
    },
  });

  // This function is called when the form is submitted and passes validation.
  // The 'values' object contains all the form data.
  const handleRegister = (values) => {
    registerUser({
      variables: {
        // We pass the form values directly into the 'input' variable
        // that our GraphQL mutation expects.
        input: values,
      },
    });
  };

  return (
    <Center style={{ minHeight: '100vh' }}>
      <Paper withBorder shadow="md" p={30} radius="md" style={{ width: 420 }}>
        <Title align="center" order={2} mb="xl">
          Create Your ClearCart Account
        </Title>

        {/* Conditionally render an Alert component if there's a GraphQL error */}
        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Registration Failed" color="red" withCloseButton mb="md">
            {error.message}
          </Alert>
        )}

        {/* We use Mantine's form handler for submission */}
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Group grow>
            {/* The ...form.getInputProps() helper connects each input to the form state and validation */}
            <TextInput label="First Name" placeholder="John" required {...form.getInputProps('firstName')} />
            <TextInput label="Last Name" placeholder="Doe" required {...form.getInputProps('lastName')} />
          </Group>

          <TextInput mt="md" label="Email" placeholder="you@clearcart.com" required {...form.getInputProps('email')} />

          <PasswordInput
            mt="md"
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps('password')}
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Log in here
          </Anchor>
        </Text>
      </Paper>
    </Center>
  );
}

export default RegisterPage;