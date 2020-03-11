export const getEl = x => document.getElementById(x)

export function saveToFile(blob, fileName) {
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}