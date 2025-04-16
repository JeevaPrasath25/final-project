
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";

const TermsOfService = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="Terms of Service"
            subtitle="Last updated: April 16, 2025"
            centered
          />
          
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
            <div className="prose prose-stone max-w-none">
              <p>
                Welcome to DesignNext. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
              </p>
              
              <h3>1. Acceptance of Terms</h3>
              <p>
                By accessing or using DesignNext, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
              </p>
              
              <h3>2. User Accounts</h3>
              <p>
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access our services and for any activities or actions under your password.
              </p>
              
              <h3>3. User Content</h3>
              <p>
                Our services allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You retain any rights that you may have in this content.
              </p>
              <p>
                By posting content, you grant DesignNext a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display such content in connection with providing our services.
              </p>
              
              <h3>4. Architect Services</h3>
              <p>
                DesignNext acts as a platform connecting homeowners with architects. We do not provide architectural services directly. Any agreements or contracts between homeowners and architects are solely between those parties, and DesignNext is not responsible for the actions or omissions of any architects or homeowners using our platform.
              </p>
              
              <h3>5. AI Generated Content</h3>
              <p>
                Our AI Dream Home Generator creates content based on your inputs. While we strive for accuracy and quality, the generated content is provided "as is" without any guarantees regarding accuracy, completeness, or suitability for any particular purpose.
              </p>
              
              <h3>6. Intellectual Property</h3>
              <p>
                The DesignNext name, logo, website, and all content, features, and functionality are owned by DesignNext and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              
              <h3>7. Limitation of Liability</h3>
              <p>
                In no event shall DesignNext, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
              </p>
              
              <h3>8. Governing Law</h3>
              <p>
                These Terms shall be governed and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
              </p>
              
              <h3>9. Changes to Terms</h3>
              <p>
                We reserve the right to modify or replace these Terms at any time. It is your responsibility to review these Terms periodically for changes.
              </p>
              
              <h3>10. Contact Us</h3>
              <p>
                If you have any questions about these Terms, please contact us at:
              </p>
              <p>
                Email: terms@designnext.com<br />
                Address: 123 Design Street, San Francisco, CA 94103, United States
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
