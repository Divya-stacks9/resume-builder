'use client';

import React from 'react';
import { Code2, Layers, Database, Terminal, UserCheck } from 'lucide-react';

interface SkillsCardProps {
  detectedSkills: {
    languages: string[];
    frameworks: string[];
    databasesCloud: string[];
    tools: string[];
    softSkills: string[];
  };
}

export default function SkillsCard({ detectedSkills }: SkillsCardProps) {
  const categories = [
    {
      title: 'Languages',
      skills: detectedSkills.languages,
      icon: Code2,
      badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/30',
      iconStyle: 'text-blue-500 bg-blue-500/10'
    },
    {
      title: 'Frameworks',
      skills: detectedSkills.frameworks,
      icon: Layers,
      badgeStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800/30',
      iconStyle: 'text-indigo-500 bg-indigo-500/10'
    },
    {
      title: 'Databases & Cloud',
      skills: detectedSkills.databasesCloud,
      icon: Database,
      badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800/30',
      iconStyle: 'text-cyan-500 bg-cyan-500/10'
    },
    {
      title: 'Tools & DevOps',
      skills: detectedSkills.tools,
      icon: Terminal,
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800/30',
      iconStyle: 'text-purple-500 bg-purple-500/10'
    },
    {
      title: 'Soft Skills',
      skills: detectedSkills.softSkills,
      icon: UserCheck,
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/30',
      iconStyle: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  const hasAnySkills = categories.some((cat) => cat.skills && cat.skills.length > 0);

  return (
    <div className="border border-border bg-card p-6 rounded-2xl shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-foreground">Detected Skills Inventory</h3>
        <p className="text-xs text-muted-foreground">
          Categorized keywords extracted automatically from your resume.
        </p>
      </div>

      {!hasAnySkills ? (
        <div className="text-center py-6 border border-dashed border-border rounded-xl text-muted-foreground text-sm">
          No skills identified in the resume text.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            if (!cat.skills || cat.skills.length === 0) return null;

            return (
              <div
                key={idx}
                className="flex flex-col border border-border bg-card/40 rounded-xl p-4 transition-all duration-300 hover:shadow-md hover:border-border/80"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`p-1.5 rounded-lg ${cat.iconStyle}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">
                    {cat.title}
                  </h4>
                  <span className="ml-auto text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
                    {cat.skills.length}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-auto">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors hover:bg-opacity-80 ${cat.badgeStyle}`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
