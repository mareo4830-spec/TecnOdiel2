import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error in Clinic Template:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center bg-zinc-950 border border-red-500/30 rounded-2xl m-4 text-zinc-300">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
            !
          </div>
          <h2 className="text-lg font-bold text-white mb-2">Error al renderizar la plantilla clínica</h2>
          <p className="text-xs font-mono text-zinc-400 mb-4 max-w-md mx-auto">
            {this.state.error?.message || 'Error inesperado en los componentes de la web.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition"
          >
            Reintentar Visualización
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
