export function changeToBase64(rawImg) {
//   console.log(rawImg);
  const binary = Array.from(new Uint8Array(rawImg))
    .map((b) => String.fromCharCode(b))
    .join("");

  return `data:image/png;base64,${btoa(binary)}`;
}
