import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Organization, Membership } from '@/types/api';

interface WorkspaceState {
  currentWorkspace: Organization | null;
  memberships: Membership[];
  isLoading: boolean;
  error: string | null;
  setCurrentWorkspace: (workspace: Organization | null) => void;
  setMemberships: (memberships: Membership[]) => void;
  addMembership: (membership: Membership) => void;
  updateMembership: (userId: string, role: Membership['role']) => void;
  removeMembership: (userId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set) => ({
      currentWorkspace: null,
      memberships: [],
      isLoading: false,
      error: null,

      setCurrentWorkspace: (workspace) => {
        set({ currentWorkspace: workspace });
      },

      setMemberships: (memberships) => {
        set({ memberships });
      },

      addMembership: (membership) => {
        set((state) => ({
          memberships: [...state.memberships, membership],
        }));
      },

      updateMembership: (userId, role) => {
        set((state) => ({
          memberships: state.memberships.map((m) =>
            m.userId === userId ? { ...m, role } : m
          ),
        }));
      },

      removeMembership: (userId) => {
        set((state) => ({
          memberships: state.memberships.filter((m) => m.userId !== userId),
        }));
      },

      setLoading: (isLoading) => {
        set({ isLoading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'secureflow-workspace',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentWorkspace: state.currentWorkspace,
        memberships: state.memberships,
      }),
    }
  )
);