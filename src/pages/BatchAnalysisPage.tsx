import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import MultiClipSelector from '@/components/batch-analysis/MultiClipSelector';

interface BatchResult {
  clip_id: string;
  possession_type: string;
  tangible_strength: string;
  tangible_weakness: string;
  key_intangible: {
    name: string;
    evidence: string;
  };
  coaching_cue: string;
}

export default function BatchAnalysisPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState<BatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (selectedIds: string[], athleteId: string) => {
    setLoading(true);
    setResults([]);

    try {
      // Fetch the selected analyses
      const { data: analyses, error: fetchError } = await supabase
        .from('analysis_history')
        .select('id, drill_name, feedback, metrics')
        .in('id', selectedIds);

      if (fetchError) throw fetchError;

      if (!analyses || analyses.length === 0) {
        toast.error('No analyses found');
        return;
      }

      // Get athlete info
      const { data: athlete } = await supabase
        .from('athletes')
        .select('name')
        .eq('id', athleteId)
        .single();

      const playerName = athlete?.name || 'Player';

      // Build clip descriptions for batch analysis
      const clips = analyses.map(analysis => ({
        clip_id: analysis.id,
        analysis_id: analysis.id,
        description: `Drill: ${analysis.drill_name}\nFeedback: ${JSON.stringify(analysis.feedback)}\nMetrics: ${JSON.stringify(analysis.metrics)}`,
        possession_type: 'offense' as const
      }));

      // Call batch analysis edge function
      const { data, error } = await supabase.functions.invoke('analyze-batch', {
        body: {
          player_name: playerName,
          clips
        }
      });

      if (error) throw error;

      setResults(data.results || []);
      toast.success(`Successfully analyzed ${data.results?.length || 0} clips`);

    } catch (error) {
      console.error('Error in batch analysis:', error);
      toast.error('Failed to analyze clips');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/athletes')}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Batch Analysis</h1>
          <p className="text-muted-foreground">
            Analyze multiple clips together to identify consistent patterns
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <MultiClipSelector onAnalyze={handleAnalyze} />

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                Patterns and insights from selected clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              )}

              {!loading && results.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  Select clips and click analyze to see results
                </p>
              )}

              {!loading && results.length > 0 && (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {results.map((result, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">Clip {index + 1}</h4>
                        <span className="text-xs text-muted-foreground uppercase">
                          {result.possession_type}
                        </span>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-green-600">Strength</p>
                        <p className="text-sm">{result.tangible_strength}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-orange-600">Area to Improve</p>
                        <p className="text-sm">{result.tangible_weakness}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-blue-600">Key Intangible</p>
                        <p className="text-sm font-semibold">{result.key_intangible.name}</p>
                        <p className="text-sm text-muted-foreground">{result.key_intangible.evidence}</p>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm font-medium">Coaching Cue</p>
                        <p className="text-sm">{result.coaching_cue}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
