
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { Slider } from "@/components/ui/slider";

interface FloorPlanFieldsProps {
  form: UseFormReturn<any>;
}

export const FloorPlanFields = ({ form }: FloorPlanFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="metadata.rooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Rooms</FormLabel>
            <Select 
              onValueChange={(value) => field.onChange(Number(value))} 
              value={field.value?.toString() || "1"}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of rooms" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1">1 Room</SelectItem>
                <SelectItem value="2">2 Rooms</SelectItem>
                <SelectItem value="3">3 Rooms</SelectItem>
                <SelectItem value="4">4 Rooms</SelectItem>
                <SelectItem value="5">5+ Rooms</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.squareFeet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Square Feet: {field.value || 1000}</FormLabel>
            <FormControl>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  min={100}
                  max={20000}
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground whitespace-nowrap">sq ft</span>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
