import { create } from 'zustand'

export type Toast = { id: number; message: string; action?: { label: string; to: string } }

type ToastState = {
  toasts: Toast[]
  show: (message: string, action?: Toast['action']) => void
  dismiss: (id: number) => void
}

let nextId = 1

export const useToast = create<ToastState>()((set, get) => ({
  toasts: [],
  show: (message, action) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, action }] }))
    window.setTimeout(() => get().dismiss(id), 3500)
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
