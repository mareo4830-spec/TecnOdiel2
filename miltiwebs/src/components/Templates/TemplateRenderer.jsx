import React from 'react';
import NocturneTemplate from './NocturneTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import BrutalistTemplate from './BrutalistTemplate';
import ArtisanTemplate from './ArtisanTemplate';
import VelvetTemplate from './VelvetTemplate';
import TecnodielTemplate from './TecnodielTemplate';
import DynamicThemedTemplate from './DynamicThemedTemplate';
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

  switch (templateId) {
    case 'brutalist':
      return <BrutalistTemplate {...commonProps} />;
    case 'minimalist':
      return <MinimalistTemplate {...commonProps} />;
    case 'artisan':
      return <ArtisanTemplate {...commonProps} />;
    case 'velvet':
      return <VelvetTemplate {...commonProps} />;
    case 'nocturne':
      return <NocturneTemplate {...commonProps} />;
    case 'tecnodiel_elite':
      return <TecnodielTemplate {...commonProps} />;
    default:
      // Dynamically handles all 25+ specialized templates:
      // cyberpunk, tokyo_omakase, mediterranean_breeze, bistro_parisien,
      // urban_street_smash, tapas_andaluzas, steakhouse_asador, pasticceria_dolce,
      // botanical_garden, rooftop_sunset, trattoria_italiana, cerveceria_craft,
      // marisqueria_costera, taqueria_fiesta, coffee_specialty, gelato_artesanal,
      // pizzeria_napolitana, lounge_shisha, beach_club, gourmet_vanguardia,
      // wok_asian_fusion, churreria_tradicional, bodega_enoteca, pulperia_gallega, tecnodiel_elite
      return <DynamicThemedTemplate {...commonProps} />;
  }
}
