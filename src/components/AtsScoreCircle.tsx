'use client';

import React, { useEffect, useState } from 'react';
import { Award, CheckCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface AtsScoreCircleProps {
  score: number;
  breakdown: {
    contactInfo: number;
    skills: number;
    experience: number;
    education: number;
    keywordMatch: number;
    formatting: number;
    actionVerbs: number;
  };
}

export default function AtsScoreCircle({ score, breakdown }: AtsScoreCircleProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 55;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    // Animate the score counting up
    const duration = 1200; // ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      // Ease out quad formula
      const easedProgress = progress * (2 - progress);
      setAnimatedScore(Math.round(easedProgress * score));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score]);

  // Determine styling based on score range
  const getScoreColor = (val: number) => {
    if (val >= 80) return { text: 'text-green-500', stroke: 'stroke-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20', darkText: 'dark:text-green-400' };
    if (val >= 65) return { text: 'text-emerald-500', stroke: 'stroke-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', darkText: 'dark:text-emerald-400' };
    if (val >= 50) return { text: 'text-amber-500', stroke: 'stroke-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', darkText: 'dark:text-amber-400' };
    return { text: 'text-rose-500', stroke: 'stroke-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/20', darkText: 'dark:text-rose-400' };
  };

  const colors = getScoreColor(score);

  const getSubScoreColor = (val: number) => {
    if (val >= 80) return 'bg-green-500';
    if (val >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getRecruitmentStatus = (val: number) => {
    if (val >= 80) return { title: 'Excellent Match', desc: 'Your resume is highly optimized for this role and has a high chance of passing automated screeners.', icon: Sparkles, color: 'text-green-600 dark:text-green-400' };
    if (val >= 65) return { title: 'Strong Match', desc: 'Good structure and keywords. Making a few quick edits could make it stand out even more.', icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400' };
    if (val >= 50) return { title: 'Needs Improvement', desc: 'Missing significant keywords or action verbs. Follow the feedback to boost your visibility.', icon: Award, color: 'text-amber-600 dark:text-amber-400' };
    return { title: 'Major Revisions Required', desc: 'Low compatibility score. Critical parts of the resume are missing or unoptimized.', icon: ShieldAlert, color: 'text-rose-600 dark:text-rose-400' };
  };

  const status = getRecruitmentStatus(score);
  const StatusIcon = status.icon;

  const labels: Record<keyof typeof breakdown, string> = {
    contactInfo: 'Contact Information',
    skills: 'Skills Matching',
    experience: 'Work Experience',
    education: 'Education Details',
    keywordMatch: 'Keyword Relevance',
    formatting: 'Formatting & Length',
    actionVerbs: 'Action Verbs & Impact'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center border border-border bg-card p-6 rounded-2xl shadow-sm">
      {/* Circular Progress Gauge */}
      <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
        <div className="relative flex items-center justify-center">
          <svg height={radius * 2} width={radius * 2}>
            <circle
              className="stroke-muted"
              fill="transparent"
              strokeWidth={stroke}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
            />
            <circle
              className={`progress-ring__circle ${colors.stroke}`}
              fill="transparent"
              strokeWidth={stroke}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-4xl font-extrabold tracking-tight ${colors.text} ${colors.darkText}`}>
              {animatedScore}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
              ATS Score
            </span>
          </div>
        </div>

        <div className="mt-4">
          <h4 className={`text-lg font-bold flex items-center gap-1.5 justify-center ${status.color}`}>
            <StatusIcon className="h-5 w-5" />
            {status.title}
          </h4>
          <p className="text-xs text-muted-foreground mt-1 px-4 max-w-xs mx-auto leading-relaxed">
            {status.desc}
          </p>
        </div>
      </div>

      {/* Breakdown Scores List */}
      <div className="md:col-span-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
          Score Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {Object.entries(breakdown).map(([key, val]) => {
            const valNum = val as number;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-foreground/80">
                    {labels[key as keyof typeof breakdown]}
                  </span>
                  <span className="font-bold">{valNum}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${getSubScoreColor(valNum)}`}
                    style={{ width: `${valNum}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
