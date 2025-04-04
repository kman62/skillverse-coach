
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotFoundMessage from '@/components/analysis/NotFoundMessage';
import { Sport, Drill } from '@/lib/constants';

interface AnalysisPageLayoutProps {
  sport: Sport | null;
  drill?: Drill | null;
  children: React.ReactNode;
  heading?: string;
  description?: string;
  backLink?: string;
}

const AnalysisPageLayout = ({ 
  sport, 
  drill,
  children,
  heading,
  description,
  backLink
}: AnalysisPageLayoutProps) => {
  if (!sport || !drill) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <NotFoundMessage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {heading && <h1 className="text-3xl font-bold mb-2">{heading}</h1>}
          {description && <p className="text-muted-foreground mb-6">{description}</p>}
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalysisPageLayout;
