
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DrillCard from '@/components/ui/DrillCard';
import { getSportById } from '@/lib/constants';
import { ChevronLeft } from 'lucide-react';

const DrillsPage = () => {
  const { sportId } = useParams<{ sportId: string }>();
  const [sport, setSport] = useState(sportId ? getSportById(sportId) : null);
  
  useEffect(() => {
    if (sportId) {
      setSport(getSportById(sportId));
    }
  }, [sportId]);
  
  if (!sport) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Sport not found</h2>
            <p className="mt-2 text-muted-foreground">
              We couldn't find the sport you're looking for.
            </p>
            <Link 
              to="/"
              className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Sports
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative h-[40vh] min-h-[320px] flex items-center">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={sport.coverImage} 
              alt={sport.name} 
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-6 md:px-12 relative z-10 text-white">
            <Link 
              to="/"
              className="inline-flex items-center mb-6 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm hover:bg-white/30 transition-colors"
            >
              <ChevronLeft size={16} className="mr-1" />
              Back to Sports
            </Link>
            <div className="flex items-center space-x-4">
              <span className="text-5xl">{sport.icon}</span>
              <div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">{sport.name}</h1>
                <p className="mt-2 text-lg text-white/80">{sport.description}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Drills Section */}
        <section className="py-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-bold">Available Drills</h2>
              <p className="mt-2 text-muted-foreground">
                Select a drill to analyze and improve your technique
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {sport.drills.map((drill, index) => (
                <DrillCard 
                  key={drill.id} 
                  sportId={sport.id} 
                  drill={drill} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default DrillsPage;
