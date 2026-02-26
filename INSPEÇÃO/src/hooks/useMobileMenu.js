import {
    useState,
    useEffect,
    useCallback
} from 'react';
import {
    useIsMobile
} from './useMediaQuery';

/**
 * Hook para gerenciar estado do menu mobile
 * @returns {Object} - { isOpen, toggle, open, close, isMobile }
 */
export const useMobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = useIsMobile();

    // Fechar menu ao redimensionar para desktop
    useEffect(() => {
        if (!isMobile && isOpen) {
            setIsOpen(false);
        }
    }, [isMobile, isOpen]);

    // Prevenir scroll do body quando menu aberto
    useEffect(() => {
        if (isOpen && isMobile) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isMobile]);

    const toggle = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);

    const open = useCallback(() => {
        setIsOpen(true);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
    }, []);

    return {
        isOpen,
        toggle,
        open,
        close,
        isMobile
    };
};