'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  Briefcase, 
  Download, 
  Copy, 
  Check, 
  RefreshCw, 
  AlertCircle,
  XSquare, 
  CheckSquare, 
  Lightbulb, 
  AlignLeft, 
  ChevronDown, 
  ChevronUp, 
  FileText 
} from 'lucide-react';
import UploadZone from './UploadZone';
import AtsScoreCircle from './AtsScoreCircle';
import SkillsCard from './SkillsCard';
import { AnalysisReport } from '@/utils/analyzer';
import { exportAnalysisToPdf } from '@/utils/pdfExport';

const SUGGESTED_ROLES = [
  'Frontend Engineer',
  'Backend Developer',
  'Fullstack Developer',
  'Data Scientist',
  'DevOps Engineer',
  'Mobile Developer',
  'Product Manager'
];

const LOADING_STEPS = [
  'Parsing document text...',
  'Extracting skills profile...',
  'Analyzing contact details...',
  'Evaluating experience depth...',
  'Comparing with role keywords...',
  'Formatting improvement tips...',
  'Generating professional summary...'
];

export default function ResumeAnalyzer() {
  // Theme state
  const [isDark, setIsDark] = useState(false);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState('');

  // Analysis status
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    text: string;
    analysis: AnalysisReport;
  } | null>(null);

  // Interactive UI states
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    setIsDark(initialDark);
    
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Loading animation step cycle
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);
    } else {
      setLoadingStepIdx(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please upload a resume file first.');
      return;
    }
    if (!targetRole.trim()) {
      setError('Please specify a target job role.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetRole', targetRole.trim());

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Server returned an error.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred during resume analysis.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = () => {
    if (!result) return;
    const sanitizedRole = targetRole.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filename = `resume_analysis_${sanitizedRole}.pdf`;
    exportAnalysisToPdf(result.analysis, filename, targetRole);
  };

  const handleCopySummary = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.analysis.professionalSummary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col gap-8">
      {/* Header Panel */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
            ATS Resume Analyzer
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Optimize your resume for automated screeners locally and privately.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 border border-border bg-card rounded-xl hover:bg-accent text-foreground transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Input panel (Show if no results) */}
      {!result && !loading && (
        <form onSubmit={handleAnalyze} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Controls */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold">1. Upload Resume Document</h2>
              <UploadZone 
                onFileSelect={setFile} 
                selectedFile={file} 
                onClearFile={() => setFile(null)} 
              />
            </div>

            <div className="border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="text-lg font-bold">2. Specify Job Details</h2>
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Frontend Engineer"
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="block w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-sm"
                  />
                </div>

                {/* Suggested tags */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-medium">Suggestions:</span>
                  {SUGGESTED_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                        targetRole === role
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-3 border border-destructive/20 bg-destructive/5 text-destructive p-4 rounded-xl text-sm animate-fade-in-up">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={!file || !targetRole.trim()}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-muted disabled:to-muted disabled:text-muted-foreground text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed text-center text-sm"
            >
              Analyze Resume
            </button>
          </div>

          {/* Guidelines Sidebar */}
          <div className="lg:col-span-4 border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Analysis Criteria</h3>
            <ul className="space-y-3.5 text-xs text-foreground/80 leading-relaxed">
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span><strong>Contact Info:</strong> Validates presence of email, phone, LinkedIn, and portfolios.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span><strong>Skills Alignment:</strong> Extracts tools, frameworks, and programming languages.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span><strong>Keyword Relevance:</strong> Compares resume terms against industry keywords for the role.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span><strong>Formatting Audit:</strong> Checks content density, structural hierarchy, and length.</span>
              </li>
              <li className="flex gap-2">
                <Check className="h-4 w-4 text-green-500 shrink-0" />
                <span><strong>Action Verbs & Impact:</strong> Detects action-oriented phrases and quantifiable achievements.</span>
              </li>
            </ul>
          </div>
        </form>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center animate-pulse-slow">
          <div className="relative flex items-center justify-center mb-6">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <Briefcase className="h-6 w-6 text-primary absolute" />
          </div>
          <h3 className="text-xl font-bold tracking-tight text-foreground">Analyzing Your Resume</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs h-6 font-medium">
            {LOADING_STEPS[loadingStepIdx]}
          </p>
        </div>
      )}

      {/* Dashboard Result View */}
      {result && !loading && (
        <div className="space-y-8 animate-fade-in-up">
          {/* Overview Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-border bg-card p-5 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                  Active Analysis
                </span>
                <h2 className="text-lg font-bold text-foreground leading-snug line-clamp-1 max-w-[280px] sm:max-w-md">
                  {file?.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Targeting: <span className="font-semibold text-foreground/80">{targetRole}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                onClick={handleDownloadPdf}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold bg-primary hover:bg-primary/95 text-white rounded-xl shadow-sm transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                Download PDF Report
              </button>
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center p-2.5 border border-border bg-card hover:bg-accent rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                title="Analyze Another Resume"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Grid Layout of Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: ATS Score Circle & Detailed Skills */}
            <div className="lg:col-span-12 space-y-8">
              <AtsScoreCircle 
                score={result.analysis.score} 
                breakdown={result.analysis.breakdown} 
              />
            </div>

            {/* Professional Summary Card (Full Width) */}
            <div className="lg:col-span-12 border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Tailored Professional Summary</h3>
                  <p className="text-xs text-muted-foreground">
                    An elevator pitch optimized with keywords to match the target job role.
                  </p>
                </div>
                <button
                  onClick={handleCopySummary}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors ${
                    copied 
                      ? 'border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400' 
                      : 'border-border bg-card hover:bg-accent text-muted-foreground hover:text-foreground'
                  }`}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-muted/40 p-4 rounded-xl border border-border/60">
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{result.analysis.professionalSummary}&rdquo;
                </p>
              </div>
            </div>

            {/* Keywords Section (Split Grid 6/6) */}
            <div className="lg:col-span-6 border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4 self-stretch flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500/10 rounded-lg text-green-500">
                  <CheckSquare className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Matched Keywords ({result.analysis.matchedKeywords.length})</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Terms and keywords found in your resume matching the role.
              </p>
              {result.analysis.matchedKeywords.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  No matched keywords found.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.analysis.matchedKeywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-xs rounded-lg font-medium border border-green-200 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800/30"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="lg:col-span-6 border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4 self-stretch flex flex-col">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-500">
                  <XSquare className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Missing Keywords ({result.analysis.missingKeywords.length})</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Keywords recommended for the target role that are missing from your resume.
              </p>
              {result.analysis.missingKeywords.length === 0 ? (
                <div className="flex-1 flex items-center justify-center py-6 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                  Excellent! No critical missing keywords.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {result.analysis.missingKeywords.map((kw, i) => (
                    <span 
                      key={i} 
                      className="px-2.5 py-1 text-xs rounded-lg font-medium border border-rose-200 bg-rose-50 text-rose-700 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Improvement Tips Section */}
            <div className="lg:col-span-12 border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-500">
                  <Lightbulb className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Actionable Improvement Tips</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Specific structural and stylistic edits to increase your scoring potential.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {result.analysis.improvementTips.map((tip, idx) => {
                  const getCategoryColor = (cat: string) => {
                    switch (cat) {
                      case 'contact': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
                      case 'skills': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
                      case 'experience': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400';
                      case 'education': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400';
                      case 'impact': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
                      default: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
                    }
                  };

                  return (
                    <div 
                      key={idx} 
                      className="border border-border bg-card/60 p-4 rounded-xl flex flex-col justify-between gap-3 hover:border-border/80 hover:shadow-sm transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full tracking-wider ${getCategoryColor(tip.category)}`}>
                            {tip.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-foreground leading-snug">
                          {tip.tip}
                        </h4>
                      </div>
                      <div className="pt-2.5 border-t border-border/40 text-xs text-muted-foreground">
                        <strong className="text-foreground/80">Action:</strong> {tip.action}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Array Cards */}
            <div className="lg:col-span-12">
              <SkillsCard detectedSkills={result.analysis.detectedSkills} />
            </div>

            {/* Resume Extracted Text Accordion */}
            <div className="lg:col-span-12 border border-border bg-card rounded-2xl shadow-sm overflow-hidden">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="w-full flex items-center justify-between p-6 hover:bg-accent/40 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <AlignLeft className="h-4.5 w-4.5 text-muted-foreground" />
                  <div>
                    <h3 className="text-md font-bold text-foreground">Extracted Resume Text Preview</h3>
                    <p className="text-xs text-muted-foreground">
                      View the parsed raw content scanned from your document.
                    </p>
                  </div>
                </div>
                {showPreview ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              {showPreview && (
                <div className="border-t border-border p-6 bg-muted/20 animate-fade-in-up">
                  <pre className="text-xs font-mono whitespace-pre-wrap max-h-96 overflow-y-auto bg-card border border-border p-4 rounded-xl text-foreground/80 leading-relaxed">
                    {result.text}
                  </pre>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
