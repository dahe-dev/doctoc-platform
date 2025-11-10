import { Card, CardContent, CardFooter } from "@/presentation/components/ui/card"
import { Button } from "@/presentation/components/ui/button"
import { Badge } from "@/presentation/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/presentation/components/ui/avatar"
import { Calendar, Stethoscope, Mail } from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/config/constants"
import { UserMapper, type SerializedUser } from "@/core/application/mappers"

interface DoctorCardProps {
  doctor: SerializedUser
  viewMode?: "grid" | "list"
}

export function DoctorCard({ doctor, viewMode = "grid" }: DoctorCardProps) {
  const userEntity = UserMapper.toEntity(doctor)

  if (viewMode === "list") {
    return (
      <Link href={ROUTES.public.doctorDetail(userEntity.id)}>
        <Card  className="transition-all duration-200 hover:shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <Avatar className="h-20 w-20 border-2 border-border">
                  <AvatarImage src={userEntity.photoUrl} alt={userEntity.fullName} />
                  <AvatarFallback className="text-xl">{userEntity.initials}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xl mb-2">{userEntity.fullName}</h3>
                
                <div className="flex flex-wrap gap-3 mb-3">
                  {userEntity.specialty && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Stethoscope className="h-4 w-4" />
                      <span className="text-sm">{userEntity.specialty}</span>
                    </div>
                  )}
                  {userEntity.email && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm truncate max-w-[200px]">{userEntity.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {userEntity.gender && (
                    <Badge variant="secondary">
                      {userEntity.gender}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Button
                  size="lg"
                  className="min-w-40"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Ver Horarios
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <Link href={ROUTES.public.doctorDetail(userEntity.id)}>
      <Card  className="transition-all duration-200 flex flex-col h-full hover:shadow-lg">
        <CardContent className="p-6 flex-1">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={userEntity.photoUrl} alt={userEntity.fullName} />
                <AvatarFallback className="text-2xl">{userEntity.initials}</AvatarFallback>
              </Avatar>
            </div>

            <h3 className="font-bold text-lg mb-1">{userEntity.fullName}</h3>
            
            {userEntity.specialty && (
              <div className="flex items-center gap-1.5 text-muted-foreground mb-3">
                <Stethoscope className="h-4 w-4" />
                <span className="text-sm">{userEntity.specialty}</span>
              </div>
            )}
          </div>

          {userEntity.email && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 justify-center">
              <Mail className="h-4 w-4 shrink-0" />
              <span className="truncate">{userEntity.email}</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2 justify-center">
            {userEntity.gender && (
              <Badge variant="secondary">
                {userEntity.gender}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="p-6 pt-0">
          <Button
            className="w-full"
            size="lg"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Ver Horarios
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
