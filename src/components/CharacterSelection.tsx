import React from "react";
import { Check, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { CharacterWithStatus } from "../types";

interface CharacterSelectionProps {
  characters: CharacterWithStatus[];
  selectedCharacterId: string | null;
  onSelectCharacter: (id: string) => void;
  userImage: string;
  onStartSwap: () => void;
  onChangePhoto: () => void;
  isLoading?: boolean;
}

export const CharacterSelection: React.FC<CharacterSelectionProps> = ({
  characters,
  selectedCharacterId,
  onSelectCharacter,
  userImage,
  onStartSwap,
  onChangePhoto,
  isLoading = false,
}) => {
  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId);
  const canGenerate = !!userImage && !!selectedCharacterId && !!selectedCharacter?.available && !isLoading;

  return (
    <section className="relative z-10 w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Top Bar with user's uploaded photo thumbnail & change option */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-blue-950/60 border border-blue-800/40 mb-8 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden border-2 border-sky-400 shadow-md bg-slate-900 shrink-0">
            <img src={userImage} alt="صورتك" className="w-full h-full object-cover" />
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>تم رفع صورتك بنجاح</span>
            </span>
            <span className="text-xs text-slate-300">جاهزة الآن للدمج مع شخصيات هنيدي</span>
          </div>
        </div>

        <button
          onClick={onChangePhoto}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900/40 hover:bg-blue-800/50 border border-blue-700/40 text-xs text-sky-300 font-semibold transition-all cursor-pointer"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>تغيير صورتك</span>
        </button>
      </div>

      {/* Mandatory Official Headings */}
      <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Alexandria',sans-serif]">
          اختار الشخصية اللي عايز تبقى شبهها 😂
        </h2>
        <p className="text-base sm:text-lg text-sky-300 font-semibold">
          اختار شخصية واحدة وبيلو هيعمل الباقي
        </p>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {characters.map((char) => {
          const isSelected = selectedCharacterId === char.id;
          const isAvailable = char.available;

          if (!isAvailable) {
            // Missing asset state: MUST show placeholder and disable that character
            return (
              <div
                key={char.id}
                className="relative rounded-2xl bg-[#091326]/60 border border-slate-800/80 p-5 flex flex-col items-center justify-between text-center opacity-65 cursor-not-allowed select-none"
              >
                {/* Placeholder Graphic */}
                <div className="w-full aspect-[4/5] rounded-xl bg-blue-950/40 border border-slate-800 flex flex-col items-center justify-center p-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-500 mb-2">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 block">{char.name}</span>
                  <span className="text-[10px] text-slate-500 block">{char.movie}</span>
                  <div className="mt-3 px-2.5 py-1 rounded-md bg-amber-950/40 border border-amber-800/40 text-[10px] text-amber-300 font-medium">
                    الشخصية قيد التجهيز
                  </div>
                </div>

                <div className="w-full">
                  <span className="text-xs text-slate-500 block">غير متوفرة حالياً</span>
                  <span className="text-[10px] text-slate-600 block mt-1">جرّب شخصية تانية 😂</span>
                </div>
              </div>
            );
          }

          // Active Available Character Card
          return (
            <div
              key={char.id}
              onClick={() => onSelectCharacter(char.id)}
              className={`group relative rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer overflow-hidden ${
                isSelected
                  ? "bg-gradient-to-b from-[#0c1f4a] to-[#081530] border-2 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.5)] scale-[1.03]"
                  : "bg-[#091530]/80 border border-blue-800/40 hover:border-blue-500/60 hover:bg-[#0d1d40] hover:scale-[1.01]"
              }`}
            >
              {/* Selected Badge Indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-sky-500 text-white text-xs font-extrabold flex items-center gap-1 shadow-lg animate-fade-in">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>تم الاختيار</span>
                </div>
              )}

              {/* Character Image container showing REAL character image */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-slate-950/80 mb-3.5 border border-blue-900/40 group-hover:border-blue-500/30 transition-colors">
                <img
                  src={char.image}
                  alt={char.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061024] via-transparent to-transparent opacity-80" />
                
                {/* Character Tagline overlay */}
                {char.tagline && (
                  <div className="absolute bottom-2 inset-x-2 px-2 py-1 rounded-lg bg-blue-950/80 backdrop-blur-sm border border-blue-600/30 text-center">
                    <span className="text-[11px] font-bold text-amber-300 block truncate">
                      "{char.tagline}"
                    </span>
                  </div>
                )}
              </div>

              {/* Character Info */}
              <div className="text-right space-y-1">
                <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                  {char.name}
                </h3>
                <p className="text-xs text-sky-400 font-semibold">
                  {char.movie}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {char.description}
                </p>
              </div>

              {/* Select Action Radio Indicator */}
              <div className="mt-4 pt-3 border-t border-blue-900/40 flex items-center justify-between text-xs">
                <span className={`font-semibold ${isSelected ? "text-sky-300" : "text-slate-400"}`}>
                  {isSelected ? "الشخصية المختارة" : "اضغط للاختيار"}
                </span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                    isSelected
                      ? "border-sky-400 bg-sky-500 text-white"
                      : "border-slate-600 group-hover:border-blue-400"
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating / Sticky Bottom Bar with Mandatory Generate Button "يلا بينا 😂" */}
      <div className="sticky bottom-6 z-30 max-w-xl mx-auto p-4 rounded-3xl bg-[#061024]/90 border border-blue-500/40 shadow-[0_0_35px_rgba(37,99,235,0.4)] backdrop-blur-xl text-center">
        <button
          disabled={!canGenerate}
          onClick={onStartSwap}
          className={`w-full py-4 sm:py-5 px-8 rounded-2xl font-extrabold text-lg sm:text-xl transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer ${
            canGenerate
              ? "bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 text-white shadow-[0_0_30px_rgba(56,189,248,0.6)] hover:shadow-[0_0_45px_rgba(56,189,248,0.85)] hover:scale-[1.02] active:scale-[0.98]"
              : "bg-slate-800/80 text-slate-500 border border-slate-700/50 cursor-not-allowed"
          }`}
        >
          <Sparkles className={`w-6 h-6 ${canGenerate ? "text-amber-300 animate-spin-slow" : "text-slate-600"}`} />
          <span>يلا بينا 😂</span>
        </button>

        {!selectedCharacterId && (
          <p className="text-xs text-sky-300 mt-2 font-medium animate-pulse">
            اختار شخصية من الكروت اللي فوق عشان نبدأ! 👆
          </p>
        )}
      </div>

    </section>
  );
};
