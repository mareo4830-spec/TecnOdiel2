import React, { useState } from 'react';
import { 
  Globe, 
  Key, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { getVercelConfig, saveVercelConfig, testVercelConnection } from '../../lib/vercelService';

export default function VercelSettingsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const currentConfig = getVercelConfig();
  const [token, setToken] = useState(currentConfig.token);
  const [projectId, setProjectId] = useState(currentConfig.projectId);
  const [teamId, setTeamId] = useState(currentConfig.teamId);
  const [baseDomain, setBaseDomain] = useState(currentConfig.baseDomain || 'vercel.app');
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testVercelConnection(token, projectId, teamId);
      setTestResult(res);
    } catch (e) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveVercelConfig(token, projectId, teamId, baseDomain);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl bg-zinc-950 border border-emerald-500/40 shadow-[0_0_80px_rgba(16,185,129,0.25)] p-6 sm:p-8 space-y-5 animate-spring-in text-zinc-100">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center font-bold text-white text-base font-mono">
              ▲
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Conexión Automática con Vercel
              </h3>
              <p className="text-xs text-zinc-400">
                Cada web que se cree tendrá su propio subdominio URL en Vercel creado al instante.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Instructions Card */}
        <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1.5 text-emerald-200">
          <div className="flex items-center gap-2 font-bold text-emerald-300">
            <HelpCircle className="w-4 h-4 shrink-0" />
            <span>¿Cómo funciona la creación automática?</span>
          </div>
          <p className="text-[11px] leading-relaxed text-zinc-300">
            Al introducir tu Token de Vercel y el ID de tu proyecto, cada vez que un cliente configure su restaurante y dé el visto bueno, el sistema llamará a la API de Vercel y creará su URL única (ej: <strong className="text-emerald-300 font-mono">nombre-local.vercel.app</strong>).
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-zinc-200">
                Token Personal de Vercel (API Token)
              </label>
              <a
                href="https://vercel.com/account/tokens"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-emerald-400 hover:underline flex items-center gap-1 font-mono"
              >
                <span>Generar token</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
            <div className="relative">
              <Key className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="Ej: vercel_tok_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-zinc-200">
                Project ID de Vercel
              </label>
              <span className="text-[10px] text-zinc-400 font-mono">En Settings &gt; General</span>
            </div>
            <div className="relative">
              <Layers className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ej: prj_abc123xyz..."
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-zinc-200 block mb-1">
                Dominio Base para las Webs
              </label>
              <input
                type="text"
                placeholder="vercel.app"
                value={baseDomain}
                onChange={(e) => setBaseDomain(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Por defecto: <code className="text-zinc-300">vercel.app</code>
              </span>
            </div>

            <div>
              <label className="font-semibold text-zinc-200 block mb-1">
                Team ID (Opcional)
              </label>
              <input
                type="text"
                placeholder="team_... (si usas equipo)"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-400"
              />
              <span className="text-[10px] text-zinc-400 mt-1 block">
                Solo si tu proyecto está en un Team
              </span>
            </div>
          </div>

          {/* Test Connection Button & Result */}
          <div className="pt-1">
            <button
              type="button"
              disabled={testing || !token || !projectId}
              onClick={handleTest}
              className="emil-pressable px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-200 text-xs font-semibold flex items-center gap-2 disabled:opacity-50"
            >
              {testing ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" /> : <Globe className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{testing ? 'Comprobando conexión...' : 'Probar Conexión con Vercel'}</span>
            </button>

            {testResult && (
              <div className={`mt-2 p-2.5 rounded-xl text-[11px] flex items-start gap-2 ${
                testResult.success 
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300' 
                  : 'bg-red-500/10 border border-red-500/30 text-red-300'
              }`}>
                {testResult.success ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-400 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-400 mt-0.5" />}
                <div>
                  {testResult.success ? (
                    <span>Conexión confirmada con el proyecto <strong>{testResult.projectName}</strong>. Las URLs se crearán automáticamente.</span>
                  ) : (
                    <span>{testResult.error}</span>
                  )}
                </div>
              </div>
            )}

            {savedSuccess && (
              <div className="mt-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Configuración de Vercel guardada correctamente.</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-white/10 text-zinc-400 hover:text-white"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="emil-pressable px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-extrabold shadow-lg"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
