import React, { createContext, useContext, useState, useMemo } from 'react';
import { UserRole, ROLE_CONFIGS, RoleConfig } from '@/types/role';
import { useOrganization } from './OrganizationContext';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  title: string;
  department: string;
}

interface RoleContextType {
  currentRole: UserRole;
  roleConfig: RoleConfig;
  allRoles: RoleConfig[];
  currentUser: CurrentUser;
  isAuthenticated: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasAccess: (moduleKey: string) => boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = 'hrms_simulated_role';
const AUTH_TOKEN_KEY = 'hrms_auth_token';
const AUTH_USER_KEY = 'hrms_auth_user';

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentOrganization } = useOrganization();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return Boolean(localStorage.getItem(AUTH_TOKEN_KEY));
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole;
    return saved && ROLE_CONFIGS[saved] ? saved : 'hr_admin';
  });

  const roleConfig = ROLE_CONFIGS[currentRole];
  const allRoles = useMemo(() => Object.values(ROLE_CONFIGS), []);

  const login = (token: string, userData?: any) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    if (userData) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
    }
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    setIsAuthenticated(false);
  };

  const switchRole = (newRole: UserRole) => {
    if (ROLE_CONFIGS[newRole]) {
      setCurrentRole(newRole);
      localStorage.setItem(ROLE_STORAGE_KEY, newRole);
    }
  };

  const hasAccess = (moduleKey: string): boolean => {
    if (currentRole === 'super_admin' || currentRole === 'org_admin') return true;
    const allowed = roleConfig.allowedModules;
    if (allowed.includes('*')) return true;
    return allowed.includes(moduleKey);
  };

  // Generate simulated user identity reflecting current role and organization
  const currentUser: CurrentUser = useMemo(() => {
    switch (currentRole) {
      case 'super_admin':
        return {
          id: 'user-super-01',
          name: 'Alexander Sterling',
          email: 'alexander@antigravity-platform.internal',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          role: 'super_admin',
          title: 'Global Platform Administrator',
          department: 'Platform Engineering & Governance',
        };
      case 'org_admin':
        return {
          id: 'user-org-admin-01',
          name: 'Tariq Mansour',
          email: `tariq@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          role: 'org_admin',
          title: 'Managing Director & Executive Admin',
          department: 'Executive Board',
        };
      case 'hr_admin':
        return {
          id: 'user-hr-admin-01',
          name: 'Sarah Al-Hashemi',
          email: `sarah.hr@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          role: 'hr_admin',
          title: 'Head of People Operations',
          department: 'Human Resources & Talent',
        };
      case 'hr_staff':
        return {
          id: 'user-hr-staff-01',
          name: 'Nour El-Din',
          email: `nour.ops@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
          role: 'hr_staff',
          title: 'People Operations Specialist',
          department: 'Human Resources & Talent',
        };
      case 'manager':
        return {
          id: 'user-manager-01',
          name: 'Zayd Kareem',
          email: `zayd.k@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
          role: 'manager',
          title: 'Principal Product Manager',
          department: 'Product & Design',
        };
      case 'finance':
        return {
          id: 'user-finance-01',
          name: 'Karim Fawzy',
          email: `karim.f@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
          role: 'finance',
          title: 'Senior Financial Controller',
          department: 'Finance & Compliance',
        };
      case 'recruiter':
        return {
          id: 'user-recruiter-01',
          name: 'Layla Al-Khatib',
          email: `layla.talent@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
          role: 'recruiter',
          title: 'Senior Talent Acquisition Partner',
          department: 'Human Resources & Talent',
        };
      case 'employee':
      default:
        return {
          id: 'user-employee-01',
          name: 'Elena Rostova',
          email: `elena.r@${currentOrganization.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          role: 'employee',
          title: 'Senior UI/UX Designer',
          department: 'Product & Design',
        };
    }
  }, [currentRole, currentOrganization]);

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        roleConfig,
        allRoles,
        currentUser,
        isAuthenticated,
        login,
        logout,
        switchRole,
        hasAccess,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
