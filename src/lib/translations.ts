import { LanguageCode } from '../types/site';

export interface TranslationDictionary {
  appName: string;
  tabs: {
    build: string;
    code: string;
    console: string;
    files: string;
    secrets: string;
    settings: string;
  };
  actions: {
    saveToGitHub: string;
    deploy: string;
    share: string;
    exportZip: string;
    exportHtml: string;
    exportJson: string;
    preview: string;
    regenerate: string;
    undo: string;
    redo: string;
    newProject: string;
    templates: string;
    addPage: string;
    addSection: string;
    testKey: string;
    addSecret: string;
    applyCode: string;
    sendToAi: string;
    makeUnlimited: string;
  };
  devices: {
    desktop: string;
    tablet: string;
    mobile: string;
  };
  promptPanel: {
    placeholder: string;
    buildButton: string;
    buildingButton: string;
    suggestedPrompts: string;
    modelSelect: string;
    systemInstructions: string;
    autoRouterNote: string;
    loopWarning: string;
  };
  livePreview: {
    onlineBadge: string;
    clickToEdit: string;
    emptySite: string;
    demoBanner: string;
    honestTestNotice: string;
  };
  secrets: {
    title: string;
    subtitle: string;
    addSecretModalTitle: string;
    secretName: string;
    secretValue: string;
    category: string;
    scope: string;
    status: string;
    usedBy: string;
    lastUsed: string;
    actions: string;
    bulkAdd: string;
    exportExample: string;
  };
  settings: {
    title: string;
    general: string;
    providersAndModels: string;
    routingTable: string;
    usageLimits: string;
    siteEnvVars: string;
    appNameSetting: string;
    appModeSetting: string;
    personalModeDesc: string;
    publicModeDesc: string;
  };
}

export const translations: Record<LanguageCode, TranslationDictionary> = {
  en: {
    appName: 'SiteHub',
    tabs: {
      build: 'Visual Canvas',
      code: 'Code Studio',
      console: 'Console & Logs',
      files: 'Assets',
      secrets: 'Secrets Manager',
      settings: 'Settings',
    },
    actions: {
      saveToGitHub: 'Save to GitHub',
      deploy: 'Deploy & Publish',
      share: 'Share Link',
      exportZip: 'Export ZIP Bundle',
      exportHtml: 'Export HTML',
      exportJson: 'Export Site AST',
      preview: 'Live Preview',
      regenerate: 'Refine with AI',
      undo: 'Undo',
      redo: 'Redo',
      newProject: 'New Site',
      templates: 'Starter Templates',
      addPage: 'Add Page',
      addSection: 'Add Section',
      testKey: 'Test Key',
      addSecret: 'Add Secret',
      applyCode: 'Apply Code to Canvas',
      sendToAi: 'Ask AI to Fix / Edit',
      makeUnlimited: 'Make Everything Unlimited',
    },
    devices: {
      desktop: 'Desktop (100%)',
      tablet: 'Tablet (768px)',
      mobile: 'Mobile (375px)',
    },
    promptPanel: {
      placeholder: 'Describe the website you want to build or update (e.g. "Build a luxury watch boutique with gallery, cart, and inquiry form in Hindi and English")...',
      buildButton: 'Build Site',
      buildingButton: 'Architecting & Coding...',
      suggestedPrompts: 'Suggested Starters',
      modelSelect: 'AI Engine',
      systemInstructions: 'Project System Instructions',
      autoRouterNote: 'Smart Router selects DeepSeek V4.1 Flash, GLM 5.1, or Nemotron automatically based on the job.',
      loopWarning: 'Safety Net: Repetitive loop detected. AI paused to protect quality.',
    },
    livePreview: {
      onlineBadge: 'Interactive Live Preview',
      clickToEdit: 'Click any section to inspect or edit props directly',
      emptySite: 'Your blank canvas awaits. Enter a prompt on the left to generate your complete website.',
      demoBanner: 'Running with Mock AI Provider (Zero API usage). Add KiraAI or Nemotron keys in Secrets to switch to live models.',
      honestTestNotice: 'Test Mode: No real financial transactions are executed. Forms and orders are recorded locally.',
    },
    secrets: {
      title: 'Secrets & API Keys',
      subtitle: 'Encrypted with AES-256-GCM. Stored on backend and never exposed to the browser or public repos.',
      addSecretModalTitle: 'Add New Encrypted Secret',
      secretName: 'Secret Name (UPPER_SNAKE_CASE)',
      secretValue: 'Secret Value',
      category: 'Category',
      scope: 'Scope',
      status: 'Status',
      usedBy: 'Used By',
      lastUsed: 'Last Used',
      actions: 'Actions',
      bulkAdd: 'Bulk Add (.env)',
      exportExample: 'Export (.env.example)',
    },
    settings: {
      title: 'Platform Settings',
      general: 'General',
      providersAndModels: 'AI Providers & Models',
      routingTable: 'Role Routing Table',
      usageLimits: 'Usage & Quotas',
      siteEnvVars: 'Site Runtime Env Vars',
      appNameSetting: 'Application Brand Name',
      appModeSetting: 'Application Mode',
      personalModeDesc: 'Personal Mode: Unlimited generations, pages, builds, and GitHub syncs. Quotas and paywalls disabled.',
      publicModeDesc: 'Public Mode: Enforces configurable tier limits and rate limit protections.',
    },
  },

  hi: {
    appName: 'SiteHub',
    tabs: {
      build: 'विजुअल कैनवास',
      code: 'कोड स्टूडियो',
      console: 'कंसोल व लॉग्स',
      files: 'असेट्स',
      secrets: 'सीक्रेट्स मैनेजर',
      settings: 'सेटिंग्स',
    },
    actions: {
      saveToGitHub: 'गिटहब पर सहेजें',
      deploy: 'डिप्लॉय व प्रकाशित करें',
      share: 'लिंक साझा करें',
      exportZip: 'ज़िप बंडल डाउनलोड',
      exportHtml: 'HTML डाउनलोड',
      exportJson: 'साइट AST डाउनलोड',
      preview: 'लाइव प्रीव्यू',
      regenerate: 'AI से सुधारें',
      undo: 'पूर्ववत (Undo)',
      redo: 'फिर से करें (Redo)',
      newProject: 'नई वेबसाइट',
      templates: 'स्टार्टर टेम्पलेट्स',
      addPage: 'नया पेज जोड़ें',
      addSection: 'नया सेक्शन जोड़ें',
      testKey: 'कुंजी जांचें',
      addSecret: 'नया सीक्रेट जोड़ें',
      applyCode: 'कैनवास में कोड लागू करें',
      sendToAi: 'AI से ठीक करवाएं',
      makeUnlimited: 'सब कुछ असीमित करें',
    },
    devices: {
      desktop: 'डेस्कटॉप (100%)',
      tablet: 'टैबलेट (768px)',
      mobile: 'मोबाइल (375px)',
    },
    promptPanel: {
      placeholder: 'वेबसाइट का विवरण लिखें (उदा: "ऑनलाइन मेन्यू और टेबल बुकिंग के साथ आधुनिक रेस्तरां वेबसाइट बनाएं")...',
      buildButton: 'वेबसाइट बनाएं',
      buildingButton: 'AI निर्माण कर रहा है...',
      suggestedPrompts: 'सुझाए गए विचार',
      modelSelect: 'AI इंजन',
      systemInstructions: 'प्रोजेक्ट सिस्टम निर्देश',
      autoRouterNote: 'स्मार्ट राउटर कार्य के अनुसार DeepSeek V4.1 Flash, GLM 5.1 या Nemotron का चयन करता है।',
      loopWarning: 'सुरक्षा चेतावनी: लूप का पता चला। गुणवत्ता बनाए रखने हेतु AI को रोका गया।',
    },
    livePreview: {
      onlineBadge: 'इंटरैक्टिव लाइव प्रीव्यू',
      clickToEdit: 'किसी भी सेक्शन पर क्लिक करके सीधे संपादित करें',
      emptySite: 'आपकी वेबसाइट तैयार होने के लिए बाएं पैनल में विवरण दर्ज करें।',
      demoBanner: 'मॉक AI मोड सक्रिय (कोई API शुल्क नहीं)। लाइव मॉडल के लिए सीक्रेट्स में कुंजी दर्ज करें।',
      honestTestNotice: 'परीक्षण मोड: कोई वास्तविक वित्तीय लेनदेन नहीं होता। सभी ऑर्डर केवल स्थानीय रूप से रिकॉर्ड होते हैं।',
    },
    secrets: {
      title: 'सीक्रेट्स और API कुंजियाँ',
      subtitle: 'AES-256-GCM द्वारा सुरक्षित एन्क्रिप्टेड। बैकएंड पर सुरक्षित, कभी सार्वजनिक नहीं होता।',
      addSecretModalTitle: 'नया एन्क्रिप्टेड सीक्रेट जोड़ें',
      secretName: 'सीक्रेट नाम (UPPER_SNAKE_CASE)',
      secretValue: 'सीक्रेट मान',
      category: 'श्रेणी',
      scope: 'स्कोप',
      status: 'स्थिति',
      usedBy: 'उपयोगकर्ता',
      lastUsed: 'अंतिम उपयोग',
      actions: 'कार्रवाई',
      bulkAdd: 'थोक में जोड़ें (.env)',
      exportExample: 'नमूना निर्यात (.env.example)',
    },
    settings: {
      title: 'प्लेटफ़ॉर्म सेटिंग्स',
      general: 'सामान्य',
      providersAndModels: 'AI प्रदाता और मॉडल',
      routingTable: 'रोल रूटिंग टेबल',
      usageLimits: 'उपयोग और सीमाएं',
      siteEnvVars: 'साइट रनटाइम वेरिएबल्स',
      appNameSetting: 'एप्लिकेशन ब्रांड नाम',
      appModeSetting: 'एप्लिकेशन मोड',
      personalModeDesc: 'व्यक्तिगत मोड: असीमित वेबसाइट्स, AI जेनरेशन, कोड और गिटहब सिंक। कोई सीमा नहीं।',
      publicModeDesc: 'सार्वजनिक मोड: उपयोगकर्ताओं के लिए निर्धारित कोटा और सुरक्षा सीमाएं।',
    },
  },

  pa: {
    appName: 'SiteHub',
    tabs: {
      build: 'ਵਿਜ਼ੂਅਲ ਕੈਨਵਸ',
      code: 'ਕੋਡ ਸਟੂਡੀਓ',
      console: 'ਕੰਸੋਲ ਅਤੇ ਲੌਗਸ',
      files: 'ਅਸੈੱਟਸ',
      secrets: 'ਸੀਕ੍ਰੇਟਸ ਮੈਨੇਜਰ',
      settings: 'ਸੈਟਿੰਗਜ਼',
    },
    actions: {
      saveToGitHub: 'GitHub ਤੇ ਸੇਵ ਕਰੋ',
      deploy: 'ਡਿਪਲਾਏ ਅਤੇ ਲਾਈਵ ਕਰੋ',
      share: 'ਲਿੰਕ ਸਾਂਝਾ ਕਰੋ',
      exportZip: 'ZIP ਬੰਡਲ ਡਾਊਨਲੋਡ',
      exportHtml: 'HTML ਡਾਊਨਲੋਡ',
      exportJson: 'ਸਾਈਟ AST ਡਾਊਨਲੋਡ',
      preview: 'ਲਾਈਵ ਪ੍ਰੀਵਿਊ',
      regenerate: 'AI ਨਾਲ ਬਦਲਾਓ ਕਰੋ',
      undo: 'ਵਾਪਿਸ (Undo)',
      redo: 'ਦੁਬਾਰਾ (Redo)',
      newProject: 'ਨਵੀਂ ਵੈੱਬਸਾਈਟ',
      templates: 'ਸਟਾਰਟਰ ਟੈਮਪਲੇਟਸ',
      addPage: 'ਨਵਾਂ ਪੇਜ ਜੋੜੋ',
      addSection: 'ਨਵਾਂ ਸੈਕਸ਼ਨ ਜੋੜੋ',
      testKey: 'ਕੁੰਜੀ ਟੈਸਟ ਕਰੋ',
      addSecret: 'ਨਵਾਂ ਸੀਕ੍ਰੇਟ ਸ਼ਾਮਲ ਕਰੋ',
      applyCode: 'ਕੈਨਵਸ ਤੇ ਕੋਡ ਲਾਗੂ ਕਰੋ',
      sendToAi: 'AI ਰਾਹੀਂ ਠੀਕ ਕਰਵਾਓ',
      makeUnlimited: 'ਸਭ ਕੁਝ ਅਸੀਮਤ ਕਰੋ',
    },
    devices: {
      desktop: 'ਡੈਸਕਟੌਪ (100%)',
      tablet: 'ਟੈਬਲੇਟ (768px)',
      mobile: 'ਮੋਬਾਈਲ (375px)',
    },
    promptPanel: {
      placeholder: 'ਵੈੱਬਸਾਈਟ ਦਾ ਵੇਰਵਾ ਲਿਖੋ (ਉਦਾਹਰਣ: "ਆਨਲਾਈਨ ਮੇਨੂ ਅਤੇ ਟੇਬਲ ਬੁਕਿੰਗ ਵਾਲੀ ਰੈਸਟੋਰੈਂਟ ਵੈੱਬਸਾਈਟ ਬਣਾਓ ਪੰਜਾਬੀ ਅਤੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ")...',
      buildButton: 'ਵੈੱਬਸਾਈਟ ਬਣਾਓ',
      buildingButton: 'AI ਤਿਆਰ ਕਰ ਰਿਹਾ ਹੈ...',
      suggestedPrompts: 'ਸੁਝਾਏ ਗਏ ਵਿਸ਼ੇ',
      modelSelect: 'AI ਇੰਜਨ',
      systemInstructions: 'ਪ੍ਰੋਜੈਕਟ ਸਿਸਟਮ ਹਦਾਇਤਾਂ',
      autoRouterNote: 'ਸਮਾਰਟ ਰਾਊਟਰ ਆਪਣੇ-ਆਪ DeepSeek V4.1 Flash, GLM 5.1 ਜਾਂ Nemotron ਚੁਣਦਾ ਹੈ।',
      loopWarning: 'ਸੁਰੱਖਿਆ ਚੇਤਾਵਨੀ: ਲੂਪ ਫੜਿਆ ਗਿਆ। ਵਧੀਆ ਕੁਆਲਿਟੀ ਲਈ AI ਰੋਕਿਆ ਗਿਆ।',
    },
    livePreview: {
      onlineBadge: 'ਇੰਟਰਐਕਟਿਵ ਲਾਈਵ ਪ੍ਰੀਵਿਊ',
      clickToEdit: 'ਸਿੱਧਾ ਐਡਿਟ ਕਰਨ ਲਈ ਕਿਸੇ ਵੀ ਸੈਕਸ਼ਨ ਤੇ ਕਲਿੱਕ ਕਰੋ',
      emptySite: 'ਤੁਹਾਡੀ ਵੈੱਬਸਾਈਟ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਖੱਬੇ ਪਾਸੇ ਵੇਰਵਾ ਲਿਖੋ।',
      demoBanner: 'ਮੌਕ AI ਮੋਡ ਚੱਲ ਰਿਹਾ ਹੈ (ਕੋਈ API ਖਰਚਾ ਨਹੀਂ)। ਲਾਈਵ ਮਾਡਲ ਲਈ ਸੀਕ੍ਰੇਟਸ ਵਿੱਚ ਕੁੰਜੀ ਭਰੋ।',
      honestTestNotice: 'ਟੈਸਟ ਮੋਡ: ਕੋਈ ਅਸਲ ਪੈਸੇ ਦਾ ਲੈਣ-ਦੇਣ ਨਹੀਂ ਹੁੰਦਾ। ਆਰਡਰ ਸਿਰਫ ਲੋਕਲ ਰਿਕਾਰਡ ਹੁੰਦੇ ਹਨ।',
    },
    secrets: {
      title: 'ਸੀਕ੍ਰੇਟਸ ਅਤੇ API ਕੁੰਜੀਆਂ',
      subtitle: 'AES-256-GCM ਰਾਹੀਂ ਸੁਰੱਖਿਅਤ ਇਨਕ੍ਰਿਪਟਡ। ਬੈਕਐਂਡ ਤੇ ਸੁਰੱਖਿਅਤ, ਕਦੇ ਜਨਤਕ ਨਹੀਂ ਹੁੰਦਾ।',
      addSecretModalTitle: 'ਨਵਾਂ ਇਨਕ੍ਰਿਪਟਡ ਸੀਕ੍ਰੇਟ ਸ਼ਾਮਲ ਕਰੋ',
      secretName: 'ਸੀਕ੍ਰੇਟ ਨਾਮ (UPPER_SNAKE_CASE)',
      secretValue: 'ਸੀਕ੍ਰੇਟ ਮੁੱਲ',
      category: 'ਸ਼੍ਰੇਣੀ',
      scope: 'ਸਕੋਪ',
      status: 'ਸਥਿਤੀ',
      usedBy: 'ਵਰਤੋਂਕਾਰ',
      lastUsed: 'ਆਖਰੀ ਵਰਤੋਂ',
      actions: 'ਕਾਰਵਾਈ',
      bulkAdd: 'ਇਕੱਠੇ ਸ਼ਾਮਲ ਕਰੋ (.env)',
      exportExample: 'ਨਮੂਨਾ ਨਿਰਯਾਤ (.env.example)',
    },
    settings: {
      title: 'ਪਲੇਟਫਾਰਮ ਸੈਟਿੰਗਜ਼',
      general: 'ਆਮ',
      providersAndModels: 'AI ਪ੍ਰੋਵਾਈਡਰ ਅਤੇ ਮਾਡਲ',
      routingTable: 'ਰੋਲ ਰੂਟਿੰਗ ਟੇਬਲ',
      usageLimits: 'ਵਰਤੋਂ ਅਤੇ ਸੀਮਾਵਾਂ',
      siteEnvVars: 'ਸਾਈਟ ਰਨਟਾਈਮ ਵੇਰੀਏਬਲਸ',
      appNameSetting: 'ਐਪਲੀਕੇਸ਼ਨ ਬ੍ਰਾਂਡ ਨਾਮ',
      appModeSetting: 'ਐਪਲੀਕੇਸ਼ਨ ਮੋਡ',
      personalModeDesc: 'ਨਿੱਜੀ ਮੋਡ: ਬਿਨਾਂ ਕਿਸੇ ਸੀਮਾ ਦੇ ਅਣਗਿਣਤ ਵੈੱਬਸਾਈਟਸ, AI ਜਨਰੇਸ਼ਨ, ਕੋਡਿੰਗ ਅਤੇ GitHub ਸਿੰਕ।',
      publicModeDesc: 'ਜਨਤਕ ਮੋਡ: ਵਰਤੋਂਕਾਰਾਂ ਲਈ ਨਿਰਧਾਰਿਤ ਕੋਟਾ ਅਤੇ ਸੁਰੱਖਿਆ ਨਿਯਮ।',
    },
  },
};
