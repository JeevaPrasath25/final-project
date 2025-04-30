
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MessageSquare, Building2, MapPin, Award, Calendar, Mail, ArrowLeft } from "lucide-react";
import ArchitectInfo from "@/components/architect/ArchitectInfo";
import Layout from "@/components/layout/Layout";
import DesignGrid from "@/components/designs/DesignGrid";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Design, DesignMetadata } from "@/types/design";
import { useToast } from "@/hooks/use-toast";

const ArchitectProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [architect, setArchitect] = useState<any>(null);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchArchitectProfile = async () => {
      try {
        setLoading(true);
        if (!id) return;

        // Fetch architect profile
        const { data: architectData, error: architectError } = await supabase
          .from('users')
          .select('*')
          .eq('id', id)
          .eq('role', 'architect')
          .single();

        if (architectError) throw architectError;
        if (!architectData) throw new Error("Architect not found");

        setArchitect(architectData);

        // Fetch designs
        const { data: designsData, error: designsError } = await supabase
          .from('posts')
          .select(`
            id,
            title,
            image_url,
            design_type,
            created_at,
            description,
            tags,
            user_id,
            metadata
          `)
          .eq('user_id', id)
          .order('created_at', { ascending: false });

        if (designsError) throw designsError;

        // Format the designs data
        const formattedDesigns: Design[] = designsData.map((design) => {
          const metadata = design.metadata as DesignMetadata || {};
          const designType = typeof metadata === 'object' && metadata ? metadata.designType : undefined;
          
          return {
            id: design.id,
            title: design.title,
            image_url: design.image_url,
            created_at: design.created_at,
            user_id: design.user_id,
            architect_id: id,
            architect_name: architectData.username,
            metadata: metadata,
            style: designType || design.design_type,
            tags: design.tags || [],
            description: design.description
          };
        });

        setDesigns(formattedDesigns);

        // Check if user is following this architect
        if (user) {
          const { data: followData, error: followError } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', user.id)
            .eq('following_id', id)
            .maybeSingle();

          if (!followError && followData) {
            setIsFollowing(true);
          }
        }
      } catch (error) {
        console.error("Error fetching architect profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load architect profile. Please try again."
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArchitectProfile();
  }, [id, user, toast]);

  const handleToggleFollow = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to follow architects",
        variant: "default"
      });
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', id);

        if (error) throw error;
        setIsFollowing(false);
        toast({ description: `You are no longer following ${architect.username}` });
      } else {
        // Follow
        const { error } = await supabase
          .from('follows')
          .insert([
            {
              follower_id: user.id,
              following_id: id
            }
          ]);

        if (error) throw error;
        setIsFollowing(true);
        toast({ description: `You are now following ${architect.username}` });
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status. Please try again."
      });
    }
  };

  const handleLikeDesign = (designId: string, liked: boolean) => {
    // Implementation for liking designs would go here
    toast({
      description: liked ? "Removed from liked designs" : "Added to liked designs",
    });
  };

  const handleSaveDesign = (designId: string, saved: boolean) => {
    // Implementation for saving designs would go here
    toast({
      description: saved ? "Removed from saved designs" : "Added to saved designs",
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-12 flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!architect) {
    return (
      <Layout>
        <div className="container mx-auto py-12">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Architect Not Found</h1>
            <p className="text-muted-foreground mb-6">The architect you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <Link to="/architects">Back to Architects</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-12">
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/architects">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Architects
          </Link>
        </Button>

        <Card className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="md:w-1/4 flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 mb-4">
                <AvatarImage src={architect?.avatar_url || undefined} alt={architect?.username} />
                <AvatarFallback className="text-3xl">
                  {architect?.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-2xl font-semibold mb-1">{architect?.username}</h1>
              {architect?.skills && (
                <p className="text-primary mb-4">{architect.skills}</p>
              )}
              
              <div className="flex space-x-2 mt-4 w-full">
                {user && user.id !== architect?.id && (
                  <>
                    <Button 
                      variant={isFollowing ? "outline" : "default"}
                      className="flex-1"
                      onClick={handleToggleFollow}
                    >
                      {isFollowing ? "Following" : "Follow"}
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsChatOpen(true)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {(!user || (user && user.id === architect?.id)) && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    asChild
                  >
                    <Link to={user ? "/my-profile" : "/login"}>
                      {user ? "Edit Profile" : "Log in to Contact"}
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            <div className="md:w-3/4">
              {architect?.bio && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">About</h2>
                  <p className="text-muted-foreground">{architect.bio}</p>
                </div>
              )}
              
              <ArchitectInfo profileData={architect} user={architect} />
            </div>
          </div>
        </Card>

        <div className="mt-10">
          <Tabs defaultValue="designs">
            <TabsList>
              <TabsTrigger value="designs">Designs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="designs" className="mt-6">
              {designs.length > 0 ? (
                <DesignGrid 
                  designs={designs} 
                  onLike={handleLikeDesign}
                  onSave={handleSaveDesign}
                  onUploadClick={() => {}}
                  showDetails={true}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                  <h3 className="text-xl font-medium mb-2">No designs yet</h3>
                  <p className="text-muted-foreground">
                    This architect hasn't uploaded any designs yet.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {architect && (
        <ChatDialog 
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          architect={architect}
        />
      )}
    </Layout>
  );
};

export default ArchitectProfile;
