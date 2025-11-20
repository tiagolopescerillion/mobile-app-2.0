import { TextStyle } from 'react-native';

export type Mode = 'light' | 'dark';

/**
 * Primitives – the resolved shape you actually use in UI code.
 * Extend this gradually as you add more tokens.
 */
export type SpacingKey = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RadiusKey = 'sm' | 'md' | 'lg' | 'xl';
export type BorderWidthKey = 'none' | 'thin' | 'medium';

export type PaletteShades = Record<string, string>;

export interface PaletteTokens {
  primary: PaletteShades;
  secondary: PaletteShades;
  neutral: PaletteShades;
  [key: string]: PaletteShades;
}

export interface ColorTokens {
  background: string;
  surface: string;
  cardBackground: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  [key: string]: string;
}

export interface TypographyTokens {
  fontFamilyDefault: string;
  fontFamilyTitle: string;
  fontFamilyMono: string;
  titleFontSize: number;
  descriptionFontSize: number;
  bodyFontSize: number;
  captionFontSize: number;
  titleFontWeight: TextStyle['fontWeight'];
  descriptionFontWeight: TextStyle['fontWeight'];
  bodyFontWeight: TextStyle['fontWeight'];
  captionFontWeight: TextStyle['fontWeight'];
  lineHeightTight: number;
  lineHeightDefault: number;
  lineHeightRelaxed: number;
  [key: string]: string | number;
}

export interface ResolvedPrimitives {
  // numeric scales
  spacing: Record<SpacingKey, number>;
  radius: Record<RadiusKey, number>;
  borderWidth: Record<BorderWidthKey, number>;

  palettes: PaletteTokens;
  colors: ColorTokens;
  typography: TypographyTokens;

  // you can add more here as you start using them from code,
  // e.g. colors, palettes, typography, etc.
  // For now we just say "anything else" so the resolver can still put
  // other stuff in primitives without breaking types:
  [key: string]: unknown;
}

/**
 * Semantic – only the bits you actually access from TS code.
 * You can expand this over time.
 */

export interface PageVariantTokens {
  backgroundColor: string;
  paddingHorizontal: number;
  paddingVertical: number;
}

export interface PageSemanticTokens {
  default: PageVariantTokens;
  surface: PageVariantTokens;
  [key: string]: PageVariantTokens;
}

export interface ButtonVariantTokens {
  backgroundDefault: string;
  backgroundPressed: string;
  backgroundDisabled: string;
  textColorDefault: string;
  borderRadius: number;
  paddingVertical: number;
  paddingHorizontal: number;
  borderWidth: number;
  borderColor: string;
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  gradientMain?: string[]; // optional
}

export interface ButtonSemanticTokens {
  primary: ButtonVariantTokens;
  secondary: ButtonVariantTokens;
  [key: string]: ButtonVariantTokens;
}

export interface TextVariantTokens {
  color: string;
  fontSize: number;
  fontWeight: TextStyle['fontWeight'];
  lineHeight: number;
  fontFamily: string;
}

export interface TextSemanticTokens {
  title: TextVariantTokens;
  description: TextVariantTokens;
  body: TextVariantTokens;
  caption: TextVariantTokens;
  [key: string]: TextVariantTokens;
}

export interface CardVariantTokens {
  backgroundColor: string;
  borderRadius: number;
  padding: number;
  borderWidth: number;
  borderColor: string;
  elevation: number;
}

export interface CardSemanticTokens {
  default: CardVariantTokens;
  flat: CardVariantTokens;
  [key: string]: CardVariantTokens;
}

export interface ResolvedSemantic {
  page: PageSemanticTokens;
  button: ButtonSemanticTokens;
  text: TextSemanticTokens;
  card: CardSemanticTokens;

  // allow future namespaces without breaking types
  [key: string]: unknown;
}
