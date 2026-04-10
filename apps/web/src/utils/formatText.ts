export function formatExtractedText(raw: string): string {
    if (!raw) return "";

    let text = raw;

    // normalize Unicode whitespace to regular space (except newlines)
    text = text.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ");

    // remove zero-width characters
    text = text.replace(/[\u200C\u200D\u200E\u200F]/g, "");

    // split into vision API paragraphs
    const rawParagraphs = text
        .split(/\n\n+/)
        .map((p) => p.replace(/\s+/g, " ").trim())
        .filter((p) => p.length > 0);

    if (rawParagraphs.length === 0) return "";

    const SENTENCE_ENDERS = /[.।॥!?]$/;
    const merged: string[] = [];
    let buffer = "";

    for (const para of rawParagraphs) {
        if (buffer) {
            buffer += " " + para;
        } else {
            buffer = para;
        }

        if (SENTENCE_ENDERS.test(para.trim())) {
            merged.push(buffer);
            buffer = "";
        }
    }

    if (buffer) {
        merged.push(buffer);
    }

    return merged.join("\n\n").trim();
}

export function cleanForExport(text: string): string {
    if (!text) return "";

    return text
        .replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ")
        .replace(/[\u200C\u200D\u200E\u200F]/g, "")
        .replace(/ {2,}/g, " ")
        .trim();
}
