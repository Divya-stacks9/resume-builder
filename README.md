# Local ATS Resume Analyzer 📄🚀

A premium full-stack web application built using **Next.js 16 (App Router)**, **TypeScript**, and **Tailwind CSS v4** to analyze resumes against target job roles. It runs **100% locally and privately**, evaluating your resume structure, keyword matching, and technical skills without making external API requests.

---

## Key Features

1. **Multi-Format Upload:** Direct support for PDF (`.pdf`) and Word (`.docx`) file formats.
2. **Local Text Extraction:** Uses `pdf-parse` (for PDF) and `mammoth` (for DOCX) to extract raw text directly on the server.
3. **Target Job Comparison:** Compares the resume against the target role title using context-aware mapping.
4. **Heuristics Parser & Matcher:**
   - Computes an overall ATS compatibility score based on content density, sections, formatting, action verbs, and keyword alignment.
   - Extracts skills and classifies them into: Languages, Frameworks, Databases & Cloud, Tools, Soft Skills.
   - Identifies matched and missing critical keywords for standard roles.
   - Delivers specific improvement suggestions.
5. **Interactive Dashboard:**
   - Animated SVG radial score progress indicator.
   - Structured skill badge inventory.
   - Collapsible extracted plain text preview to verify parser performance.
6. **Native Vector PDF Export:** Downloads the complete dashboard report as a high-fidelity vector-graphic PDF using `jsPDF`. The exported PDF has selectable text and crisp vector layout.
7. **Premium Responsive Design:** Responsive mobile-first UI with a polished Dark Mode and smooth animations.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Parsers:** `pdf-parse` (for PDF), `mammoth` (for DOCX)
- **PDF Generation:** jsPDF

---

## Installation & Setup

Follow these steps to run the application locally:

### 1. Clone the repository / Open the Workspace
Navigate to the project root directory:
```bash
cd resume-builder
```

### 2. Install Dependencies
Install all required Node modules:
```bash
npm install
```

### 3. Start the Development Server
Run the local dev server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```
resume-builder/
├── public/                 # Static assets
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── analyze/
│   │   │       └── route.ts  # Ingestion & local analysis API endpoint
│   │   ├── globals.css     # Tailwind v4 configuration, themes & animations
│   │   ├── layout.tsx      # Base layout template
│   │   └── page.tsx        # Homepage containing SEO details & analyzer dashboard
│   ├── components/
│   │   ├── UploadZone.tsx  # Drag & Drop file uploader
│   │   ├── AtsScoreCircle.tsx # SVG animated radial progress gauge and detailed breakdowns
│   │   ├── SkillsCard.tsx  # Grouped skill badges view
│   │   └── ResumeAnalyzer.tsx # Master controller managing state, API calls, and panels
│   └── utils/
│       ├── parser.ts       # Text extraction engine (pdf-parse / mammoth)
│       ├── analyzer.ts     # Heuristics rule-based scanner
│       └── pdfExport.ts    # Native vector PDF generation using jsPDF
├── tsconfig.json           # TypeScript configuration
└── package.json            # Node project configuration
```
