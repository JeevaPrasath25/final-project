
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Bookmark, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ChatDialog } from "@/components/chat/ChatDialog";

interface ArchitectCardProps {
  architect: {
    id: string;
    username: string;
    bio: string | null;
    avatar_url: string | null;
    experience: string | null;
    skills: string | null;
    social_links: string | null;
  };
}

const ArchitectCard = ({ architect }: ArchitectCardProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const { user } = useAuth();
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={architect.avatar_url || undefined} alt={architect.username} />
              <AvatarFallback className="bg-primary text-white text-lg">
                {getInitial(architect.username)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{architect.username}</h3>
              {architect.skills && (
                <p className="text-sm text-primary">{architect.skills}</p>
              )}
            </div>
          </div>
          
          {architect.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{architect.bio}</p>
          )}
          
          <div className="flex flex-wrap gap-2 mb-4">
            {architect.experience && (
              <Badge variant="outline">{architect.experience}</Badge>
            )}
            {architect.social_links && (
              <Badge variant="outline">{architect.social_links}</Badge>
            )}
          </div>
          
          <div className="flex justify-between">
            <Button asChild variant="default" size="sm">
              <Link to={`/architect/${architect.id}`}>View Profile</Link>
            </Button>
            {user && user.id !== architect.id && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsChatOpen(true)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        architect={architect}
      />
    </>
  );
};

export default ArchitectCard;
