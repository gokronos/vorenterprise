import { getComplianceDocument, type ComplianceDocumentKey } from '@/lib/sagrilaft-store';
import InPageFloatingViewerButton from '@/components/InPageFloatingViewerButton';

type ComplianceDocumentPageProps = {
  documentKey: ComplianceDocumentKey;
};

function getHeaderLabel(key: ComplianceDocumentKey): string {
  if (key === 'sagrilaft') return 'Cumplimiento normativo';
  if (key === 'organigrama') return 'Estructura organizacional';
  return 'Gobierno de datos';
}

function getFrameTitle(key: ComplianceDocumentKey): string {
  if (key === 'sagrilaft') return 'Visualizador PDF SAGRILAFT';
  if (key === 'organigrama') return 'Visualizador PDF Organigrama';
  return 'Visualizador PDF Politica de Datos';
}

function isImageAsset(url: string): boolean {
  const normalized = url.toLowerCase().split('?')[0];
  return normalized.endsWith('.png') || normalized.endsWith('.jpg') || normalized.endsWith('.jpeg') || normalized.endsWith('.webp');
}

function getEmbeddedViewerUrl(url: string, isImage: boolean): string {
  if (isImage) {
    return url;
  }

  if (url.includes('#')) {
    return url;
  }

  return `${url}#view=FitH&toolbar=0&navpanes=0`;
}

export default async function ComplianceDocumentPage({ documentKey }: ComplianceDocumentPageProps) {
  const config = await getComplianceDocument(documentKey);
  const imageMode = isImageAsset(config.pdfUrl);
  const documentBaseUrl = `/api/compliance-document/${documentKey}`;
  const viewerSourceUrl = `${documentBaseUrl}?mode=view`;
  const downloadSourceUrl = `${documentBaseUrl}?mode=download`;
  const embeddedUrl = getEmbeddedViewerUrl(viewerSourceUrl, imageMode);

  return (
    <main className="sagrilaft-page">
      <section className="sagrilaft-shell">
        <header className="sagrilaft-head">
          <p className="sagrilaft-kicker">{getHeaderLabel(documentKey)}</p>
          <h1>{config.title}</h1>
          <p>{config.description}</p>

          <div className="sagrilaft-actions">
            <InPageFloatingViewerButton url={viewerSourceUrl} title={config.title} isImage={imageMode} />
            <a href={downloadSourceUrl} download>Descargar</a>
          </div>
        </header>

        <div className="sagrilaft-viewer-wrap">
          {imageMode ? (
            <div className="sagrilaft-image-shell">
              <img src={viewerSourceUrl} alt={config.title} className="sagrilaft-image" />
            </div>
          ) : (
            <iframe
              src={embeddedUrl}
              title={getFrameTitle(documentKey)}
              className="sagrilaft-viewer"
            />
          )}
        </div>
      </section>
    </main>
  );
}
