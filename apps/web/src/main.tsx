import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AppProviders } from "./providers/AppProviders.tsx";
import { Analytics } from '@vercel/analytics/react';
 
createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AppProviders>
            <App />
	    <Analytics />
        </AppProviders>
    </StrictMode>,
);
