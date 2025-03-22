
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import NotFoundMessage from '@/components/analysis/NotFoundMessage';

interface AnalysisLayoutProps {
  children: React.ReactNode;
  isValidDrill: boolean;
}

const AnalysisLayout = ({ children, isValidDrill }: AnalysisLayoutProps) => {
  if (!isValidDrill) {
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
        <div className="container mx-auto px-6 md:px-12 pt-4">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AnalysisLayout;
