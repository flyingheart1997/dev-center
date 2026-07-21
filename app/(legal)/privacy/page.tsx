import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, FileText, Cpu, Database, Eye, Globe, UserCheck, Server, AlertCircle } from "lucide-react"

export default function PrivacyPolicyPage() {
  const lastUpdated = "July 20, 2026"

  const sections = [
    { id: "overview", title: "1. Overview & Scope", icon: Shield },
    { id: "information-collected", title: "2. Information We Collect", icon: FileText },
    { id: "ai-screening-data", title: "3. AI Voice & Virtual Compiler Data", icon: Cpu },
    { id: "multi-tenant-isolation", title: "4. Multi-Tenant Isolation & Architecture", icon: Database },
    { id: "use-of-data", title: "5. How We Use Your Data", icon: UserCheck },
    { id: "data-sharing", title: "6. Data Sharing & Third-Party Service Providers", icon: Eye },
    { id: "data-retention", title: "7. Data Retention & Deletion Policy", icon: Server },
    { id: "security-measures", title: "8. Security Standards & Encryption", icon: Lock },
    { id: "global-rights", title: "9. Global Rights (GDPR, CCPA & Privacy Regulations)", icon: Globe },
    { id: "contact-us", title: "10. Contact Information", icon: AlertCircle },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sticky Table of Contents Sidebar */}
      <aside className="lg:col-span-1 hidden lg:block">
        <div className="sticky top-24 space-y-4 p-4 rounded-2xl bg-card shadow-xs">
          <h3 className="font-semibold text-xl text-foreground uppercase tracking-wider">Contents</h3>
          <nav className="space-y-1.5 text-xs">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block text-muted-foreground hover:text-primary transition-colors py-1 truncate font-medium"
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Privacy Content */}
      <article className="lg:col-span-3 space-y-10">
        {/* Document Header */}
        <div className="space-y-3">
          <Badge variant="outline" className="text-primary border-primary/30 px-3 py-1">
            Global Data Protection & Privacy Standard
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective Date: <span className="font-medium text-foreground">{lastUpdated}</span> · Version 2.4
          </p>
        </div>

        {/* Executive Summary Callout */}
        <Card className="border-primary/20 bg-primary/5 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
              <Shield className="h-5 w-5" /> Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            Dev-Center is an all-in-one multi-tenant SaaS recruitment ecosystem consolidating Applicant Tracking (ATS), AI-driven pre-screening (voice & code compilation), and live collaborative interview rooms.
            We treat your company and candidate data with the highest standard of security. We do NOT sell candidate data, nor do we use private code or screening audio to train public AI models.
          </CardContent>
        </Card>

        {/* 1. Overview & Scope */}
        <section id="overview" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">1. Overview & Scope</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This Privacy Policy describes how Dev-Center ("we", "us", "our") collects, uses, stores, and protects personal data when you interact with our platform as an Employer, Hiring Manager, Interviewer, or Job Candidate ("User", "you").
            This policy applies to all domains, API endpoints (`/api/trpc/*`, `/api/auth/*`), and services operating under the Dev-Center ecosystem.
          </p>
        </section>

        {/* 2. Information We Collect */}
        <section id="information-collected" className="space-y-4 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">2. Information We Collect</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Depending on your role and usage of the Dev-Center platform, we collect the following categories of information:
          </p>

          <div className="space-y-3">
            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h3 className="font-semibold text-sm text-foreground">A. Account & Profile Information</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Full name, email address, password hash (salted via bcryptjs), phone number, profile avatar, role (`OWNER`, `GLOBAL_ADMIN`, `INTERVIEWER`), and organization membership metadata.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h3 className="font-semibold text-sm text-foreground">B. Applicant & ATS Resume Documents</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Uploaded PDF/DOCX resumes, parsed candidate work histories, education, skills, salary expectations, applied job listings, candidate stage statuses, and recruiter notes.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-2">
              <h3 className="font-semibold text-sm text-foreground">C. Technical & Usage Metrics</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                IP addresses, browser type, device identifiers, session tokens (JWT), HTTP request headers, and audit logs recorded when performing administrative workspace actions.
              </p>
            </div>
          </div>
        </section>

        {/* 3. AI Voice & Virtual Compiler Data */}
        <section id="ai-screening-data" className="space-y-4 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">3. AI Voice & Virtual Compiler Data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Our dual-arena assessment pipeline utilizes the Google Gemini API to conduct automated verbal screening and code verification:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Virtual Compiler Submissions:</strong> Code written in Python, Java, Go, JavaScript, etc., is evaluated in isolated execution instances against case-by-case verification JSON. Code is analyzed strictly for compilation and test case validation.</li>
            <li><strong className="text-foreground">AI Voice Screening Transcripts:</strong> Audio streams transmitted during 1-on-1 AI voice mock interviews are transcribed and processed for candidate response quality. Transcripts are stored securely under your workspace ID.</li>
            <li><strong className="text-foreground">Zero AI Model Retraining:</strong> We execute API data processing under enterprise terms ensuring that candidate submissions are NEVER used to retrain foundation AI models.</li>
          </ul>
        </section>

        {/* 4. Multi-Tenant Isolation & Architecture */}
        <section id="multi-tenant-isolation" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">4. Multi-Tenant Data Isolation</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dev-Center enforces strict database-level multi-tenant isolation. Every database table containing tenant-specific records includes a mandatory `organization_id` column:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li>All backend PostgreSQL queries automatically filter results by the validated `organization_id` extracted from the authenticated user's session JWT.</li>
            <li>Cross-tenant data leakage between competing enterprise workspaces is strictly prohibited and structurally prevented at the ORM query layer.</li>
          </ul>
        </section>

        {/* 5. How We Use Your Data */}
        <section id="use-of-data" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">5. How We Use Your Data</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use the collected information solely for legitimate business purposes:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li>To facilitate candidate application management, job posting approvals, and ATS Kanban pipeline updates.</li>
            <li>To dispatch transactional emails (e.g. 6-digit OTP verification codes, password resets, candidate invitation links via Resend).</li>
            <li>To establish real-time WebRTC audio/video connections for live interview rooms and collaborative code editors.</li>
            <li>To generate administrative analytics, branch performance metrics, and seat usage records.</li>
          </ul>
        </section>

        {/* 6. Data Sharing */}
        <section id="data-sharing" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">6. Data Sharing & Subprocessors</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We do NOT sell, rent, or trade your personal data. We share information only with vetted cloud infrastructure subprocessors under strict confidentiality agreements:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Resend:</strong> Transactional email dispatch engine.</li>
            <li><strong className="text-foreground">LiveKit:</strong> Real-time WebRTC media server for video and audio interview streams.</li>
            <li><strong className="text-foreground">Google Gemini API:</strong> AI evaluation for resume parsing and virtual compiling.</li>
            <li><strong className="text-foreground">PostgreSQL Cloud:</strong> Encrypted relational database hosting.</li>
          </ul>
        </section>

        {/* 7. Data Retention */}
        <section id="data-retention" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">7. Data Retention & Deletion</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We retain active workspace data for as long as your enterprise organization account remains active. Upon workspace termination or explicit candidate deletion requests, we permanently purge records and associated resume files from active databases within 30 days.
          </p>
        </section>

        {/* 8. Security Measures */}
        <section id="security-measures" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">8. Security Standards & Encryption</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dev-Center implements enterprise-grade technical safeguards:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Encryption in Transit:</strong> TLS 1.3 encryption for all HTTP/HTTPS API calls and WebSocket connections.</li>
            <li><strong className="text-foreground">Encryption at Rest:</strong> AES-256 encrypted database backups and salted bcrypt password hashing.</li>
          </ul>
        </section>

        {/* 9. Global Rights */}
        <section id="global-rights" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">9. Global Privacy Rights (GDPR & CCPA)</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Depending on your jurisdiction, you have the right to access, export, rectify, or request deletion of your personal data. To exercise any data privacy rights, submit a request to our privacy team.
          </p>
        </section>

        {/* 10. Contact Information */}
        <section id="contact-us" className="p-6 rounded-2xl border border-border bg-card space-y-3 scroll-mt-28">
          <h3 className="font-bold text-lg text-foreground">10. Contact Information</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            If you have questions, feedback, or concerns regarding this Privacy Policy or our data protection practices, please contact our Data Protection Officer at:
          </p>
          <div className="text-xs font-mono text-primary space-y-1">
            <p>Dev-Center SaaS Ecosystem Ltd.</p>
            <p>Email: privacy@devcenter.com</p>
          </div>
        </section>
      </article>
    </div>
  )
}
