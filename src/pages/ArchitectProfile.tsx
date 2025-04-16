
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, MapPin, Calendar, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ProjectGrid from "@/components/explore/ProjectGrid";

// Sample architects data
const architectsData = [
  {
    id: "elena-rodriguez",
    name: "Elena Rodriguez",
    profileImage: "https://randomuser.me/api/portraits/women/32.jpg",
    specialty: "Modern Minimalist Design",
    bio: "Award-winning architect with over 10 years of experience specializing in sustainable luxury homes that blend seamlessly with their surroundings. I believe in creating spaces that not only look beautiful but feel right for the people who inhabit them. My approach combines cutting-edge technology with timeless design principles to create homes that are both forward-thinking and comfortable.",
    location: "Barcelona, Spain",
    rating: 4.9,
    projects: 24,
    available: true,
    experience: "12 years",
    education: "Master of Architecture, University of Barcelona",
    awards: [
      "European Design Award 2022",
      "Sustainable Architecture Prize 2021",
      "Young Architect of the Year 2019"
    ],
    languages: ["English", "Spanish", "Catalan"],
    tags: ["Luxury Homes", "Sustainable", "Minimalist", "Coastal"]
  },
  {
    id: "james-wilson",
    name: "James Wilson",
    profileImage: "https://randomuser.me/api/portraits/men/45.jpg",
    specialty: "Urban Eco Architecture",
    bio: "Creating innovative urban housing solutions that incorporate green spaces and sustainable technologies for better city living. My work focuses on the intersection of dense urban environments and natural elements, finding ways to bring nature into the concrete jungle. I'm passionate about creating homes that enhance wellbeing through biophilic design principles and smart technology integration.",
    location: "Singapore",
    rating: 4.7,
    projects: 18,
    available: true,
    experience: "8 years",
    education: "Master of Architecture, National University of Singapore",
    awards: [
      "Asian Green Building Award 2023",
      "Urban Innovation Prize 2022"
    ],
    languages: ["English", "Mandarin"],
    tags: ["Eco-friendly", "Urban", "Smart Homes", "Contemporary"]
  },
  {
    id: "sophia-chang",
    name: "Sophia Chang",
    profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
    specialty: "Luxury Coastal Homes",
    bio: "Specializes in designing stunning beachfront properties that maximize ocean views while incorporating sustainable materials and resistant to coastal conditions. Having grown up near the ocean, I understand the unique challenges and opportunities of coastal design. My projects emphasize the connection between indoor and outdoor living, creating seamless transitions that extend living spaces and embrace the natural environment.",
    location: "Los Angeles, USA",
    rating: 4.8,
    projects: 31,
    available: false,
    experience: "15 years",
    education: "Master of Architecture, UCLA",
    awards: [
      "Architectural Digest Design Award 2022",
      "AIA Residential Design Award 2021",
      "Coastal Living Home of the Year 2020"
    ],
    languages: ["English", "Korean"],
    tags: ["Beachfront", "Luxury", "Contemporary", "Open Concept"]
  },
  {
    id: "marcus-jensen",
    name: "Marcus Jensen",
    profileImage: "https://randomuser.me/api/portraits/men/22.jpg",
    specialty: "Nordic Minimalism",
    bio: "Bringing Scandinavian design principles to residential architecture with a focus on functionality, light, and connection to nature. I believe that simplicity is not the absence of something, but the presence of the right things. My designs feature clean lines, natural materials, and thoughtful details that create serene, light-filled spaces that are a joy to live in.",
    location: "Copenhagen, Denmark",
    rating: 4.9,
    projects: 27,
    available: true,
    experience: "14 years",
    education: "Royal Danish Academy of Fine Arts, School of Architecture",
    awards: [
      "Nordic Design Award 2023",
      "European Prize for Architecture 2021",
      "Danish Design Award 2020"
    ],
    languages: ["English", "Danish", "Swedish", "Norwegian"],
    tags: ["Scandinavian", "Minimalist", "Wood", "Natural Light"]
  },
  {
    id: "isabella-rossi",
    name: "Isabella Rossi",
    profileImage: "https://randomuser.me/api/portraits/women/42.jpg",
    specialty: "Mediterranean Villa Design",
    bio: "Preserving the essence of Mediterranean architecture while incorporating modern amenities and sustainable practices. My designs celebrate the rich architectural heritage of the Mediterranean region while adapting it for contemporary living. I'm particularly interested in the use of local materials, passive cooling techniques, and creating indoor-outdoor living spaces that embrace the Mediterranean lifestyle.",
    location: "Santorini, Greece",
    rating: 4.6,
    projects: 22,
    available: true,
    experience: "10 years",
    education: "University of Athens, School of Architecture",
    awards: [
      "Mediterranean Architecture Prize 2022",
      "Heritage Preservation Award 2020"
    ],
    languages: ["English", "Italian", "Greek"],
    tags: ["Mediterranean", "Villa", "Traditional", "Courtyard"]
  },
  {
    id: "daniel-smith",
    name: "Daniel Smith",
    profileImage: "https://randomuser.me/api/portraits/men/52.jpg",
    specialty: "Industrial Conversions",
    bio: "Transforming industrial spaces into unique living environments that honor the original architecture while adding modern comforts. I'm passionate about adaptive reuse and giving new life to old buildings. My designs maintain the character and history of industrial structures while reimagining them as comfortable, contemporary homes. Each project is a unique exploration of how to balance preservation with innovation.",
    location: "Brooklyn, NY",
    rating: 4.7,
    projects: 19,
    available: false,
    experience: "9 years",
    education: "Pratt Institute, School of Architecture",
    awards: [
      "Adaptive Reuse Excellence Award 2023",
      "Urban Renewal Prize 2021"
    ],
    languages: ["English"],
    tags: ["Industrial", "Loft", "Conversion", "Urban"]
  }
];

// Sample projects data matching with architects
const projectsByArchitect = {
  "elena-rodriguez": [
    {
      id: 1,
      title: "Minimalist Lakeside Villa",
      description: "A serene retreat with panoramic lake views and clean lines, perfect for those seeking tranquility in nature.",
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "Elena Rodriguez",
      architectId: "elena-rodriguez",
      location: "Lake Como, Italy",
      style: "minimalist",
      rooms: 4,
      size: 3200,
      likes: 245,
      date: "2024-03-15",
      featured: true
    },
    {
      id: 7,
      title: "Glass House Pavilion",
      description: "A transparent modern home that blurs the boundary between inside and outside, featuring minimalist interiors and abundant natural light.",
      imageUrl: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "Elena Rodriguez",
      architectId: "elena-rodriguez",
      location: "Madrid, Spain",
      style: "modern",
      rooms: 3,
      size: 2600,
      likes: 198,
      date: "2023-11-05"
    }
  ],
  "james-wilson": [
    {
      id: 2,
      title: "Urban Garden House",
      description: "Sustainable living with integrated vertical gardens in the heart of a bustling metropolis.",
      imageUrl: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "James Wilson",
      architectId: "james-wilson",
      location: "Singapore",
      style: "contemporary",
      rooms: 3,
      size: 1800,
      likes: 189,
      date: "2024-02-28"
    }
  ],
  "sophia-chang": [
    {
      id: 3,
      title: "Coastal Modern Retreat",
      description: "Luxurious beachfront property with sustainable materials and panoramic ocean views.",
      imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "Sophia Chang",
      architectId: "sophia-chang",
      location: "Malibu, California",
      style: "modern",
      rooms: 5,
      size: 4200,
      likes: 310,
      date: "2024-03-05"
    }
  ],
  "marcus-jensen": [
    {
      id: 4,
      title: "Nordic Forest Cabin",
      description: "Minimalist cabin nestled among pine trees, featuring natural materials and large windows.",
      imageUrl: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "Marcus Jensen",
      architectId: "marcus-jensen",
      location: "Oslo, Norway",
      style: "scandinavian",
      rooms: 2,
      size: 1200,
      likes: 175,
      date: "2024-01-20"
    }
  ],
  "isabella-rossi": [
    {
      id: 5,
      title: "Mediterranean Courtyard Villa",
      description: "Traditional Mediterranean villa with a central courtyard and terracotta roof tiles.",
      imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "Isabella Rossi",
      architectId: "isabella-rossi",
      location: "Santorini, Greece",
      style: "mediterranean",
      rooms: 4,
      size: 2800,
      likes: 232,
      date: "2024-02-10",
      featured: true
    }
  ],
  "daniel-smith": [
    {
      id: 6,
      title: "Industrial Loft Conversion",
      description: "Former warehouse transformed into a spacious loft with original industrial elements.",
      imageUrl: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      architect: "Daniel Smith",
      architectId: "daniel-smith",
      location: "Brooklyn, NY",
      style: "industrial",
      rooms: 2,
      size: 2100,
      likes: 168,
      date: "2024-03-22"
    }
  ]
};

const ArchitectProfile = () => {
  const { id } = useParams();
  const [architect, setArchitect] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching architect data
    setIsLoading(true);
    setTimeout(() => {
      const foundArchitect = architectsData.find(a => a.id === id);
      setArchitect(foundArchitect || null);
      
      // Get projects by architect
      const architectProjects = projectsByArchitect[id as keyof typeof projectsByArchitect] || [];
      setProjects(architectProjects);
      
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleContact = () => {
    toast({
      title: "Message sent",
      description: `Your message has been sent to ${architect.name}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading architect profile...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!architect) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Architect Not Found</h2>
            <p className="mb-4">The architect profile you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/architects">Browse Architects</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          {/* Architect Header */}
          <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={architect.profileImage}
                alt={architect.name}
                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <div className="flex-grow">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h1 className="text-3xl font-bold font-playfair mb-1">{architect.name}</h1>
                    <p className="text-lg text-design-primary mb-2">{architect.specialty}</p>
                    <div className="flex items-center text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{architect.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {architect.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleContact}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact {architect.name.split(' ')[0]}
                    </Button>
                    {architect.available ? (
                      <Badge className="bg-green-500 hover:bg-green-600 self-end">
                        Available for Projects
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="self-end">
                        Currently Unavailable
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-6 mt-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 mr-1" />
                    <span className="font-medium">{architect.rating}</span>
                    <span className="text-muted-foreground text-sm ml-1">Rating</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-design-primary mr-1" />
                    <span className="font-medium">{architect.projects}</span>
                    <span className="text-muted-foreground text-sm ml-1">Projects</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-design-primary mr-1" />
                    <span className="font-medium">{architect.experience}</span>
                    <span className="text-muted-foreground text-sm ml-1">Experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Content */}
          <Tabs defaultValue="about" className="space-y-8">
            <TabsList className="mb-6">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="credentials">Credentials</TabsTrigger>
            </TabsList>
            
            <TabsContent value="about" className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4 font-playfair">About {architect.name}</h2>
                <p className="text-muted-foreground">{architect.bio}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="projects">
              <h2 className="text-2xl font-semibold mb-6 font-playfair">Projects by {architect.name}</h2>
              {projects.length > 0 ? (
                <ProjectGrid projects={projects} />
              ) : (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <p className="text-muted-foreground">No projects available at this time.</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="credentials" className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-6 font-playfair">Credentials</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Education</h3>
                  <p className="text-muted-foreground">{architect.education}</p>
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-3">Awards & Recognition</h3>
                  <ul className="space-y-2">
                    {architect.awards.map((award: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-design-primary mr-2"></div>
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {architect.languages.map((language: string, index: number) => (
                      <Badge key={index} variant="secondary">{language}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ArchitectProfile;
