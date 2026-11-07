const fs = require('fs');
const path = require('path');

const LANGUAGES = [
    'ab', 'ace', 'ach', 'af', 'sq', 'alz', 'am', 'ar', 'hy', 'as', 
    'awa', 'ay', 'az', 'ban', 'bm', 'ba', 'eu', 'btx', 'bts', 'bbc', 
    'be', 'bem', 'bn', 'bew', 'bho', 'bik', 'bs', 'br', 'bg', 'bua', 
    'yue', 'ca', 'ceb', 'ny', 'zh-CN', 'zh-TW', 'cv', 'co', 'crh', 'hr', 
    'cs', 'da', 'din', 'doi', 'nl', 'dz', 'eo', 'et', 'ee', 
    'fo', 'fj', 'tl', 'fi', 'fr', 'fy', 'ff', 'ga', 'gl', 'ka', 
    'de', 'el', 'gn', 'gu', 'ht', 'ha', 'haw', 'he', 'hi', 'hmn', 
    'hu', 'is', 'ig', 'ilo', 'id', 'it', 'ja', 'jw', 'kn', 'kk', 
    'km', 'rw', 'gom', 'ko', 'kri', 'ku', 'ckb', 'ky', 'lo', 'la', 
    'lv', 'ln', 'lt', 'lg', 'lb', 'mk', 'mad', 'mai', 'mak', 'mg', 
    'ms', 'ml', 'mt', 'gv', 'mi', 'mr', 'mni-Mtei', 'min', 'lus', 'mn', 
    'my', 'nr', 'ne', 'nso', 'no', 'nus', 'nyan', 'or', 'om', 'os', 
    'pag', 'pap', 'ps', 'fa', 'pl', 'pt', 'pa', 'qu', 'ro', 'rom', 
    'rn', 'ru', 'sm', 'sg', 'sa', 'sat', 'gd', 'sr', 'st', 'sn', 
    'scn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'ss', 
    'sv', 'tg', 'ta', 'tt', 'te', 'th', 'bo', 'ti', 'tpi', 'ts', 
    'tn', 'tr', 'tk', 'ak', 'uk', 'ur', 'ug', 'uz', 'vec', 'vi', 
    'war', 'cy', 'xh', 'yi', 'yo', 'yua', 'zap', 'zu'
];

const SEPARATOR = " ||| "; 

function extractSourceTexts(htmlContent) {
    const sourceMap = {};
    const regex = /data-i18n="([^"]+)"[^>]*>([^<]+)</g;
    let match;
    while ((match = regex.exec(htmlContent)) !== null) {
        sourceMap[match] = match.trim();
    }
    return sourceMap;
}

async function fetchGoogleTranslateBulk(textPayload, targetLang) {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(textPayload)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    const data = await response.json();
    if (data && data) {
        return data.map(subBlock => subBlock).join('');
    }
    throw new Error("Invalid response");
}

async function compileTranslations() {
    const htmlPath = path.join(__dirname, '../index.html');
    const originalHtml = fs.readFileSync(htmlPath, 'utf8');

    const sourceTexts = extractSourceTexts(originalHtml);
    const keys = Object.keys(sourceTexts);
    const bulkPayload = keys.map(k => sourceTexts[k]).join(SEPARATOR);

    const masterDictionary = {};

    const compilationTasks = LANGUAGES.map(async (lang) => {
        try {
            const bulkResponse = await fetchGoogleTranslateBulk(bulkPayload, lang);
            const translatedTexts = bulkResponse.split(SEPARATOR).map(t => t.trim());
            
            masterDictionary[lang] = {};
            keys.forEach((key, index) => {
                masterDictionary[lang][key] = translatedTexts[index] || sourceTexts[key];
            });
        } catch (error) {
            console.error(lang, error.message);
        }
    });

    await Promise.all(compilationTasks);
    
    fs.writeFileSync(path.join(__dirname, '../locales.json'), JSON.stringify(masterDictionary));
}

compileTranslations();
