
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import VideoUploader from '@/components/ui/VideoUploader';
import AnalysisCard from '@/components/ui/AnalysisCard';
import { getSportById, getDrillById } from '@/lib/constants';
import { ChevronLeft, BarChart } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const AnalysisPage = () => {
  const { sportId, drillId } = useParams<{ sportId: string; drillId: string }>();
  const [sport, setSport] = useState(sportId ? getSportById(sportId) : null);
  const [drill, setDrill] = useState(drillId && sportId ? getDrillById(sportId, drillId) : null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    if (sportId) {
      setSport(getSportById(sportId));
    }
    
    if (sportId && drillId) {
      setDrill(getDrillById(sportId, drillId));
    }
  }, [sportId, drillId]);
  
  const handleVideoSelected = (file: File) => {
    setVideoFile(file);
    setAnalysisResult(null);
  };
  
  const handleAnalyzeClick = () => {
    if (!videoFile) {
      toast({
        title: "No video selected",
        description: "Please upload a video to analyze",
        variant: "destructive"
      });
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate analysis with a timeout (would be replaced with actual analysis API call)
    setTimeout(() => {
      // Mock analysis result data
      const result = {
        title: `${drill?.name} Analysis`,
        description: "AI-powered feedback on your technique",
        score: Math.floor(Math.random() * 30) + 60, // Random score between 60-90
        metrics: [
          {
            name: "Arm Angle",
            value: Math.floor(Math.random() * 20) + 70,
            target: 85,
            unit: "°"
          },
          {
            name: "Joint Alignment",
            value: Math.floor(Math.random() * 25) + 70,
            target: 90,
            unit: "%"
          },
          {
            name: "Motion Smoothness",
            value: Math.floor(Math.random() * 30) + 65,
            target: 95,
            unit: "%"
          },
          {
            name: "Balance",
            value: Math.floor(Math.random() * 20) + 75,
            target: 90,
            unit: "%"
          }
        ],
        feedback: {
          good: [
            "Good initial stance and body positioning",
            "Consistent follow-through motion after completion",
            "Proper weight distribution throughout the movement"
          ],
          improve: [
            "Try to maintain a more consistent arm angle during execution",
            "Focus on keeping your joints aligned throughout the motion",
            "Work on smoother transitions between movement phases"
          ]
        }
      };
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
      
      toast({
        title: "Analysis Complete",
        description: "Your technique has been successfully analyzed"
      });
    }, 3000);
  };
  
  if (!sport || !drill) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
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
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-6 md:px-12 pt-4">
          {/* Breadcrumb Navigation */}
          <div className="mb-8">
            <div className="flex items-center text-sm text-muted-foreground">
              <Link to="/" className="hover:text-primary transition-colors">Sports</Link>
              <span className="mx-2">/</span>
              <Link to={`/sports/${sport.id}`} className="hover:text-primary transition-colors">{sport.name}</Link>
              <span className="mx-2">/</span>
              <span className="text-foreground">{drill.name}</span>
            </div>
          </div>
          
          {/* Drill Info */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold">{drill.name}</h1>
            <p className="mt-2 text-muted-foreground">{drill.description}</p>
            
            <div className="mt-4 inline-flex items-center px-3 py-1 bg-secondary rounded-full text-xs font-medium">
              Difficulty: {drill.difficulty.charAt(0).toUpperCase() + drill.difficulty.slice(1)}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Left Column: Video Upload */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Upload Your Technique</h2>
              <VideoUploader onVideoSelected={handleVideoSelected} />
              
              <div className="mt-6">
                <button
                  onClick={handleAnalyzeClick}
                  disabled={!videoFile || isAnalyzing}
                  className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center transition-colors ${
                    !videoFile || isAnalyzing 
                      ? "bg-primary/60 cursor-not-allowed" 
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <BarChart size={18} className="mr-2" />
                      Analyze Technique
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-3">Tips for Best Results</h3>
                <ul className="space-y-2 pl-5">
                  <li className="text-muted-foreground text-sm list-disc">
                    Ensure good lighting and a clear background
                  </li>
                  <li className="text-muted-foreground text-sm list-disc">
                    Position the camera to capture your full body movement
                  </li>
                  <li className="text-muted-foreground text-sm list-disc">
                    Perform the technique at a normal speed
                  </li>
                  <li className="text-muted-foreground text-sm list-disc">
                    Wear appropriate clothing that makes it easy to see your form
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Right Column: Analysis Results */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              
              {!analysisResult && !isAnalyzing && (
                <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center p-6 text-center">
                  <div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <BarChart size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium">No Analysis Yet</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                      Upload a video and click "Analyze Technique" to receive personalized feedback.
                    </p>
                  </div>
                </div>
              )}
              
              {isAnalyzing && (
                <div className="bg-card rounded-xl border border-border h-[500px] flex items-center justify-center p-6 text-center animate-pulse">
                  <div>
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium">Analyzing Your Technique</h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                      Please wait while our AI analyzes your movement patterns...
                    </p>
                  </div>
                </div>
              )}
              
              {analysisResult && !isAnalyzing && (
                <div className="animate-fade-in">
                  <AnalysisCard 
                    title={analysisResult.title}
                    description={analysisResult.description}
                    score={analysisResult.score}
                    metrics={analysisResult.metrics}
                    feedback={analysisResult.feedback}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnalysisPage;
