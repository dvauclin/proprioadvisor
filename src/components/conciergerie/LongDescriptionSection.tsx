
import React from "react";
import ReactMarkdown from "react-markdown";

interface LongDescriptionSectionProps {
  descriptionLongue: string;
}

const LongDescriptionSection: React.FC<LongDescriptionSectionProps> = ({ descriptionLongue }) => {
  if (!descriptionLongue) {
    return null;
  }

  return (
    <article className="mt-12">
      <div className="container mx-auto px-4">
        <div className="bg-gray-50 rounded-lg p-8">
          <div className="prose prose-gray max-w-none">
            <div className="text-gray-700 leading-relaxed">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-gray-800 mb-3 mt-5">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium text-gray-800 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-base font-medium text-gray-700 mb-2 mt-3">
                      {children}
                    </h4>
                  ),
                  p: ({ children }) => (
                    <p className="mb-4 text-gray-700 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700">
                      {children}
                    </li>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-800">
                      {children}
                    </em>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-brand-chartreuse pl-4 italic text-gray-600 my-4">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {descriptionLongue}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default LongDescriptionSection;

