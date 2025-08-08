﻿
import React from 'react';

const MapLoading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-chartreuse"></div>
    </div>
  );
};

export default MapLoading;

