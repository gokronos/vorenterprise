'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type KycSuccessModalProps = {
  title: string;
  message: string;
};

export default function KycSuccessModal({ title, message }: KycSuccessModalProps) {
  const router = useRouter();

  const closeModal = () => {
    router.replace('/kyc?rol=personas');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="kyc-success-overlay" role="dialog" aria-modal="true" aria-label="Registro exitoso" onClick={closeModal}>
      <div className="kyc-success-panel" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="kyc-success-close" onClick={closeModal} aria-label="Cerrar mensaje">
          x
        </button>
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="kyc-success-actions">
          <button type="button" onClick={closeModal}>Entendido</button>
        </div>
      </div>
    </div>
  );
}
