
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate(`/architect-profile`);
    } else {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "You need to be logged in to view your profile",
      });
      navigate("/login");
    }
  }, [user, navigate, toast]);

  return null;
};

export default MyProfile;
