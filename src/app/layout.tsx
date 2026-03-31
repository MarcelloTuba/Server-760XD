import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Toaster } from '@/components/ui/toaster';
import { InfrastructureProvider } from '@/context/InfrastructureContext';

export const metadata: Metadata = {
  title: 'HostInsight Dashboard | Enterprise Server Monitoring',
  description: 'Interactive real-time monitoring for Dell PowerEdge server infrastructure.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/30 selection:text-accent">
        <InfrastructureProvider>
          <SidebarProvider defaultOpen={true}>
            <div className="flex min-h-screen w-full bg-background text-foreground">
              <AppSidebar />
              <SidebarInset className="bg-background flex flex-col">
                <main className="flex-1 overflow-auto p-6 md:p-8">
                  {children}
                </main>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </InfrastructureProvider>
        <Toaster />
      </body>
    </html>
  );
}
