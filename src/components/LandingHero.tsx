import React from "react";
import { UploadCloud, Sparkles, Laugh } from "lucide-react";

interface LandingHeroProps {
  onStartUpload: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onStartUpload }) => {
  return (
    <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center justify-center min-h-[calc(100vh-14rem)]">
      
      {/* Top Event Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-sky-300 text-xs sm:text-sm font-semibold mb-6 sm:mb-8 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
        <Sparkles className="w-4 h-4 text-amber-400 animate-spin-slow" />
        <span>الموسم الخامس | إيفنت 5in1 الأقصر 2026</span>
        <Laugh className="w-4 h-4 text-yellow-300" />
      </div>

      {/* Official Title & Subtitle (Strictly Unaltered) */}
      <div className="text-center max-w-4xl mx-auto space-y-4 mb-10 sm:mb-14">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] font-['Alexandria',sans-serif]">
          إيفنت YLY . 51 الأقصر | تجربة الذكاء الاصطناعي الكوميدية
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-sky-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          حول صورتك لشخصية من شخصيات هنيدي
        </p>
      </div>

      {/* HERO COMPOSITION:
          Belo mascot on the LEFT.
          One provided character hero image on the RIGHT.
          (In RTL direction, Left is dir-independent by flex ordering)
      */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center mb-12 sm:mb-16">
        
        {/* LEFT: Belo mascot */}
        <div className="md:col-span-5 flex flex-col items-center justify-center order-2 md:order-1">
          <div className="relative group">
            {/* Ambient Cosmic Aura */}
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/30 to-cyan-500/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-3xl bg-gradient-to-b from-[#0e1d3e] to-[#07132a] border-2 border-blue-400/40 p-3 shadow-[0_0_35px_rgba(37,99,235,0.35)] flex flex-col items-center justify-center overflow-hidden">
              <img
                src="/assets/hero/belo.png"
                alt="بيلو تميمة YLY"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/logos/yly.png";
                }}
              />
              {/* Mascot Tag (Mandatory: Belo is only the mascot, not a character) */}
              <div className="absolute bottom-3 inset-x-4 py-1.5 px-3 rounded-xl bg-blue-950/90 border border-blue-400/40 text-center backdrop-blur-sm">
                <span className="text-xs sm:text-sm font-bold text-sky-300 block">بيلو | تميمة YLY</span>
                <span className="text-[10px] text-blue-200/80 block">التميمة الرسمية لإيفنت 51 الأقصر</span>
              </div>
            </div>
          </div>
        </div>

        {/* CENTER: Main CTA Button & Cosmic Pulsing Ring */}
        <div className="md:col-span-2 flex flex-col items-center justify-center order-1 md:order-2 py-4">
          <button
            onClick={onStartUpload}
            className="group relative inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 text-white font-extrabold text-lg sm:text-xl shadow-[0_0_35px_rgba(37,99,235,0.55)] hover:shadow-[0_0_50px_rgba(56,189,248,0.75)] hover:scale-105 active:scale-95 transition-all duration-300 border border-sky-300/40 cursor-pointer"
          >
            <UploadCloud className="w-6 h-6 text-white group-hover:animate-bounce" />
            <span className="tracking-wide">ارفع صورتك</span>
          </button>
          <span className="text-xs text-slate-400 mt-3 font-medium">سريعة وكوميدية وبدون تسجيل 🚀</span>
        </div>

        {/* RIGHT: Hero Character Image */}
        <div className="md:col-span-5 flex flex-col items-center justify-center order-3">
          <div className="relative group">
            {/* Ambient Gold/Blue Aura */}
            <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/20 to-blue-600/30 rounded-3xl blur-2xl opacity-75 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-3xl bg-gradient-to-b from-[#0e1d3e] to-[#07132a] border-2 border-amber-400/40 p-3 shadow-[0_0_35px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center overflow-hidden">
              <img
                src="/assets/hero/hero-character.png"
                alt="شخصيات هنيدي الكوميدية"
                className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/assets/characters/character-01.png";
                }}
              />
              {/* Character Preview Tag */}
              <div className="absolute bottom-3 inset-x-4 py-1.5 px-3 rounded-xl bg-slate-950/90 border border-amber-400/40 text-center backdrop-blur-sm">
                <span className="text-xs sm:text-sm font-bold text-amber-300 block">شخصيات هنيدي الأيقونية</span>
                <span className="text-[10px] text-slate-300 block">اختار شخصيتك المفضلة وسيب الباقي لبيلو</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Highlights / Features Banner (Subtle, Playful Egyptian Humor) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-4xl text-center">
        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/30 backdrop-blur-sm">
          <div className="text-2xl mb-1">🎭</div>
          <div className="text-sm font-bold text-slate-200">أشهر شخصيات هنيدي</div>
          <div className="text-xs text-slate-400">من خلف الدهشوري لمحيي ورمضان</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/30 backdrop-blur-sm">
          <div className="text-2xl mb-1">⚡</div>
          <div className="text-sm font-bold text-slate-200">تبديل وجه حقيقي 100%</div>
          <div className="text-xs text-slate-400">دمج ملامحك مع بدلة الشخصية وخلفيتها الأصلية</div>
        </div>

        <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/30 backdrop-blur-sm">
          <div className="text-2xl mb-1">📸</div>
          <div className="text-sm font-bold text-slate-200">تحميل مباشر عالي الدقة</div>
          <div className="text-xs text-slate-400">شارك صورتك الكوميدية في إيفنت الأقصر 51</div>
        </div>
      </div>

    </section>
  );
};
