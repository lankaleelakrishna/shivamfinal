"use client";

import { Component, type ReactNode } from "react";

interface Props {
  onError: () => void;
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/** Swaps a 3D scene for its fallback if the chunk fails to load or the scene throws. */
export class SceneErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    if (process.env.NODE_ENV !== "production") console.warn("[3D] scene disabled:", error);
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
