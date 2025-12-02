 // server.js - Enhanced ICL BBIS AI Assistant Kevin
import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('Public'));

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// COMPLETE Course Data from ICL Website
const courseData = {
    level5: {
        "5101": {
            code: "5101",
            name: "Introduction to Object-Oriented Programming",
            level: 5,
            credits: 15,
            description: "Learn fundamental programming concepts using object-oriented design principles. Master Java or Python to build real-world applications.",
            topics: ["OOP Concepts", "Classes & Objects", "Inheritance", "Polymorphism", "Encapsulation"],
            skills: ["Java/Python Programming", "Problem Solving", "Code Design", "Debugging"],
            careerRelevance: "Essential for Software Developer, Programmer roles",
            assessments: ["Programming Assignments", "Project Work", "Final Exam"]
        },
        "5102": {
            code: "5102",
            name: "Intermediate Object-Oriented Programming",
            level: 5,
            credits: 15,
            description: "Advance your programming skills with complex data structures, algorithms, and design patterns used in professional software development.",
            topics: ["Advanced OOP", "Data Structures", "Algorithms", "Design Patterns", "Code Optimization"],
            skills: ["Advanced Programming", "Algorithm Design", "Software Architecture"],
            careerRelevance: "Required for Systems Developer, Software Engineer positions",
            assessments: ["Complex Projects", "Code Reviews", "Technical Exam"]
        },
        "5103": {
            code: "5103",
            name: "Discrete Mathematics",
            level: 5,
            credits: 15,
            description: "Explore mathematical foundations essential for computer science including logic, sets, relations, functions, and graph theory.",
            topics: ["Logic & Proofs", "Set Theory", "Graph Theory", "Combinatorics", "Boolean Algebra"],
            skills: ["Mathematical Reasoning", "Problem Analysis", "Logical Thinking"],
            careerRelevance: "Foundation for Algorithm Design and Data Science roles",
            assessments: ["Problem Sets", "Proofs", "Written Exam"]
        },
        "5140": {
            code: "5140",
            name: "Information Systems",
            level: 5,
            credits: 15,
            description: "Understand how information systems support business operations and strategic decision-making in modern organizations.",
            topics: ["IS Fundamentals", "System Components", "Business Processes", "IS Strategy", "Digital Transformation"],
            skills: ["Systems Analysis", "Business Understanding", "Strategic Thinking"],
            careerRelevance: "Core for Business Analyst, IS Manager positions",
            assessments: ["Case Studies", "Reports", "Group Project"]
        },
        "5143": {
            code: "5143",
            name: "Introductory Statistics for Business Management",
            level: 5,
            credits: 15,
            description: "Learn statistical methods and data analysis techniques to support business decision-making and performance measurement.",
            topics: ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Regression Analysis", "Data Visualization"],
            skills: ["Statistical Analysis", "Data Interpretation", "Excel/SPSS"],
            careerRelevance: "Essential for Data Analyst, Business Intelligence roles",
            assessments: ["Data Analysis Projects", "Statistical Reports", "Exam"]
        },
        "5200": {
            code: "5200",
            name: "Business Fundamentals",
            level: 5,
            credits: 15,
            description: "Gain comprehensive understanding of core business concepts including management, marketing, finance, and organizational behavior.",
            topics: ["Business Environment", "Management Principles", "Marketing Basics", "Financial Literacy", "Operations"],
            skills: ["Business Acumen", "Strategic Thinking", "Management Fundamentals"],
            careerRelevance: "Foundation for all business-facing IT roles",
            assessments: ["Business Plans", "Case Analysis", "Final Exam"]
        },
        "5201": {
            code: "5201",
            name: "Professional Practice and Communication in Business",
            level: 5,
            credits: 15,
            description: "Develop essential professional skills including business communication, teamwork, presentation, and workplace ethics.",
            topics: ["Business Communication", "Professional Writing", "Presentations", "Teamwork", "Ethics"],
            skills: ["Communication", "Collaboration", "Professionalism", "Report Writing"],
            careerRelevance: "Critical for all professional IT and business roles",
            assessments: ["Presentations", "Professional Portfolio", "Team Projects"]
        },
        "5210": {
            code: "5210",
            name: "Managing Business Operations",
            level: 5,
            credits: 15,
            description: "Learn how to manage and optimize business operations including supply chain, quality management, and process improvement.",
            topics: ["Operations Management", "Supply Chain", "Quality Control", "Process Optimization", "Lean/Six Sigma"],
            skills: ["Operations Analysis", "Process Improvement", "Quality Management"],
            careerRelevance: "Important for Business Process Analyst, Operations Manager roles",
            assessments: ["Operations Analysis", "Improvement Projects", "Exam"]
        },
        "5213": {
            code: "5213",
            name: "New Zealand Business Environment",
            level: 5,
            credits: 15,
            description: "Understand the unique aspects of doing business in New Zealand including legal, economic, and cultural considerations.",
            topics: ["NZ Economy", "Business Law", "Treaty of Waitangi", "Cultural Competency", "Regulatory Environment"],
            skills: ["Cultural Awareness", "Legal Knowledge", "Local Business Understanding"],
            careerRelevance: "Essential for working in NZ business environment",
            assessments: ["Research Reports", "Case Studies", "Presentation"]
        }
    },
    level6: {
        "6101": {
            code: "6101",
            name: "Ethics for the Information Systems Professional",
            level: 6,
            credits: 15,
            description: "Explore ethical challenges in IT including privacy, security, intellectual property, and social responsibility in the digital age.",
            topics: ["IT Ethics", "Privacy & Security", "Intellectual Property", "Professional Conduct", "Social Impact"],
            skills: ["Ethical Reasoning", "Policy Analysis", "Professional Responsibility"],
            careerRelevance: "Critical for all senior IT professionals",
            assessments: ["Ethics Analysis", "Case Studies", "Research Paper"]
        },
        "6104": {
            code: "6104",
            name: "Database Management Systems",
            level: 6,
            credits: 15,
            description: "Master database design, SQL programming, and database administration for enterprise information systems.",
            topics: ["Database Design", "SQL", "Normalization", "Transactions", "Database Administration"],
            skills: ["SQL Programming", "Database Design", "Data Modeling", "Performance Tuning"],
            careerRelevance: "Essential for Database Administrator, Data Engineer roles",
            assessments: ["Database Projects", "SQL Assignments", "Design Project"]
        },
        "6105": {
            code: "6105",
            name: "Web Design and Development",
            level: 6,
            credits: 15,
            description: "Build modern, responsive web applications using HTML5, CSS3, JavaScript, and contemporary frameworks.",
            topics: ["HTML5/CSS3", "JavaScript", "Responsive Design", "Web Frameworks", "UX Design"],
            skills: ["Web Development", "Front-end Programming", "UI/UX Design", "Responsive Design"],
            careerRelevance: "Key for Web Developer, Full-stack Developer positions",
            assessments: ["Website Projects", "Portfolio", "Practical Exam"]
        },
        "6106": {
            code: "6106",
            name: "Information Security Management",
            level: 6,
            credits: 15,
            description: "Learn to protect information systems from cyber threats through security policies, risk management, and security technologies.",
            topics: ["Cybersecurity", "Risk Management", "Security Policies", "Cryptography", "Incident Response"],
            skills: ["Security Analysis", "Risk Assessment", "Security Management", "Compliance"],
            careerRelevance: "Core for Cybersecurity Analyst, Security Manager roles",
            assessments: ["Security Audits", "Risk Assessments", "Final Exam"]
        },
        "6200": {
            code: "6200",
            name: "Strategic Business Planning",
            level: 6,
            credits: 15,
            description: "Develop strategic planning skills to align IT initiatives with business goals and create competitive advantage.",
            topics: ["Strategic Analysis", "Business Strategy", "Competitive Advantage", "Strategic Planning", "Performance Metrics"],
            skills: ["Strategic Thinking", "Business Planning", "Analysis", "Decision Making"],
            careerRelevance: "Important for IT Consultant, Strategic Analyst positions",
            assessments: ["Strategic Plans", "Business Analysis", "Case Studies"]
        },
        "6203": {
            code: "6203",
            name: "Business Process Management",
            level: 6,
            credits: 15,
            description: "Learn to analyze, design, and optimize business processes using BPM methodologies and tools.",
            topics: ["Process Modeling", "BPMN", "Process Analysis", "Process Improvement", "BPM Tools"],
            skills: ["Process Mapping", "Process Analysis", "Optimization", "BPM Software"],
            careerRelevance: "Essential for Business Process Analyst, Process Consultant roles",
            assessments: ["Process Models", "Improvement Projects", "Tool Proficiency"]
        },
        "6209": {
            code: "6209",
            name: "Integrated Project Management",
            level: 6,
            credits: 15,
            description: "Master project management methodologies including Agile, Scrum, and traditional PM approaches for successful IT project delivery.",
            topics: ["Project Planning", "Agile/Scrum", "Risk Management", "Resource Management", "PM Tools"],
            skills: ["Project Management", "Agile Methodologies", "Team Leadership", "Planning"],
            careerRelevance: "Core for IT Project Manager, Scrum Master positions",
            assessments: ["Project Plans", "Team Projects", "PM Certification Prep"]
        },
        "6213": {
            code: "6213",
            name: "Planning and Managing Business Finances",
            level: 6,
            credits: 15,
            description: "Understand financial management principles including budgeting, financial analysis, and investment decisions for IT projects.",
            topics: ["Financial Planning", "Budgeting", "Financial Analysis", "ROI Analysis", "Cost Management"],
            skills: ["Financial Analysis", "Budget Management", "Cost-Benefit Analysis"],
            careerRelevance: "Important for IT Manager, Business Analyst roles with financial responsibility",
            assessments: ["Financial Reports", "Budget Projects", "Analysis Exam"]
        },
        "6501": {
            code: "6501",
            name: "Applied Business Research",
            level: 6,
            credits: 15,
            description: "Develop research skills to investigate business problems and opportunities using quantitative and qualitative methods.",
            topics: ["Research Methods", "Data Collection", "Quantitative Analysis", "Qualitative Research", "Report Writing"],
            skills: ["Research Design", "Data Analysis", "Critical Thinking", "Academic Writing"],
            careerRelevance: "Foundation for research-based roles and further study",
            assessments: ["Research Proposal", "Data Analysis", "Research Report"]
        }
    },
    level7: {
        "7101": {
            code: "7101",
            name: "Business Intelligence and Analytics",
            level: 7,
            credits: 15,
            description: "Master BI tools and techniques to transform data into actionable business insights using visualization and analytics platforms.",
            topics: ["BI Concepts", "Data Warehousing", "Dashboard Design", "Analytics Tools", "Decision Support"],
            skills: ["Power BI/Tableau", "Data Visualization", "Analytics", "Business Insights"],
            careerRelevance: "Essential for Business Intelligence Analyst, Data Analyst roles",
            assessments: ["BI Projects", "Dashboard Development", "Analytics Report"]
        },
        "7102": {
            code: "7102",
            name: "Data Mining and Knowledge Discovery",
            level: 7,
            credits: 15,
            description: "Apply advanced data mining techniques and machine learning algorithms to discover patterns and insights from large datasets.",
            topics: ["Data Mining", "Machine Learning", "Pattern Recognition", "Predictive Analytics", "Big Data"],
            skills: ["Data Mining Tools", "ML Algorithms", "Python/R", "Predictive Modeling"],
            careerRelevance: "Key for Data Scientist, Analytics Consultant positions",
            assessments: ["Mining Projects", "ML Models", "Technical Report"]
        },
        "7103": {
            code: "7103",
            name: "Software Requirements Analysis",
            level: 7,
            credits: 15,
            description: "Learn systematic approaches to elicit, analyze, document, and validate software requirements for complex systems.",
            topics: ["Requirements Engineering", "Use Cases", "User Stories", "Requirements Documentation", "Validation"],
            skills: ["Requirements Gathering", "Analysis", "Documentation", "Stakeholder Management"],
            careerRelevance: "Critical for Business Analyst, Systems Analyst roles",
            assessments: ["Requirements Documents", "Use Case Modeling", "Stakeholder Analysis"]
        },
        "7241": {
            code: "7241",
            name: "The Digital and Social Media Landscape",
            level: 7,
            credits: 15,
            description: "Explore digital marketing, social media strategy, e-commerce, and emerging digital business models.",
            topics: ["Digital Marketing", "Social Media Strategy", "E-commerce", "Content Strategy", "Analytics"],
            skills: ["Digital Marketing", "Social Media Management", "Content Creation", "Analytics"],
            careerRelevance: "Important for Digital Marketing roles, E-commerce positions",
            assessments: ["Digital Strategy", "Campaign Projects", "Analytics Report"]
        },
        "7502": {
            code: "7502",
            name: "Applied Project",
            level: 7,
            credits: 30,
            description: "Complete a substantial industry-focused project applying all your learning to solve a real business problem. This capstone project demonstrates your readiness for professional practice.",
            topics: ["Project Planning", "Research", "Solution Design", "Implementation", "Professional Practice"],
            skills: ["Project Management", "Research", "Problem Solving", "Professional Delivery"],
            careerRelevance: "Demonstrates readiness for all BBIS career paths",
            assessments: ["Project Proposal", "Progress Reports", "Final Deliverable", "Presentation"]
        }
    },
    careers: [
        { 
            role: "Database Administrator", 
            salary: "NZ$70,000 - $110,000",
            description: "Design, implement and maintain database systems for organizational data management",
            requiredPapers: ["6104", "7101", "5102"],
            keySkills: ["SQL", "Database Design", "Performance Tuning", "Backup & Recovery"]
        },
        { 
            role: "Information Systems Manager", 
            salary: "NZ$90,000 - $140,000",
            description: "Oversee IT systems and teams to support business operations and strategy",
            requiredPapers: ["5140", "6200", "6209"],
            keySkills: ["IT Management", "Strategic Planning", "Team Leadership", "Business Analysis"]
        },
        { 
            role: "Business Analyst", 
            salary: "NZ$65,000 - $105,000",
            description: "Bridge IT and business to identify requirements and improve processes",
            requiredPapers: ["5140", "7103", "6203"],
            keySkills: ["Requirements Analysis", "Process Modeling", "Communication", "Problem Solving"]
        },
        { 
            role: "IT Project Manager", 
            salary: "NZ$85,000 - $135,000",
            description: "Lead IT projects from initiation to delivery using Agile and traditional methods",
            requiredPapers: ["6209", "6213", "7502"],
            keySkills: ["Project Management", "Agile/Scrum", "Risk Management", "Team Leadership"]
        },
        { 
            role: "IT Consultant", 
            salary: "NZ$75,000 - $125,000",
            description: "Advise organizations on technology solutions and digital transformation",
            requiredPapers: ["6200", "6106", "7101"],
            keySkills: ["Business Strategy", "Technical Expertise", "Client Management", "Problem Solving"]
        },
        { 
            role: "Programmer and Designer", 
            salary: "NZ$60,000 - $100,000",
            description: "Develop and design software applications and user interfaces",
            requiredPapers: ["5101", "5102", "6105"],
            keySkills: ["Programming", "Web Development", "UI/UX Design", "Problem Solving"]
        },
        { 
            role: "Data Analyst", 
            salary: "NZ$60,000 - $95,000",
            description: "Analyze data to provide insights for business decision-making",
            requiredPapers: ["5143", "7101", "7102"],
            keySkills: ["Data Analysis", "Statistics", "Visualization", "Business Intelligence"]
        },
        { 
            role: "Cybersecurity Analyst", 
            salary: "NZ$75,000 - $120,000",
            description: "Protect organizational systems and data from cyber threats",
            requiredPapers: ["6106", "6101", "5140"],
            keySkills: ["Security Analysis", "Risk Assessment", "Incident Response", "Compliance"]
        },
        { 
            role: "Systems Developer", 
            salary: "NZ$65,000 - $105,000",
            description: "Design and build information systems to meet business needs",
            requiredPapers: ["5102", "6104", "7103"],
            keySkills: ["Software Development", "System Design", "Database", "Testing"]
        },
        { 
            role: "Project Manager", 
            salary: "NZ$80,000 - $130,000",
            description: "Manage cross-functional projects to deliver business value",
            requiredPapers: ["6209", "6200", "7502"],
            keySkills: ["Project Management", "Leadership", "Communication", "Risk Management"]
        }
    ],
    facts: {
        duration: "24 months (accelerated)",
        credits: "360 points",
        level: "NZQA Level 7",
        campus: "Auckland CBD",
        intakes: "Contact ICL for 2025 start dates",
        structure: "Six 16-week trimesters",
        ielts: "6.0 overall (no band below 5.5)",
        byod: "Students must bring own device (laptop/tablet)"
    },
    programInfo: {
        totalPapers: 23,
        level5Papers: 9,
        level6Papers: 9,
        level7Papers: 5,
        categories: {
            "Information Systems": "105 credits",
            "Business": "120 credits",
            "ICT": "90 credits",
            "Research and Application": "45 credits"
        }
    }
};

// Chat sessions
const sessions = {};

// Generate session ID
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Kevin's enhanced system prompt
function getKevinPrompt() {
    return `You are Kevin, the friendly AI assistant for International College of Linguistics (ICL) New Zealand, specializing in the Bachelor of Business Information Systems (BBIS) program.

PROGRAM OVERVIEW:
- 24-month accelerated bachelor's degree
- 360 credits total (23 papers)
- NZQA Level 7 qualification
- Six 16-week trimesters
- Auckland CBD campus
- Entry: NZ University Entrance + IELTS 6.0

PROGRAM STRUCTURE:
- Level 5: 9 papers (foundation)
- Level 6: 9 papers (intermediate)
- Level 7: 5 papers (advanced)
- Categories: Information Systems (105cr), Business (120cr), ICT (90cr), Research (45cr)

YOUR ROLE:
- Be friendly, helpful, and encouraging
- Provide detailed information about specific papers when asked
- Explain career pathways and which papers lead to specific roles
- Help students understand course progression
- Answer questions about entry requirements, structure, and outcomes
- Use emojis appropriately: 🎓 📚 💻 💼 📊 🚀

WHEN DISCUSSING PAPERS:
- Always mention the paper code, name, level, and credits
- Explain what students will learn (topics)
- Describe the skills they'll gain
- Connect to relevant careers
- Mention assessment types

Be conversational, supportive, and specific. If you don't know something, be honest and suggest they contact ICL directly.`;
}

// Start chat
app.post('/api/start-chat', (req, res) => {
    const sessionId = generateSessionId();
    sessions[sessionId] = { messages: [] };
    
    res.json({
        sessionId,
        greeting: `Kia ora! I'm **Kevin** 🎓, your AI guide for ICL's Bachelor of Business Information Systems!

I can help you with:
📚 Information about any of the 23 papers
💼 Career paths and salary expectations
🎯 Course structure and progression
📝 Entry requirements
💡 Which papers to take for your dream job

What would you like to know?`
    });
});

// Enhanced chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!sessionId || !sessions[sessionId]) {
            return res.json({ 
                reply: "Let's start fresh! I'm Kevin, your BBIS course assistant. How can I help? 🎓"
            });
        }
        
        if (!message || message.trim() === '') {
            return res.json({ reply: "Please ask me a question! 📝" });
        }

        const query = message.toLowerCase();
        
        // Enhanced paper queries
        const paperMatch = message.match(/(\d{4})/);
        if (paperMatch) {
            const paperCode = paperMatch[1];
            const paper = 
                courseData.level5[paperCode] || 
                courseData.level6[paperCode] || 
                courseData.level7[paperCode];
            
            if (paper) {
                const reply = `📘 **${paper.code}: ${paper.name}**
**Level ${paper.level} | ${paper.credits} credits**

${paper.description}

**📚 Topics You'll Learn:**
${paper.topics.map(t => `• ${t}`).join('\n')}

**💪 Skills You'll Gain:**
${paper.skills.map(s => `• ${s}`).join('\n')}

**💼 Career Relevance:**
${paper.careerRelevance}

**📝 Assessments:**
${paper.assessments.map(a => `• ${a}`).join('\n')}

Want to know more about careers related to this paper or other courses? 🚀`;
                return res.json({ reply });
            }
        }

        // Career queries
        if (query.includes('career') || query.includes('job') || query.includes('salary')) {
            const reply = `💼 **BBIS Career Opportunities:**

${courseData.careers.slice(0, 5).map(c => 
    `**${c.role}**
    💰 ${c.salary}
    ${c.description}
    Key Papers: ${c.requiredPapers.join(', ')}
    `).join('\n')}

All positions offer excellent growth potential in NZ's thriving tech sector! 🚀

Want to know which papers to focus on for a specific role? Just ask! 🎯`;
            return res.json({ reply });
        }

        // Program structure
        if (query.includes('structure') || query.includes('how many') || query.includes('papers')) {
            const reply = `📊 **BBIS Program Structure:**

**Total:** 23 papers over 24 months (360 credits)

**Level 5 (Foundation):** 9 papers
Building your fundamental IT and business skills

**Level 6 (Intermediate):** 9 papers  
Developing specialized technical and business capabilities

**Level 7 (Advanced):** 5 papers
Advanced analytics, strategy, and capstone project

**By Category:**
• Information Systems: 105 credits
• Business: 120 credits  
• ICT: 90 credits
• Research & Application: 45 credits

Want to see papers at a specific level? Just ask! 🎓`;
            return res.json({ reply });
        }

        // Entry requirements
        if (query.includes('entry') || query.includes('requirement') || query.includes('ielts') || query.includes('entry')) {
            const reply = `📋 **Entry Requirements for BBIS:**

**Academic:**
• NZ University Entrance (UE), OR
• Equivalent secondary qualification

**For International Students:**
• IELTS: 6.0 overall (no band below 5.5)
• Test must be within last 2 years
• Other NZQA-recognized tests accepted

**Additional:**
• Must bring own device (laptop/tablet)
• Basic computer literacy

**Campus:** Auckland CBD
**Duration:** 24 months (accelerated)

Ready to apply? I can tell you more about specific papers! 🚀`;
            return res.json({ reply });
        }

        // Duration/time queries
        if (query.includes('duration') || query.includes('how long') || query.includes('time')) {
            const reply = `⏰ **Program Duration:**

**24 months total** - that's an accelerated bachelor's degree!

**Structure:**
• Six 16-week trimesters
• Excludes holidays
• Full-time study
• 360 credits total

**Start dates:** Contact ICL for 2025 intakes

This compressed format lets you graduate a year earlier than traditional 3-year degrees! 🎓

Want to know about specific papers or progression? 📚`;
            return res.json({ reply });
        }

        // Greetings
        if (query.includes('hello') || query.includes('hi') || query.includes('kia ora')) {
            return res.json({ 
                reply: `Kia ora! 👋 I'm Kevin, your BBIS expert!

I can help you explore:
• Any of the 23 papers (e.g., "Tell me about 7101")
• Career paths and salaries
• Course structure and requirements
• Entry requirements
• Best papers for your goals

What would you like to know? 🎓`
            });
        }

        // Use OpenAI if available
        if (process.env.OPENAI_API_KEY) {
            try {
                const response = await axios.post(
                    'https://api.openai.com/v1/chat/completions',
                    {
                        model: 'gpt-4o-mini',
                        messages: [
                            { role: 'system', content: getKevinPrompt() },
                            { role: 'user', content: message }
                        ],
                        max_tokens: 500,
                        temperature: 0.7
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                            'Content-Type': 'application/json'
                        },
                        timeout: 15000
                    }
                );
                
                const reply = response.data.choices[0].message.content;
                return res.json({ reply });
                
            } catch (openaiError) {
                console.log('OpenAI error, using fallback');
            }
        }
        
        // Fallback response
        return res.json({ 
            reply: `I'm here to help with the BBIS program! Try asking me:

• "Tell me about paper 6104" (any paper code)
• "What careers can I pursue?"
• "What's the program structure?"  
• "Entry requirements?"
• "How long is the course?"

What would you like to know? 🎓`
        });
        
    } catch (error) {
        console.error('Server error:', error);
        return res.json({ 
            reply: "I'm having a technical moment. Please try again! 🔄"
        });
    }
});

// Get all course data
app.get('/api/course-data', (req, res) => {
    res.json(courseData);
});

// Get specific paper
app.get('/api/paper/:code', (req, res) => {
    const code = req.params.code;
    const paper = 
        courseData.level5[code] || 
        courseData.level6[code] || 
        courseData.level7[code];
    
    if (paper) {
        res.json({ success: true, paper });
    } else {
        res.json({ success: false, message: 'Paper not found' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'online', 
        assistant: 'Kevin AI',
        papers: 23,
        time: new Date().toISOString()
    });
});

// Serve HTML
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════════╗
║      ICL BBIS AI ASSISTANT - KEVIN           ║
║      ===============================         ║
║  🌐 http://localhost:${PORT}                   ║
║  🤖 Assistant: Kevin (Enhanced & Ready!)     ║
║  📚 Course: BBIS (23 papers, 360 credits)    ║
║  🎓 Level: 5, 6, 7                           ║
╚═══════════════════════════════════════════════╝
    `);
    
    if (!process.env.OPENAI_API_KEY) {
        console.log('\n⚠️  Running in LOCAL MODE');
        console.log('💡 Add OPENAI_API_KEY to .env for AI responses\n');
    }

});
