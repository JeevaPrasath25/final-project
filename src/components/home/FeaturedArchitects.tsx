
import { SectionHeading } from "@/components/ui/section-heading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

// Sample architects data
const featuredArchitects = [
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    specialty: "Modern Minimalist Design",
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
    bio: "Award-winning architect with a focus on sustainable luxury homes.",
    projects: 24,
    location: "Barcelona, Spain"
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    specialty: "Urban Eco Architecture",
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    bio: "Specializes in eco-friendly urban housing solutions and green spaces.",
    projects: 18,
    location: "Singapore"
  },
  {
    id: "sophia-chang",
    name: "Sophia Chang",
    specialty: "Luxury Coastal Homes",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    bio: "Creating stunning beachfront properties with sustainable materials.",
    projects: 31,
    location: "Los Angeles, USA"
  },
  {
    id: "marcus-jensen",
    name: "Marcus Jensen",
    specialty: "Nordic Minimalism",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    bio: "Blending functionality with aesthetic minimalism in residential designs.",
    projects: 27,
    location: "Copenhagen, Denmark"
  },
];

const FeaturedArchitects = () => {
  return (
    <section className="py-16 bg-design-soft-purple/30">
      <div className="container mx-auto">
        <SectionHeading
          title="Our Top Architects"
          subtitle="Connect with talented architects ready to bring your vision to life"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredArchitects.map((architect) => (
            <div key={architect.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col items-center">
                <Avatar className="h-20 w-20 mb-3">
                  <AvatarImage src={architect.profileImage} alt={architect.name} />
                  <AvatarFallback>{architect.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-1">{architect.name}</h3>
                <p className="text-design-primary text-sm mb-3">{architect.specialty}</p>
                <p className="text-muted-foreground text-sm text-center mb-4">{architect.bio}</p>
                <div className="flex justify-between w-full text-sm mb-4">
                  <span className="text-muted-foreground">{architect.location}</span>
                  <span className="font-medium">{architect.projects} Projects</span>
                </div>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/architect/${architect.id}`}>View Profile</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button asChild>
            <Link to="/architects" className="inline-flex items-center">
              Browse all architects
              <ChevronRightIcon className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArchitects;
