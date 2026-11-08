export interface TasbihPreset {
  id: string;
  text: string;
  target: number;
  meaning?: string;
  isCustom?: boolean;
}

export interface AfterPrayerDua {
  id: string;
  title: string;
  text: string;
  count: number;
  note?: string;
  reference: string;
  tags: string[];
}

export interface AdhkarItem {
  id: string;
  title: string;
  text: string;
  count: number;
  virtue?: string;
  tags: string[];
}

export interface PrayerStep {
  step: number;
  title: string;
  action: string;
  arabic: string;
  transliteration?: string;
  note?: string;
}

export interface ShortSurah {
  number: number;
  name: string;
  ayah_count: number;
  text: string;
}

export interface TravelDua {
  id: string;
  title: string;
  text: string;
  reference: string;
  tags: string[];
}

export interface FridaySunnah {
  id: string;
  title: string;
  desc: string;
  icon: string;
}

export interface KahfSection {
  id: string;
  title: string;
  ayah_range: string;
  summary: string;
}

export interface FamilyDua {
  id: string;
  category: 'parents_alive' | 'parents_deceased' | 'siblings' | 'children_family';
  category_ar: string;
  title: string;
  text: string;
  tags: string[];
}

export interface SearchTag {
  keyword: string;
  label: string;
  category: string;
  link: string;
}

export interface DuasDatabase {
  tasbih_presets: TasbihPreset[];
  after_prayer: AfterPrayerDua[];
  adhkar: {
    morning: AdhkarItem[];
    evening: AdhkarItem[];
  };
  prayer_guide: {
    steps: PrayerStep[];
    short_surahs: ShortSurah[];
  };
  travel: TravelDua[];
  friday: {
    sunnahs: FridaySunnah[];
    salawat_counter: {
      text: string;
      target: number;
    };
    last_hour_dua: {
      title: string;
      desc: string;
      duas: string[];
    };
    kahf_sections: KahfSection[];
  };
  family: FamilyDua[];
  search_tags: SearchTag[];
}
