import "./App.css";
import { SmartCommandMenu } from "./components/CommandMenu";

const links =  [
  { "name": "Billing", "link": "/billing", "description": "You can pay for your services here" },
  { "name": "Payment History", "link": "/payment-history", "description": "View your past payments" },
  { "name": "Contact Us", "link": "/contact", "description": "Get in touch with our support team using phone or email" },
  { "name": "Account Settings", "link": "/account", "description": "Manage your account details" },
  { "name": "Help Center", "link": "/help", "description": "Find answers to your questions" },
  { "name": "Policy Information", "link": "/policy-info", "description": "View and manage your insurance policies" },
  { "name": "Claims Center", "link": "/claims", "description": "File a claim or check the status of an existing claim" },
  { "name": "Coverage Details", "link": "/coverage", "description": "Review what is covered under your insurance plans" },
  { "name": "Quotes and Estimates", "link": "/quotes", "description": "Get a quote or estimate for a new policy" },
  { "name": "Premium Payments", "link": "/premium-payments", "description": "Pay your insurance premiums online" },
  { "name": "Document Upload", "link": "/upload", "description": "Upload necessary documents for your policies or claims" },
  { "name": "Notifications", "link": "/notifications", "description": "Manage your notification preferences" },
  { "name": "Agent Locator", "link": "/agent-locator", "description": "Find an insurance agent near you" },
  { "name": "Policy Renewal", "link": "/policy-renewal", "description": "Renew your existing policies online" },
  { "name": "Discounts and Offers", "link": "/discounts", "description": "Check available discounts and special offers" },
  { "name": "Frequently Asked Questions (FAQ)", "link": "/faq", "description": "Find answers to common insurance questions" },
  { "name": "Insurance Resources", "link": "/resources", "description": "Access educational materials and resources about insurance" },
  { "name": "Feedback and Complaints", "link": "/feedback", "description": "Provide feedback or file a complaint regarding our services" },
  { "name": "Insurance Glossary", "link": "/glossary", "description": "Learn about insurance terms and definitions" },
  { "name": "Account Security", "link": "/account-security", "description": "Update your security settings and manage two-factor authentication" },
  { "name": "Mobile App", "link": "/mobile-app", "description": "Download our mobile app for easy access to your insurance information" }
];

function App() {
  return (
    <div className="App">
    <h2>Press Ctrl + K to open command dialogue box</h2>
      <SmartCommandMenu links={links} />
    </div>
  );
}

export default App;
