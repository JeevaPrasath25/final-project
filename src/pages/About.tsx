
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="About DesignNext"
            subtitle="Connecting home owners with visionary architects"
            centered
          />
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
            <p className="mb-6 text-lg">
              DesignNext is a platform that connects homeowners with professional architects, making the process of finding inspiration and hiring talent for your dream home seamless and enjoyable.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 font-playfair">Our Mission</h3>
            <p className="mb-6">
              Our mission is to transform the way people design and build their homes by providing a platform where creativity meets functionality, and where finding the right architect for your vision is just a click away.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 font-playfair">Our Story</h3>
            <p className="mb-6">
              Founded in 2023, DesignNext was born from the frustration of trying to find the right architect for home projects. We realized there was a need for a platform that showcases architects' portfolios in a visually appealing way, making it easier for homeowners to find the perfect match for their style and requirements.
            </p>
            
            <h3 className="text-xl font-semibold mb-3 font-playfair">The Team</h3>
            <p>
              Our team consists of architects, designers, and technologists who are passionate about creating beautiful living spaces. We understand both the creative and technical aspects of home design, and we're committed to making the process more accessible to everyone.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
