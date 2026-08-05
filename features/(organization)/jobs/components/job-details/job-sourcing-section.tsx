"use client"

import * as React from "react"
import { Globe, Copy, CheckCircle2, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip } from "@/components/ui/tooltip"
import { getAppUrl } from "@/lib/utils/url-utils"
import { useJobDetails } from "../../hooks/use-job-details"

export function JobSourcingSection() {
  const { job, handleCopyShareLink } = useJobDetails()

  if (!job) return null

  const defaultPublicUrl = `${getAppUrl()}/jobs/${job.id}`

  const posts = job.jobBoardPosts || [
    {
      id: "board-1",
      boardName: "LinkedIn Jobs",
      status: "Published",
      applicantCount: 28,
      url: "https://www.linkedin.com/jobs",
    },
    {
      id: "board-2",
      boardName: "Indeed Enterprise",
      status: "Published",
      applicantCount: 14,
      url: "https://www.indeed.com",
    },
    {
      id: "board-3",
      boardName: "Dev Center Career Portal",
      status: "Published",
      applicantCount: 42,
      url: defaultPublicUrl,
    },
  ]

  return (
    <Card className="border border-border shadow-xs pt-0">
      <CardHeader className="py-4 shadow-sm dark:bg-neutral-800 flex flex-row items-center justify-between gap-2">
        <div className="space-y-0.5 min-w-0 flex-1">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5 truncate">
            <Globe className="h-3.5 w-3.5 text-primary shrink-0" /> Connected Job Boards ({posts.length})
          </CardTitle>
          <CardDescription className="text-[10px] text-muted-foreground truncate">
            Multi-channel distribution network
          </CardDescription>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyShareLink}
          className="h-6 text-[10px] font-semibold gap-1 px-2 shrink-0"
        >
          <Copy className="h-2.5 w-2.5" /> Share
        </Button>
      </CardHeader>

      <CardContent className="space-y-3 pt-3 text-xs min-w-0">
        <div className="space-y-2">
          {posts.map((post: any) => {
            const postUrl = post.url || post.postUrl || defaultPublicUrl

            return (
              <div
                key={post.id || post.boardName}
                className="p-2.5 rounded-lg border border-border/80 bg-muted/30 flex items-center justify-between gap-2 text-xs hover:border-primary/40 transition-all min-w-0 group"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div className="h-7 w-7 rounded-md bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shrink-0">
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="font-semibold text-foreground truncate text-[11px]">
                      {post.boardName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      Applicants: <strong className="text-foreground">{post.applicantCount || 0}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant="outline"
                    className="text-[9px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 py-0.5 px-1.5"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" /> Active
                  </Badge>

                  <Tooltip content={`Open ${post.boardName} posting`}>
                    <a
                      href={postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center justify-center"
                    >
                      <ArrowUpRight className="h-4 w-4 shrink-0" />
                    </a>
                  </Tooltip>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
