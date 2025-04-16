
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// This is a simple redirect component to take users to their profile page
const MyProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate(`/architect-profile`);
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return null;
};

export default MyProfile;
