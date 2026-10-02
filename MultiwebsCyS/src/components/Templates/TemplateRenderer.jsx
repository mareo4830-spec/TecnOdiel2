import React from 'react';
import DynamicClinicalTemplate from './DynamicClinicalTemplate';

export default function TemplateRenderer({
  clinic,
  restaurant, // Compatibility alias
  isPreview = false,
  previewDevice = 'desktop',
  onSelectElement,
  selectedElement
}) {
  const data = clinic || restaurant || {};

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
