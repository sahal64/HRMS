import { Employee } from '@/types/employee';
import { MOCK_EMPLOYEES } from '@/mock-data/employees';

export interface IEmployeeService {
  getEmployees(organizationId: string): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | null>;
  searchEmployees(organizationId: string, query: string): Promise<Employee[]>;
  createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee>;
}

class MockEmployeeService implements IEmployeeService {
  private employees = [...MOCK_EMPLOYEES];

  async getEmployees(organizationId: string): Promise<Employee[]> {
    return Promise.resolve(
      this.employees.filter((e) => e.organizationId === organizationId)
    );
  }

  async getEmployeeById(id: string): Promise<Employee | null> {
    const emp = this.employees.find((e) => e.id === id) || null;
    return Promise.resolve(emp);
  }

  async searchEmployees(organizationId: string, query: string): Promise<Employee[]> {
    const q = query.toLowerCase();
    return Promise.resolve(
      this.employees.filter(
        (e) =>
          e.organizationId === organizationId &&
          (e.fullName.toLowerCase().includes(q) ||
            e.employeeCode.toLowerCase().includes(q) ||
            e.designation.toLowerCase().includes(q) ||
            e.departmentName.toLowerCase().includes(q))
      )
    );
  }

  async createEmployee(employeeData: Omit<Employee, 'id'>): Promise<Employee> {
    const newEmp: Employee = {
      ...employeeData,
      id: `emp-${Date.now()}`,
    };
    this.employees.unshift(newEmp);
    return Promise.resolve(newEmp);
  }
}

export const employeeService: IEmployeeService = new MockEmployeeService();
