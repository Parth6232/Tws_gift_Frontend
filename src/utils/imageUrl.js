/**
 * Optimize ImageKit URLs with dynamic transformation parameters
 * @param {string} url - Original image URL
 * @param {number} width - Target width in px
 * @param {number} quality - Target quality (default: 80)
 * @returns {string} Optimized image URL or fallback placeholder
 */
export const optimizeImage = (url, width = 600, quality = 80) => {
  if (!url || typeof url !== 'string') {
    return '/assets/logo.png';
  }

  // Check if it's an ImageKit URL
  if (url.includes('ik.imagekit.io')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}tr=w-${width},q-${quality},f-auto`;
  }

  return url;
};

/**
 * Generate srcset for responsive images
 * @param {string} url - Original image URL
 * @returns {string} srcset string for 400w and 800w
 */
export const getSrcSet = (url) => {
  if (!url || typeof url !== 'string' || !url.includes('ik.imagekit.io')) {
    return undefined;
  }
  return `${optimizeImage(url, 400)} 400w, ${optimizeImage(url, 800)} 800w, ${optimizeImage(url, 1200)} 1200w`;
};
