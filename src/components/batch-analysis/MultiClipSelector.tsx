import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface Analysis {
  id: string;
  drill_name: string;
  sport_id: string;
  score: number;
  created_at: string;
  athlete_id: string;
}

interface Athlete {
  id: string;
  name: string;
}

interface MultiClipSelectorProps {
  onAnalyze: (selectedIds: string[], athleteId: string) => void;
}

export default function MultiClipSelector({ onAnalyze }: MultiClipSelectorProps) {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAthletes();
  }, []);

  useEffect(() => {
    if (selectedAthleteId) {
      fetchAnalyses();
    }
  }, [selectedAthleteId]);

  const fetchAthletes = async () => {
    const { data, error } = await supabase
      .from('athletes')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching athletes:', error);
      return;
    }

    setAthletes(data || []);
    if (data && data.length > 0) {
      setSelectedAthleteId(data[0].id);
    }
  };

  const fetchAnalyses = async () => {
    if (!selectedAthleteId) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('analysis_history')
      .select('id, drill_name, sport_id, score, created_at, athlete_id')
      .eq('athlete_id', selectedAthleteId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Error fetching analyses:', error);
      toast.error('Failed to load analyses');
    } else {
      setAnalyses(data || []);
    }
    setLoading(false);
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const handleAnalyze = () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one clip');
      return;
    }
    onAnalyze(Array.from(selectedIds), selectedAthleteId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Multi-Clip Batch Analysis</CardTitle>
        <CardDescription>
          Select multiple clips to analyze together and identify patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Select Athlete</label>
          <Select value={selectedAthleteId} onValueChange={setSelectedAthleteId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an athlete" />
            </SelectTrigger>
            <SelectContent>
              {athletes.map(athlete => (
                <SelectItem key={athlete.id} value={athlete.id}>
                  {athlete.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {!loading && analyses.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {analyses.map(analysis => (
              <div
                key={analysis.id}
                className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                onClick={() => toggleSelection(analysis.id)}
              >
                <Checkbox
                  checked={selectedIds.has(analysis.id)}
                  onCheckedChange={() => toggleSelection(analysis.id)}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{analysis.drill_name}</p>
                    <Badge variant="secondary" className="text-xs">
                      {analysis.sport_id}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(analysis.created_at).toLocaleDateString()} • Score: {analysis.score || 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && analyses.length === 0 && selectedAthleteId && (
          <p className="text-center text-muted-foreground py-8">
            No analyses found for this athlete
          </p>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {selectedIds.size} clip{selectedIds.size !== 1 ? 's' : ''} selected
          </p>
          <Button
            onClick={handleAnalyze}
            disabled={selectedIds.size === 0}
          >
            Analyze Selected Clips
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
