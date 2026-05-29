import { supabase } from '../lib/supabase';

export function resolveComprovanteUrls(comprovanteUrl: string | null) {
  if (!comprovanteUrl) return { primaryUrl: null, driveUrl: null, storageUrl: null };

  const isAbsolute = /^https?:\/\//i.test(comprovanteUrl);
  const storageUrl = isAbsolute
    ? comprovanteUrl
    : supabase.storage.from('comprovantes').getPublicUrl(comprovanteUrl).data.publicUrl;
  const driveUrl = comprovanteUrl.includes('drive.google.com') ? comprovanteUrl : null;

  return {
    primaryUrl: driveUrl ?? storageUrl,
    driveUrl,
    storageUrl,
  };
}
