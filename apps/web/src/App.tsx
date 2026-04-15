import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { HistoryPage } from "@/pages/HistoryPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<WorkspacePage />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/history" element={<HistoryPage />} />
        </Routes>
    );
}
