import React from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Alert,
  Anchor,
  Center,
  Text,
} from '@mantine/core';
import { useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { IconAlertCircle } from '@tabler/icons-react';
import AuthLayout from '../layouts/AuthLayout';

import { LOGIN_MUTATION } from '../api/mutations/authMutations';
import { useAuth } from '../contexts/AuthContext';


function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  // For now, we are just redirecting. In the next step, we will use an AuthContext here.
  // const { login } = useAuth(); // Preview of the next step

  const [loginUser, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      console.log('Login successful:', data.login.user);
      login(data.login.user); 

      // After successful login, redirect to the product-page.
      navigate('/my-products'); 
    },
    onError: (error) => {
      console.error('Login failed:', error.message);
    },
  });

  const form = useForm({
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length > 0 ? null : 'Password cannot be empty'),
    },
  });

  const handleLogin = (values) => {
    loginUser({
      variables: {
        email: values.email,
        password: values.password,
      },
    });
  };

  return (
    <AuthLayout>
      {/* The Paper component is now the direct child */}
      <Paper withBorder shadow="md" p={30} radius="md" style={{ width: 420 }}>
        {/* All the content of the form remains identical */}
        <Title align="center" order={2} mb="xl">
          Welcome to ClearCart!
        </Title>

        {error && (
          <Alert icon={<IconAlertCircle size="1rem" />} title="Login Failed" color="red" withCloseButton mb="md">
            {error.message}
          </Alert>
        )}

        <form onSubmit={form.onSubmit(handleLogin)}>
          <TextInput
            label="Email"
            placeholder="you@clearcart.com"
            required
            {...form.getInputProps('email')}
          />
          <PasswordInput
            mt="md"
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" type="submit" loading={loading}>
            Sign in
          </Button>
        </form>

        <Text c="dimmed" size="sm" ta="center" mt="md">
          Don't have an account yet?{' '}
          <Anchor component={Link} to="/register" size="sm">
            Sign up here
          </Anchor>
        </Text>
      </Paper>
    </AuthLayout>
  );
}

export default LoginPage;