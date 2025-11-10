'use client';

import { UserMapper, type SerializedUser } from '@/core/application/mappers';
import { Card } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar';
import { Mail, Stethoscope, User as UserIcon } from 'lucide-react';

interface DoctorProfileProps {
  doctor: SerializedUser;
}

export function DoctorProfile({ doctor }: DoctorProfileProps) {
  const userEntity = UserMapper.toEntity(doctor);

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-shrink-0">
          <Avatar className="h-32 w-32 border-4 border-primary/10">
            <AvatarImage src={userEntity.photoUrl} alt={userEntity.fullName} />
            <AvatarFallback className="text-3xl bg-primary/10 text-primary">
              {userEntity.initials}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Dr. {userEntity.fullName}
            </h1>
            {userEntity.specialty && (
              <Badge variant="secondary" className="text-base px-3 py-1">
                <Stethoscope className="h-4 w-4 mr-2" />
                {userEntity.specialty}
              </Badge>
            )}
          </div>

          <div className="grid gap-3 text-sm">
            {userEntity.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{userEntity.email}</span>
              </div>
            )}
            {userEntity.gender && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <UserIcon className="h-4 w-4" />
                <span className="capitalize">{userEntity.gender}</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold text-foreground mb-2">Información del Doctor</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Profesional médico especializado en {userEntity.specialty || 'atención médica general'}. 
              Comprometido con brindar atención de calidad y personalizada a cada paciente.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
