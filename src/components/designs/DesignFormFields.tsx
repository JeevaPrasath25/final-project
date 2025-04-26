
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
            <Select
              onValueChange={(value: DesignCategory) => {
                field.onChange(value);
                // Reset metadata when category changes
                if (value === "floorplan") {
                  form.setValue("metadata", {
                    category: "floorplan",
                    rooms: undefined,
                    squareFeet: undefined
                  });
                } else {
                  form.setValue("metadata", {
                    category: "inspiration",
                    designType: undefined
                  });
                }
              }}
              value={field.value}
            >
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

      {form.watch("category") === "floorplan" ? (
        <>
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
                    placeholder="Enter number of rooms"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
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
                    placeholder="Enter square footage"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : form.watch("category") === "inspiration" && (
        <FormField
          control={form.control}
          name="metadata.designType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Design Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
              >
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
      )}
    </div>
  );
};
