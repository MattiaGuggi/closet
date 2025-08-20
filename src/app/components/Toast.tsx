import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Toast = ({ message, type = 'info', onClose }: { message: string, type: string, onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const typeStyles: Record<string, string> = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className={`fixed top-4 right-4 z-50 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between min-w-[250px] ${typeStyles[type]}`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 cursor-pointer">
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
