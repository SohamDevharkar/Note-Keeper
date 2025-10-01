export const SimpleStickyNote = () => {
  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 animate-float">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-400 to-orange-400 rounded-lg shadow-2xl transform rotate-3 transition-transform hover:rotate-6 hover:scale-105">
        <div className="p-6 h-full flex flex-col">
          <div className="w-full h-8 bg-yellow-500/30 rounded mb-4"></div>
          <div className="space-y-3 flex-1">
            <div className="w-3/4 h-3 bg-yellow-600/20 rounded"></div>
            <div className="w-full h-3 bg-yellow-600/20 rounded"></div>
            <div className="w-5/6 h-3 bg-yellow-600/20 rounded"></div>
            <div className="w-2/3 h-3 bg-yellow-600/20 rounded"></div>
          </div>
          <div className="flex gap-2 mt-4">
            <div className="w-16 h-6 bg-orange-500/30 rounded-full"></div>
            <div className="w-16 h-6 bg-orange-500/30 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-orange-300 via-orange-400 to-red-400 rounded-lg shadow-xl transform -rotate-6 opacity-70 transition-transform hover:-rotate-12 hover:scale-105">
        <div className="p-5 h-full flex flex-col">
          <div className="space-y-2 flex-1 mt-4">
            <div className="w-2/3 h-3 bg-red-600/20 rounded"></div>
            <div className="w-4/5 h-3 bg-red-600/20 rounded"></div>
            <div className="w-3/4 h-3 bg-red-600/20 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};
