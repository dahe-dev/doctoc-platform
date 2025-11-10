import { Patient } from '../entities/Patient';

export interface IPatientRepository {
  create(patient: Patient): Promise<Patient>;
  update(patient: Patient): Promise<Patient>;
  delete(patientId: string, orgID: string): Promise<void>;
  findById(patientId: string, orgID: string): Promise<Patient | null>;
  search(searchType: string, searchText: string, orgID: string, limit?: number): Promise<Patient[]>;
  findAll(orgID: string, limit?: number): Promise<Patient[]>;
}
