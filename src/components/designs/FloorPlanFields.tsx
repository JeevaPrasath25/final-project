
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { DesignFormData } from "@/types/design";

interface FloorPlanFieldsProps {
  form: UseFormReturn<DesignFormData>;
}

export const FloorPlanFields = ({ form }: FloorPlanFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="metadata.rooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Rooms</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={1}
                max={20}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="metadata.squareFeet"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Square Feet</FormLabel>
            <FormControl>
              <Input
                type="number"
                min={100}
                max={20000}
                {...field}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
