
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, User, BarChart } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out py-4 px-6 md:px-12",
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl">
        <nav className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-semibold tracking-tight transition-opacity duration-200 hover:opacity-80"
          >
            <span className="gradient-text">AI</span><span className="text-foreground">thlete</span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-8">
            <li>
              <Link 
                to="/" 
                className={cn(
                  "text-sm font-medium link-underline",
                  location.pathname === "/" ? "text-primary" : "text-foreground/80"
                )}
              >
                Sports
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className={cn(
                  "text-sm font-medium link-underline",
                  location.pathname === "/profile" ? "text-primary" : "text-foreground/80"
                )}
              >
                My Progress
              </Link>
            </li>
            <li>
              <Link 
                to="/profile" 
                className="flex items-center justify-center h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <User size={18} />
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center justify-center h-10 w-10 rounded-md bg-background/80 border border-border"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </nav>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white/90 backdrop-blur-lg shadow-lg animate-fade-in md:hidden">
            <ul className="flex flex-col py-4 px-6 space-y-4">
              <li>
                <Link 
                  to="/" 
                  className={cn(
                    "block py-2 text-base font-medium",
                    location.pathname === "/" ? "text-primary" : "text-foreground/80"
                  )}
                >
                  Sports
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className={cn(
                    "block py-2 text-base font-medium",
                    location.pathname === "/profile" ? "text-primary" : "text-foreground/80"
                  )}
                >
                  My Progress
                </Link>
              </li>
              <li>
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-2 py-2 text-base font-medium text-foreground/80"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
