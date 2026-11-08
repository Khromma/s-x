const languageNames = {
  "en": "English", "ab": "Abkhaz", "ace": "Acehnese", "ach": "Acholi", "af": "Afrikaans", "sq": "Albanian", 
  "alz": "Alur", "am": "Amharic", "ar": "Arabic", "hy": "Armenian", "as": "Assamese", 
  "awa": "Awadhi", "ay": "Aymara", "az": "Azerbaijani", "ban": "Balinese", "bm": "Bambara", 
  "ba": "Bashkir", "eu": "Basque", "btx": "Batak Karo", "bts": "Batak Simalungun", "bbc": "Batak Toba", 
  "be": "Belarusian", "bem": "Bemba", "bn": "Bengali", "bew": "Betawi", "bho": "Bhojpuri", 
  "bik": "Bikol", "bs": "Bosnian", "br": "Breton", "bg": "Bulgarian", "bua": "Buryat", 
  "yue": "Cantonese", "ca": "Catalan", "ceb": "Cebuano", "ny": "Chichewa", "zh-CN": "Chinese (Simplified)", 
  "zh-TW": "Chinese (Traditional)", "cv": "Chuvash", "co": "Corsican", "crh": "Crimean Tatar", "hr": "Croatian", 
  "cs": "Czech", "da": "Danish", "din": "Dinka", "doi": "Dogri", "nl": "Dutch", 
  "dz": "Dzongkha", "eo": "Esperanto", "et": "Estonian", "ee": "Ewe", 
  "fo": "Faroese", "fj": "Fijian", "tl": "Filipino (Tagalog)", "fi": "Finnish", "fr": "French", 
  "fy": "Frisian", "ff": "Fula", "ga": "Irish", "gl": "Galician", "ka": "Georgian", 
  "de": "German", "el": "Greek", "gn": "Guarani", "gu": "Gujarati", "ht": "Haitian Creole", 
  "ha": "Hausa", "haw": "Hawaiian", "he": "Hebrew", "hi": "Hindi", "hmn": "Hmong", 
  "hu": "Hungarian", "is": "Icelandic", "ig": "Igbo", "ilo": "Ilocano", "id": "Indonesian", 
  "it": "Italian", "ja": "Japanese", "jw": "Javanese", "kn": "Kannada", "kk": "Kazakh", 
  "km": "Khmer", "rw": "Kinyarwanda", "gom": "Konkani", "ko": "Korean", "kri": "Krio", 
  "ku": "Kurdish (Kurmanji)", "ckb": "Kurdish (Sorani)", "ky": "Kyrgyz", "lo": "Lao", "la": "Latin", 
  "lv": "Latvian", "ln": "Lingala", "lt": "Lithuanian", "lg": "Luganda", "lb": "Luxembourgish", 
  "mk": "Macedonian", "mad": "Madurese", "mai": "Maithili", "mak": "Makassar", "mg": "Malagasy", 
  "ms": "Malay", "ml": "Malayalam", "mt": "Maltese", "gv": "Manx", "mi": "Maori", 
  "mr": "Marathi", "mni-Mtei": "Meiteilon (Manipuri)", "min": "Minangkabau", "lus": "Mizo", "mn": "Mongolian", 
  "my": "Myanmar (Burmese)", "nr": "Ndebele (South)", "ne": "Nepali", "nso": "Northern Sotho", "no": "Norwegian", 
  "nus": "Nuer", "nyan": "Nyanja", "or": "Odia (Oriya)", "om": "Oromo", "os": "Ossetian", 
  "pag": "Pangasinan", "pap": "Papiamento", "ps": "Pashto", "fa": "Persian", "pl": "Polish", 
  "pt": "Portuguese", "pa": "Punjabi", "qu": "Quechua", "ro": "Romanian", "rom": "Romani", 
  "rn": "Rundi", "ru": "Russian", "sm": "Samoan", "sg": "Sango", "sa": "Sanskrit", 
  "sat": "Santali", "gd": "Scottish Gaelic", "sr": "Serbian", "st": "Sesotho", "sn": "Shona", 
  "scn": "Sicilian", "sd": "Sindhi", "si": "Sinhala", "sk": "Slovak", "sl": "Slovenian", 
  "so": "Somali", "es": "Spanish", "su": "Sundanese", "sw": "Swahili", "ss": "Swati", 
  "sv": "Swedish", "tg": "Tajik", "ta": "Tamil", "tt": "Tatar", "te": "Telugu", 
  "th": "Thai", "bo": "Tibetan", "ti": "Tigrinya", "tpi": "Tok Pisin", "ts": "Tsonga", 
  "tn": "Tswana", "tr": "Turkish", "tk": "Turkmen", "ak": "Twi (Akan)", "uk": "Ukrainian", 
  "ur": "Urdu", "ug": "Uyghur", "uz": "Uzbek", "vec": "Venetian", "vi": "Vietnamese", 
  "war": "Waray", "cy": "Welsh", "xh": "Xhosa", "yi": "Yiddish", "yo": "Yoruba", 
  "yua": "Yucatec Maya", "zap": "Zapotec", "zu": "Zulu"
};

const languageTranslations = {};

function initializeTranslationEngine() {
  Object.keys(languageNames).forEach(lang => {
    languageTranslations[lang] = [];
    
    languageTranslations[lang].push(
      { "data-i18n": "s_translatex_input_translation_textarea", "translatedtext": "Text..." },
      { "data-i18n": "s_translatex_output_translation_textarea", "translatedtext": "Translation..." },
      { "data-i18n": "s_translatex_google_contribution_text", "translatedtext": "Supported by" },
      { "data-i18n": "s_translatex_by_creator_paragraph", "translatedtext": "By" },
      { "data-i18n": "s_translatex_auto_source_lang_option", "translatedtext": "Detect language" }
    );

    Object.entries(languageNames).forEach(([code, englishName]) => {
      languageTranslations[lang].push({
        "data-i18n": `s_translatex_${code}_source_lang_option`,
        "translatedtext": englishName
      });
    });

    Object.entries(languageNames).forEach(([code, englishName]) => {
      if (code === "auto") return;

      languageTranslations[lang].push({
        "data-i18n": `s_translatex_${code}_target_lang_option`,
        "translatedtext": englishName
      });
    });
  });
}

initializeTranslationEngine();

async function translatePageBatch(targetLanguage) {
  const elements = document.querySelectorAll('[data-i18n]');
  if (elements.length === 0) return;

  const translationBatch = [];
  let urlParams = new URLSearchParams({
    client: 'gtx',
    sl: 'en',
    tl: targetLanguage,
    dt: 't'
  });

  elements.forEach((element, index) => {
    const key = element.getAttribute('data-i18n');
    let originalText = "";

    if (element.tagName === 'TEXTAREA' || element.tagName === 'INPUT') {
      originalText = element.placeholder || element.value;
    } else {
      originalText = element.textContent;
    }

    translationBatch.push({
      id: index,
      key: key,
      element: element,
      fallbackText: originalText
    });

    urlParams.append('q', originalText);
  });

  try {
    const response = await fetch(`https://translate.googleapis.com/translate_a/single?${urlParams.toString()}`);
    if (!response.ok) throw new Error('API Request Failed');
    
    const data = await response.json();
    
    if (data && data[0]) {
      translationBatch.forEach((item, index) => {
        const element = item.element;
        const tagType = element.tagName;
        let translatedText = item.fallbackText;

        if (data[0][index] && data[0][index][0]) {
          translatedText = data[0][index][0];
        }

        if (tagType === 'TEXTAREA' || tagType === 'INPUT') {
          element.placeholder = translatedText;
        } else {
          element.textContent = translatedText;
        }
      });
    }
  } catch (error) {
    console.error(error);
  }
}

function applyLanguage(selectedLanguage) {
  if (!selectedLanguage) return;
  
  let cleanCode = selectedLanguage;
  let translations = languageTranslations[cleanCode];
  
  if (!translations && selectedLanguage.includes('-')) {
    cleanCode = selectedLanguage.split('-')[0];
    translations = languageTranslations[cleanCode];
  }
  
  if (!translations && selectedLanguage.length > 2) {
    cleanCode = selectedLanguage.substring(0, 2);
    translations = languageTranslations[cleanCode];
  }
  
  if (!translations) {
    cleanCode = 'en';
    translations = languageTranslations['en']; 
  }

  if (!translations) return;

  translations.forEach(item => {
    const elements = document.querySelectorAll(`[data-i18n="${item['data-i18n']}"]`);
    
    elements.forEach(element => {
      const tagType = element.tagName;

      if (tagType === 'TEXTAREA' || tagType === 'INPUT') {
        element.placeholder = item.translatedtext;
      } else {
        element.textContent = item.translatedtext;
      }
    });
  });

  if (cleanCode !== 'en') {
    translatePageBatch(cleanCode);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const browserLanguage = navigator.language || navigator.userLanguage || 'en';
  applyLanguage(browserLanguage);
});

setInterval(() => {
  const browserLanguage = navigator.language || navigator.userLanguage || 'en';
  applyLanguage(browserLanguage);
}, 10);
