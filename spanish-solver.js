(() => {
    'use strict';

    // Enhanced Configuration with embedded API key
    const CONFIG = {
        delayBetweenQuestions: 400,
        submitDelay: 1500,
        enableAutoSubmit: true,
        enableLogging: true,
        maxRetries: 3,
        enableVisualFeedback: true,
        skipFilledInputs: true,
        confidenceThreshold: 0.8,
        useMultipleAPIs: true,
        saveProgress: true,
        handleMultipleChoice: true,
        mcConfidenceThreshold: 0.7,
        useGeminiAI: true,
        useBackupAPIs: true,
        geminiApiKey: 'AIzaSyBK7cVBxGN1F4-8cHQ2x_Rt3zW9-kL5M3P', // Your API key embedded directly
        enableSmartConjugation: true,
        enableContextAnalysis: true
    };

    // Gemini API Configuration
    const GEMINI_CONFIG = {
        apiUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        maxTokens: 1000,
        temperature: 0.1,
        fallbackAPIs: []
    };

    // Load from GitHub script - no CORS issues since it's JavaScript execution
    const loadFromGitHubScript = () => {
        // API key is already embedded in CONFIG above
        // This method completely bypasses CORS since we're not fetching, we're executing
        if (CONFIG.geminiApiKey && CONFIG.geminiApiKey.length > 20) {
            log('✅ API key loaded from embedded script');
            return true;
        }
        return false;
    };

    // Comprehensive Spanish Conjugation Knowledge Base
    const conjugationKnowledgeBase = {
        // Basic conjugation rules
        conjugationSteps: {
            "first step": "drop the ending",
            "second step": "add new ending",
            "third step": "check for irregulars",
            "final step": "verify agreement"
        },
        
        // Infinitive endings
        infinitiveEndings: {
            "ar": ["hablar", "estudiar", "caminar", "trabajar", "bailar", "cantar", "cocinar"],
            "er": ["comer", "correr", "beber", "leer", "vender", "aprender", "comprender"],
            "ir": ["vivir", "escribir", "abrir", "salir", "partir", "recibir", "decidir"]
        },
        
        // Present tense endings
        presentTense: {
            "ar": {
                "yo": "o", "tú": "as", "él/ella/usted": "a",
                "nosotros": "amos", "vosotros": "áis", "ellos/ellas/ustedes": "an"
            },
            "er": {
                "yo": "o", "tú": "es", "él/ella/usted": "e",
                "nosotros": "emos", "vosotros": "éis", "ellos/ellas/ustedes": "en"
            },
            "ir": {
                "yo": "o", "tú": "es", "él/ella/usted": "e",
                "nosotros": "imos", "vosotros": "ís", "ellos/ellas/ustedes": "en"
            }
        },
        
        // Preterite tense endings
        preteriteTense: {
            "ar": {
                "yo": "é", "tú": "aste", "él/ella/usted": "ó",
                "nosotros": "amos", "vosotros": "asteis", "ellos/ellas/ustedes": "aron"
            },
            "er": {
                "yo": "í", "tú": "iste", "él/ella/usted": "ió",
                "nosotros": "imos", "vosotros": "isteis", "ellos/ellas/ustedes": "ieron"
            },
            "ir": {
                "yo": "í", "tú": "iste", "él/ella/usted": "ió",
                "nosotros": "imos", "vosotros": "isteis", "ellos/ellas/ustedes": "ieron"
            }
        },
        
        // Imperfect tense endings
        imperfectTense: {
            "ar": {
                "yo": "aba", "tú": "abas", "él/ella/usted": "aba",
                "nosotros": "ábamos", "vosotros": "abais", "ellos/ellas/ustedes": "aban"
            },
            "er": {
                "yo": "ía", "tú": "ías", "él/ella/usted": "ía",
                "nosotros": "íamos", "vosotros": "íais", "ellos/ellas/ustedes": "ían"
            },
            "ir": {
                "yo": "ía", "tú": "ías", "él/ella/usted": "ía",
                "nosotros": "íamos", "vosotros": "íais", "ellos/ellas/ustedes": "ían"
            }
        },
        
        // Irregular verbs
        irregularVerbs: {
            "ser": {
                present: ["soy", "eres", "es", "somos", "sois", "son"],
                preterite: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
                imperfect: ["era", "eras", "era", "éramos", "erais", "eran"]
            },
            "estar": {
                present: ["estoy", "estás", "está", "estamos", "estáis", "están"],
                preterite: ["estuve", "estuviste", "estuvo", "estuvimos", "estuvisteis", "estuvieron"],
                imperfect: ["estaba", "estabas", "estaba", "estábamos", "estabais", "estaban"]
            },
            "tener": {
                present: ["tengo", "tienes", "tiene", "tenemos", "tenéis", "tienen"],
                preterite: ["tuve", "tuviste", "tuvo", "tuvimos", "tuvisteis", "tuvieron"],
                imperfect: ["tenía", "tenías", "tenía", "teníamos", "teníais", "tenían"]
            },
            "hacer": {
                present: ["hago", "haces", "hace", "hacemos", "hacéis", "hacen"],
                preterite: ["hice", "hiciste", "hizo", "hicimos", "hicisteis", "hicieron"],
                imperfect: ["hacía", "hacías", "hacía", "hacíamos", "hacíais", "hacían"]
            },
            "ir": {
                present: ["voy", "vas", "va", "vamos", "vais", "van"],
                preterite: ["fui", "fuiste", "fue", "fuimos", "fuisteis", "fueron"],
                imperfect: ["iba", "ibas", "iba", "íbamos", "ibais", "iban"]
            },
            "poder": {
                present: ["puedo", "puedes", "puede", "podemos", "podéis", "pueden"],
                preterite: ["pude", "pudiste", "pudo", "pudimos", "pudisteis", "pudieron"],
                imperfect: ["podía", "podías", "podía", "podíamos", "podíais", "podían"]
            },
            "querer": {
                present: ["quiero", "quieres", "quiere", "queremos", "queréis", "quieren"],
                preterite: ["quise", "quisiste", "quiso", "quisimos", "quisisteis", "quisieron"],
                imperfect: ["quería", "querías", "quería", "queríamos", "queríais", "querían"]
            },
            "decir": {
                present: ["digo", "dices", "dice", "decimos", "decís", "dicen"],
                preterite: ["dije", "dijiste", "dijo", "dijimos", "dijisteis", "dijeron"],
                imperfect: ["decía", "decías", "decía", "decíamos", "decíais", "decían"]
            },
            "venir": {
                present: ["vengo", "vienes", "viene", "venimos", "venís", "vienen"],
                preterite: ["vine", "viniste", "vino", "vinimos", "vinisteis", "vinieron"],
                imperfect: ["venía", "venías", "venía", "veníamos", "veníais", "venían"]
            },
            "dar": {
                present: ["doy", "das", "da", "damos", "dais", "dan"],
                preterite: ["di", "diste", "dio", "dimos", "disteis", "dieron"],
                imperfect: ["daba", "dabas", "daba", "dábamos", "dabais", "daban"]
            }
        },
        
        // Stem-changing verbs
        stemChangingVerbs: {
            "e-ie": ["pensar", "comenzar", "empezar", "cerrar", "perder", "entender", "querer", "preferir"],
            "o-ue": ["dormir", "morir", "contar", "encontrar", "volver", "poder", "mostrar"],
            "e-i": ["pedir", "servir", "repetir", "seguir", "vestir", "conseguir"]
        },
        
        // Grammar rules
        grammarRules: {
            articleAgreement: "Articles must agree with noun gender and number",
            adjectiveAgreement: "Adjectives must agree with noun gender and number",
            verbSubjectAgreement: "Verbs must agree with subject person and number",
            serVsEstar: "Ser for permanent traits, Estar for temporary states",
            porVsPara: "Por for through/by/for duration, Para for destination/purpose/deadline"
        }
    };

    // Enhanced Dictionary with conjugation focus
    const dictionary = {
        // Conjugation terminology
        "conjugation": "conjugación",
        "conjugate": "conjugar",
        "infinitive": "infinitivo",
        "stem": "raíz",
        "root": "raíz",
        "ending": "terminación",
        "suffix": "terminación",
        "present tense": "tiempo presente",
        "past tense": "tiempo pasado",
        "preterite": "pretérito",
        "imperfect": "imperfecto",
        "future tense": "tiempo futuro",
        "conditional": "condicional",
        "subjunctive": "subjuntivo",
        "imperative": "imperativo",
        "gerund": "gerundio",
        "past participle": "participio pasado",
        
        // Subject pronouns
        "I": "yo",
        "you": "tú",
        "he": "él",
        "she": "ella",
        "we": "nosotros",
        "you all": "vosotros",
        "they": "ellos/ellas",
        "formal you": "usted",
        "formal you plural": "ustedes",
        
        // Question words
        "what": "qué",
        "when": "cuándo",
        "where": "dónde",
        "who": "quién",
        "why": "por qué",
        "how": "cómo",
        "which": "cuál",
        "how much": "cuánto",
        "how many": "cuántos",
        
        // Common verbs and their meanings
        "to be": "ser/estar",
        "to have": "tener",
        "to do": "hacer",
        "to say": "decir",
        "to go": "ir",
        "to come": "venir",
        "to see": "ver",
        "to know": "saber/conocer",
        "to want": "querer",
        "to can": "poder",
        "to give": "dar",
        "to take": "tomar",
        "to get": "obtener",
        "to make": "hacer",
        "to think": "pensar",
        "to feel": "sentir",
        "to look": "mirar",
        "to find": "encontrar",
        "to tell": "decir",
        "to ask": "preguntar",
        "to work": "trabajar",
        "to live": "vivir",
        "to love": "amar",
        "to like": "gustar",
        "to need": "necesitar",
        "to help": "ayudar",
        "to learn": "aprender",
        "to teach": "enseñar",
        "to study": "estudiar",
        "to read": "leer",
        "to write": "escribir",
        "to speak": "hablar",
        "to listen": "escuchar",
        "to eat": "comer",
        "to drink": "beber",
        "to sleep": "dormir",
        "to walk": "caminar",
        "to run": "correr",
        "to play": "jugar",
        "to buy": "comprar",
        "to sell": "vender",
        "to open": "abrir",
        "to close": "cerrar",
        "to start": "empezar",
        "to finish": "terminar",
        "to continue": "continuar",
        "to stop": "parar",
        "to wait": "esperar",
        "to remember": "recordar",
        "to forget": "olvidar",
        "to understand": "entender",
        "to explain": "explicar",
        "to answer": "responder",
        "to call": "llamar",
        "to arrive": "llegar",
        "to leave": "salir",
        "to return": "volver",
        "to travel": "viajar",
        "to visit": "visitar",
        "to clean": "limpiar",
        "to cook": "cocinar",
        "to dance": "bailar",
        "to sing": "cantar",
        
        // Multiple choice specific answers
        "first step to conjugation": "drop the ending",
        "first step of conjugation": "drop the ending",
        "drop the ending": "drop the ending",
        "remove the ending": "drop the ending", 
        "take off the ending": "drop the ending",
        "identify the stem": "identify the stem",
        "find the root": "identify the stem",
        "add the new ending": "add the new ending",
        "add new ending": "add the new ending",
        "attach the ending": "add the new ending",
        "check for irregulars": "check for irregulars",
        "look for irregular verbs": "check for irregulars",
        "verify agreement": "verify agreement",
        "ensure agreement": "verify agreement",
        
        // Core Phrases and Questions
        "I have": "Tengo",
        "I need": "Necesito", 
        "What do you need": "¿Qué necesitas?",
        "What do you need?": "¿Qué necesitas?",
        "How much does it cost": "¿Cuánto cuesta?",
        "How much does it cost?": "¿Cuánto cuesta?",
        "How much do they cost": "¿Cuánto cuestan?",
        "How much do they cost?": "¿Cuánto cuestan?",
        "The places at school": "Los lugares en la escuela",
        "School vocab": "Más vocabulario escolar",
        "More school vocabulary": "Más vocabulario escolar",
        "The class begins at": "La clase empieza a",
        "The class ends at": "La clase termina a",
        "What time": "¿A qué hora?",
        "At what time": "¿A qué hora?",
        
        // School Subjects
        "math": "las matemáticas",
        "mathematics": "las matemáticas",
        "chemistry": "la química",
        "science": "la ciencia",
        "social studies": "los estudios sociales",
        "geography": "la geografía",
        "history": "la historia",
        "english": "inglés",
        "computer science": "la informática",
        "physical education": "educación física",
        "art": "el arte",
        "music": "la música",
        
        // School Places  
        "auditorium": "el auditorio",
        "classroom": "el aula",
        "library": "la biblioteca",
        "cafeteria": "la cafetería",
        "gymnasium": "el gimnasio",
        "laboratory": "el laboratorio",
        "office": "la oficina",
        "hallway": "el pasillo",
        "swimming pool": "la piscina",
        "bathroom": "el baño",
        
        // Numbers
        "zero": "cero", "one": "uno", "two": "dos", "three": "tres", "four": "cuatro",
        "five": "cinco", "six": "seis", "seven": "siete", "eight": "ocho", "nine": "nueve",
        "ten": "diez", "eleven": "once", "twelve": "doce", "thirteen": "trece",
        "fourteen": "catorce", "fifteen": "quince", "sixteen": "dieciséis",
        "seventeen": "diecisiete", "eighteen": "dieciocho", "nineteen": "diecinueve",
        "twenty": "veinte", "thirty": "treinta", "forty": "cuarenta",
        "fifty": "cincuenta", "sixty": "sesenta", "seventy": "setenta",
        "eighty": "ochenta", "ninety": "noventa", "hundred": "cien"
    };

    // Progress tracking
    let processedCount = 0;
    let successCount = 0;
    let mcProcessedCount = 0;
    let mcSuccessCount = 0;
    let isProcessing = false;

    // Utility functions
    const log = (...args) => {
        if (CONFIG.enableLogging) {
            console.log('%c[Spanish AI Solver]', 'color: #4CAF50; font-weight: bold;', ...args);
        }
    };

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Gemini AI Integration
    const askGeminiAI = async (question, choices = null, context = '') => {
        if (!CONFIG.geminiApiKey || !CONFIG.useGeminiAI) {
            log('⚠️ Gemini API not available, falling back to offline methods');
            return null;
        }

        try {
            let prompt = '';
            
            if (choices && choices.length > 0) {
                // Multiple choice question
                prompt = `You are a Spanish language expert. Answer this multiple choice question about Spanish grammar, vocabulary, or conjugation.

Question: ${question}

Choices:
${choices.map((choice, index) => `${index + 1}. ${choice.text}`).join('\n')}

Context: ${context}

Please respond with ONLY the number (1, 2, 3, etc.) of the correct answer. Do not include any explanation unless specifically asked. Base your answer on proper Spanish grammar rules, conjugation patterns, and language conventions.

If this is about verb conjugation, remember:
- First step is always to drop the infinitive ending (-ar, -er, -ir)
- Then identify the stem/root
- Add appropriate endings based on subject and tense
- Check for irregular patterns

Answer with just the number:`;
            } else {
                // Translation question
                prompt = `You are a Spanish translation expert. Translate this English text to Spanish. Focus on accuracy and proper grammar.

English text: "${question}"

Context: ${context}

Rules:
- Provide natural, grammatically correct Spanish
- Consider context for proper word choice
- Use appropriate verb tenses and conjugations
- Ensure gender and number agreement
- If it's a question, maintain question format with proper punctuation (¿?)

Respond with ONLY the Spanish translation, no explanations:`;
            }

            const requestBody = {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: GEMINI_CONFIG.temperature,
                    maxOutputTokens: GEMINI_CONFIG.maxTokens,
                    topP: 0.8,
                    topK: 10
                }
            };

            log('🤖 Asking Gemini AI:', question);
            
            const response = await fetch(`${GEMINI_CONFIG.apiUrl}?key=${CONFIG.geminiApiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                const result = data.candidates[0].content.parts[0].text.trim();
                log('✅ Gemini AI response:', result);
                return result;
            } else {
                throw new Error('Invalid response format from Gemini');
            }

        } catch (error) {
            log('❌ Gemini AI error:', error.message);
            
            // Try backup APIs if available
            if (CONFIG.useBackupAPIs) {
                return await tryBackupAPIs(question, choices, context);
            }
            
            return null;
        }
    };

    // Backup AI APIs
    const tryBackupAPIs = async (question, choices, context) => {
        const backupAPIs = [
            // Add other AI APIs here as fallbacks
            async () => {
                // OpenAI GPT fallback (if API key available)
                return await askOpenAI(question, choices, context);
            },
            async () => {
                // Free translation APIs
                return await translateWithFreeAPI(question);
            }
        ];

        for (const apiFunc of backupAPIs) {
            try {
                const result = await apiFunc();
                if (result) return result;
            } catch (error) {
                log('❌ Backup API failed:', error.message);
                continue;
            }
        }

        return null;
    };

    // Smart conjugation analysis
    const analyzeConjugation = (questionText, choices = null) => {
        const lowerQuestion = questionText.toLowerCase();
        
        // Detect conjugation-related questions
        const conjugationKeywords = [
            'conjugat', 'first step', 'second step', 'ending', 'stem', 'root', 
            'infinitive', 'present', 'preterite', 'imperfect', 'tense'
        ];
        
        const isConjugationQuestion = conjugationKeywords.some(keyword => 
            lowerQuestion.includes(keyword)
        );
        
        if (!isConjugationQuestion) return null;
        
        log('🔍 Detected conjugation question, analyzing...');
        
        // Specific conjugation rules
        if (lowerQuestion.includes('first step') && lowerQuestion.includes('conjugat')) {
            return { answer: 'drop the ending', confidence: 0.95, reasoning: 'First step of conjugation' };
        }
        
        if (lowerQuestion.includes('second step') && lowerQuestion.includes('conjugat')) {
            return { answer: 'add the new ending', confidence: 0.9, reasoning: 'Second step of conjugation' };
        }
        
        if (lowerQuestion.includes('infinitive') && lowerQuestion.includes('ending')) {
            return { answer: 'drop the ending', confidence: 0.9, reasoning: 'Infinitive ending removal' };
        }
        
        // Check for verb tense identification
        if (lowerQuestion.includes('present tense')) {
            return { answer: 'presente', confidence: 0.85, reasoning: 'Present tense identification' };
        }
        
        return null;
    };

    // Simple visual feedback
    const showVisualFeedback = (element, success, answer = '') => {
        if (!CONFIG.enableVisualFeedback) return;
        
        element.style.border = success ? '2px solid green' : '2px solid orange';
        if (answer) element.title = answer;
        
        setTimeout(() => {
            element.style.border = '';
        }, 2000);
    };

    // Enhanced multiple choice processing with AI
    const findBestMultipleChoiceAnswer = async (questionText, choices) => {
        const cleanQuestion = questionText.toLowerCase().trim();
        log(`🤔 AI Analyzing MC question: "${cleanQuestion}"`);
        log(`📝 Choices: ${choices.map(c => c.text).join(' | ')}`);
        
        let bestChoice = null;
        let bestScore = 0;
        let bestReason = '';
        
        // Method 1: AI Analysis (Gemini first)
        if (CONFIG.useGeminiAI && CONFIG.geminiApiKey) {
            try {
                const aiResponse = await askGeminiAI(questionText, choices, 'Spanish grammar quiz');
                
                if (aiResponse) {
                    // Parse AI response (should be a number)
                    const choiceNumber = parseInt(aiResponse.match(/\d+/)?.[0]);
                    if (choiceNumber && choiceNumber >= 1 && choiceNumber <= choices.length) {
                        const selectedChoice = choices[choiceNumber - 1];
                        log(`🤖 Gemini AI selected choice ${choiceNumber}: "${selectedChoice.text}"`);
                        return { 
                            choice: selectedChoice, 
                            confidence: 0.92, 
                            reason: 'Gemini AI analysis' 
                        };
                    }
                }
            } catch (error) {
                log('❌ AI analysis failed:', error.message);
            }
        }
        
        // Method 2: Smart conjugation analysis
        const conjugationAnalysis = analyzeConjugation(questionText, choices);
        if (conjugationAnalysis) {
            const matchingChoice = choices.find(choice => 
                choice.text.toLowerCase().includes(conjugationAnalysis.answer.toLowerCase()) ||
                conjugationAnalysis.answer.toLowerCase().includes(choice.text.toLowerCase())
            );
            
            if (matchingChoice) {
                log(`🧠 Conjugation analysis: "${conjugationAnalysis.answer}" -> "${matchingChoice.text}"`);
                return {
                    choice: matchingChoice,
                    confidence: conjugationAnalysis.confidence,
                    reason: conjugationAnalysis.reasoning
                };
            }
        }
        
        // Method 3: Enhanced knowledge base matching
        for (const [key, answer] of Object.entries(dictionary)) {
            if (cleanQuestion.includes(key.toLowerCase())) {
                for (const choice of choices) {
                    const choiceText = choice.text.toLowerCase().trim();
                    if (choiceText.includes(answer.toLowerCase()) || 
                        answer.toLowerCase().includes(choiceText) ||
                        calculateSimilarity(choiceText, answer.toLowerCase()) > 0.8) {
                        log(`✅ Dictionary match: "${key}" -> "${answer}" -> Choice: "${choice.text}"`);
                        return { choice, confidence: 0.85, reason: `Dictionary: ${key} -> ${answer}` };
                    }
                }
            }
        }
        
        // Method 4: Conjugation-specific logic
        if (cleanQuestion.includes('first step') && cleanQuestion.includes('conjugat')) {
            const dropEndingChoice = choices.find(choice => 
                choice.text.toLowerCase().includes('drop') || 
                choice.text.toLowerCase().includes('remove') ||
                choice.text.toLowerCase().includes('ending')
            );
            
            if (dropEndingChoice) {
                return { 
                    choice: dropEndingChoice, 
                    confidence: 0.95, 
                    reason: 'First step of conjugation rule' 
                };
            }
        }
        
        // Method 5: Pattern matching with conjugation knowledge
        for (const choice of choices) {
            const choiceText = choice.text.toLowerCase().trim();
            let score = 0;
            let reasons = [];
            
            // Check conjugation terms
            const conjugationTerms = ['stem', 'root', 'ending', 'infinitive', 'conjugate', 'verb'];
            for (const term of conjugationTerms) {
                if (choiceText.includes(term)) {
                    score += 0.3;
                    reasons.push(`contains ${term}`);
                }
            }
            
            // Grammar rule scoring
            if (cleanQuestion.includes('agree') || cleanQuestion.includes('match')) {
                if (choiceText.includes('gender') || choiceText.includes('number') || 
                    choiceText.includes('noun') || choiceText.includes('subject')) {
                    score += 0.4;
                    reasons.push('agreement rule');
                }
            }
            
            // Verb tense scoring
            if (cleanQuestion.includes('tense') || cleanQuestion.includes('time')) {
                if (choiceText.includes('present') || choiceText.includes('past') || 
                    choiceText.includes('future') || choiceText.includes('preterite')) {
                    score += 0.3;
                    reasons.push('tense identification');
                }
            }
            
            if (score > bestScore) {
                bestChoice = choice;
                bestScore = score;
                bestReason = reasons.join(', ');
            }
        }
        
        // Method 6: Fallback to longest/most descriptive answer
        if (!bestChoice || bestScore < 0.3) {
            const longestChoice = choices.reduce((prev, current) => 
                current.text.length > prev.text.length ? current : prev
            );
            
            if (longestChoice.text.length > 10) {
                bestChoice = longestChoice;
                bestScore = 0.2;
                bestReason = 'longest descriptive answer fallback';
            }
        }
        
        return bestChoice ? { 
            choice: bestChoice, 
            confidence: bestScore, 
            reason: bestReason || 'pattern matching'
        } : null;
    };

    // String similarity function
    const calculateSimilarity = (str1, str2) => {
        const longer = str1.length > str2.length ? str1 : str2;
        const shorter = str1.length > str2.length ? str2 : str1;
        
        if (longer.length === 0) return 1.0;
        
        const editDistance = levenshteinDistance(longer, shorter);
        return (longer.length - editDistance) / longer.length;
    };

    const levenshteinDistance = (str1, str2) => {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    };

    // Enhanced translation with AI support
    const translateText = async (englishText) => {
        const originalText = englishText.trim();
        const cleanText = originalText.toLowerCase();
        
        log(`🔍 AI Translating: "${originalText}"`);
        
        // Step 1: Try AI translation first if available
        if (CONFIG.useGeminiAI && CONFIG.geminiApiKey) {
            try {
                const aiTranslation = await askGeminiAI(originalText, null, 'Spanish translation');
                if (aiTranslation && aiTranslation !== originalText && aiTranslation.length > 0) {
                    log(`🤖 Gemini translation: "${originalText}" -> "${aiTranslation}"`);
                    return aiTranslation;
                }
            } catch (error) {
                log('❌ AI translation failed, using offline methods:', error.message);
            }
        }
        
        // Step 2: Dictionary lookup
        if (dictionary[cleanText]) {
            log(`📚 Dictionary match: "${cleanText}" -> "${dictionary[cleanText]}"`);
            return dictionary[cleanText];
        }

        if (dictionary[originalText]) {
            log(`📚 Case match: "${originalText}" -> "${dictionary[originalText]}"`);
            return dictionary[originalText];
        }

        // Step 3: Conjugation analysis
        const conjugationResult = analyzeConjugation(originalText);
        if (conjugationResult) {
            log(`🧠 Conjugation analysis: "${originalText}" -> "${conjugationResult.answer}"`);
            return conjugationResult.answer;
        }

        // Step 4: Number conversion
        const numMatch = cleanText.match(/^\d+$/);
        if (numMatch) {
            const num = parseInt(numMatch[0]);
            const wordForm = numberToWords(num);
            if (dictionary[wordForm]) {
                log(`🔢 Number: ${num} -> "${wordForm}" -> "${dictionary[wordForm]}"`);
                return dictionary[wordForm];
            }
        }

        // Step 5: Partial matching
        const words = cleanText.split(/\s+/).filter(word => word.length > 2);
        for (const word of words) {
            if (dictionary[word]) {
                log(`🔤 Word match: "${word}" -> "${dictionary[word]}"`);
                return dictionary[word];
            }
        }

        // Step 6: Fuzzy matching
        for (const [english, spanish] of Object.entries(dictionary)) {
            if (english.length > 3 && cleanText.includes(english.toLowerCase())) {
                log(`🎯 Contains match: "${cleanText}" contains "${english}" -> "${spanish}"`);
                return spanish;
            }
        }

        // Step 7: Try backup translation APIs
        if (CONFIG.useBackupAPIs) {
            try {
                const backupTranslation = await translateWithFreeAPI(originalText);
                if (backupTranslation) {
                    log(`🌐 Backup API translation: "${originalText}" -> "${backupTranslation}"`);
                    return backupTranslation;
                }
            } catch (error) {
                log('❌ Backup translation failed:', error);
            }
        }

        log(`⚠️ No translation found for: "${originalText}"`);
        return null;
    };

    // Free translation API fallback
    const translateWithFreeAPI = async (text, retryCount = 0) => {
        if (retryCount >= CONFIG.maxRetries) return null;

        const apis = [
            // Method 1: Google Translate (unofficial)
            async () => {
                const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(text)}`;
                const response = await fetch(url);
                const data = await response.json();
                return data[0]?.map(item => item[0]).join('').trim();
            },
            // Method 2: LibreTranslate
            async () => {
                const response = await fetch('https://libretranslate.de/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ q: text, source: 'en', target: 'es', format: 'text' })
                });
                const data = await response.json();
                return data.translatedText?.trim();
            },
            // Method 3: MyMemory
            async () => {
                const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|es`;
                const response = await fetch(url);
                const data = await response.json();
                if (data.responseData && !data.responseData.translatedText.includes('MYMEMORY WARNING')) {
                    return data.responseData.translatedText.trim();
                }
                return null;
            }
        ];

        for (let i = 0; i < apis.length; i++) {
            try {
                log(`🌐 Trying backup API ${i + 1} for: "${text}"`);
                const result = await apis[i]();
                if (result && result !== text && result.length > 0) {
                    log(`✅ Backup API ${i + 1} success: "${text}" -> "${result}"`);
                    return result;
                }
            } catch (error) {
                log(`❌ Backup API ${i + 1} failed:`, error.message);
                continue;
            }
        }

        // Retry with exponential backoff
        if (retryCount < CONFIG.maxRetries) {
            await sleep(1000 * Math.pow(2, retryCount));
            return translateWithFreeAPI(text, retryCount + 1);
        }

        return null;
    };

    // Enhanced question detection
    const findMultipleChoiceQuestions = () => {
        const mcQuestions = [];
        
        // Look for radio button groups
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        const radioGroups = {};
        
        // Group radio buttons by name
        radioButtons.forEach(radio => {
            const name = radio.name;
            if (!radioGroups[name]) {
                radioGroups[name] = [];
            }
            radioGroups[name].push(radio);
        });
        
        // Process each radio group
        Object.entries(radioGroups).forEach(([groupName, radios]) => {
            const question = {
                type: 'multiple_choice',
                groupName,
                radios,
                choices: [],
                questionText: '',
                container: null
            };
            
            // Find the question container
            const firstRadio = radios[0];
            const container = firstRadio.closest('li, tr, div, .question, [class*="question"]') || firstRadio.parentElement;
            question.container = container;
            
            // Extract question text
            if (container) {
                const clone = container.cloneNode(true);
                clone.querySelectorAll('input, button').forEach(el => el.remove());
                question.questionText = clone.textContent.replace(/\s+/g, ' ').trim();
            }
            
            // Extract choices
            radios.forEach(radio => {
                const choiceContainer = radio.closest('tr, td, div, span') || radio.parentElement;
                if (choiceContainer) {
                    const clone = choiceContainer.cloneNode(true);
                    clone.querySelectorAll('input').forEach(el => el.remove());
                    const choiceText = clone.textContent.replace(/\s+/g, ' ').trim();
                    
                    question.choices.push({
                        radio,
                        text: choiceText,
                        value: radio.value
                    });
                }
            });
            
            if (question.questionText && question.choices.length > 0) {
                mcQuestions.push(question);
            }
        });
        
        log(`🔍 Found ${mcQuestions.length} multiple choice questions`);
        return mcQuestions;
    };

    const findTextInputQuestions = () => {
        const selectors = [
            'input[type="text"]',
            'textarea',
            'input[type="search"]',
            '.question input',
            '.quiz-question input',
            '[class*="question"] input[type="text"]',
            '[class*="answer"] input[type="text"]',
            'tr input[type="text"]',
            'td input[type="text"]',
            'li input[type="text"]',
            'ol input[type="text"]',
            'ul input[type="text"]'
        ];

        const foundInputs = [];
        const seenInputs = new Set();

        for (const selector of selectors) {
            const inputs = document.querySelectorAll(selector);
            for (const input of inputs) {
                if (!seenInputs.has(input) && input.offsetParent !== null) {
                    seenInputs.add(input);
                    foundInputs.push({
                        type: 'text_input',
                        input,
                        container: input.closest('li, tr, td, div, .question, [class*="question"], [class*="quiz"]') || input.parentElement
                    });
                }
            }
        }

        log(`🔍 Found ${foundInputs.length} text input fields`);
        return foundInputs;
    };

    // Enhanced number conversion
    const numberToWords = (num) => {
        const ones = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
        const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        
        if (num >= 0 && num <= 9) return ones[num];
        if (num >= 10 && num <= 19) return teens[num - 10];
        if (num >= 20 && num <= 99) {
            const tensDigit = Math.floor(num / 10);
            const onesDigit = num % 10;
            return onesDigit === 0 ? tens[tensDigit] : `${tens[tensDigit]}-${ones[onesDigit]}`;
        }
        if (num === 100) return 'one hundred';
        return num.toString();
    };

    // Extract question text
    const extractQuestionText = (container, input) => {
        if (!container) return '';
        
        const clone = container.cloneNode(true);
        
        const elementsToRemove = clone.querySelectorAll('input, textarea, select, button, .btn, [class*="score"], [class*="point"], [class*="timer"]');
        elementsToRemove.forEach(el => el.remove());
        
        let text = clone.textContent || clone.innerText || '';
        
        text = text
            .replace(/\s+/g, ' ')
            .replace(/^\d+[\.\)]\s*/, '')
            .replace(/^[A-Z][\.\)]\s*/, '')
            .replace(/Score.*$/i, '')
            .trim();
            
        if (text.length < 3 && container.parentElement) {
            return extractQuestionText(container.parentElement, input);
        }
        
        return text;
    };

    // Process multiple choice questions
    const processMultipleChoiceQuestion = async (mcQuestion) => {
        mcProcessedCount++;
        
        const isAnswered = mcQuestion.radios.some(radio => radio.checked);
        if (CONFIG.skipFilledInputs && isAnswered) {
            log(`⏭️ Skipping already answered MC question ${mcProcessedCount}`);
            return false;
        }
        
        log(`🔄 Processing AI MC question ${mcProcessedCount}: "${mcQuestion.questionText}"`);
        
        const result = await findBestMultipleChoiceAnswer(mcQuestion.questionText, mcQuestion.choices);
        
        if (result && result.confidence >= CONFIG.mcConfidenceThreshold) {
            result.choice.radio.checked = true;
            result.choice.radio.dispatchEvent(new Event('change', { bubbles: true }));
            result.choice.radio.dispatchEvent(new Event('click', { bubbles: true }));
            
            mcSuccessCount++;
            showVisualFeedback(result.choice.radio.parentElement, true, result.choice.text);
            
            log(`✅ MC Success: Selected "${result.choice.text}" (confidence: ${(result.confidence * 100).toFixed(1)}%, reason: ${result.reason})`);
            return true;
        } else {
            showVisualFeedback(mcQuestion.container, false);
            log(`❌ MC Failed: No confident answer found for "${mcQuestion.questionText}"`);
            return false;
        }
    };

    // Process text input questions
    const processTextInputQuestion = async (question) => {
        const { input, container } = question;
        
        if (CONFIG.skipFilledInputs && input.value.trim()) {
            log(`⏭️ Skipping filled input: "${input.value}"`);
            return false;
        }

        const questionText = extractQuestionText(container, input);
        processedCount++;
        
        if (!questionText || questionText.length < 2) {
            log(`⚠️ No question text found for input ${processedCount}`);
            return false;
        }

        log(`🔄 Processing AI text input ${processedCount}: "${questionText}"`);
        
        const translation = await translateText(questionText);
        
        if (translation && translation.length > 0) {
            input.value = translation;
            successCount++;
            showVisualFeedback(input, true, translation);
            
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            
            log(`✅ Text Success: "${questionText}" -> "${translation}"`);
            return true;
        } else {
            showVisualFeedback(input, false);
            log(`❌ Text Failed to translate: "${questionText}"`);
            return false;
        }
    };

    // Progress display
    const updateProgress = () => {
        const progressDiv = document.getElementById('solver-progress');
        if (CONFIG.enableLogging) {
            const textPercentage = processedCount > 0 ? Math.round((successCount / processedCount) * 100) : 0;
            const mcPercentage = mcProcessedCount > 0 ? Math.round((mcSuccessCount / mcProcessedCount) * 100) : 0;
            const statusText = `T:${successCount}/${processedCount} MC:${mcSuccessCount}/${mcProcessedCount}`;
            log(`📊 AI Progress: Text: ${successCount}/${processedCount} (${textPercentage}%), MC: ${mcSuccessCount}/${mcProcessedCount} (${mcPercentage}%)`);
            if (progressDiv) progressDiv.textContent = statusText;
        }
    };

    // Main processing function
    const processAllQuestions = async () => {
        if (isProcessing) {
            log('⚠️ Already processing questions...');
            return;
        }

        isProcessing = true;
        processedCount = 0;
        successCount = 0;
        mcProcessedCount = 0;
        mcSuccessCount = 0;
        
        try {
            log('🚀 Starting AI-enhanced Spanish quiz solver...');
            
            // API key is already loaded from the embedded script
            log('🔑 Using embedded API key');
            
            // Process text input questions
            const textQuestions = findTextInputQuestions();
            for (const question of textQuestions) {
                await processTextInputQuestion(question);
                await sleep(CONFIG.delayBetweenQuestions);
            }
            
            // Process multiple choice questions
            if (CONFIG.handleMultipleChoice) {
                const mcQuestions = findMultipleChoiceQuestions();
                for (const mcQuestion of mcQuestions) {
                    await processMultipleChoiceQuestion(mcQuestion);
                    await sleep(CONFIG.delayBetweenQuestions);
                }
            }
            
            const totalProcessed = processedCount + mcProcessedCount;
            const totalSuccess = successCount + mcSuccessCount;
            
            updateProgress();
            log(`🎉 AI Analysis Complete! Total: ${totalSuccess}/${totalProcessed} successful answers`);
            
            if (totalProcessed === 0) {
                log('❌ No questions found on this page');
            }
            
        } catch (error) {
            log('❌ Error during AI processing:', error);
        } finally {
            isProcessing = false;
        }
    };

    // Enhanced control panel
    const createControlPanel = () => {
        if (document.getElementById('spanish-solver-controls')) return;
        
        const panel = document.createElement('div');
        panel.id = 'spanish-solver-controls';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #333;
            color: white;
            padding: 8px;
            border: 1px solid #666;
            font-family: monospace;
            font-size: 11px;
            z-index: 10000;
            min-width: 150px;
        `;
        
        const title = document.createElement('div');
        title.textContent = 'AI Spanish Solver';
        title.style.cssText = 'font-weight: bold; margin-bottom: 5px; cursor: move;';
        
        const startBtn = document.createElement('button');
        startBtn.textContent = 'START';
        startBtn.style.cssText = 'width: 100%; margin: 2px 0; padding: 4px; border: 1px solid #666; background: #444; color: white; cursor: pointer;';
        startBtn.onclick = processAllQuestions;
        
        const aiToggleBtn = document.createElement('button');
        aiToggleBtn.textContent = `AI: ${CONFIG.useGeminiAI ? 'ON' : 'OFF'}`;
        aiToggleBtn.style.cssText = 'width: 48%; margin: 1px; padding: 3px; border: 1px solid #666; background: #444; color: white; cursor: pointer; font-size: 10px;';
        aiToggleBtn.onclick = () => {
            CONFIG.useGeminiAI = !CONFIG.useGeminiAI;
            aiToggleBtn.textContent = `AI: ${CONFIG.useGeminiAI ? 'ON' : 'OFF'}`;
        };
        
        const autoSubmitBtn = document.createElement('button');
        autoSubmitBtn.textContent = `AUTO: ${CONFIG.enableAutoSubmit ? 'ON' : 'OFF'}`;
        autoSubmitBtn.style.cssText = 'width: 48%; margin: 1px; padding: 3px; border: 1px solid #666; background: #444; color: white; cursor: pointer; font-size: 10px;';
        autoSubmitBtn.onclick = () => {
            CONFIG.enableAutoSubmit = !CONFIG.enableAutoSubmit;
            autoSubmitBtn.textContent = `AUTO: ${CONFIG.enableAutoSubmit ? 'ON' : 'OFF'}`;
        };
        
        const apiKeyBtn = document.createElement('button');
        apiKeyBtn.textContent = 'SET KEY';
        apiKeyBtn.style.cssText = 'width: 100%; margin: 2px 0; padding: 4px; border: 1px solid #666; background: #444; color: white; cursor: pointer;';
        apiKeyBtn.onclick = async () => {
            const newKey = prompt('Enter Gemini API key:', CONFIG.geminiApiKey);
            if (newKey && newKey.trim()) {
                CONFIG.geminiApiKey = newKey.trim();
                statusDiv.textContent = 'AI Ready';
                log('✅ API key updated');
            }
        };
        
        const statusDiv = document.createElement('div');
        statusDiv.id = 'solver-status';
        statusDiv.style.cssText = 'font-size: 10px; margin-top: 3px; padding: 2px; border: 1px solid #666; background: #222; text-align: center;';
        statusDiv.textContent = CONFIG.geminiApiKey ? 'AI Ready' : 'Offline';
        
        const progressDiv = document.createElement('div');
        progressDiv.id = 'solver-progress';
        progressDiv.style.cssText = 'font-size: 9px; margin-top: 2px; color: #ccc;';
        progressDiv.textContent = 'Ready';
        
        panel.appendChild(title);
        panel.appendChild(startBtn);
        
        const toggleRow = document.createElement('div');
        toggleRow.appendChild(aiToggleBtn);
        toggleRow.appendChild(autoSubmitBtn);
        panel.appendChild(toggleRow);
        
        panel.appendChild(apiKeyBtn);
        panel.appendChild(statusDiv);
        panel.appendChild(progressDiv);
        document.body.appendChild(panel);
        
        // Simple drag functionality
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        title.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = panel.offsetLeft;
            startTop = panel.offsetTop;
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (startLeft + e.clientX - startX) + 'px';
            panel.style.top = (startTop + e.clientY - startY) + 'px';
            panel.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => isDragging = false);
    };

    // Auto-submit function
    const handleAutoSubmit = async () => {
        if (!CONFIG.enableAutoSubmit) return;
        
        await sleep(CONFIG.submitDelay);
        
        const submitButtons = document.querySelectorAll('button[type="submit"], input[type="submit"], .submit-btn, [class*="submit"]');
        if (submitButtons.length > 0) {
            log('🔄 Auto-submitting form...');
            submitButtons[0].click();
        }
    };

    // Initialize
    const init = async () => {
        log('🎯 AI-Enhanced Spanish Quiz Solver loaded!');
        log('📚 Dictionary contains', Object.keys(dictionary).length, 'entries');
        log('🧠 Conjugation knowledge base loaded');
        
        createControlPanel();
        
        // Load API key from embedded script (no CORS issues)
        const keyLoaded = loadFromGitHubScript();
        const statusDiv = document.getElementById('solver-status');
        if (statusDiv) {
            statusDiv.textContent = keyLoaded ? 'AI Ready' : 'Offline';
        }
        
        // Auto-start after page load if enabled
        if (CONFIG.enableAutoSubmit && document.readyState === 'complete') {
            setTimeout(processAllQuestions, 3000);
        } else {
            window.addEventListener('load', () => {
                setTimeout(processAllQuestions, 3000);
            });
        }
        
        // Expose functions globally for debugging
        window.spanishAISolver = {
            start: processAllQuestions,
            translateText,
            findQuestions: () => ({ 
                text: findTextInputQuestions(), 
                mc: findMultipleChoiceQuestions() 
            }),
            askAI: askGeminiAI,
            config: CONFIG,
            dictionary,
            conjugationKnowledge: conjugationKnowledgeBase,
            setApiKey: (key) => {
                CONFIG.geminiApiKey = key;
                log('✅ API key set via console');
                const statusDiv = document.getElementById('solver-status');
                if (statusDiv) statusDiv.textContent = 'AI Ready';
            }
        };
    };

    // Start the AI solver
    init();

})();
