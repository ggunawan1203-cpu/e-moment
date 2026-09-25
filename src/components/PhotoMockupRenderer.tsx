import React from 'react';
import { FrameColor } from '../types';

interface PhotoMockupRendererProps {
  photoUrl: string;
  mockupType: 'framed' | 'canvas' | 'polaroid' | 'photobook' | 'photostrip' | 'standard';
  frameColor?: FrameColor;
  hasMatboard?: boolean;
  aspectRatioClass?: string;
  caption?: string;
  className?: string;
}

export const PhotoMockupRenderer: React.FC<PhotoMockupRendererProps> = ({
  photoUrl,
  mockupType,
  frameColor = 'jati',
  hasMatboard = true,
  aspectRatioClass = 'aspect-[4/3]',
  caption = '',
  className = '',
}) => {
  // If Framed Photo
  if (mockupType === 'framed') {
    // Frame border color styling
    let frameBorderClass = 'bg-[#8B5A2B] border-[#5A3816]'; // default jati
    let frameTexture = 'linear-gradient(135deg, #9C6734 0%, #6E441B 50%, #875424 100%)';

    if (frameColor === 'hitam') {
      frameBorderClass = 'bg-[#18181B] border-[#09090B]';
      frameTexture = 'linear-gradient(135deg, #27272A 0%, #18181B 50%, #09090B 100%)';
    } else if (frameColor === 'putih') {
      frameBorderClass = 'bg-[#F4F4F5] border-[#E4E4E7]';
      frameTexture = 'linear-gradient(135deg, #FFFFFF 0%, #F4F4F5 50%, #E4E4E7 100%)';
    }

    return (
      <div className={`relative flex items-center justify-center p-3 sm:p-5 select-none ${className}`}>
        {/* Frame Outer Structure */}
        <div
          className="relative w-full max-w-lg p-3 sm:p-4 rounded-xs frame-shadow transition-all duration-300"
          style={{ background: frameTexture }}
        >
          {/* Subtle wood inner bevel */}
          <div className="w-full h-full bg-[#FAF9F6] p-4 sm:p-6 gallery-mat relative overflow-hidden">
            {/* Inner Matboard / Passe-partout */}
            {hasMatboard ? (
              <div className="relative w-full h-full p-3 sm:p-5 bg-[#FAF9F6] border border-[#1E1B18]/10 shadow-inner flex items-center justify-center">
                <div className={`relative w-full ${aspectRatioClass} overflow-hidden shadow-sm`}>
                  <img
                    src={photoUrl}
                    alt="Fine art photograph preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle glare reflection */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                </div>
              </div>
            ) : (
              <div className={`relative w-full ${aspectRatioClass} overflow-hidden shadow-sm`}>
                <img
                  src={photoUrl}
                  alt="Fine art photograph preview"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // If Canvas Stretched Spanram 3cm
  if (mockupType === 'canvas') {
    return (
      <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
        {/* 3D Canvas Box presentation */}
        <div className="relative w-full max-w-md transform perspective-[1000px] group">
          <div className="relative w-full rounded-xs shadow-2xl transition-transform duration-300 overflow-hidden border border-[#1E1B18]/10 bg-[#FAF9F6]">
            {/* Canvas texture overlay */}
            <div className={`relative w-full ${aspectRatioClass} overflow-hidden`}>
              <img
                src={photoUrl}
                alt="Canvas stretched art preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              {/* Cotton Canvas Woven Texture Overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 mix-blend-overlay"
                style={{
                  backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                  backgroundSize: '4px 4px',
                }}
              />
              {/* 3D Edge Bevel Highlights */}
              <div className="absolute inset-0 border-t-2 border-l-2 border-white/30 pointer-events-none" />
              <div className="absolute inset-0 border-r-4 border-b-4 border-black/35 pointer-events-none" />
            </div>

            {/* Gallery Wrap Spanram 3cm Indicator */}
            <div className="bg-[#2D2A26] text-[#FAF9F6]/80 px-3 py-1.5 text-[11px] flex items-center justify-between font-mono">
              <span>GALLERY WRAP EDGE · SPANRAM TEBAL 3CM</span>
              <span>100% COTTON WOVEN</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Polaroid Retro Set
  if (mockupType === 'polaroid') {
    return (
      <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
        {/* Wooden mini clip top */}
        <div className="relative w-full max-w-xs flex flex-col items-center">
          {/* Mini wooden peg */}
          <div className="w-4 h-8 bg-[#C29365] border border-[#8C6036] rounded-xs shadow-md z-10 -mb-3" />
          
          {/* Polaroid card */}
          <div className="w-full bg-[#FFFDF9] p-3.5 pb-6 rounded-xs shadow-xl border border-[#1E1B18]/10 transform rotate-[-1.5deg] hover:rotate-0 transition-transform">
            <div className="w-full aspect-square bg-[#E8E4DF] overflow-hidden mb-3 border border-[#1E1B18]/5">
              <img
                src={photoUrl}
                alt="Polaroid retro photo preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="h-6 flex items-center justify-center">
              <span className="font-serif italic text-xs text-[#554D44] tracking-wider truncate max-w-[90%]">
                {caption || 'Our Precious Memories · e-moment'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If Photobook Layflat 180°
  if (mockupType === 'photobook') {
    return (
      <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
        <div className="relative w-full max-w-lg bg-[#2E241E] p-2.5 rounded-sm shadow-2xl">
          {/* Open 180 degree book spread */}
          <div className="flex bg-[#FAF9F6] border border-[#1E1B18]/10 overflow-hidden shadow-inner">
            {/* Left Page */}
            <div className="w-1/2 p-3 sm:p-4 border-r border-[#1E1B18]/15 relative">
              <div className="w-full aspect-[4/3] bg-[#E8E4DF] overflow-hidden shadow-xs">
                <img
                  src={photoUrl}
                  alt="Photobook left page spread"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-[10px] text-[#1E1B18]/50 text-center font-serif">
                HALAMAN 12 · WEDDING ARCHIVE
              </div>
              {/* Inner page curved shadow */}
              <div className="absolute right-0 top-0 bottom-0 w-4 bg-gradient-to-l from-black/10 to-transparent pointer-events-none" />
            </div>

            {/* Right Page */}
            <div className="w-1/2 p-3 sm:p-4 relative">
              {/* Inner spine shadow */}
              <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-black/10 to-transparent pointer-events-none" />
              <div className="w-full aspect-[4/3] bg-[#E8E4DF] overflow-hidden shadow-xs">
                <img
                  src={photoUrl}
                  alt="Photobook right page spread"
                  className="w-full h-full object-cover filter contrast-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="mt-2 text-[10px] text-[#1E1B18]/50 text-center font-serif">
                HALAMAN 13 · FINE ART PAPERS
              </div>
            </div>
          </div>

          <div className="mt-1 text-center text-[10px] text-[#FAF9F6]/60 font-mono">
            SEAMLESS LAYFLAT 180° · BUKAAN RATA TANPA PATAH TENGAH
          </div>
        </div>
      </div>
    );
  }

  // If Photostrip Magnet
  if (mockupType === 'photostrip') {
    return (
      <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
        <div className="w-36 bg-white p-2.5 shadow-2xl rounded-xs border border-[#1E1B18]/10 flex flex-col gap-2">
          {/* 3 photo squares vertically */}
          <div className="w-full aspect-square bg-[#E8E4DF] overflow-hidden border border-[#1E1B18]/5">
            <img src={photoUrl} alt="Photo strip 1" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="w-full aspect-square bg-[#E8E4DF] overflow-hidden border border-[#1E1B18]/5">
            <img src={photoUrl} alt="Photo strip 2" className="w-full h-full object-cover filter grayscale contrast-110" referrerPolicy="no-referrer" />
          </div>
          <div className="w-full aspect-square bg-[#E8E4DF] overflow-hidden border border-[#1E1B18]/5">
            <img src={photoUrl} alt="Photo strip 3" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div className="text-center pt-1 border-t border-[#1E1B18]/10">
            <span className="font-mono text-[9px] text-[#1E1B18]/70 tracking-widest uppercase">E-MOMENT PHOTOBOX</span>
          </div>
        </div>
      </div>
    );
  }

  // Default Standard Photographic Print
  return (
    <div className={`relative flex items-center justify-center p-4 select-none ${className}`}>
      <div className="relative w-full max-w-md bg-white p-3 shadow-xl rounded-xs border border-[#1E1B18]/10">
        <div className={`relative w-full ${aspectRatioClass} overflow-hidden bg-[#FAF9F6]`}>
          <img
            src={photoUrl}
            alt="Standard fine art print preview"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Luster sheen gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/20 pointer-events-none" />
        </div>
        <div className="mt-2 text-center text-[11px] text-[#1E1B18]/60 font-mono">
          PRECISION ARCHIVAL PRINT · 12-COLOR PIGMENT
        </div>
      </div>
    </div>
  );
};
