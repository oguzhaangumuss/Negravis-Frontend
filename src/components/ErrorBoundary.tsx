'use client';

import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressWarnings?: boolean;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Only log in development and if not suppressing warnings
    if (process.env.NODE_ENV === 'development' && !this.props.suppressWarnings) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  componentDidMount() {
    // Suppress React StrictMode warnings for third-party components
    if (this.props.suppressWarnings && process.env.NODE_ENV === 'development') {
      const originalConsoleError = console.error;
      console.error = (...args: unknown[]) => {
        if (
          typeof args[0] === 'string' &&
          (args[0].includes('UNSAFE_componentWillReceiveProps') ||
           args[0].includes('Using UNSAFE_componentWillReceiveProps'))
        ) {
          return; // Suppress these specific warnings
        }
        originalConsoleError.apply(console, args);
      };

      // Restore original console.error after component cleanup
      return () => {
        console.error = originalConsoleError;
      };
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-gray-300 mb-4">
              There was an error loading the API documentation.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;