
import { AnalysisResponse } from '../analysisTypes';
import { buildAnalysisResponse } from '../analysisHelpers';

export const generateGenericBasketballAnalysis = (drillName: string, score: number): AnalysisResponse => {
  return buildAnalysisResponse(drillName, score, [
    {
      name: "Shot Form",
      value: Math.floor(score * 0.9 + Math.random() * 10),
      target: 95,
      unit: "%"
    },
    {
      name: "Balance",
      value: Math.floor(score * 0.85 + Math.random() * 15),
      target: 90,
      unit: "%"
    },
    {
      name: "Follow Through",
      value: Math.floor(score * 0.95 + Math.random() * 5),
      target: 100,
      unit: "%"
    },
    {
      name: "Footwork",
      value: Math.floor(score * 0.8 + Math.random() * 20),
      target: 95,
      unit: "%"
    }
  ], {
    good: [
      "Good general basketball mechanics",
      "Proper athletic stance",
      "Consistent rhythm in movement"
    ],
    improve: [
      "Focus on smoother transitions between movements",
      "Try to keep your eyes up while performing the drill",
      "Work on maintaining proper technique even when fatigued"
    ]
  }, [
    "Work on fundamentals daily",
    "Record your practice sessions to identify patterns",
    "Focus on quality of repetitions over quantity",
    "Practice at game speed"
  ]);
};
