# Fate Core Punk Rock Sheets

A web application for creating and managing Fate Core character sheets with a gritty, punk-rock, police-report aesthetic. Your city, your rules.

## Features

-   **Thematic UI**: A unique design that looks like a classified police report from a dystopian, punk-rock city.
-   **Complete Character Sheets**: Manage all aspects of your Fate Core character, including:
    -   High Concept, Trouble, and other Aspects
    -   A full pyramid or column of Skills
    -   Stunts and special abilities
    -   Physical and Mental Stress tracks
    -   Mild, Moderate, and Severe Consequences
    -   Fate Points (Refresh)
-   **Persistent Local Data**: All your character data is saved directly in your browser's local storage.
-   **Dynamic Management**: Easily add new character files, delete old ones, and see all changes saved instantly.
-   **Responsive Design**: Looks great on both desktop and mobile devices.
-   **Zero Build Setup**: Runs directly in the browser using ES modules and an `importmap`. No `npm install` or bundlers required.

## Tech Stack

-   **Frontend**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN)
-   **Fonts**: Google Fonts ('Special Elite' and 'Staatliches')

## Getting Started

This application is designed to run directly in the browser with no build step.

1.  **Download the files.**
2.  **Run a local web server** from the project's root directory.
    -   If you have Python 3, you can run: `python3 -m http.server`
    -   If you have Node.js, you can install and run a simple server: `npx serve`
3.  **Open your browser** and navigate to the local server's address (e.g., `http://localhost:8000` or `http://localhost:3000`).

That's it! You can start creating and managing your character sheets. All data will be saved in your browser.

### File Structure

```
.
├── README.md             # This file
├── index.html            # Main HTML file, includes importmap and styles
├── index.tsx             # Application entry point, handles React rendering
├── App.tsx               # Main application component, handles state
├── components/           # Reusable React components
│   ├── CharacterSheet.tsx
│   ├── ConsequenceSlot.tsx
│   ├── Icon.tsx
│   └── StressTrack.tsx
├── hooks/                # Custom React hooks
│   └── useLocalStorage.ts
├── constants.ts          # Default data and constants
├── types.ts              # TypeScript type definitions
└── metadata.json         # Application metadata
```

## License

This project is licensed under the MIT License.
