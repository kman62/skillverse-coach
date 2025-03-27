
import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Users } from "lucide-react";
import { getSportById } from "@/lib/constants";
import DrillCard from "@/components/ui/DrillCard";
import TeamAnalysisCard from "@/components/ui/TeamAnalysisCard";
import { Button } from "@/components/ui/button";

const DrillsPage = () => {
  const { sportId } = useParams<{ sportId: string }>();
  const sport = getSportById(sportId || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!sport) {
    return (
      <div className="container py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Sport not found</h1>
        <Link to="/">
          <Button>Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6 gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{sport.name} Training</h1>
      </div>

      {sport.id === "basketball" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Develop your basketball skills with these specialized drills designed for players of all levels.
            Master shooting, dribbling, and passing techniques to elevate your game and become a
            more complete player on the court.
          </p>
        </div>
      )}

      {sport.id === "baseball" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Enhance your baseball skills with these carefully designed drills for players of all abilities.
            Focus on pitching, batting, and fielding techniques to improve your overall performance and
            become a more versatile player on the diamond.
          </p>
        </div>
      )}

      {sport.id === "football" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Elevate your football skills with these specialized drills designed for all skill levels.
            Improve your throwing, catching, and footwork techniques to increase your effectiveness
            on the field and contribute more to your team's success.
          </p>
        </div>
      )}

      {sport.id === "tennis" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Refine your tennis skills with these targeted drills suitable for players at every level.
            Perfect your serve, forehand, backhand, and volley techniques to gain consistency and
            confidence in your game and outperform your opponents on the court.
          </p>
        </div>
      )}

      {sport.id === "golf" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Polish your golf skills with these focused drills appropriate for all handicap levels.
            Improve your swing mechanics, putting technique, and overall course management to
            lower your scores and enjoy more consistent performance on the links.
          </p>
        </div>
      )}

      {sport.id === "soccer" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Develop your soccer abilities with these purpose-built drills for players of every age and skill level.
            Enhance your dribbling, passing, and shooting techniques to become a more complete player
            and make a greater impact during matches.
          </p>
        </div>
      )}

      {sport.id === "rugby" && (
        <div className="mb-6">
          <p className="text-muted-foreground">
            Perfect your rugby skills with these specialized drills designed for players of all levels. 
            From passing and tackling to advanced ruck techniques, these drills will help you develop 
            the fundamental skills needed for success on the field.
          </p>
        </div>
      )}

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4 flex items-center">
          <BookOpen className="mr-2 h-5 w-5 text-primary" />
          Technique Drills
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sport.drills.map((drill) => (
            <DrillCard
              key={drill.id}
              sportId={sport.id}
              drill={drill}
            />
          ))}
        </div>
      </div>

      {sport.teamAnalysis && sport.teamAnalysis.length > 0 && (
        <div className="mb-10">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-primary" />
            Team Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sport.teamAnalysis.map((analysis) => (
              <TeamAnalysisCard
                key={analysis.id}
                sportId={sport.id}
                analysis={analysis}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrillsPage;
