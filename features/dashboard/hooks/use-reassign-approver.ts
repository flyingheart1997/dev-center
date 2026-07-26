"use client"

import { useState } from "react"

export interface EligibleApprover {
  id: string
  name: string
  email: string
  role: string
}

export const MOCK_ELIGIBLE_APPROVERS: EligibleApprover[] = [
  { id: "emp-1", name: "Aarav Sharma", email: "aarav.sharma@devcenter.io", role: "VP of Engineering" },
  { id: "emp-2", name: "Neha Verma", email: "neha.verma@devcenter.io", role: "Head of HR" },
  { id: "emp-3", name: "Vikram Malhotra", email: "vikram.m@devcenter.io", role: "Global Admin" },
  { id: "emp-4", name: "Priya Patel", email: "priya.patel@devcenter.io", role: "Branch Admin" },
]

interface UseReassignApproverProps {
  requisitionId: string
  currentApproverName: string
  onSuccess?: (newApproverName: string) => void
}

export function useReassignApprover({
  requisitionId,
  currentApproverName,
  onSuccess,
}: UseReassignApproverProps) {
  const [selectedApproverId, setSelectedApproverId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeApproverName, setActiveApproverName] = useState(currentApproverName)

  const handleSelectApprover = async (approver: EligibleApprover) => {
    if (approver.name === activeApproverName) return

    setSelectedApproverId(approver.id)
    setIsSubmitting(true)

    try {
      // Simulate API mutation delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      setActiveApproverName(approver.name)
      onSuccess?.(approver.name)
    } catch (error) {
      console.error("Failed to reassign approver:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    eligibleApprovers: MOCK_ELIGIBLE_APPROVERS,
    activeApproverName,
    selectedApproverId,
    isSubmitting,
    handleSelectApprover,
  }
}
