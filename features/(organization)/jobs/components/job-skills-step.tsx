import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, X, Sparkles } from "lucide-react"
import { CreateJobInput } from "@/features/(organization)/jobs/schemas/jobs-schemas"

interface JobSkillsStepProps {
  draft: CreateJobInput
  updateDraft: (partial: Partial<CreateJobInput>) => void
}

const suggestedSkills = [
  "React",
  "TypeScript",
  "Node.js",
  "Next.js",
  "PostgreSQL",
  "Python",
  "GraphQL",
  "Docker",
  "AWS",
  "Kubernetes",
  "System Design",
  "Tailwind CSS",
  "Redis",
  "Microservices",
]

const sampleDescriptionTemplate = `### About the Role
We are seeking an ambitious Senior Full-Stack Engineer to lead the design and deployment of critical microservices and modern real-time WebRTC collaborative tools.

### Key Responsibilities:
• Architect, build, and maintain high-throughput backend APIs using Node.js, tRPC, and Prisma ORM.
• Design responsive, visually captivating client applications using Next.js 16 (App Router) and Tailwind CSS.
• Participate in technical round interviews and system architecture reviews for candidates.
• Mentor junior developers and enforce unit test coverage and clean architectural principles.

### Minimum Qualifications:
• 4+ years of professional full-stack development experience.
• Mastery of TypeScript, React 19, Node.js, and relational database systems (PostgreSQL).
• Proven background building multi-tenant SaaS systems or WebRTC video/audio applications.`

export function JobSkillsStep({ draft, updateDraft }: JobSkillsStepProps) {
  const [tagInput, setTagInput] = useState("")

  const addSkillTag = (skillName: string) => {
    const trimmed = skillName.trim()
    if (!trimmed) return
    if (draft.skills.includes(trimmed)) return

    updateDraft({ skills: [...draft.skills, trimmed] })
    setTagInput("")
  }

  const removeSkillTag = (skillToRemove: string) => {
    updateDraft({ skills: draft.skills.filter((s) => s !== skillToRemove) })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkillTag(tagInput)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Skill Tagger */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">
          Required Tech Skills & Competencies <span className="text-destructive">*</span>
        </Label>

        {/* Selected skills list */}
        <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border bg-card min-h-13">
          {draft.skills.length === 0 ? (
            <span className="text-xs text-muted-foreground self-center">
              No skills added yet. Type below or select from suggested tags.
            </span>
          ) : (
            draft.skills.map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="px-3 py-1 text-sm font-medium flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20"
              >
                {skill}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => removeSkillTag(skill)}
                  className="h-4 w-4 p-0 text-primary hover:text-destructive hover:bg-transparent"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </Badge>
            ))
          )}
        </div>

        {/* Input box */}
        <div className="flex gap-2">
          <Input
            placeholder="Type a skill (e.g. Next.js) and press Enter"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="h-10"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addSkillTag(tagInput)}
            disabled={!tagInput.trim()}
          >
            <Plus className="w-4 h-4 mr-1" /> Add Tag
          </Button>
        </div>

        {/* Suggested Skills */}
        <div className="space-y-1.5 pt-1">
          <span className="text-xs font-medium text-muted-foreground">Suggested Skills:</span>
          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills
              .filter((s) => !draft.skills.includes(s))
              .map((suggested) => (
                <Button
                  key={suggested}
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => addSkillTag(suggested)}
                  className="h-6 text-xs px-2.5 py-0.5 bg-muted/40 font-normal text-muted-foreground hover:text-foreground"
                >
                  + {suggested}
                </Button>
              ))}
          </div>
        </div>
      </div>

      {/* Description Editor */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-sm font-semibold">
            Detailed Job Description & Responsibilities <span className="text-destructive">*</span>
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => updateDraft({ description: sampleDescriptionTemplate })}
            className="text-xs text-primary hover:text-primary/80"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Use Sample Template
          </Button>
        </div>

        <Textarea
          id="description"
          placeholder="Describe the job overview, key responsibilities, requirements, and culture..."
          rows={12}
          value={draft.description}
          onChange={(e) => updateDraft({ description: e.target.value })}
          className="font-mono text-sm leading-relaxed"
        />
        <p className="text-xs text-muted-foreground">
          Markdown formatting is supported. Clear expectations help Gemini AI generate precise interview evaluation rubrics.
        </p>
      </div>
    </div>
  )
}
