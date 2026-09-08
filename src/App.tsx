import React, { useState, useEffect, useCallback } from "react";
import { CosmicBackground } from "./components/CosmicBackground";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { LandingHero } from "./components/LandingHero";
import { UploadSection } from "./components/UploadSection";
import { CharacterSelection } from "./components/CharacterSelection";
import { LoadingScreen } from "./components/LoadingScreen";
import { ResultView } from "./components/ResultView";
import { OrganizerModal } from "./components/OrganizerModal";
import { CHARACTERS } from "./config/characters";
import { Step, CharacterWithStatus } from "./types";
import { AlertCircle, X } from "lucide-react";

export function App() {
  const [step, setStep] = useState<Step>("landing");
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isOrganizerOpen, setIsOrganizerOpen] = useState(false);

  // Initialize characters from central config with available status
  const [characters, setCharacters] = useState<CharacterWithStatus[]>(() =>
    CHARACTERS.map((char, index) => ({
      ...char,
      // By default first 4 starter characters are generated and available on disk
      available: true,
    }))
  );

  // Fetch actual disk availability from backend API
  const fetchCharactersStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/characters");
      if (res.ok) {
        const data = await res.json();
        if (data.characters) {
          setCharacters(data.characters);
        }
      }
    } catch (e) {
      console.warn("Could not fetch character status from API, using local config:", e);
    }
  }, []);

  useEffect(() => {
    fetchCharactersStatus();
  }, [fetchCharactersStatus]);

  // Handler for user uploading photo
  const handleImageSelected = (base64Image: string) => {
    setUserImage(base64Image);
    setErrorMessage(null);
    // Flow: Upload Photo -> Character Selection
    setStep("select");
  };

  // Handler for initiating the Gemini face swap
  const handleStartSwap = async () => {
    if (!userImage) {
      setErrorMessage("الصورة مش واضحة كفاية، جرّب صورة تانية.");
      setStep("upload");
      return;
    }

    if (!selectedCharacterId) {
      setErrorMessage("الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂");
      return;
    }

    const selectedChar = characters.find((c) => c.id === selectedCharacterId);
    if (!selectedChar || !selectedChar.available) {
      setErrorMessage("الشخصية مش جاهزة دلوقتي، جرّب شخصية تانية 😂");
      return;
    }

    // Enter loading state with Belo mascot
    setStep("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/face-swap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userImage: userImage,
          selectedCharacterId: selectedCharacterId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success && data.resultImage) {
        setResultImage(data.resultImage);
        setStep("result");
      } else {
        const friendlyError = data.error || "حصلت مشكلة بسيطة، جرّب تاني 😂";
        setErrorMessage(friendlyError);
        setStep("select");
      }
    } catch (err) {
      console.error("Face swap network/server error:", err);
      setErrorMessage("حصلت مشكلة بسيطة، جرّب تاني 😂");
      setStep("select");
    }
  };

  // Handler for trying another character (preserves user photo)
  const handleTryAnotherCharacter = () => {
    setResultImage(null);
    setErrorMessage(null);
    setStep("select");
  };

  // Handler for uploading a brand new photo
  const handleUploadNewPhoto = () => {
    setUserImage(null);
    setSelectedCharacterId(null);
    setResultImage(null);
    setErrorMessage(null);
    setStep("upload");
  };

  const selectedCharacter = characters.find((c) => c.id === selectedCharacterId);

  return (
    <div className="min-h-screen bg-[#040817] text-white flex flex-col font-['Cairo',sans-serif] selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      
      {/* Dynamic Cosmic Stars & Nebula Backdrop */}
      <CosmicBackground />

      {/* Campaign Header */}
      <Header
        onOpenOrganizerModal={() => setIsOrganizerOpen(true)}
        onResetToLanding={() => setStep("landing")}
      />

      {/* Global Friendly Error Banner if any */}
      {errorMessage && (
        <div className="relative z-30 max-w-2xl mx-auto mt-4 px-4 w-full">
          <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-sm flex items-center justify-between gap-3 shadow-lg backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span className="font-semibold">{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-rose-900/50 text-rose-300 hover:text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Experience Flow */}
      <main className="flex-1 flex flex-col">
        {step === "landing" && (
          <LandingHero onStartUpload={() => setStep("upload")} />
        )}

        {step === "upload" && (
          <UploadSection
            onImageSelected={handleImageSelected}
            onBackToLanding={() => setStep("landing")}
            initialImage={userImage}
          />
        )}

        {step === "select" && userImage && (
          <CharacterSelection
            characters={characters}
            selectedCharacterId={selectedCharacterId}
            onSelectCharacter={(id) => {
              setSelectedCharacterId(id);
              setErrorMessage(null);
            }}
            userImage={userImage}
            onStartSwap={handleStartSwap}
            onChangePhoto={() => setStep("upload")}
          />
        )}

        {step === "loading" && (
          <LoadingScreen />
        )}

        {step === "result" && resultImage && selectedCharacter && userImage && (
          <ResultView
            resultImage={resultImage}
            userImage={userImage}
            character={selectedCharacter}
            onTryAnotherCharacter={handleTryAnotherCharacter}
            onUploadNewPhoto={handleUploadNewPhoto}
          />
        )}
      </main>

      {/* Official Credits Footer */}
      <Footer />

      {/* Organizer & Asset Management Modal */}
      <OrganizerModal
        isOpen={isOrganizerOpen}
        onClose={() => setIsOrganizerOpen(false)}
        characters={characters}
        onRefreshCharacters={fetchCharactersStatus}
      />

    </div>
  );
}

export default App;
