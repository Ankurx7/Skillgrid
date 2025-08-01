import { GoogleGenerativeAI } from "@google/generative-ai";

class StudyAssistantService {
  constructor() {
    this.model = null;
    this.initializeModel();
  }

  initializeModel() {
    try {
      const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
      if (!apiKey || apiKey === 'your-gemini-api-key-here') {

        this.model = null;
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    } catch (error) {

      this.model = null;
    }
  }

  generateAcademicPrompt(courseContext = null) {
    let courseInfo = '';

    if (courseContext) {
      courseInfo = `
**CURRENT COURSE CONTEXT:**
📚 **Course**: ${courseContext.courseName || 'Current Course'}
📖 **Description**: ${courseContext.courseDescription || 'No description available'}
👨‍🏫 **Instructor**: ${courseContext.instructor?.firstName || 'Instructor'} ${courseContext.instructor?.lastName || ''}
🏷️ **Category**: ${courseContext.category?.name || 'General'}
📊 **Level**: ${courseContext.instructions || 'All levels'}

**COURSE CONTENT STRUCTURE:**
${courseContext.courseContent?.map((section, index) => `
📁 **Section ${index + 1}**: ${section.sectionName}
   ${section.subSection?.map((subsection, subIndex) => `
   📄 ${subIndex + 1}. ${subsection.title}${subsection.description ? ` - ${subsection.description}` : ''}`).join('') || ''}
`).join('') || ''}

**STUDY CONTEXT**: The student is currently taking this course, so please provide answers that are relevant to this specific course content and help them understand concepts within this context.
`;
    }

    return `
You are StudyBot, an intelligent academic tutor and study assistant for Skillgrid. You help students understand concepts across all subjects and academic levels.

${courseInfo}

CORE RESPONSIBILITIES:
1. Explain complex academic concepts in simple, understandable terms
2. Help with homework and study questions across all subjects
3. Provide step-by-step solutions for problems
4. Offer study tips and learning strategies
5. Clarify doubts and misconceptions
6. Encourage learning and academic growth
7. **When course context is available**: Relate explanations to the specific course content, refer to relevant sections/videos, and help students connect concepts within their course curriculum

RESPONSE GUIDELINES FOR COURSE-SPECIFIC HELP:
- Reference specific sections, videos, or topics from the current course when relevant
- Help students understand how current questions relate to their course material
- Suggest reviewing specific course sections for deeper understanding
- Connect concepts across different parts of the course curriculum
- Provide context-aware examples that align with the course subject matter

SUBJECTS YOU COVER:
📚 **Sciences**: Physics, Chemistry, Biology, Earth Science, Environmental Science
🔢 **Mathematics**: Algebra, Geometry, Calculus, Statistics, Discrete Math
💻 **Computer Science**: Programming, Algorithms, Data Structures, Software Engineering
📖 **Literature**: Analysis, Writing, Grammar, Poetry, Essays
🏛️ **History**: World History, Regional History, Historical Analysis
🌍 **Geography**: Physical Geography, Human Geography, Maps, Climate
🧠 **Psychology**: Cognitive Psychology, Behavioral Science, Research Methods
💼 **Economics**: Microeconomics, Macroeconomics, Finance, Business
🎨 **Arts**: Art History, Music Theory, Creative Writing, Design
🗣️ **Languages**: Grammar, Vocabulary, Translation, Language Learning

RESPONSE GUIDELINES:
1. **Be Educational**: Always aim to teach, not just provide answers
2. **Step-by-Step**: Break down complex problems into manageable steps
3. **Examples**: Use relevant examples and analogies to clarify concepts
4. **Encouraging**: Be supportive and motivational in your responses
5. **Accurate**: Provide factually correct information
6. **Adaptive**: Adjust complexity based on the apparent level of the question
7. **Interactive**: Ask follow-up questions to ensure understanding
8. **Practical**: Include study tips and memory techniques when helpful

FORMATTING:
- Use clear headings and bullet points
- Include relevant emojis to make learning engaging
- Use **bold** for key concepts
- Provide formulas in a clear format
- Use examples and analogies
- Include study tips when appropriate

RESPONSE STRUCTURE:
1. **Direct Answer/Explanation**: Start with the core information
2. **Detailed Breakdown**: Provide step-by-step explanation if needed
3. **Examples**: Give practical examples or applications
4. **Study Tips**: Suggest how to remember or apply the concept
5. **Follow-up**: Ask if they need clarification or have related questions

SPECIAL FEATURES:
- For math problems: Show all working steps
- For science: Explain underlying principles
- For essays: Provide structure and analysis techniques
- For languages: Include grammar rules and usage examples
- For history: Provide context and connections

Remember: You're not just answering questions - you're helping students learn and understand. Always be patient, encouraging, and thorough in your explanations.
`;
  }

  getFallbackResponse(question, courseContext = null) {
    const lowerQuestion = question.toLowerCase();

    let courseInfo = '';
    if (courseContext) {
      courseInfo = `
🎯 **Course Context**: ${courseContext.courseName || 'Current Course'}
👨‍🏫 **Instructor**: ${courseContext.instructor?.firstName || 'Instructor'} ${courseContext.instructor?.lastName || ''}

`;
    }

    if (lowerQuestion.includes('math') || lowerQuestion.includes('calculate') || lowerQuestion.includes('solve')) {
      return `${courseInfo}📊 **Math Help Available**

I'd love to help you with your math question! While my AI capabilities are currently limited, here are some general approaches:

🔢 **For Problem Solving**:
• Break down complex problems into smaller steps
• Identify what you're looking for (the unknown)
• List what information you have
• Choose the appropriate formula or method

📚 **Study Resources**:
• Khan Academy for step-by-step tutorials
• Practice similar problems to build understanding
• Work through examples before attempting homework

${courseContext ? `💡 **Course Tip**: Review the relevant sections in "${courseContext.courseName}" for examples related to your question.` : ''}

Please try rephrasing your specific math question, and I'll do my best to help!`;
    }

    if (lowerQuestion.includes('science') || lowerQuestion.includes('physics') || lowerQuestion.includes('chemistry') || lowerQuestion.includes('biology')) {
      return `${courseInfo}🔬 **Science Study Support**

I'm here to help with your science questions! While my AI features are limited right now, here's how I can assist:

⚗️ **General Science Help**:
• Explaining scientific concepts and principles
• Breaking down complex processes
• Connecting theory to real-world applications
• Study techniques for science subjects

🧪 **Study Tips**:
• Create concept maps to visualize relationships
• Use mnemonics for formulas and facts
• Practice with diagrams and illustrations
• Relate concepts to everyday examples

${courseContext ? `🎯 **Course Connection**: Since you're studying "${courseContext.courseName}", try to connect your question to the course material and specific sections covered.` : ''}

What specific science topic would you like help with?`;
    }

    if (lowerQuestion.includes('history') || lowerQuestion.includes('literature') || lowerQuestion.includes('english') || lowerQuestion.includes('writing')) {
      return `${courseInfo}📚 **Humanities Study Assistant**

I can help you with humanities subjects! Here's what I can assist with:

📖 **Literature & Writing**:
• Text analysis and interpretation
• Essay structure and organization
• Character and theme analysis
• Writing techniques and grammar

🏛️ **History Study Help**:
• Understanding historical contexts
• Analyzing cause and effect relationships
• Memorizing dates and events
• Connecting historical patterns

💡 **Study Strategies**:
• Create timelines for historical events
• Use active reading techniques
• Practice writing thesis statements
• Make connections between different texts/periods

${courseContext ? `📚 **Course Focus**: For "${courseContext.courseName}", review the course sections that relate to your question for more specific guidance.` : ''}

What specific topic would you like to explore?`;
    }

    return `${courseInfo}🤖 **Study Assistant Ready to Help!**

Hello! I'm your Study Assistant, ready to help you with academic questions across all subjects.

📚 **I can help you with**:
• **Sciences**: Physics, Chemistry, Biology concepts
• **Mathematics**: Problem solving, formulas, calculations
• **Literature**: Text analysis, writing, grammar
• **History**: Events, contexts, analysis
• **And much more!**

🎯 **How to get the best help**:
• Be specific about what you're studying
• Share the exact problem or concept you're struggling with
• Let me know your academic level if relevant

💡 **Study Tips**:
• Break complex topics into smaller parts
• Use active learning techniques
• Practice regularly rather than cramming
• Connect new concepts to what you already know

${courseContext ? `🎓 **Course-Specific Help**: I can provide targeted assistance for "${courseContext.courseName}" - feel free to ask about specific sections, concepts, or assignments from your course!` : ''}

What subject would you like help with today?`;
  }

  async askQuestion(question, courseContext = null) {
    try {

      if (!this.model) {
        return this.getFallbackResponse(question, courseContext);
      }

      const systemPrompt = this.generateAcademicPrompt(courseContext);

      const fullPrompt = `${systemPrompt}

STUDENT QUESTION: ${question}

Please provide a comprehensive, educational response that helps the student understand the concept${courseContext ? `, keeping in mind they are studying "${courseContext.courseName}"` : ''}:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;

    } catch (error) {

      if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
        return `🔧 **Configuration Issue**

I'm having trouble connecting to my AI brain right now, but I can still help you study!

📚 **General Study Tips**:
• Break down complex problems into smaller parts
• Use active recall instead of just re-reading
• Practice explaining concepts in your own words
• Create visual aids like diagrams or mind maps

🎯 **For Your Question**: Try rephrasing it more specifically, and I'll do my best to provide helpful guidance based on general academic principles.

What subject area are you working on?`;
      }

      if (error.message?.includes('not found') || error.message?.includes('404')) {

        this.model = null;
        return this.getFallbackResponse(question, courseContext);
      }

      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return `⏳ **High Demand Right Now**

My AI assistant is very busy helping other students! Please try again in a moment.

📚 **While you wait, try these study techniques**:
• Write down what you already know about the topic
• Look for patterns or connections to other concepts
• Try explaining the problem to yourself out loud
• Break complex questions into smaller parts

I'll be ready to help again soon!`;
      }

      return "I encountered an error while processing your question. Could you please try rephrasing it or breaking it down into smaller parts?";
    }
  }

  getStudyTips(subject) {
    const tips = {
      math: [
        "Practice problems daily, even if just for 15 minutes",
        "Show all your working steps to catch errors",
        "Understand the 'why' behind formulas, not just memorize them",
        "Use visual aids like graphs and diagrams"
      ],
      science: [
        "Connect concepts to real-world examples",
        "Draw diagrams to visualize processes",
        "Practice explaining concepts in simple terms",
        "Use mnemonics for complex formulas and facts"
      ],
      literature: [
        "Read actively with notes and questions",
        "Look for themes, symbols, and literary devices",
        "Practice writing thesis statements",
        "Discuss texts with others to gain new perspectives"
      ],
      history: [
        "Create timelines to understand chronology",
        "Focus on cause and effect relationships",
        "Use maps to understand geographical context",
        "Connect historical events to modern issues"
      ]
    };

    return tips[subject.toLowerCase()] || [
      "Break complex topics into smaller, manageable parts",
      "Use active recall instead of passive re-reading",
      "Teach concepts to others to test your understanding",
      "Regular review is better than cramming"
    ];
  }
}

export const studyAssistantService = new StudyAssistantService();
