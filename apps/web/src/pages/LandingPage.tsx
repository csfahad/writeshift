import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-react";
import {
    ArrowRight,
    ArrowDown,
    FileText,
    Upload,
    Cpu,
    Download,
    Check,
    Quote,
    Minus
} from "lucide-react";
import { Header } from "@/components/Header";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";

function useFadeIn() {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.unobserve(entry.target);
                }
            },
            {
                root: null,
                rootMargin: "0px",
                threshold: 0.1,
            }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, []);

    return { ref, isVisible };
}

function FadeInSection({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    const { ref, isVisible } = useFadeIn();
    return (
        <div
            ref={ref}
            className={`fade-in-section ${isVisible ? "is-visible" : ""} ${className}`}
        >
            {children}
        </div>
    );
}

export function LandingPage() {
    const typewriterWords = [
        { text: "Perfectly", className: "text-foreground dark:text-foreground" },
        { text: "Typed", className: "text-foreground dark:text-foreground" },
    ];

    const demoRef = useRef<HTMLDivElement>(null);

    const scrollToDemo = () => {
        demoRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const { isSignedIn } = useAuth()

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans noise-overlay selection:bg-primary selection:text-primary-foreground">
            <Header />

            <main className="flex-1 overflow-hidden">
                {/* Hero section */}
                <section className="relative min-h-[90vh] flex flex-col items-center justify-center border-b-2 border-border bg-dot-grid">
                    <BackgroundBeams className="opacity-40" />
                    <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center justify-center h-full">
                        <FadeInSection>
                            <h1 className="text-5xl sm:text-7xl lg:text-[5rem] font-bold tracking-tight leading-[1.1] mb-2 drop-shadow-sm">
                                Your Handwriting,
                            </h1>
                            <div className="mb-8 flex justify-center drop-shadow-sm">
                                <div className="inline-flex items-center px-4 py-1 bg-primary">
                                    <TypewriterEffect
                                        words={typewriterWords}
                                        className="text-[42px] sm:text-7xl lg:text-[5rem] m-0 leading-[1.1]"
                                        cursorClassName="bg-blue-500 h-12 sm:h-16 lg:h-[4.5rem] ml-1"
                                    />
                                </div>
                            </div>

                            <p className="mt-6 text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed border-2 border-border p-6 bg-card shadow-md">
                                Upload any handwritten note <span className="px-1 py-0.5 bg-primary border border-border">English or Hindi</span> and get clean, formatted, downloadable text <span className="font-mono text-sm px-1 py-0.5 bg-primary border border-border">(TXT, JPG, PDF, DOCX)</span> in seconds.
                            </p>

                            <div className="mt-12 flex flex-col items-center gap-6">
                                <Link to="/app" className="group block">
                                    <HoverBorderGradient
                                        containerClassName="rounded-none border-2 border-border shadow-[4px_4px_0px_0px_#000] hover:shadow-[2px_2px_0px_0px_#000] transition-all bg-primary"
                                        as="div"
                                        className="bg-primary text-foreground font-bold text-xl px-10 py-5 rounded-none flex items-center gap-3 transition-colors"
                                    >
                                        {isSignedIn ? "Launch Workspace" : "Try Free, No Sign Up Needed"}
                                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </HoverBorderGradient>
                                </Link>

                                <button
                                    onClick={scrollToDemo}
                                    className="text-lg font-bold underline decoration-2 underline-offset-8 hover:text-primary transition-colors flex items-center gap-2"
                                >
                                    See how it works <ArrowDown className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-16 flex flex-wrap justify-center gap-4 text-sm font-mono font-bold">
                                <span className="px-4 py-2 border-2 border-border bg-card shadow-sm">3 free scans</span>
                                <span className="px-4 py-2 border-2 border-border bg-card shadow-sm">No credit card</span>
                                <span className="px-4 py-2 border-2 border-border bg-card shadow-sm">Hindi + English</span>
                            </div>
                        </FadeInSection>

                        {/* Before/after illustration */}
                        <FadeInSection className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6 max-w-4xl w-full">
                            <div className="w-full md:w-5/12 aspect-4/3 bg-muted border-2 border-border shadow-[4px_4px_0px_0px_#000] p-6 -rotate-2 relative flex items-center justify-center">
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <div className="w-3 h-3 rounded-full border-2 border-border bg-red-400"></div>
                                    <div className="w-3 h-3 rounded-full border-2 border-border bg-yellow-400"></div>
                                    <div className="w-3 h-3 rounded-full border-2 border-border bg-green-400"></div>
                                </div>
                                <img src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 200 100"><path d="M10 50 Q 50 10 90 50 T 190 50" fill="none" stroke="black" stroke-width="3"/><path d="M10 70 Q 50 30 90 70 T 190 70" fill="none" stroke="black" stroke-width="2"/></svg>`} alt="handwriting placeholder" className="absolute opacity-50" />
                                <span className="font-mono text-xl rotate-[-5deg] text-muted-foreground absolute z-10 border-2 border-border bg-background p-2">Scribble...</span>
                            </div>
                            <div className="w-12 h-12 flex items-center justify-center bg-primary border-2 border-border rounded-full shadow-sm z-10">
                                <ArrowRight className="w-6 h-6 rotate-90 md:rotate-0" />
                            </div>
                            <div className="w-full md:w-5/12 aspect-4/3 bg-card border-2 border-border shadow-[4px_4px_0px_0px_#000] p-6 rotate-2 flex flex-col">
                                <div className="flex gap-2 mb-4">
                                    <div className="h-4 w-1/2 bg-muted border-2 border-border"></div>
                                    <div className="h-4 w-1/4 bg-primary border-2 border-border"></div>
                                </div>
                                <div className="space-y-2 flex-1">
                                    <div className="h-2 w-full bg-border"></div>
                                    <div className="h-2 w-full bg-border"></div>
                                    <div className="h-2 w-3/4 bg-border"></div>
                                    <div className="h-2 w-5/6 bg-border"></div>
                                </div>
                                <span className="mt-auto self-end px-2 py-1 bg-green-300 border-2 border-border text-xs font-bold shadow-xs">Typed.</span>
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* How it works section */}
                <section ref={demoRef} className="border-b border-border bg-muted/30">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                        <FadeInSection>
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center">
                                Three steps. No nonsense.
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { step: "01", title: "Upload", icon: Upload, desc: "Drop your handwritten image or PDF into the workspace." },
                                    { step: "02", title: "Extract", icon: Cpu, desc: "Our AI reads every word, in English or Hindi." },
                                    { step: "03", title: "Download", icon: Download, desc: "Get your perfectly typed text as PDF, JPG, DOCX, or copy it directly." }
                                ].map((item, idx) => (
                                    <div key={idx} className="bg-card border-2 border-border p-8 shadow-[4px_4px_0px_0px_#000] hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_#000] transition-all relative">
                                        {/* Step Badge */}
                                        <div className="absolute -top-5 -right-5 w-12 h-12 bg-background border border-border shadow-[2px_2px_0px_0px_#000] flex items-center justify-center font-mono font-black text-xl z-20">
                                            {item.step}
                                        </div>
                                        <div className="relative z-10 w-16 h-16 bg-primary border-2 border-border flex items-center justify-center shadow-sm mb-8">
                                            <item.icon className="w-8 h-8 text-primary-foreground" />
                                        </div>
                                        <h3 className="relative z-10 text-2xl font-bold mb-4">{item.title}</h3>
                                        <p className="relative z-10 text-lg text-muted-foreground leading-relaxed">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* Feature highlight section */}
                <section className="border-b-2 border-border bg-background overflow-hidden relative w-full">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
                        <FadeInSection className="grid lg:grid-cols-2 gap-16 items-center w-full">
                            <div className="order-2 lg:order-1 relative w-full pt-4">
                                <div className="absolute inset-0 bg-primary/20 -rotate-3 border-2 border-border scale-[1.02]"></div>
                                <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_#000] p-4 sm:p-6 relative z-10 flex flex-col h-[400px] sm:h-[500px] w-full">
                                    {/* Mock UI Header */}
                                    <div className="flex border-b-2 border-border pb-4 mb-4 gap-2 sm:gap-4 items-center">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 border-2 border-border bg-primary"></div>
                                        <div className="h-5 sm:h-6 w-16 sm:w-32 bg-border shrink-0"></div>
                                        <div className="ml-auto flex gap-2">
                                            <div className="h-6 sm:h-8 w-12 sm:w-20 border-2 border-border bg-background"></div>
                                            <div className="h-6 sm:h-8 w-12 sm:w-24 border-2 border-border bg-secondary shrink-0"></div>
                                        </div>
                                    </div>
                                    {/* Mock UI Body */}
                                    <div className="flex-1 flex gap-2 sm:gap-4 min-h-0">
                                        <div className="w-1/2 border-2 border-border border-dashed bg-muted/40 relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                                            <Upload className="w-8 h-8 sm:w-12 sm:h-12 opacity-20 shrink-0" />
                                            <img src={`data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 200 100"><path d="M10 50 Q 50 10 90 50 T 190 50" fill="none" stroke="black" stroke-width="3"/></svg>`} alt="handwriting" className="absolute opacity-40 rotate-10 w-[150%] max-w-none left-[-25%]" />
                                            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 px-2 py-1 bg-yellow-200 border-2 border-border text-[10px] sm:text-xs font-bold rotate-[-5deg] z-10">English/Hindi</div>
                                        </div>
                                        <div className="w-1/2 border-2 border-border bg-background flex flex-col p-2 sm:p-4 relative overflow-hidden">
                                            <div className="flex gap-1 sm:gap-2 border-b-2 border-border pb-2 mb-4 shrink-0">
                                                <div className="h-3 w-3 sm:h-4 sm:w-4 border border-border bg-muted"></div>
                                                <div className="h-3 w-3 sm:h-4 sm:w-4 border border-border bg-muted"></div>
                                                <div className="h-3 w-3 sm:h-4 sm:w-4 border border-border bg-muted"></div>
                                            </div>
                                            <div className="space-y-2 sm:space-y-3">
                                                <div className="h-2 sm:h-3 w-full bg-border opacity-80"></div>
                                                <div className="h-2 sm:h-3 w-full bg-border opacity-80"></div>
                                                <div className="h-2 sm:h-3 w-4/5 bg-border opacity-80"></div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-background to-transparent z-0"></div>
                                            <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 flex gap-2 z-10">
                                                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-300 border-2 border-border shadow-sm flex items-center justify-center shrink-0"><Download className="w-3 h-3 sm:w-4 sm:h-4" /></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="order-2 w-full">
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8 drop-shadow-sm">
                                    A simple, powerful workspace.
                                </h2>
                                <ul className="space-y-4 sm:space-y-6 text-base sm:text-lg font-medium w-full">
                                    {[
                                        "Reads English + Hindi handwriting",
                                        "Powered by Cloud Vision API",
                                        "Built-in rich-text Tiptap editor",
                                        "Download as PDF, JPG, DOCX or copy",
                                        "History saved for signed-in users",
                                        "3 free scans — no account needed"
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-4 p-4 border-2 border-border bg-card shadow-[4px_4px_0px_0px_#000] hover:bg-muted/50 transition-colors w-full">
                                            <div className="mt-1 shrink-0 w-6 h-6 border-2 border-border bg-primary flex items-center justify-center">
                                                <Check className="w-4 h-4 text-primary-foreground font-bold" />
                                            </div>
                                            <span>{text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* Social proofs section */}
                <section className="bg-primary border-b-2 border-border py-24 px-4 overflow-hidden pattern-dots relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <FadeInSection>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-primary-foreground mb-4">
                                    You're in good company.
                                </h2>
                                <p className="text-xl text-primary-foreground/80 font-medium">Over 10,000 pages scanned last month.</p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8">
                                {[
                                    { text: "I threw a completely illegible doctor's prescription at this app, and it transcribed it flawlessly. Absolute magic.", author: "Med Student", handle: "@futuremd", bg: "bg-blue-200", avatar: "https://i.pravatar.cc/150?img=27" },
                                    { text: "WriteShift is the only OCR I've found that handles my messy Hindi notes without hallucinating garbage text.", author: "Priya S.", handle: "Writer", bg: "bg-green-200", avatar: "https://i.pravatar.cc/150?img=5" },
                                    { text: "No bloated subscription required to start. Dropped a photo, got my DOCX, and was out in 20 seconds.", author: "Alex T.", handle: "Consultant", bg: "bg-pink-200", avatar: "https://i.pravatar.cc/150?img=68" },
                                ].map((t, i) => (
                                    <div key={i} className="bg-card border-2 border-border p-8 shadow-[4px_4px_0px_0px_#000] relative flex flex-col h-full transform hover:-rotate-1 transition-transform">
                                        <Quote className="w-10 h-10 text-muted/40 absolute top-4 right-4" />
                                        <p className="text-lg font-medium leading-relaxed mb-8 flex-1 italic">"{t.text}"</p>
                                        <div className="flex items-center gap-4 mt-auto">
                                            <img src={t.avatar} className={`w-12 h-12 border-2 border-border rounded-full ${t.bg}`} />
                                            <div>
                                                <div className="font-bold">{t.author}</div>
                                                <div className="text-sm font-mono text-muted-foreground">{t.handle}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16">
                                <div className="text-center p-6 border-b-4 md:border-b-0 md:border-r-4 border-border md:pr-16 text-primary-foreground">
                                    <div className="text-6xl font-bold tracking-tighter mb-2">10k+</div>
                                    <div className="text-lg font-mono font-bold">Pages Scanned</div>
                                </div>
                                <div className="text-center p-6 border-b-4 md:border-b-0 md:border-r-4 border-border md:pr-16 text-primary-foreground">
                                    <div className="text-6xl font-bold tracking-tighter mb-2">99%</div>
                                    <div className="text-lg font-mono font-bold">Accuracy</div>
                                </div>
                                <div className="text-center p-6 text-primary-foreground">
                                    <div className="text-6xl font-bold tracking-tighter mb-2">2</div>
                                    <div className="text-lg font-mono font-bold">Languages</div>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* Pricing section */}
                <section className="py-24 border-b-2 border-border bg-muted/20">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <FadeInSection>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Simple, honest access.</h2>
                                <p className="text-xl text-muted-foreground font-medium">Use it free right now. Sign in if you want complete managable history.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                                {/* FREE TIER */}
                                <div className="bg-card border-2 border-border flex flex-col shadow-[4px_4px_0px_0px_#000]">
                                    <div className="p-8 border-b-2 border-border bg-blue-100 flex flex-col items-center">
                                        <h3 className="text-3xl font-bold font-mono tracking-tight mb-2 uppercase">Guest</h3>
                                        <div className="text-5xl font-black mb-2">$0</div>
                                        <div className="font-bold text-muted-foreground">Always free</div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <ul className="space-y-4 mb-8 font-medium text-lg flex-1">
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> 3 free full scans</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> English & Hindi OCR</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Rich text editing</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Download as PDF, JPG, DOCX, TXT</li>
                                            <li className="flex items-center gap-3 text-muted-foreground line-through"><Minus className="w-5 h-5 text-muted-foreground" /> Saved extraction history</li>
                                        </ul>
                                        <Link to="/app" className="block text-center w-full py-4 bg-background border-2 border-border font-bold text-xl hover:bg-muted transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-y-1 active:shadow-none">
                                            Start Scanning
                                        </Link>
                                    </div>
                                </div>

                                {/* SIGNED IN TIER */}
                                <div className="bg-card border-2 border-border flex flex-col shadow-[4px_4px_0px_0px_#000] relative transform md:-translate-y-4">
                                    <div className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-1 font-bold border border-border shadow-sm rotate-3 border-dashed">RECOMMENDED</div>
                                    <div className="p-8 border-b-4 border-border bg-green-200 flex flex-col items-center">
                                        <h3 className="text-3xl font-bold font-mono tracking-tight mb-2 uppercase">Power User</h3>
                                        <div className="text-5xl font-black mb-2">$0</div>
                                        <div className="font-bold text-muted-foreground">Free Account</div>
                                    </div>
                                    <div className="p-8 flex-1 flex flex-col">
                                        <ul className="space-y-4 mb-8 font-medium text-lg flex-1">
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Unlimited scans</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> English & Hindi OCR</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Rich text editing</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> Download as PDF, JPG, DOCX, TXT</li>
                                            <li className="flex items-center gap-3"><Check className="w-5 h-5 text-primary" /> <span className="font-bold bg-primary underline decoration-wavy decoration-foreground underline-offset-4">Auto-saved history</span></li>
                                        </ul>
                                        <SignedOut>
                                            <Link to="/sign-up" className="block text-center w-full py-4 bg-foreground text-background border-2 border-border font-bold text-xl hover:bg-foreground/80 transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-y-1 active:shadow-none">
                                                Create Account
                                            </Link>
                                        </SignedOut>
                                        <SignedIn>
                                            <Link to="/app" className="block text-center w-full py-4 bg-foreground text-background border-2 border-border font-bold text-xl hover:bg-foreground/80 transition-colors shadow-[2px_2px_0px_0px_#000] active:translate-y-1 active:shadow-none">
                                                Go to Workspace
                                            </Link>
                                        </SignedIn>
                                    </div>
                                </div>
                            </div>
                        </FadeInSection>
                    </div>
                </section>

                {/* Final CTA section */}
                <section className="bg-secondary text-secondary-foreground py-28 relative overflow-hidden border-b-2 border-border">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMDAnIGhlaWdodD0nMTAwJz48ZmlsdGVyIGlkPSdnJz48ZmVUdXJidWxlbmNlIHR5cGU9J2ZyYWN0YWxOb2lzZScgYmFzZUZyZXF1ZW5jeT0nLjknIG51bU9jdGF2ZXM9JzEnIHN0aXRjaFRpbGVzPSdzdGl0Y2gnLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0nMTAwJScgaGVpZ2h0PScxMDAlJyBmaWx0ZXI9J3VybCgjZyknIG9wYWNpdHk9Jy4wNScvPjwvc3ZnPg==')] opacity-30 mix-blend-overlay"></div>
                    <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                        <FadeInSection>
                            <h2 className="text-[42px] md:text-7xl font-black tracking-tighter mb-8 lowercase leading-[0.9]">
                                Stop <span className="text-destructive line-through decoration-4">retyping</span>,<br />Start uploading
                            </h2>
                            <Link to="/app" className="inline-flex items-center gap-3 bg-primary text-primary-foreground font-bold text-lg md:text-xl px-8 py-4 border-2 border-border shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-none hover:translate-y-1 transition-all">
                                Try Free Now <ArrowRight className="w-4 h-4 md:w-6 md:h-6" />
                            </Link>
                            <p className="mt-8 font-mono font-bold text-secondary-foreground/60">NO SIGN-UP REQUIRED</p>
                        </FadeInSection>
                    </div>
                </section>
            </main>

            {/* Footer section */}
            <footer className="bg-background py-16 border-t-4 border-border">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8 font-bold">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary border-2 border-border flex items-center justify-center shadow-sm">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-2xl font-black tracking-tight leading-none block">WriteShift</span>
                            <span className="font-mono text-xs text-muted-foreground tracking-wider">Handwriting to Text</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                        <Link to="/app" className="hover:text-primary underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-primary transition-all">Workspace</Link>
                        <SignedOut>
                            <Link to="/sign-in" className="hover:text-primary underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-primary transition-all">Sign In</Link>
                        </SignedOut>
                        <a href="#" className="hover:text-primary underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-primary transition-all">Privacy Policy</a>
                        <a href="#" className="hover:text-primary underline decoration-2 underline-offset-4 decoration-transparent hover:decoration-primary transition-all">Terms of Service</a>
                    </div>

                    <div className="font-mono text-sm border-2 border-border px-3 py-1 bg-muted">
                        © {new Date().getFullYear()} WriteShift
                    </div>
                </div>
            </footer>
        </div>
    );
}
