
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface HomeownerProfileFormProps {
  profileData: any;
  onSubmit: (values: any) => Promise<boolean>;
  isLoading: boolean;
  onFileChange: (file: File | null) => void;
}

const HomeownerProfileForm = ({
  profileData,
  onSubmit,
  isLoading,
  onFileChange,
}: HomeownerProfileFormProps) => {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      username: profileData?.username || "",
      bio: profileData?.bio || "",
      contact_number: profileData?.contact_details || "",
      location: profileData?.location || "",
      preferences: profileData?.preferences || "",
      project_type: profileData?.project_type || "",
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    onFileChange(file);
  };

  const projectTypes = [
    "New Home Construction",
    "Home Renovation",
    "Room Addition",
    "Kitchen Remodel",
    "Bathroom Remodel",
    "Outdoor Space",
    "Commercial Space",
    "Other"
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="profile-image">Profile Image</Label>
          <div className="mt-1 flex items-center">
            <div className="relative">
              <img
                src={profileData?.avatar_url || "/placeholder.svg"}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
              <label
                htmlFor="profile-image-upload"
                className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <input
                  id="profile-image-upload"
                  name="profile-image-upload"
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <span className="ml-4 text-sm text-muted-foreground">
              {profileImage ? profileImage.name : "Upload a new image"}
            </span>
          </div>
        </div>

        <div>
          <Label htmlFor="username">Name</Label>
          <Input
            id="username"
            {...register("username", { required: "Name is required" })}
            placeholder="Your full name"
          />
          {errors.username && (
            <p className="text-sm text-red-500">{errors.username.message as React.ReactNode}</p>
          )}
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            {...register("bio")}
            placeholder="Tell us about yourself and your vision"
            className="h-24"
          />
        </div>

        <div>
          <Label htmlFor="contact_number">Contact Number</Label>
          <Input
            id="contact_number"
            {...register("contact_number")}
            placeholder="Your phone number"
          />
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...register("location")}
            placeholder="Your city or region"
          />
        </div>

        <div>
          <Label htmlFor="project_type">Project Type</Label>
          <Select defaultValue={profileData?.project_type || ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="hidden"
            {...register("project_type")}
            id="project_type"
          />
        </div>

        <div>
          <Label htmlFor="preferences">Design Preferences</Label>
          <Textarea
            id="preferences"
            {...register("preferences")}
            placeholder="Describe your design style and preferences"
            className="h-24"
          />
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
};

export default HomeownerProfileForm;
