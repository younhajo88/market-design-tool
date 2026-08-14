export const RECENT_OUTLINE_COLORS_KEY = 'market-design-tool:recent-outline-colors';

const MAX_RECENT_COLORS = 5;
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

function normalizeColor(color: string): string | null {
  const normalized = color.trim().toLowerCase();
  return HEX_COLOR_PATTERN.test(normalized) ? normalized : null;
}

function sanitizeRecentColors(colors: string[]): string[] {
  return colors.reduce<string[]>((result, color) => {
    const normalizedColor = normalizeColor(color);
    if (!normalizedColor || result.includes(normalizedColor)) {
      return result;
    }

    return result.length < MAX_RECENT_COLORS ? [...result, normalizedColor] : result;
  }, []);
}

export function addRecentColor(currentColors: string[], color: string): string[] {
  const normalizedColor = normalizeColor(color);
  if (!normalizedColor) {
    return sanitizeRecentColors(currentColors);
  }

  const existingColors = sanitizeRecentColors(currentColors).filter((currentColor) => currentColor !== normalizedColor);
  return [normalizedColor, ...existingColors].slice(0, MAX_RECENT_COLORS);
}

export function readRecentColors(storage: Storage = localStorage): string[] {
  try {
    const storedValue = storage.getItem(RECENT_OUTLINE_COLORS_KEY);
    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return sanitizeRecentColors(parsedValue.filter((value): value is string => typeof value === 'string'));
  } catch {
    return [];
  }
}

export function writeRecentColors(colors: string[], storage: Storage = localStorage): void {
  try {
    storage.setItem(RECENT_OUTLINE_COLORS_KEY, JSON.stringify(sanitizeRecentColors(colors)));
  } catch {
    // Recent colors are convenience state; export should never fail because storage is unavailable.
  }
}