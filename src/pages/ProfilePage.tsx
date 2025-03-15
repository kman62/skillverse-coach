
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProgressChart from '@/components/ui/ProgressChart';
import { SPORTS } from '@/lib/constants';
import { User, Award, Flame, Calendar, ChevronRight, Clock } from 'lucide-react';

const ProfilePage = () => {
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      sport: "Basketball",
      drill: "Free Throw (Side)",
      date: "2023-06-10T14:30:00",
      score: 82
    },
    {
      id: 2,
      sport: "Basketball",
      drill: "Jump Shot",
      date: "2023-06-08T09:15:00",
      score: 75
    },
    {
      id: 3,
      sport: "Tennis",
      drill: "Serve Technique",
      date: "2023-06-05T16:45:00",
      score: 68
    },
    {
      id: 4,
      sport: "Football",
      drill: "Quarterback Throw",
      date: "2023-06-01T11:20:00",
      score: 71
    }
  ];
  
  // Mock data for progress chart
  const progressData = [
    { date: "2023-05-01", score: 65 },
    { date: "2023-05-08", score: 68 },
    { date: "2023-05-15", score: 72 },
    { date: "2023-05-22", score: 70 },
    { date: "2023-05-29", score: 74 },
    { date: "2023-06-05", score: 78 },
    { date: "2023-06-10", score: 82 }
  ];
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };
  
  // Format time string
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  // Get icon for sport
  const getSportIcon = (sportName: string) => {
    const sport = SPORTS.find(s => s.name === sportName);
    return sport ? sport.icon : '🏅';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12">
          {/* Profile Header */}
          <section className="mb-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-primary/10 rounded-full flex items-center justify-center mr-5">
                  <User size={32} className="text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">John Doe</h1>
                  <p className="text-muted-foreground">Basketball, Tennis, Football</p>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 flex flex-wrap md:flex-nowrap gap-4">
                <div className="bg-card border border-border rounded-lg px-4 py-3 w-full sm:w-auto">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Award size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Score</p>
                      <p className="text-xl font-semibold">76.5</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card border border-border rounded-lg px-4 py-3 w-full sm:w-auto">
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                      <Flame size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Practice Streak</p>
                      <p className="text-xl font-semibold">8 days</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Progress Chart */}
            <div className="lg:col-span-2">
              <ProgressChart data={progressData} />
            </div>
            
            {/* Achievements */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-lg font-semibold mb-4">Your Achievements</h2>
              
              <div className="space-y-4">
                <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Consistency Champion</p>
                    <p className="text-sm text-muted-foreground">Practiced for 7 days in a row</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Basketball Rookie</p>
                    <p className="text-sm text-muted-foreground">Completed 5 basketball drills</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 bg-primary/5 rounded-lg">
                  <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                    <Award size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Learner</p>
                    <p className="text-sm text-muted-foreground">Improved score by 10% in a week</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-4 text-sm text-primary font-medium flex items-center justify-center py-2">
                View All Achievements
                <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
          
          {/* Recent Activity */}
          <section className="mt-10">
            <h2 className="text-xl font-semibold mb-6">Recent Activity</h2>
            
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Sport</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Drill</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Time</th>
                      <th className="text-left py-3 px-6 text-sm font-medium text-muted-foreground">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {recentActivities.map((activity) => (
                      <tr key={activity.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3 px-6">
                          <div className="flex items-center">
                            <span className="mr-2 text-xl">{getSportIcon(activity.sport)}</span>
                            <span>{activity.sport}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6">{activity.drill}</td>
                        <td className="py-3 px-6">
                          <div className="flex items-center">
                            <Calendar size={14} className="mr-2 text-muted-foreground" />
                            <span>{formatDate(activity.date)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center">
                            <Clock size={14} className="mr-2 text-muted-foreground" />
                            <span>{formatTime(activity.date)}</span>
                          </div>
                        </td>
                        <td className="py-3 px-6">
                          <div className="flex items-center">
                            <span className={`font-medium ${
                              activity.score >= 80 ? 'text-green-500' : 
                              activity.score >= 70 ? 'text-yellow-500' : 
                              'text-red-500'
                            }`}>
                              {activity.score}
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="py-3 px-6 bg-muted/20 border-t border-border flex justify-center">
                <button className="text-sm text-primary font-medium flex items-center">
                  View All Activity
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
