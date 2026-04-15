import type { Metadata } from "next";
import Link from "next/link";
import { Immersive3DController } from "@/components/immersive-3d-controller";
import { Landing3DScene } from "@/components/landing-3d-scene";
import { LandingFeatureStack } from "@/components/landing-feature-stack";

export const metadata: Metadata = {
  title: "Home",
  description:
    "MultiMind is an AI workspace where one prompt runs across Gemini, ChatGPT, Claude, and Grok with a live 3D model experience.",
  alternates: {
    canonical: "/",
  },
};

const trustCompanies = ["NovaStack", "QuantaWorks", "SynapseGrid", "OrbitIQ", "AstraChain", "HelioLogic"];

const clientStories = [
  {
    name: "Nadia Pervez",
    role: "Head of Product, OrbitIQ",
    quote:
      "MultiMind cut our model-evaluation cycle from days to hours. The side-by-side format changed how we ship AI features.",
  },
  {
    name: "Ibrahim Khan",
    role: "AI Lead, SynapseGrid",
    quote:
      "Routing prompts by model toggle gave our team predictable costs and cleaner benchmarking across providers.",
  },
  {
    name: "Sana Noor",
    role: "Operations Director, NovaStack",
    quote:
      "Health visibility plus multi-model comparison in one UI removed guesswork from production decision making.",
  },
];

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "MultiMind",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function Home() {
  return (
    <>
      <Immersive3DController />

      <div className="site-stars" aria-hidden="true">
        <span className="site-stars-layer site-stars-layer-near" />
        <span className="site-stars-layer site-stars-layer-mid" />
        <span className="site-stars-layer site-stars-layer-far" />
        <span className="site-rush-haze" />
      </div>

      <header className="site-header fixed inset-x-0 top-0 z-50 px-6 pt-4 sm:px-8 lg:px-10">
        <nav
          className="mx-auto flex w-full max-w-7xl items-center justify-between rounded-2xl border border-white/14 bg-[linear-gradient(180deg,rgba(10,14,22,0.72),rgba(5,9,16,0.66))] px-4 py-3 shadow-[0_20px_45px_rgba(0,0,0,0.36)] backdrop-blur-2xl"
          aria-label="Main navigation"
        >
          <p className="font-display text-2xl text-white sm:text-3xl">MultiMind</p>
          <Link
            href="/chat"
            className="rounded-xl border border-emerald-300/35 bg-emerald-400/20 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/30"
          >
            Open Chat
          </Link>
        </nav>
      </header>

      <main className="site-content relative z-10 w-full pb-14">
        <section className="landing-panel hero-section-stars relative min-h-screen overflow-hidden px-6 pb-6 pt-0 sm:px-8 sm:pb-8 sm:pt-0">
          <div className="pointer-events-none absolute -right-22 -top-24 h-56 w-56 rounded-full bg-cyan-300/12 blur-3xl" />

          <div className="relative -mt-14 sm:-mt-16">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-slate-300">AI Control Surface</p>
            <h1 className="max-w-xl font-display text-5xl leading-tight text-white sm:text-6xl">
              Orchestrate Every Major LLM From One Beautiful Workspace.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              MultiMind gives teams a single clean interface for multi-model decisions. Compare
              reasoning quality, control per-model routing with toggles, and monitor provider health
              live without leaving one workspace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="rounded-xl border border-emerald-300/35 bg-emerald-400/20 px-5 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/30"
              >
                Launch MultiMind Chat
              </Link>
              <a
                href="#features"
                className="rounded-xl border border-white/18 bg-white/7 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/14"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="hero-liquid-border" aria-hidden="true">
            <span className="hero-liquid-wave" />
            <span className="hero-liquid-wave hero-liquid-wave-soft" />
          </div>
        </section>

        <section className="immersive-3d-shell">
          <div id="immersive-3d-stage" className="immersive-3d-stage">
            <Landing3DScene immersive />
          </div>
        </section>

        <section className="section-fade landing-panel mt-8 rounded-3xl p-5 sm:p-7">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-slate-300">Companies Trust Us</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {trustCompanies.map((company) => (
              <div
                key={company}
                className="rounded-xl border border-white/12 bg-black/26 px-3 py-3 text-center text-sm font-semibold tracking-wide text-slate-100"
              >
                {company}
              </div>
            ))}
          </div>
        </section>

        <LandingFeatureStack />

        <section className="section-fade mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="landing-panel p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Our Clients</p>
            <h2 className="mt-2 font-display text-4xl text-white">Teams That Build Faster With MultiMind</h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {clientStories.map((story) => (
                <article key={story.name} className="rounded-2xl border border-white/12 bg-black/24 p-4">
                  <p className="text-sm leading-6 text-slate-200">"{story.quote}"</p>
                  <p className="mt-4 font-semibold text-white">{story.name}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{story.role}</p>
                </article>
              ))}
            </div>
          </article>

          <article className="landing-panel p-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">About Us</p>
            <h3 className="mt-2 font-display text-3xl text-white">Built for Serious AI Operators</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              We design tools for product teams, researchers, and founders who need model clarity,
              not dashboard noise. MultiMind is focused on confidence, speed, and repeatable AI decisions.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li className="rounded-xl border border-white/12 bg-black/24 px-3 py-2">Real-time multi-model orchestration</li>
              <li className="rounded-xl border border-white/12 bg-black/24 px-3 py-2">Clear routing and health visibility</li>
              <li className="rounded-xl border border-white/12 bg-black/24 px-3 py-2">Production-ready web and API architecture</li>
            </ul>
          </article>
        </section>

        <section className="section-fade mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="landing-panel p-6 lg:col-span-2">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Contact</p>
            <h2 className="mt-2 font-display text-4xl text-white">Let’s Build Your AI Command Center</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
              Tell us your use case and we will help you shape your model comparison workflow, routing rules, and provider strategy.
            </p>

            <form className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your name"
                className="rounded-xl border border-white/12 bg-black/26 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <input
                type="email"
                placeholder="Work email"
                className="rounded-xl border border-white/12 bg-black/26 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <input
                type="text"
                placeholder="Company"
                className="rounded-xl border border-white/12 bg-black/26 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <input
                type="text"
                placeholder="Role"
                className="rounded-xl border border-white/12 bg-black/26 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <textarea
                placeholder="Share your current AI workflow and goals"
                rows={4}
                className="sm:col-span-2 rounded-xl border border-white/12 bg-black/26 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none"
              />
              <button
                type="button"
                className="sm:col-span-2 w-fit rounded-xl border border-emerald-300/35 bg-emerald-400/20 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/30"
              >
                Send Message
              </button>
            </form>
          </article>

          <article className="landing-panel flex flex-col justify-between p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-300">Ready</p>
              <h3 className="mt-2 font-display text-3xl text-white">Open the Chat Workspace</h3>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Start with all models or route to one provider with the toggle system.
              </p>
            </div>
            <Link
              href="/chat"
              className="mt-5 rounded-xl border border-cyan-300/32 bg-cyan-400/18 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/28"
            >
              Go to Chat
            </Link>

            <p className="mt-5 text-xs uppercase tracking-[0.2em] text-slate-400">support@multimind.ai</p>
          </article>
        </section>
      </main>

      <footer className="footer-black-rise relative z-10 mt-16 w-full py-14">
        <div className="border-t border-white/12 px-6 pt-10 sm:px-8 lg:px-10">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Product</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Parallel Chat</a></li>
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Model Routing</a></li>
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Health Checks</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Company</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">About</a></li>
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Careers</a></li>
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Resources</p>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">API Docs</a></li>
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Use Cases</a></li>
                <li><a href="#" className="text-sm text-slate-300 hover:text-white">Status</a></li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">Launch</p>
              <div className="mt-4 flex flex-col gap-3">
                <input type="email" placeholder="you@example.com" className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none" />
                <button className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-black transition hover:bg-emerald-400">
                  Join Free
                </button>
              </div>
            </div>
          </div>

          <div className="footer-brand-wrap mt-12 border-t border-white/10 pt-8">
            <p className="footer-brand text-center font-display text-8xl leading-none sm:text-9xl">
              MultiMind
            </p>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
    </>
  );
}
