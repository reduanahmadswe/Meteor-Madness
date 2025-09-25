import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './TrailerModal.scss';

// Simple, accessible modal for playing an embedded Google Drive video
// Props:
// - open: boolean to control visibility
// - onClose: function to close modal
// - videoId: Google Drive file ID (the long id in the link)
export default function TrailerModal({ open, onClose, videoId }) {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // Prevent background scroll when open
  useEffect(() => {
    if (open) {
      const original = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [open]);

  // Close on ESC key
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Click outside to close
  const onOverlayClick = (e) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!open) return null;

  const src = `https://drive.google.com/file/d/${videoId}/preview`;

  return createPortal(
    <div
      className="trailer-modal__overlay"
      ref={overlayRef}
      onClick={onOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-label="Watch trailer"
    >
      <div className="trailer-modal__content" ref={contentRef}>
        <button
          className="trailer-modal__close"
          aria-label="Close trailer"
          onClick={onClose}
        >
          ×
        </button>
        <div className="trailer-modal__video">
          {/* Maintain 16:9 using CSS aspect-ratio; iframe uses Google Drive preview */}
          <iframe
            key={open ? 'open' : 'closed'}
            src={src}
            allow="autoplay; fullscreen"
            allowFullScreen
            title="Movie Trailer"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
