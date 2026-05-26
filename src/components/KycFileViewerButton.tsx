'use client';

import { useEffect, useMemo, useState } from 'react';

type KycFileViewerButtonProps = {
  url: string;
  label: string;
};

function isImageAsset(url: string): boolean {
  const normalized = url.toLowerCase().split('?')[0];
  return normalized.endsWith('.png') || normalized.endsWith('.jpg') || normalized.endsWith('.jpeg') || normalized.endsWith('.webp');
}

function getEmbeddedViewerUrl(url: string, imageMode: boolean): string {
  if (imageMode || url.includes('#')) {
    return url;
  }

  return `${url}#view=FitH&toolbar=0&navpanes=0`;
}

export default function KycFileViewerButton({ url, label }: KycFileViewerButtonProps) {
  const [open, setOpen] = useState(false);
  const imageMode = useMemo(() => isImageAsset(url), [url]);
  const embeddedUrl = useMemo(() => getEmbeddedViewerUrl(url, imageMode), [url, imageMode]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  return (
    <>
      <button type="button" className="kyc-file-view-btn" onClick={() => setOpen(true)}>
        {label}
      </button>

      {open && (
        <div className="doc-float-overlay" role="dialog" aria-modal="true" aria-label={label} onClick={() => setOpen(false)}>
          <div className="doc-float-panel" onClick={(event) => event.stopPropagation()}>
            <div className="doc-float-head">
              <h3>{label}</h3>
              <button type="button" className="doc-float-close" onClick={() => setOpen(false)} aria-label="Cerrar ventana flotante">
                Cerrar
              </button>
            </div>

            <div className="doc-float-body">
              {imageMode ? (
                <div className="doc-float-image-wrap">
                  <img src={url} alt={label} className="doc-float-image" />
                </div>
              ) : (
                <iframe src={embeddedUrl} title={label} className="doc-float-frame" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
