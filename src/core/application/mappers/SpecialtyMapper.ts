import { Specialty } from '@/core/domain/entities/Specialty';

export type SerializedSpecialty = {
  name: string;
  description?: string;
  photo?: string | null;
};

export class SpecialtyMapper {
  static toSerialized(specialty: Specialty): SerializedSpecialty {
    return {
      name: specialty.name,
      description: specialty.description,
      photo: specialty.photo,
    };
  }

  static toEntity(serialized: SerializedSpecialty): Specialty {
    return new Specialty(
      serialized.name,
      serialized.description,
      serialized.photo || undefined
    );
  }

  static toSerializedArray(specialties: Specialty[]): SerializedSpecialty[] {
    return specialties.map(specialty => SpecialtyMapper.toSerialized(specialty));
  }

  static toEntityArray(serializedSpecialties: SerializedSpecialty[]): Specialty[] {
    return serializedSpecialties.map(serialized => SpecialtyMapper.toEntity(serialized));
  }
}
