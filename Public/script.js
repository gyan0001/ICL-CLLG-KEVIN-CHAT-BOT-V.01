// Enhanced Kevin AI Assistant with FIXED chat sending
class KevinAssistant {
    constructor() {
        this.sessionId = null;
        this.isTyping = false;
        this.messageHistory = [];
        this.init();
    }

    async init() {
        console.log('🤖 Kevin AI Assistant Initializing...');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            await this.setup();
        }
    }

    async setup() {
        // Start chat session
        await this.startSession();
        
        // Setup ALL event listeners
        this.setupEventListeners();
        
        // Load course data
        await this.loadCourseData();
        
        console.log('✅ Kevin is ready to chat!');
    }

    async startSession() {
        try {
            const response = await fetch('/api/start-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            this.sessionId = data.sessionId;
            this.showMessage('bot', data.greeting);
            console.log('✅ Session started:', this.sessionId);
        } catch (error) {
            console.error('Session error:', error);
            this.sessionId = 'fallback_' + Date.now();
            this.showMessage('bot', "Kia ora! I'm Kevin, your ICL BBIS assistant. Ask me anything! 🎓");
        }
    }

    async loadCourseData() {
        try {
            const response = await fetch('/api/course-data');
            this.courseData = await response.json();
            this.renderCurriculum();
            this.renderCareers();
            console.log('✅ Course data loaded');
        } catch (error) {
            console.error('Data load error:', error);
        }
    }

    renderCurriculum() {
        const container = document.querySelector('.curriculum-content');
        if (!container || !this.courseData) return;

        let html = `
            <div id="year1Content" class="year-content active">
                <div class="semester-section">
                    <h3 class="semester-title"><i class="fas fa-book"></i> Level 5 Papers (Foundation)</h3>
                    <div class="subjects-grid">
                        ${this.renderPapers(this.courseData.level5)}
                    </div>
                </div>
                
                <div class="semester-section">
                    <h3 class="semester-title"><i class="fas fa-book-open"></i> Level 6 Papers (Intermediate)</h3>
                    <div class="subjects-grid">
                        ${this.renderPapers(this.courseData.level6)}
                    </div>
                </div>
            </div>
            
            <div id="year2Content" class="year-content" style="display:none;">
                <div class="semester-section">
                    <h3 class="semester-title"><i class="fas fa-graduation-cap"></i> Level 7 Papers (Advanced)</h3>
                    <div class="subjects-grid">
                        ${this.renderPapers(this.courseData.level7)}
                    </div>
                </div>
                
                <div class="completion-section">
                    <div class="completion-card">
                        <h4>🎯 Ready for Your Career!</h4>
                        <p>Upon completing all 23 papers, you'll have:</p>
                        <ul>
                            <li>360 credits toward your NZQA Level 7 degree</li>
                            <li>Skills across IT, Business, and Analytics</li>
                            <li>A complete industry project portfolio</li>
                            <li>Readiness for 10+ high-demand careers</li>
                        </ul>
                        <button class="btn-primary" onclick="kevin.openChat()">
                            <i class="fas fa-comments"></i> Ask Kevin About Careers
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
    }

    renderPapers(levelData) {
        return Object.values(levelData).map(paper => `
            <div class="subject-card" onclick="kevin.askAboutPaper('${paper.code}')">
                <div class="subject-code">${paper.code}</div>
                <h4>${paper.name}</h4>
                <p>${paper.description.substring(0, 100)}...</p>
                <div class="subject-meta">
                    <span class="subject-credits">${paper.credits} credits</span>
                    <span class="subject-level">Level ${paper.level}</span>
                </div>
                <div class="subject-hover-hint">
                    <i class="fas fa-robot"></i> Click to ask Kevin
                </div>
            </div>
        `).join('');
    }

    renderCareers() {
        const container = document.querySelector('.careers-grid');
        if (!container || !this.courseData?.careers) return;

        container.innerHTML = this.courseData.careers.map(career => `
            <div class="career-card">
                <h3><i class="fas fa-briefcase"></i> ${career.role}</h3>
                <div class="career-salary">💰 ${career.salary}</div>
                <p>${career.description}</p>
                <div class="career-papers">
                    <strong>Key Papers:</strong>
                    <div class="paper-tags">
                        ${career.requiredPapers.map(code => 
                            `<span class="paper-tag" onclick="kevin.askAboutPaper('${code}')">${code}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="career-skills">
                    ${career.keySkills.map(skill => 
                        `<span class="skill-tag">${skill}</span>`
                    ).join('')}
                </div>
                <button class="ask-career-btn" onclick="kevin.askAboutCareer('${career.role}')">
                    <i class="fas fa-robot"></i> Ask Kevin
                </button>
            </div>
        `).join('');
    }

    setupEventListeners() {
        console.log('🎯 Setting up event listeners...');
        
        // Chat toggle buttons - multiple ways to open
        const chatButtons = [
            'chatToggle',
            'openChatBtn',
            'heroChatBtn',
            'footerChatBtn',
            'openChatMobile'
        ];
        
        chatButtons.forEach(id => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openChat();
                });
            }
        });
        
        // Close chat button
        const closeChatBtn = document.getElementById('closeChatBtn');
        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeChat();
            });
        }
        
        // CRITICAL FIX: Send button with proper event handling
        const sendBtn = document.getElementById('sendBtn');
        const chatInput = document.getElementById('chatInput');
        
        if (sendBtn) {
            // Remove any existing listeners
            sendBtn.replaceWith(sendBtn.cloneNode(true));
            const newSendBtn = document.getElementById('sendBtn');
            
            newSendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('📤 Send button clicked');
                this.sendMessage();
            });
            console.log('✅ Send button listener attached');
        }
        
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    console.log('⌨️ Enter key pressed');
                    this.sendMessage();
                }
            });
            
            // Auto-resize on input
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = chatInput.scrollHeight + 'px';
            });
            console.log('✅ Chat input listener attached');
        }
        
        // Quick action buttons
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const question = btn.getAttribute('data-question');
                if (question && chatInput) {
                    chatInput.value = question;
                    this.sendMessage();
                }
            });
        });
        
        // Curriculum tabs
        document.querySelectorAll('.curriculum-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const year = tab.getAttribute('data-year');
                this.switchYear(year);
                document.querySelectorAll('.curriculum-tab').forEach(t => 
                    t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
        
        // Mobile menu
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const closeMenuBtn = document.getElementById('closeMenuBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.add('active');
            });
        }
        
        if (closeMenuBtn && mobileMenu) {
            closeMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                mobileMenu.classList.remove('active');
            });
        }
        
        // Mobile menu links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu) mobileMenu.classList.remove('active');
            });
        });
        
        // Smooth scroll for all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;
                
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 80;
                    const targetPosition = targetElement.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    if (mobileMenu) mobileMenu.classList.remove('active');
                }
            });
        });
        
        console.log('✅ All event listeners set up');
    }

    async sendMessage() {
        console.log('📨 sendMessage() called');
        
        const input = document.getElementById('chatInput');
        if (!input) {
            console.error('❌ Chat input not found');
            return;
        }
        
        const message = input.value.trim();
        console.log('📝 Message:', message);
        
        if (!message) {
            console.log('⚠️ Empty message');
            return;
        }
        
        if (this.isTyping) {
            console.log('⏳ Already processing...');
            return;
        }
        
        // Show user message immediately
        this.showMessage('user', message);
        input.value = '';
        input.style.height = 'auto';
        
        // Show typing indicator
        this.showTyping(true);
        
        try {
            console.log('🔄 Sending to server...');
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    sessionId: this.sessionId
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('✅ Response received:', data);
            
            // Hide typing
            this.showTyping(false);
            
            // Show bot response
            if (data.reply) {
                // Small delay for natural feel
                setTimeout(() => {
                    this.showMessage('bot', data.reply);
                }, 300);
            } else {
                this.showMessage('bot', "Sorry, I didn't get a proper response. Please try again!");
            }
            
        } catch (error) {
            console.error('❌ Chat error:', error);
            this.showTyping(false);
            this.showMessage('bot', "Oops! I'm having trouble connecting. Please check your connection and try again. 🔄");
        }
    }

    showMessage(sender, text) {
        const container = document.getElementById('chatMessages');
        if (!container) {
            console.error('❌ Chat messages container not found');
            return;
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}`;
        
        // Format the message
        let formatted = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br>')
            .replace(/• /g, '<br>• ')
            .replace(/(\d{4})/g, '<code>$1</code>'); // Highlight paper codes
        
        messageDiv.innerHTML = `
            <div class="message-content">
                ${formatted}
            </div>
        `;
        
        container.appendChild(messageDiv);
        
        // Smooth scroll to bottom
        requestAnimationFrame(() => {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: 'smooth'
            });
        });
        
        // Store in history
        this.messageHistory.push({ sender, text, timestamp: Date.now() });
    }
    openChat() {
    console.log('💬 Opening chat window');
    const chatWindow = document.getElementById('chatWindow');
    const chatToggle = document.getElementById('chatToggle');
    const quickActions = document.querySelector('.chat-quick-actions');
    
    if (chatWindow) {
        chatWindow.classList.add('active');
        
        // SHOW QUICK ACTIONS WHEN OPENING CHAT
        if (quickActions && this.messageHistory.length <= 1) {
            quickActions.style.display = 'block';
        }
        
        // Focus input after animation
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) {
                input.focus();
            }
            this.scrollToBottom();
        }, 300);
    }
    
    if (chatToggle) {
        chatToggle.style.display = 'none';
    }
}

    showTyping(show) {
        this.isTyping = show;
        
        const indicator = document.getElementById('typingIndicator');
        const input = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (indicator) {
            indicator.style.display = show ? 'flex' : 'none';
        }
        
        if (input) {
            input.disabled = show;
        }
        
        if (sendBtn) {
            sendBtn.disabled = show;
            sendBtn.style.opacity = show ? '0.5' : '1';
        }
    }


    closeChat() {
        console.log('❌ Closing chat window');
        const chatWindow = document.getElementById('chatWindow');
        const chatToggle = document.getElementById('chatToggle');
        
        if (chatWindow) {
            chatWindow.classList.remove('active');
        }
        
        if (chatToggle) {
            chatToggle.style.display = 'flex';
        }
    }

    askAboutPaper(paperCode) {
        console.log('📚 Asking about paper:', paperCode);
        this.openChat();
        
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) {
                input.value = `Tell me about paper ${paperCode}`;
                this.sendMessage();
            }
        }, 400);
    }

    askAboutCareer(career) {
        console.log('💼 Asking about career:', career);
        this.openChat();
        
        setTimeout(() => {
            const input = document.getElementById('chatInput');
            if (input) {
                input.value = `What do I need to study to become a ${career}?`;
                this.sendMessage();
            }
        }, 400);
    }

    switchYear(year) {
        const year1 = document.getElementById('year1Content');
        const year2 = document.getElementById('year2Content');
        
        if (year === '1') {
            if (year1) year1.style.display = 'block';
            if (year2) year2.style.display = 'none';
        } else {
            if (year1) year1.style.display = 'none';
            if (year2) year2.style.display = 'block';
        }
    }

    scrollToBottom() {
        const container = document.getElementById('chatMessages');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }
}

// Initialize Kevin when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM loaded, initializing Kevin...');
        window.kevin = new KevinAssistant();
    });
} else {
    console.log('📄 DOM already loaded, initializing Kevin...');
    window.kevin = new KevinAssistant();
}

// Debug helper
window.testKevin = function(msg = 'Hello Kevin!') {
    console.log('🧪 Testing Kevin with message:', msg);
    const input = document.getElementById('chatInput');
    if (input && window.kevin) {
        input.value = msg;
        window.kevin.sendMessage();
    } else {
        console.error('❌ Kevin not ready or input not found');
    }
};

console.log('✅ Kevin script loaded successfully!');
