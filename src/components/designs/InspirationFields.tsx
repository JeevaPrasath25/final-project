
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { DesignFormData, DESIGN_TYPES } from "@/types/design";

interface InspirationFieldsProps {
  form: UseFormReturn<any>;
}

export const InspirationFields = ({ form }: InspirationFieldsProps) => {
  return (
    <FormField
      control={form.control}
      name="metadata.designType"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Design Type</FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a design type" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {DESIGN_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
