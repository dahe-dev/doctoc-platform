import { Location } from '@/core/domain/entities/Location';

export type SerializedLocation = {
  id: string;
  nombre: string;
  direccion?: string;
  distrito?: string;
  departamento?: string;
  pais?: string;
  correo?: string;
  celular?: {
    phoneNumber: string;
    isValidNumber: boolean;
  };
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  isDefault?: boolean;
  name: string;
  address: string;
  fullAddress: string;
};

export class LocationMapper {
  static toSerialized(location: Location): SerializedLocation {
    return {
      id: location.id,
      nombre: location.nombre,
      direccion: location.direccion,
      distrito: location.distrito,
      departamento: location.departamento,
      pais: location.pais,
      correo: location.correo,
      celular: location.celular,
      locationCoordinates: location.locationCoordinates,
      isDefault: location.isDefault,
      name: location.name,
      address: location.address,
      fullAddress: location.fullAddress,
    };
  }

  static toSerializedArray(locations: Location[]): SerializedLocation[] {
    return locations.map(location => this.toSerialized(location));
  }

  static toEntity(serialized: SerializedLocation): Location {
    return new Location(
      serialized.id,
      serialized.nombre,
      serialized.direccion,
      serialized.distrito,
      serialized.departamento,
      serialized.pais,
      serialized.correo,
      serialized.celular,
      serialized.locationCoordinates,
      serialized.isDefault
    );
  }
}
