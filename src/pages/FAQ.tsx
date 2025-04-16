
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is DesignNext?",
    answer: "DesignNext is a platform that connects homeowners with professional architects. We help homeowners find inspiration for their dream homes and connect with the right architect for their project."
  },
  {
    question: "How do I hire an architect through DesignNext?",
    answer: "You can browse our directory of architects, view their portfolios, and contact them directly through our platform. Once you've found an architect you're interested in working with, you can send them a message to discuss your project."
  },
  {
    question: "I'm an architect. How can I join DesignNext?",
    answer: "If you're an architect looking to showcase your work and connect with potential clients, you can sign up for an architect account. After creating your account, you'll be able to create your profile, upload your portfolio, and start connecting with homeowners."
  },
  {
    question: "How does the AI Dream Home Generator work?",
    answer: "Our AI Dream Home Generator uses advanced AI technology to create visual concepts based on your description. Simply enter a detailed description of your dream home, and our AI will generate images that bring your vision to life. These images can serve as inspiration or a starting point for discussions with architects."
  },
  {
    question: "Is there a fee to use DesignNext?",
    answer: "Basic features on DesignNext are free for homeowners, including browsing projects and architects. Premium features, such as unlimited AI generations and priority support, require a subscription. Architects pay a monthly or annual fee to maintain their profile and connect with potential clients."
  },
  {
    question: "How do I save projects I like?",
    answer: "To save projects you like, simply click the heart icon on any project. You need to be logged in to use this feature. You can access your saved projects at any time from your user dashboard."
  },
  {
    question: "Can I see the cost of previous projects?",
    answer: "Many projects include budget range information, although the exact costs may not be disclosed due to privacy reasons. Budget ranges are provided as a general guideline and actual costs may vary depending on location, materials, and other factors."
  },
  {
    question: "How long does it typically take to complete a project?",
    answer: "Project timelines vary greatly depending on the scope, complexity, and scale of the project. Small renovations might take a few months, while large custom homes can take a year or more from design to completion. Your architect can provide a more accurate timeline for your specific project."
  }
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto">
          <SectionHeading
            title="Frequently Asked Questions"
            subtitle="Find answers to common questions about DesignNext"
            centered
          />
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm mt-8">
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium text-lg">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            
            <div className="mt-8 pt-6 border-t text-center">
              <p className="text-muted-foreground mb-4">
                Didn't find what you were looking for?
              </p>
              <a href="/contact" className="text-design-primary hover:underline">
                Contact our support team
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQ;
