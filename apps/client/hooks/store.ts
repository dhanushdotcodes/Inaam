import { create } from "zustand";
import { getPoints } from "@/lib/api";

interface SidebarState {
  isOpen: boolean;
  isDesktop: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsDesktop: (isDesktop: boolean) => void;
  toggle: () => void;
}

interface PointsState {
  balance: number | null;
  loading: boolean;
  error: string | null;
  fetchPoints: () => Promise<void>;
}

interface AppState {
  sidebar: SidebarState;
  points: PointsState;
}

export const useAppStore = create<AppState>((set, get) => ({
  sidebar: {
    isOpen: true,
    isDesktop: false,
    setIsOpen: (isOpen) => set((state) => ({ 
      sidebar: { ...state.sidebar, isOpen } 
    })),
    setIsDesktop: (isDesktop) => set((state) => ({ 
      sidebar: { ...state.sidebar, isDesktop, isOpen: isDesktop } 
    })),
    toggle: () => set((state) => ({ 
      sidebar: { ...state.sidebar, isOpen: !state.sidebar.isOpen } 
    })),
  },
  points: {
    balance: null,
    loading: false,
    error: null,
    fetchPoints: async () => {
      try {
        set((state) => ({ points: { ...state.points, loading: true, error: null } }));
        const balance = await getPoints();
        set((state) => ({ points: { ...state.points, balance, loading: false } }));
      } catch (err) {
        set((state) => ({ 
          points: { 
            ...state.points, 
            error: err instanceof Error ? err.message : "Failed to fetch points", 
            loading: false 
          } 
        }));
      }
    },
  },
}));
