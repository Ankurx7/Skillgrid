import { GoogleGenerativeAI } from "@google/generative-ai";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apis";

class ChatbotService {
  constructor() {
    this.model = null;
    this.coursesData = null;
    this.lastFetchTime = null;
    this.cacheDuration = 5 * 60 * 1000;
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

  async fetchCoursesData() {
    const now = Date.now();

    if (this.coursesData && this.lastFetchTime && (now - this.lastFetchTime) < this.cacheDuration) {
      return this.coursesData;
    }

    try {

      const coursesResponse = await apiConnector("GET", courseEndpoints.GET_ALL_COURSE_API);

      if (coursesResponse.data.success) {
        this.coursesData = coursesResponse.data.data;
        this.lastFetchTime = now;
        return this.coursesData;
      }
    } catch (error) {

      return [];
    }
  }

  async getCourseDetails(courseId) {
    try {
      const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, { courseId });
      if (response.data.success) {
        return response.data.data.courseDetails;
      }
    } catch (error) {

      return null;
    }
  }

  formatCoursesForAI(courses) {
    return courses.map(course => ({
      id: course.id || course._id,
      name: course.name || course.courseName,
      description: course.description || course.courseDescription,
      price: course.price,
      instructor: course.instructor?.firstName && course.instructor?.lastName 
        ? `${course.instructor.firstName} ${course.instructor.lastName}`
        : course.instructor?.name || 'Instructor information available on course page',
      category: course.category?.name || course.category,
      enrolledStudents: course.studentsEnrolled || course.studentsEnroled?.length || 0,
      rating: course.rating,
      whatYouWillLearn: course.whatYouWillLearn,
      tags: course.tags || course.tag
    }));
  }

  generateSystemPrompt(coursesData) {
    const formattedCourses = this.formatCoursesForAI(coursesData);

    return `
You are CourseBot, an intelligent assistant for Skillgrid, an online learning platform. You help users find and learn about courses.

AVAILABLE COURSES DATA:
${JSON.stringify(formattedCourses, null, 2)}

INSTRUCTIONS:
1. Be helpful, friendly, and knowledgeable about Skillgrid courses
2. When users ask about courses, provide specific information from the data above
3. Recommend courses based on user interests, career goals, and skill levels
4. Provide pricing information in Indian Rupees (₹) when asked
5. Mention instructor names when relevant
6. Help users compare different courses with clear pros/cons
7. If asked about detailed course content not in the basic data, mention they can get more information by viewing the course page
8. Always be encouraging about learning and education
9. If asked about topics not related to courses or education, politely redirect to course-related queries
10. Format responses in a clear, easy-to-read manner with proper structure
11. Use emojis appropriately to make responses engaging
12. Provide actionable advice for course selection
13. Mention course categories and difficulty levels when relevant
14. Suggest learning paths for specific career goals
15. NEVER include technical details like URLs, IDs, or system information in responses
16. Focus on user-friendly information like course names, descriptions, prices, and instructors

RESPONSE FORMATTING:
- Use bullet points for course lists
- Include prices with ₹ symbol
- Highlight key benefits and features
- Keep responses concise but informative
- Use friendly, conversational tone
- NEVER include URLs, file paths, or technical identifiers
- Focus on course names, descriptions, prices, and instructor names only
- If users need more details, direct them to browse the course catalog

EXAMPLE RESPONSES:
- For course recommendations: List 2-3 relevant courses with names, prices, instructors, and brief descriptions
- For pricing questions: Provide exact prices in ₹ and mention value proposition
- For instructor questions: Mention instructor names and their expertise areas
- For course comparisons: Create a simple comparison highlighting key differences
- For career advice: Suggest relevant courses and learning paths

Remember: You represent Skillgrid, so maintain a professional yet friendly tone that encourages learning and personal growth. Always aim to help users make informed decisions about their education.
`;
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('course') || lowerMessage.includes('what') || lowerMessage.includes('show')) {
      return `I can help you with course information! Here are some things I can assist with:

🎓 **Course Recommendations**: I can suggest courses based on your interests
💰 **Pricing Information**: Get current prices for all courses
👨‍🏫 **Instructor Details**: Learn about our expert instructors
📚 **Course Comparisons**: Compare different courses side by side
🎯 **Career Guidance**: Find courses aligned with your career goals

To get specific course information, please ask me something like:
• "What programming courses do you have?"
• "Show me courses under ₹5000"
• "Which instructor teaches web development?"

*Note: AI features are currently limited. Please ensure your Gemini API key is configured for enhanced responses.*`;
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('fee')) {
      return `💰 **Course Pricing Information**

Our courses are competitively priced to provide excellent value for your investment in education.

To get specific pricing information, please ask about:
• Individual course prices
• Price ranges for different categories
• Special offers or discounts available

Example: "What's the price of the React course?" or "Show me courses under ₹3000"

*For real-time pricing and detailed information, please browse our course catalog or contact our support team.*`;
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hello! 👋 Welcome to Skillgrid!

I'm CourseBot, your learning assistant. I can help you:

🔍 **Find Courses**: Discover courses that match your interests
📊 **Compare Options**: Get detailed comparisons between courses
💡 **Get Recommendations**: Receive personalized course suggestions
💰 **Check Pricing**: Learn about course costs and value
👨‍🏫 **Meet Instructors**: Know about our expert educators

What would you like to know about our courses today?`;
    }

    return `Thank you for your question! 🤔

I'm here to help you with course-related inquiries at Skillgrid. While my AI capabilities are currently limited, I can still assist you with:

✅ General course information
✅ Pricing guidance
✅ Instructor information
✅ Course recommendations
✅ Learning path suggestions

Please try asking specific questions about:
• Course categories and topics
• Pricing and enrollment
• Instructor expertise
• Career-focused learning paths

*For the best experience, please ensure the Gemini API key is properly configured.*`;
  }

  async chat(message) {
    try {

      const coursesData = await this.fetchCoursesData();

      if (!coursesData || coursesData.length === 0) {
        return "I'm sorry, I'm having trouble accessing course information right now. Please try again later or contact our support team for immediate assistance.";
      }

      if (!this.model) {
        return this.getFallbackResponse(message);
      }

      const systemPrompt = this.generateSystemPrompt(coursesData);

      const fullPrompt = `${systemPrompt}

USER QUESTION: ${message}

Please provide a helpful response based on the Skillgrid courses available:`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      return text;

    } catch (error) {

      if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
        return `🔧 **Configuration Needed**

It looks like the Gemini API service needs to be configured. Here's what I can still help you with:

📚 **Available Courses**: We offer a wide range of courses in technology, business, and creative fields
💰 **Pricing**: Competitive pricing with great value for quality education
👨‍🏫 **Expert Instructors**: Learn from industry professionals
🎓 **Certification**: Get certified upon course completion

For immediate assistance, please:
• Browse our course catalog directly
• Contact our support team
• Visit our help section

Would you like me to help you navigate to any specific section?`;
      }

      if (error.message?.includes('not found') || error.message?.includes('404')) {

        this.model = null;
        return this.getFallbackResponse(message);
      }

      if (error.message?.includes('429') || error.message?.includes('quota')) {
        return `⏳ **Service Temporarily Unavailable**

Our AI assistant is experiencing high demand right now. Please try again in a few moments.

In the meantime, I can help you with:
• Browsing our course catalog
• Getting general course information
• Connecting you with our support team

Thank you for your patience!`;
      }

      return "I'm sorry, I encountered an error while processing your request. Please try again or contact our support team for assistance.";
    }
  }

  getQuickResponses() {
    return [
      "What courses do you offer?",
      "Show me programming courses",
      "What are the course prices?",
      "Who are the instructors?",
      "Help me choose a course",
      "What's popular right now?"
    ];
  }
}

export const chatbotService = new ChatbotService();
