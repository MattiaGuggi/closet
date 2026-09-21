'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
// @ts-expect-error TypeScript doesn't natively type CSS module imports without configuration.
import 'react-image-crop/dist/ReactCrop.css';
import { 
  Upload, Crop as CropIcon, Check, Layers, Loader2, X, 
  ListFilter, ChevronDown, Search 
} from 'lucide-react';
import Image from 'next/image';
import { OutfitPart, Gadget, UpperLayer } from '@/lib/types';

type ExtractionStep = 'upload' | 'extracting' | 'review';

interface ExtractedItem {
  id: string;
  mainCategory: 'Clothing' | 'Gadget';
  type: string;
  layer?: UpperLayer;
  imageUrl: string;
  file: File;
}

const baseInputStyle = 'w-full px-3.5 py-2.5 bg-zinc-950/60 border border-white/10 rounded-xl shadow-inner text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all';
const labelStyle = 'text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5';

const clothingOptions: { label: string; value: OutfitPart }[] = [
  { label: 'Top', value: 'top' },
  { label: 'Mid', value: 'mid' },
  { label: 'Bottom', value: 'bottom' },
];

const gadgetOptions: { label: string; value: Gadget }[] = [
  { label: 'Hat', value: 'hat' },
  { label: 'Glasses', value: 'glasses' },
  { label: 'Bracelet', value: 'bracelet' },
  { label: 'Fragrance', value: 'fragrance' },
  { label: 'Watch', value: 'watch' },
];

const OutfitExtractor = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<ExtractionStep>('upload');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  
  const imageRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
  
  const [mainCategory, setMainCategory] = useState<'Clothing' | 'Gadget' | null>(null);
  const [itemType, setItemType] = useState<string | null>(null);
  const [itemLayer, setItemLayer] = useState<UpperLayer | null>(null);
  
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);

  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchStatus, setSearchStatus] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<string[] | null>(null); // NEW: Holds visual matches

  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    workerRef.current = new Worker(new URL('../../lib/bg-worker.ts', import.meta.url), { type: 'module' });
    return () => workerRef.current?.terminate();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) setIsCategoryOpen(false);
      if (typeRef.current && !typeRef.current.contains(event.target as Node)) setIsTypeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setSourceImage(url);
      setStep('extracting');
    }
  };

  const getCroppedImageBlob = async (): Promise<Blob | null> => {
    if (!imageRef.current || !crop.width || !crop.height) return null;
    const canvas = document.createElement('canvas');
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;
    
    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0, 0, crop.width * scaleX, crop.height * scaleY
    );

    return new Promise((resolve) => canvas.toBlob((blob) => resolve(blob), 'image/png'));
  };

  const customBackgroundRemoval = (imageBlob: Blob): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) return reject(new Error("Worker not initialized"));
      const tempUrl = URL.createObjectURL(imageBlob);
      workerRef.current.onmessage = (event) => {
        const { status, blob, error } = event.data;
        if (status === 'complete') {
          URL.revokeObjectURL(tempUrl);
          resolve(blob);
        }
        if (status === 'error') {
          URL.revokeObjectURL(tempUrl);
          reject(new Error(error));
        }
      };
      workerRef.current.postMessage({ imageUrl: tempUrl });
    });
  };

  const processAndSaveBlob = async (blob: Blob, prefix: string) => {
    const transparentBlob = await customBackgroundRemoval(blob);
    const transparentUrl = URL.createObjectURL(transparentBlob);
    const file = new File([transparentBlob], `${itemType}-${prefix}-${Date.now()}.png`, { type: 'image/png' });

    setExtractedItems(prev => [
      ...prev, 
      { 
        id: Date.now().toString(), 
        mainCategory: mainCategory!, 
        type: itemType!, 
        layer: itemType === 'top' ? (itemLayer as UpperLayer) : undefined, 
        imageUrl: transparentUrl, 
        file 
      }
    ]);
    
    setItemType(null);
    setItemLayer(null);
  };

  const handleExtractPiece = async () => {
    if (!mainCategory || !itemType || (itemType === 'top' && !itemLayer)) return;
    setIsProcessing(true);
    setSearchStatus("Removing Background...");
    try {
      const croppedBlob = await getCroppedImageBlob();
      if (!croppedBlob) throw new Error('Crop failed');
      await processAndSaveBlob(croppedBlob, 'local');
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Failed to extract piece. Please try again.");
    } finally {
      setIsProcessing(false);
      setSearchStatus(null);
    }
  };

  const handleSearchOnlineMatch = async () => {
    if (!mainCategory || !itemType || (itemType === 'top' && !itemLayer)) return;
    setIsProcessing(true);
    setSearchStatus("Searching for matches...");
    
    try {
      const croppedBlob = await getCroppedImageBlob();
      if (!croppedBlob) throw new Error('Crop failed');

      const formData = new FormData();
      formData.append("image", croppedBlob);

      const searchRes = await fetch('/api/visualSearch', { method: 'POST', body: formData });
      const data = await searchRes.json();
      
      if (!searchRes.ok || !data.urls || data.urls.length === 0) {
        throw new Error('No matches found.');
      }

      setSearchResults(data.urls);
    } catch (error) {
      console.error("Search error:", error);
      alert("Failed to find matches online. Try using the Local Extract button instead.");
    } finally {
      setIsProcessing(false);
      setSearchStatus(null);
    }
  };

  const handleSelectMatch = async (url: string) => {
    setIsProcessing(true);
    setSearchStatus("Downloading and cleaning...");
    try {
      const proxyRes = await fetch('/api/proxyImage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });

      if (!proxyRes.ok) throw new Error("Failed to proxy image.");
      
      const cleanBlob = await proxyRes.blob();
      await processAndSaveBlob(cleanBlob, 'matched');
      setSearchResults(null); // Return to normal view
      
    } catch (error) {
      console.error("Proxy error:", error);
      alert("Could not download this specific image (site may have blocked it). Please try another match or use local extraction.");
    } finally {
      setIsProcessing(false);
      setSearchStatus(null);
    }
  };

  const handleSave = async (createOutfit: boolean) => {
    setIsProcessing(true);
    console.log(`Saving ${extractedItems.length} items... Create Outfit: ${createOutfit}`);
    // TODO: POST logic goes here
    setTimeout(() => {
      setIsProcessing(false);
      alert(createOutfit ? "Items and Outfit saved successfully!" : "Items saved successfully!");
      onClose();
    }, 1500);
  };

  const currentOptions = mainCategory === 'Clothing' ? clothingOptions : gadgetOptions;
  const isExtractionReady = mainCategory && itemType && (itemType !== 'top' || itemLayer);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-zinc-900 border border-white/10 rounded-3xl p-6 sm:p-8 text-white shadow-2xl custom-scrollbar">
        
        <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-xl text-zinc-400 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-white/5 transition-all cursor-pointer z-50">
          <X className="w-5 h-5" />
        </button>

        {step === 'upload' && (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-700 rounded-2xl hover:border-indigo-500 transition-colors mt-6">
            <Upload className="w-10 h-10 text-zinc-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Upload an Inspiration Photo</h3>
            <p className="text-zinc-400 text-sm mb-6">Import a look from Pinterest or Instagram to extract its pieces.</p>
            <label className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold cursor-pointer transition-all">
              Choose Image
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        )}

        {step === 'extracting' && sourceImage && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            <div className="md:col-span-2">
              <div className="bg-zinc-950 p-2 rounded-2xl border border-white/5 overflow-hidden flex justify-center">
                <ReactCrop crop={crop} onChange={c => setCrop(c)}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img ref={imageRef} src={sourceImage} alt="Source" className="max-h-[65vh] w-auto mx-auto object-contain" />
                </ReactCrop>
              </div>
            </div>
            
            {/* DYNAMIC RIGHT PANEL: Either shows matches or extraction form */}
            {searchResults ? (
              <div className="flex flex-col gap-4 animate-in slide-in-from-right-4 fade-in">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <h3 className="text-xl font-bold">Select Best Match</h3>
                    <p className="text-sm text-zinc-400 mt-1">Click a clean image to remove its background.</p>
                  </div>
                  <button onClick={() => setSearchResults(null)} className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto custom-scrollbar pr-2">
                  {searchResults.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => handleSelectMatch(url)}
                      disabled={isProcessing}
                      className="relative aspect-square w-full rounded-xl overflow-hidden bg-zinc-950 border-2 border-transparent hover:border-indigo-500 transition-all cursor-pointer group disabled:opacity-50"
                    >
                      {/* onError hides broken images caused by extreme anti-hotlink mechanisms */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Match ${i}`} className="w-full h-full object-contain p-2" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <div className="absolute inset-0 bg-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Check className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </button>
                  ))}
                </div>
                
                {isProcessing && (
                  <div className="mt-2 flex items-center justify-center gap-2 text-indigo-400 text-sm font-semibold animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> {searchStatus}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="text-xl font-bold border-b border-white/10 pb-4">Extract Pieces</h3>
                  <p className="text-sm text-zinc-400 mt-4 mb-2">Align the crop box, categorize the item, and extract.</p>
                </div>
                
                <div className="relative" ref={categoryRef}>
                  <label className={labelStyle}><Layers className="w-3.5 h-3.5 text-indigo-400" /> Primary Category</label>
                  <button type="button" onClick={() => setIsCategoryOpen(!isCategoryOpen)} className={`${baseInputStyle} flex items-center justify-between cursor-pointer text-left ${!mainCategory ? 'ring-1 ring-indigo-500/50 border-indigo-500/30' : ''}`}>
                    <span className={mainCategory ? 'text-zinc-100 font-medium' : 'text-zinc-500'}>{mainCategory || 'Select Clothing or Gadget'}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                  </button>

                  {isCategoryOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-40 p-1.5 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150">
                      {['Clothing', 'Gadget'].map((cat) => (
                        <button key={cat} type="button" onClick={() => { setMainCategory(cat as 'Clothing' | 'Gadget'); setIsCategoryOpen(false); if (mainCategory !== cat) { setItemType(null); setItemLayer(null); } }} className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${mainCategory === cat ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'}`}>
                          <span>{cat}</span>{mainCategory === cat && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {mainCategory && (
                  <div className="relative animate-in slide-in-from-top-2 fade-in duration-200" ref={typeRef}>
                    <label className={labelStyle}><ListFilter className="w-3.5 h-3.5 text-indigo-400" /> Specific Type</label>
                    <button type="button" onClick={() => setIsTypeOpen(!isTypeOpen)} className={`${baseInputStyle} flex items-center justify-between cursor-pointer text-left ${!itemType ? 'ring-1 ring-rose-500/50 border-rose-500/30' : ''}`}>
                      <span className={itemType ? 'text-zinc-100 font-medium capitalize' : 'text-rose-400 font-medium'}>{itemType || `Select a specific ${mainCategory.toLowerCase()} type`}</span>
                      <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${isTypeOpen ? 'rotate-180 text-indigo-400' : ''}`} />
                    </button>

                    {isTypeOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 z-30 p-1.5 bg-zinc-900/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-2xl flex flex-col gap-1 animate-in fade-in zoom-in-95 duration-150 max-h-48 overflow-y-auto custom-scrollbar">
                        {currentOptions.map((opt) => (
                          <button key={opt.value} type="button" onClick={() => { setItemType(opt.value); setIsTypeOpen(false); if (opt.value !== 'top') setItemLayer(null); }} className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${itemType === opt.value ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-zinc-300 hover:bg-zinc-800/80 hover:text-white'}`}>
                            <span>{opt.label}</span>{itemType === opt.value && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {itemType === 'top' && (
                  <div className="animate-in slide-in-from-top-2 fade-in duration-200">
                    <label className={labelStyle}><Layers className="w-3.5 h-3.5 text-indigo-400" /> Top Layer Placement</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['base', 'mid', 'outer'] as UpperLayer[]).map((layer) => (
                        <button key={layer} type="button" onClick={() => setItemLayer(layer)} className={`py-2 px-1 rounded-xl text-[10px] sm:text-xs font-semibold border transition-all cursor-pointer text-center ${itemLayer === layer ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-zinc-950/60 text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'} ${!itemLayer && itemLayer !== layer ? 'ring-1 ring-rose-500/50 border-rose-500/30' : ''}`}>
                          {{ base: 'Base', mid: 'Mid', outer: 'Outer' }[layer]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 mt-2">
                  <button onClick={handleExtractPiece} disabled={isProcessing || !isExtractionReady} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 border border-white/10 disabled:opacity-50 transition-colors cursor-pointer">
                    {isProcessing && searchStatus === "Removing Background..." ? <Loader2 className="w-4 h-4 animate-spin" /> : <CropIcon className="w-4 h-4" />}
                    {isProcessing && searchStatus === "Removing Background..." ? 'Processing...' : `Extract Local Crop`}
                  </button>
                  
                  <button onClick={handleSearchOnlineMatch} disabled={isProcessing || !isExtractionReady} className="w-full py-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold rounded-xl flex items-center justify-center gap-2 border border-indigo-500/30 disabled:opacity-50 transition-colors cursor-pointer" title="Finds a clean, non-overlapping image of this item online.">
                    {isProcessing && searchStatus?.includes("Searching") ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    {isProcessing && searchStatus?.includes("Searching") ? 'Searching web...' : `Find Clean Match Online`}
                  </button>
                </div>

                {extractedItems.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <h4 className="font-semibold text-sm mb-3">Extracted So Far:</h4>
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      {extractedItems.map(item => (
                        <div key={item.id} className="relative aspect-square bg-zinc-950 rounded-lg border border-white/5 p-1 flex items-center justify-center group">
                          <Image src={item.imageUrl} alt={item.type} fill className="object-contain p-1" />
                          <button onClick={() => setExtractedItems(prev => prev.filter(i => i.id !== item.id))} className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => setStep('review')} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer">
                      Continue to Save <Check className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === 'review' && (
          <div className="flex flex-col items-center py-10 mt-6">
            <Layers className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-3xl font-bold mb-2">Review Extracted Items</h3>
            <p className="text-zinc-400 mb-8">You extracted {extractedItems.length} items. How would you like to save them?</p>
            
            <div className="flex gap-4 justify-center mb-12 flex-wrap">
              {extractedItems.map(item => (
                <div key={item.id} className="w-32 h-32 relative bg-zinc-950 rounded-2xl border border-white/10 shadow-lg group">
                  <Image src={item.imageUrl} alt={item.type} fill className="object-contain p-4" />
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center">
                    <span className="text-[10px] uppercase font-bold bg-zinc-800/90 text-white px-2 py-0.5 rounded-full backdrop-blur-md">
                      {item.type} {item.layer ? `(${item.layer})` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 w-full max-w-2xl">
              <button onClick={() => setStep('extracting')} className="px-6 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold rounded-xl transition-colors cursor-pointer text-sm">
                Back to Cropping
              </button>
              
              <button onClick={() => handleSave(false)} disabled={isProcessing} className="px-6 py-3.5 bg-zinc-800 border border-white/10 hover:bg-zinc-700 font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer text-sm">
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />} Save Items Only
              </button>
              
              <button onClick={() => handleSave(true)} disabled={isProcessing} className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer text-sm shadow-lg shadow-indigo-600/20">
                {isProcessing && <Loader2 className="w-4 h-4 animate-spin" />} Save Items & Create Outfit
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OutfitExtractor;