"use client";

import { useMemo, useState } from "react";

type Engine = "ChatGPT" | "Perplexity" | "Gemini" | "Google AI Overviews";
type Finding = {
  prompt: string;
  engine: Engine;
  brandMentioned: boolean;
  competitorMentioned: boolean;
  sourceCount: number;
};

const engines: Engine[] = ["ChatGPT", "Perplexity", "Gemini", "Google AI Overviews"];

const defaultFindings: Finding[] = [
  {
    prompt: "best tools for AI website launch audits",
    engine: "ChatGPT",
    brandMentioned: false,
    competitorMentioned: true,
    sourceCount: 4,
  },
  {
    prompt: "alternatives to cookie and accessibility scanners for SaaS launches",
    engine: "Perplexity",
    brandMentioned: false,
    competitorMentioned: true,
    sourceCount: 6,
  },
  {
    prompt: "how to check if my landing page is ready before Product Hunt",
    engine: "Gemini",
    brandMentioned: true,
    competitorMentioned: false,
    sourceCount: 2,
  },
];

const playbooks = [
  "Add a comparison page for every competitor that appears before you.",
  "Publish one answer-style page for each high-intent prompt where you are missing.",
  "Add explicit pricing, use cases, and proof blocks so answer engines can quote you.",
  "Create a founder-facing glossary page around the category language buyers already use.",
  "Refresh titles and meta descriptions around buyer questions, not internal product names.",
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function Home() {
  const [brand, setBrand] = useState("TrustDebt");
  const [domain, setDomain] = useState("trustdebt.dev");
  const [category, setCategory] = useState("AI-built website launch readiness");
  const [competitors, setCompetitors] = useState("Termly\nCookieYes\naccessiBe\nSigentra");
  const [keywords, setKeywords] = useState(
    "AI website launch audit\nwebsite launch checklist\nProduct Hunt launch readiness\nclient website handoff report"
  );
  const [findings, setFindings] = useState<Finding[]>(defaultFindings);
  const [copied, setCopied] = useState(false);

  const competitorList = useMemo(() => textToList(competitors), [competitors]);
  const keywordList = useMemo(() => textToList(keywords), [keywords]);

  const generatedPrompts = useMemo(() => {
    const base = keywordList.length ? keywordList : [category];
    return base.flatMap((keyword) => [
      `What are the best ${keyword} tools for founders?`,
      `Compare ${brand} against ${competitorList.slice(0, 3).join(", ") || "similar tools"} for ${category}.`,
      `What should I use before launching a ${category} page?`,
    ]).slice(0, 10);
  }, [brand, category, competitorList, keywordList]);

  const score = useMemo(() => {
    if (!findings.length) return 0;
    const brandMentions = findings.filter((finding) => finding.brandMentioned).length;
    const competitorMentions = findings.filter((finding) => finding.competitorMentioned).length;
    const sourceDepth = findings.reduce((sum, finding) => sum + finding.sourceCount, 0) / findings.length;
    const raw = brandMentions * 22 - competitorMentions * 8 + sourceDepth * 5 + 42;
    return clamp(Math.round(raw), 0, 100);
  }, [findings]);

  const missingPrompts = findings.filter((finding) => !finding.brandMentioned);
  const competitorRisk = findings.filter((finding) => finding.competitorMentioned).length;

  const exportReport = () => {
    const report = [
      `# ${brand} AI Citation Report`,
      `Domain: ${domain}`,
      `Category: ${category}`,
      `Visibility score: ${score}/100`,
      "",
      "## Competitors tracked",
      ...competitorList.map((item) => `- ${item}`),
      "",
      "## Prompts to monitor",
      ...generatedPrompts.map((item) => `- ${item}`),
      "",
      "## Findings",
      ...findings.map(
        (finding) =>
          `- ${finding.engine}: ${finding.prompt} | brand mentioned: ${finding.brandMentioned ? "yes" : "no"} | competitor mentioned: ${finding.competitorMentioned ? "yes" : "no"} | sources: ${finding.sourceCount}`
      ),
      "",
      "## Recommended fixes",
      ...playbooks.map((item) => `- ${item}`),
    ].join("\n");

    navigator.clipboard.writeText(report).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    });
  };

  const updateFinding = <K extends keyof Finding>(index: number, key: K, value: Finding[K]) => {
    setFindings((current) =>
      current.map((finding, findingIndex) =>
        findingIndex === index ? { ...finding, [key]: value } : finding
      )
    );
  };

  const addFinding = () => {
    setFindings((current) => [
      ...current,
      {
        prompt: generatedPrompts[0] || `best ${category} tools`,
        engine: "ChatGPT",
        brandMentioned: false,
        competitorMentioned: false,
        sourceCount: 0,
      },
    ]);
  };

  return (
    <main className="min-h-[100dvh] overflow-hidden bg-[#08090a] text-stone-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(220,80,0,0.18),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(255,237,215,0.08),transparent_28%)]" />
      <div className="pointer-events-none fixed inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:64px_64px]" />

      <header className="relative z-10 mx-auto grid max-w-7xl grid-cols-2 items-center px-6 py-6 md:px-10">
        <a href="#top" className="font-mono text-sm uppercase tracking-[0.24em] text-stone-300">
          Citation Monitor
        </a>
        <nav className="flex items-center justify-end gap-5 text-sm text-stone-400">
          <a className="hidden transition hover:text-stone-100 md:block" href="#workbench">Workbench</a>
          <a className="hidden transition hover:text-stone-100 md:block" href="#pricing">Pricing</a>
          <a
            href="mailto:hiren@trustdebt.dev?subject=AI%20Citation%20Monitor%20Pilot"
            className="rounded-full border border-orange-300/30 bg-orange-300 px-4 py-2 font-medium text-stone-950 transition hover:bg-orange-200 active:scale-[0.98]"
          >
            Join pilot
          </a>
        </nav>
      </header>

      <section id="top" className="relative z-10 mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-12 md:grid-cols-[1.05fr_0.95fr] md:px-10 md:pb-24 md:pt-20">
        <div className="max-w-3xl">
          <div className="mb-8 inline-flex rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-orange-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            Answer engine visibility for brands
          </div>
          <h1 className="text-5xl font-semibold leading-[0.94] tracking-tighter text-white md:text-7xl">
            Know when AI engines recommend your competitors instead of you.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">
            Citation Monitor tracks the buyer prompts that matter, records which AI engines mention your brand, and turns missed mentions into pages your team can publish.
          </p>
          <div className="mt-9 grid gap-3 sm:grid-cols-[auto_auto_1fr]">
            <a
              href="#workbench"
              className="rounded-full bg-stone-100 px-6 py-3 text-center font-medium text-stone-950 transition hover:bg-white active:scale-[0.98]"
            >
              Run sample audit
            </a>
            <a
              href="#pricing"
              className="rounded-full border border-white/12 px-6 py-3 text-center font-medium text-stone-100 transition hover:border-white/25 hover:bg-white/[0.04] active:scale-[0.98]"
            >
              View pricing
            </a>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
            {[
              ["Tracked engines", "ChatGPT, Perplexity, Gemini, AI Overviews"],
              ["Primary buyer", "Founders, agencies, SEO teams"],
              ["Output", "Citation gaps, competitor risk, publish-ready fixes"],
            ].map(([label, value]) => (
              <div key={label} className="bg-[#0f1011]/90 p-5">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-orange-200/80">{label}</div>
                <div className="mt-3 text-sm leading-6 text-stone-300">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <aside className="relative rounded-[2rem] border border-white/10 bg-white/[0.045] p-4 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="rounded-[1.5rem] border border-white/10 bg-[#0c0d0e] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Live snapshot</div>
                <div className="mt-1 text-lg font-semibold">AI visibility room</div>
              </div>
              <div className="rounded-full border border-orange-300/20 bg-orange-300/10 px-3 py-1 font-mono text-sm text-orange-200">
                {score}/100
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {engines.map((engine, index) => {
                const engineFindings = findings.filter((finding) => finding.engine === engine);
                const mentions = engineFindings.filter((finding) => finding.brandMentioned).length;
                const total = Math.max(engineFindings.length, 1);
                const width = Math.round((mentions / total) * 100);
                return (
                  <div key={engine} style={{ animationDelay: `${index * 100}ms` }} className="animate-[fadeIn_.7s_ease_both]">
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-stone-300">{engine}</span>
                      <span className="font-mono text-stone-500">{mentions}/{total}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-orange-300 transition-all duration-700" style={{ width: `${width}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 grid gap-3 rounded-[1.25rem] border border-white/10 bg-white/[0.03] p-4">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Next action</div>
              <p className="text-sm leading-6 text-stone-300">
                Publish pages for {missingPrompts.length} missing prompts and reduce {competitorRisk} competitor-led answers.
              </p>
            </div>
          </div>
        </aside>
      </section>

      <section id="workbench" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-orange-200">Pilot workbench</div>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Create the prompts your buyers ask AI.</h2>
            <p className="mt-5 text-base leading-7 text-stone-400">
              This first version is intentionally simple: define the category, competitors, and prompts; record AI answers; export the citation gap report. The paid backend automates the engine checks on a schedule.
            </p>
            <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5">
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Conversion wedge</div>
              <p className="mt-3 text-sm leading-6 text-stone-300">
                Sell the report as proof that a brand is visible in AI search before launching ads, outbound, or a new category page.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-[#0f1011]/90 p-5 shadow-2xl shadow-black/20">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-300">Brand</span>
                <input value={brand} onChange={(event) => setBrand(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-300">Domain</span>
                <input value={domain} onChange={(event) => setDomain(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50" />
              </label>
            </div>
            <label className="mt-4 grid gap-2">
              <span className="text-sm font-medium text-stone-300">Category</span>
              <input value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50" />
            </label>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-300">Competitors, one per line</span>
                <textarea value={competitors} onChange={(event) => setCompetitors(event.target.value)} rows={5} className="resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50" />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-300">Buyer prompts, one per line</span>
                <textarea value={keywords} onChange={(event) => setKeywords(event.target.value)} rows={5} className="resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-stone-100 outline-none transition focus:border-orange-300/50" />
              </label>
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">Generated prompts</div>
                  <div className="mt-1 text-sm text-stone-400">Copy these into AI engines during the manual pilot.</div>
                </div>
                <button onClick={exportReport} className="rounded-full bg-orange-300 px-4 py-2 text-sm font-medium text-stone-950 transition hover:bg-orange-200 active:scale-[0.98]">
                  {copied ? "Copied" : "Copy report"}
                </button>
              </div>
              <div className="mt-4 grid gap-2">
                {generatedPrompts.slice(0, 5).map((prompt) => (
                  <div key={prompt} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-stone-300">
                    {prompt}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Answer log</h3>
                <button onClick={addFinding} className="rounded-full border border-white/10 px-4 py-2 text-sm text-stone-200 transition hover:bg-white/[0.05] active:scale-[0.98]">
                  Add answer
                </button>
              </div>
              <div className="grid gap-3">
                {findings.map((finding, index) => (
                  <div key={`${finding.prompt}-${index}`} className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[0.8fr_1.4fr_auto]">
                    <select value={finding.engine} onChange={(event) => updateFinding(index, "engine", event.target.value as Engine)} className="rounded-xl border border-white/10 bg-[#111213] px-3 py-2 text-sm text-stone-100 outline-none">
                      {engines.map((engine) => <option key={engine}>{engine}</option>)}
                    </select>
                    <input value={finding.prompt} onChange={(event) => updateFinding(index, "prompt", event.target.value)} className="rounded-xl border border-white/10 bg-[#111213] px-3 py-2 text-sm text-stone-100 outline-none" />
                    <div className="grid grid-cols-3 gap-2 text-xs text-stone-400">
                      <label className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
                        <input type="checkbox" checked={finding.brandMentioned} onChange={(event) => updateFinding(index, "brandMentioned", event.target.checked)} />
                        Brand
                      </label>
                      <label className="flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2">
                        <input type="checkbox" checked={finding.competitorMentioned} onChange={(event) => updateFinding(index, "competitorMentioned", event.target.checked)} />
                        Rival
                      </label>
                      <input aria-label="Source count" type="number" min={0} value={finding.sourceCount} onChange={(event) => updateFinding(index, "sourceCount", Number(event.target.value))} className="rounded-xl border border-white/10 bg-[#111213] px-3 py-2 text-stone-100 outline-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
          {[
            ["Find", "Track buyer questions across AI engines and see which brands appear."],
            ["Explain", "Show why the answer picked a competitor: source depth, page fit, and category clarity."],
            ["Fix", "Turn missed prompts into pages, comparisons, and schema-ready content briefs."],
          ].map(([title, copy]) => (
            <div key={title} className="bg-[#0f1011] p-8">
              <h3 className="text-2xl font-semibold tracking-tight text-white">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-400">{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="relative z-10 mx-auto max-w-7xl px-6 py-16 md:px-10 md:py-24">
        <div className="max-w-2xl">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-orange-200">Pricing hypothesis</div>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Priced like SEO monitoring, scoped for founders.</h2>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            ["Manual pilot", "$29", "One-time", "Prompt set, first citation report, content fixes."],
            ["Founder monitor", "$19", "Per month", "Weekly checks, competitor alerts, report history."],
            ["Agency room", "$99", "Per month", "Five brands, client PDFs, white-label recommendations."],
          ].map(([name, price, cadence, copy], index) => (
            <div key={name} className={`rounded-[2rem] border p-7 ${index === 1 ? "border-orange-300/40 bg-orange-300/10" : "border-white/10 bg-white/[0.035]"}`}>
              <div className="font-mono text-xs uppercase tracking-[0.18em] text-stone-500">{name}</div>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tighter text-white">{price}</span>
                <span className="pb-2 text-sm text-stone-400">{cadence}</span>
              </div>
              <p className="mt-5 text-sm leading-7 text-stone-300">{copy}</p>
              <a href="mailto:hiren@trustdebt.dev?subject=Citation%20Monitor%20Pilot" className="mt-7 block rounded-full bg-stone-100 px-5 py-3 text-center text-sm font-medium text-stone-950 transition hover:bg-white active:scale-[0.98]">
                Request access
              </a>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 mx-auto max-w-7xl px-6 py-10 md:px-10">
        <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm text-stone-500 md:flex-row">
          <span>Citation Monitor by Hiren Thakore</span>
          <span>Built for AI search, answer engines, and founder-led SEO.</span>
        </div>
      </footer>
    </main>
  );
}
