
import { useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Camera, Loader2 } from "lucide-react";

interface ProfileHeaderProps {
  profileData: any;
  profileImageUrl: string | null;
  isEditing: boolean;
  uploadingProfileImage: boolean;
  setProfileImage: (file: File | null) => void;
  setIsEditing: (value: boolean) => void;
}

const ProfileHeader = ({
  profileData,
  profileImageUrl,
  isEditing,
  uploadingProfileImage,
  setProfileImage,
  setIsEditing
}: ProfileHeaderProps) => {
  const profileImageRef = useRef<HTMLInputElement>(null);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      <div className="relative">
        <Avatar className="h-32 w-32 border-4 border-white shadow-md">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} alt={profileData?.username || 'Profile'} />
          ) : (
            <AvatarFallback className="bg-design-primary text-white text-3xl">
              {profileData?.username?.charAt(0).toUpperCase() || <User />}
            </AvatarFallback>
          )}
        </Avatar>
        {isEditing && (
          <Button
            size="icon"
            variant="outline"
            className="absolute bottom-0 right-0 rounded-full bg-white"
            onClick={() => profileImageRef.current?.click()}
            disabled={uploadingProfileImage}
          >
            {uploadingProfileImage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
            <input
              ref={profileImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfileImageChange}
              disabled={uploadingProfileImage}
            />
          </Button>
        )}
      </div>
      <div className="flex-grow">
        <div className="flex flex-wrap justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold font-playfair mb-1">
              {profileData?.username || 'Architect'}
            </h1>
            <p className="text-design-primary mb-2">Architect</p>
            {!isEditing && profileData?.bio && (
              <p className="text-muted-foreground mt-2 max-w-2xl">{profileData.bio}</p>
            )}
          </div>
          <Button
            variant={isEditing ? "outline" : "default"}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
