export function formatExtractedText(raw: string): string {
    if (!raw) return "";

    let text = raw;

    // normalize unicode whitespace to regular space (except newlines)
    text = text.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, " ");

    // remove zero-width characters
    text = text.replace(/[\u200C\u200D\u200E\u200F]/g, "");

    // process line by line
    const lines = text.split("\n");
    const cleaned = lines.map((line) => {
        // Trim each line
        let l = line.trim();
        // Collapse multiple spaces to single
        l = l.replace(/ {2,}/g, " ");
        return l;
    });

    // rejoin and collapse 3+ consecutive newlines into 2
    let result = cleaned.join("\n");
    result = result.replace(/\n{3,}/g, "\n\n");

    // trim the final result
    result = result.trim();

    return result;
}
