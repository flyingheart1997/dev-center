"use client"

import * as React from "react"
import { 
  Video, 
  Mic, 
  Code2, 
  Star, 
  Share2,
  PhoneOff,
  Lock,
  MessageSquare,
  FileText,
  Users
} from "lucide-react"
import { motion } from "motion/react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { FadeInWhenVisible, ParallaxGlow } from "./landing-motion"

export function LiveInterviewVisualizer() {
  return (
    <section id="live-interviews" className="relative py-16 md:py-20 border-b border-border/40 bg-muted/10 overflow-hidden">
      <ParallaxGlow offset={60} className="w-112.5 h-112.5 bg-blue-500/10 top-[20%] -left-20" />

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <FadeInWhenVisible delay={0}>
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <Badge variant="outline" className="px-3 py-1 text-xs">
              <Video className="h-3.5 w-3.5 mr-1 text-primary" />
              Collaborative WebRTC Environment
            </Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Host Live Video Calls & Shared Pair-Coding Rooms
            </h2>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              No more switching between Zoom, CoderPad, and Google Docs. Problem statements, shared Monaco code editors, LiveKit video feeds, and scorecards in one interface.
            </p>
          </div>
        </FadeInWhenVisible>

        {/* 3-Column IDE Layout with Full-Width Meeting Bottom Toolbar */}
        <FadeInWhenVisible distance={40} delay={0.2}>
          <div className="rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-100 shadow-2xl overflow-hidden font-sans">
          
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900/90 border-b border-zinc-800 text-xs">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
              </div>
              <span className="h-3 w-px bg-zinc-700 mx-1" />
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold text-zinc-200">Live Interview Room #804</span>
                <span className="text-zinc-500 text-[10px]">· Senior Frontend Engineer</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300 bg-zinc-800/60">
                <Lock className="h-2.5 w-2.5 mr-1 text-emerald-400" /> LiveKit Encrypted
              </Badge>
            </div>
          </div>

          {/* 3 Columns Body */}
          <div className="p-3 grid grid-cols-1 md:grid-cols-12 gap-3 bg-zinc-950">
            
            {/* COLUMN 1 (LEFT): Problem Statement & Questions (3 cols) */}
            <div className="md:col-span-3 bg-zinc-900/80 rounded-lg p-3 border border-zinc-800 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Problem Statement
                  </div>
                  <Badge variant="outline" className="text-[9px] border-amber-500/40 text-amber-400">Medium</Badge>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-zinc-100">1. Implement LRU Cache</h4>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Design a data structure that follows the constraints of a Least Recently Used (LRU) cache with O(1) time complexity for <code className="text-blue-400 font-mono">get</code> and <code className="text-blue-400 font-mono">put</code>.
                  </p>
                </div>

                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Constraints:</span>
                  <ul className="text-[10px] text-zinc-400 space-y-0.5 list-disc pl-3">
                    <li>Capacity: 1 &le; cap &le; 3000</li>
                    <li>Time Complexity: O(1) average</li>
                  </ul>
                </div>
              </div>

              <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Test Cases Status:</span>
                <span className="text-emerald-400 font-mono font-bold">2/2 Passed</span>
              </div>
            </div>

            {/* COLUMN 2 (CENTER): Shared Monaco Code Editor (6 cols) */}
            <div className="md:col-span-6 bg-zinc-900/90 rounded-lg border border-zinc-800 flex flex-col justify-between overflow-hidden">
              
              <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-950/90 border-b border-zinc-800 text-[11px] font-mono">
                <div className="flex items-center gap-1.5 text-zinc-200">
                  <Code2 className="h-3.5 w-3.5 text-blue-400" />
                  <span>solution.tsx</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-mono">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>50ms Live Sync</span>
                </div>
              </div>

              <div className="p-3 font-mono text-[11px] leading-relaxed text-zinc-200 space-y-1 overflow-x-auto">
                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-4 text-right">1</span>
                  <span className="text-zinc-500">{"// Task: Implement LRU Cache with O(1) ops"}</span>
                </div>

                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-4 text-right">2</span>
                  <div><span className="text-purple-400">export class</span> <span className="text-blue-400">LRUCache</span> &#123;</div>
                </div>

                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-4 text-right">3</span>
                  <div className="pl-4">private capacity: number;</div>
                </div>

                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-4 text-right">4</span>
                  <div className="pl-4">
                    private cache: Map&lt;number, number&gt;;
                    <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="inline-block w-1.5 h-3.5 bg-blue-400 align-middle ml-1" />
                  </div>
                </div>

                <div className="flex gap-3 bg-emerald-500/10 -mx-3 px-3 py-0.5 rounded border-l-2 border-emerald-500">
                  <span className="text-zinc-600 select-none w-4 text-right">5</span>
                  <div className="pl-4 relative flex items-center gap-1">
                    <span className="text-purple-400">get</span>(key: number): number &#123;
                    <span className="bg-emerald-500 text-black text-[9px] px-1 rounded font-sans font-bold ml-1 animate-pulse">
                      David (Candidate)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-4 text-right">6</span>
                  <div className="pl-8">if (!this.cache.has(key)) return -1;</div>
                </div>

                <div className="flex gap-3">
                  <span className="text-zinc-600 select-none w-4 text-right">7</span>
                  <div>&#125;</div>
                </div>
              </div>

              <div className="px-3 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400 text-[11px]">Interviewer Scorecard:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="text-[11px] font-bold text-white ml-1 font-mono">5.0 Strong Hire</span>
                </div>
              </div>

            </div>

            {/* COLUMN 3 (RIGHT): Joined Users & Video Streams (3 cols) */}
            <div className="md:col-span-3 bg-zinc-900/80 rounded-lg p-2.5 border border-zinc-800 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
                    <Users className="h-3.5 w-3.5 text-primary" />
                    Joined Users (2)
                  </div>
                </div>

                {/* Interviewer Stream Tile */}
                <div className="relative aspect-video rounded-md bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-zinc-800 text-white font-bold text-[10px]">HM</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.2 rounded text-[9px] text-zinc-300">
                    Interviewer (You)
                  </div>
                </div>

                {/* Candidate Stream Tile */}
                <div className="relative aspect-video rounded-md bg-zinc-950 border border-emerald-500/50 ring-1 ring-emerald-500/30 overflow-hidden flex items-center justify-center">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-zinc-800 text-emerald-400 font-bold text-[10px]">DC</AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-1 left-1 bg-black/70 px-1 py-0.2 rounded text-[9px] text-zinc-300">
                    David Chen
                  </div>
                  <span className="absolute top-1 right-1 px-1 rounded bg-emerald-500/20 text-emerald-400 text-[8px] font-mono">
                    Speaking
                  </span>
                </div>
              </div>

              <div className="p-2 bg-zinc-950 rounded border border-zinc-800 text-[10px] text-zinc-400 flex items-center justify-between">
                <span>Room Quality:</span>
                <span className="text-emerald-400 font-medium">HD 1080p</span>
              </div>
            </div>

          </div>

          {/* Bottom Full-Width Meeting Control Toolbar */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-zinc-900 border-t border-zinc-800 text-xs">
            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>LiveKit Audio & Video Stream Active</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80">
                <Mic className="h-3 w-3 mr-1" /> Mute
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80">
                <Video className="h-3 w-3 mr-1" /> Camera
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80">
                <Share2 className="h-3 w-3 mr-1" /> Share Screen
              </Button>
              <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80">
                <MessageSquare className="h-3 w-3 mr-1" /> Chat
              </Button>
              <Button size="sm" className="h-7 px-3 text-xs bg-red-600 hover:bg-red-700 text-white font-semibold gap-1 ml-1">
                <PhoneOff className="h-3 w-3" /> End Call
              </Button>
            </div>

            <div className="hidden sm:block text-[11px] text-zinc-400 font-mono">
              Dev-Center WebRTC
            </div>
          </div>

        </div>
        </FadeInWhenVisible>

      </div>
    </section>
  )
}
