
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock, ChevronRight } from "lucide-react";
import { TeamAnalysis } from "@/lib/sports";
import { Link } from "react-router-dom";

interface TeamAnalysisCardProps {
  sportId: string;
  analysis: TeamAnalysis;
}

const TeamAnalysisCard = ({ sportId, analysis }: TeamAnalysisCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={analysis.coverImage}
          alt={analysis.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">{analysis.name}</CardTitle>
        <CardDescription>{analysis.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{analysis.players} players</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{analysis.duration}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to="/highlight-reel">
            Analyze Game <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TeamAnalysisCard;
