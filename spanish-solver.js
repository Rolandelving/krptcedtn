// Spanish Quiz Solver for Quia.com
// Advanced Educational Tool with AI Integration

(function() {
    'use strict';
    
    // Configuration
    const CONFIG = {
        GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY_HERE', // Replace with actual API key
        GEMINI_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
        PROCESSING_DELAY: 400,
        AI_TIMEOUT: 5000,
        MAX_RETRIES: 3
    };
    
    // Spanish Language Knowledge Base
    const SPANISH_KB = {
        conjugationRules: {
            'first step to conjugation': 'drop the ending',
            'second step to conjugation': 'add the new ending',
            'infinitive ending': ['-ar', '-er', '-ir'],
            'conjugation process': ['drop the ending', 'add new ending', 'identify the stem']
        },
        
        commonVerbs: {
            'ser': 'to be (permanent)',
            'estar': 'to be (temporary)',
            'tener': 'to have',
            'hacer': 'to do/make',
            'ir': 'to go',
            'poder': 'to be able',
            'querer': 'to want',
            'decir': 'to say',
            'venir': 'to come',
            'dar': 'to give'
        },
        
        vocabulary: {
            school: {
                'mathematics': 'matemáticas',
                'chemistry': 'química',
                'science': 'ciencia',
                'geography': 'geografía',
                'history': 'historia',
                'library': 'biblioteca',
                'cafeteria': 'cafetería',
                'gymnasium': 'gimnasio',
                'laboratory': 'laboratorio',
                'classroom': 'aula'
            },
            
            numbers: {
                'zero': 'cero', 'one': 'uno', 'two': 'dos', 'three': 'tres',
                'four': 'cuatro', 'five': 'cinco', 'six': 'seis', 'seven': 'siete',
                'eight': 'ocho', 'nine': 'nueve', 'ten': 'diez'
            }
        },
        
        grammarPatterns: {
            articles: {
                'definite': ['el', 'la', 'los', 'las'],
                'indefinite': ['un', 'una', 'unos', 'unas']
            },
            
            questionWords: {
                'what': 'qué', 'when': 'cuándo', 'where': 'dónde',
                'who': 'quién', 'why': 'por qué', 'how': 'cómo',
                'which': 'cuál', 'how much': 'cuánto'
            }
        }
    };
    
    // Main Quiz Solver Class
    class SpanishQuizSolver {
        constructor() {
            this.isProcessing = false;
            this.useAI = true;
            this.autoSubmit = false;
            this.testMode = false; // Safe testing without clicking
            this.stats = { total: 0, answered: 0, aiUsed: 0 };
            this.controlPanel = null;
            
            this.init();
        }
        
        init() {
            this.createControlPanel();
            this.scanForQuestions();
            
            // Test API key on startup if configured
            if (CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
                setTimeout(() => this.testApiKey(), 1000);
            }
        }
        
        // Control Panel UI
        createControlPanel() {
            const panel = document.createElement('div');
            panel.id = 'spanish-solver-panel';
            panel.innerHTML = `
                <div style="
                    position: fixed;
                    top: 10px;
                    right: 10px;
                    background: #2c3e50;
                    color: white;
                    padding: 15px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    z-index: 10000;
                    min-width: 200px;
                    cursor: move;
                ">
                    <div style="font-weight: bold; margin-bottom: 10px; text-align: center;">
                        🇪🇸 Spanish Solver
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        Status: <span id="solver-status" style="color: #2ecc71;">Ready</span>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        Progress: <span id="solver-progress">0/0</span>
                    </div>
                    
                    <div style="display: flex; gap: 5px; margin-bottom: 8px;">
                        <button id="solver-start" style="
                            flex: 1;
                            background: #27ae60;
                            color: white;
                            border: none;
                            padding: 5px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                        ">Start</button>
                        
                        <button id="solver-stop" style="
                            flex: 1;
                            background: #e74c3c;
                            color: white;
                            border: none;
                            padding: 5px;
                            border-radius: 4px;
                            cursor: pointer;
                            font-size: 11px;
                        ">Stop</button>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <label style="display: flex; align-items: center; gap: 5px; font-size: 11px;">
                            <input type="checkbox" id="solver-test-mode"> Test Mode (Safe)
                        </label>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <label style="display: flex; align-items: center; gap: 5px; font-size: 11px;">
                            <input type="checkbox" id="solver-ai" checked> Use AI
                        </label>
                    </div>
                    
                    <div style="margin-bottom: 8px;">
                        <label style="display: flex; align-items: center; gap: 5px; font-size: 11px;">
                            <input type="checkbox" id="solver-auto"> Auto Submit
                        </label>
                    </div>
                    
                    <button id="solver-api-key" style="
                        width: 100%;
                        background: #3498db;
                        color: white;
                        border: none;
                        padding: 5px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 11px;
                    ">Update API Key</button>
                </div>
            `;
            
            document.body.appendChild(panel);
            this.controlPanel = panel;
            this.bindControlEvents();
            this.makeDraggable(panel);
        }
        
        bindControlEvents() {
            document.getElementById('solver-start').addEventListener('click', () => this.startProcessing());
            document.getElementById('solver-stop').addEventListener('click', () => this.stopProcessing());
            document.getElementById('solver-test-mode').addEventListener('change', (e) => this.testMode = e.target.checked);
            document.getElementById('solver-ai').addEventListener('change', (e) => this.useAI = e.target.checked);
            document.getElementById('solver-auto').addEventListener('change', (e) => this.autoSubmit = e.target.checked);
            document.getElementById('solver-api-key').addEventListener('click', () => this.updateApiKey());
        }
        
        makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            element.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.style.top = (element.offsetTop - pos2) + "px";
                element.style.left = (element.offsetLeft - pos1) + "px";
            }
            
            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }
        
        updateApiKey() {
            const newKey = prompt('Enter your Gemini API Key:', CONFIG.GEMINI_API_KEY);
            if (newKey && newKey.trim()) {
                CONFIG.GEMINI_API_KEY = newKey.trim();
                console.log('🔑 API Key updated successfully');
                
                // Test the API key
                this.testApiKey();
                
                this.updateStatus('API Key Updated');
            }
        }
        
        async testApiKey() {
            if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                console.warn('⚠️ No API key configured');
                return;
            }
            
            try {
                console.log('🧪 Testing API key...');
                const testPrompt = 'Say "API test successful" in Spanish.';
                const response = await this.queryGeminiAI(testPrompt);
                
                if (response) {
                    console.log('✅ API key test successful!', response);
                    this.updateStatus('AI Ready');
                } else {
                    console.error('❌ API key test failed - no response');
                    this.updateStatus('AI Error');
                }
            } catch (error) {
                console.error('❌ API key test failed:', error.message);
                this.updateStatus('AI Error');
                
                // Show user-friendly error messages
                if (error.message.includes('403') || error.message.includes('401')) {
                    alert('❌ Invalid API key. Please check your Gemini API key.');
                } else if (error.message.includes('CORS')) {
                    alert('🚫 CORS error. Please host this script on GitHub and use jsDelivr CDN.');
                } else {
                    alert(`❌ AI test failed: ${error.message}`);
                }
            }
        }
        
        // Question Detection and Parsing
        scanForQuestions() {
            const questions = this.findQuiaQuestions();
            this.stats.total = questions.length;
            this.updateProgress();
            
            console.log(`Found ${questions.length} questions on Quia.com`);
            return questions;
        }
        
        findQuiaQuestions() {
            const questions = [];
            
            // Primary: Quia-specific <li><table> structure
            const liElements = document.querySelectorAll('li');
            
            liElements.forEach((li, index) => {
                const table = li.querySelector('table');
                if (table && this.hasRadioInputs(table)) {
                    const questionData = this.parseQuiaQuestion(li, table, index);
                    if (questionData) {
                        questions.push(questionData);
                    }
                }
            });
            
            // Fallback: Generic radio button detection
            if (questions.length === 0) {
                const radioGroups = this.findRadioGroups();
                radioGroups.forEach((group, index) => {
                    const questionData = this.parseGenericQuestion(group, index);
                    if (questionData) {
                        questions.push(questionData);
                    }
                });
            }
            
            return questions;
        }
        
        hasRadioInputs(table) {
            return table.querySelectorAll('input[type="radio"]').length > 0;
        }
        
        parseQuiaQuestion(li, table, index) {
            try {
                // Extract question text (everything before the table)
                const questionText = this.extractQuestionText(li, table);
                
                // Extract choices from table rows
                const choices = this.extractChoicesFromTable(table);
                
                if (!questionText || choices.length === 0) {
                    return null;
                }
                
                return {
                    index,
                    questionText: questionText.trim(),
                    choices,
                    type: 'multiple_choice',
                    element: li,
                    table
                };
            } catch (error) {
                console.error(`Error parsing question ${index}:`, error);
                return null;
            }
        }
        
        extractQuestionText(li, table) {
            const walker = document.createTreeWalker(
                li,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode: (node) => {
                        // Accept text nodes that are not inside the table
                        return !table.contains(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                    }
                }
            );
            
            let questionText = '';
            let node;
            while (node = walker.nextNode()) {
                questionText += node.textContent + ' ';
            }
            
            return this.cleanText(questionText);
        }
        
        extractChoicesFromTable(table) {
            const choices = [];
            const rows = table.querySelectorAll('tr');
            
            rows.forEach((row, index) => {
                const radioInput = row.querySelector('input[type="radio"]');
                const textCell = row.querySelector('td:not(:has(input))');
                
                if (radioInput && textCell) {
                    choices.push({
                        index,
                        value: radioInput.value || index.toString(),
                        text: this.cleanText(textCell.textContent),
                        element: radioInput,
                        id: radioInput.id
                    });
                }
            });
            
            return choices;
        }
        
        findRadioGroups() {
            const groups = {};
            const radioInputs = document.querySelectorAll('input[type="radio"]');
            
            radioInputs.forEach(input => {
                const name = input.name;
                if (!groups[name]) {
                    groups[name] = [];
                }
                groups[name].push(input);
            });
            
            return Object.values(groups);
        }
        
        parseGenericQuestion(radioGroup, index) {
            if (radioGroup.length === 0) return null;
            
            const container = this.findQuestionContainer(radioGroup[0]);
            const questionText = this.extractGenericQuestionText(container, radioGroup);
            
            const choices = radioGroup.map((input, idx) => ({
                index: idx,
                value: input.value || idx.toString(),
                text: this.findChoiceText(input),
                element: input,
                id: input.id
            }));
            
            return {
                index,
                questionText: questionText.trim(),
                choices,
                type: 'multiple_choice',
                element: container
            };
        }
        
        findQuestionContainer(firstRadio) {
            let container = firstRadio.parentElement;
            while (container && container !== document.body) {
                if (container.tagName === 'LI' || container.classList.contains('question')) {
                    break;
                }
                container = container.parentElement;
            }
            return container || firstRadio.parentElement;
        }
        
        extractGenericQuestionText(container, radioGroup) {
            let questionText = container.textContent || '';
            
            // Remove choice text from question
            radioGroup.forEach(input => {
                const choiceText = this.findChoiceText(input);
                questionText = questionText.replace(choiceText, '');
            });
            
            return this.cleanText(questionText);
        }
        
        findChoiceText(input) {
            const nextSibling = input.nextSibling;
            const parentTd = input.closest('td');
            
            if (parentTd && parentTd.nextElementSibling) {
                return parentTd.nextElementSibling.textContent || '';
            }
            
            if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
                return nextSibling.textContent || '';
            }
            
            const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
            return label ? label.textContent.replace(input.value, '').trim() : '';
        }
        
        cleanText(text) {
            return text
                .replace(/\s+/g, ' ')
                .replace(/^\d+\.\s*/, '')
                .replace(/<[^>]*>/g, '')
                .trim();
        }
        
        // AI Integration
        async generateAIPrompt(question) {
            const { questionText, choices, type } = question;
            
            if (type === 'multiple_choice') {
                const choicesText = choices.map((choice, idx) => `${idx + 1}. ${choice.text}`).join('\n');
                
                return `You are a Spanish language expert. Answer this multiple choice question about Spanish grammar, vocabulary, or conjugation.

Question: ${questionText}

Choices:
${choicesText}

Context: Spanish grammar and vocabulary quiz

Please respond with ONLY the number (1, 2, 3, etc.) of the correct answer. Base your answer on proper Spanish grammar rules, conjugation patterns, and language conventions.

If this is about verb conjugation, remember:
- First step is always to drop the infinitive ending (-ar, -er, -ir)
- Then identify the stem/root
- Add appropriate endings based on subject and tense
- Check for irregular patterns

Answer with just the number:`;
            }
            
            return `Translate this to Spanish: "${questionText}"

Respond with ONLY the Spanish translation:`;
        }
        
        async queryGeminiAI(prompt) {
            if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
                throw new Error('API key not configured');
            }
            
            console.log('🤖 Sending AI request...', { prompt: prompt.substring(0, 100) + '...' });
            
            const requestBody = {
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.1,
                    maxOutputTokens: 1000
                }
            };
            
            try {
                const response = await fetch(`${CONFIG.GEMINI_ENDPOINT}?key=${CONFIG.GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestBody)
                });
                
                console.log('🌐 API Response status:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ API Error:', response.status, errorText);
                    throw new Error(`API request failed: ${response.status} - ${errorText}`);
                }
                
                const data = await response.json();
                console.log('📦 API Response data:', data);
                
                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    const result = data.candidates[0].content.parts[0].text.trim();
                    console.log('✅ AI Response:', result);
                    return result;
                }
                
                console.error('❌ Invalid API response structure:', data);
                throw new Error('Invalid API response format');
                
            } catch (error) {
                console.error('❌ AI Request failed:', error);
                
                // Check for specific error types
                if (error.message.includes('CORS')) {
                    console.error('🚫 CORS Error - Try hosting the script on GitHub and using jsDelivr CDN');
                } else if (error.message.includes('403') || error.message.includes('401')) {
                    console.error('🔑 Authentication Error - Check your API key');
                } else if (error.message.includes('429')) {
                    console.error('⏱️ Rate Limited - Wait before trying again');
                }
                
                throw error;
            }
        }
        
        // Answer Processing Pipeline
        async processQuestion(question) {
            this.updateStatus('Processing...');
            
            let answer = null;
            let confidence = 0;
            let method = 'unknown';
            
            try {
                // Method 1: AI Analysis (95% confidence)
                if (this.useAI && CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY_HERE') {
                    try {
                        const prompt = await this.generateAIPrompt(question);
                        const aiResponse = await Promise.race([
                            this.queryGeminiAI(prompt),
                            new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), CONFIG.AI_TIMEOUT))
                        ]);
                        
                        answer = this.parseAIResponse(aiResponse, question);
                        if (answer) {
                            confidence = 95;
                            method = 'AI';
                            this.stats.aiUsed++;
                        }
                    } catch (error) {
                        console.warn('AI processing failed:', error.message);
                    }
                }
                
                // Method 2: Pattern Recognition (85% confidence)
                if (!answer) {
                    answer = this.applyPatternRecognition(question);
                    if (answer) {
                        confidence = 85;
                        method = 'Pattern';
                    }
                }
                
                // Method 3: Dictionary Matching (80% confidence)
                if (!answer) {
                    answer = this.applyDictionaryMatching(question);
                    if (answer) {
                        confidence = 80;
                        method = 'Dictionary';
                    }
                }
                
                // Method 4: Fuzzy Matching (60% confidence)
                if (!answer) {
                    answer = this.applyFuzzyMatching(question);
                    if (answer) {
                        confidence = 60;
                        method = 'Fuzzy';
                    }
                }
                
                // Method 5: Fallback (20% confidence)
                if (!answer) {
                    answer = this.applyFallbackLogic(question);
                    confidence = 20;
                    method = 'Fallback';
                }
                
                if (answer) {
                    this.selectAnswer(question, answer);
                    this.highlightAnsweredQuestion(question.element, confidence);
                    this.stats.answered++;
                }
                
                console.log(`Q${question.index}: ${method} (${confidence}%) - ${answer ? 'SUCCESS' : 'FAILED'}`);
                
            } catch (error) {
                console.error(`Error processing question ${question.index}:`, error);
                this.updateStatus('Error occurred');
            }
            
            this.updateProgress();
        }
        
        parseAIResponse(response, question) {
            // Extract number from AI response
            const match = response.match(/\b(\d+)\b/);
            if (match) {
                const choiceIndex = parseInt(match[1]) - 1;
                if (choiceIndex >= 0 && choiceIndex < question.choices.length) {
                    return question.choices[choiceIndex];
                }
            }
            
            // Try to match response text with choices
            const responseLower = response.toLowerCase();
            for (const choice of question.choices) {
                if (responseLower.includes(choice.text.toLowerCase())) {
                    return choice;
                }
            }
            
            return null;
        }
        
        applyPatternRecognition(question) {
            const questionLower = question.questionText.toLowerCase();
            
            // Conjugation patterns
            for (const [pattern, answer] of Object.entries(SPANISH_KB.conjugationRules)) {
                if (questionLower.includes(pattern)) {
                    if (Array.isArray(answer)) {
                        // Find best matching choice
                        for (const choice of question.choices) {
                            if (answer.some(a => choice.text.toLowerCase().includes(a))) {
                                return choice;
                            }
                        }
                    } else {
                        // Find choice containing the answer
                        for (const choice of question.choices) {
                            if (choice.text.toLowerCase().includes(answer)) {
                                return choice;
                            }
                        }
                    }
                }
            }
            
            // Grammar patterns
            if (questionLower.includes('agreement') || questionLower.includes('gender')) {
                for (const choice of question.choices) {
                    if (choice.text.toLowerCase().includes('gender and number')) {
                        return choice;
                    }
                }
            }
            
            return null;
        }
        
        applyDictionaryMatching(question) {
            const questionLower = question.questionText.toLowerCase();
            
            // Check all vocabulary categories
            for (const [category, words] of Object.entries(SPANISH_KB.vocabulary)) {
                if (typeof words === 'object') {
                    for (const [english, spanish] of Object.entries(words)) {
                        if (questionLower.includes(english)) {
                            // Find choice with Spanish translation
                            for (const choice of question.choices) {
                                if (choice.text.toLowerCase().includes(spanish)) {
                                    return choice;
                                }
                            }
                        }
                    }
                }
            }
            
            // Check common verbs
            for (const [spanish, english] of Object.entries(SPANISH_KB.commonVerbs)) {
                if (questionLower.includes(english) || questionLower.includes(spanish)) {
                    for (const choice of question.choices) {
                        if (choice.text.toLowerCase().includes(spanish)) {
                            return choice;
                        }
                    }
                }
            }
            
            return null;
        }
        
        applyFuzzyMatching(question) {
            // Simple similarity-based matching
            const questionWords = question.questionText.toLowerCase().split(/\s+/);
            let bestChoice = null;
            let bestScore = 0;
            
            for (const choice of question.choices) {
                const choiceWords = choice.text.toLowerCase().split(/\s+/);
                const commonWords = questionWords.filter(word => 
                    choiceWords.some(cWord => cWord.includes(word) || word.includes(cWord))
                );
                
                const score = commonWords.length / Math.max(questionWords.length, choiceWords.length);
                
                if (score > bestScore && score > 0.3) {
                    bestScore = score;
                    bestChoice = choice;
                }
            }
            
            return bestChoice;
        }
        
        applyFallbackLogic(question) {
            // Return the longest/most descriptive answer as last resort
            let bestChoice = null;
            let maxLength = 0;
            
            for (const choice of question.choices) {
                if (choice.text.length > maxLength) {
                    maxLength = choice.text.length;
                    bestChoice = choice;
                }
            }
            
            return bestChoice;
        }
        
        selectAnswer(question, choice) {
            if (choice && choice.element) {
                if (this.testMode) {
                    // Test mode: Just highlight without clicking
                    choice.element.style.background = '#fff3cd';
                    choice.element.style.border = '2px solid #ffc107';
                    choice.element.parentElement.style.background = '#fff3cd';
                    
                    // Add tooltip showing what would be selected
                    choice.element.title = `TEST MODE: Would select "${choice.text}"`;
                    
                    console.log(`TEST MODE - Would select: "${choice.text}" for question: "${question.questionText}"`);
                } else {
                    // Normal mode: Actually select the answer
                    choice.element.checked = true;
                    choice.element.dispatchEvent(new Event('change', { bubbles: true }));
                    choice.element.dispatchEvent(new Event('click', { bubbles: true }));
                }
            }
        }
        
        highlightAnsweredQuestion(element, confidence) {
            if (!element) return;
            
            let color = '#e74c3c'; // Red for low confidence
            if (confidence >= 90) color = '#27ae60'; // Green for high confidence
            else if (confidence >= 70) color = '#f39c12'; // Orange for medium confidence
            
            if (this.testMode) {
                // In test mode, use dashed border to indicate it's a preview
                element.style.border = `2px dashed ${color}`;
                element.title = `TEST MODE: Would answer with ${confidence}% confidence`;
            } else {
                element.style.border = `2px solid ${color}`;
                element.title = `Answered with ${confidence}% confidence`;
            }
            
            element.style.borderRadius = '4px';
        }
        
        // Processing Control
        async startProcessing() {
            if (this.isProcessing) return;
            
            this.isProcessing = true;
            this.updateStatus('Running...');
            
            const questions = this.scanForQuestions();
            
            for (let i = 0; i < questions.length && this.isProcessing; i++) {
                await this.processQuestion(questions[i]);
                
                // Add delay between questions
                if (i < questions.length - 1) {
                    await this.delay(CONFIG.PROCESSING_DELAY);
                }
            }
            
            if (this.isProcessing) {
                this.updateStatus('Completed');
                
                if (this.autoSubmit) {
                    this.tryAutoSubmit();
                }
            }
            
            this.isProcessing = false;
        }
        
        stopProcessing() {
            this.isProcessing = false;
            this.updateStatus('Stopped');
        }
        
        tryAutoSubmit() {
            // Look for common submit button patterns
            const submitButtons = document.querySelectorAll('input[type="submit"], button[type="submit"], button');
            
            for (const button of submitButtons) {
                const text = (button.value || button.textContent || '').toLowerCase();
                if (text.includes('submit') || text.includes('finish') || text.includes('done')) {
                    setTimeout(() => {
                        if (confirm('Auto-submit quiz results?')) {
                            button.click();
                        }
                    }, 1000);
                    break;
                }
            }
        }
        
        // Utility Functions
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        
        updateStatus(status) {
            const statusElement = document.getElementById('solver-status');
            if (statusElement) {
                statusElement.textContent = status;
                statusElement.style.color = status.includes('Error') ? '#e74c3c' : 
                                          status === 'Completed' ? '#27ae60' : '#3498db';
            }
        }
        
        updateProgress() {
            const progressElement = document.getElementById('solver-progress');
            if (progressElement) {
                progressElement.textContent = `${this.stats.answered}/${this.stats.total}`;
            }
        }
        
        // Cleanup
        destroy() {
            if (this.controlPanel) {
                this.controlPanel.remove();
            }
        }
    }
    
    // Initialize the solver
    let solver = null;
    
    // Check if already running
    if (window.spanishQuizSolver) {
        console.log('Spanish Quiz Solver already running. Stopping previous instance...');
        window.spanishQuizSolver.destroy();
    }
    
    // Create new instance
    solver = new SpanishQuizSolver();
    window.spanishQuizSolver = solver;
    
    console.log('Spanish Quiz Solver initialized successfully!');
    console.log('Found', solver.scanForQuestions().length, 'questions');
    
})();
