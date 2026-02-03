import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Ultra-safe ErrorBoundary using only base HTML to avoid cascading failures
 * if icons or animation libraries fail to load.
 */
export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Critical UI Error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#020617',
                    color: 'white',
                    fontFamily: 'sans-serif',
                    padding: '20px'
                }}>
                    <div style={{
                        maxWidth: '400px',
                        width: '100%',
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,0,0,0.3)',
                        borderRadius: '24px',
                        padding: '40px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '48px', marginBottom: '20px' }}>⚠️</div>
                        <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 10px 0' }}>Error de Sistema</h1>
                        <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '20px' }}>
                            La aplicación no pudo iniciarse correctamente. Revisa la consola para más detalles.
                        </p>
                        <pre style={{
                            backgroundColor: 'black',
                            padding: '15px',
                            borderRadius: '12px',
                            fontSize: '10px',
                            color: '#f87171',
                            overflow: 'auto',
                            maxHeight: '150px',
                            textAlign: 'left'
                        }}>
                            {this.state.error?.toString()}
                        </pre>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                marginTop: '20px',
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontWeight: 'bold',
                                cursor: 'pointer'
                            }}
                        >
                            REINTENTAR CARGA
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
