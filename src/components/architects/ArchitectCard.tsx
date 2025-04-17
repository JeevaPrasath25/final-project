
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Bookmark, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { ArchitectDisplayData } from "@/pages/Architects";

const ArchitectCard = ({ architect }: { architect: ArchitectDisplayData }) => {
  // Get first letter of name for avatar fallback
  const nameInitial = architect.name ? architect.name.charAt(0).toUpperCase() : 'A';

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Profile section */}
        <div className="p-6 flex flex-col items-center md:items-start md:w-1/3 border-b md:border-b-0 md:border-r">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={architect.profileImage} alt={architect.name} />
            <AvatarFallback>{nameInitial}</AvatarFallback>
          </Avatar>

          <h3 className="text-xl font-semibold mb-1 text-center md:text-left">{architect.name}</h3>
          
          <div className="flex items-center mb-2">
            <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-sm text-muted-foreground">{architect.location}</span>
          </div>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-3">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              <span className="text-sm font-medium">{architect.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">{architect.projects} Projects</span>
          </div>
          
          {architect.available ? (
            <Badge className="bg-green-500 hover:bg-green-600">Available for Hire</Badge>
          ) : (
            <Badge variant="outline">Currently Booked</Badge>
          )}
        </div>

        {/* Info section */}
        <div className="p-6 md:w-2/3">
          <h4 className="font-medium text-design-primary mb-2">{architect.specialty}</h4>
          
          <p className="text-muted-foreground mb-4 text-sm">{architect.bio}</p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {architect.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to={`/architect/${architect.id}`}>View Profile</Link>
            </Button>
            
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
            
            <Button variant="ghost" size="icon">
              <Bookmark className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ArchitectCard;
