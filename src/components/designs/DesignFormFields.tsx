
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import { DesignCategory, DesignType, DESIGN_TYPES } from "@/types/design";

interface DesignFormFieldsProps {
  form: UseFormReturn<any>;
  designTitle: string;
  setDesignTitle: (title: string) => void;
}

export const DesignFormFields = ({
  form,
  designTitle,
  setDesignTitle,
}: DesignFormFieldsProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Design Title</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter a title for your design" 
                value={designTitle}
                onChange={(e) => {
                  setDesignTitle(e.target.value);
                  field.onChange(e);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="floorplan">Floor Plan</SelectItem>
                <SelectItem value="inspiration">Design Inspiration</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
