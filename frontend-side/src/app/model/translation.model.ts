export interface TranslationModel {
    detectedLanguage: {
        confidence: number
        language: string
    };
    translatedText: string
}