import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlayerInfo } from "@/types/reelTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const playerInfoSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  position: z.string().trim().max(50, "Position must be less than 50 characters").optional(),
  jerseyNumber: z.string().trim().min(1, "Jersey number is required").max(10, "Jersey number must be less than 10 characters"),
  sport: z.enum(['basketball', 'baseball', 'football', 'soccer', 'volleyball', 'tennis', 'golf', 'rugby'], {
    required_error: "Please select a sport"
  }),
  analysisMode: z.enum(['bulk', 'detailed']).optional()
});

type PlayerInfoForm = z.infer<typeof playerInfoSchema>;

interface PlayerDetailsFormProps {
  playerInfo: PlayerInfo;
  onPlayerInfoChange: (info: PlayerInfo) => void;
  onStartAnalysis: () => void;
}

export const PlayerDetailsForm = ({ playerInfo, onPlayerInfoChange, onStartAnalysis }: PlayerDetailsFormProps) => {
  const form = useForm<PlayerInfoForm>({
    resolver: zodResolver(playerInfoSchema),
    defaultValues: {
      name: playerInfo.name || "",
      position: playerInfo.position || "",
      jerseyNumber: playerInfo.jerseyNumber || "",
      sport: playerInfo.sport,
      analysisMode: playerInfo.analysisMode || 'bulk'
    },
    mode: "onChange"
  });

  const onSubmit = (data: PlayerInfoForm) => {
    onPlayerInfoChange(data as PlayerInfo);
    onStartAnalysis();
  };

  const sportOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'baseball', label: 'Baseball' },
    { value: 'football', label: 'Football' },
    { value: 'soccer', label: 'Soccer' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'golf', label: 'Golf' },
    { value: 'rugby', label: 'Rugby' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card/50 rounded-lg border p-6 space-y-4">
        <h3 className="text-xl font-bold">Player Information</h3>
        <p className="text-sm text-muted-foreground">Enter player details before starting analysis</p>
        
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="sport"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sport</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select sport" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {sportOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="analysisMode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Analysis Mode</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select analysis mode" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="bulk">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Bulk Analysis (Flash)</span>
                        <span className="text-xs text-muted-foreground">Faster, cost-effective for multiple clips</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="detailed">
                      <div className="flex flex-col items-start">
                        <span className="font-medium">Detailed Analysis (GPT-5)</span>
                        <span className="text-xs text-muted-foreground">Higher quality, best for single clips</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Player Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., John Smith" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Position <span className="text-xs text-muted-foreground">(auto-detects during analysis)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., PG, SG, SF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jerseyNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Jersey #</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 23" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button 
          type="submit"
          disabled={!form.formState.isValid}
          className="w-full"
          size="lg"
        >
          Start AI Analysis
        </Button>
      </form>
    </Form>
  );
};
