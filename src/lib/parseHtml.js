export default function parseHtml(html) {
  return html?.replace(/(<([^>]+)>)/gi, "");
}

export function parseDangerousHtml(html) {
  return (
    <div
      className="text-gray-700"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
}

/**
 * Format Quill editor HTML content by cleaning up editor-specific elements
 * @param {string} htmlContent - Raw HTML from Quill editor
 * @returns {string} Cleaned and formatted HTML
 */
export function formatQuillEditorHtml(htmlContent) {
  if (!htmlContent) return "<p>No description available.</p>";
  
  // Clean up the HTML by removing Quill editor specific elements
  let cleanedHtml = htmlContent
    // Remove Quill UI elements
    .replace(/<span class="ql-ui"[^>]*><\/span>/g, '')
    // Remove empty paragraph breaks that create extra spacing
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><br\/><\/p>/g, '')
    .replace(/<p>\s*<br\s*\/?>\s*<\/p>/g, '')
    // Convert list items with bullet data attribute to proper li elements
    .replace(/<li data-list="bullet">/g, '<li>')
    // Convert ordered lists to unordered lists for bullet points
    .replace(/<ol>/g, '<ul>')
    .replace(/<\/ol>/g, '</ul>')
    // Convert section headings (like "Responsibilities:", "Requirements:", "Benefits:")
    .replace(/<p>([^<]*:)<\/p>/g, '<h3>$1</h3>')
    // Remove common job titles from the first paragraph if duplicated
    .replace(/^<p>([^<]*Officer \([^)]+\))<\/p>/, '')
    .replace(/^<p>([^<]*Manager)<\/p>/, '')
    .replace(/^<p>([^<]*Engineer)<\/p>/, '')
    .replace(/^<p>([^<]*Developer)<\/p>/, '')
    .replace(/^<p>([^<]*Analyst)<\/p>/, '')
    .replace(/^<p>([^<]*Specialist)<\/p>/, '')
    .replace(/^<p>([^<]*Director)<\/p>/, '')
    // Clean up any extra whitespace and multiple consecutive spaces
    .replace(/\s+/g, ' ')
    // Remove extra spaces around HTML tags
    .replace(/>\s+</g, '><')
    .trim();
  
  return cleanedHtml;
}

/**
 * Format plain text content into structured HTML
 * @param {string} textContent - Plain text content
 * @returns {string} Formatted HTML
 */
export function formatPlainTextToHtml(textContent) {
  if (!textContent) return "<p>No description available.</p>";
  
  let formattedHtml = textContent
    // Convert line breaks to proper spacing
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .map(line => {
      // Check for headings (lines that end with : and are short)
      if (line.endsWith(':') && line.length < 50 && !line.includes('–')) {
        return `<h3 class="text-lg font-semibold mt-6 mb-3">${line}</h3>`;
      }
      // Check for bullet points (lines starting with emoji or special chars)
      else if (line.match(/^[🎓🧑‍🏫🤖💼💡·]/)) {
        return `<li class="mb-2">${line}</li>`;
      }
      // Regular paragraphs
      else {
        return `<p class="mb-4">${line}</p>`;
      }
    })
    .join('');
  
  // Wrap consecutive list items in ul tags
  formattedHtml = formattedHtml.replace(/(<li[^>]*>.*?<\/li>)(\s*<li[^>]*>.*?<\/li>)*/g, (match) => {
    return `<ul class="list-none ml-0 mb-4">${match}</ul>`;
  });
  
  return formattedHtml;
}

/**
 * Smart formatter that detects HTML vs plain text and formats accordingly
 * @param {string} content - Content to format (HTML or plain text)
 * @returns {string} Formatted HTML
 */
export function smartFormatContent(content) {
  if (!content) return "<p>No content available.</p>";
  
  // Detect if content contains HTML tags
  const hasHtmlTags = content.includes('<') && content.includes('>');
  
  return hasHtmlTags 
    ? formatQuillEditorHtml(content)
    : formatPlainTextToHtml(content);
}
