import React, { useState } from "react";
import { X, Upload, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Image as ImageIcon } from "lucide-react";
import { CharacterWithStatus } from "../types";

interface OrganizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  characters: CharacterWithStatus[];
  onRefreshCharacters: () => void;
}

export const OrganizerModal: React.FC<OrganizerModalProps> = ({
  isOpen,
  onClose,
  characters,
  onRefreshCharacters,
}) => {
  const [uploadingTarget, setUploadingTarget] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAssetUpload = async (targetPath: string, file: File) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setUploadingTarget(targetPath);

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        const res = await fetch("/api/admin/upload-asset", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetPath: targetPath.startsWith("/") ? targetPath.slice(1) : targetPath,
            imageBase64: base64,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg(`تم تحديث الملف ${targetPath} بنجاح!`);
          onRefreshCharacters();
        } else {
          setErrorMsg(data.error || "فشل رفع الملف");
        }
      } catch (err: any) {
        setErrorMsg("تعذر الاتصال بالسيرفر");
      } finally {
        setUploadingTarget(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const checkHealth = async () => {
    try {
      setApiStatus("جاري فحص حالة السيرفر و Gemini API...");
      const res = await fetch("/api/health");
      const data = await res.json();
      if (data.hasApiKey) {
        setApiStatus("✅ السيرفر يعمل و GEMINI_API_KEY متصل بنجاح!");
      } else {
        setApiStatus("⚠️ السيرفر يعمل ولكن GEMINI_API_KEY غير متوفر في متغيرات البيئة.");
      }
    } catch {
      setApiStatus("❌ فشل الاتصال بالسيرفر.");
    }
  };

  const coreAssets = [
    { label: "شعار YLY", path: "/assets/logos/yly.png" },
    { label: "شعار 5in1", path: "/assets/logos/5in1.png" },
    { label: "شعار وزارة الشباب والرياضة", path: "/assets/logos/ministry.png" },
    { label: "تميمة بيلو (Belo Mascot)", path: "/assets/hero/belo.png" },
    { label: "شخصية الهيرو الرئيسية", path: "/assets/hero/hero-character.png" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#081226] border border-blue-500/40 p-6 sm:p-8 text-right shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-900/50 mb-6">
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-blue-900/40 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-white">لوحة إدارة أصول الحملة والشخصيات</h3>
            <Sparkles className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        {/* API Health & Status */}
        <div className="mb-6 p-4 rounded-2xl bg-blue-950/60 border border-blue-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-400 block">فحص اتصال السيرفر و Gemini API</span>
            <span className="text-sm font-semibold text-sky-200">
              {apiStatus || "اضغط لفحص الاتصال"}
            </span>
          </div>
          <button
            onClick={checkHealth}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>فحص الاتصال</span>
          </button>
        </div>

        {/* Alert Messages */}
        {successMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="mb-4 p-3.5 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Logos & Core Assets Section */}
        <div className="mb-8">
          <h4 className="text-sm font-bold text-sky-300 mb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>أصول الهوية والشعارات الرسمية</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {coreAssets.map((asset) => (
              <div
                key={asset.path}
                className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/40 flex items-center justify-between"
              >
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-sky-300 text-xs font-semibold flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === asset.path ? "جاري الرفع..." : "استبدال"}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={uploadingTarget === asset.path}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAssetUpload(asset.path, e.target.files[0]);
                      }
                    }}
                  />
                </label>
                <div className="text-right">
                  <span className="text-xs font-bold text-white block">{asset.label}</span>
                  <span className="text-[10px] text-slate-400 block ltr">{asset.path}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Characters Assets Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={onRefreshCharacters}
              className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>تحديث القائمة</span>
            </button>
            <h4 className="text-sm font-bold text-sky-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>أصول شخصيات هنيدي (المدخل إلى Gemini)</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {characters.map((char) => (
              <div
                key={char.id}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  char.available
                    ? "bg-blue-950/40 border-blue-900/40"
                    : "bg-slate-950/60 border-amber-900/40"
                }`}
              >
                <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingTarget === char.image ? "جاري الرفع..." : char.available ? "تحديث" : "إضافة صورة"}</span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    disabled={uploadingTarget === char.image}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleAssetUpload(char.image, e.target.files[0]);
                      }
                    }}
                  />
                </label>

                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end">
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${
                        char.available
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-700/50"
                          : "bg-amber-950 text-amber-400 border border-amber-700/50"
                      }`}
                    >
                      {char.available ? "جاهز ومفعل" : "غير متوفر"}
                    </span>
                    <span className="text-xs font-bold text-white">{char.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{char.movie} ({char.image})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-4 border-t border-blue-900/50 text-center text-xs text-slate-400">
          هذه اللوحة مخصصة لفريق عمل إيفنت YLY 51 بالأقصر لتحديث وتجهيز الشخصيات بسهولة.
        </div>

      </div>
    </div>
  );
};
