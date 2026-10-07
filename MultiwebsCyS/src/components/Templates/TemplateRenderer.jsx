import React from 'react';
import DynamicClinicalTemplate from './DynamicClinicalTemplate';

// Importación de las 6 Plantillas Aisladas de Clínicas
import UltraMinimalSwissTemplate from '../../../../src/platforms/clinicas/templates/the-ultra-minimal-swiss/UltraMinimalSwissTemplate';
import DarkBiotechTemplate from '../../../../src/platforms/clinicas/templates/the-dark-biotech/DarkBiotechTemplate';
import PediatricPlayfulTemplate from '../../../../src/platforms/clinicas/templates/the-pediatric-playful/PediatricPlayfulTemplate';
import HorizontalZenTemplate from '../../../../src/platforms/clinicas/templates/the-horizontal-zen/HorizontalZenTemplate';
import LuxuryCurtainTemplate from '../../../../src/platforms/clinicas/templates/the-luxury-curtain/LuxuryCurtainTemplate';
import TechOrthoTemplate from '../../../../src/platforms/clinicas/templates/the-tech-ortho/TechOrthoTemplate';

export default function TemplateRenderer({
  clinic,
  restaurant, // Compatibility alias
  isPreview = false,
  previewDevice = 'desktop',
  onSelectElement,
  selectedElement
}) {
  const data = clinic || restaurant || {};
  const rawTemplate = data?.template_id || data?.template || 'the-ultra-minimal-swiss';

  // Despacho directo a las 6 plantillas aisladas del catálogo de Clínicas
  switch (rawTemplate) {
    case 'the-ultra-minimal-swiss':
    case 'dental_pure':
      return <UltraMinimalSwissTemplate tenantOverride={data} />;
    case 'the-dark-biotech':
    case 'fisio_sport':
      return <DarkBiotechTemplate tenantOverride={data} />;
    case 'the-pediatric-playful':
      return <PediatricPlayfulTemplate tenantOverride={data} />;
    case 'the-horizontal-zen':
      return <HorizontalZenTemplate tenantOverride={data} />;
    case 'the-luxury-curtain':
    case 'estetica_glow':
      return <LuxuryCurtainTemplate tenantOverride={data} />;
    case 'the-tech-ortho':
      return <TechOrthoTemplate tenantOverride={data} />;
    default:
      break;
  }

  return (
    <div className="w-full">
      <DynamicClinicalTemplate
        clinic={data}
        isPreview={isPreview}
        previewDevice={previewDevice}
        onSelectElement={onSelectElement}
        selectedElement={selectedElement}
        hero_layout={data.hero_layout}
        hero_image_side={data.hero_image_side}
        hero_image_size={data.hero_image_size}
      />
    </div>
  );
}
