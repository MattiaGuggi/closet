'use client'

import { useContext, useState, createContext, useCallback } from 'react';

type ToastType = 'success' | 'info' | 'error';

interface UIContextType {
    activeModal: string;
    setActiveModal: (type: string) => void;
    modalProps: any;
    openModal: (type: string, props?: any) => void;
    closeModal: () => void;
    toast: { message: string; type: ToastType } | null;
    showToast: (message: string, type: ToastType) => void;
    hideToast: () => void;
}

const ModalContext = createContext<UIContextType | undefined>(undefined);

export const ModalProvider = ({ children } : { children: React.ReactNode }) => {
    const [activeModal, setActiveModal] = useState<string>('');
    const [modalProps, setModalProps] = useState<any>({});
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

    const openModal = (type: string, props: any = {}) => {
        setModalProps(props);
        setActiveModal(type);
    };

    const closeModal = () => {
        setActiveModal('');
        setModalProps({});
    };

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    }, []);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    return (
        <ModalContext.Provider value={{ activeModal, setActiveModal, modalProps, openModal, closeModal, toast, showToast, hideToast }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error('useModal must be used within a ModalProvider');
    return context;
};