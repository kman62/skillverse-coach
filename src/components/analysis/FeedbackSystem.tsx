
import React, { useState } from 'react';
import { StarIcon, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface FeedbackSystemProps {
  analysisId?: string;
  sportId: string;
  drillId: string;
  score: number;
}

const FeedbackSystem = ({ analysisId, sportId, drillId, score }: FeedbackSystemProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleRatingClick = (selectedRating: number) => {
    setRating(selectedRating);
    setShowFeedbackForm(true);
  };

  const handleSubmitFeedback = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit feedback",
        variant: "destructive"
      });
      return;
    }

    if (rating === null) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit feedback to Supabase using RPC function
      const { error } = await supabase.rpc('insert_analysis_feedback', {
        p_user_id: user.id,
        p_analysis_id: analysisId || null,
        p_sport_id: sportId,
        p_drill_id: drillId,
        p_rating: rating,
        p_comments: feedback,
        p_original_score: score
      });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our analysis system."
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Feedback submission failed",
        description: "There was an error submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
        <ThumbsUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
        <h4 className="font-medium text-green-800">Feedback Submitted</h4>
        <p className="text-sm text-green-600">Thank you for helping us improve!</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg p-5 bg-card">
      <h3 className="text-lg font-semibold mb-3">How accurate was this analysis?</h3>
      
      {!showFeedbackForm ? (
        <div className="flex justify-center space-x-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => handleRatingClick(star)}
              aria-label={`Rate ${star} stars`}
            >
              <StarIcon 
                className={`h-8 w-8 ${rating && star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center space-x-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className="focus:outline-none"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} stars`}
              >
                <StarIcon 
                  className={`h-6 w-6 ${rating && star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              </button>
            ))}
          </div>
          
          <div>
            <Textarea
              placeholder="Tell us what could be improved..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="w-1/2"
              onClick={() => setShowFeedbackForm(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              className="w-1/2"
              onClick={handleSubmitFeedback}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackSystem;
