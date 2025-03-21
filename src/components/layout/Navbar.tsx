
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

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
            {user && (
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
            )}
            <li>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="h-9 w-9 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <User size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button>Sign In</Button>
                </Link>
              )}
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
              {user && (
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
              )}
              <li>
                {user ? (
                  <>
                    <Link 
                      to="/profile" 
                      className="flex items-center space-x-2 py-2 text-base font-medium text-foreground/80"
                    >
                      <User size={18} />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="flex items-center space-x-2 py-2 text-base font-medium text-foreground/80 w-full"
                    >
                      <LogOut size={18} />
                      <span>Log out</span>
                    </button>
                  </>
                ) : (
                  <Link 
                    to="/auth"
                    className="block w-full"
                  >
                    <Button className="w-full">Sign In</Button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
