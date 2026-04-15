"use client";

import { motion } from "framer-motion";

const featureSteps = [
  {
    title: "Parallel Prompt Dispatch",
    text: "Write one prompt once. MultiMind fans it out across providers in parallel so teams can compare reasoning quality immediately.",
    tag: "Step 01",
    accent: "from-cyan-300/22 to-blue-400/10",
  },
  {
    title: "Model Targeting Controls",
    text: "Use per-model toggles to route prompts only to selected providers, perfect for cost control and focused validation.",
    tag: "Step 02",
    accent: "from-emerald-300/22 to-cyan-400/10",
  },
  {
    title: "Live Health Awareness",
    text: "Status dots and health checks surface degraded providers in real-time so teams avoid blind routing failures.",
    tag: "Step 03",
    accent: "from-sky-300/22 to-teal-400/10",
  },
  {
    title: "Decision-Ready Comparison",
    text: "Responses remain side-by-side with independent context history, making it easier to pick the best output quickly.",
    tag: "Step 04",
    accent: "from-cyan-200/20 to-indigo-400/10",
  },
];

export function LandingFeatureStack() {
  return (
    <section id="features" className="mt-10 pb-14">
      <div className="mb-5 text-center">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">Feature Flow</p>
        <h2 className="mt-2 font-display text-4xl text-white sm:text-5xl">Scroll Through How MultiMind Works</h2>
      </div>

      <div className="relative pb-28">
        {featureSteps.map((step, index) => (
          <motion.article
            key={step.title}
            initial={{ opacity: 0, y: 26, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.42 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="landing-panel sticky min-h-86 overflow-hidden rounded-3xl p-6 shadow-[0_22px_60px_rgba(0,0,0,0.42)] sm:min-h-90 sm:p-8"
            style={{ 
              zIndex: 10 + index, 
              top: `calc(4.8rem + ${index * 1.25}rem)`,
              backgroundColor: 'rgba(4, 7, 13, 0.98)',
            }}
          >
            <div className={`absolute inset-0 bg-linear-to-br ${step.accent}`} />
            <div className="relative flex h-full flex-col justify-between gap-7">
              <div>
                <span className="inline-flex rounded-full border border-white/18 bg-black/28 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-slate-200">
                  {step.tag}
                </span>
                <h3 className="mt-4 max-w-3xl font-display text-3xl text-white sm:text-4xl">{step.title}</h3>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-200 sm:text-lg">{step.text}</p>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-cyan-100">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-300" />
                Smooth handoff to the next feature as you scroll
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
