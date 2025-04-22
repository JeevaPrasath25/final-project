
import { Building2, MapPin, Award, Calendar, Mail } from "lucide-react";

interface ArchitectInfoProps {
  profileData: any;
  user: any;
}

const ArchitectInfo = ({ profileData, user }: ArchitectInfoProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user?.email}</p>
        </div>
        {profileData?.contact_details && (
          <div>
            <p className="text-sm text-muted-foreground">Contact Number</p>
            <p className="font-medium">{profileData.contact_details}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <h3 className="text-lg font-semibold mb-3">Professional Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {profileData?.experience && (
            <div className="flex items-start gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{profileData.experience}</p>
              </div>
            </div>
          )}
          {profileData?.skills && (
            <div className="flex items-start gap-2">
              <Award className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="font-medium">{profileData.skills}</p>
              </div>
            </div>
          )}
          {profileData?.education && (
            <div className="flex items-start gap-2">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Education</p>
                <p className="font-medium">{profileData.education}</p>
              </div>
            </div>
          )}
          {profileData?.social_links && (
            <div className="flex items-start gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{profileData.social_links}</p>
              </div>
            </div>
          )}
        </div>
        
        {profileData?.contact_email && (
          <div className="mt-4 flex items-start gap-2">
            <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Business Email</p>
              <p className="font-medium">{profileData.contact_email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchitectInfo;
