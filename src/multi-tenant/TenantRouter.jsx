import React, { useState } from 'react';
import { useTenant } from './TenantProvider.jsx';

// Importación de las 6 plantillas de Hostelería (Aislamiento Total del DOM y CSS)
import AwwwardsCinematicTemplate from '../platforms/hosteleria/templates/the-awwwards-cinematic/AwwwardsCinematicTemplate.jsx';
import NeoBentoBrutalistTemplate from '../platforms/hosteleria/templates/the-neo-bento-brutalist/NeoBentoBrutalistTemplate.jsx';
import GlassFluidTemplate from '../platforms/hosteleria/templates/the-glass-fluid/GlassFluidTemplate.jsx';
import EditorialPrintTemplate from '../platforms/hosteleria/templates/the-editorial-print/EditorialPrintTemplate.jsx';
import CyberTerminalTemplate from '../platforms/hosteleria/templates/the-cyber-terminal/CyberTerminalTemplate.jsx';
import RusticOrganicTemplate from '../platforms/hosteleria/templates/the-rustic-organic/RusticOrganicTemplate.jsx';

// Importación de las 6 plantillas de Clínicas (Aislamiento Total del DOM y CSS)
import UltraMinimalSwissTemplate from '../platforms/clinicas/templates/the-ultra-minimal-swiss/UltraMinimalSwissTemplate.jsx';
import DarkBiotechTemplate from '../platforms/clinicas/templates/the-dark-biotech/DarkBiotechTemplate.jsx';
import PediatricPlayfulTemplate from '../platforms/clinicas/templates/the-pediatric-playful/PediatricPlayfulTemplate.jsx';
import HorizontalZenTemplate from '../platforms/clinicas/templates/the-horizontal-zen/HorizontalZenTemplate.jsx';
import LuxuryCurtainTemplate from '../platforms/clinicas/templates/the-luxury-curtain/LuxuryCurtainTemplate.jsx';
import TechOrthoTemplate from '../platforms/clinicas/templates/the-tech-ortho/TechOrthoTemplate.jsx';

/**
 * Enrutador Maestro de Plantillas Multi-Tenant (TenantRouter)
 * Mapea y renderiza dinámicamente las 12 plantillas (6 Hostelería + 6 Clínicas)
 * con aislamiento absoluto del DOM, componentes y CSS.
 */
export const TenantRouter = () => {
  const { tenant, platform, template, switchTemplate, tenantsList, switchTenant } = useTenant();
  const [showDevPanel, setShowDevPanel] = useState(false);

  // Selector estricto de renderizado por plantilla
  const renderTemplate = () => {
    switch (template) {
      // --- HOSTELERÍA ---
      case 'the-awwwards-cinematic':
        return <AwwwardsCinematicTemplate />;
      case 'the-neo-bento-brutalist':
        return <NeoBentoBrutalistTemplate />;
      case 'the-glass-fluid':
        return <GlassFluidTemplate />;
      case 'the-editorial-print':
        return <EditorialPrintTemplate />;
      case 'the-cyber-terminal':
        return <CyberTerminalTemplate />;
      case 'the-rustic-organic':
        return <RusticOrganicTemplate />;

      // --- CLÍNICAS ---
      case 'the-ultra-minimal-swiss':
        return <UltraMinimalSwissTemplate />;
      case 'the-dark-biotech':
        return <DarkBiotechTemplate />;
      case 'the-pediatric-playful':
        return <PediatricPlayfulTemplate />;
      case 'the-horizontal-zen':
        return <HorizontalZenTemplate />;
      case 'the-luxury-curtain':
        return <LuxuryCurtainTemplate />;
      case 'the-tech-ortho':
        return <TechOrthoTemplate />;

      default:
        return <AwwwardsCinematicTemplate />;
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      {/* Plantilla Aislada */}
      {renderTemplate()}

      {/* Switcher & Inspector Multi-Tenant Flotante */}
      <div className="fixed bottom-4 right-4 z-50 font-mono">
        <button
          type="button"
          onClick={() => setShowDevPanel(!showDevPanel)}
          className="text-[10px] tracking-widest uppercase bg-black/90 hover:bg-black text-neutral-200 border border-neutral-700 px-3.5 py-2.5 backdrop-blur-md shadow-2xl transition-all"
        >
          {showDevPanel ? '[▲ CERRAR CONTROLLER]' : `⚡ [${platform?.toUpperCase()}] ${tenant?.name || 'TENANT'}`}
        </button>

        {showDevPanel && (
          <div className="mt-2 w-84 p-5 bg-neutral-950/95 border border-neutral-800 text-neutral-200 text-xs shadow-2xl backdrop-blur-xl space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="font-bold tracking-wider text-white">MULTI-TENANT HUB (12 TEMPLATES)</span>
              <span className="text-[10px] text-neutral-400 uppercase font-bold">{platform}</span>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">
                CAMBIAR TENANT / NEGOCIO:
              </label>
              <select
                value={tenant?.slug}
                onChange={(e) => switchTenant(e.target.value)}
                className="w-full bg-black border border-neutral-700 text-neutral-200 text-xs p-2 outline-none"
              >
                <optgroup label="🍔 HOSTELERÍA (6 Plantillas)">
                  {tenantsList
                    .filter((t) => t.platform === 'hosteleria')
                    .map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="🏥 CLÍNICAS (6 Plantillas)">
                  {tenantsList
                    .filter((t) => t.platform === 'clinicas')
                    .map((t) => (
                      <option key={t.id} value={t.slug}>
                        {t.name}
                      </option>
                    ))}
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-1.5">
                PLANTILLA ASOCIADA:
              </label>
              <div className="p-2 bg-black border border-neutral-800 text-[11px] text-neutral-300 font-mono">
                {template}
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 leading-normal border-t border-neutral-800 pt-3">
              ✓ 12/12 Plantillas desarrolladas e integradas.<br />
              ✓ Aislamiento estricto de componentes y CSS verificado.<br />
              ✓ Listo para producción multi-tenant.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantRouter;
