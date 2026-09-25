import React, { useState } from 'react';
import {
  Image as ImageIcon,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { useHospital } from '../context/HospitalContext';
import { GalleryItem } from '../types';

export const GallerySection: React.FC = () => {
  const { gallery } = useHospital();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'exterior', label: 'Exterior' },
    { id: 'interior', label: 'Interior & Reception' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'staff', label: 'Staff' },
  ];

  const filteredGallery =
    activeCategory === 'all'
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
    }
  };

  return (
    <section id="gallery-section" className="py-14 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold mb-2 border border-teal-200">
              <ImageIcon className="w-3.5 h-3.5 text-teal-600" />
              <span>Hospital Photographs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Premises & Facility Gallery
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              Authentic visual documentation of Harsha Hospital premises, consultation spaces, and accessibility infrastructure in Hiriyur.
            </p>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs hover:shadow-lg transition-all duration-300 cursor-pointer aspect-4/3"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />

              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center">
                  <ZoomIn className="w-4 h-4" />
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 text-white">
                <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-teal-600 text-white mb-1 uppercase tracking-wider">
                  {item.category}
                </span>
                <h3 className="text-sm font-bold text-white drop-shadow-sm truncate">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-200 drop-shadow-xs line-clamp-1 mt-0.5">
                  {item.caption}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Real listing attribution footnote */}
        <div className="mt-8 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-center text-xs text-slate-500">
          Photographs sourced from Harsha Hospital’s verified public directory & Google Maps listing on Main Road, Hiriyur, Chitradurga.
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredGallery[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 select-none">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            title="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Controls */}
          {filteredGallery.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Previous Image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Next Image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Image & Caption */}
          <div className="max-w-4xl max-h-[85vh] flex flex-col items-center">
            <img
              src={filteredGallery[lightboxIndex].imageUrl}
              alt={filteredGallery[lightboxIndex].title}
              className="max-h-[70vh] max-w-full rounded-xl object-contain shadow-2xl border border-white/10"
            />
            <div className="mt-4 text-center text-white max-w-xl">
              <h3 className="text-base font-bold">
                {filteredGallery[lightboxIndex].title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {filteredGallery[lightboxIndex].caption}
              </p>
              <div className="text-[11px] text-teal-400 mt-2 font-mono">
                {lightboxIndex + 1} of {filteredGallery.length}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
