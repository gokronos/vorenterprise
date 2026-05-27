const assetVersion = process.env.NEXT_PUBLIC_ASSET_VERSION?.trim() || 'dev';

export function buildAssetUrl(path: string): string {
  const separator = path.includes('?') ? '&' : '?';
  return `${path}${separator}v=${assetVersion}`;
}
