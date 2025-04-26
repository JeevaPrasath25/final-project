
import { useState } from "react";
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
  const [category, setCategory] = useState<DesignCategory>("inspiration");

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
                {...field} 
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
              value={field.value}
              onValueChange={(value: DesignCategory) => {
                setCategory(value);
                field.onChange(value);
                // Reset metadata when category changes
                form.setValue("metadata.rooms", undefined);
                form.setValue("metadata.squareFeet", undefined);
                form.setValue("metadata.designType", undefined);
              }}
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

      {category === "floorplan" ? (
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      ) : (
        <FormField
          control={form.control}
          name="metadata.designType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Design Type</FormLabel>
              <Select
                value={field.value}
                onValueChange={field.onChange}
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
