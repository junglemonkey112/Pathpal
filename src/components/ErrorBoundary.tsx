"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-[200px] flex items-center justify-center">
          <div className="text-center px-4">
            <p className="text-text-primary font-semibold mb-2">Something went wrong</p>
            <p className="text-text-tertiary text-sm mb-4">Please try refreshing the page.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-light transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
