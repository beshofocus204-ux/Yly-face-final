import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon, Camera, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

interface UploadSectionProps {
  onImageSelected: (base64Image: string) => void;
  onBackToLanding: () => void;
  initialImage?: string | null;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onImageSelected,
  onBackToLanding,
  initialImage,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage || null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Validate and read file into base64 data URL
  const handleFile = (file: File) => {
    setErrorMsg(null);

    const validTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMsg("الصورة مش مدعومة، اختار صورة بصيغة PNG أو JPG أو JPEG أو WEBP.");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setErrorMsg("حجم الصورة كبير شوية، اختار صورة أصغر من 20 ميجابايت.");
      return;
    }

    setIsValidating(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setErrorMsg("تعذر قراءة الصورة، جرّب صورة تانية.");
        setIsValidating(false);
        return;
      }

      // Check that it's a valid image by loading it in an Image element
      const img = new Image();
      img.onload = () => {
        setPreview(result);
        setIsValidating(false);
      };
      img.onerror = () => {
        setErrorMsg("الصورة مش واضحة أو تالفة، جرّب صورة تانية.");
        setIsValidating(false);
      };
      img.src = result;
    };

    reader.onerror = () => {
      setErrorMsg("حصل خطأ أثناء قراءة الملف، حاول مرة تانية.");
      setIsValidating(false);
    };

    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleContinue = () => {
    if (preview) {
      onImageSelected(preview);
    }
  };

  return (
    <section className="relative z-10 w-full max-w-3xl mx-auto px-4 py-8 sm:py-12">
      
      {/* Back button */}
      <button
        onClick={onBackToLanding}
        className="inline-flex items-center gap-2 text-sm text-sky-400 hover:text-sky-300 transition-colors mb-6 cursor-pointer font-medium"
      >
        <ArrowRight className="w-4 h-4" />
        <span>الرجوع للصفحة الرئيسية</span>
      </button>

      {/* Main Card */}
      <div className="relative rounded-3xl bg-[#091530]/90 border border-blue-600/30 p-6 sm:p-10 shadow-[0_0_50px_rgba(37,99,235,0.2)] backdrop-blur-xl">
        
        {/* Mandatory Header Texts */}
        <div className="text-center mb-8 space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-blue-900/40 text-sky-400 border border-blue-500/20 mb-2">
            <UploadCloud className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-['Alexandria',sans-serif]">
            ارفع صورتك
          </h2>
          <p className="text-base sm:text-lg text-sky-300 font-semibold">
            اختار صورة واضحة ليك، وسيب الباقي على بيلو 😂
          </p>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-600/40 text-rose-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Upload Dropzone / Preview */}
        {!preview ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`group relative rounded-2xl border-2 border-dashed transition-all duration-300 p-8 sm:p-12 text-center cursor-pointer flex flex-col items-center justify-center min-h-[280px] ${
              dragActive
                ? "border-sky-400 bg-blue-900/30 shadow-[0_0_30px_rgba(56,189,248,0.3)]"
                : "border-blue-700/40 bg-blue-950/30 hover:border-blue-500 hover:bg-blue-900/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg, image/webp"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="user"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFile(e.target.files[0]);
                }
              }}
            />

            <div className="w-20 h-20 rounded-2xl bg-blue-900/40 border border-blue-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 group-hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.2)] mb-4">
              <ImageIcon className="w-10 h-10" />
            </div>

            <div className="space-y-1.5 mb-5">
              <p className="text-base sm:text-lg font-bold text-white">
                اسحب صورتك هنا أو اضغط للاختيار من جهازك
              </p>
              <p className="text-xs sm:text-sm text-slate-400">
                صيغ مقبولة: PNG, JPG, JPEG, WEBP (بحد أقصى 20 ميجابايت)
              </p>
            </div>

            {/* Action Buttons inside Dropzone */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                تصفح الملفات
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="px-5 py-2.5 rounded-xl bg-blue-950 hover:bg-blue-900 text-sky-300 border border-blue-700/50 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>التقط صورة بالكاميرا</span>
              </button>
            </div>

            {isValidating && (
              <div className="mt-4 text-xs text-sky-300 animate-pulse">
                جاري التحقق من الصورة...
              </div>
            )}
          </div>
        ) : (
          /* Preview state */
          <div className="space-y-6">
            <div className="relative w-full max-w-sm mx-auto aspect-square rounded-2xl overflow-hidden border-2 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.3)] bg-slate-950">
              <img
                src={preview}
                alt="معاينة الصورة"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center gap-1.5 backdrop-blur-sm">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>صورة ممتازة!</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleContinue}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 text-white font-extrabold text-base sm:text-lg shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>المتابعة لاختيار الشخصية</span>
                <span className="text-xl">😂</span>
              </button>

              <button
                onClick={() => {
                  setPreview(null);
                  setErrorMsg(null);
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-blue-950/60 hover:bg-blue-900/60 border border-blue-700/50 text-sky-300 text-sm font-semibold transition-all cursor-pointer"
              >
                تغيير الصورة
              </button>
            </div>
          </div>
        )}

        {/* Belo Mascot Friendly Tip */}
        <div className="mt-8 pt-6 border-t border-blue-900/40 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-blue-400/30 bg-blue-950 p-1">
            <img src="/assets/hero/belo.png" alt="بيلو" className="w-full h-full object-contain" />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            <strong className="text-sky-300">نصيحة من بيلو:</strong> علشان النتيجة تطلع أحسن حاجة، اتأكد إن الإضاءة كويسة وملامح وشك واضحة في الصورة!
          </p>
        </div>

      </div>
    </section>
  );
};
