import React from 'react';
import NocturneTemplate from './NocturneTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import BrutalistTemplate from './BrutalistTemplate';
import ArtisanTemplate from './ArtisanTemplate';
import VelvetTemplate from './VelvetTemplate';
import TecnodielTemplate from './TecnodielTemplate';
import DynamicThemedTemplate from './DynamicThemedTemplate';

// Importación de las 6 Plantillas Aisladas de Hostelería
import AwwwardsCinematicTemplate from '../../../../src/platforms/hosteleria/templates/the-awwwards-cinematic/AwwwardsCinematicTemplate';
import NeoBentoBrutalistTemplate from '../../../../src/platforms/hosteleria/templates/the-neo-bento-brutalist/NeoBentoBrutalistTemplate';
import GlassFluidTemplate from '../../../../src/platforms/hosteleria/templates/the-glass-fluid/GlassFluidTemplate';
import EditorialPrintTemplate from '../../../../src/platforms/hosteleria/templates/the-editorial-print/EditorialPrintTemplate';
import CyberTerminalTemplate from '../../../../src/platforms/hosteleria/templates/the-cyber-terminal/CyberTerminalTemplate';
import RusticOrganicTemplate from '../../../../src/platforms/hosteleria/templates/the-rustic-organic/RusticOrganicTemplate';

import { normalizeTemplateId } from './templateNormalizer';

export { normalizeTemplateId };

export default function TemplateRenderer({ 
  restaurant, 
  isPreview = false, 
  previewDevice = 'desktop',
  onSelectElement = null,
  selectedElement = null
}) {
  if (!restaurant) return null;

  const rawTemplate = restaurant?.template_id || restaurant?.template || 'the-awwwards-cinematic';

  // Despacho directo a las 6 plantillas aisladas del catálogo de Hostelería
  switch (rawTemplate) {
    case 'the-awwwards-cinematic':
    case 'cinematic_experience':
      return <AwwwardsCinematicTemplate tenantOverride={restaurant} />;
    case 'the-neo-bento-brutalist':
      return <NeoBentoBrutalistTemplate tenantOverride={restaurant} />;
    case 'the-glass-fluid':
      return <GlassFluidTemplate tenantOverride={restaurant} />;
    case 'the-editorial-print':
      return <EditorialPrintTemplate tenantOverride={restaurant} />;
    case 'the-cyber-terminal':
      return <CyberTerminalTemplate tenantOverride={restaurant} />;
    case 'the-rustic-organic':
      return <RusticOrganicTemplate tenantOverride={restaurant} />;
    default:
      break;
  }

  const templateId = normalizeTemplateId(restaurant?.template_id);
  const normalizedRestaurant = { 
    ...restaurant, 
    template_id: templateId,
    menu_categories: Array.isArray(restaurant?.menu_categories) ? restaurant.menu_categories : [],
    selected_modules: Array.isArray(restaurant?.selected_modules) ? restaurant.selected_modules : [],
    hero_layout: restaurant?.hero_layout || 'split',
    hero_image_side: restaurant?.hero_image_side || 'right',
    hero_image_size: restaurant?.hero_image_size || 'medium'
  };

  const commonProps = {
    restaurant: normalizedRestaurant,
    isPreview,
    previewDevice,
    onSelectElement,
    selectedElement
  };

  return <DynamicThemedTemplate {...commonProps} />;
}
