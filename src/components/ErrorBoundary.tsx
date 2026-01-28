import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                    <div className="max-w-md w-full bg-gray-800 p-6 rounded-lg border border-red-500/20">
                        <h1 className="text-xl font-bold text-red-400 mb-2">Algo salió mal</h1>
                        <p className="text-gray-300 mb-4">Se ha producido un error inesperado.</p>
                        <div className="bg-black/50 p-4 rounded text-xs font-mono text-red-300 overflow-auto max-h-40 mb-4">
                            {this.state.error?.toString()}
                        </div>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded transition-colors"
                        >
                            Recargar Página
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
