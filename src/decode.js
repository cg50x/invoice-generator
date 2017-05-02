const textArea = document.createElement('textarea');
export default function(encoded) {
  textArea.innerHTML = encoded;
  return textArea.value;
}
