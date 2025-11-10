import type { IPatientRepository } from '@/core/domain/repositories/IPatientRepository';
import { Patient } from '@/core/domain/entities/Patient';
import { Email } from '@/core/domain/value-objects/Email';
import { PhoneNumber } from '@/core/domain/value-objects/PhoneNumber';
import { DocumentId } from '@/core/domain/value-objects/DocumentId';
import { patientApiClient } from '../api/clients/PatientApiClient';

export class DoctocPatientRepository implements IPatientRepository {
  async create(patient: Patient): Promise<Patient> {
    const response = await patientApiClient.createPatient({
      orgID: patient.orgID,
      names: patient.firstName,
      surnames: patient.lastName,
      birth_date: patient.birthDate?.toISOString().split('T')[0],
      gender: patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Masculino',
      phone: patient.phoneNumber.value,
      mail: patient.email?.value || '',
      dni: patient.documentId.number
    });

    if (!response.patient_id) {
      throw new Error('Patient not created');
    }

    // Retornar el paciente con el ID de Doctoc
    return new Patient(
      response.patient_id,
      patient.orgID,
      patient.firstName,
      patient.lastName,
      patient.documentId,
      patient.phoneNumber,
      patient.email,
      patient.birthDate,
      patient.gender,
      patient.address
    );
  }

  async update(patient: Patient): Promise<Patient> {
    const response = await patientApiClient.updatePatient({
      orgID: patient.orgID,
      patientID: patient.id,
      nombre: patient.firstName,
      apellidos: patient.lastName,
      fecha_nacimiento: patient.birthDate?.toISOString().split('T')[0],
      sexo: patient.gender,
      telefono: patient.phoneNumber.value,
      email: patient.email?.value,
      direccion: patient.address,
      documento_tipo: patient.documentId.type,
      documento_numero: patient.documentId.number
    });

    if (!response.patient) {
      throw new Error('Patient not updated');
    }

    return this.createPatientFromAPIData(response.patient, patient.orgID);
  }

  async delete(patientId: string, orgID: string): Promise<void> {
    await patientApiClient.deletePatient({
      orgID,
      patientID: patientId
    });
  }

  async findById(patientId: string, orgID: string): Promise<Patient | null> {
    try {
      const response = await patientApiClient.searchPatient({
        orgID,
        type: 'id',
        text: patientId,
        limit: 1
      }) as { pacientes?: Array<Record<string, unknown>> };

      if (!response.pacientes || response.pacientes.length === 0) {
        return null;
      }

      return this.createPatientFromAPIData(response.pacientes[0], orgID);
    } catch {
      return null;
    }
  }

  async search(searchType: string, searchText: string, orgID: string, limit = 10): Promise<Patient[]> {
    const response = await patientApiClient.searchPatient({
      orgID,
      type: searchType,
      text: searchText,
      limit
    }) as { pacientes?: Array<Record<string, unknown>> };

    if (!response.pacientes) return [];

    return response.pacientes.map((p: Record<string, unknown>) => this.createPatientFromAPIData(p, orgID));
  }

  async findAll(orgID: string, limit = 50): Promise<Patient[]> {
    const response = await patientApiClient.getPatients({
      orgID,
      limit
    }) as { pacientes?: Array<Record<string, unknown>> };

    if (!response.pacientes) return [];

    return response.pacientes.map((p: Record<string, unknown>) => this.createPatientFromAPIData(p, orgID));
  }

  private createPatientFromAPIData(data: Record<string, unknown>, orgID: string): Patient {
    const documentId = DocumentId.create(
      (data.documento_tipo || 'dni') as string,
      (data.documento_numero || '') as string
    );

    const phoneNumber = PhoneNumber.create((data.telefono || '') as string);
    const email = data.email ? Email.create(data.email as string) : undefined;
    const birthDate = data.fecha_nacimiento ? new Date(data.fecha_nacimiento as string) : undefined;

    return new Patient(
      (data.id || data.patientID) as string,
      orgID,
      data.nombre as string,
      data.apellidos as string,
      documentId,
      phoneNumber,
      email,
      birthDate,
      data.sexo as 'M' | 'F' | 'Other' | undefined,
      data.direccion as string | undefined
    );
  }
}
