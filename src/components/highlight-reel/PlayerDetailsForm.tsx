import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { PlayerInfo } from "@/types/reelTypes";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const playerInfoSchema = z.object({
  analysisType: z.enum(['individual', 'team']).default('individual'),
  name: z.string().trim().max(100, "Name must be less than 100 characters").optional(),
  position: z.string().trim().max(50, "Position must be less than 50 characters").optional(),
  jerseyNumber: z.string().trim().max(10, "Jersey number must be less than 10 characters").optional(),
  jerseyColor: z.string().trim().max(50, "Jersey color must be less than 50 characters").optional(),
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
      analysisType: playerInfo.analysisType || 'individual',
      name: playerInfo.name || "",
      position: playerInfo.position || "",
      jerseyNumber: playerInfo.jerseyNumber || "",
      jerseyColor: playerInfo.jerseyColor || "",
      sport: playerInfo.sport,
      analysisMode: playerInfo.analysisMode || 'bulk'
    },
    mode: "onChange"
  });

  const analysisType = form.watch('analysisType');

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
        <h3 className="text-xl font-bold">Analysis Setup</h3>
        <p className="text-sm text-muted-foreground">Configure your video analysis</p>
        
        <div className="space-y-3">
          <FormField
            control={form.control}
            name="analysisType"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Analysis Type</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="individual" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Individual Player - Track specific player performance
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="team" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Entire Video - Analyze full game/practice footage
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {analysisType === 'individual' && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player Name <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
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
                  name="jerseyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jersey # <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 23" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jerseyColor"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Jersey Color <span className="text-xs text-muted-foreground">(optional)</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Blue, Red" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Position <span className="text-xs text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., PG, SG, SF" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
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
