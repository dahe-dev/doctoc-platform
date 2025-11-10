'use client';

import { useState } from 'react';
import { useAuth } from '@/infrastructure/auth/AuthContext';
import { Card } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Container } from '@/presentation/components/ui/container';
import { Section } from '@/presentation/components/ui/section';
import { Heading } from '@/presentation/components/ui/heading';
import { Text } from '@/presentation/components/ui/text';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit,
  Save,
  X,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phone: '',
    birthDate: '',
    address: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      email: user?.email || '',
      phone: '',
      birthDate: '',
      address: '',
    });
    setIsEditing(false);
  };

  return (
    <>
      <Section variant="gradient" size="xs" className="border-border border-b">
        <Container>
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <User className="text-primary h-6 w-6" />
            </div>
            <div>
              <Heading as="h1" size="xl">
                Mi Perfil
              </Heading>
              <Text variant="muted">Gestiona tu información personal</Text>
            </div>
          </div>
        </Container>
      </Section>

      <Section size="xs">
        <Container size="md">
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="border-border h-20 w-20 border-2">
                      <AvatarImage src={user?.photoURL || undefined} />
                      <AvatarFallback className="text-2xl">
                        {user?.displayName?.charAt(0) ||
                          user?.email?.charAt(0) ||
                          'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Heading as="h2" size="lg">
                        {user?.displayName || 'Usuario'}
                      </Heading>
                      <Text variant="muted">{user?.email}</Text>
                    </div>
                  </div>

                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Editar
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        Nombre completo
                      </label>
                      <div className="relative">
                        <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                          type="text"
                          value={formData.displayName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              displayName: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="border-input bg-background text-foreground focus:ring-ring focus:border-ring w-full rounded-lg border px-4 py-2 pl-10 transition-colors outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tu nombre completo"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          className="border-input bg-muted text-muted-foreground w-full cursor-not-allowed rounded-lg border px-4 py-2 pl-10"
                        />
                      </div>
                      <Text size="sm" variant="muted" className="mt-1">
                        El email no se puede cambiar
                      </Text>
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        Teléfono
                      </label>
                      <div className="relative">
                        <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          disabled={!isEditing}
                          className="border-input bg-background text-foreground focus:ring-ring focus:border-ring w-full rounded-lg border px-4 py-2 pl-10 transition-colors outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        Fecha de nacimiento
                      </label>
                      <div className="relative">
                        <Calendar className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                          type="date"
                          value={formData.birthDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              birthDate: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          className="border-input bg-background text-foreground focus:ring-ring focus:border-ring w-full rounded-lg border px-4 py-2 pl-10 transition-colors outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-foreground mb-2 block text-sm font-medium">
                        Dirección
                      </label>
                      <div className="relative">
                        <MapPin className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        <textarea
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                          disabled={!isEditing}
                          rows={3}
                          className="border-input bg-background text-foreground focus:ring-ring focus:border-ring w-full resize-none rounded-lg border px-4 py-2 pl-10 transition-colors outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="Tu dirección completa"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1">
                          <Save className="mr-2 h-4 w-4" />
                          Guardar cambios
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleCancel}
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancelar
                        </Button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </Card>
          </div>
        </Container>
      </Section>
    </>
  );
}
