import { useState, useCallback } from 'react';
import axios from 'axios';
import { clothesType, EditableClothesType, gadgetType, outfitType, userType } from '@/lib/types';
import { useModal } from '@/app/context/ModalContext';

const useClosetAPI = (user: userType | null) => {
    const { showToast, closeModal } = useModal();
    const [clothes, setClothes] = useState<clothesType[]>([]);
    const [outfits, setOutfits] = useState<outfitType[]>([]);
    const [gadgets, setGadgets] = useState<gadgetType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchUserDetails = useCallback(async () => {
        if (!user?._id) return;
        setIsLoading(true);
        try {
            const response = await axios.get('/api/user', { params: { userId: user._id } });
            const data = response.data;
          
            setClothes(Array.isArray(data.clothes) ? data.clothes.filter((c: clothesType) => c && c._id) : []);
            setOutfits(Array.isArray(data.outfits) ? data.outfits.filter((o: outfitType) => o && o._id) : []);
            setGadgets(Array.isArray(data.gadgets) ? data.gadgets.filter((g: gadgetType) => g && g._id) : []);
        } catch (err) {
            console.error(err);
            showToast('Errore nel recupero dati utente', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [user?._id, showToast]);

    const saveItem = async (item: EditableClothesType) => {
        showToast('Saving item to wardrobe...', 'info');
        const oldItem = clothes?.find((c) => c._id === item._id);
        
        setClothes((prev) => {
            const exists = prev?.find((c) => c._id === item._id);
            if (exists) return prev?.map((c) => c._id === item._id ? (item as unknown as clothesType) : c) || [];
            return [...(prev || []), item as unknown as clothesType];
        });

        try {
            const formData = new FormData();
            formData.append("item", JSON.stringify(item));
            if (item.imageFile) formData.append("image", item.imageFile);
            if (item.modelFileFile) formData.append("model", item.modelFileFile);
            formData.append("name", item.name);
            formData.append("scale", String(item.scale));
            formData.append("description", item.description || '');
            formData.append("position", JSON.stringify(item.position));
            if (item.type) formData.append("type", item.type);

            const response = await axios.post("/api/updateItem", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                closeModal();
                await fetchUserDetails();
                showToast("Capo salvato con successo!", "success");
            } else {
                throw new Error("Failed to update item");
            }
        } catch (err) {
            console.error(err);
            if (oldItem) setClothes((prev) => prev?.map((c) => c._id === oldItem._id ? oldItem : c) || []);
            showToast("Errore durante l'aggiornamento. Modifiche annullate.", "error");
        }
    };

    const saveOutfit = async (outfit: outfitType) => {
        showToast('Saving outfit to wardrobe...', 'info');
        
        const oldOutfit = outfits?.find((o) => o._id === outfit._id);
        setOutfits((prev) => {
            const exists = prev?.find((o) => o._id === outfit._id);
            if (exists) return prev?.map((o) => o._id === outfit._id ? outfit : o) || [];
            return [...(prev || []), outfit];
        });

        try {
            const formData = new FormData();
            formData.append("outfit", JSON.stringify(outfit));

            const response = await axios.post("/api/updateOutfit", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                closeModal();
                await fetchUserDetails();
                showToast("Outfit salvato con successo!", "success");
            } else {
                throw new Error("Failed to update outfit");
            }
        } catch (err) {
            console.error('Error updating outfit', err);
            if (oldOutfit) {
                setOutfits((prev) => prev?.map((o) => o._id === oldOutfit._id ? oldOutfit : o) || []);
            }
            showToast("Errore di connessione. Modifiche annullate.", "error");
        }
    };

    const saveGadget = async (item: gadgetType & { imageFile?: File }) => {
        showToast('Saving gadget to wardrobe...', 'info');
        
        const oldGadget = gadgets?.find((g) => g._id === item._id);
        setGadgets((prev) => {
            const exists = prev?.find((g) => g._id === item._id);
            if (exists) return prev?.map((g) => g._id === item._id ? item : g) || [];
            return [...(prev || []), item];
        });

        try {
            const formData = new FormData();
            formData.append("gadget", JSON.stringify(item));
            if (item.imageFile) formData.append("image", item.imageFile);

            const response = await axios.post("/api/updateGadget", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (response.data.success) {
                closeModal();
                await fetchUserDetails();
                showToast("Gadget saved successfully!", "success");
            } else {
                throw new Error("Failed to update gadget");
            }
        } catch (err) {
            console.error(err);
            if (oldGadget) {
                setGadgets((prev) => prev?.map((g) => g._id === oldGadget._id ? oldGadget : g) || []);
            }
            showToast("Error updating gadget. Changes reverted.", "error");
        }
    };

    const deleteEntity = async (id: string | number | undefined, type: 'Item' | 'Outfit' | 'Gadget', endpoint: string) => {
        try {
            const response = await axios.delete(`${endpoint}?id=${id}`);
            if (response.data.success) {
                showToast(`${type} deleted`, 'success');
                if (type === 'Item') setClothes(prev => prev?.filter(i => i._id !== id) || []);
                if (type === 'Outfit') setOutfits(prev => prev?.filter(i => i._id !== id) || []);
                if (type === 'Gadget') setGadgets(prev => prev?.filter(i => i._id !== id) || []);

                await fetchUserDetails();
                return true;
            }
            throw new Error('Failed to delete');
        } catch (err) {
            console.error(`Error deleting ${type}`, err);
            showToast(`Error during deletion.`, 'error');
            return false;
        }
    };

    const toggleWishlist = async (item: clothesType | outfitType | gadgetType, action: 'add' | 'remove') => {
        const itemType = 'top' in item || 'mid' in item || 'bottom' in item ? 'Outfit' : 'layer' in item ? 'Item' : 'Gadget';
        const isWishlisted = action === 'add';

        if (itemType === 'Outfit') {
            setOutfits(prev => prev.map(o => o._id === item._id ? { ...o, isWishlisted } : o));
        } else if (itemType === 'Gadget') {
            setGadgets(prev => prev.map(g => g._id === item._id ? { ...g, isWishlisted } : g));
        } else {
            setClothes(prev => prev.map(c => c._id === item._id ? { ...c, isWishlisted } : c));
        }
        try {
            const response = await axios.post('/api/wishlist', { userId: user?._id, itemId: item._id, itemType, isWishlisted });
            
            if (response.data.success) {
                showToast(action === 'add' ? 'Added to wishlist!' : 'Removed from wishlist!', 'success');
                await fetchUserDetails();
            } else {
                throw new Error('Failed to update wishlist');
            }
        } catch(err) {
            console.error(err);
            showToast('Error updating wishlist', 'error');
            await fetchUserDetails();
        }
    };

    return {
        clothes, setClothes,
        outfits, setOutfits,
        gadgets, setGadgets,
        isLoading,
        fetchUserDetails,
        saveItem,
        saveOutfit,
        saveGadget,
        deleteEntity,
        toggleWishlist
    };
};

export default useClosetAPI;
