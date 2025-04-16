
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleEmailVerification = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        toast({
          title: "Verification failed",
          description: error.message,
          variant: "destructive"
        });
        navigate("/login");
        return;
      }

      if (data?.session) {
        toast({
          title: "Email verified",
          description: "Your email has been successfully verified."
        });
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    handleEmailVerification();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying your account...</h1>
        <p className="text-muted-foreground">Please wait while we verify your account.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
