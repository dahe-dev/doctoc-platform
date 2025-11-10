import {
  Card,
  CardContent,
  CardFooter,
} from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import { Calendar, Stethoscope, Mail } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/config/constants';
import { UserMapper, type SerializedUser } from '@/core/application/mappers';
import { formatDoctorName } from '@/presentation/utils';

interface DoctorCardProps {
  doctor: SerializedUser;
  viewMode?: 'grid' | 'list';
}

export function DoctorCard({ doctor, viewMode = 'grid' }: DoctorCardProps) {
  const userEntity = UserMapper.toEntity(doctor);
  const doctorDisplayName = formatDoctorName(
    userEntity.firstName,
    userEntity.lastName,
    userEntity.gender,
    userEntity.role,
  );

  if (viewMode === 'list') {
    return (
      <Link
        href={`${ROUTES.public.doctorDetail(userEntity.id)}?photo=${encodeURIComponent(userEntity.photoUrl || '')}`}
      >
        <Card className="transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <Avatar className="border-border h-20 w-20 border-2">
                  <AvatarImage
                    src={userEntity.photoUrl}
                    alt={userEntity.fullName}
                  />
                  <AvatarFallback className="text-xl">
                    {userEntity.initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="mb-2 text-xl font-bold">{doctorDisplayName}</h3>

                <div className="mb-3 flex flex-wrap gap-3">
                  {userEntity.specialty && (
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <Stethoscope className="h-4 w-4" />
                      <span className="text-sm">{userEntity.specialty}</span>
                    </div>
                  )}
                  {userEntity.email && (
                    <div className="text-muted-foreground flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span className="max-w-[200px] truncate text-sm">
                        {userEntity.email}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {userEntity.gender && (
                    <Badge variant="secondary">{userEntity.gender}</Badge>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Button size="lg" className="min-w-40">
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Horarios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link
      href={`${ROUTES.public.doctorDetail(userEntity.id)}?photo=${encodeURIComponent(userEntity.photoUrl || '')}`}
    >
      <Card className="flex h-full flex-col transition-all duration-200 hover:shadow-lg">
        <CardContent className="flex-1 p-6">
          <div className="mb-4 flex flex-col items-center text-center">
            <div className="relative mb-4">
              <Avatar className="border-border h-24 w-24 border-2">
                <AvatarImage
                  src={userEntity.photoUrl}
                  alt={userEntity.fullName}
                />
                <AvatarFallback className="text-2xl">
                  {userEntity.initials}
                </AvatarFallback>
              </Avatar>
            </div>

            <h3 className="mb-1 text-lg font-bold">{doctorDisplayName}</h3>

            {userEntity.specialty && (
              <div className="text-muted-foreground mb-3 flex items-center gap-1.5">
                <Stethoscope className="h-4 w-4" />
                <span className="text-sm">{userEntity.specialty}</span>
              </div>
            )}
          </div>

          {userEntity.email && (
            <div className="text-muted-foreground mb-4 flex items-center justify-center gap-2 text-sm">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{userEntity.email}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2">
            {userEntity.gender && (
              <Badge variant="secondary">{userEntity.gender}</Badge>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-6 pt-0">
          <Button className="w-full" size="lg">
            <Calendar className="mr-2 h-4 w-4" />
            Ver Horarios
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
