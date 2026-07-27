import { create } from "zustand"

interface CandidatesStoreState {
  selectedApplicationId: string | null
  isCandidateDrawerOpen: boolean
  openCandidateDrawer: (applicationId: string) => void
  closeCandidateDrawer: () => void
}

export const useCandidatesStore = create<CandidatesStoreState>((set) => ({
  selectedApplicationId: null,
  isCandidateDrawerOpen: false,
  openCandidateDrawer: (applicationId) =>
    set({ selectedApplicationId: applicationId, isCandidateDrawerOpen: true }),
  closeCandidateDrawer: () =>
    set({ isCandidateDrawerOpen: false, selectedApplicationId: null }),
}))
