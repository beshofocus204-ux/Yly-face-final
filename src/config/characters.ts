export interface Character {
  id: string;
  name: string;
  movie: string;
  image: string;
  description: string;
  tagline: string;
}

/** Real character assets supplied with the campaign package. */
export const CHARACTERS: Character[] = [
  { id: "character-01", name: "الشخصية الأولى", movie: "اختار وعيش الدور", image: "/assets/characters/character-01.jpg", description: "خلي وشك هو بطل المشهد", tagline: "يلا نبدأ الضحك!" },
  { id: "character-02", name: "الشخصية الثانية", movie: "اختار وعيش الدور", image: "/assets/characters/character-02.jpg", description: "ستايل مختلف وشخصية مميزة", tagline: "جاهز للمغامرة؟" },
  { id: "character-03", name: "الشخصية الثالثة", movie: "اختار وعيش الدور", image: "/assets/characters/character-03.jpg", description: "لوك كوميدي جديد في انتظارك", tagline: "الضحك على أصوله!" },
  { id: "character-04", name: "الشخصية الرابعة", movie: "اختار وعيش الدور", image: "/assets/characters/character-04.jpg", description: "حضور قوي وابتسامة لا تُنسى", tagline: "كله تمام يا نجم!" },
  { id: "character-05", name: "الشخصية الخامسة", movie: "اختار وعيش الدور", image: "/assets/characters/character-05.jpg", description: "بدّل الجو وجرّب شخصية جديدة", tagline: "مين قدك؟" },
  { id: "character-06", name: "الشخصية السادسة", movie: "اختار وعيش الدور", image: "/assets/characters/character-06.jpg", description: "مظهر مميز لتجربة مختلفة", tagline: "الصورة هتتكلم!" },
  { id: "character-07", name: "الشخصية السابعة", movie: "اختار وعيش الدور", image: "/assets/characters/character-07.jpg", description: "اختيارك جاهز للدمج", tagline: "بيلو هيظبطها!" },
  { id: "character-08", name: "الشخصية الثامنة", movie: "اختار وعيش الدور", image: "/assets/characters/character-08.jpg", description: "خليك نجم الكادر", tagline: "ضحكة حلوة وابدأ!" },
  { id: "character-09", name: "الشخصية التاسعة", movie: "اختار وعيش الدور", image: "/assets/characters/character-09.jpg", description: "شخصية إضافية من ألبوم الحملة", tagline: "اختيار جامد!" },
  { id: "character-10", name: "الشخصية العاشرة", movie: "اختار وعيش الدور", image: "/assets/characters/character-10.jpg", description: "ستايل جديد لصورتك", tagline: "جاهز للتجربة؟" },
  { id: "character-11", name: "الشخصية الحادية عشرة", movie: "اختار وعيش الدور", image: "/assets/characters/character-11.jpg", description: "آخر اختيار ومش أقلهم كوميديا", tagline: "يلا بينا!" },
];
