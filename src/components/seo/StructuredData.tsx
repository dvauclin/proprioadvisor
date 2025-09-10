
import React from 'react';

interface StructuredDataProps {
  data: any | any[];
  scriptId?: string;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data, scriptId }) => {
  const jsonLd = Array.isArray(data) ? data : [data];

  return (
    <>
      {jsonLd.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          id={scriptId ? `${scriptId}-${index}` : undefined}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  );
};

export default StructuredData;

