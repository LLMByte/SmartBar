import { GoogleGenerativeAI } from "@google/generative-ai";
import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./ui/command";

const genAI = new GoogleGenerativeAI("AIzaSyBA_Gr7xV3xROB18fvQvtxx6zcOybM205k");

let session;

function cleanJSONString(input) {
  // Remove the ```json and ``` parts from the string
  let cleaned = input.replace(/```json/g, '').replace(/```/g, '').trim();
  return cleaned;
}

const runGenApi = async (userInput, links) => {
  let model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",

    // Set the `responseMimeType` to output JSON
    generationConfig: { responseMimeType: "application/json" }
  });


  let prompt = `Give a JSON based in the format {'name':'name here'} based on the query: Find a page where the user can do the following "${userInput}. Followings links are used: ${JSON.stringify(links)}. Return the most relevant name given in the links, and the name should strictly be present in the given links json.   Note the output should strictly consist only of JSON and no other formatting`;
  let response = '';

  try {
    if (window.ai && await window.ai.canCreateTextSession() == 'readily'){
      console.log("Using local gemini nano");
      console.log("Prompt: ", prompt)
      if (session == undefined || session == null) {
        session = await window.ai.createTextSession();
      }
      response = await session.prompt(prompt);
      response = cleanJSONString(response);
      console.log("Gemini Nano Response: " + response);
    } else {
      let result = await model.generateContent(prompt);
      response = result.response.text();
      console.log("Gemini Flash Response " + response);
    }

    const text = JSON.parse(response) ;
    console.log("Model response: ", text);
    return [text.name.toLowerCase()];
  } catch (error) {
    console.error("Error running GenAI:", error);
    return []; // Return an empty array on error
  }
}

let timeoutId = null ;

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export function CommandMenu() {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [possibleWords, setPossibleWords] = useState([]);
  const [suggestedLinks, setSuggestedLinks] = useState([]);
  // const prevSuggestedLinks = usePrevious(suggestedLinks); 

  const links = useMemo(() => [
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


  ], []);

  const inputChangeHandler = async (e) => {
    setUserInput(e);
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const words = await runGenApi(e, links);
      console.log("words", words)
      setPossibleWords(words);
      // console.log(words)
      // console.log(possibleWords);
    }, 500);

  };

  useEffect(() => {
    // console.log(possibleWords) ;
    if (possibleWords.length > 0 && links.length > 0) {
      console.log("possible words", possibleWords);
      const intersectingLinks = links.filter((link) => {
        const wordsInLink = [
          link.name.toLowerCase(),
          ...link.link.toLowerCase().split("/"),
        ];

        console.log("words in link: ", wordsInLink);

        // Check if any possibleWord matches the EXACT link name OR path part
        return wordsInLink.some((word) =>
          possibleWords.includes(word) &&
          (link.name.toLowerCase() === word || link.link.toLowerCase() === word)
        );
      });
      console.log(intersectingLinks);
      // console.log(intersectingLinks) ;
      setSuggestedLinks(intersectingLinks);
    }
  }, [possibleWords, links]);

  useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        // userinput={userInput}
        setuserinput={inputChangeHandler}
      />
      <CommandList>
      {console.log(suggestedLinks)}
        {suggestedLinks.length > 0 ? (
            <CommandGroup heading="Suggestions">
              {suggestedLinks.map((link, index) => (
                  <CommandItem key={index}>{link.name}</CommandItem>
              ))}
            </CommandGroup>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {/* <CommandEmpty>No results found.</CommandEmpty> */}
        {/*<CommandGroup heading="Suggestions">*/}
        {/*  <CommandItem>Calendar</CommandItem>*/}
        {/*  <CommandItem>Search Emoji</CommandItem>*/}
        {/*  <CommandItem>Calculator</CommandItem>*/}
        {/*</CommandGroup>*/}
        {/*<CommandSeparator />*/}
        {/*<CommandGroup heading="Settings">*/}
        {/*  <CommandItem>Profile</CommandItem>*/}
        {/*  <CommandItem>Billing</CommandItem>*/}
        {/*  <CommandItem>Settings</CommandItem>*/}
        {/*</CommandGroup>*/}
      </CommandList>
    </CommandDialog>
  );
}
