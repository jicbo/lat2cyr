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

function convertText(text) {
  if (text == null) return '';
  return String(text).replace(LATIN_REGEX, (m) => LATIN_TO_CYRILLIC[m] ?? m);
}