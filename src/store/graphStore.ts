import { create } from "zustand";

interface GraphState {
    selectedNodeId: string | null;
    detailNodeId: string | null;
    chain: {upstream: Set<string>, downstream: Set<string>}
    toast: {message: string, type: "success" | "error"} | null;
    //selection
    selectNode: (id: string, upstream: Set<string>, downstream: Set<string>) => void;
    clearSelection: () => void;
    //detail modal
    openDetail: (id: string) => void;
    closeDetail: () => void;
    //toast
    showToast: (message: string, type?: "success" | "error") => void;
    hideToast: () => void;
}

export const useGraphStore = create<GraphState>((set, get) => ({
    selectedNodeId: null,
    detailNodeId: null,
    chain: {upstream: new Set(), downstream: new Set()},
    toast: null,

    selectNode: (id, upstream, downstream) => set({
        selectedNodeId: id, chain: {upstream, downstream}
    }),
    clearSelection: () => set({
        selectedNodeId: null, chain: {upstream: new Set(), downstream: new Set()}
    }),

    openDetail: (id) => set({detailNodeId: id}),
    closeDetail: () => set({detailNodeId: null}),

    showToast: (message, type = 'success') => {
        set({ toast: { message, type } })
        setTimeout(() => get().hideToast(), 3000)
    },
    hideToast: () => set({ toast: null }),
}));