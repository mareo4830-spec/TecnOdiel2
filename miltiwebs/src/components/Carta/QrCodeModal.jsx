import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode as QrIcon, 
  Sparkles, 
  Wifi, 
  UtensilsCrossed 
} from 'lucide-react';

export default function QrCodeModal({ restaurant, isOpen, onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [copied, setCopied] = useState(false);
  const printRef = useRef(null);

  const getCartaUrl = (table) => {
    if (!restaurant) return '';
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://tecnodiel.vercel.app';
    const slug = restaurant.slug || 'restaurante';
    const query = table ? `?mesa=${encodeURIComponent(table)}` : '';
    return `${base}/#/carta/${slug}${query}`;
  };

  const currentUrl = getCartaUrl(tableNumber);

  useEffect(() => {
    if (!isOpen || !restaurant) return;
    
    QRCode.toDataURL(currentUrl, {
      width: 480,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR:', err));
  }, [isOpen, currentUrl, restaurant]);

  if (!isOpen || !restaurant) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `QR-Carta-${restaurant.slug || 'restaurante'}${tableNumber ? `-Mesa-${tableNumber}` : ''}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      {/* Container */}
      <div className="relative w-full max-w-xl bg-zinc-950 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-zinc-100 my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <QrIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-white">Código QR para Mesas</h3>
              <p className="text-xs text-zinc-400 font-mono">Enlace exclusivo a la Carta Digital</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Number Optional Customizer */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-900 border border-white/10">
          <label className="text-xs text-zinc-400 font-mono shrink-0">Nº de Mesa (opcional):</label>
          <input
            type="text"
            placeholder="Ej: 4 (o dejar vacío para todas las mesas)"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="flex-1 bg-black/50 border border-white/15 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400 font-mono"
          />
        </div>

        {/* Printable Stand Preview Card */}
        <div 
          ref={printRef}
          className="print-section p-6 rounded-2xl bg-white text-black shadow-xl flex flex-col items-center text-center space-y-4 border border-zinc-200"
        >
          {/* Brand header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black text-white text-[10px] font-mono uppercase font-bold tracking-wider">
              <UtensilsCrossed className="w-3 h-3 text-emerald-400" />
              <span>CARTA DIGITAL</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-black text-zinc-900 uppercase tracking-tight">
              {restaurant.name}
            </h4>
            <p className="text-xs text-zinc-600 font-medium">
              {tableNumber ? `Mesa ${tableNumber} • Escanea para consultar nuestra carta` : 'Escanea con la cámara de tu móvil para ver la carta'}
            </p>
          </div>

          {/* QR Code Canvas/Image */}
          <div className="p-3 bg-white rounded-2xl shadow-inner border border-zinc-300">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`QR Carta ${restaurant.name}`} 
                className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
              />
            ) : (
              <div className="w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center bg-zinc-100 rounded-xl">
                <span className="text-xs text-zinc-400 font-mono">Generando QR...</span>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="text-[11px] text-zinc-500 font-mono space-y-0.5 pt-1 border-t border-zinc-200 w-full">
            <p className="font-semibold text-zinc-800">Sin descargar ninguna app • Rápido y Seguro</p>
            <p className="text-[10px] text-zinc-400 truncate max-w-sm mx-auto">{currentUrl}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            className="p-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Descargar PNG</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Caballete</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado' : 'Copiar Enlace'}</span>
          </button>

          <a
            href={currentUrl}
            target="_blank"
            rel="noreferrer"
            className="p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-white/15 text-zinc-300 hover:text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 text-center cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Abrir Carta</span>
          </a>
        </div>

        {/* Guidance Notice */}
        <p className="text-[11px] text-zinc-400 leading-relaxed font-sans text-center">
          Coloca este QR en las mesas, la barra o la entrada de tu local. Al escanearlo, tus clientes accederán <strong>única y exclusivamente a la carta digital</strong> de manera instantánea, sin tener que navegar por la web completa.
        </p>

      </div>
    </div>
  );
}
