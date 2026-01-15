import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, Zap, Loader2, ChevronDown, ChevronLeft, 
  Menu, X, CheckSquare, Square, FileText, Layers, AlignRight,
  Volume2, Copy, Check, RefreshCw, Hexagon, Printer, Download, Grid,
  Maximize2, Minimize2, Wind, Flame, Droplets, Mountain, Activity,
  Bookmark, ShieldCheck, Star, Brain, Eye, Heart, Feather, Globe, Command,
  Github, Layout, Sun, Moon, Calendar, Hash, Filter, LayoutGrid, Search
} from 'lucide-react';

// --- CONFIGURATION ---
const VERSION = "9.5 UNIFIED MATRIX";

// --- DATA STRUCTURES ---

const METHODS_DATA = [
  {
    level: 1,
    title: "רמה 1 - יסודות (4 מאפיינים)",
    description: "מיפוי המציאות על בסיס תבניות יסוד של 4",
    baseColor: "blue",
    methods: [
      { id: 'l1_pardes', name: 'פרד״ס (פשט, רמז, דרש, סוד)' },
      { id: 'l1_abya', name: 'אביע עולמות (אצילות, בריאה, יצירה, עשייה)' },
      { id: 'l1_elements', name: 'ארבעת היסודות (רוח, אש, מים, אדמה)' },
      { id: 'l1_creatures', name: 'ארבע חיות הקודש (אריה, שור, נשר, אדם)' },
      { id: 'l1_service', name: 'ארבע מדרגות בעבודת ה׳ (יראה, אהבה, תורה, דבקות)' },
      { id: 'l1_providence', name: 'ארבעה אופני השגחה (טבע, נס נסתר, נס גלוי, ישירה)' },
      { id: 'l1_faith', name: 'ארבע דרגות האמונה (התפתחות האמונה)' },
      { id: 'l1_redemption', name: 'ארבע לשונות הגאולה (שלבי היציאה מהגלות)' },
      { id: 'l1_sons', name: 'ארבעת הבנים (סוגי המתמודדים עם האתגר)' },
      { id: 'l1_seasons', name: 'ארבע תקופות השנה (מחזוריות הזמן והתיקון)' },
      { id: 'l1_camps', name: 'ארבע מחנות ישראל (הכיוונים השונים בעבודת ה׳)' },
      { id: 'l1_sins', name: 'ארבעה חטאים מרכזיים ותיקונם (תיקון השורשים השליליים)' }
    ]
  },
  {
    level: 2,
    title: "רמה 2 - צמיחה (7 מאפיינים)",
    description: "תהליכי התפתחות ושינוי במחזורים של 7",
    baseColor: "green",
    methods: [
      { id: 'l2_creation', name: 'מעשה בראשית (תבנית הבריאה המקורית)' },
      { id: 'l2_principles', name: 'שבעה עקרונות לתודעה גבוהה (כלים בסיסיים)' },
      { id: 'l2_prayer', name: 'שבעה שלבים בתפילה (החיבור היומיומי עם הבורא)' },
      { id: 'l2_growth', name: 'שבעה שלבים של צמיחה רוחנית (מהתעוררות לאחדות)' },
      { id: 'l2_repentance', name: 'שבעה שלבים של תהליך תשובה (תיקון הפגמים)' },
      { id: 'l2_correction_human', name: 'שבעה מרכיבים של תיקון האדם (מידות ומעשים)' },
      { id: 'l2_redemption_personal', name: 'שבעה שלבים בגאולה האישית (התהליך האישי)' },
      { id: 'l2_tikkun_olam', name: 'שבעה עקרונות של תיקון עולם (הרחבה לכלל)' },
    ]
  },
  {
    level: 3,
    title: "רמה 3 - מערכות (10 מאפיינים)",
    description: "חוקיות מערכתית מורכבת במבנים של 10",
    baseColor: "purple",
    methods: [
      { id: 'l3_sefirot', name: 'עשר הספירות (המערכת הבסיסיות של הבריאה)' },
      { id: 'l3_sayings', name: 'עשרת המאמרות (כלי הבריאה הראשוניים)' },
      { id: 'l3_creation_man', name: 'עשרת השלבים של בריאת האדם הרוחני' },
      { id: 'l3_experiences', name: 'עשרת השלבים של חוויות רוחניות (תהליך ההתעלות)' },
      { id: 'l3_torah_attributes', name: 'עשרת המידות של תורה (כלים להבנה והפנמה)' },
      { id: 'l3_success', name: 'עשרת חוקי ההצלחה (יישום החכמה בעולם המעשה)' },
      { id: 'l3_kelipa', name: 'עשר הספירות של הקליפה (הצד המנוגד)' },
      { id: 'l3_time', name: 'עשרת חוקי הזמן (ניהול רעיונות בזמן)' },
      { id: 'l3_war', name: 'עשרת חוקי המלחמה (מאבקים פנימיים וחיצוניים)' },
      { id: 'l3_nature', name: 'עשרת חוקי העולם הטבעי (תהליכי החיים בטבע)' },
      { id: 'l3_justice', name: 'עשרת חוקי הצדק והמשפט (צדק אוניברסלי)' },
      { id: 'l3_commandments', name: 'עשרת הדיברות (יסודות המוסר והאמונה)' },
      { id: 'l3_repentance_expressions', name: 'עשרת הביטויים של תשובה (חזרה לתיקון עצמי)' },
      { id: 'l3_torah_mishna', name: 'עשרת המידות של תורה לפי המשנה' },
      { id: 'l3_body', name: 'עשר מערכות החיים בגוף האדם (חיבור גוף-נשמה)' },
      { id: 'l3_plagues', name: 'עשר המכות (שבירת האשליות וחינוך למציאות)' },
      { id: 'l3_repentance_rambam', name: 'עשרת הביטויים של תשובה לפי הרמב"ם' },
    ]
  },
  {
    level: 4,
    title: "רמה 4 - ייחוד (13 מאפיינים)",
    description: "רמת העל, חיבור לשורש האינסופי במבנים של 13",
    baseColor: "gold",
    methods: [
      { id: 'l4_learning', name: 'י"ג דרכי הלימוד בתורה (שיטות לימוד מסורתיות)' },
      { id: 'l4_faith_principles', name: 'י"ג יסודות האמונה (עיקרי האמונה של הרמב"ם)' },
      { id: 'l4_mercy', name: 'י"ג מידות הרחמים (דרכי הרחמים האלוקיים)' },
      { id: 'l4_redemption_process', name: 'י"ג שלבים בתהליך גאולה (תהליך עתידי)' },
      { id: 'l4_soul_correction', name: 'י"ג ערוצי התיקון בנפש (ניתוח תיקוני הנשמה)' },
      { id: 'l4_secret_paths', name: 'י"ג שבילים בתורת הסוד (מסלולי חכמה קבליים)' },
      { id: 'l4_kabbalah_gates', name: 'י"ג שערים בחכמת הקבלה (ניתוח עיוני)' },
      { id: 'l4_beard', name: 'י"ג תיקוני דיקנא (תיקונים רוחניים של הנהגה)' },
      { id: 'l4_chariot', name: 'י"ג מדרגות בסולם המרכבה (התעלות רוחנית)' },
      { id: 'l4_soul_powers', name: 'י"ג כוחות הנפש (ניתוח פסיכולוגי ורוחני)' },
    ]
  }
];

// Rich context for the AI prompt to ensure high quality analysis
const METHOD_LIBRARY: Record<string, { coreIdea: string, axes: { label: string, meaning: string }[], sources: string[] }> = {
  // --- LEVEL 1 (4) ---
  'l1_pardes': {
    coreIdea: "שיטת פרד״ס מפרקת טקסט לרבדים: הפשט הגלוי, רמזים סמויים, דרש פרשני וסוד מיסטי.",
    axes: [
      { label: "פשט", meaning: "המשמעות המילולית והברורה של הטקסט." },
      { label: "רמז", meaning: "קשרים נסתרים, גימטריות ומסרים מרומזים." },
      { label: "דרש", meaning: "פרשנות רעיונית, מוסרית והרחבת המשמעות." },
      { label: "סוד", meaning: "המשמעות המיסטית, הקבלית והפנימית ביותר." }
    ],
    sources: ["4/פרד\"ס – ארבע רמות הבנה.md"]
  },
  'l1_abya': {
    coreIdea: "ניתוח המציאות דרך ארבעת העולמות הקבליים.",
    axes: [
      { label: "אצילות", meaning: "עולם האלוהות, הרצון וההאצלה." },
      { label: "בריאה", meaning: "עולם השכל, המחשבה והתכנון." },
      { label: "יצירה", meaning: "עולם הרגש, הצורה והתכנון המפורט." },
      { label: "עשייה", meaning: "עולם המעשה, החומר והביצוע." }
    ],
    sources: []
  },
  'l1_elements': {
    coreIdea: "ארבעת היסודות כבסיס להבנת המזג והמציאות.",
    axes: [
      { label: "אש", meaning: "התלהבות, פריצה, כעס, אנרגיה." },
      { label: "רוח", meaning: "תנועה, דיבור, תקשורת, רוחניות." },
      { label: "מים", meaning: "רגש, תענוג, זרימה, חיבור." },
      { label: "עפר", meaning: "יציבות, כבדות, עצבות, מעשיות." }
    ],
    sources: []
  },
  'l1_creatures': {
    coreIdea: "ניתוח לפי ארבע דמויות המרכבה (פני אריה, שור, נשר, אדם).",
    axes: [
      { label: "אריה", meaning: "חסד, מלכות, הנהגה (צד ימין)." },
      { label: "שור", meaning: "גבורה, עבודה, צמצום (צד שמאל)." },
      { label: "נשר", meaning: "תפארת, רחמים, התעלות (קו אמצע)." },
      { label: "אדם", meaning: "השלימות, הכולל את כולם, כוח המדבר." }
    ],
    sources: []
  },
  'l1_redemption': {
    coreIdea: "ארבעה שלבים בתהליך הגאולה והיציאה ממשבר.",
    axes: [
      { label: "והוצאתי", meaning: "היציאה הפיזית מהסבל (שחרור הסבל)." },
      { label: "והצלתי", meaning: "ההתנתקות מהתלות בגורם המשעבד." },
      { label: "וגאלתי", meaning: "הגילוי העצמי והחיבור לייעוד." },
      { label: "ולקחתי", meaning: "החיבור הגבוה לייעוד ולקדושה." }
    ],
    sources: []
  },
  'l1_sons': {
    coreIdea: "ארבעה טיפוסי אישיות או גישות להתמודדות.",
    axes: [
      { label: "חכם", meaning: "מבקש לדעת את האמת והפרטים." },
      { label: "רשע", meaning: "מאתגר את המערכת ומרגיש מנוכר." },
      { label: "תם", meaning: "פועל בתמימות ויושרה ללא תחכום." },
      { label: "שאינו יודע לשאול", meaning: "זקוק לפתיחות ולעוררות חיצונית." }
    ],
    sources: []
  },

  // --- LEVEL 2 (7) ---
  'l2_creation': {
    coreIdea: "תהליך התפתחות בן 7 שלבים המקביל לבריאת העולם.",
    axes: [
      { label: "יום 1 - אור", meaning: "הופעת הרעיון הראשוני וההבדלה." },
      { label: "יום 2 - רקיע", meaning: "יצירת גבולות ומסגרת." },
      { label: "יום 3 - יבשה", meaning: "התבססות וצמיחה ראשונית." },
      { label: "יום 4 - מאורות", meaning: "קבלת פרופורציה ופרספקטיבה." },
      { label: "יום 5 - חיים", meaning: "תנועה, חיות ורגש." },
      { label: "יום 6 - אדם", meaning: "תכלית, דיבור ופעולה מורכבת." },
      { label: "יום 7 - שבת", meaning: "מנוחה, התבוננות והרמוניה." }
    ],
    sources: []
  },
  'l2_growth': {
    coreIdea: "שבע הספירות התחתונות כתהליך רגשי ומעשי.",
    axes: [
      { label: "חסד", meaning: "אהבה, נתינה, התרחבות." },
      { label: "גבורה", meaning: "יראה, גבולות, צמצום." },
      { label: "תפארת", meaning: "רחמים, איזון, אמת." },
      { label: "נצח", meaning: "ביטחון, התמדה, ניצחון." },
      { label: "הוד", meaning: "תמימות, הודיה, ענווה." },
      { label: "יסוד", meaning: "התקשרות, ברית, אמת." },
      { label: "מלכות", meaning: "שפלות, ביטוי, הגשמה." }
    ],
    sources: []
  },

  // --- LEVEL 3 (10) ---
  'l3_sefirot': {
    coreIdea: "עשר הספירות כמבנה השלם של ההנהגה והנפש.",
    axes: [
      { label: "כתר", meaning: "רצון עליון, תענוג, אמונה." },
      { label: "חכמה", meaning: "ביטול, הברקה, כוח מה." },
      { label: "בינה", meaning: "שמחה, הבנה, הרחבה." },
      { label: "חסד", meaning: "אהבה, נתינה בלי גבול." },
      { label: "גבורה", meaning: "יראה, צמצום, דין." },
      { label: "תפארת", meaning: "רחמים, פאר, מיזוג." },
      { label: "נצח", meaning: "ניצחון, נצחיות, יוזמה." },
      { label: "הוד", meaning: "הודיה, הכנעה, תמימות." },
      { label: "יסוד", meaning: "התקשרות, חיבור, השפעה." },
      { label: "מלכות", meaning: "קבלת עול, דיבור, מעשה." }
    ],
    sources: ["10/עשר הספירות.md"]
  },
  'l3_commandments': {
    coreIdea: "עשרת הדיברות כיסודות המוסר והקיום.",
    axes: [
      { label: "אנוכי ה'", meaning: "אמונה בסיסית ומקור הסמכות." },
      { label: "לא יהיה", meaning: "שלילת עבודה זרה ופיצול." },
      { label: "לא תשא", meaning: "כבוד לאמת ולשבועה." },
      { label: "זכור את השבת", meaning: "קדושת הזמן והמנוחה." },
      { label: "כבד את אביך", meaning: "הכרת הטוב וחיבור לשורשים." },
      { label: "לא תרצח", meaning: "קדושת החיים." },
      { label: "לא תנאף", meaning: "קדושת המשפחה והנאמנות." },
      { label: "לא תגנוב", meaning: "כבוד לרכוש ולגבולות הזולת." },
      { label: "לא תענה", meaning: "יושרה משפטית וחברתית." },
      { label: "לא תחמוד", meaning: "טוהר המחשבה והרצון." }
    ],
    sources: []
  },

  // --- LEVEL 4 (13) ---
  'l4_mercy': {
    coreIdea: "י\"ג מידות הרחמים כמודל לסליחה ותיקון.",
    axes: [
      { label: "א-ל", meaning: "כוח ועוצמה של חסד." },
      { label: "רחום", meaning: "רחמים המונעים נפילה." },
      { label: "חנון", meaning: "מתנת חינם ללא זכאות." },
      { label: "ארך אפיים", meaning: "סבלנות והמתנה לשינוי." },
      { label: "ורב חסד", meaning: "הטיה כלפי החסד." },
      { label: "ואמת", meaning: "קיום הבטחה ויציבות." },
      { label: "נוצר חסד", meaning: "שמירת זכויות לעתיד." },
      { label: "לאלפים", meaning: "השפעה לדורות רבים." },
      { label: "נושא עוון", meaning: "סליחה על זדונות." },
      { label: "ופשע", meaning: "סליחה על מרידות." },
      { label: "וחטאה", meaning: "סליחה על שגגות." },
      { label: "ונקה", meaning: "ניקוי וטהרה." }
    ],
    sources: []
  }
};

// --- STYLES & THEME UTILS ---

const getColorClasses = (colorName: string) => {
  const map: Record<string, any> = {
    blue: { 
      text: 'text-blue-300', bg: 'bg-[#0f172a]', border: 'border-blue-500/30', 
      gradient: 'from-blue-900/40 via-[#0f172a] to-blue-900/40', accent: 'bg-blue-500', glow: 'shadow-blue-500/20'
    },
    green: { 
      text: 'text-emerald-300', bg: 'bg-[#064e3b]', border: 'border-emerald-500/30', 
      gradient: 'from-emerald-900/40 via-[#022c22] to-emerald-900/40', accent: 'bg-emerald-500', glow: 'shadow-emerald-500/20'
    },
    purple: { 
      text: 'text-purple-300', bg: 'bg-[#3b0764]', border: 'border-purple-500/30', 
      gradient: 'from-purple-900/40 via-[#2e1065] to-purple-900/40', accent: 'bg-purple-500', glow: 'shadow-purple-500/20'
    },
    gold: { 
      text: 'text-amber-300', bg: 'bg-[#451a03]', border: 'border-amber-500/30', 
      gradient: 'from-amber-900/40 via-[#451a03] to-amber-900/40', accent: 'bg-amber-500', glow: 'shadow-amber-500/20'
    }
  };
  return map[colorName] || map.blue;
};

// --- HELPERS ---

const cleanJson = (text: string) => {
  if (!text) return "";
  let cleaned = text.replace(/```json\n?|```/g, '').trim();
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }
  // Remove trailing commas which invalidates JSON
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
  return cleaned;
};

// --- PROMPT BUILDER ---

const buildSystemPrompt = ({ inputText, methodBriefs, preferences }: any) => {
  const methodLines = methodBriefs.map((method: any) => {
    let axesText = "";
    if (method.axes && method.axes.length > 0) {
        axesText = method.axes.map((axis: any, index: number) => 
          `${index + 1}. ${axis.label} – ${axis.meaning}`
        ).join('\n');
    } else {
        // Fallback instruction if axes are missing in the library
        axesText = `Please identify the ${method.level === 1 ? '4' : method.level === 2 ? '7' : method.level === 3 ? '10' : '13'} components of this method based on its standard Jewish/Kabbalistic definition and apply them.`;
    }

    return `
---
METHOD: ${method.name} (Level ${method.level})
CORE IDEA: ${method.coreIdea || method.description}
COMPONENTS / AXES:
${axesText}
---`;
  }).join('\n\n');

  return `
    You are "HolisView Unified", an expert AI system for deep cognitive and spiritual analysis based on Jewish wisdom structures (Kabbalah, Chassidut, Philosophy).

    INPUT TEXT:
    "${inputText}"

    TASK:
    Analyze the input text using the following selected methodologies. For each method, break down the text's meaning, identify underlying patterns, and offer practical insights corresponding to the method's specific structure (axes).

    SELECTED METHODS:
    ${methodLines}

    OUTPUT FORMAT (JSON ONLY):
    {
      "meta": {
        "hebrewDate": "Current Hebrew Date",
        "summary": "A concise executive summary of the holistic analysis in Hebrew (1 paragraph)."
      },
      "proCards": [
        {
          "title": "Creative Title for this Card (Hebrew)",
          "methodId": "ID of the method used",
          "methodName": "Name of the method used",
          "level": 1 | 2 | 3 | 4,
          "layout": "quad" (for level 1) | "list" (for levels 2,3,4) | "central" (for summaries),
          "hebrewDate": "Current Hebrew Date",
          "contentItems": [
            { "label": "Name of axis/component (e.g., Chesed)", "value": "Deep insight relating input to this component (Hebrew)" }
          ]
        }
      ],
      "matrixSections": [
         {
           "methodId": "ID of the method",
           "methodName": "Name of the method",
           "level": 1 | 2 | 3 | 4,
           "cards": [ /* Generate 2-4 variation cards for this specific method to explore it deeply */ ]
         }
      ],
      "essenceCards": [
         {
           "title": "Elemental/Energetic Aspect",
           "element": "Fire" | "Water" | "Air" | "Earth",
           "energy": "One word Hebrew essence",
           "score": 1-5 (intensity),
           "sentences": ["Insight 1", "Insight 2", "Insight 3"]
         }
      ],
      "analysisNarrative": "A cohesive, book-like narrative synthesizing all insights into a flow. (Hebrew, ~200 words)"
    }

    GUIDELINES:
    1. **Diversity**: Don't just repeat the same insight. Use the unique lens of each method (e.g., '10 Sefirot' looks at structure/flow, '13 Attributes of Mercy' looks at compassion/repair).
    2. **Depth**: Go beyond surface level. Use the "Meaning" provided in the method definitions to guide your interpretation.
    3. **Quantity**: Generate at least one ProCard for every selected method in the main 'proCards' array. In 'matrixSections', provide a deeper dive for the first 3 selected methods.
    4. **Language**: All user-facing content must be in high-quality Hebrew.
    5. **Strict JSON**: Ensure the output is valid JSON. No markdown fences.
  `;
};

// --- COMPONENTS ---

// 1. Pro Card (High Fidelity)
const ProCard = ({ card, index }: { card: any, index: number }) => {
  const styles = getColorClasses(card.colorKey);
  const [copied, setCopied] = useState(false);

  const isQuadLayout = card.layout === 'quad';
  const isListLayout = card.layout === 'list';
  const isCentralLayout = card.layout === 'central';

  return (
    <div className={`
      relative group break-inside-avoid mb-8 
      animate-in fade-in slide-in-from-bottom-8 duration-700
      ${index % 2 === 0 ? 'rotate-[0.3deg]' : '-rotate-[0.3deg]'} hover:rotate-0 transition-all
    `} style={{ animationDelay: `${index * 40}ms` }}>
      
      <div className={`absolute -inset-1 rounded-2xl bg-gradient-to-r ${styles.gradient} opacity-20 blur-xl group-hover:opacity-40 transition-opacity duration-500`}></div>
      
      <div className={`
        relative overflow-hidden rounded-xl border ${styles.border} bg-[#0A0A12] 
        shadow-2xl hover:shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] transition-all duration-500
        flex flex-col h-full
      `}>
        
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
        <div className={`h-1 w-full bg-gradient-to-r ${styles.gradient} opacity-80`}></div>

        <div className="p-5 border-b border-white/5 relative bg-white/[0.01]">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center 
                bg-gradient-to-br from-white/10 to-transparent border border-white/10
                shadow-inner
              `}>
                <span className={`font-bold font-mono text-lg ${styles.text}`}>{index + 1}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-100 leading-tight">{card.title}</h3>
                <span className={`text-[10px] font-medium tracking-[0.2em] uppercase ${styles.text} opacity-80`}>
                  {card.methodName}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => { navigator.clipboard.writeText(JSON.stringify(card, null, 2)); setCopied(true); setTimeout(()=>setCopied(false), 2000); }}
              className="p-1.5 rounded-md hover:bg-white/10 text-slate-600 hover:text-white transition-colors"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        <div className="p-5 flex-1 relative z-10">
          {isQuadLayout && (
            <div className="grid grid-cols-2 gap-3 h-full">
              {card.contentItems.slice(0, 4).map((item: any, idx: number) => (
                <div key={idx} className={`
                  relative p-3 rounded-lg border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent
                  flex flex-col justify-between group/item hover:border-white/10 transition-colors
                `}>
                  <div className={`text-[10px] font-bold ${styles.text} uppercase mb-1 opacity-70`}>{item.label}</div>
                  <div className="text-xs text-slate-300 font-light leading-snug">{item.value}</div>
                  <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${styles.border} rounded-br-lg opacity-50`}></div>
                </div>
              ))}
            </div>
          )}

          {isListLayout && (
            <div className="space-y-3">
              {card.contentItems.map((item: any, idx: number) => (
                <div key={idx} className="flex items-start gap-3 group/row">
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full ${styles.accent} shadow-[0_0_8px_currentColor] opacity-60`}></div>
                  <div className="flex-1 pb-3 border-b border-white/[0.03] group-last/row:border-none">
                    <span className="text-xs font-bold text-slate-400 ml-1">{item.label}:</span>
                    <span className="text-sm text-slate-300 font-light">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

           {isCentralLayout && (
             <div className="flex flex-col items-center justify-center text-center h-full py-2">
                <Sparkles size={24} className={`${styles.text} opacity-50 mb-4`} />
                <p className="text-lg font-medium text-slate-200 leading-relaxed italic">
                  "{card.contentItems[0]?.value || card.contentItems[0]}"
                </p>
                <div className={`h-px w-16 ${styles.accent} opacity-30 mt-6`}></div>
             </div>
           )}
        </div>

        <div className="px-5 py-3 bg-[#050508]/50 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
           <div className="flex items-center gap-2">
              <Calendar size={10} />
              <span>{card.hebrewDate}</span>
           </div>
           <div className="flex items-center gap-2">
              <span>HolisView Unified</span>
              <div className={`w-1.5 h-1.5 rounded-sm ${styles.accent}`}></div>
           </div>
        </div>

        <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-white/10 rounded-tl-xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-white/10 rounded-br-xl pointer-events-none"></div>

      </div>
    </div>
  );
};

// 2. Method Chip (Sidebar)
const MethodChip = ({ method, isSelected, onToggle, color }: any) => (
  <button 
    onClick={onToggle} 
    className={`
      w-full text-right p-3 rounded-xl text-xs transition-all flex items-center justify-between group
      ${isSelected 
        ? 'bg-white/10 border border-white/10 text-white shadow-inner' 
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}
    `}
  >
    <span className="font-medium">{method.name.split('(')[0]}</span>
    {isSelected ? <CheckSquare size={14} className={color.text} /> : <Square size={14} className="opacity-20" />}
  </button>
);

// 3. Method Details Panel
const MethodDetails = ({ methodBrief }: any) => {
    if(!methodBrief) return <div className="text-xs text-slate-500 leading-relaxed">בחר שיטה כדי לראות פרשנות בסיסית מתוך המאגר.</div>;
    return (
        <div className="space-y-3 text-xs text-slate-300">
            <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">רעיון ליבה</p>
                <p>{methodBrief.coreIdea}</p>
            </div>
            <div className="space-y-2">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">צירי ניתוח</p>
                {methodBrief.axes && methodBrief.axes.length > 0 ? (
                  <ul className="space-y-1">
                      {methodBrief.axes.map((axis: any) => (
                          <li key={axis.label} className="flex gap-2">
                              <span className="text-slate-400">•</span>
                              <span><strong className="text-slate-200">{axis.label}:</strong> {axis.meaning}</span>
                          </li>
                      ))}
                  </ul>
                ) : (
                  <p className="text-slate-500 italic">המערכת תזהה באופן אוטומטי את רכיבי השיטה.</p>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-slate-500 text-[10px] uppercase tracking-widest">מקורות</p>
                <div className="text-slate-400">{methodBrief.sources && methodBrief.sources.length ? methodBrief.sources.join(', ') : "מקורות כלליים מהמסורת היהודית."}</div>
            </div>
        </div>
    )
}

// --- MAIN APP ---

const App = () => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  const [selectedMethods, setSelectedMethods] = useState<string[]>([]);
  const [expandedLevels, setExpandedLevels] = useState<any>({1: true, 2: false, 3: false, 4: false});
  const [sidebarOpen, setSidebarOpen] = useState(true); // Default Open
  const [searchTerm, setSearchTerm] = useState('');
  
  // View State
  const [activeMethodId, setActiveMethodId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'sections' | 'essence' | 'narrative'>('cards');
  const [includeEssenceCards, setIncludeEssenceCards] = useState(true);
  const [includeNarrative, setIncludeNarrative] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Derived Data
  const methodIndex = useMemo(() => {
    const index: any = {};
    METHODS_DATA.forEach(level => {
      level.methods.forEach(method => {
        index[method.id] = { ...method, level: level.level };
      });
    });
    return index;
  }, []);

  const activeMethodBrief = useMemo(() => {
      if(!activeMethodId) return null;
      const method = methodIndex[activeMethodId];
      if(!method) return null;
      // Fallback builder if library missing - use description from METHODS_DATA or generic
      const libData = METHOD_LIBRARY[activeMethodId] || { 
          coreIdea: method.description || "ניתוח מערכתי על פי חכמת היהדות.", 
          axes: [], 
          sources: [] 
      };
      
      return {
          ...method,
          ...libData
      }
  }, [activeMethodId, methodIndex]);

  const filteredMethods = useMemo(() => {
    if(!searchTerm) return METHODS_DATA;
    const term = searchTerm.trim();
    return METHODS_DATA.map(level => ({
      ...level,
      methods: level.methods.filter(m => m.name.includes(term))
    }));
  }, [searchTerm]);

  const handleAnalyze = async () => {
    if (!inputText || selectedMethods.length === 0) return;
    setLoading(true);
    setResult(null);

    // Prepare Payload
    const selected = selectedMethods.map(id => {
        const m = methodIndex[id];
        const libData = METHOD_LIBRARY[id] || { 
             coreIdea: m.description || "General analysis", 
             axes: [], 
             sources: [] 
        };
        return { ...m, ...libData };
    });

    const prompt = buildSystemPrompt({ 
        inputText, 
        methodBriefs: selected,
        preferences: { includeEssenceCards, includeNarrative }
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-09-2025',
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });
      const rawText = response.text || "{}";
      const cleaned = cleanJson(rawText);
      const parsed = JSON.parse(cleaned);

      // Post-process color keys
      const proCards = (parsed.proCards || []).map((c: any) => ({ ...c, colorKey: c.level === 1 ? 'blue' : c.level === 2 ? 'green' : c.level === 3 ? 'purple' : 'gold' }));
      const matrixSections = (parsed.matrixSections || []).map((s: any) => ({ 
          ...s, 
          colorKey: s.level === 1 ? 'blue' : s.level === 2 ? 'green' : s.level === 3 ? 'purple' : 'gold',
          cards: (s.cards || []).map((c: any) => ({ ...c, colorKey: s.level === 1 ? 'blue' : s.level === 2 ? 'green' : s.level === 3 ? 'purple' : 'gold' }))
      }));

      setResult({
        meta: parsed.meta || {},
        proCards,
        matrixSections,
        essenceCards: parsed.essenceCards || [],
        analysisNarrative: parsed.analysisNarrative || ""
      });

    } catch (error) {
      console.error(error);
      // Mock Error State
      setResult({
          meta: { summary: "שגיאת מערכת – אנא נסה שנית." },
          proCards: [{ title: "שגיאת מערכת", methodName: "System", level: 1, layout: "central", hebrewDate: "היום", contentItems: [{value: "אירעה תקלה ביצירת הקלפים. נסה שוב."}], colorKey: 'blue' }],
          matrixSections: [],
          essenceCards: [],
          analysisNarrative: ""
      });
    }
    setLoading(false);
  };

  const handleSelectAll = (level: number) => {
    const methods = METHODS_DATA.find(l => l.level === level)?.methods || [];
    const ids = methods.map(m => m.id);
    setSelectedMethods(prev => Array.from(new Set([...prev, ...ids])));
  };
  
  const handleClearLevel = (level: number) => {
    const ids = new Set(METHODS_DATA.find(l => l.level === level)?.methods.map(m => m.id) || []);
    setSelectedMethods(prev => prev.filter(id => !ids.has(id)));
  };

  return (
    <div className="min-h-screen bg-[#020204] text-slate-200 font-sans flex flex-col dir-rtl selection:bg-purple-500/30" dir="rtl">
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; border: 2px solid #020204; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
        .animate-spin-slow { animation: spin 3s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media print {
          @page { size: A4 landscape; margin: 1cm; }
          body { background: white !important; color: black !important; -webkit-print-color-adjust: exact; }
          .print-hidden { display: none !important; }
          .columns-1, .md\\:columns-2, .lg\\:columns-3, .xl\\:columns-4 { column-count: 3 !important; }
          .group { break-inside: avoid; page-break-inside: avoid; }
        }
      `}</style>

      {/* HEADER */}
      <header className="sticky top-0 z-50 h-16 border-b border-white/[0.06] bg-[#020204]/90 backdrop-blur-xl flex items-center justify-between px-6 print-hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-3">
             <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
               <div className="relative w-8 h-8 bg-black rounded-lg flex items-center justify-center border border-white/10">
                  <Layers size={18} className="text-white" />
               </div>
             </div>
             <h1 className="text-lg font-bold text-slate-200 tracking-tight">HolisView <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 font-black italic pr-1">Unified</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
           <span className="text-[10px] font-mono text-slate-500 hidden md:block border border-white/5 px-2 py-1 rounded">V{VERSION}</span>
           <button onClick={() => window.print()} disabled={!result} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-30">
              <Printer size={18} />
            </button>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(result || {}, null, 2))} disabled={!result} className="p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all disabled:opacity-30">
              <Copy size={18} />
            </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden print:block relative">
        
        {/* SIDEBAR */}
        <aside className={`
          fixed inset-y-0 right-0 z-40 bg-[#050508] border-l border-white/5 transition-all duration-500
          ${sidebarOpen ? 'translate-x-0 shadow-2xl shadow-black/50' : 'translate-x-full pointer-events-none opacity-0 md:pointer-events-auto md:opacity-100'} 
          md:relative md:shadow-none md:transform-none
          ${sidebarOpen ? 'md:w-80' : 'md:w-0 md:border-none md:overflow-hidden'}
        `}>
          <div className="p-5 h-full flex flex-col gap-6 w-80">
            
            {/* Search */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Matrix Selection</h2>
              <div className="relative">
                <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="סינון שיטות"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-8 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
                />
              </div>
            </div>

            {/* Methods List */}
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar px-1">
              {filteredMethods.map(l => {
                const styles = getColorClasses(l.baseColor);
                return (
                  <div key={l.level} className="space-y-2">
                    <button 
                      onClick={() => setExpandedLevels((prev: any) => ({...prev, [l.level]: !prev[l.level]}))} 
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg transition-all text-sm group
                        ${expandedLevels[l.level] ? 'bg-white/[0.03] text-white' : 'text-slate-400 hover:text-slate-200'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${styles.accent} shadow-[0_0_10px_currentColor]`}></div>
                        <span className="font-medium">{l.title.split('-')[1]}</span>
                      </div>
                      <ChevronDown size={14} className={`transition-transform duration-300 ${expandedLevels[l.level] ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {expandedLevels[l.level] && (
                      <div className="space-y-2 pb-2">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest px-2">
                          <span>פעולות מהירות</span>
                          <div className="flex gap-2">
                             <button onClick={() => handleSelectAll(l.level)} className="hover:text-slate-300">הכל</button>
                             <button onClick={() => handleClearLevel(l.level)} className="hover:text-slate-300">נקה</button>
                          </div>
                        </div>
                        {l.methods.map(m => (
                           <div key={m.id} onMouseEnter={() => setActiveMethodId(m.id)}>
                             <MethodChip 
                                method={m} 
                                isSelected={selectedMethods.includes(m.id)} 
                                onToggle={() => setSelectedMethods(prev => prev.includes(m.id) ? prev.filter(x=>x!==m.id) : [...prev, m.id])} 
                                color={styles} 
                             />
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Info Panel */}
            <div className="space-y-3 border-t border-white/5 pt-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Bookmark size={12} />
                    פרשנות בסיסית
                 </div>
                 <MethodDetails methodBrief={activeMethodBrief} />
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#05050A] relative scroll-smooth">
          {/* Subtle Grid Background */}
          <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:20px_20px]"></div>

          <div className="max-w-6xl mx-auto p-6 md:p-12 relative z-10 min-h-full flex flex-col gap-10">
            
            {/* 1. INPUT SECTION */}
            <section className="space-y-6">
               <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5">{selectedMethods.length} שיטות פעילות</span>
                    <span className="px-3 py-1 rounded-full border border-white/10 bg-white/5 flex items-center gap-2"><Filter size={12}/> Unified Matrix</span>
                  </div>
                  <div className="relative group rounded-3xl p-[1px] bg-gradient-to-b from-white/10 to-white/0 focus-within:from-purple-500/50 focus-within:to-blue-500/50 transition-all duration-500">
                    <div className="relative bg-[#0A0A14] rounded-[23px] overflow-hidden shadow-2xl shadow-black/50">
                      <textarea 
                        value={inputText} onChange={(e) => setInputText(e.target.value)}
                        placeholder="הזן טקסט, שאלה או דילמה..."
                        className="w-full bg-transparent p-6 text-lg font-light text-slate-200 focus:outline-none placeholder:text-slate-700 resize-none custom-scrollbar h-44"
                      />
                      <div className="flex flex-wrap items-center justify-between px-4 py-3 bg-[#0E0E1A] border-t border-white/5 gap-4">
                         <div className="flex items-center gap-3 text-xs text-slate-400">
                            <button onClick={() => setIncludeEssenceCards(!includeEssenceCards)} className={`px-3 py-1 rounded-full border ${includeEssenceCards ? 'border-purple-500/40 text-purple-300' : 'border-white/10 text-slate-500'}`}>Essence Cards</button>
                            <button onClick={() => setIncludeNarrative(!includeNarrative)} className={`px-3 py-1 rounded-full border ${includeNarrative ? 'border-blue-500/40 text-blue-300' : 'border-white/10 text-slate-500'}`}>Narrative</button>
                         </div>
                        <button 
                          onClick={handleAnalyze} disabled={loading || !inputText || selectedMethods.length === 0}
                          className={`
                            px-6 py-2.5 rounded-xl text-white font-medium text-sm transition-all flex items-center gap-2
                            ${loading 
                              ? 'bg-slate-800 cursor-not-allowed' 
                              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:scale-105 active:scale-95'}
                          `}
                        >
                          {loading ? <Loader2 size={16} className="animate-spin" /> : <><Zap size={16} /> הפק ניתוח</>}
                        </button>
                      </div>
                    </div>
                  </div>
               </div>
            </section>

            {/* 2. RESULTS SECTION */}
            <section className={`
               space-y-6 transition-all duration-500
               ${isFullScreen ? 'fixed inset-0 z-[60] bg-[#05050A] p-6 md:p-12 overflow-y-auto custom-scrollbar' : ''}
            `}>
               <div className="flex flex-wrap items-center justify-between gap-4">
                 <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
                   <LayoutGrid size={14} />
                   תוצאות
                 </div>
                 <div className="flex flex-wrap gap-2 text-xs">
                    <button 
                       onClick={() => setIsFullScreen(!isFullScreen)}
                       className={`
                          px-3 py-1.5 rounded-full border flex items-center gap-2 transition-all
                          ${isFullScreen ? 'border-purple-500 bg-purple-500/10 text-purple-300' : 'border-white/10 text-slate-500 hover:border-white/30 hover:text-white'}
                       `}
                       title={isFullScreen ? "צא ממסך מלא" : "מסך מלא"}
                    >
                       {isFullScreen ? <Minimize2 size={12}/> : <Maximize2 size={12}/>}
                       {isFullScreen ? "Close Fullscreen" : "Fullscreen"}
                    </button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    {[
                      {id: 'cards', label: 'Pro Cards', icon: Grid},
                      {id: 'sections', label: 'Matrix Sections', icon: Layout},
                      {id: 'essence', label: 'Essence Map', icon: Sparkles},
                      {id: 'narrative', label: 'Narrative', icon: Brain},
                    ].map(item => {
                      const Icon = item.icon;
                      return (
                        <button 
                          key={item.id} 
                          onClick={() => setViewMode(item.id as any)}
                          className={`
                             px-3 py-1.5 rounded-full border flex items-center gap-2
                             ${viewMode === item.id ? 'border-purple-500/50 text-purple-300 bg-purple-500/10' : 'border-white/10 text-slate-500'}
                          `}
                        >
                          <Icon size={12} />
                          {item.label}
                        </button>
                      )
                    })}
                 </div>
               </div>
               
               {loading && (
                   <div className="flex flex-col items-center justify-center min-h-[240px]">
                      <div className="relative">
                        <div className="w-24 h-24 border border-purple-500/20 rounded-2xl animate-spin-slow"></div>
                        <div className="absolute inset-0 w-24 h-24 border-t-2 border-purple-500 rounded-2xl animate-spin"></div>
                        <div className="absolute inset-4 bg-purple-500/20 blur-xl rounded-full animate-pulse"></div>
                      </div>
                      <div className="mt-6 text-center">
                        <h3 className="text-xl font-bold text-white tracking-widest uppercase">Rendering Matrix</h3>
                        <p className="text-purple-400 text-sm font-mono mt-2">מייצר קלפי עומק...</p>
                      </div>
                   </div>
               )}

               {!loading && !result && (
                 <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-slate-900/20 rounded-3xl border border-dashed border-white/10">
                   <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                     <Activity className="w-10 h-10 text-slate-600" />
                   </div>
                   <h3 className="text-xl font-bold text-slate-400 mb-2">מוכן לניתוח</h3>
                   <p className="text-slate-500 max-w-md">
                     בחר שיטות מהתפריט, הזן טקסט ולחץ על הפקה כדי לקבל ניתוח הוליסטי עשיר.
                   </p>
                 </div>
               )}

               {!loading && result && (
                  <div className="space-y-10">
                     
                     {/* View: Pro Cards Grid */}
                     {viewMode === 'cards' && (
                       <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                          {result.proCards.map((card: any, index: number) => (
                             <ProCard key={`${card.title}-${index}`} card={card} index={index} />
                          ))}
                       </div>
                     )}

                     {/* View: Matrix Sections (Organized) */}
                     {viewMode === 'sections' && (
                       <div className="space-y-10">
                          {result.matrixSections.map((section: any) => {
                             const styles = getColorClasses(section.colorKey);
                             return (
                               <div key={section.methodId} className="space-y-4">
                                  <div className="flex items-center gap-3">
                                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${styles.border} bg-white/5`}>
                                        <Layers size={16} className={styles.text} />
                                     </div>
                                     <div>
                                        <h3 className="text-lg font-bold text-slate-100">{section.methodName}</h3>
                                        <span className={`text-[10px] font-mono uppercase ${styles.text}`}>Level {section.level}</span>
                                     </div>
                                  </div>
                                  <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                                     {section.cards.map((card: any, index: number) => (
                                       <div key={`${card.title}-${index}`} className="min-w-[260px] max-w-[300px] snap-start">
                                          <ProCard card={{...card, colorKey: section.colorKey, methodName: section.methodName}} index={index} />
                                       </div>
                                     ))}
                                  </div>
                               </div>
                             )
                          })}
                       </div>
                     )}

                     {/* View: Essence Cards (Elemental) */}
                     {viewMode === 'essence' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                           {result.essenceCards.map((card: any, index: number) => (
                              <div key={`${card.title}-${index}`} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <h3 className="text-lg font-bold text-slate-100">{card.title}</h3>
                                       <span className="text-xs text-slate-500">{card.energy}</span>
                                    </div>
                                    <div className="flex gap-1">
                                       {[...Array(5)].map((_, score) => (
                                          <div key={score} className={`w-2 h-2 rounded-full ${score < card.score ? 'bg-purple-400' : 'bg-slate-800'}`}></div>
                                       ))}
                                    </div>
                                 </div>
                                 <ul className="space-y-2 text-sm text-slate-300">
                                    {card.sentences.map((sentence: string, idx: number) => (
                                       <li key={idx} className="flex gap-2">
                                          <span className="text-purple-400">•</span>
                                          <span>{sentence}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           ))}
                        </div>
                     )}

                     {/* View: Narrative */}
                     {viewMode === 'narrative' && (
                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4">
                           <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest">
                              <Star size={14} />
                              Narrative Summary
                           </div>
                           <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                              {result.analysisNarrative || "לא נוצר נרטיב עבור הניתוח הנוכחי."}
                           </p>
                        </div>
                     )}

                  </div>
               )}

            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;