export const parseMarkdown = (text) => {
  if (!text) return "";

  let html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Italic
    .replace(/\n/g, '<br/>');                         // Line breaks

  return html;
};
