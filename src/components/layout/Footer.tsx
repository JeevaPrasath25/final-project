
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-design-dark text-white pt-12 pb-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="text-2xl font-bold font-playfair">
              Design<span className="text-design-primary">Next</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Connect with top architects and discover your dream home design.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="text-white hover:text-design-primary transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-design-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-design-primary transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/explore" className="text-muted-foreground hover:text-white transition-colors">
                  Explore Designs
                </Link>
              </li>
              <li>
                <Link to="/architects" className="text-muted-foreground hover:text-white transition-colors">
                  Find Architects
                </Link>
              </li>
              <li>
                <Link to="/ai-generator" className="text-muted-foreground hover:text-white transition-colors">
                  AI Dream Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* For Architects */}
          <div>
            <h3 className="font-medium text-lg mb-4">For Architects</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/for-architects" className="text-muted-foreground hover:text-white transition-colors">
                  Join as Architect
                </Link>
              </li>
              <li>
                <Link to="/post-project" className="text-muted-foreground hover:text-white transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/success-stories" className="text-muted-foreground hover:text-white transition-colors">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-medium text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-muted-foreground text-center">
          <p>© {new Date().getFullYear()} DesignNext. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
