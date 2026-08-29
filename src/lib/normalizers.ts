import { NormalizationMode, NormalizationResult, PhoneFormatOption } from '../types';

/**
 * Remove invisible characters, zero-width spaces, normalize newlines and spaces.
 */
export function removeInvisibleChars(str: string): string {
  return str
    .replace(/[\u200B-\u200D\uFEFF\u200E\u200F\u00AD]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * CLEAN TEXT
 * Clean input without changing original meaning:
 * - trim leading/trailing spaces
 * - normalize multiple spaces
 * - normalize line breaks (max 2 consecutive newlines)
 * - remove invisible characters
 * - clean whitespace before punctuation (e.g., "word , word" -> "word, word")
 */
export function cleanText(input: string): string {
  if (!input) return '';
  
  let text = removeInvisibleChars(input);
  
  // Clean line by line
  const lines = text.split('\n').map((line) => {
    // Replace multiple spaces/tabs with single space
    let cleanedLine = line.replace(/[ \t]+/g, ' ').trim();
    // Clean spaces before punctuation like , . ! ? ; :
    cleanedLine = cleanedLine.replace(/[ \t]+([,.:;!?])/g, '$1');
    // Ensure single space after punctuation if followed by a letter/number
    cleanedLine = cleanedLine.replace(/([,.:;!?])([A-Za-z0-9])/g, '$1 $2');
    // Fix multiple consecutive commas or dots (except ellipses ...)
    cleanedLine = cleanedLine.replace(/,{2,}/g, ',');
    return cleanedLine;
  });

  // Join lines and compress more than 2 consecutive blank lines
  let result = lines.join('\n');
  result = result.replace(/\n{3,}/g, '\n\n');
  return result.trim();
}

/**
 * TITLE CASE
 * Capitalizes the first letter of each word and makes remaining letters lowercase.
 * Preserves structure, punctuation, numbers, and dashes.
 */
export function formatTitleCase(input: string): string {
  if (!input) return '';
  
  const cleaned = cleanText(input);
  // Matches unicode / latin words
  return cleaned.replace(/(\p{L})([\p{L}\p{M}]*)/gu, (_match, first: string, rest: string) => {
    return first.toUpperCase() + rest.toLowerCase();
  });
}

/**
 * ALL CAPS
 * Converts all alphabetic characters to uppercase while preserving numbers & structure.
 */
export function formatAllCaps(input: string): string {
  if (!input) return '';
  return cleanText(input).toUpperCase();
}

/**
 * lowercase
 * Converts all alphabetic characters to lowercase.
 */
export function formatLowercase(input: string): string {
  if (!input) return '';
  return cleanText(input).toLowerCase();
}

/**
 * ONE LINE
 * Merges multiline input into a single line, removes unwanted line breaks,
 * and normalizes multiple spaces.
 */
export function formatOneLine(input: string): string {
  if (!input) return '';
  const text = removeInvisibleChars(input);
  // Replace all whitespace (including newlines) with a single space
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * LIST -> SENTENCE
 * Identifies numbering or bullet lists and converts them to a coherent sentence.
 * Examples:
 * 1 item: "Perkara A"
 * 2 items: "Perkara A dan Perkara B."
 * 3+ items: "Perkara A, Perkara B dan Perkara C."
 */
export function formatListToSentence(input: string): { output: string; count: number } {
  if (!input) return { output: '', count: 0 };
  
  const text = removeInvisibleChars(input).trim();
  const rawLines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  
  const items: string[] = [];
  
  for (const line of rawLines) {
    // Strip bullet points (- , * , • , – , — , + , > , ◦ , ▪)
    let cleaned = line.replace(/^[\s\t]*[-*•–—+>◦▪▫●]\s*/, '');
    
    // Strip numbering formats: "1.", "1)", "1 -", "1:", "[1]", "(1)", "1/ "
    cleaned = cleaned.replace(/^[\s\t]*(?:\d+[\.\)\:\-\/]|[\(\[]\d+[\)\]])\s*/, '');
    
    // Clean multiple spaces
    cleaned = cleaned.replace(/[ \t]+/g, ' ').trim();
    
    // Clean trailing punctuation that might conflict with sentence joiners (e.g. trailing comma, semicolon, or period)
    cleaned = cleaned.replace(/[,;]+$/, '').trim();
    
    if (cleaned.length > 0) {
      items.push(cleaned);
    }
  }

  // Edge case: If input was on a single line separated by commas or semicolons with list markers
  if (items.length <= 1 && rawLines.length === 1) {
    const singleLine = rawLines[0];
    // Check if contains numbered markers inside single line like "1. A, 2. B, 3. C"
    const splitNumbered = singleLine.split(/(?:\s|^)(?:\d+[\.\)\:\-]|[\(\[]\d+[\)\]])\s+/).map((s) => s.trim()).filter(Boolean);
    if (splitNumbered.length > 1) {
      items.length = 0;
      for (const item of splitNumbered) {
        const c = item.replace(/[,;]+$/, '').trim();
        if (c) items.push(c);
      }
    }
  }

  const count = items.length;
  if (count === 0) {
    return { output: '', count: 0 };
  }
  
  if (count === 1) {
    // If 1 item, keep as single item without "dan"
    return { output: items[0], count: 1 };
  }
  
  // Sanitize items and format casing for natural sentence flow
  const sanitizedItems = items.map((it, index) => {
    let cleanItem = it.replace(/\.+$/, '').trim();
    if (index === 0) {
      return cleanItem;
    }
    
    // For subsequent items (index > 0), determine if initial letter should be lowercased
    // E.g., "- Taklimat program" -> "taklimat program"
    // But preserve proper identifiers e.g. "Perkara A", "Modul 1", acronyms like "KL", "HHC"
    const words = cleanItem.split(/\s+/);
    const firstWord = words[0];
    
    // If first word is all caps acronym (e.g. "HHC", "KL", "GPS") -> keep as is
    if (/^[A-Z0-9]{2,}$/.test(firstWord)) {
      return cleanItem;
    }
    
    // If followed by single uppercase letter (e.g. "Perkara A", "Sesi B") -> keep as is
    if (words.length > 1 && /^[A-Z]$/.test(words[1])) {
      return cleanItem;
    }
    
    // Otherwise lowercase the first letter
    cleanItem = cleanItem.charAt(0).toLowerCase() + cleanItem.slice(1);
    return cleanItem;
  });
  
  if (count === 2) {
    return {
      output: `${sanitizedItems[0]} dan ${sanitizedItems[1]}.`,
      count: 2,
    };
  }
  
  const allExceptLast = sanitizedItems.slice(0, -1).join(', ');
  const lastItem = sanitizedItems[sanitizedItems.length - 1];
  
  return {
    output: `${allExceptLast} dan ${lastItem}.`,
    count,
  };
}

/**
 * PHONE / WHATSAPP
 * Normalizes Malaysian / International phone numbers for WhatsApp Direct.
 * - Handles: 0145313756, 014-5313756, 014 531 3756, +60 14-531 3756, 60145313756, 60 14 531 3756
 * - Strips: spaces, dashes, brackets, pluses
 * - 0XXXXXXXXX -> 60XXXXXXXXX
 * - 60XXXXXXXXX -> 60XXXXXXXXX
 * - +60XXXXXXXXX -> 60XXXXXXXXX
 */
export function normalizePhone(input: string): {
  waNumber: string;
  waLink: string;
  isValid: boolean;
  warning?: string;
  rawCleaned: string;
} {
  if (!input) {
    return { waNumber: '', waLink: '', isValid: true, rawCleaned: '' };
  }
  
  // Remove invisible chars, spaces, dashes, parentheses, brackets, dots, slashes
  const rawStripped = removeInvisibleChars(input).trim();
  
  // Check if contains alphabet or clearly non-phone characters (excluding + at start)
  const hasLettersOrSymbols = /[a-zA-Z@#$%^&*_=]/.test(rawStripped);
  
  // Strip all non-digit characters except leading plus if any
  let digitsOnly = rawStripped.replace(/[^\d+]/g, '');
  
  // If starts with +, remove +
  if (digitsOnly.startsWith('+')) {
    digitsOnly = digitsOnly.substring(1);
  }
  // Remove any stray + inside
  digitsOnly = digitsOnly.replace(/\+/g, '');
  
  if (!digitsOnly) {
    return {
      waNumber: '',
      waLink: '',
      isValid: false,
      warning: 'Tiada digit nombor telefon dikesan dalam input.',
      rawCleaned: '',
    };
  }

  let formattedNumber = digitsOnly;
  
  // Malaysian local mobile/landline check: if starts with 0 (e.g. 014..., 012..., 03...)
  if (formattedNumber.startsWith('0')) {
    // Replace leading 0 with 60
    formattedNumber = '60' + formattedNumber.substring(1);
  }

  let isValid = true;
  let warning: string | undefined;

  if (hasLettersOrSymbols) {
    warning = 'Terdapat karakter teks atau simbol dalam input. Digit telah diekstrak secara automatik.';
  }

  // Standard validation:
  // Malaysian phone typically starts with 601 (mobile: 10-12 total digits) or 603/4/5/6/7/8/9 (landline: 10-11 digits)
  // International phones are generally 8 to 15 digits in E.164
  if (formattedNumber.length < 8) {
    isValid = false;
    warning = 'Nombor telefon tidak lengkap (kurang daripada 8 digit). Sila semak input.';
  } else if (formattedNumber.length > 15) {
    isValid = false;
    warning = 'Nombor telefon melebihi panjang piawai antarabangsa (lebih 15 digit).';
  } else if (formattedNumber.startsWith('60') && (formattedNumber.length < 10 || formattedNumber.length > 12)) {
    // Notice: 601X-XXX XXXX is 11-12 digits, 603-XXXX XXXX is 10-11 digits
    warning = 'Panjang nombor Malaysia ini kelihatan luar biasa (biasanya 10-12 digit).';
  }

  const waLink = formattedNumber ? `https://wa.me/${formattedNumber}` : '';

  return {
    waNumber: formattedNumber,
    waLink,
    isValid,
    warning,
    rawCleaned: digitsOnly,
  };
}

/**
 * AUTO MODE DETECTOR
 * Conservative heuristics:
 * A. Phone number -> PHONE / WHATSAPP
 * B. Numbered list / bullet list -> LIST -> SENTENCE
 * C. Multiline text without numbering -> ONE LINE / CLEAN TEXT
 * D. Regular text -> CLEAN TEXT
 */
export function detectAutoFormat(input: string): { mode: NormalizationMode; reason: string } {
  if (!input || !input.trim()) {
    return { mode: 'clean_text', reason: 'Teks standard' };
  }

  const text = removeInvisibleChars(input).trim();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // A. Phone number check:
  // If the entire text (ignoring phone punctuation) looks like a single phone number
  const strippedNonDigits = text.replace(/[\s\-\(\)\.\+\/]/g, '');
  const looksLikePhone =
    /^(?:\+?60|0)?1[0-9]{7,9}$/.test(strippedNonDigits) ||
    /^(?:\+?60|0)?[3-9][0-9]{6,8}$/.test(strippedNonDigits) ||
    (/^\+?[0-9]{8,14}$/.test(strippedNonDigits) && lines.length === 1 && !/[a-zA-Z]{3,}/.test(text));

  if (looksLikePhone) {
    return { mode: 'phone_whatsapp', reason: 'Dikesan format nombor telefon / WhatsApp' };
  }

  // B. List check:
  // Check if at least 2 lines start with numbered or bullet markers
  let listMarkerCount = 0;
  for (const line of lines) {
    if (/^(?:[-*•–—+>◦▪▫●]|\d+[\.\)\:\-\/]|[\(\[]\d+[\)\]])\s+/.test(line)) {
      listMarkerCount++;
    }
  }

  if (listMarkerCount >= 2 || (lines.length >= 2 && listMarkerCount === lines.length)) {
    return { mode: 'list_to_sentence', reason: 'Dikesan senarai bernombor / bullet list' };
  }

  // C. Multiline without list markers:
  if (lines.length >= 2) {
    return { mode: 'clean_text', reason: 'Dikesan teks berbilang baris (Clean Text)' };
  }

  // D. Default regular text:
  return { mode: 'clean_text', reason: 'Dikesan teks biasa' };
}

/**
 * Main normalization orchestrator
 */
export function normalizeInput(
  input: string,
  mode: NormalizationMode,
  phoneOption: PhoneFormatOption = 'number'
): NormalizationResult {
  if (!input || !input.trim()) {
    return {
      output: '',
      detectedMode: mode === 'auto' ? 'clean_text' : undefined,
    };
  }

  let effectiveMode = mode;
  let detectedInfo: { mode: NormalizationMode; reason: string } | undefined;

  if (mode === 'auto') {
    detectedInfo = detectAutoFormat(input);
    effectiveMode = detectedInfo.mode;
  }

  switch (effectiveMode) {
    case 'title_case': {
      return {
        output: formatTitleCase(input),
        detectedMode: mode === 'auto' ? 'title_case' : undefined,
      };
    }
    case 'all_caps': {
      return {
        output: formatAllCaps(input),
        detectedMode: mode === 'auto' ? 'all_caps' : undefined,
      };
    }
    case 'lowercase': {
      return {
        output: formatLowercase(input),
        detectedMode: mode === 'auto' ? 'lowercase' : undefined,
      };
    }
    case 'one_line': {
      return {
        output: formatOneLine(input),
        detectedMode: mode === 'auto' ? 'one_line' : undefined,
      };
    }
    case 'list_to_sentence': {
      const { output, count } = formatListToSentence(input);
      return {
        output,
        itemCount: count,
        detectedMode: mode === 'auto' ? 'list_to_sentence' : undefined,
      };
    }
    case 'phone_whatsapp': {
      const phone = normalizePhone(input);
      const output = phoneOption === 'link' ? phone.waLink : phone.waNumber;
      return {
        output,
        warning: phone.warning,
        phoneDetails: phone,
        detectedMode: mode === 'auto' ? 'phone_whatsapp' : undefined,
      };
    }
    case 'clean_text':
    default: {
      return {
        output: cleanText(input),
        detectedMode: mode === 'auto' ? 'clean_text' : undefined,
      };
    }
  }
}
