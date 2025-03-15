
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const NotFoundMessage = () => {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold">Drill not found</h2>
      <p className="mt-2 text-muted-foreground">
        We couldn't find the drill you're looking for.
      </p>
      <Link 
        to="/"
        className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        <ChevronLeft size={16} className="mr-1" />
        Back to Sports
      </Link>
    </div>
  );
};

export default NotFoundMessage;
