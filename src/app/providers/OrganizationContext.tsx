import React, { createContext, useContext, useState, useEffect } from 'react';
import { Organization, Department, Location } from '@/types/organization';
import { MOCK_ORGANIZATIONS, MOCK_DEPARTMENTS, MOCK_LOCATIONS } from '@/mock-data/organizations';

interface OrganizationContextType {
  currentOrganization: Organization;
  organizations: Organization[];
  departments: Department[];
  locations: Location[];
  switchOrganization: (orgId: string) => void;
  updateOrganizationSettings: (settings: Partial<Organization['settings']>) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const STORAGE_KEY = 'hrms_selected_org_id';

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [organizations, setOrganizations] = useState<Organization[]>(MOCK_ORGANIZATIONS);
  const [currentOrgId, setCurrentOrgId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const exists = MOCK_ORGANIZATIONS.some((o) => o.id === saved);
    return exists && saved ? saved : MOCK_ORGANIZATIONS[0].id;
  });

  const currentOrganization =
    organizations.find((o) => o.id === currentOrgId) || organizations[0];

  const departments = MOCK_DEPARTMENTS.filter(
    (dept) => dept.organizationId === currentOrganization.id
  );

  const locations = MOCK_LOCATIONS.filter(
    (loc) => loc.organizationId === currentOrganization.id
  );

  const switchOrganization = (orgId: string) => {
    if (organizations.some((o) => o.id === orgId)) {
      setCurrentOrgId(orgId);
      localStorage.setItem(STORAGE_KEY, orgId);
    }
  };

  const updateOrganizationSettings = (settings: Partial<Organization['settings']>) => {
    setOrganizations((prev) =>
      prev.map((org) => {
        if (org.id === currentOrgId) {
          return {
            ...org,
            settings: { ...org.settings, ...settings },
          };
        }
        return org;
      })
    );
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        organizations,
        departments,
        locations,
        switchOrganization,
        updateOrganizationSettings,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (!context) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
