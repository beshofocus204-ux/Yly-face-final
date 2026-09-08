import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="relative z-20 w-full border-t border-blue-900/30 bg-[#040a18]/90 py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
        
        {/* Campaign Logos & Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logos/yly.png"
              alt="YLY"
              className="w-10 h-10 object-contain rounded-lg bg-blue-950/40 p-1 border border-blue-500/20"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
            />
            <img
              src="/assets/logos/5in1.png"
              alt="5in1"
              className="w-10 h-10 object-contain rounded-lg bg-blue-950/40 p-1 border border-amber-500/20"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
            />
            <img
              src="/assets/logos/ministry.png"
              alt="Ministry"
              className="w-10 h-10 object-contain rounded-lg bg-slate-950/40 p-1 border border-slate-700/20"
              onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
            />
          </div>
          <div className="text-right">
            <div className="text-sm font-bold text-slate-200">إيفنت YLY . 51 الأقصر</div>
            <div className="text-xs text-blue-400">شباب يدير شباب - وزارة الشباب والرياضة</div>
          </div>
        </div>

        {/* Mandatory Exact Credits Block */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-xs text-slate-300">
          <div className="bg-blue-950/50 px-3.5 py-1.5 rounded-lg border border-blue-800/40">
            <span className="font-semibold text-sky-300">فكرة : Shahd Mahmoud (Vice Head SM Luxor)</span>
          </div>

          <div className="bg-blue-950/50 px-3.5 py-1.5 rounded-lg border border-blue-800/40">
            <span className="font-semibold text-amber-300">تنفيذ : Beshoy Hany (Head SM Luxor)</span>
          </div>

          <div className="bg-blue-950/50 px-3.5 py-1.5 rounded-lg border border-blue-800/40 flex items-center gap-1.5">
            <span className="font-semibold text-slate-200">Elyaro Samir</span>
            <span className="text-slate-400">|</span>
            <span className="text-slate-300">Member SM Luxor</span>
          </div>
        </div>

      </div>

      <div className="max-w-6xl mx-auto mt-6 pt-4 border-t border-blue-950/80 text-center text-[11px] text-slate-500">
        جميع الحقوق محفوظة لمبادرة YLY - شباب يدير شباب بالأقصر © {new Date().getFullYear()}
      </div>
    </footer>
  );
};
