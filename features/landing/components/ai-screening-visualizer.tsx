"use client"

import * as React from "react"
import {
  Sparkles,
  Mic,
  Code2,
  Check,
  Play,
  Pause,
  Layers,
  Cpu
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function AIScreeningVisualizer() {
  const [isPlaying, setIsPlaying] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<"voice" | "compiler">("voice")

  const waveformHeights = [
    35, 65, 45, 85, 95, 60, 40, 75, 90, 100, 80, 50, 70, 95, 65, 85, 40, 75, 90, 60,
    45, 80, 100, 70, 50, 85, 60, 40, 75, 95, 65, 80, 50, 70
  ]

  return (
    <section id="ai-screening" className="py-16 md:py-20 border-b border-border/40">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">

        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <Badge variant="outline" className="px-3 py-1 text-xs">
            <Sparkles className="h-3.5 w-3.5 mr-1" />
            AI Pre-Screening Pipeline
          </Badge>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Screen 1,000s of Candidates on Autopilot with Gemini AI
          </h2>

          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Eliminate manual screening bottlenecks. Our AI engine conducts automated verbal technical interviews while compiling candidate code in real-time.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">

            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1">
              <div className="flex items-center gap-2">
                <Mic className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Automated AI Voice Mock Interviews</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                Gemini asks adaptive technical theory questions, evaluates vocal clarity, and generates structured scorecards.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Backend Gemini Virtual Compiler</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                Test Python, Java, Go, C++, and Node.js code against custom test cases without heavy Docker container overhead.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <h3 className="font-bold text-sm text-foreground">Sandpack Frontend Web Sandbox</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                Evaluate React, HTML, and CSS candidates in an isolated browser runtime with live visual preview rendering.
              </p>
            </div>

          </div>

          {/* Right Column: Visualizer Widget (7 cols) */}
          <div className="lg:col-span-7">
            <Card className="p-4 sm:p-5 border-border/70 bg-card shadow-xl space-y-4">

              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant={activeTab === "voice" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("voice")}
                    className="h-8 text-xs font-medium"
                  >
                    <Mic className="h-3.5 w-3.5 mr-1" />
                    AI Voice Assessment
                  </Button>
                  <Button
                    variant={activeTab === "compiler" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("compiler")}
                    className="h-8 text-xs font-medium"
                  >
                    <Code2 className="h-3.5 w-3.5 mr-1" />
                    Virtual Compiler
                  </Button>
                </div>

                <Badge variant="secondary" className="text-[10px]">AI Evaluated</Badge>
              </div>

              {activeTab === "voice" && (
                <div className="space-y-4 animate-in fade-in-50 duration-200">
                  <div className="flex items-center justify-between bg-muted/40 p-3 rounded-lg border border-border/40">
                    <div className="flex items-center gap-3">
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="h-8 w-8 rounded-full shrink-0 shadow-xs"
                      >
                        {isPlaying ? <Pause className="h-3.5 w-3.5 text-primary" /> : <Play className="h-3.5 w-3.5 fill-primary text-primary" />}
                      </Button>
                      <div>
                        <div className="text-xs font-semibold text-foreground">Audio Response Playback</div>
                        <div className="text-[10px] text-muted-foreground">Topic: Distributed Caching & Rate Limiting</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground font-semibold">01:14 / 02:30</span>
                  </div>

                  {/* High-Contrast Vibrant Audio Waveform Visualizer */}
                  <div className="h-16 bg-zinc-950 border border-purple-500/30 rounded-xl p-3 flex items-center justify-center gap-1.5 overflow-hidden shadow-inner">
                    {waveformHeights.map((h, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 rounded-full transition-all duration-300 ${isPlaying
                            ? 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.7)]'
                            : 'bg-purple-500/40'
                          }`}
                        style={{
                          height: isPlaying ? `${h}%` : '20%',
                          opacity: isPlaying ? (idx % 2 === 0 ? 1 : 0.85) : 0.4
                        }}
                      />
                    ))}
                  </div>

                  <div className="p-3 bg-muted/30 rounded-lg text-xs space-y-1.5 border border-border/40 text-left">
                    <p className="text-foreground/90 italic leading-relaxed">
                      &ldquo;We implemented Redis Token Bucket rate limiting to handle peak traffic during flash sales, ensuring our API gateway returns 429 Too Many Requests safely.&rdquo;
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "compiler" && (
                <div className="space-y-3 animate-in fade-in-50 duration-200">
                  <div className="bg-zinc-950 text-zinc-100 p-3.5 rounded-lg font-mono text-xs space-y-1 border border-zinc-800 text-left">
                    <div className="text-zinc-500"># solution.py (Gemini Virtual Execution)</div>
                    <div><span className="text-purple-400">def</span> <span className="text-blue-400">isValidBST</span>(root):</div>
                    <div className="pl-4"><span className="text-purple-400">def</span> <span className="text-blue-400">validate</span>(node, low=float(&apos;-inf&apos;), high=float(&apos;inf&apos;)):</div>
                    <div className="pl-8"><span className="text-purple-400">if not</span> node: <span className="text-purple-400">return True</span></div>
                    <div className="pl-8"><span className="text-purple-400">if</span> node.val &lt;= low <span className="text-purple-400">or</span> node.val &gt;= high: <span className="text-purple-400">return False</span></div>
                    <div className="pl-8"><span className="text-purple-400">return</span> validate(node.left, low, node.val) <span className="text-purple-400">and</span> validate(node.right, node.val, high)</div>
                  </div>

                  <div className="flex items-center justify-between bg-muted/40 p-2.5 rounded-lg text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-foreground">
                      <Check className="h-3.5 w-3.5 text-emerald-500" /> 3 / 3 Test Cases Passed
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground">Passed (0.4ms)</span>
                  </div>
                </div>
              )}

            </Card>
          </div>

        </div>

      </div>
    </section>
  )
}
