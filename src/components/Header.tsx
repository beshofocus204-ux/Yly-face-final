import React, { useState } from "react";
import { Settings, Sparkles } from "lucide-react";

interface HeaderProps {
  onOpenOrganizerModal?: () => void;
  onResetToLanding?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrganizerModal, onResetToLanding }) => {
  const [ylyError, setYlyError] = useState(false);
  const [fiveInOneError, setFiveInOneError] = useState(false);
  const [ministryError, setMinistryError] = useState(false);

  return (
    <header className="relative z-20 w-full border-b border-blue-900/30 bg-[#061024]/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LEFT LOGOS: YLY logo and 5in1 logo */}
        <div className="flex items-center gap-3 sm:gap-5 order-1">
          {/* YLY Logo */}
          <button
            onClick={onResetToLanding}
            className="flex items-center gap-2 group transition-transform hover:scale-105 cursor-pointer text-right"
            title="العودة للرئيسية"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-1 bg-blue-950/60 border border-blue-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)] overflow-hidden">
              {!ylyError ? (
                <img
                  src="/assets/logos/yly.png"
                  alt="YLY logo"
                  className="w-full h-full object-contain"
                  onError={() => setYlyError(true)}
                />
              ) : (
                <div className="text-center">
                  <span className="text-[10px] font-bold text-sky-400 block tracking-wider">YLY</span>
                  <span className="text-[8px] text-blue-200 block leading-tight">شباب يدير شباب</span>
                </div>
              )}
            </div>
          </button>

          {/* 5in1 Logo */}
          <div className="flex items-center gap-2">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-1 bg-blue-950/60 border border-amber-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.15)] overflow-hidden">
              {!fiveInOneError ? (
                <img
                  src="/assets/logos/5in1.png"
                  alt="5in1 logo"
                  className="w-full h-full object-contain"
                  onError={() => setFiveInOneError(true)}
                />
              ) : (
                <div className="text-center">
                  <span className="text-[11px] font-bold text-amber-400 block">5in1</span>
                  <span className="text-[8px] text-amber-200/80 block">الأقصر 51</span>
                </div>
              )}
            </div>
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-sky-200 block">إيفنت YLY 51</span>
              <span className="text-[10px] text-blue-400 block">الأقصر | الموسم الخامس</span>
            </div>
          </div>
        </div>

        {/* CENTER BADGE (Subtle Campaign Tag) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span>تجربة الذكاء الاصطناعي الكوميدية</span>
        </div>

        {/* RIGHT LOGO: Ministry logo */}
        <div className="flex items-center gap-3 sm:gap-4 order-2">
          {onOpenOrganizerModal && (
            <button
              onClick={onOpenOrganizerModal}
              className="p-2 rounded-xl text-blue-300 hover:text-white bg-blue-950/50 hover:bg-blue-900/50 border border-blue-800/40 transition-all text-xs flex items-center gap-1.5 cursor-pointer"
              title="لوحة إدارة أصول الحملة"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">إدارة الأصول</span>
            </button>
          )}

          <div className="flex items-center gap-2.5">
            <div className="text-left hidden sm:block">
              <span className="text-xs font-semibold text-slate-200 block">وزارة الشباب والرياضة</span>
              <span className="text-[10px] text-slate-400 block">جمهورية مصر العربية</span>
            </div>
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-1 bg-slate-950/60 border border-slate-700/40 flex items-center justify-center shadow-sm overflow-hidden">
              {!ministryError ? (
                <img
                  src="/assets/logos/ministry.png"
                  alt="Ministry logo"
                  className="w-full h-full object-contain"
                  onError={() => setMinistryError(true)}
                />
              ) : (
                <div className="text-center">
                  <span className="text-[9px] font-bold text-slate-200 block">الشباب والرياضة</span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </header>
  );
};
