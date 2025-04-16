
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="Privacy Policy"
            subtitle="Last updated: April 16, 2025"
            centered
          />
          
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
            <div className="prose prose-stone max-w-none">
              <p>
                At DesignNext, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
              </p>
              
              <h3>Information We Collect</h3>
              <p>
                We collect information you provide directly to us when you:
              </p>
              <ul>
                <li>Create an account</li>
                <li>Complete your profile</li>
                <li>Upload projects or designs</li>
                <li>Contact architects or clients</li>
                <li>Use our AI Dream Home Generator</li>
                <li>Contact our support team</li>
              </ul>
              
              <h3>How We Use Your Information</h3>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide and improve our services</li>
                <li>Connect homeowners with architects</li>
                <li>Process transactions</li>
                <li>Send notifications and updates</li>
                <li>Respond to your requests and inquiries</li>
                <li>Monitor and analyze usage patterns</li>
                <li>Prevent fraudulent activities</li>
              </ul>
              
              <h3>Information Sharing</h3>
              <p>
                We may share your information with:
              </p>
              <ul>
                <li>Architects or homeowners you choose to connect with</li>
                <li>Service providers who perform services on our behalf</li>
                <li>Legal authorities when required by law</li>
              </ul>
              <p>
                We do not sell your personal information to third parties.
              </p>
              
              <h3>Data Security</h3>
              <p>
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h3>Your Choices</h3>
              <p>
                You can:
              </p>
              <ul>
                <li>Update your account information at any time</li>
                <li>Adjust your notification preferences</li>
                <li>Request deletion of your account</li>
                <li>Opt-out of marketing communications</li>
              </ul>
              
              <h3>Changes to This Policy</h3>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
              
              <h3>Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                Email: privacy@designnext.com<br />
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

export default PrivacyPolicy;
