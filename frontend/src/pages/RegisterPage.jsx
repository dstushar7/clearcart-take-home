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
import AuthLayout from '../layouts/AuthLayout';
import { REGISTER_MUTATION } from '../api/mutations/authMutations';

function RegisterPage() {
  const navigate = useNavigate();

  const [registerUser, { loading, error }] = useMutation(REGISTER_MUTATION, {
    onCompleted: (data) => {
      console.log('Registration successful:', data);
      navigate('/login');
    },
    onError: (error) => {
      console.error('Registration failed:', error.message);
    },
  });

  const form = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '', // <-- 1. ADDED: State for the confirm password field
    },
    validate: {
      firstName: (value) => (value.trim().length < 2 ? 'First name must have at least 2 letters' : null),
      lastName: (value) => (value.trim().length < 2 ? 'Last name must have at least 2 letters' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length < 6 ? 'Password must be at least 6 characters long' : null),
      // <-- 2. ADDED: Validation rule for matching passwords
      confirmPassword: (value, values) =>
        value !== values.password ? 'Passwords do not match' : null,
    },
  });

  const handleRegister = (values) => {
    // <-- 3. MODIFIED: Remove confirmPassword before sending to the API
    // Our backend API only expects firstName, lastName, email, and password.
    // We use object destructuring to create a new object without the 'confirmPassword' field.
    const { confirmPassword, ...inputForApi } = values;

    registerUser({
      variables: {
        input: inputForApi,
      },
    });
  };

  return (
    <AuthLayout>
      <Paper withBorder shadow="md" p={30} radius="md" style={{ width: 420 }}>
        <Title align="center" order={2} mb="xl">
          Sign Up
        </Title>

        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Registration Failed" color="red" withCloseButton mb="md">
            {error.message}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleRegister)}>
          <Group grow>
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

          {/* <-- 4. ADDED: The UI for the confirm password input */}
          <PasswordInput
            mt="md"
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            {...form.getInputProps('confirmPassword')}
          />

          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Register
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" size="sm">
            Sign in here
          </Anchor>
        </Text>
      </Paper>
    </AuthLayout>
  );
}

export default RegisterPage;