
import React, { ReactNode } from "react";

interface InscriptionFormContainerProps {
  children: ReactNode;
}

const InscriptionFormContainer: React.FC<InscriptionFormContainerProps> = ({ children }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      {children}
    </div>
  );
};

export default InscriptionFormContainer;

