import { Routes, Route } from "react-router-dom";
import { LandingPage } from "@/pages/LandingPage";
import { WorkspacePage } from "@/pages/WorkspacePage";
import { SignInPage } from "@/pages/SignInPage";
import { SignUpPage } from "@/pages/SignUpPage";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<WorkspacePage />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
        </Routes>
    );
}
