import React from 'react';
import { CustomPage, ContentBlock } from '../types';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface DynamicPageProps {
  page: CustomPage;
  onBack: () => void;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ page, onBack }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 pb-20">
      
      {/* Header */}
      <div className="bg-gray-50 p-8 border-b border-gray-100">
          <div className="max-w-6xl mx-auto">
              <button onClick={onBack} className="flex items-center gap-2 text-gray-500 font-bold mb-6 hover:text-gray-900 transition-colors">
                  <ArrowLeft size={20} /> Back
              </button>
              <h1 className="text-5xl font-black text-gray-900">{page.title}</h1>
          </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
          {page.blocks.map(block => (
              <ContentSection key={block.id} block={block} />
          ))}
          {page.blocks.length === 0 && (
              <div className="text-center py-20 text-gray-400 font-bold bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  This page has no content yet.
              </div>
          )}
      </div>
    </div>
  );
};

const ContentSection: React.FC<{ block: ContentBlock }> = ({ block }) => {
    switch (block.type) {
        case 'HERO':
            return (
                <div className="rounded-3xl overflow-hidden relative text-white bg-gray-900 p-12 text-center" style={block.backgroundColor ? { backgroundColor: block.backgroundColor } : {}}>
                    {block.image && (
                        <div className="absolute inset-0 z-0 opacity-40">
                            <img src={block.image} alt={block.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-black mb-4">{block.title}</h2>
                        <p className="text-xl md:text-2xl font-medium mb-8 opacity-90">{block.content}</p>
                        {block.buttonText && (
                            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-black text-lg hover:scale-105 transition-transform">
                                {block.buttonText}
                            </button>
                        )}
                    </div>
                </div>
            );
        
        case 'TEXT_IMAGE':
            return (
                <div className={`flex flex-col md:flex-row gap-12 items-center ${block.layout === 'image_right' ? 'md:flex-row-reverse' : ''}`}>
                    {block.image && (
                        <div className="flex-1 w-full">
                            <img src={block.image} alt={block.title} className="w-full rounded-3xl shadow-xl border-4 border-white" />
                        </div>
                    )}
                    <div className={`flex-1 space-y-4 ${block.layout === 'center' ? 'text-center' : ''}`}>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-800">{block.title}</h2>
                        {block.subtitle && <h3 className="text-xl font-bold text-blue-600">{block.subtitle}</h3>}
                        <div className="text-lg text-gray-600 leading-relaxed font-medium whitespace-pre-wrap">
                            {block.content}
                        </div>
                        {block.buttonText && (
                            <button className="mt-4 bg-kid-primary text-yellow-900 px-6 py-3 rounded-xl font-black shadow-md flex items-center gap-2 hover:bg-yellow-400 transition-colors inline-flex">
                                {block.buttonText} <ArrowRight size={20} />
                            </button>
                        )}
                    </div>
                </div>
            );

        case 'CTA':
            return (
                <div className="bg-blue-600 text-white rounded-3xl p-12 text-center" style={block.backgroundColor ? { backgroundColor: block.backgroundColor } : {}}>
                    <h2 className="text-4xl font-black mb-4">{block.title}</h2>
                    <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">{block.content}</p>
                    {block.buttonText && (
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-black text-xl hover:bg-gray-100 transition-colors shadow-lg">
                            {block.buttonText}
                        </button>
                    )}
                </div>
            );

        default:
            return null;
    }
};

export default DynamicPage;