'use client';

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Shield, Users, Search, Heart, Zap, Filter, Grid3x3, List } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Container } from '@/presentation/components/ui/container'
import { Section } from '@/presentation/components/ui/section'
import { Heading } from '@/presentation/components/ui/heading'
import { Text } from '@/presentation/components/ui/text'
import { FeatureCard } from '@/presentation/components/common/FeatureCard'
import { StepCard } from '@/presentation/components/common/StepCard'
import { StatCard } from '@/presentation/components/common/StatCard'
import { WavePattern } from '@/presentation/components/svg/WavePattern'
import { FloatingShapes } from '@/presentation/components/svg/FloatingShapes'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DoctorCard } from '@/presentation/components/features/DoctorCard'
import { LoadingSpinner } from '@/presentation/components/ui/LoadingSpinner'
import { Card, CardContent } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { useDoctors, useSpecialties } from '@/presentation/hooks/queries'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select'
import { useDebounce } from '@/presentation/hooks/useDebounce'
import { ROUTES, DOCTOC_CONFIG } from '@/config/constants'
import { Input } from '@/presentation/components/ui/input';

type ViewMode = "grid" | "list"

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [specialty, setSpecialty] = useState<string>()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  const debouncedSearch = useDebounce(searchTerm, 300)

  const shouldShowResults = Boolean(searchTerm.trim() || (specialty && specialty !== "all"))

  const { data: doctorsResponse, isLoading: loadingDoctors } = useDoctors({
    orgID: DOCTOC_CONFIG.orgID,
    sections: ['users'],
  })

  const { data: specialtiesResponse, isLoading: loadingSpecialties } = useSpecialties(DOCTOC_CONFIG.orgID)

  const allDoctors = useMemo(() => doctorsResponse?.data || [], [doctorsResponse])
  const specialties = useMemo(() => specialtiesResponse?.data || [], [specialtiesResponse])

  const filteredDoctors = useMemo(() => {
    if (!shouldShowResults) return []
    
    return allDoctors.filter(user => {
      const matchesSearch = !debouncedSearch || 
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesSpecialty = !specialty || specialty === "all" || 
        user.specialty === specialty;
      return matchesSearch && matchesSpecialty;
    });
  }, [allDoctors, debouncedSearch, specialty, shouldShowResults]);

  const isLoading = loadingDoctors || loadingSpecialties;


  return (
    <>
      <Section id="inicio" variant="primary" size="lg" className="relative overflow-hidden">
        <FloatingShapes />
        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading as="h1" size="2xl" className="mb-6">
                Tu Salud, Nuestra Prioridad
              </Heading>
              <Text variant="white" size="lg" className="mb-8 opacity-90">
                Agenda citas con los mejores médicos de forma rápida, fácil y segura. 
                Gestiona tu salud desde cualquier lugar.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#medicos">
                  <Button size="lg" variant="secondary">
                    Buscar Médico
                    <Search className="ml-2 h-5 w-5" />
                  </Button>
                </a>
                <Link href={ROUTES.public.register}>
                  <Button size="lg" variant='default' className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                    Registrarse Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
               <DotLottieReact
                    src="https://lottie.host/54c712bd-4ba2-49ae-96cf-cdd77d31e82f/z8TNJigWeO.lottie"
                    loop
                    autoplay
                  />
            </div>
          </div>
        </Container>
        <WavePattern className="absolute bottom-0 left-0 right-0 w-full h-24" />
      </Section>

      <Section id="medicos" variant="gradient" size="lg">
        <Container>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <Heading as="h2" size="xl">Buscar Médicos</Heading>
              <Text variant="muted">Encuentra al especialista que necesitas y agenda tu cita</Text>
            </div>
          </div>

          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nombre del doctor..."
                    className="w-full pl-10 pr-4 py-2.5 border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-ring outline-none transition-colors"
                  />
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-initial">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-10" />
                    <Select value={specialty} onValueChange={setSpecialty}>
                      <SelectTrigger className="pl-9  w-full sm:w-60">
                        <SelectValue placeholder="Filtrar por especialidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas las especialidades</SelectItem>
                        {specialties.map((spec) => (
                          <SelectItem key={spec.name} value={spec.name}>
                            {spec.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="hidden sm:flex gap-1 border border-border rounded-lg ">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="icon-sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="icon-sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {(searchTerm || specialty) && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
                  <Text size="sm" variant="muted">Filtros activos:</Text>
                  {searchTerm && (
                    <Badge variant="secondary">
                      Búsqueda: {searchTerm}
                    </Badge>
                  )}
                  {specialty && specialty !== "all" && (
                    <Badge variant="secondary">
                      {specialty}
                    </Badge>
                  )}
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSpecialty(undefined)
                    }}
                    className="text-sm text-muted-foreground hover:text-foreground underline ml-auto"
                  >
                    Limpiar filtros
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {!shouldShowResults ? (
            <Card className="py-8">
              <div className="text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
                  <Search className="h-10 w-10 text-primary" />
                </div>
                <Heading as="h3" size="md" align="center">Comienza tu búsqueda</Heading>
                <Text variant="muted" align='center' className="max-w-md mx-auto">
                  Utiliza el campo de búsqueda o selecciona una especialidad para encontrar al médico perfecto para ti.
                </Text>
                <div className="flex flex-wrap gap-2 justify-center pt-4">
                  {specialties.map(spec => (
                    <Badge key={spec.name} variant="outline" className="cursor-pointer hover:bg-primary/10" onClick={() => setSpecialty(spec.name)}>
                      {spec.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          ) : isLoading ? (
            <Card className="p-12">
              <LoadingSpinner />
            </Card>
          ) : filteredDoctors.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <Text variant="muted">
                  {filteredDoctors.length} {filteredDoctors.length === 1 ? 'doctor encontrado' : 'doctores encontrados'}
                </Text>
              </div>

              <div className={
                viewMode === "grid" 
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3" 
                  : "flex flex-col gap-4"
              }>
                {filteredDoctors.map((doctor) => (
                  <DoctorCard
                    key={doctor.id}
                    doctor={doctor}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </>
          ) : (
            <Card className="p-12">
              <div className="text-center space-y-3">
                <div className="h-16 w-16 rounded-full bg-muted mx-auto flex items-center justify-center">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <Heading as="h3" size="md">No se encontraron médicos</Heading>
                <Text variant="muted">
                  No hay doctores que coincidan con &ldquo;{searchTerm || specialty}&rdquo;. Intenta con otros términos de búsqueda.
                </Text>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSpecialty(undefined)
                  }}
                  className="mt-4"
                >
                  Limpiar búsqueda
                </Button>
              </div>
            </Card>
          )}
        </Container>
      </Section>

      <Section id="ventajas" variant="gradient">
        <Container>
          <div className="text-center mb-12">
            <Heading size="xl" align="center" className="mb-4">
              ¿Por Qué Elegirnos?
            </Heading>
            <Text size="lg" variant="muted" align="center" className="max-w-2xl mx-auto">
              Experimenta el futuro del agendamiento médico con funciones diseñadas para ti
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Calendar className="h-10 w-10 text-primary" />}
              title="Agendamiento Fácil"
              description="Reserva citas 24/7 con disponibilidad en tiempo real"
            />
            <FeatureCard
              icon={<Users className="h-10 w-10 text-primary" />}
              title="Mejores Médicos"
              description="Acceso a profesionales médicos verificados y altamente calificados"
            />
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Ahorra Tiempo"
              description="Sin esperas telefónicas ni largas filas"
            />
            <FeatureCard
              icon={<Shield className="h-10 w-10 text-primary" />}
              title="Seguro y Privado"
              description="Tu información médica protegida con máxima seguridad"
            />
            <FeatureCard
              icon={<Heart className="h-10 w-10 text-primary" />}
              title="Atención Personalizada"
              description="Encuentra el médico perfecto para tus necesidades"
            />
            <FeatureCard
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Confirmación Instantánea"
              description="Recibe confirmación inmediata de tu cita"
            />
          </div>
        </Container>
      </Section>

      <Section id="como-funciona" variant="gradient">
        <Container>
          <div className="text-center mb-12">
            <Heading size="xl" align="center" className="mb-4">
              Cómo Funciona
            </Heading>
            <Text size="lg" variant="muted" align="center" className="max-w-2xl mx-auto">
              Agenda tu cita médica en solo 3 simples pasos
            </Text>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <StepCard
              number="1"
              title="Buscar"
              description="Encuentra médicos por especialidad, ubicación o nombre"
            />
            <StepCard
              number="2"
              title="Seleccionar"
              description="Elige tu fecha y horario preferido"
            />
            <StepCard
              number="3"
              title="Confirmar"
              description="Recibe confirmación instantánea de tu cita"
            />
          </div>

          <div className="text-center">
            <a href="#medicos">
              <Button size="lg">
                Comenzar Ahora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
        </Container>
      </Section>

      <Section id="estadisticas" variant="primary">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard number="10,000+" label="Pacientes Satisfechos" />
            <StatCard number="500+" label="Médicos Verificados" />
            <StatCard number="50+" label="Especialidades" />
            <StatCard number="24/7" label="Disponibilidad" />
          </div>
        </Container>
      </Section>

      <Section id="contacto">
        <Container className="text-center">
          <Heading size="xl" align="center" className="mb-4">
            ¿Listo para Comenzar?
          </Heading>
          <Text size="lg" variant="muted" align="center" className="mb-8 max-w-2xl mx-auto">
            Únete a miles de pacientes que ya descubrieron la conveniencia del agendamiento en línea
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={ROUTES.public.register}>
              <Button size="lg">
                Crear Cuenta Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <a href="#medicos">
              <Button size="lg" variant="outline">
                Explorar Médicos
              </Button>
            </a>
          </div>
        </Container>
      </Section>
    </>
  )
}
