
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, MessageSquare, Calendar, MapPin, Home, Grid3X3, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample projects data
const allProjects = [
  {
    id: 1,
    title: "Minimalist Lakeside Villa",
    description: "A serene retreat with panoramic lake views and clean lines, perfect for those seeking tranquility in nature. This contemporary villa features floor-to-ceiling windows that frame the breathtaking lake views, creating a seamless connection between indoor and outdoor spaces. The open floor plan encourages natural light to flood the interiors, while minimalist furnishings and a neutral color palette maintain a calm atmosphere.",
    imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1616137422495-1e9e46e2aa77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2532&q=80",
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
    ],
    architect: "Elena Rodriguez",
    architectId: "elena-rodriguez",
    architectImage: "https://randomuser.me/api/portraits/women/32.jpg",
    location: "Lake Como, Italy",
    style: "minimalist",
    rooms: 4,
    size: 3200,
    bedrooms: 3,
    bathrooms: 2.5,
    likes: 245,
    date: "2024-03-15",
    featured: true,
    details: {
      constructionYear: 2023,
      budget: "$1.2M - $1.5M",
      materials: ["Concrete", "Glass", "Wood", "Steel"],
      sustainability: ["Solar Panels", "Rainwater Collection", "Energy-Efficient Appliances"],
      features: ["Infinity Pool", "Home Automation", "Outdoor Kitchen", "Fire Pit"]
    }
  },
  {
    id: 2,
    title: "Urban Garden House",
    description: "Sustainable living with integrated vertical gardens in the heart of a bustling metropolis. This innovative urban residence showcases how nature and architecture can coexist harmoniously in dense city environments. The facade features a living wall system that helps purify the air and regulate temperature, while providing a striking visual element. Inside, the home is designed around a central atrium garden that brings natural light to all levels.",
    imageUrl: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    architect: "James Wilson",
    architectId: "james-wilson",
    architectImage: "https://randomuser.me/api/portraits/men/45.jpg",
    location: "Singapore",
    style: "contemporary",
    rooms: 3,
    size: 1800,
    bedrooms: 2,
    bathrooms: 2,
    likes: 189,
    date: "2024-02-28",
    details: {
      constructionYear: 2022,
      budget: "$800K - $1M",
      materials: ["Recycled Materials", "Glass", "Sustainable Wood"],
      sustainability: ["Vertical Gardens", "Greywater System", "Natural Ventilation"],
      features: ["Rooftop Garden", "Hydroponic System", "Butterfly Roof", "Smart Home Technology"]
    }
  },
  {
    id: 3,
    title: "Coastal Modern Retreat",
    description: "Luxurious beachfront property with sustainable materials and panoramic ocean views. This coastal home is designed to withstand harsh marine conditions while providing a luxurious retreat for its owners. The architecture emphasizes horizontal lines that complement the horizon, with expansive terraces that maximize outdoor living space. Hurricane-resistant windows frame stunning ocean views, while sustainable materials like reclaimed wood and local stone ground the design in its environment.",
    imageUrl: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    architect: "Sophia Chang",
    architectId: "sophia-chang",
    architectImage: "https://randomuser.me/api/portraits/women/68.jpg",
    location: "Malibu, California",
    style: "modern",
    rooms: 5,
    size: 4200,
    bedrooms: 4,
    bathrooms: 3.5,
    likes: 310,
    date: "2024-03-05",
    details: {
      constructionYear: 2023,
      budget: "$2.5M - $3M",
      materials: ["Reclaimed Wood", "Concrete", "Local Stone", "Glass"],
      sustainability: ["Passive Solar Design", "Geothermal Heating", "Native Landscaping"],
      features: ["Infinity Pool", "Outdoor Shower", "Wine Cellar", "Home Theater"]
    }
  },
  {
    id: 4,
    title: "Nordic Forest Cabin",
    description: "Minimalist cabin nestled among pine trees, featuring natural materials and large windows. This intimate retreat embraces the Nordic principle of 'hygge' with its warm, comfortable interiors and strong connection to nature. The cabin's simple form is clad in vertical timber that will weather naturally over time. Inside, a double-height living space with a wood-burning stove forms the heart of the home, while carefully placed windows frame specific forest views like living paintings.",
    imageUrl: "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1607582544056-04c47e2c3485?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2046&q=80",
      "https://images.unsplash.com/photo-1580237541049-2d715a09486e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80"
    ],
    architect: "Marcus Jensen",
    architectId: "marcus-jensen",
    architectImage: "https://randomuser.me/api/portraits/men/22.jpg",
    location: "Oslo, Norway",
    style: "scandinavian",
    rooms: 2,
    size: 1200,
    bedrooms: 1,
    bathrooms: 1,
    likes: 175,
    date: "2024-01-20",
    details: {
      constructionYear: 2022,
      budget: "$350K - $450K",
      materials: ["Pine", "Birch", "Glass", "Stone"],
      sustainability: ["Super Insulation", "Wood Heating", "Minimal Site Impact"],
      features: ["Sauna", "Outdoor Hot Tub", "Loft Space", "Hiking Trails Access"]
    }
  },
  {
    id: 5,
    title: "Mediterranean Courtyard Villa",
    description: "Traditional Mediterranean villa with a central courtyard and terracotta roof tiles. This villa reinterprets classic Mediterranean architecture for modern living, centered around a generous courtyard that provides natural cooling and a private outdoor sanctuary. Arched doorways and windows soften the building's lines, while hand-painted tiles add character and color. The house is organized to follow the sun's path, with morning rooms facing east and gathering spaces capturing the warm evening light.",
    imageUrl: "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2075&q=80"
    ],
    architect: "Isabella Rossi",
    architectId: "isabella-rossi",
    architectImage: "https://randomuser.me/api/portraits/women/42.jpg",
    location: "Santorini, Greece",
    style: "mediterranean",
    rooms: 4,
    size: 2800,
    bedrooms: 3,
    bathrooms: 2,
    likes: 232,
    date: "2024-02-10",
    featured: true,
    details: {
      constructionYear: 2023,
      budget: "$900K - $1.2M",
      materials: ["Stucco", "Terracotta", "Natural Stone", "Ceramic Tiles"],
      sustainability: ["Thermal Mass", "Natural Cooling", "Rainwater Cistern"],
      features: ["Olive Grove", "Outdoor Kitchen", "Wine Cellar", "Plunge Pool"]
    }
  },
  {
    id: 6,
    title: "Industrial Loft Conversion",
    description: "Former warehouse transformed into a spacious loft with original industrial elements. This adaptive reuse project preserves the raw character of an early 20th-century warehouse while creating a comfortable contemporary home. Original features like exposed brick walls, timber beams, and steel columns are complemented by new elements that continue the industrial aesthetic. The open plan maximizes flexibility, with sliding panels and modular furniture allowing the space to be reconfigured as needed.",
    imageUrl: "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
    images: [
      "https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1604709177225-055f99402ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1605283176339-7b169abc8382?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
    ],
    architect: "Daniel Smith",
    architectId: "daniel-smith",
    architectImage: "https://randomuser.me/api/portraits/men/52.jpg",
    location: "Brooklyn, NY",
    style: "industrial",
    rooms: 2,
    size: 2100,
    bedrooms: 1,
    bathrooms: 1.5,
    likes: 168,
    date: "2024-03-22",
    details: {
      constructionYear: 2021,
      budget: "$750K - $900K",
      materials: ["Exposed Brick", "Steel", "Reclaimed Wood", "Concrete"],
      sustainability: ["Repurposed Structure", "Energy-Efficient Windows", "Smart Heating"],
      features: ["16-foot Ceilings", "Mezzanine Level", "Freight Elevator", "Roof Access"]
    }
  }
];

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching project data
    setIsLoading(true);
    setTimeout(() => {
      const foundProject = allProjects.find(p => p.id.toString() === id);
      setProject(foundProject || null);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast({
      description: isLiked ? "Removed from favorites" : "Added to favorites",
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share modal or use the Web Share API
    toast({
      description: "Share link copied to clipboard",
    });
  };

  const handleContact = () => {
    toast({
      title: "Contact request sent",
      description: `Your message has been sent to ${project.architect}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse">Loading project details...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
            <p className="mb-4">The project you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/explore">Browse Projects</a>
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
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold font-playfair">{project.title}</h1>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleLike}>
                  <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-design-primary text-design-primary" : ""}`} />
                  {isLiked ? "Saved" : "Save"}
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <Badge variant="outline">{project.style}</Badge>
              <Badge variant="outline">{project.rooms} Rooms</Badge>
              <Badge variant="outline">{project.size} sq ft</Badge>
              {project.featured && (
                <Badge className="bg-design-primary hover:bg-design-primary/90">Featured</Badge>
              )}
            </div>
            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="mr-4">{project.location}</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span>{new Date(project.date).toLocaleDateString()}</span>
            </div>
          </div>

          {/* Project Images */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 h-[400px] md:h-[500px] overflow-hidden rounded-lg">
              <img
                src={project.images[activeImage]}
                alt={project.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {project.images.map((img: string, index: number) => (
                <div
                  key={index}
                  className={`h-[150px] overflow-hidden rounded-lg cursor-pointer border-2 transition-all ${
                    activeImage === index ? "border-design-primary" : "border-transparent"
                  }`}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={img}
                    alt={`${project.title} - view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 font-playfair">About This Project</h2>
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 font-playfair">Property Details</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Style</span>
                        <span className="font-medium capitalize">{project.style}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Size</span>
                        <span className="font-medium">{project.size} sq ft</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Bedrooms</span>
                        <span className="font-medium">{project.bedrooms}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Bathrooms</span>
                        <span className="font-medium">{project.bathrooms}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Year Built</span>
                        <span className="font-medium">{project.details.constructionYear}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-sm">Budget Range</span>
                        <span className="font-medium">{project.details.budget}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 font-playfair">Materials Used</h2>
                    <div className="flex flex-wrap gap-2">
                      {project.details.materials.map((material: string, index: number) => (
                        <Badge key={index} variant="secondary">{material}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="features" className="space-y-6">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 font-playfair">Key Features</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {project.details.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-design-primary mr-2"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 font-playfair">Sustainability</h2>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {project.details.sustainability.map((item: string, index: number) => (
                        <li key={index} className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Architect Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 font-playfair">About the Architect</h2>
                <div className="flex items-center mb-4">
                  <img
                    src={project.architectImage}
                    alt={project.architect}
                    className="h-16 w-16 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-lg">{project.architect}</h3>
                    <p className="text-muted-foreground text-sm">{project.location}</p>
                  </div>
                </div>
                <Button className="w-full mb-3" onClick={handleContact}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Architect
                </Button>
                <Button variant="outline" className="w-full" asChild>
                  <a href={`/architect/${project.architectId}`}>
                    View Profile
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 font-playfair">Property Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-design-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Bedrooms</h4>
                      <p className="text-muted-foreground">{project.bedrooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Grid3X3 className="h-5 w-5 text-design-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Size</h4>
                      <p className="text-muted-foreground">{project.size} sq ft</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-design-primary mr-3" />
                    <div>
                      <h4 className="font-medium">Bathrooms</h4>
                      <p className="text-muted-foreground">{project.bathrooms}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
