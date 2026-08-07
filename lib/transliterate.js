// Implements the official Ukrainian national transliteration table
// (Resolution of the Cabinet of Ministers of Ukraine No. 55, 27 Jan 2010).
// https://zakon.rada.gov.ua/laws/show/55-2010-%D0%BF#Text

const SIMPLE_MAP = {
  а: "a",
  б: "b",
  в: "v",
  г: "h",
  ґ: "g",
  д: "d",
  е: "e",
  ж: "zh",
  з: "z",
  и: "y",
  і: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "kh",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "shch",
};

// These letters render differently at the start of a word vs. elsewhere.
const INITIAL_MAP = { є: "ye", ї: "yi", й: "y", ю: "yu", я: "ya" };
const NON_INITIAL_MAP = { є: "ie", ї: "i", й: "i", ю: "iu", я: "ia" };

/**
 * Transliterates Ukrainian (Cyrillic) text to Latin per Resolution 55-2010.
 */
export function transliterate(text) {
  if (!text) return "";
  const lower = text.toLowerCase();
  let result = "";
  let atWordStart = true;
  let i = 0;

  while (i < lower.length) {
    const ch = lower[i];
    const next = lower[i + 1];

    // Special digraph: "зг" -> "zgh", to distinguish from "ж" -> "zh"
    if (ch === "з" && next === "г") {
      result += "zgh";
      atWordStart = false;
      i += 2;
      continue;
    }

    // Soft sign / apostrophe: not transliterated themselves, but the
    // letter that follows is treated as if it were word-initial.
    if (ch === "ь" || ch === "'" || ch === "’") {
      atWordStart = true;
      i += 1;
      continue;
    }

    if (ch in INITIAL_MAP) {
      result += atWordStart ? INITIAL_MAP[ch] : NON_INITIAL_MAP[ch];
      atWordStart = false;
      i += 1;
      continue;
    }

    if (ch in SIMPLE_MAP) {
      result += SIMPLE_MAP[ch];
      atWordStart = false;
      i += 1;
      continue;
    }

    // Spaces, hyphens, digits, already-Latin characters, etc. pass through.
    result += ch;
    atWordStart = ch === " " || ch === "-";
    i += 1;
  }

  return result;
}

/**
 * Turns arbitrary text into a URL-safe slug fragment:
 * lowercase, only a-z/0-9, words joined by single hyphens.
 */
export function slugify(text) {
  return String(text || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Builds the base grave slug: "(birth year)-(death year)-(surname)".
 * Missing years are simply omitted rather than breaking the format.
 */
export function buildGraveSlugBase(lastName, birthYear, deathYear) {
  const nameSlug = slugify(transliterate(lastName || ""));
  const parts = [birthYear, deathYear, nameSlug].filter(
    (part) => part !== null && part !== undefined && part !== ""
  );
  return parts.join("-");
}
