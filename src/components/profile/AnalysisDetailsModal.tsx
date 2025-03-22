
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Award, Video, Flame, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { getSportById, getDrillById } from '@/lib/constants';

interface AnalysisDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  analysisData: any | null;
}

const AnalysisDetailsModal = ({ open, onOpenChange, analysisData }: AnalysisDetailsModalProps) => {
  const navigate = useNavigate();
  
  if (!analysisData) return null;
  
  const sport = getSportById(analysisData.sport_id);
  const drill = getDrillById(analysisData.sport_id, analysisData.drill_id);
  const analysisResult = analysisData.analysis_data;
  const behaviorData = analysisData.behavior_data;
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const formatTime = (dateString: string) => {
    return format(new Date(dateString), 'h:mm a');
  };
  
  const handleReviewClick = () => {
    if (sport && drill) {
      navigate(`/analysis/${sport.id}/${drill.id}?analysisId=${analysisData.id}`);
    }
  };
  
  // Calculate progress percentage for metric
  const calculateProgress = (value: number, target: number) => {
    const percentage = (value / target) * 100;
    return Math.min(Math.max(percentage, 0), 100);
  };
  
  // Determine score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center">
            <span className="mr-2 text-xl">{sport?.icon}</span>
            <span>{sport?.name} - {drill?.name} Analysis</span>
          </DialogTitle>
          <DialogDescription>
            Analyzed on {formatDate(analysisData.created_at)} at {formatTime(analysisData.created_at)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="summary">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="technique">Technique</TabsTrigger>
              <TabsTrigger value="behavior">Behavior</TabsTrigger>
            </TabsList>
            
            <TabsContent value="summary" className="mt-4 space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-card rounded-lg border p-5 md:w-1/3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Overall Score</h3>
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <span className={`text-5xl font-bold ${getScoreColor(analysisData.score || 0)}`}>
                        {analysisData.score || 0}
                      </span>
                      <span className="text-xl">/100</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card rounded-lg border p-5 md:w-2/3">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Analysis Overview</h3>
                  <div className="space-y-3">
                    <p>{analysisResult?.description || "No description available"}</p>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Key Insights:</h4>
                      <ul className="space-y-1">
                        {analysisResult?.feedback?.good?.slice(0, 2).map((item: string, idx: number) => (
                          <li key={`good-${idx}`} className="flex items-start">
                            <CheckCircle size={16} className="text-green-500 mr-2 mt-1 shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                        {analysisResult?.feedback?.improve?.slice(0, 2).map((item: string, idx: number) => (
                          <li key={`improve-${idx}`} className="flex items-start">
                            <AlertCircle size={16} className="text-yellow-500 mr-2 mt-1 shrink-0" />
                            <span className="text-sm">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button onClick={handleReviewClick} className="flex items-center gap-2">
                  <Video size={16} />
                  Review Video Analysis
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="technique" className="mt-4 space-y-4">
              {analysisResult?.metrics && analysisResult.metrics.length > 0 ? (
                <div className="bg-card rounded-lg border p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Technical Metrics</h3>
                  <div className="space-y-4">
                    {analysisResult.metrics.map((metric: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between items-center text-sm">
                          <span>{metric.name}</span>
                          <span className="font-medium">
                            {metric.value}{metric.unit} / {metric.target}{metric.unit}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${calculateProgress(metric.value, metric.target)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg border p-5 text-center text-muted-foreground">
                  No technical metrics available for this analysis
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg border p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center">
                    <CheckCircle size={16} className="text-green-500 mr-2" />
                    What You're Doing Well
                  </h3>
                  {analysisResult?.feedback?.good && analysisResult.feedback.good.length > 0 ? (
                    <ul className="space-y-2 pl-6">
                      {analysisResult.feedback.good.map((item: string, index: number) => (
                        <li key={index} className="text-sm list-disc text-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No strengths identified</p>
                  )}
                </div>
                
                <div className="bg-card rounded-lg border p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center">
                    <AlertCircle size={16} className="text-yellow-500 mr-2" />
                    Areas to Improve
                  </h3>
                  {analysisResult?.feedback?.improve && analysisResult.feedback.improve.length > 0 ? (
                    <ul className="space-y-2 pl-6">
                      {analysisResult.feedback.improve.map((item: string, index: number) => (
                        <li key={index} className="text-sm list-disc text-foreground">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No improvement areas identified</p>
                  )}
                </div>
              </div>
              
              {analysisResult?.coachingTips && analysisResult.coachingTips.length > 0 && (
                <div className="bg-card rounded-lg border p-5">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Coaching Tips</h3>
                  <ul className="space-y-2 pl-6">
                    {analysisResult.coachingTips.map((tip: string, index: number) => (
                      <li key={index} className="text-sm list-disc text-foreground">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="behavior" className="mt-4 space-y-4">
              {behaviorData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg border p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Consistency</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className="font-medium">{behaviorData.consistency?.score || 0}/100</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${behaviorData.consistency?.score || 0}%` }}
                        />
                      </div>
                      <p className="text-sm mt-2">{behaviorData.consistency?.feedback || "No feedback available"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Pre-Routine</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className="font-medium">{behaviorData.preRoutine?.score || 0}/100</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${behaviorData.preRoutine?.score || 0}%` }}
                        />
                      </div>
                      <p className="text-sm mt-2">{behaviorData.preRoutine?.feedback || "No feedback available"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Habits</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className="font-medium">{behaviorData.habits?.score || 0}/100</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${behaviorData.habits?.score || 0}%` }}
                        />
                      </div>
                      <p className="text-sm mt-2">{behaviorData.habits?.feedback || "No feedback available"}</p>
                    </div>
                  </div>
                  
                  <div className="bg-card rounded-lg border p-5">
                    <h3 className="text-sm font-medium text-muted-foreground mb-4">Fatigue Management</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Score</span>
                        <span className="font-medium">{behaviorData.fatigue?.score || 0}/100</span>
                      </div>
                      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${behaviorData.fatigue?.score || 0}%` }}
                        />
                      </div>
                      <p className="text-sm mt-2">{behaviorData.fatigue?.feedback || "No feedback available"}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card rounded-lg border p-5 text-center text-muted-foreground">
                  No behavior analysis data available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AnalysisDetailsModal;
