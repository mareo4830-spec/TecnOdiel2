import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center bg-zinc-950/90 border border-zinc-800 rounded-2xl text-zinc-300">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">
            Cargando Vista Previa Interactiva
          </h3>
          <p className="text-xs text-zinc-400 max-w-sm mb-4 leading-relaxed">
            Se ha producido un ajuste temporal al renderizar este estilo. Tu configuración está intacta y lista.
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-mono font-bold text-xs uppercase tracking-wider transition flex items-center gap-2 shadow-lg cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Recargar Vista Previa</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
