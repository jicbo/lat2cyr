const LATIN_TO_CYRILLIC = {
  "Dž": "Џ", "dž": "џ", "DŽ": "Џ",
  "Dj": "Ђ", "dj": "ђ", "DJ": "Ђ",
  "Lj": "Љ", "lj": "љ", "LJ": "Љ",
  "Nj": "Њ", "nj": "њ", "NJ": "Њ",
  "a": "а", "b": "б", "v": "в", "g": "г", "d": "д", "đ": "ђ", "e": "е",
  "ž": "ж", "z": "з", "i": "и", "j": "ј", "k": "к", "l": "л", "m": "м",
  "n": "н", "o": "о", "p": "п", "r": "р", "s": "с", "t": "т", "ć": "ћ",
  "u": "у", "f": "ф", "h": "х", "c": "ц", "č": "ч", "š": "ш",
  "A": "А", "B": "Б", "V": "В", "G": "Г", "D": "Д", "Đ": "Ђ", "E": "Е",
  "Ž": "Ж", "Z": "З", "I": "И", "J": "Ј", "K": "К", "L": "Л", "M": "М",
  "N": "Н", "O": "О", "P": "П", "R": "Р", "S": "С", "T": "Т", "Ć": "Ћ",
  "U": "У", "F": "Ф", "H": "Х", "C": "Ц", "Č": "Ч", "Š": "Ш"
};

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const LATIN_PATTERN = Object.keys(LATIN_TO_CYRILLIC)
  .sort((a, b) => b.length - a.length)
  .map(escapeRegExp)
  .join('|');
const LATIN_REGEX = new RegExp(LATIN_PATTERN, 'g');

function convertGeneric(s) {
  return s.replace(LATIN_REGEX, (m) => LATIN_TO_CYRILLIC[m] ?? m);
}

// Word stems where a digraph sequence spans a morpheme boundary and must
// NOT fold into one Cyrillic letter (e.g. n+j -> нј, not њ). Stored lowercase;
// matching is prefix-based so inflections are covered (injekcija, injekcije...).
const LATIN_EXCEPTION_STEMS = [
  ["podžanr", "поджанр"],
  ["konjunk", "конјунк"],
  ["disjunk", "дисјунк"],
  ["konjug", "конјуг"],
  ["tanjug", "танјуг"],
  ["adjekt", "адјект"],
  ["predjel", "предјел"],
  ["nadjač", "надјач"],
  ["odjav", "одјав"],
  ["nadživ", "наджив"],
  ["podjed", "подјед"],
  ["odjed", "одјед"],
  ["injek", "инјек"],
].sort((a, b) => b[0].length - a[0].length);

function convertWord(word) {
  const lower = word.toLowerCase();
  for (const [lat, cyr] of LATIN_EXCEPTION_STEMS) {
    if (lower.startsWith(lat)) {
      const rest = word.slice(lat.length);
      let stem;
      if (word === word.toUpperCase()) {
        stem = cyr.toUpperCase();
      } else if (word[0] === word[0].toUpperCase()) {
        stem = cyr[0].toUpperCase() + cyr.slice(1);
      } else {
        stem = cyr;
      }
      return stem + convertGeneric(rest);
    }
  }
  return convertGeneric(word);
}

function convertText(text) {
  if (text == null) return '';
  return String(text)
    .split(/(\p{L}+)/u)
    .map((part) => (/^\p{L}+$/u.test(part) ? convertWord(part) : part))
    .join('');
}

// Single Cyrillic chars map 1:1 to Latin. Forward is many-to-one
// (Dj -> Ђ and Đ -> Ђ), so reverse picks the standards: Ђ -> Đ,
// Џ -> Dž, Љ -> Lj, Њ -> Nj.
const CYRILLIC_TO_LATIN = {
  "Џ": "Dž", "џ": "dž",
  "Ђ": "Đ", "ђ": "đ",
  "Љ": "Lj", "љ": "lj",
  "Њ": "Nj", "њ": "nj",
  "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e",
  "ж": "ž", "з": "z", "и": "i", "ј": "j", "к": "k", "л": "l", "м": "m",
  "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "ћ": "ć",
  "у": "u", "ф": "f", "х": "h", "ц": "c", "ч": "č", "ш": "š",
  "А": "A", "Б": "B", "В": "V", "Г": "G", "Д": "D", "Е": "E",
  "Ж": "Ž", "З": "Z", "И": "I", "Ј": "J", "К": "K", "Л": "L", "М": "M",
  "Н": "N", "О": "O", "П": "P", "Р": "R", "С": "S", "Т": "T", "Ћ": "Ć",
  "У": "U", "Ф": "F", "Х": "H", "Ц": "C", "Ч": "Č", "Ш": "Š"
};

// All-caps words need all-caps digraphs (ЏЕП -> DŽEP, not DžEP).
const CYRILLIC_TO_LATIN_UPPER = {
  ...CYRILLIC_TO_LATIN, "Џ": "DŽ", "Љ": "LJ", "Њ": "NJ"
};

const CYRILLIC_PATTERN = Object.keys(CYRILLIC_TO_LATIN)
  .map(escapeRegExp)
  .join('|');
const CYRILLIC_REGEX = new RegExp(CYRILLIC_PATTERN, 'g');

function convertToLatin(text) {
  if (text == null) return '';
  return String(text)
    .split(/(\p{L}+)/u)
    .map((part) => {
      if (!/^\p{L}+$/u.test(part)) return part;
      const map = part === part.toUpperCase() ? CYRILLIC_TO_LATIN_UPPER : CYRILLIC_TO_LATIN;
      return part.replace(CYRILLIC_REGEX, (m) => map[m] ?? m);
    })
    .join('');
}