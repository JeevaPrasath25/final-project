
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const MyProfile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Only redirect after auth has finished loading
    if (!authLoading) {
      if (user) {
        // Longer delay to allow profile data to be created if needed
        setTimeout(() => {
          navigate(`/architect-profile`);
        }, 500);
      } else {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to view your profile",
        });
        navigate("/login");
      }
    }
  }, [user, authLoading, navigate, toast]);

  return (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-2 text-muted-foreground">Redirecting to profile...</span>
    </div>
  );
};

export default MyProfile;
