import {create} from 'zustand';

type State = {
  isOpen: boolean;
};

type Actions = {
  toggle(): void;
  open(): void;
  close(): void;
};

export const sidebarStore = create<State & Actions>(set => ({
  isOpen: true,

  close: () => set({isOpen: false}),
  open: () => set({isOpen: true}),
  toggle: () => set(prev => ({...prev, isOpen: !prev.isOpen})),
}));
