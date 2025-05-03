export const sanitizeHtmlContent = (content) => {
  if (!content) return { cleanText: '', images: [] };
  
  // Extract all image URLs first
  const imageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
  const images = [];
  let match;
  
  // Get all image sources
  while ((match = imageRegex.exec(content)) !== null) {
    const fullUrl = match[1];
    // Extract just the path after the server address if needed
    const imagePath = fullUrl.includes('http') 
      ? fullUrl.split(/\/\/[^\/]+\//)[1] || fullUrl
      : fullUrl;
    images.push(imagePath);
  }
  
  // Handle various HTML formatting
  const cleanText = content
    // Remove all HTML tags with their content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    // Handle paragraphs and breaks with newlines
    .replace(/<p[^>]*>/gi, '')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<br\s*\/?>/gi, '\n')
    // Handle other common tags
    .replace(/<div[^>]*>/gi, '')
    .replace(/<\/div>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    // Finally remove all remaining tags
    .replace(/<[^>]*>/g, '')
    // Handle HTML entities
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    // Clean up multiple newlines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim();
    
  return { cleanText, images };
};