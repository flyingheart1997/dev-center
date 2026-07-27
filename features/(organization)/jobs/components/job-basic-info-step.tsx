import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { EmploymentType, ExperienceLevel, RemoteType } from "@/types/enums"
import { CreateJobInput } from "@/features/(organization)/jobs/schemas/jobs-schemas"

interface JobBasicInfoStepProps {
  draft: CreateJobInput
  orgStructure?: {
    businessUnits: Array<{ id: string; name: string }>
    branches: Array<{ id: string; name: string; businessUnitId: string }>
    departments: Array<{ id: string; name: string; branchId: string }>
  }
  updateDraft: (partial: Partial<CreateJobInput>) => void
}

export function JobBasicInfoStep({ draft, orgStructure, updateDraft }: JobBasicInfoStepProps) {
  const filteredBranches = orgStructure?.branches.filter((b) =>
    draft.businessUnitId ? b.businessUnitId === draft.businessUnitId : true
  ) || []

  const filteredDepartments = orgStructure?.departments.filter((d) =>
    draft.branchId ? d.branchId === draft.branchId : true
  ) || []

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm font-semibold">
          Job Requisition Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g. Senior Full-Stack Engineer (React & Node.js)"
          value={draft.title}
          onChange={(e) => updateDraft({ title: e.target.value })}
          className="h-11 text-base"
        />
        <p className="text-xs text-muted-foreground">
          A clear, specific title helps attract qualified candidates.
        </p>
      </div>

      {/* Org Hierarchy Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Business Unit</Label>
          <Select
            value={draft.businessUnitId || "none"}
            onValueChange={(val) =>
              updateDraft({
                businessUnitId: val === "none" ? null : val,
                branchId: null,
                departmentId: null,
              })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Business Units</SelectItem>
              {orgStructure?.businessUnits.map((bu) => (
                <SelectItem key={bu.id} value={bu.id}>
                  {bu.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Branch Location</Label>
          <Select
            value={draft.branchId || "none"}
            onValueChange={(val) =>
              updateDraft({
                branchId: val === "none" ? null : val,
                departmentId: null,
              })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select Branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Branches</SelectItem>
              {filteredBranches.map((br) => (
                <SelectItem key={br.id} value={br.id}>
                  {br.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Department</Label>
          <Select
            value={draft.departmentId || "none"}
            onValueChange={(val) =>
              updateDraft({ departmentId: val === "none" ? null : val })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">All Departments</SelectItem>
              {filteredDepartments.map((dept) => (
                <SelectItem key={dept.id} value={dept.id}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Employment Type, Experience Level & Remote Type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Employment Type</Label>
          <Select
            value={draft.employmentType}
            onValueChange={(val) => updateDraft({ employmentType: val as EmploymentType })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={EmploymentType.FULL_TIME}>Full-Time</SelectItem>
              <SelectItem value={EmploymentType.PART_TIME}>Part-Time</SelectItem>
              <SelectItem value={EmploymentType.CONTRACT}>Contract</SelectItem>
              <SelectItem value={EmploymentType.INTERNSHIP}>Internship</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Experience Level</Label>
          <Select
            value={draft.experienceLevel}
            onValueChange={(val) => updateDraft({ experienceLevel: val as ExperienceLevel })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ExperienceLevel.ENTRY}>Entry Level</SelectItem>
              <SelectItem value={ExperienceLevel.MID}>Mid Level (2-5 yrs)</SelectItem>
              <SelectItem value={ExperienceLevel.SENIOR}>Senior Level (5+ yrs)</SelectItem>
              <SelectItem value={ExperienceLevel.LEAD}>Lead / Principal</SelectItem>
              <SelectItem value={ExperienceLevel.EXECUTIVE}>Executive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-muted-foreground">Workplace Policy</Label>
          <Select
            value={draft.remoteType}
            onValueChange={(val) => updateDraft({ remoteType: val as RemoteType })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={RemoteType.ONSITE}>Onsite Office</SelectItem>
              <SelectItem value={RemoteType.HYBRID}>Hybrid Workplace</SelectItem>
              <SelectItem value={RemoteType.REMOTE}>Fully Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Salary & Location */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salaryMin" className="text-xs font-medium text-muted-foreground">
            Min Salary ({draft.currency})
          </Label>
          <Input
            id="salaryMin"
            type="number"
            placeholder="80000"
            value={draft.salaryMin ?? ""}
            onChange={(e) =>
              updateDraft({
                salaryMin: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryMax" className="text-xs font-medium text-muted-foreground">
            Max Salary ({draft.currency})
          </Label>
          <Input
            id="salaryMax"
            type="number"
            placeholder="140000"
            value={draft.salaryMax ?? ""}
            onChange={(e) =>
              updateDraft({
                salaryMax: e.target.value ? parseFloat(e.target.value) : null,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-xs font-medium text-muted-foreground">
            Currency
          </Label>
          <Select
            value={draft.currency}
            onValueChange={(val) => updateDraft({ currency: val })}
          >
            <SelectTrigger className="h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="CAD">CAD ($)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Primary Location */}
      <div className="space-y-2">
        <Label htmlFor="location" className="text-sm font-semibold">
          Primary Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="location"
          placeholder="e.g. San Francisco, CA / Remote"
          value={draft.location}
          onChange={(e) => updateDraft({ location: e.target.value })}
        />
      </div>

      {/* Internal Only Switch */}
      <div className="flex items-center justify-between rounded-lg border border-border p-4 bg-card">
        <div className="space-y-0.5">
          <Label className="text-sm font-semibold">Internal Portal Only</Label>
          <p className="text-xs text-muted-foreground">
            Restrict this requisition to existing employees for internal transfers and promotions.
          </p>
        </div>
        <Switch
          checked={draft.isInternalOnly}
          onCheckedChange={(checked) => updateDraft({ isInternalOnly: checked })}
        />
      </div>
    </div>
  )
}
