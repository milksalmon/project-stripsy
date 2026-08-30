export async function generateSessionContent(ai, themePrompt, panelCount) {
const themeInstruction = themePrompt?.trim()
    ? `Theme: "${themePrompt.trim()}"`
    : 'Suggest an original, family-friendly comic strip theme.';
    
console.log('Calling Gemini...');
console.log(themePrompt)
const interaction = await ai.interactions.create({
    model: 'gemini-3.6-flash',
    input: `You are generating content for a ${panelCount}-panel collaborative comic strip drawn by different people who cannot see each other's panels until reveal. 
    ${themeInstruction} Return a short comic title, and exactly ${panelCount} panel titles 
    (each roughly 10 words, one distinct narrative moment per panel, in sequential story order relevant to each other). 
    Use a comma for each subsequent panel titles except the last panel.
    Do not use LaTeX-style notation or symbols that would render as raw text.`,
    response_format: {
    type: 'text',
    mime_type: 'application/json',
    schema: {
        type: 'object',
        properties: {
        comicTitle: { type: 'string' },
        panelTitles: {
            type: 'array',
            items: { type: 'string' },
            minItems: panelCount,
            maxItems: panelCount,
        },
        },
        required: ['comicTitle', 'panelTitles'],
    },
    },
});
    console.log('Gemini responded');

    return JSON.parse(interaction.output_text);
}