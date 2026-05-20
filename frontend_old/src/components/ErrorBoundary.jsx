import { Component } from 'react';

export class ErrorBoundary extends Component {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong' };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen grid place-items-center p-8 text-center bg-background">
          <div>
            <h1 className="text-xl font-bold text-white mb-2">Unexpected error</h1>
            <p className="text-muted-foreground text-sm mb-4">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-white text-black px-6 py-2 text-sm font-semibold"
            >
              Reload app
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
