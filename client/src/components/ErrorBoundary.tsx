import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-surface-elevated p-8 rounded-2xl shadow-sm border border-border text-center">
            <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-6 text-danger">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-2">Something went wrong</h2>
            <p className="text-text-secondary mb-6">
              An unexpected error occurred. We've been notified and are looking into it.
            </p>
            
            {/* Optional: Show error message in dev mode only */}
            {import.meta.env.DEV && this.state.error && (
              <div className="mb-6 p-4 bg-surface rounded-lg overflow-auto text-left text-xs text-red-600 border border-red-100">
                <p className="font-mono">{this.state.error.toString()}</p>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-light transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
