import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/router';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { OrganizationProvider } from '@/app/providers/OrganizationContext';
import { RoleProvider } from '@/app/providers/RoleContext';

export function App() {
  return (
    <QueryProvider>
      <OrganizationProvider>
        <RoleProvider>
          <RouterProvider router={router} />
        </RoleProvider>
      </OrganizationProvider>
    </QueryProvider>
  );
}

export default App;
