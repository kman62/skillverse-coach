import { Card } from "@/components/ui/card";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface IntangiblesRadarChartProps {
  data: {
    courage: number;
    composure: number;
    initiative: number;
    leadership: number;
    effectiveness_under_stress: number;
    discipline?: number;
    focus?: number;
    consistency?: number;
    game_iq?: number;
  };
}

export const IntangiblesRadarChart = ({ data }: IntangiblesRadarChartProps) => {
  if (!data) {
    return null;
  }

  const chartData = [
    { metric: "Courage", value: data.courage * 100 },
    { metric: "Composure", value: data.composure * 100 },
    { metric: "Initiative", value: data.initiative * 100 },
    { metric: "Leadership", value: data.leadership * 100 },
    { metric: "Effectiveness", value: data.effectiveness_under_stress * 100 },
    ...(data.discipline !== undefined ? [{ metric: "Discipline", value: data.discipline * 100 }] : []),
    ...(data.focus !== undefined ? [{ metric: "Focus", value: data.focus * 100 }] : []),
    ...(data.consistency !== undefined ? [{ metric: "Consistency", value: data.consistency * 100 }] : []),
    ...(data.game_iq !== undefined ? [{ metric: "Game IQ", value: data.game_iq * 100 }] : []),
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4">Intangible Performance Profile</h3>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="metric" 
            tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </Card>
  );
};
