export const flowerNamesHebrew: Record<string, string> = {
  rose: "ורד",
  tulip: "צבעוני",
  sunflower: "חמנייה",
  daisy: "חיננית",
  lily: "שושן",
  orchid: "סחלב",
  marigold: "ציפורני החתול",
  petunia: "פטוניה",
  lavender: "לבנדר",
  zinnia: "זיניה",
  hydrangea: "הידראנגאה",
  peony: "אדמונית",
};

export const flowerNamesItalian: Record<string, string> = {
  rose: "Rosa",
  tulip: "Tulipano",
  sunflower: "Girasole",
  daisy: "Margherita",
  lily: "Giglio",
  orchid: "Orchidea",
  marigold: "Calendula",
  petunia: "Petunia",
  lavender: "Lavanda",
  zinnia: "Zinnia",
  hydrangea: "Ortensia",
  peony: "Peonia",
};

export const flowerNamesSpanish: Record<string, string> = {
  rose: "Rosa",
  tulip: "Tulipán",
  sunflower: "Girasol",
  daisy: "Margarita",
  lily: "Lirio",
  orchid: "Orquídea",
  marigold: "Caléndula",
  petunia: "Petunia",
  lavender: "Lavanda",
  zinnia: "Zinnia",
  hydrangea: "Hortensia",
  peony: "Peonía",
};

export const flowerNamesJapanese: Record<string, string> = {
  rose: "ばら",
  tulip: "チューリップ",
  sunflower: "ひまわり",
  daisy: "デイジー",
  lily: "ゆり",
  orchid: "ラン",
  marigold: "マリーゴールド",
  petunia: "ペチュニア",
  lavender: "ラベンダー",
  zinnia: "ジニア",
  hydrangea: "アジサイ",
  peony: "ボタン",
};

export const flowerNamesPortuguese: Record<string, string> = {
  rose: "Rosa",
  tulip: "Tulipa",
  sunflower: "Girassol",
  daisy: "Margarida",
  lily: "Lírio",
  orchid: "Orquídea",
  marigold: "Caléndula",
  petunia: "Petúnia",
  lavender: "Lavanda",
  zinnia: "Zínia",
  hydrangea: "Hortênsia",
  peony: "Peônia",
};

export const flowerNamesPolish: Record<string, string> = {
  rose: "Róża",
  tulip: "Tulipan",
  sunflower: "Słonecznik",
  daisy: "Stokrotka",
  lily: "Lilia",
  orchid: "Storczyk",
  marigold: "Aksamitka",
  petunia: "Petunia",
  lavender: "Lawenda",
  zinnia: "Cynia",
  hydrangea: "Hortensja",
  peony: "Piwonia",
};

export const flowerNamesArabic: Record<string, string> = {
  rose: "وردة",
  tulip: "توليب",
  sunflower: "عباد الشمس",
  daisy: "أقحوان",
  lily: "زنبق",
  orchid: "أوركيد",
  marigold: "قطيفة",
  petunia: "بتونيا",
  lavender: "لافندر",
  zinnia: "زينيا",
  hydrangea: "هيدرانجيا",
  peony: "بيوني",
};

export const flowerNamesFrench: Record<string, string> = {
  rose: "Rose",
  tulip: "Tulipe",
  sunflower: "Tournesol",
  daisy: "Marguerite",
  lily: "Lys",
  orchid: "Orchidée",
  marigold: "Souci",
  petunia: "Pétunia",
  lavender: "Lavande",
  zinnia: "Zinnia",
  hydrangea: "Hortensia",
  peony: "Pivoine",
};

export const flowerNamesCzech: Record<string, string> = {
  rose: "Růže",
  tulip: "Tulipán",
  sunflower: "Slunečnice",
  daisy: "Sedmikráska",
  lily: "Lilie",
  orchid: "Orchidej",
  marigold: "Aksamitník",
  petunia: "Petúnie",
  lavender: "Levandule",
  zinnia: "Cínie",
  hydrangea: "Hortenzie",
  peony: "Pivoňka",
};

export const flowerNamesGerman: Record<string, string> = {
  rose: "Rose",
  tulip: "Tulpe",
  sunflower: "Sonnenblume",
  daisy: "Gänseblümchen",
  lily: "Lilie",
  orchid: "Orchidee",
  marigold: "Ringelblume",
  petunia: "Petunie",
  lavender: "Lavendel",
  zinnia: "Zinnie",
  hydrangea: "Hortensie",
  peony: "Pfingstrose",
};

/**
 * Resolves the localized flower name based on the language string.
 * Routes directly to the respective independent language objects.
 */
export function getFlowerName(id: string, lang: string, fallback: string): string {
  if (lang === "he") return flowerNamesHebrew[id] || fallback;
  if (lang === "it") return flowerNamesItalian[id] || fallback;
  if (lang === "es") return flowerNamesSpanish[id] || fallback;
  if (lang === "ja") return flowerNamesJapanese[id] || fallback;
  if (lang === "pt") return flowerNamesPortuguese[id] || fallback;
  if (lang === "pl") return flowerNamesPolish[id] || fallback;
  if (lang === "ar") return flowerNamesArabic[id] || fallback;
  if (lang === "fr") return flowerNamesFrench[id] || fallback;
  if (lang === "cz") return flowerNamesCzech[id] || fallback;
  if (lang === "de") return flowerNamesGerman[id] || fallback;
  return fallback;
}