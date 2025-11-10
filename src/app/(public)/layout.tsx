import { PublicHeader } from '@/presentation/layouts/header/PublicHeader';
import { Footer } from '@/presentation/layouts/footer/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <PublicHeader />
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
    </div>
  );
}