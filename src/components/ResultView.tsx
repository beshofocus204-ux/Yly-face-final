import React, { useState } from "react";
import { Download, RefreshCw, UploadCloud, Sparkles, Laugh, Check, Eye } from "lucide-react";
import { Character } from "../config/characters";

interface ResultViewProps {
  resultImage: string;
  userImage: string;
  character: Character;
  onTryAnotherCharacter: () => void;
  onUploadNewPhoto: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  resultImage,
  userImage,
  character,
  onTryAnotherCharacter,
  onUploadNewPhoto,
}) => {
  const [showOriginal, setShowOriginal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = `yly-51-henedy-${character.id}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error("Download failed:", e);
    }
  };

  return (
    <section className="relative z-10 w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 text-center">
      
      {/* Event Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/70 border border-blue-500/30 text-sky-300 text-xs sm:text-sm font-semibold mb-4">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>نتيجة إيفنت YLY . 51 الأقصر</span>
        <Laugh className="w-4 h-4 text-yellow-300" />
      </div>

      {/* Mandatory Official Title */}
      <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 font-['Alexandria',sans-serif] tracking-tight">
        دي إنت بقى 😂
      </h2>

      <p className="text-base sm:text-lg text-sky-300 font-bold mb-8">
        بقيت {character.name} في فيلم "{character.movie}"!
      </p>

      {/* Prominent Image Display Container */}
      <div className="relative max-w-lg mx-auto mb-8">
        {/* Luminous Glow Background */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/40 via-sky-400/30 to-amber-500/30 rounded-3xl blur-2xl opacity-80" />

        <div className="relative rounded-3xl overflow-hidden bg-[#061024] border-2 border-sky-400/80 shadow-[0_0_50px_rgba(56,189,248,0.5)]">
          
          {/* Active Image (Result vs Original Toggle) */}
          <div className="relative aspect-[4/5] w-full bg-slate-950">
            <img
              src={showOriginal ? userImage : resultImage}
              alt="النتيجة النهائية"
              className="w-full h-full object-contain"
            />

            {/* View State Badge */}
            <div className="absolute top-4 right-4 px-3.5 py-1.5 rounded-xl bg-blue-950/90 border border-sky-400/50 text-white text-xs font-bold shadow-lg backdrop-blur-md flex items-center gap-1.5">
              {showOriginal ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>صورتك الأصلية</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>شخصية هنيدي (النتيجة)</span>
                </>
              )}
            </div>

            {/* Character Base Image Thumbnail */}
            <div className="absolute bottom-4 left-4 p-1.5 rounded-xl bg-slate-950/80 border border-slate-700/60 flex items-center gap-2 backdrop-blur-sm">
              <img
                src={character.image}
                alt={character.name}
                className="w-10 h-10 object-cover rounded-lg"
              />
              <div className="text-right text-[10px] pr-1">
                <span className="text-slate-400 block">الأصلية:</span>
                <span className="text-amber-300 font-bold block">{character.name}</span>
              </div>
            </div>
          </div>

          {/* Toggle View Button */}
          <div className="p-3 bg-blue-950/90 border-t border-blue-900/60 flex items-center justify-center">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="px-4 py-1.5 rounded-xl bg-blue-900/60 hover:bg-blue-800/60 text-sky-300 text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showOriginal ? "عرض النتيجة المعدلة" : "مقارنة بصورتك الأصلية"}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Mandatory Buttons Block:
          1. "تحميل الصورة"
          2. "جرّب شخصية تانية"
          3. "ارفع صورة جديدة"
      */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto mb-10">
        
        {/* 1. Download Button */}
        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-blue-600 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-base sm:text-lg shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_rgba(56,189,248,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-5 h-5 text-emerald-300 stroke-[3]" />
              <span>تم التحميل بنجاح!</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>تحميل الصورة</span>
            </>
          )}
        </button>

        {/* 2. Try Another Character */}
        <button
          onClick={onTryAnotherCharacter}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-sky-300 font-bold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <RefreshCw className="w-4 h-4" />
          <span>جرّب شخصية تانية</span>
        </button>

        {/* 3. Upload New Photo */}
        <button
          onClick={onUploadNewPhoto}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/60 text-slate-300 font-semibold text-sm sm:text-base transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <UploadCloud className="w-4 h-4" />
          <span>ارفع صورة جديدة</span>
        </button>

      </div>

      {/* Belo Mascot Praise Card */}
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-blue-950/40 border border-blue-800/30 flex items-center gap-4 text-right">
        <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 border border-sky-400/40 bg-blue-900 p-1">
          <img src="/assets/hero/belo.png" alt="بيلو" className="w-full h-full object-contain" />
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          <strong className="text-sky-300 font-bold">بيلو بيقولك:</strong> الصورة طالعة جامدة جداً! متنساش تشاركها مع صحابك في إيفنت الأقصر 51 بهاشتاج <span className="text-amber-300">#YLY_51_Luxor</span>! 😂
        </p>
      </div>

    </section>
  );
};
