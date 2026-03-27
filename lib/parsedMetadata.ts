export const parseMetadata = (metadata: string | null) => {
  try {
    return metadata ? JSON.parse(metadata) : null;
  } catch {
    return null;
  }
};