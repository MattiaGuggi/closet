'use client'

import { useModal } from "@/app/context/ModalContext";
import ItemModal from "@/app/components/ItemModal";
import OutfitModal from "@/app/components/OutfitModal";
import UserModal from "@/app/components/UserModal";
import Toast from "@/app/components/Toast";
import { Trash2Icon } from "lucide-react";

const GlobalModals = () => {
    const { activeModal, modalProps, closeModal, toast, hideToast } = useModal();

    return (
        <>
            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={hideToast} />
            )}

            {activeModal === 'confirm' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <Trash2Icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-white">{modalProps.title}</h3>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed">{modalProps.description}</p>
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl text-xs font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer">
                                Cancel
                            </button>
                            <button type="button" onClick={() => { modalProps.onConfirm(); closeModal(); }} className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition-all cursor-pointer">
                                Confirm Deletion
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {activeModal === 'user' && <UserModal onClose={closeModal} {...modalProps} />}
            {activeModal === 'item' && <ItemModal onClose={closeModal} {...modalProps} />}
            {activeModal === 'outfit' && <OutfitModal onClose={closeModal} {...modalProps} />}
            {activeModal === 'gadget' && <ItemModal onClose={closeModal} {...modalProps} />}
        </>
    );
};

export default GlobalModals;