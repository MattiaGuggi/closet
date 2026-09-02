const SkeletonCard = () => (
  <div className="relative w-full h-72 rounded-3xl bg-zinc-900/60 border border-white/10 overflow-hidden shadow-xl p-5 flex flex-col justify-between animate-pulse">
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite]" />
    
    <div className="w-full h-40 rounded-2xl bg-zinc-800/60 mb-4" />

    <div className="space-y-2">
      <div className="h-4 w-3/4 rounded-lg bg-zinc-800/80" />
      <div className="h-3 w-1/2 rounded-lg bg-zinc-800/40" />
    </div>

    <div className="flex justify-between items-center pt-2">
      <div className="h-6 w-16 rounded-full bg-zinc-800/60" />
      <div className="h-8 w-8 rounded-xl bg-zinc-800/80" />
    </div>
  </div>
);

export default SkeletonCard;