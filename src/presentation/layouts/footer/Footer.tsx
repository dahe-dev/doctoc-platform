import Link from 'next/link'
import { Calendar, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { Container } from '@/presentation/components/ui/container'
import { Text } from '@/presentation/components/ui/text'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">MedPortal</span>
            </div>
            <Text size="sm" variant="muted">
              Tu aliado confiable para citas médicas en línea. Conéctate con profesionales de la salud de forma fácil y segura.
            </Text>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#medicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Buscar Médicos
                </Link>
              </li>
              <li>
                <Link href="#medicos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Especialidades
                </Link>
              </li>
              <li>
                <Link href="#nosotros" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="#contacto" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Para Pacientes</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Registrarse
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Ingresar
                </Link>
              </li>
              <li>
                <Link href="#como-funciona" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cómo Funciona
                </Link>
              </li>
              <li>
                <Link href="#preguntas" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              <Text size="sm" variant="muted">contacto@medportal.com</Text>
              <Text size="sm" variant="muted">+51 987 654 321</Text>
              <Text size="sm" variant="muted">Lun-Vie 8am-6pm</Text>
            </ul>
            
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center   items-center flex flex-col">
          <Text size="sm" variant="muted">
            © {currentYear} MedPortal. Todos los derechos reservados.
          </Text>
          <div className="mt-2 flex gap-4 justify-center">
            <Link href="#privacidad" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacidad
            </Link>
            <Link href="#terminos" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Términos
            </Link>
            <Link href="#cookies" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}