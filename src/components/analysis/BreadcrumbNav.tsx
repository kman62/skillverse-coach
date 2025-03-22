
import React from 'react';
import { Link } from 'react-router-dom';
import { Sport, Drill } from '@/lib/constants';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface BreadcrumbNavProps {
  sport: Sport | null;
  drill: Drill | null;
}

const BreadcrumbNav = ({ sport, drill }: BreadcrumbNavProps) => {
  if (!sport || !drill) return null;
  
  return (
    <div className="mb-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/">Sports</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/sports/${sport.id}`}>{sport.name}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{drill.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbNav;
