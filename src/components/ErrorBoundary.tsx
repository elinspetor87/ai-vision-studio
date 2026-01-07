import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          padding: '40px',
          backgroundColor: '#2a2a2a',
          color: 'white',
          minHeight: '200px',
          borderRadius: '8px',
          margin: '20px',
          border: '2px solid #ff0000'
        }}>
          <h1 style={{ color: '#ff0000', marginBottom: '20px' }}>❌ Erro no Componente!</h1>
          <h2 style={{ marginBottom: '10px' }}>Mensagem do Erro:</h2>
          <pre style={{
            backgroundColor: '#1a1a1a',
            padding: '15px',
            borderRadius: '4px',
            overflow: 'auto',
            marginBottom: '20px',
            color: '#ff6b6b'
          }}>
            {this.state.error?.toString()}
          </pre>
          {this.state.errorInfo && (
            <>
              <h2 style={{ marginBottom: '10px' }}>Stack Trace:</h2>
              <pre style={{
                backgroundColor: '#1a1a1a',
                padding: '15px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                color: '#888'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </>
          )}
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#f59e0b',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔄 Tentar Novamente
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
