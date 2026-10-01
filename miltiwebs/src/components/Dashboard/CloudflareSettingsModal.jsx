import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cloud, 
  Key, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  RefreshCw, 
  Server, 
  Zap, 
  HelpCircle,
  Globe
} from 'lucide-react';
import { 
  getCloudflareConfig, 
  saveCloudflareConfig, 
  testCloudflareConnection 
} from '../../lib/cloudflareService';

export default function CloudflareSettingsModal({ isOpen, onClose, onConfigSaved }) {
  const [accountId, setAccountId] = useState('');
  const [apiToken, setApiToken] = useState('');
  const [baseDomain, setBaseDomain] = useState('pages.dev');
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getCloudflareConfig();
      setAccountId(cfg.accountId || '');
      setApiToken(cfg.apiToken || '');
      setBaseDomain(cfg.baseDomain || 'pages.dev');
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testCloudflareConnection(accountId, apiToken);
      setTestResult(res);
    } catch (e) {
      setTestResult({ success: false, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    const saved = saveCloudflareConfig(accountId, apiToken, baseDomain);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      if (onConfigSaved) onConfigSaved(saved);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Configuración de Cloudflare Pages</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  100% Gratis & Fiable
                </span>
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Publicación automática en dominios *.pages.dev aptos para venta comercial sin costes ni límites.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-zinc-900 to-emerald-500/10 border border-amber-500/20 text-xs text-zinc-300 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>¿Por qué Cloudflare Pages en lugar de Vercel?</span>
          </div>
          <p className="text-zinc-400 leading-relaxed text-[11px]">
            El plan gratuito de Vercel (Hobby) no permite proyectos con fin comercial ni cobro a clientes.
            <strong> Cloudflare Pages es 100% gratuito sin restricción comercial</strong>, ofrece ancho de banda ilimitado y entrega instantánea en todo el mundo.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Cloudflare Account ID (Opcional para modo API directa):
            </label>
            <div className="relative">
              <Server className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                placeholder="ej: a1b2c3d4e5f6..."
                value={accountId}
                onChange={e => setAccountId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Encuéntralo en tu panel de Cloudflare → Overview en la barra lateral derecha.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Cloudflare API Token (Permisos: Cloudflare Pages: Edit):
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                placeholder="Pegar token de Cloudflare..."
                value={apiToken}
                onChange={e => setApiToken(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Si no configuras Token, el sistema asignará y gestionará las URLs *.pages.dev de forma automática sin fricción.
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Sufijo de Dominio Base:
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={baseDomain}
                onChange={e => setBaseDomain(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
            <span className="text-[10px] text-zinc-500 mt-1 block">
              Por defecto: <code className="text-amber-400">pages.dev</code> (ej: micliente.pages.dev)
            </span>
          </div>
        </div>

        {/* Test Result Message */}
        {testResult && (
          <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
            testResult.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block">
                {testResult.success ? '¡Conexión Exitosa con Cloudflare Pages!' : 'Fallo en la Conexión'}
              </span>
              <span className="text-[11px] block mt-0.5">
                {testResult.success 
                  ? `Se detectaron ${testResult.projectCount} proyectos activos en tu cuenta de Cloudflare.` 
                  : testResult.error}
              </span>
            </div>
          </div>
        )}

        {savedSuccess && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Configuración guardada correctamente.</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5">
          <button
            type="button"
            disabled={testing || !accountId || !apiToken}
            onClick={handleTest}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-white/10 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {testing ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Probar Conexión Cloudflare</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-white/5 hover:bg-white/5 text-zinc-400 hover:text-white text-xs transition"
            >
              Cerrar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition shadow-[0_0_20px_rgba(245,158,11,0.3)]"
            >
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
