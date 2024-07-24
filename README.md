# SmartCommands: Command Bar with LLM Capabilities

This project demonstrates how to create SmartCommands that leverages Google's Gemini Nano, an on-device large language model (LLM), to enhance user navigation through natural language commands.

## Features

- **Natural Language Processing:** Uses Google's Gemini Nano to interpret and process user commands directly in the browser.
- **Shadcn Components:** Utilizes Shadcn components for a sleek and responsive interface.
- **Dynamic Suggestions:** Provides real-time suggestions based on user input.

## Prerequisites

- Node.js and npm installed.
- A Google Generative AI API key.

## Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/LLMByte/SmartBar.git
cd SmartBar
```

2. Install the dependencies:

```bash
npm install
```

3. Set up your Google Generative AI API key:

- Create a `.env` file in the root directory.
- Add your API key:

```
REACT_APP_API_KEY=YOUR_API_KEY
```

### Running the Project

1. Start the development server:

```bash
npm start
```

2. Open your browser and navigate to `http://localhost:3000`.

## Usage

### Opening the Command Bar

- Press `Ctrl + K` to open the command bar.

### Adding Links

Add your links in the `links` array in `CommandMenu.js`. Each link should have a `name`, `link`, and `description`:

```javascript
const links = useMemo(() => [
  { "name": "Billing", "link": "/billing", "description": "You can pay for your services here" },
  { "name": "Payment History", "link": "/payment-history", "description": "View your past payments" },
  { "name": "Contact Us", "link": "/contact", "description": "Get in touch with our support team using phone or email" },
  { "name": "Account Settings", "link": "/account", "description": "Manage your account details" },
  { "name": "Help Center", "link": "/help", "description": "Find answers to your questions" },
], []);
```

### Commands

You can use natural language commands to navigate through the links. Examples of commands include:

- "Where can I pay my bills?"
- "Show me my past payments."
- "How do I contact support?"
- "I need to update my account details."
- "I have a question about my service."
