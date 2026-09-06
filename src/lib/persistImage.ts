import { Directory, File, Paths } from 'expo-file-system';

const photosDir = new Directory(Paths.document, 'photos');

function ensurePhotosDir() {
  if (!photosDir.exists) {
    photosDir.create({ intermediates: true });
  }
}

// expo-image-picker returns a uri in the OS cache/tmp dir, which is not
// guaranteed to survive app rebuilds or storage cleanup. Copy it into the
// app's document directory so it persists for the life of the app.
export function persistPickedImage(sourceUri: string, mimeType?: string): string {
  ensurePhotosDir();
  const ext = mimeType?.split('/')[1] ?? 'jpg';
  const dest = new File(
    photosDir,
    `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  );
  new File(sourceUri).copySync(dest);
  return dest.uri;
}
