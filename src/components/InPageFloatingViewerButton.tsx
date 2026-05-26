'use client';

import { useEffect, useState } from 'react';

type InPageFloatingViewerButtonProps = {
  url: string;
  title: string;
  isImage: boolean;
};

export default function InPageFloatingViewerButton({ url, title, isImage }: InPageFloatingViewerButtonProps) {
  const [open, setOpen] = useState(false);

  const embeddedUrl = isImage || url.includes('#') ? url : `${url}#view=FitH&toolbar=0&navpanes=0`;

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
      <button type="button" className="sagrilaft-float-btn" onClick={() => setOpen(true)}>
        Abrir ventana flotante
      </button>

      {open && (
        <div className="doc-float-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={() => setOpen(false)}>
          <div className="doc-float-panel" onClick={(event) => event.stopPropagation()}>
            <div className="doc-float-head">
              <h3>{title}</h3>
              <button type="button" className="doc-float-close" onClick={() => setOpen(false)} aria-label="Cerrar ventana flotante">
                Cerrar
              </button>
            </div>

            <div className="doc-float-body">
              {isImage ? (
                <div className="doc-float-image-wrap">
                  <img src={url} alt={title} className="doc-float-image" />
                </div>
              ) : (
                <iframe src={embeddedUrl} title={title} className="doc-float-frame" />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
