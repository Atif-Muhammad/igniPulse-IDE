export const changeToBase64 = (buffer) => {
  if (!buffer || !buffer.length) return null;
  const base64String = btoa(
    String.fromCharCode(...new Uint8Array(buffer))
  );
  return `data:image/png;base64,${base64String}`;
};