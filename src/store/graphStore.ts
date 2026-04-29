import { create } from "zustand";

interface GraphState {
    selectedNode: string | null;
    detailNode: string | null;
    chain: {upstream: Set<string>, downstream: Set<string>}
    toast: {message: string, type: "success" | "error" | "info"} | null;
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

export const useGraphStore = create<GraphState>((set) => ({
    selectedNode: null,
    detailNode: null,
    chain: {upstream: new Set(), downstream: new Set()},
    toast: null,

    selectNode: (id, upstream, downstream) => set({
        selectedNode: id, chain: {upstream, downstream}
    }),
    clearSelection: () => set({
        selectedNode: null, chain: {upstream: new Set(), downstream: new Set()}
    }),
    
    openDetail: (id) => set({detailNode: id}),
    closeDetail: () => set({detailNode: null}),

    showToast: (message, type = "success") => set({toast: {message, type}}),
    hideToast: () => set({toast: null}),
}));