
import { GoogleGenAI, Type } from "@google/genai";
import { InitialAnalysis, RoadmapData } from "../types";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeProfile(
  resumeText: string,
  linkedinText: string,
  githubData: string,
  targetPosition: string
): Promise<InitialAnalysis> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the professional profile for the position: ${targetPosition}. 
    
    Data Sources:
    1. Resume: ${resumeText.slice(0, 3000)}
    2. LinkedIn: ${linkedinText.slice(0, 3000)}
    3. GitHub: ${githubData}
    
    Tasks:
    1. Summarize high-level skill gaps.
    2. Identify core skills for this role, categorized into 'technical' and 'soft'.
    3. Mark each skill as 'met' (found in data) or 'missing' (not found or weak).
    4. Provide 3-5 'other_suggestions' (certifications/courses).
    5. Provide 2-3 specific 'project_suggestions' that would demonstrate competence in the missing skills.
    6. Identify 3-4 'job_pathways' (potential future roles or lateral moves) that this candidate is well-positioned for.
    7. Generate 5 assessment questions to calibrate their current level.
    
    Return JSON format only.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          skill_gap_summary: { type: Type.STRING },
          assessment_questions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          skills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['technical', 'soft'] },
                status: { type: Type.STRING, enum: ['met', 'missing'] }
              },
              required: ["name", "type", "status"]
            }
          },
          other_suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          project_suggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          job_pathways: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["skill_gap_summary", "assessment_questions", "skills", "other_suggestions", "project_suggestions", "job_pathways"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}

export async function generateRoadmap(
  transcript: string,
  targetPosition: string,
  initialAnalysis?: string,
  githubData?: string
): Promise<RoadmapData> {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Create a 30-day offensive roadmap for ${targetPosition}.
    Transcript: ${transcript}
    Initial Data: ${initialAnalysis}
    GitHub: ${githubData}
    
    The roadmap must address the 'missing' skills identified.
    IMPORTANT: You must structure the roadmap into exactly 4 Weekly Phases (Week 1, Week 2, Week 3, Week 4).
    
    For each week phase, you MUST include:
    
    1. A mix of task types: Documentation, Practice problems, Mini projects, and General.
    2. Exactly 2-3 high-quality DOCUMENTATION resources for the focus of that week.
    
    📌 ACCEPTABLE DOCUMENTATION SOURCES:
    Only use: Official framework/language docs (React.dev, Python.org, MDN Web Docs, FastAPI Docs, Nodejs.org, etc.), W3C, Docker Docs, or official university pages.
    PROHIBITED: Medium, Random Blogs, StackOverflow, Unverified tutorials.
    
    Match documentation difficulty with the candidate's proficiency identified in the transcript.
    Ensure all URLs are real, valid, and start with https://.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          thirty_day_plan: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING, description: "e.g., Week 1" },
                focus: { type: Type.STRING },
                tasks: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ['documentation', 'practice', 'project', 'general'] }
                    },
                    required: ["text", "type"]
                  }
                },
                documentation: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      url: { type: Type.STRING },
                      difficulty: { type: Type.STRING, enum: ['Beginner', 'Intermediate', 'Advanced'] },
                      type: { type: Type.STRING },
                      relevanceScore: { type: Type.NUMBER },
                      estimatedReadTime: { type: Type.STRING }
                    },
                    required: ["title", "url", "difficulty", "type", "relevanceScore", "estimatedReadTime"]
                  }
                }
              },
              required: ["day", "focus", "tasks", "documentation"]
            }
          }
        },
        required: ["thirty_day_plan"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
}
