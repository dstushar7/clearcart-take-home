import React from 'react';
import { Center } from '@mantine/core';

/**
 * A reusable layout component for authentication pages.
 * It provides a full-screen, centered container for its children.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to be rendered inside the layout.
 */
function AuthLayout({ children }) {
  // Mantine's <Center> component handles horizontal centering perfectly.
  // To make it center vertically as well, we give it a minimum height
  // of 100% of the viewport height (100vh).
  // We also add some padding for better spacing on small screens.
  return (
    <Center style={{ minHeight: '100vh', padding: '1rem' }}>
      {children}
    </Center>
  );
}

export default AuthLayout;