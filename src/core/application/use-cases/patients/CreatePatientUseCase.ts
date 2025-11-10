import { IPatientRepository } from '@/core/domain/repositories/IPatientRepository';
import { Patient } from '@/core/domain/entities/Patient';
import { Email } from '@/core/domain/value-objects/Email';
import { PhoneNumber } from '@/core/domain/value-objects/PhoneNumber';
import { DocumentId } from '@/core/domain/value-objects/DocumentId';
import type { CreatePatientDTO } from '@/core/application/dto';

export class CreatePatientUseCase {
  constructor(private readonly patientRepo: IPatientRepository) {}

  async execute(dto: CreatePatientDTO): Promise<Patient> {
    const documentId = DocumentId.create('DNI', dto.dni);
    const phoneNumber = PhoneNumber.create(dto.phone);
    const email = dto.mail ? Email.create(dto.mail) : undefined;
    const birthDate = dto.birth_date ? new Date(dto.birth_date) : undefined;

    const genderCode =
      dto.gender === 'Masculino'
        ? 'M'
        : dto.gender === 'Femenino'
          ? 'F'
          : 'Other';

    const patient = new Patient(
      '',
      dto.orgID,
      dto.names,
      dto.surnames,
      documentId,
      phoneNumber,
      email,
      birthDate,
      genderCode as 'M' | 'F' | 'Other',
      undefined,
    );

    return this.patientRepo.create(patient);
  }
}
