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



let session;

function cleanJSONString(input) {
  // Remove the ```json and ``` parts from the string
  let cleaned = input.replace(/```json/g, '').replace(/```/g, '').trim();
  return cleaned;
}

const runGenApi = async (userInput, links, genAI) => {

  let prompt = `Give an output in the following EXACT FORMAT  {"name": "name here"} based on the query: Find a page where the user can do the following "${userInput}. Followings links are used: ${JSON.stringify(links)}. Return the most relevant name given in the links, and the name should strictly be present in the given links json.   Note the output should be as shown in example and nothing else`;
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
        let model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",

            // Set the `responseMimeType` to output JSON
            generationConfig: { responseMimeType: "application/json" }
        });
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

export function SmartCommandMenu({links, genAI}) {
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [possibleWords, setPossibleWords] = useState([]);
  const [suggestedLinks, setSuggestedLinks] = useState([]);
  // const prevSuggestedLinks = usePrevious(suggestedLinks);

  const inputChangeHandler = async (e) => {
    setUserInput(e);
    clearTimeout(timeoutId);

    timeoutId = setTimeout(async () => {
      const words = await runGenApi(e, links, genAI);
      console.log("words", words)
      setPossibleWords(words);
      // console.log(words)
      // console.log(possibleWords);
    }, 500);

  };

  useEffect(() => {
    console.log("posswords", possibleWords)
    console.log("link length", links);
    // ;
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
