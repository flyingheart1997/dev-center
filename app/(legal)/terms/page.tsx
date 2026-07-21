import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ShieldAlert, CheckCircle2, Building, Scale, AlertTriangle, CreditCard, Lock, Ban, Gavel, UserCheck } from "lucide-react"

export default function TermsOfServicePage() {
  const lastUpdated = "July 20, 2026"

  const sections = [
    { id: "acceptance", title: "1. Acceptance of Terms", icon: FileText },
    { id: "eligibility", title: "2. Service Eligibility & Account Registration", icon: UserCheck },
    { id: "workspaces", title: "3. Enterprise Workspaces & Multi-Tenancy", icon: Building },
    { id: "sandbox-safety", title: "4. Acceptable Use & AI Sandbox Rules", icon: ShieldAlert },
    { id: "billing-subscriptions", title: "5. Subscriptions, Payments & Billing", icon: CreditCard },
    { id: "intellectual-property", title: "6. Intellectual Property & Code Ownership", icon: Scale },
    { id: "termination", title: "7. Termination & Account Suspension", icon: Ban },
    { id: "disclaimers", title: "8. Disclaimers & AI Screening Accuracy", icon: AlertTriangle },
    { id: "limitation", title: "9. Limitation of Liability & Indemnification", icon: Lock },
    { id: "governing-law", title: "10. Governing Law & Dispute Resolution", icon: Gavel },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sticky Table of Contents Sidebar */}
      <aside className="lg:col-span-1 hidden lg:block">
        <div className="sticky top-24 space-y-4 p-4 rounded-2xl bg-card shadow-xs">
          <h3 className="font-semibold text-xs text-foreground uppercase tracking-wider">Contents</h3>
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

      {/* Main Terms Content */}
      <article className="lg:col-span-3 space-y-10">
        {/* Document Header */}
        <div className="space-y-3">
          <Badge variant="outline" className="text-primary border-primary/30 px-3 py-1">
            Global Master SaaS Service Agreement
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective Date: <span className="font-medium text-foreground">{lastUpdated}</span> · Version 2.4
          </p>
        </div>

        {/* Executive Overview Callout */}
        <Card className="border-primary/20 bg-primary/5 rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-primary">
              <Scale className="h-5 w-5" /> Terms Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs md:text-sm text-muted-foreground leading-relaxed">
            These Terms of Service constitute a legally binding agreement between you and Dev-Center governing access to our recruitment platform, ATS pipeline, AI voice screening, virtual code compilers, and live collaborative WebRTC interview rooms.
          </CardContent>
        </Card>

        {/* 1. Acceptance of Terms */}
        <section id="acceptance" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By creating an account, accessing any page under `/dashboard`, `/candidate`, or `/room/*`, or using our API services, you agree to be bound by these Terms. If you are accepting these Terms on behalf of an enterprise company or hiring organization, you represent that you have full legal authority to bind that entity.
          </p>
        </section>

        {/* 2. Service Eligibility */}
        <section id="eligibility" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">2. Service Eligibility & Account Registration</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You must be at least 18 years of age or the age of legal majority in your jurisdiction to register an account. You must provide accurate, complete, and updated email address information. You are responsible for safeguarding your login credentials and salted password.
          </p>
        </section>

        {/* 3. Enterprise Workspaces & Multi-Tenancy */}
        <section id="workspaces" className="space-y-4 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">3. Enterprise Workspaces & Multi-Tenancy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dev-Center provides multi-tenant enterprise recruitment workspaces:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li><strong className="text-foreground">Organization Roles:</strong> Users assigned `OWNER` or `GLOBAL_ADMIN` roles manage company branches, employee access approvals, and subscription seats.</li>
            <li><strong className="text-foreground">Pending Approval Queue:</strong> New employees joining an existing company workspace are placed in a `PENDING_APPROVAL` queue until explicitly approved by an Organization Admin.</li>
            <li><strong className="text-foreground">Tenant Data Integrity:</strong> Users are strictly prohibited from attempting to bypass `organization_id` database parameters or access cross-tenant data.</li>
          </ul>
        </section>

        {/* 4. Acceptable Use & AI Sandbox Rules */}
        <section id="sandbox-safety" className="space-y-4 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">4. Acceptable Use & AI Sandbox Safety</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            When participating in AI coding assessments or live WebRTC interview rooms, you agree to adhere to strict acceptable use standards:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li>Do not submit malicious code, fork bombs, network scanners, or memory overflow exploits to the Gemini Virtual Compiler.</li>
            <li>Do not record or distribute live video/audio interview streams without explicit consent from all interview participants.</li>
            <li>Do not submit fraudulent or plagiarized resume documents during candidate ATS screening.</li>
          </ul>
        </section>

        {/* 5. Subscriptions, Payments & Billing */}
        <section id="billing-subscriptions" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">5. Subscriptions, Payments & Billing</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Enterprise recruitment features are offered under paid subscription tiers:
          </p>
          <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-2">
            <li>Subscriptions auto-renew on a recurring monthly or annual billing cycle via Stripe.</li>
            <li>You may upgrade, downgrade, or cancel your subscription at any time via the Billing dashboard. Paid fees are non-refundable except as required by law.</li>
          </ul>
        </section>

        {/* 6. Intellectual Property */}
        <section id="intellectual-property" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">6. Intellectual Property & Code Ownership</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            You retain 100% ownership of all source code, candidate resumes, proprietary job descriptions, and custom interview questions uploaded to your workspace. Dev-Center claims zero ownership over user submissions.
          </p>
        </section>

        {/* 7. Termination */}
        <section id="termination" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">7. Termination & Account Suspension</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We reserve the right to suspend or terminate accounts that violate our Acceptable Use policy, engage in automated compilation abuse, or fail to settle subscription fees.
          </p>
        </section>

        {/* 8. Disclaimers */}
        <section id="disclaimers" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">8. Disclaimers & AI Screening Accuracy</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dev-Center services are provided "AS IS" and "AS AVAILABLE". While our Gemini AI virtual compiler and voice screening engines deliver state-of-the-art case evaluation, hiring decisions remain the sole responsibility of the enterprise organization.
          </p>
        </section>

        {/* 9. Limitation of Liability */}
        <section id="limitation" className="space-y-3 scroll-mt-28">
          <h2 className="text-2xl font-bold text-foreground">9. Limitation of Liability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            To the maximum extent permitted by applicable law, Dev-Center shall not be liable for any indirect, incidental, special, or consequential damages arising out of your use or inability to use the platform.
          </p>
        </section>

        {/* 10. Governing Law */}
        <section id="governing-law" className="p-6 rounded-2xl border border-border bg-card space-y-3 scroll-mt-28">
          <h3 className="font-bold text-lg text-foreground">10. Governing Law & Contact</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of Delaware, USA, without regard to its conflict of law principles. For legal inquiries, contact:
          </p>
          <div className="text-xs font-mono text-primary space-y-1">
            <p>Dev-Center Legal Department</p>
            <p>Email: legal@devcenter.com</p>
          </div>
        </section>
      </article>
    </div>
  )
}
