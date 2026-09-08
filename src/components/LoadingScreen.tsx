import React, { useEffect, useState } from "react";
import { Sparkles, Laugh } from "lucide-react";

const ROTATING_MESSAGES = [
  "بيلو بيشتغل عليها...",
  "ثواني ونشوف النتيجة 👀",
  "بيلو قرب يخلص 😂",
  "بيظبط المقاسات والبدلة والضحكة 👔",
  "بيحط لمسات الكوميديا الخاصة بهنيدي ✨",
];

export const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % ROTATING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative z-10 w-full max-w-xl mx-auto px-4 py-16 text-center flex flex-col items-center justify-center min-h-[60vh]">
      
      {/* Belo Mascot with Cosmic Floating Glow */}
      <div className="relative mb-8">
        <div className="absolute -inset-6 bg-gradient-to-r from-blue-500/30 to-sky-400/40 rounded-full blur-2xl animate-pulse" />
        
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-b from-[#0c1e44] to-[#081329] border-2 border-sky-400/60 p-4 shadow-[0_0_40px_rgba(56,189,248,0.4)] flex items-center justify-center overflow-hidden animate-bounce-slow">
          <img
            src="/assets/hero/belo.png"
            alt="بيلو بيجهزلك الشخصية"
            className="w-full h-full object-contain filter drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
          />
          <div className="absolute top-2 right-2 p-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
            <Sparkles className="w-4 h-4 animate-spin-slow" />
          </div>
        </div>
      </div>

      {/* Main Mandatory Loading Title */}
      <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 font-['Alexandria',sans-serif] tracking-tight">
        بيلو بيجهزلك الشخصية 😂
      </h2>

      {/* Rotating Secondary Messages */}
      <div className="h-10 flex items-center justify-center mb-8">
        <p className="text-lg sm:text-xl font-bold text-sky-300 transition-all duration-500 flex items-center gap-2">
          <span>{ROTATING_MESSAGES[msgIndex]}</span>
          <Laugh className="w-5 h-5 text-yellow-300 inline" />
        </p>
      </div>

      {/* Animated Glowing Progress Bar */}
      <div className="w-full max-w-md h-3 bg-blue-950/80 rounded-full overflow-hidden border border-blue-800/50 p-0.5 shadow-inner">
        <div className="h-full bg-gradient-to-r from-blue-600 via-sky-400 to-amber-400 rounded-full animate-loading-bar" />
      </div>

      <p className="text-xs text-slate-400 mt-6 font-medium">
        الذكاء الاصطناعي بيعدل نفس صورة الشخصية بدقة متناهية.. استمتع باللحظة!
      </p>

    </section>
  );
};
