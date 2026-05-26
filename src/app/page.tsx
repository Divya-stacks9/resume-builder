import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Download,
  FileSearch,
  FileText,
  Lightbulb,
  ListChecks,
  SearchCheck,
  ShieldCheck,
  Sparkles,
  Target,
  Wand2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Resume Analyzer - Maximize ATS Keyword Match',
  description: 'Upload your PDF or DOCX resume to check your ATS score, discover missing keywords, get structural improvement tips, and generate tailored summaries.',
};

export default function HomePage() {
  const featureHighlights = [
    {
      icon: BarChart3,
      title: 'ATS score generator',
      body: 'Get a clear score for structure, keywords, formatting, impact, and role fit.',
    },
    {
      icon: SearchCheck,
      title: 'Skills detection',
      body: 'Automatically identify programming languages, frameworks, tools, cloud skills, and soft skills.',
    },
    {
      icon: Target,
      title: 'Missing keywords',
      body: 'Compare your resume with the target job role and see exactly which terms are missing.',
    },
    {
      icon: Lightbulb,
      title: 'Improvement tips',
      body: 'Turn weak bullet points into stronger, measurable achievements with practical suggestions.',
    },
    {
      icon: Wand2,
      title: 'Resume summary',
      body: 'Generate a tailored professional summary that matches the role you are applying for.',
    },
    {
      icon: Download,
      title: 'PDF report',
      body: 'Download your score, detected skills, keywords, tips, and summary as a clean report.',
    },
  ];

  const workflowSteps = [
    ['Upload', 'Add your PDF or DOCX resume in the dashboard.'],
    ['Target', 'Enter the job role you want to optimize for.'],
    ['Analyze', 'Review your ATS score, skills, keywords, and tips.'],
    ['Improve', 'Apply suggestions and download the report.'],
  ];

  return (
    <main className="flex-1 flex flex-col bg-background min-h-screen">
      <section className="relative min-h-[92vh] overflow-hidden border-b border-border">
        <Image
          src="/resume-analyzer-hero.png"
          alt="AI resume analyzer dashboard preview"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/88 dark:bg-slate-950/82" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,rgba(248,250,252,0.92)_44%,rgba(248,250,252,0.38)_100%)] dark:bg-[linear-gradient(90deg,var(--background)_0%,rgba(9,13,22,0.9)_45%,rgba(9,13,22,0.24)_100%)]" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[92vh] flex flex-col justify-between">
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-lg font-extrabold tracking-tight">ATS Resume Analyzer</span>
            </div>
            <a
              href="/dashboard"
              className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-border bg-card/85 px-4 py-2 text-sm font-semibold text-foreground shadow-sm hover:bg-accent transition-colors"
            >
              Open dashboard
              <ArrowRight className="h-4 w-4" />
            </a>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center py-10 lg:py-14">
            <div className="lg:col-span-6 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-5">
                <Sparkles className="h-3.5 w-3.5" />
                Resume scoring, keyword matching, and improvement tips
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.04]">
                AI Resume Analyzer
              </h1>
              <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl leading-8">
                Upload a PDF or DOCX resume, choose your target role, and get a clean ATS score with detected skills, missing keywords, and practical fixes.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-95 transition-opacity"
                >
                  Analyze my resume
                  <ArrowRight className="h-4 w-4" />
                </a>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/85 px-5 py-3 text-sm font-bold text-foreground hover:bg-accent transition-colors"
                >
                  View features
                </a>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Local fallback mode
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4 text-blue-500" />
                  Role-specific checks
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BadgeCheck className="h-4 w-4 text-indigo-500" />
                  PDF report export
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 hidden lg:flex justify-end">
              <div className="w-full max-w-lg rounded-2xl border border-white/35 bg-white/22 p-2 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-white/8">
                <div className="aspect-[4/3] overflow-hidden rounded-xl">
                  <Image
                    src="/resume-analyzer-hero.png"
                    alt="Resume analyzer interface preview"
                    width={900}
                    height={675}
                    priority
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-8">
            {[
              ['ATS score', 'Measure structure, relevance, contact details, formatting, and impact.'],
              ['Skills and keywords', 'Detect resume skills and compare them with your target role.'],
              ['Improvement report', 'Get focused tips, a summary, and a downloadable PDF report.'],
            ].map(([title, body]) => (
              <div key={title} className="rounded-xl border border-border bg-card/88 p-4 shadow-sm backdrop-blur-sm">
                <h2 className="text-sm font-bold text-foreground">{title}</h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background py-20 sm:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
              <ListChecks className="h-3.5 w-3.5 text-primary" />
              Feature highlights
            </div>
            <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything needed to improve a resume before applying
            </h2>
            <p className="mt-4 text-sm sm:text-base leading-7 text-muted-foreground">
              The analyzer focuses on the checks recruiters and automated screening systems care about most: clarity, relevance, keywords, skills, and measurable impact.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featureHighlights.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-foreground">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{feature.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary/45 py-20 sm:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-bold text-muted-foreground">
                <FileSearch className="h-3.5 w-3.5 text-primary" />
                How it works
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                From resume upload to action plan in four steps
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-7 text-muted-foreground">
                Use it before job applications to understand what your resume already communicates and what needs to be strengthened for the role.
              </p>
              <a
                href="/dashboard"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md hover:opacity-95 transition-opacity"
              >
                Start analysis
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {workflowSteps.map(([title, body], index) => (
                <div key={title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground text-background text-sm font-extrabold">
                      {index + 1}
                    </span>
                    <h3 className="text-base font-bold text-foreground">{title}</h3>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 sm:py-24">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                Built for role-specific resume optimization
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-7 text-muted-foreground">
                Choose roles like frontend engineer, backend developer, data scientist, DevOps engineer, mobile developer, or product manager. The dashboard compares your resume with role expectations and highlights the strongest next edits.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Frontend Engineer', 'Backend Developer', 'Data Scientist', 'DevOps Engineer', 'Product Manager'].map((role) => (
                  <span key={role} className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold text-muted-foreground">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl border border-primary/20 bg-primary text-primary-foreground p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <Sparkles className="h-8 w-8" />
                <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Ready to check your resume?
                </h2>
                <p className="mt-4 text-sm leading-7 text-primary-foreground/85">
                  Open the dashboard, upload your file, and get a report you can use before sending your next application.
                </p>
              </div>
              <a
                href="/dashboard"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-md hover:bg-white/92 transition-colors"
              >
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 border-t border-border mt-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Resume Analyzer. Built for recruitment success.</p>
          <div className="flex gap-4">
            <span className="hover:text-foreground transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground transition-colors cursor-pointer">Contact Support</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
