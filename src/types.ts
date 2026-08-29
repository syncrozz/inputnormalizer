export type NormalizationMode =
  | 'auto'
  | 'title_case'
  | 'all_caps'
  | 'lowercase'
  | 'one_line'
  | 'list_to_sentence'
  | 'phone_whatsapp'
  | 'clean_text';

export type PhoneFormatOption = 'number' | 'link';

export interface NormalizationResult {
  output: string;
  detectedMode?: NormalizationMode;
  warning?: string;
  itemCount?: number;
  phoneDetails?: {
    rawCleaned: string;
    waNumber: string;
    waLink: string;
    isValid: boolean;
  };
}

export interface ModeOption {
  id: NormalizationMode;
  label: string;
  shortLabel: string;
  description: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'MASTER_ADMIN';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt?: string;
  lastLoginAt?: string;
}

export interface SavedRecord {
  id: string;
  userId: string;
  title: string;
  rawInput: string;
  formattedOutput: string;
  mode: NormalizationMode;
  isSaved: boolean; // true if marked as favorite/saved snippet, false if standard history
  createdAt: string;
  updatedAt?: string;
}

