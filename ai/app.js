import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.0';

// Environment setup
env.allowLocalModels = false;
env.useBrowserCache = true;

// Global state
let generator = null;
let chatHistory = [];
let abortController = null;
let isGenerating = false;

// UI elements
const chatEl = document.getElementById('chat');
const inputEl = document.getElementById('prompt');
const sendBtn = document.getElementById('sendBtn');
const stopBtn = document.getElementById('stopBtn');
const statusEl = document.getElementById('status');

// Chart setup
const ctx = document.getElementById('velocityChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: { 
        labels: Array(60).fill(''), 
        datasets: [{ 
            label: 'Activity', 
            data: Array(60).fill(0), 
            borderColor: '#00f0ff', 
            backgroundColor: 'rgba(0, 240, 255, 0.1)', 
            borderWidth: 2, 
            tension: 0.4,
            pointRadius: 0, 
            fill: true 
        }]
    },
    options: { 
        responsive: true, 
        maintainAspectRatio: false,
        animation: false,
        scales: { 
            y: { 
                beginAtZero: true, 
                max: 2.5, 
                grid: { color: '#222' }, 
                ticks: { display: false } 
            }, 
            x: { display: false } 
        }, 
        plugins: { legend: { display: false } } 
    }
});

// Utility functions
function addMessage(text, className) {
    const div = document.createElement('div');
    div.className = `message ${className}`;
    div.textContent = text;
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
    return div;
}

function updateChart(value) {
    const data = chart.data.datasets[0].data;
    data.shift();
    data.push(value);
    
    // Visual effect for high activity
    if (value > 1.2) {
        chart.data.datasets[0].borderColor = '#ff3333';
        chart.data.datasets[0].backgroundColor = 'rgba(255, 50, 50, 0.2)';
    } else {
        chart.data.datasets[0].borderColor = '#00f0ff';
        chart.data.datasets[0].backgroundColor = 'rgba(0, 240, 255, 0.1)';
    }
    chart.update();
}

function updateStatus(text, color = '#00f0ff') {
    statusEl.textContent = text;
    statusEl.style.borderColor = color;
}

function toggleButtons(generating) {
    isGenerating = generating;
    sendBtn.style.display = generating ? 'none' : 'block';
    stopBtn.classList.toggle('active', generating);
    inputEl.disabled = generating;
}

// Model initialization
async function initAI() {
    try {
        updateStatus('Loading Model...', '#ffaa00');
        
        // Use smaller model for mobile compatibility
        // Options: 'Xenova/Qwen1.5-0.5B-Chat' or 'Xenova/TinyLlama-1.1B-Chat-v1.0'
        generator = await pipeline('text-generation', 'Xenova/Qwen1.5-0.5B-Chat', {
            quantized: true, // Use quantized version for smaller size
        });
        
        sendBtn.disabled = false;
        sendBtn.textContent = 'SEND';
        updateStatus('ONLINE', '#00ff00');
        addMessage('DeepDrift node online. Neural link established.', 'ai-msg');
        
    } catch (error) {
        console.error('Initialization error:', error);
        updateStatus('ERROR', '#ff0000');
        
        let errorMsg = 'Failed to load AI model. ';
        
        if (!navigator.gpu) {
            errorMsg += 'WebGPU not supported. Try Chrome/Edge on desktop or Android.';
        } else {
            errorMsg += error.message;
        }
        
        addMessage(errorMsg, 'ai-msg');
    }
}

// Build chat prompt
function buildPrompt(userText) {
    // Qwen chat format
    let prompt = '<|im_start|>system\nYou are a helpful AI assistant.<|im_end|>\n';
    
    // Include last 3 messages for context
    const recentHistory = chatHistory.slice(-3);
    for (const msg of recentHistory) {
        prompt += `<|im_start|>${msg.role}\n${msg.content}<|im_end|>\n`;
    }
    
    prompt += `<|im_start|>user\n${userText}<|im_end|>\n<|im_start|>assistant\n`;
    return prompt;
}

// Run inference
async function runInference() {
    const userText = inputEl.value.trim();
    if (!userText || !generator || isGenerating) return;
    
    // Clear input and update UI
    inputEl.value = '';
    toggleButtons(true);
    
    // Add user message
    addMessage(userText, 'user-msg');
    const aiMsgDiv = addMessage('Thinking...', 'ai-msg');
    
    // Save to history
    chatHistory.push({ role: 'user', content: userText });
    
    // Create abort controller
    abortController = new AbortController();
    
    try {
        const prompt = buildPrompt(userText);
        let generatedText = '';
        let tokenCount = 0;
        
        // Generate response
        const output = await generator(prompt, {
            max_new_tokens: 200,
            temperature: 0.7,
            do_sample: true,
            top_k: 50,
            top_p: 0.9,
            repetition_penalty: 1.1,
            callback_function: (beams) => {
                if (abortController.signal.aborted) {
                    throw new Error('Generation stopped by user');
                }
                
                tokenCount++;
                
                // Simulate neural activity visualization
                const entropy = Math.random() * 0.5;
                const activity = Math.min(2.5, entropy + (tokenCount % 10) / 10);
                updateChart(activity);
            }
        });
        
        generatedText = output[0].generated_text;
        
        // Update message
        aiMsgDiv.textContent = generatedText;
        chatHistory.push({ role: 'assistant', content: generatedText });
        
    } catch (error) {
        console.error('Generation error:', error);
        
        if (error.message === 'Generation stopped by user') {
            aiMsgDiv.textContent += ' [STOPPED]';
        } else {
            aiMsgDiv.textContent = `Error: ${error.message}`;
        }
    } finally {
        toggleButtons(false);
        abortController = null;
    }
}

// Stop generation
function stopInference() {
    if (abortController) {
        abortController.abort();
    }
}

// Event listeners
sendBtn.addEventListener('click', runInference);
stopBtn.addEventListener('click', stopInference);

inputEl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !sendBtn.disabled && !isGenerating) {
        runInference();
    }
});

// Handle visibility change (pause chart when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        chart.options.animation = false;
    } else {
        chart.update();
    }
});

// Initialize on load
initAI();

// Export for inline handlers (if needed)
window.runInference = runInference;
window.stopInference = stopInference;
