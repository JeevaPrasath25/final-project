
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Menu, 
  Search,
  Home,
  Users,
  Grid,
  Sparkles,
  LogIn
} from "lucide-react";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/contexts/AuthContext";
import { UserMenu } from "@/components/auth/UserMenu";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-design-primary font-playfair">Design<span className="text-design-dark">Nest</span></span>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-design-primary transition-colors">Home</Link>
            <Link to="/explore" className="text-foreground hover:text-design-primary transition-colors">Explore</Link>
            <Link to="/architects" className="text-foreground hover:text-design-primary transition-colors">Architects</Link>
            <Link to="/ai-generator" className="text-foreground hover:text-design-primary transition-colors">AI Generator</Link>
          </div>
        )}

        {/* Search & User Actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          {isSearchVisible && !isMobile ? (
            <div className="relative w-64 animate-fade-in">
              <Input
                type="text"
                placeholder="Search designs..."
                className="pr-8"
                autoFocus
                onBlur={() => setIsSearchVisible(false)}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchVisible(true)}
              className="hover:bg-accent hover:text-accent-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <UserMenu />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <div className="flex flex-col space-y-6 pt-8">
                  <Link to="/" className="flex items-center text-lg font-medium">
                    <Home className="mr-2 h-5 w-5" />
                    Home
                  </Link>
                  <Link to="/explore" className="flex items-center text-lg font-medium">
                    <Grid className="mr-2 h-5 w-5" />
                    Explore
                  </Link>
                  <Link to="/architects" className="flex items-center text-lg font-medium">
                    <Users className="mr-2 h-5 w-5" />
                    Architects
                  </Link>
                  <Link to="/ai-generator" className="flex items-center text-lg font-medium">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI Generator
                  </Link>
                  <div className="border-t pt-4 mt-4">
                    <div className="flex flex-col space-y-3">
                      {user ? (
                        <Button onClick={() => supabase.auth.signOut()}>Sign Out</Button>
                      ) : (
                        <>
                          <Button asChild>
                            <Link to="/login">Login</Link>
                          </Button>
                          <Button variant="outline" asChild>
                            <Link to="/signup">Sign Up</Link>
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
