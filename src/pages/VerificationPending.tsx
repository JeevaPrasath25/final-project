
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const VerificationPending = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12 flex items-center justify-center">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-design-soft-purple p-4 rounded-full">
              <Mail className="h-12 w-12 text-design-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold font-playfair mb-4">Check Your Email</h1>
          <p className="text-muted-foreground mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again in a few minutes.
            </p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/login">Return to Login</Link>
            </Button>
          </div>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default VerificationPending;
