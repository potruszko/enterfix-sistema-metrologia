import { useState, useEffect } from 'react';

/**
 * Hook customizado para detectar tamanho de tela
 * @param {string} query - Media query CSS (ex: '(max-width: 768px)')
 * @returns {boolean} - true se a query for correspondida
 */
export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    // Atualizar estado inicial
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Listener para mudanças
    const listener = () => setMatches(media.matches);
    
    // Modern API
    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    } else {
      // Fallback para navegadores antigos
      media.addListener(listener);
      return () => media.removeListener(listener);
    }
  }, [matches, query]);

  return matches;
};

/**
 * Hook para detectar se está em dispositivo mobile
 * @returns {boolean} - true se for mobile (< 768px)
 */
export const useIsMobile = () => {
  return useMediaQuery('(max-width: 768px)');
};

/**
 * Hook para detectar se está em tablet
 * @returns {boolean} - true se for tablet (768px - 1024px)
 */
export const useIsTablet = () => {
  return useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
};
