
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SportsCard from '@/components/ui/SportsCard';
import { SPORTS } from '@/lib/sports';
import { ChevronRight, Search } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredSports = searchQuery.trim() === '' 
    ? SPORTS 
    : SPORTS.filter(sport => 
        sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sport.description.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        {/* Hero Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col items-center text-center max-w-3xl mx-auto animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Perfect Your Technique with <span className="gradient-text">AI Analysis</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
                Upload videos of your sports movements and receive instant feedback, 
                scoring, and coaching tips to improve your performance.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <a 
                  href="#sports"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  Get Started
                </a>
                <a 
                  href="#how-it-works"
                  className="px-6 py-3 border border-border rounded-lg bg-white hover:bg-gray-50 transition-colors duration-300"
                >
                  How It Works
                </a>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 bg-secondary/50">
          <div className="container mx-auto px-6 md:px-12">
            <div className="mb-12 text-center">
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">Process</span>
              <h2 className="mt-2 text-3xl md:text-4xl font-bold">How It Works</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Follow these simple steps to start improving your sports technique
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <span className="text-lg font-semibold text-primary">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Select Your Sport</h3>
                <p className="text-muted-foreground">
                  Choose from a variety of sports and specific drills that you want to improve.
                </p>
                <div className="mt-5 flex items-center text-primary">
                  <span className="text-sm font-medium">Choose sport</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <span className="text-lg font-semibold text-primary">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Upload Your Video</h3>
                <p className="text-muted-foreground">
                  Record or upload a video of your technique for AI-powered analysis.
                </p>
                <div className="mt-5 flex items-center text-primary">
                  <span className="text-sm font-medium">Upload video</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-border animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                  <span className="text-lg font-semibold text-primary">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Detailed Feedback</h3>
                <p className="text-muted-foreground">
                  Receive a comprehensive analysis with specific tips to improve your technique.
                </p>
                <div className="mt-5 flex items-center text-primary">
                  <span className="text-sm font-medium">View analysis</span>
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Sports Section */}
        <section id="sports" className="py-16">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <div>
                <span className="text-sm font-semibold text-primary uppercase tracking-wide">Training</span>
                <h2 className="mt-2 text-3xl md:text-4xl font-bold">Choose Your Sport</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
                  Select from our range of sports to get started with personalized technique analysis
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <Search size={18} className="text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="Search sports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredSports.map((sport, index) => (
                <SportsCard 
                  key={sport.id} 
                  sport={sport} 
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }} 
                />
              ))}
              
              {filteredSports.length === 0 && (
                <div className="col-span-full py-12 text-center">
                  <p className="text-lg text-muted-foreground">No sports found matching your search.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-6 md:px-12">
            <div className="rounded-2xl bg-white border border-border p-8 md:p-12 shadow-sm max-w-4xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold">Ready to Elevate Your Game?</h2>
              <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
                Join athletes who have improved their technique with our AI-powered sports analysis platform.
              </p>
              <div className="mt-8">
                <a 
                  href="#sports"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300"
                >
                  Get Started Now
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
