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

const runGenApi = async (userInput) => {
  let model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",

    // Set the `responseMimeType` to output JSON
    generationConfig: { responseMimeType: "application/json" }
  });
  
  let prompt = `Give a list of all possible page names a user might be looking for based on the input: "${userInput}`;
  
  try {
  let result = await model.generateContent(prompt)
  const text = JSON.parse(result.response.text()) ;
  const words = Object.values(text) ;
  return words ;
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
    { "name": "Billing", "link": "/billing", "description":"You can pay for your services here" },
    { "name": "Payment History", "link": "/payment-history", "description":"View your past payments" },
    { "name": "Contact Us", "link": "/contact", "description":"Get in touch with our support team" },
    { "name": "Account Settings", "link": "/account", "description":"Manage your account details" },
    { "name": "Help Center", "link": "/help", "description":"Find answers to your questions" },
  ], []);

  const inputChangeHandler = async (e) => {
    setUserInput(e);
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const words = await runGenApi(e);
      setPossibleWords(words);
      // console.log(words)
      // console.log(possibleWords);
    }, 1000);

  };

  useEffect(() => {
    // console.log(possibleWords) ;
    if (possibleWords.length > 0 && links.length > 0) {
      const intersectingLinks = links.filter((link) => {
        const wordsInLink = [
          link.name.toLowerCase(),
          ...link.link.toLowerCase().split("/"),
        ];
  
        // Check if any possibleWord matches the EXACT link name OR path part
        return wordsInLink.some((word) =>
          possibleWords.includes(word) && 
          (link.name.toLowerCase() === word || link.link.toLowerCase() === word)
        );
      });
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
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Type a command or search..."
        userinput={userInput}
        setuserinput={inputChangeHandler}
      />
      <CommandList>
      {console.log(suggestedLinks)}
        {suggestedLinks.length > 0 ? (
          <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        ) : (
          <CommandEmpty>No results found.</CommandEmpty>
        )}
        {/* <CommandEmpty>No results found.</CommandEmpty> */}
        <CommandGroup heading="Suggestions">
          <CommandItem>Calendar</CommandItem>
          <CommandItem>Search Emoji</CommandItem>
          <CommandItem>Calculator</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>Profile</CommandItem>
          <CommandItem>Billing</CommandItem>
          <CommandItem>Settings</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
