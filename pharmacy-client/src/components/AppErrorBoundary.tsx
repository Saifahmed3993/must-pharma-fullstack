import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

type AppErrorBoundaryProps = {
  children: React.ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

export default class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  constructor(props: AppErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Unhandled render error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
          <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-lg">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              Something went wrong
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              The page crashed, but the app is still running. You can return home and continue.
            </p>
            <div className="flex justify-center gap-3">
              <Button onClick={() => window.location.reload()}>Reload</Button>
              <Button asChild variant="outline">
                <Link to="/">Home</Link>
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
