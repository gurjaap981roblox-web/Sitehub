/**
 * Tolerant JSON Extraction and Repair Utility
 * Extracts and safely repairs JSON structures returned by LLMs (handling code fences,
 * trailing commas, unescaped characters, leading/trailing prose).
 */

export function extractJsonFromText<T = any>(rawText: string): T | null {
  if (!rawText || typeof rawText !== 'string') return null;

  let text = rawText.trim();

  // 1. If text is wrapped in markdown code fence ```json ... ``` or ``` ... ```
  const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    text = codeBlockMatch[1].trim();
  }

  // 2. Direct JSON parse attempt
  try {
    return JSON.parse(text) as T;
  } catch {
    // Continue with repair heuristics
  }

  // 3. Find the outermost balanced { ... } or [ ... ]
  const firstBrace = text.indexOf('{');
  const firstBracket = text.indexOf('[');

  let startIdx = -1;
  let isObject = true;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    startIdx = firstBrace;
    isObject = true;
  } else if (firstBracket !== -1) {
    startIdx = firstBracket;
    isObject = false;
  }

  if (startIdx !== -1) {
    const endChar = isObject ? '}' : ']';
    const lastIdx = text.lastIndexOf(endChar);

    if (lastIdx > startIdx) {
      let candidate = text.slice(startIdx, lastIdx + 1);

      // Attempt parsing candidate
      try {
        return JSON.parse(candidate) as T;
      } catch {
        // Apply syntax repairs
        candidate = repairJsonString(candidate);
        try {
          return JSON.parse(candidate) as T;
        } catch {
          // Fall through
        }
      }
    }
  }

  return null;
}

/**
 * Repairs common LLM JSON syntax issues:
 * - Trailing commas before } or ]
 * - Missing quotes around property keys
 * - Double commas
 */
function repairJsonString(str: string): string {
  let cleaned = str
    // Remove trailing commas before } or ]
    .replace(/,\s*([}\]])/g, '$1')
    // Remove duplicate commas
    .replace(/,\s*,/g, ',')
    // Fix unquoted property names like { name: "foo" }
    .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
    // Replace smart quotes
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  return cleaned;
}
