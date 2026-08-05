import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Clock, Users, ArrowUp, ArrowDown } from "lucide-react"
import { RoundCategory } from "@/types/enums"
import { CreateJobInput, JobRoundInput } from "@/features/(organization)/jobs/schemas/jobs-schemas"
import { cn } from "@/lib/utils"

interface JobRoundsStepProps {
  draft: CreateJobInput
  employees?: Array<{
    id: string
    role: string
    user: { name: string | null; email: string | null; image: string | null }
    department?: { name: string } | null
  }>
  updateDraft: (partial: Partial<CreateJobInput>) => void
  addRound: () => void
  removeRound: (index: number) => void
  updateRound: (index: number, updated: Partial<JobRoundInput>) => void
}

export function JobRoundsStep({
  draft,
  employees = [],
  addRound,
  removeRound,
  updateRound,
  updateDraft,
}: JobRoundsStepProps) {
  const moveRound = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= draft.rounds.length) return

    const newRounds = [...draft.rounds]
    const temp = newRounds[index]
    newRounds[index] = newRounds[targetIndex]
    newRounds[targetIndex] = temp

    // Recalculate order index
    const reordered = newRounds.map((r, i) => ({ ...r, orderIndex: i }))
    updateDraft({ rounds: reordered })
  }

  const toggleInterviewer = (roundIndex: number, employeeId: string) => {
    const round = draft.rounds[roundIndex]
    const currentIds = round.interviewerIds || []

    const updatedIds = currentIds.includes(employeeId)
      ? currentIds.filter((id) => id !== employeeId)
      : [...currentIds, employeeId]

    updateRound(roundIndex, { interviewerIds: updatedIds })
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold">Custom Interview Rounds Pipeline</h3>
          <p className="text-xs text-muted-foreground">
            Define the sequential interview evaluation stages for this job requisition.
          </p>
        </div>
        <Button type="button" onClick={addRound} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Add Round
        </Button>
      </div>

      <div className="space-y-4">
        {draft.rounds.map((round, index) => (
          <Card key={index} className="border border-border shadow-xs">
            <CardContent className="p-4 space-y-4">
              {/* Header row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-mono text-xs">
                    Round {index + 1}
                  </Badge>
                  <Input
                    value={round.title}
                    onChange={(e) => updateRound(index, { title: e.target.value })}
                    className="h-9 font-semibold max-w-md text-sm"
                    placeholder="Round Title"
                  />
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === 0}
                    onClick={() => moveRound(index, "up")}
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={index === draft.rounds.length - 1}
                    onClick={() => moveRound(index, "down")}
                    className="h-8 w-8 text-muted-foreground"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRound(index)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Evaluation Category</Label>
                  <Select
                    value={round.category}
                    onValueChange={(val) => updateRound(index, { category: val as RoundCategory })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={RoundCategory.SCREENING}>AI Pre-Screening</SelectItem>
                      <SelectItem value={RoundCategory.TECHNICAL}>Technical Coding Assessment</SelectItem>
                      <SelectItem value={RoundCategory.DESIGN}>System Design & Architecture</SelectItem>
                      <SelectItem value={RoundCategory.BEHAVIORAL}>Behavioral & HR Culture</SelectItem>
                      <SelectItem value={RoundCategory.MANAGEMENT}>Executive Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Duration (Minutes)
                  </Label>
                  <Select
                    value={String(round.durationMinutes || 45)}
                    onValueChange={(val) => updateRound(index, { durationMinutes: parseInt(val) })}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes (1 hour)</SelectItem>
                      <SelectItem value="90">90 minutes (1.5 hours)</SelectItem>
                      <SelectItem value="120">120 minutes (2 hours)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Default Interviewers Selection */}
              <div className="space-y-2 pt-2 border-t border-border/50">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Assigned Interviewers ({round.interviewerIds?.length || 0})
                </Label>

                <div className="flex flex-wrap gap-2 pt-1 max-h-36 overflow-y-auto">
                  {employees.length === 0 ? (
                    <span className="text-xs text-muted-foreground">
                      No active organization employees found.
                    </span>
                  ) : (
                    employees.map((emp) => {
                      const isSelected = round.interviewerIds?.includes(emp.id)
                      return (
                        <Button
                          key={emp.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          size="xs"
                          onClick={() => toggleInterviewer(index, emp.id)}
                          className={cn("h-7 text-xs font-medium gap-1.5", !isSelected && "bg-muted/40 text-muted-foreground")}
                        >
                          {emp.user.name || emp.user.email}
                          <span className="opacity-70 text-[10px]">({emp.role})</span>
                        </Button>
                      )
                    })
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
