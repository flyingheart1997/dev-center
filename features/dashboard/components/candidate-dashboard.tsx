
"use client";
import React from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, FileText, Code2, Sparkles, ArrowRight } from "lucide-react"


export function CandidateDashboard() {
    const prepTools = [
        {
            title: "AI Voice Mock Interview Arena",
            description: "Practice real-time verbal technical & behavioral interviews with instant Gemini voice feedback.",
            icon: Mic,
            color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            link: "/voice-arena",
            action: "Start Voice Simulation",
        },
        {
            title: "ATS Resume Studio & Parser",
            description: "Audit your resume against real job descriptions with keyword match scoring & AI suggestions.",
            icon: FileText,
            color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            link: "/resume-studio",
            action: "Analyze Resume",
        },
        {
            title: "AI Virtual Code Compiler Arena",
            description: "Solve algorithmic & system design coding challenges with test case execution by AI virtual compiler.",
            icon: Code2,
            color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            link: "/coding-practice",
            action: "Open Code Editor",
        },
    ]

    return (
        <div className="space-y-8">
            {/* Hero Welcome Banner */}
            <div className="rounded-2xl p-6 md:p-8 bg-linear-to-r from-emerald-600 to-teal-700 text-white shadow-lg relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-3">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 border-none px-3 py-1">
                        <Sparkles className="h-3.5 w-3.5 mr-1" /> Candidate AI Hub
                    </Badge>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                        Ready to Ace Your Next Tech Interview?
                    </h1>
                    <p className="text-emerald-100 text-sm md:text-base">
                        Train with our Gemini AI voice simulator, optimize your resume for ATS parsers, and execute code live.
                    </p>
                </div>
            </div>

            {/* AI Prep Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {prepTools.map((tool, i) => {
                    const Icon = tool.icon
                    return (
                        <Card key={i} className="border-border shadow-xs hover:border-emerald-500/50 transition duration-200 flex flex-col justify-between">
                            <CardHeader className="space-y-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tool.color}`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-lg font-semibold text-foreground">{tool.title}</CardTitle>
                                <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                                    {tool.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-2">
                                <Button className="w-full h-10 bg-emerald-600 hover:bg-emerald-700 text-white" asChild>
                                    <Link href={tool.link}>
                                        {tool.action}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}