import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ResumeAnalyzer from '@/components/ResumeAnalyzer';

export const metadata: Metadata = {
  title: 'Resume Analyzer Dashboard - Upload and Analyze Resume',
  description: 'Upload your resume, choose a target job role, and view ATS scoring, skills detection, missing keywords, tips, and PDF report export.',
};

export default function DashboardPage() {
  return (
    <main className="flex-1 flex flex-col bg-background min-h-screen">
      <div className="w-full max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to landing page
        </Link>
      </div>

      <ResumeAnalyzer />

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
