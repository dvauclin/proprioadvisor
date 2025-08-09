"use client";

import React from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';

const ShareSection: React.FC = () => {
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = typeof window !== 'undefined' ? document.title : '';

  const shareLinks = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: 'hover:bg-blue-500 hover:text-white'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-600 hover:text-white'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-blue-700 hover:text-white'
    }
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      // Vous pouvez ajouter une notification de succès ici
    } catch (err) {
      console.error('Erreur lors de la copie:', err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-brand-chartreuse rounded-full flex items-center justify-center">
          <Share2 className="h-4 w-4 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Partager cet article</h3>
      </div>
      
      <div className="flex flex-wrap gap-4">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:shadow-md transition-all duration-200 ${link.color}`}
          >
            <link.icon className="h-4 w-4" />
            <span className="font-medium">{link.name}</span>
          </a>
        ))}
        
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200"
        >
          <LinkIcon className="h-4 w-4" />
          <span className="font-medium">Copier le lien</span>
        </button>
      </div>
    </div>
  );
};

export default ShareSection;

