
import { SectionHeading } from "@/components/ui/section-heading";
import { Search, UserCheck, Home, PencilRuler } from "lucide-react";

const steps = [
  {
    title: "Explore Designs",
    description: "Browse through our curated collection of architectural designs and find inspiration for your dream home.",
    icon: Search,
    color: "bg-design-soft-blue"
  },
  {
    title: "Connect with Architects",
    description: "Find the perfect architect for your project and connect directly through our platform.",
    icon: UserCheck,
    color: "bg-design-soft-green"
  },
  {
    title: "Create with AI",
    description: "Use our AI generator to visualize your ideas before connecting with professionals.",
    icon: PencilRuler,
    color: "bg-design-soft-peach"
  },
  {
    title: "Build Your Dream Home",
    description: "Work with your chosen architect to bring your vision to life and create your perfect space.",
    icon: Home,
    color: "bg-design-soft-purple"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto">
        <SectionHeading
          title="How It Works"
          subtitle="Your journey to creating the perfect home in four simple steps"
          centered
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className={`${step.color} rounded-full p-6 w-20 h-20 flex items-center justify-center mb-6 mx-auto`}>
                <step.icon className="h-8 w-8 text-foreground" />
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-[70%] h-0.5 bg-muted z-0"></div>
              )}
              
              <h3 className="text-xl font-semibold text-center mb-3">{step.title}</h3>
              <p className="text-center text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
