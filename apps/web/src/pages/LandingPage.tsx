import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import {
    ArrowRight,
    FileText,
    Languages,
    Sparkles,
    Download,
    History,
    Zap,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const features = [
    {
        icon: Sparkles,
        title: "Handwriting that actually reads",
        body: "Google Vision–powered OCR tuned for messy notes, margins, and mixed layouts — not just printed text.",
    },
    {
        icon: Languages,
        title: "English & Hindi",
        body: "Pick a language hint or let the model decide. Great for bilingual notebooks and study sheets.",
    },
    {
        icon: Download,
        title: "Export-ready",
        body: "Polish in the editor, then export to plain text, JPG, or PDF without leaving the page.",
    },
    {
        icon: History,
        title: "History when you sign in",
        body: "Guests get three free scans. Signed-in users keep past jobs to reopen, edit, and download anytime.",
    },
] as const;

const steps = [
    {
        step: "01",
        title: "Drop a photo or PDF",
        body: "Drag in a file or paste from the clipboard - up to 20 PDF pages.",
    },
    {
        step: "02",
        title: "Extract & tweak",
        body: "Run OCR, then edit with a rich text toolbar built for long-form cleanup.",
    },
    {
        step: "03",
        title: "Ship the text",
        body: "Copy, print, or export. Your retro workspace stays out of the way.",
    },
] as const;

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative border-b-2 border-border overflow-hidden">
                    <div className="absolute inset-0 bg-primary/15 pointer-events-none" />
                    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
                        <Badge
                            variant="secondary"
                            className="mb-6 border-2 border-border shadow-xs text-xs uppercase tracking-widest"
                        >
                            WriteShift
                        </Badge>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight max-w-3xl leading-[1.05]">
                            Turn handwriting into{" "}
                            <span className="bg-primary p-1 border-2 border-border shadow-sm inline-block">
                                typed text
                            </span>{" "}
                            you can actually use.
                        </h1>
                        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                            A sharp, retro workspace for students, founders, and
                            anyone tired of retyping notes. Try three scans free
                            — then sign in for unlimited OCR and saved history.
                        </p>
                        <div className="mt-10 flex flex-wrap items-center gap-3">
                            <Button
                                asChild
                                size="lg"
                                className="border-2 border-border shadow-md text-base h-12 px-8"
                            >
                                <Link to="/app">
                                    Try free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <SignedOut>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-border shadow-sm h-12 px-8 text-base bg-background"
                                >
                                    <Link to="/sign-up">Create account</Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="lg"
                                    className="h-12 px-6 text-base underline-offset-4 hover:underline"
                                >
                                    <Link to="/sign-in">Sign in</Link>
                                </Button>
                            </SignedOut>
                            <SignedIn>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-border h-12 px-8"
                                >
                                    <Link to="/app">Open app</Link>
                                </Button>
                            </SignedIn>
                        </div>
                        <p className="mt-6 text-sm text-muted-foreground font-mono">
                            No credit card for guests · 3 successful scans · EN
                            / HI
                        </p>
                    </div>
                </section>

                {/* Feature grid */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <div className="max-w-2xl mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                            Built for real notebooks, not demo images.
                        </h2>
                        <p className="mt-3 text-muted-foreground text-lg">
                            Gumroad-simple messaging. WriteShift-brutalist
                            chrome. Everything you need in one flow.
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 lg:gap-5">
                        {features.map(({ icon: Icon, title, body }) => (
                            <Card
                                key={title}
                                className="border-2 border-border shadow-sm hover:shadow-md transition-shadow"
                            >
                                <CardHeader className="pb-2">
                                    <div className="w-10 h-10 border-2 border-border bg-primary/20 flex items-center justify-center mb-2">
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg">
                                        {title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base text-muted-foreground">
                                        {body}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

                <Separator className="bg-border" />

                {/* How it works */}
                <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-12">
                        How it works
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {steps.map(({ step, title, body }) => (
                            <div
                                key={step}
                                className="border-2 border-border p-6 shadow-sm bg-card"
                            >
                                <span className="font-mono text-xs text-muted-foreground">
                                    {step}
                                </span>
                                <h3 className="mt-2 text-xl font-semibold tracking-tight">
                                    {title}
                                </h3>
                                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                                    {body}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA band */}
                <section className="border-y-2 border-border bg-muted/40">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                        <div className="flex gap-4 items-start">
                            <div className="w-12 h-12 shrink-0 border-2 border-border bg-primary flex items-center justify-center shadow-sm">
                                <Zap className="h-6 w-6" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold tracking-tight">
                                    Ready when you are.
                                </h2>
                                <p className="mt-2 text-muted-foreground max-w-xl">
                                    Jump into the workspace with three guest
                                    scans, or sign in to unlock unlimited OCR
                                    and downloadable history.
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 shrink-0">
                            <Button
                                asChild
                                size="lg"
                                className="border-2 border-border shadow-md h-12 px-8"
                            >
                                <Link to="/app">Start for free</Link>
                            </Button>
                            <SignedOut>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="border-2 border-border h-12 px-8 bg-background"
                                >
                                    <Link to="/sign-up">Sign up</Link>
                                </Button>
                            </SignedOut>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="border-t-2 border-border py-10 mt-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary border-2 border-border flex items-center justify-center shadow-xs">
                            <FileText className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-foreground">
                            WriteShift
                        </span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                        <Link
                            to="/app"
                            className="hover:text-foreground underline-offset-4 hover:underline"
                        >
                            App
                        </Link>
                        <Link
                            to="/sign-in"
                            className="hover:text-foreground underline-offset-4 hover:underline"
                        >
                            Sign in
                        </Link>
                        <Link
                            to="/sign-up"
                            className="hover:text-foreground underline-offset-4 hover:underline"
                        >
                            Sign up
                        </Link>
                    </div>
                    <span className="font-mono text-xs">
                        © {new Date().getFullYear()} WriteShift
                    </span>
                </div>
            </footer>
        </div>
    );
}
