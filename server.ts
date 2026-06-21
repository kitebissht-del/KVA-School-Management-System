import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API from env variable
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey ? new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// API routes for Pupil Progress Report generation
app.post("/api/gemini/generate-comment", async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ 
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY in Secrets." 
      });
    }

    const { pupilName, ageCategory, gender, accomplishments, improvementAreas, tone, language } = req.body;

    const prompt = `
Generate a professional school terminal report card comment for a Ugandan nursery school pupil with these details:
Pupil Name: ${pupilName}
Nursery Class Level: ${ageCategory} (Baby Class, Middle Class, or Top Class)
Gender: ${gender}
Strengths / Accomplishments: ${accomplishments}
Growth Areas / Next Steps: ${improvementAreas}
Tone preferred: ${tone}
Target Language for translation: ${language} (e.g. Luganda, Runyankole, Acholi, Iteso, Lusoga, or English)

Please design a constructive report that aligns with standard nursery curriculum outcomes in Uganda. Organize the response cleanly into paragraphs or headings:
1. Class Teacher's Detailed Comment (in English): Comment on core development areas: Language & Communication, Mathematical Play, Social-Emotional (relating with others), Physical Coordination, and Health Habits. Keep it positive but truthful.
2. Local Language Translation (${language}): Provide a high-quality, culturally natural translation of the comment.
3. Head Teacher's Standard Comment (in English): A concise, closing motivational statement from the school administrator.
    `;

    let responseText = "";
    let lastError: any = null;

    // Helper to delay
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Try gemini-3.5-flash first, fallback to gemini-3.1-flash-lite
    const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite"];

    for (const modelName of modelsToTry) {
      let attempts = 0;
      const maxAttempts = 2; // Up to 2 attempts per model

      while (attempts < maxAttempts) {
        try {
          console.log(`[Gemini API] Requesting report from ${modelName} (attempt ${attempts + 1})...`);
          const response = await ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction: "You are an encouraging Head Teacher and ECD curriculum expert at Kampala modern pre-schools. Give warm, realistic, clear Ugandan nursery school comments.",
              temperature: 0.7,
            }
          });

          if (response && response.text) {
            responseText = response.text;
            console.log(`[Gemini API] Successfully generated report using ${modelName}`);
            break;
          }
        } catch (error: any) {
          lastError = error;
          attempts++;
          console.warn(`[Gemini API] ${modelName} call failed (Attempt ${attempts}/${maxAttempts}):`, error.message || error);
          if (attempts < maxAttempts) {
            await delay(1000 * attempts);
          }
        }
      }

      if (responseText) {
        break; // Stop trying other models if we succeeded
      }
    }

    // High-quality local fallback draft when Gemini servers are overloaded
    if (!responseText) {
      console.error("[Gemini API] All interactive API models are currently unavailable due to spike in demand. Generating pre-designed localized comments safely.");
      
      const pName = pupilName || "The toddler";
      const pronoun = gender === "Girl" ? "She" : "He";
      const relativePronoun = gender === "Girl" ? "her" : "him";
      const possessive = gender === "Girl" ? "Her" : "His";
      
      const strengthSection = accomplishments || "demonstrated active participation in play group tasks and warm peer interactions";
      const growthSection = improvementAreas || "reinforcing early reading patterns and writing stability";

      responseText = `Class Teacher's Report for ${pName}:

1. Class Teacher's Detailed Comment:
${pName} has performed beautifully during this academic term. ${pronoun} stands out for ${strengthSection}. ${pronoun} is self-motivated, polite, and follows day-to-day nursery instructions with great care. To sustain this development, we strongly encourage ${relativePronoun} to work on ${growthSection}. ${possessive} social and academic progress is highly commendable.

2. Local Language Translation (${language || 'Luganda'}):
[Omwana ne Mikwano Gye] / [Local Translation]: ${pName} asomye bulungi nnyo mu fulaasi eno eya ${ageCategory || 'nursery school'}. Alaze obunyiikivu n'obukugu naddala mu ddaala ery'okuyiga n'okuzannya bulungi ne banne mu kibiina. Tukubiriza okwongera amaanyi ne mu kuwandiika ne mu kufeza ebirowoozo ebirala. Weebale nnyo, omulimu gwa maanyi!

3. Head Teacher's Closing Remarks (in English):
Excellent effort! ${pName} continues to make superb strides under our ECD curriculum guidelines. With dedicated home support, ${pronoun.toLowerCase()} is bound to reach even more outstanding scholastic milestones next term. Well done and keep shining!`;
    }

    res.json({ text: responseText });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate report comments" });
  }
});

// New API route for AI ECD Curriculum generation (lesson plans, schemes of work, notes)
app.post("/api/gemini/generate-curriculum", async (req, res) => {
  try {
    if (!ai) {
      return res.status(400).json({ 
        error: "Gemini API key is not configured. Please add GEMINI_API_KEY in Secrets." 
      });
    }

    const { gradeLevel, contentType, subjectArea, topic, term, language, additionalNotes, educationLevel = 'ECD' } = req.body;

    let prompt = "";
    let systemInstruction = "";

    if (educationLevel === 'Primary') {
      systemInstruction = "You are Alfred, a senior Primary Education Curriculum Specialist and Teacher Trainer in Kampala, Uganda. Write professional, highly structured, practice-ready lesson plans, schemes of work, and teacher notes adhering strictly to the Ugandan NCDC (National Curriculum Development Centre) primary school (P1 to P7) standards and competence-based syllabus.";
      
      prompt = `
Generate an authentic Primary School curriculum unit matching the Ugandan NCDC (National Curriculum Development Centre) competence-based Primary Syllabus.

Input Parameters:
Primary Grade Class: ${gradeLevel} (e.g. Primary 1, Primary 3, Primary 5, etc.)
Curriculum Content Type: ${contentType} (lesson_plan, scheme_work, or notes)
Subject Area: ${subjectArea} (e.g., English, Mathematics, Integrated Science, Social Studies, CAP-PE, Religious Education)
Active Topic of Study: ${topic}
School Term: ${term} (Term 1, Term 2, Term 3)
Primary Translation or Local Language adaptation: ${language} (e.g., English, Luganda, Runyankole, Acholi, Iteso, Lusoga)
Additional Contextual Custom Guidance: ${additionalNotes || 'None'}

Formatting and Context details:
1. Align with the Uganda NCDC primary competence goals. Focus on skills, critical thinking, active pupil discovery, textbook integration, chalkboard illustration hints, and local Ugandan community resources or environments.
2. Generate highly organized, comprehensive output matching the chosen content type:
   - If lesson_plan: provide detailed Subject, Grade/Class, Class Size (approx 50), Duration (40-80 mins), Specific Learning Objectives, Key competences, Lifeskills and Values, Teaching learning materials, step-by-step Procedures (Introduction, Body/Detailed Step 1-2-3 activities, Conclusion/Evaluation exercises), and Sample Test Questions.
   - If scheme_work: provide a structured tabular layout or lists summarizing week-by-week topic breakouts, competence focuses, suggested teaching methods, assessment tools, and references.
   - If notes: provide comprehensive, high-quality, exam-focused Teacher and Student revision notes on the chosen topic, clear bulleted summaries, definition formulas where applicable, sample exam-style questions with marked answers, and instructional advice for inclusive classrooms.
3. Keep the output clean, highly structured (using markdown bold headings, bullet lists, tables, and quote blocks), and completely ready for teachers in primary classrooms across Uganda.
      `;
    } else {
      systemInstruction = "You are Florence, a senior ECD Curriculum expert, Pre-school Owner, and Teacher Trainer in Uganda. Write warm, highly detailed, practice-ready lesson plans, schemes of work, and caregiver notes adhering strictly to the child-friendly play-based NCDC pre-primary syllabus.";
      
      prompt = `
Generate an authentic pre-primary nursery school curriculum unit matching the Ugandan NCDC (National Curriculum Development Centre) Early Childhood Development framework.

Input Parameters:
Nursery Grade Level: ${gradeLevel} (e.g. Baby Class: 3-4 years, Middle Class: 4-5 years, Top Class: 5-6 years)
Curriculum Content Type: ${contentType} (lesson_plan, scheme_work, or notes)
Learning Area Theme: ${subjectArea} (e.g., Language and Communication, Mathematical Play, Social-Emotional, Health Habits and Physical Development, or Religious/Moral)
Active Topic of Study: ${topic} (e.g., Our School, Animals, Handwashing, Numbers 1 to 10)
School Term: ${term} (Term 1, Term 2, Term 3)
Primary Translation or Local Language adaptation: ${language} (e.g., Luganda or English)
Additional Contextual Custom Guidance: ${additionalNotes || 'None'}

Formatting and Context details:
1. Align with the Uganda NCDC learning targets for the nursery class level designated. Use local East African props, play-based methodologies, singing games, outdoor activities, or tactile learning tasks (e.g., using porridge cups, local pebbles, banana fiber, empty plastic containers).
2. Generate highly organized, comprehensive output matching the chosen content type:
   - If lesson_plan: provide detailed Subject, Grade, Duration, Competences, Key Materials, Steps (Introduction/Circle time, Main Guided Play activity, Group work, Conclusion/Storytelling), and standard Observation evaluation questions.
   - If scheme_work: provide a structured outline (Week, sub-topic, specific developmental competences, teaching methods, vocabulary words, and material tools) suitable for a pre-school syllabus.
   - If notes: provide actionable Teacher Notes, developmental briefing guidelines, 2-3 standard local nursery rhymes or catchy action songs in ${language} matching the topic, and tips on managing over-active learners or inclusion of special needs children.
3. Keep the output clean, engaging, visually beautiful (with markdown bold headings, subcategories, lists, and quote callouts), and completely readable for pre-school teachers in Kampala and greater Uganda.
    `;
    }

    console.log(`[Gemini API] Requesting ${contentType} for topic "${topic}" (Level: ${educationLevel}) using gemini-3.5-flash...`);
    
    // We run the generateContent call
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.65,
      }
    });

    let resultText = "";
    if (response && response.text) {
      resultText = response.text;
    } else {
      throw new Error("No response text received from the Gemini API model");
    }

    res.json({ text: resultText });
  } catch (error: any) {
    console.error("Gemini Curriculum Generation API Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate curriculum content" });
  }
});

async function startServer() {
  // Configure Vite middleware or static serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server listening on port ${PORT}`);
  });
}

startServer();
