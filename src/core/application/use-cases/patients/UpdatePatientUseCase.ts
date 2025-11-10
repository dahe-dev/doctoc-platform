import { IPatientRepository } from '@/core/domain/repositories/IPatientRepository';
import { Patient } from '@/core/domain/entities/Patient';
import { Email } from '@/core/domain/value-objects/Email';
import { PhoneNumber } from '@/core/domain/value-objects/PhoneNumber';
import { DocumentId } from '@/core/domain/value-objects/DocumentId';
import type { UpdatePatientDTO } from '@/core/application/dto';

export class UpdatePatientUseCase {
  constructor(
    private readonly patientRepo: IPatientRepository
  ) {}

  async execute(dto: UpdatePatientDTO): Promise<Patient> {
    const existing = await this.patientRepo.findById(dto.patientID, dto.orgID);
    if (!existing) {
      throw new Error('Paciente no encontrado');
    }

    const { patientData } = dto;

    const documentId = patientData.dni && patientData.dni
      ? DocumentId.create(patientData.dni, patientData.dni)
      : existing.documentId;

    const phoneNumber = patientData.phone
      ? PhoneNumber.create(patientData.phone)
      : existing.phoneNumber;

    const email = patientData.mail
      ? Email.create(patientData.mail)
      : existing.email;

    const birthDate = patientData.birth_date
      ? new Date(patientData.birth_date)
      : existing.birthDate;

    const patient = new Patient(
      dto.patientID,
      dto.orgID,
      patientData.names ?? existing.firstName,
      patientData.names ?? existing.lastName,
      documentId,
      phoneNumber,
      email,
      birthDate,
      // patientData.gender ?? existing.gender,
      // patientData ?? existing.address
    );

    return this.patientRepo.update(patient);
  }
}
