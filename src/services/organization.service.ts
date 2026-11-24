import { Organization, Department, Location, OrganizationSettings } from '@/types/organization';
import { MOCK_ORGANIZATIONS, MOCK_DEPARTMENTS, MOCK_LOCATIONS } from '@/mock-data/organizations';

export interface IOrganizationService {
  getOrganizations(): Promise<Organization[]>;
  getOrganizationById(id: string): Promise<Organization | null>;
  getDepartments(organizationId: string): Promise<Department[]>;
  getLocations(organizationId: string): Promise<Location[]>;
  updateSettings(orgId: string, settings: Partial<OrganizationSettings>): Promise<Organization>;
  createDepartment(dept: Omit<Department, 'id'>): Promise<Department>;
}

class MockOrganizationService implements IOrganizationService {
  private organizations = [...MOCK_ORGANIZATIONS];
  private departments = [...MOCK_DEPARTMENTS];
  private locations = [...MOCK_LOCATIONS];

  async getOrganizations(): Promise<Organization[]> {
    return Promise.resolve(this.organizations);
  }

  async getOrganizationById(id: string): Promise<Organization | null> {
    const org = this.organizations.find((o) => o.id === id) || null;
    return Promise.resolve(org);
  }

  async getDepartments(organizationId: string): Promise<Department[]> {
    return Promise.resolve(
      this.departments.filter((d) => d.organizationId === organizationId)
    );
  }

  async getLocations(organizationId: string): Promise<Location[]> {
    return Promise.resolve(
      this.locations.filter((l) => l.organizationId === organizationId)
    );
  }

  async updateSettings(orgId: string, settings: Partial<OrganizationSettings>): Promise<Organization> {
    const index = this.organizations.findIndex((o) => o.id === orgId);
    if (index === -1) throw new Error('Organization not found');

    const updated = {
      ...this.organizations[index],
      settings: { ...this.organizations[index].settings, ...settings },
    };
    this.organizations[index] = updated;
    return Promise.resolve(updated);
  }

  async createDepartment(deptData: Omit<Department, 'id'>): Promise<Department> {
    const newDept: Department = {
      ...deptData,
      id: `dept-${Date.now()}`,
    };
    this.departments.push(newDept);
    return Promise.resolve(newDept);
  }
}

export const organizationService: IOrganizationService = new MockOrganizationService();
