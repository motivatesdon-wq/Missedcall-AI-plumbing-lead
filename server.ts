import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Gemini client server-side with required User-Agent
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback generator adhering strictly to plumbing business & safety rules
function generateSmartPlumbingSMS(
  customerName: string,
  problemDescription: string,
  tone: string,
  companyName: string = 'Rapid Flow Plumbing',
  isEmergency: boolean = false
): string {
  const firstName = customerName.trim().split(' ')[0] || 'there';
  const issue = problemDescription.trim();

  if (isEmergency || /burst|flood|emergency|gushing|sewage|gas/i.test(issue)) {
    return `Hi ${firstName}, this is ${companyName}. We just missed your call regarding the urgent issue with your plumbing (${issue}). If water is rapidly flooding, please locate and shut off your main water valve immediately to prevent damage. We have an on-call technician ready—please reply directly or call back now so we can help!`;
  }

  if (tone === 'urgent') {
    return `Hi ${firstName}, this is ${companyName}. Sorry we missed your call about ${issue}. If there is active leaking, turning off the water shut-off valve is recommended. Please reply or call us back as soon as you're free so we can check our earliest opening for you.`;
  }

  if (tone === 'direct') {
    return `Hi ${firstName}, ${companyName} here. Missed your call regarding ${issue}. Let us know what time works best for a quick callback so we can assess the situation.`;
  }

  if (tone === 'nudge') {
    return `Hi ${firstName}, following up from ${companyName} regarding your missed call about ${issue}. Just wanted to check if you still need assistance with this. Feel free to reply when you're available.`;
  }

  // Default: friendly & professional
  return `Hi ${firstName}, this is ${companyName}. Sorry we just missed your call regarding ${issue}! We'd love to help get this sorted out for you. Would you like us to call you back shortly, or would you prefer to reply here with details?`;
}

// AI Message Drafting API Endpoint
app.post('/api/ai/draft-sms', async (req, res) => {
  try {
    const {
      customerName = '',
      problemDescription = '',
      tone = 'friendly',
      companyName = 'Rapid Flow Plumbing',
      isEmergency = false,
      additionalNotes = '',
    } = req.body;

    if (!problemDescription) {
      return res.status(400).json({ error: 'Plumbing problem description is required' });
    }

    // If Gemini client is available, generate using gemini-3.8-flash
    if (aiClient) {
      const prompt = `Draft a personalized follow-up SMS text message for a plumbing company to send to a customer whose phone call was missed.

Details:
- Customer Name: ${customerName || 'Customer'}
- Plumbing Issue: ${problemDescription}
- Is Emergency: ${isEmergency ? 'YES (High Priority Urgent)' : 'No'}
- Company Name: ${companyName || 'Independent Plumbing Co.'}
- Desired Tone: ${tone} (e.g. friendly, direct, urgent, or nudge)
- Plumber's Context / Notes: ${additionalNotes || 'None'}

Strict Rules to Follow:
1. Format: Short, clear SMS text message (1 to 3 sentences maximum, 40 to 90 words).
2. Professional, friendly, empathetic, concise, and helpful.
3. NEVER invent prices, quotes, guarantees, or company policies.
4. DO NOT claim an appointment is booked unless confirmed.
5. If it is an active plumbing emergency (e.g., active leak, burst pipe, flooding, gas smell, raw sewage), advise turning off the main shutoff valve or contacting emergency services if safety hazard.
6. Provide a clean, low-friction call-to-action (e.g. "Reply to this text or call back when ready").
7. Output ONLY the raw SMS message text ready to send. No quotes around it, no markdown, no conversational commentary.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction:
            'You are an expert AI communication assistant for independent plumbing companies. Draft short, warm, professional SMS messages to follow up on missed customer calls. Never invent prices or claim bookings without confirmation. Include water shutoff advice for active flooding emergencies.',
          temperature: 0.7,
        },
      });

      const message = response.text ? response.text.trim() : '';
      if (message) {
        return res.json({
          message,
          source: 'gemini-3.8-flash',
        });
      }
    }

    // Safe fallback if API key is unconfigured or returns empty
    const fallbackMessage = generateSmartPlumbingSMS(
      customerName,
      problemDescription,
      tone,
      companyName,
      isEmergency
    );

    return res.json({
      message: fallbackMessage,
      source: 'smart-template-fallback',
    });
  } catch (error: any) {
    console.error('Error generating SMS draft:', error);
    // Return safe fallback message so user experience is smooth
    const {
      customerName = '',
      problemDescription = 'your plumbing issue',
      tone = 'friendly',
      companyName = 'Rapid Flow Plumbing',
      isEmergency = false,
    } = req.body || {};

    const fallbackMessage = generateSmartPlumbingSMS(
      customerName,
      problemDescription,
      tone,
      companyName,
      isEmergency
    );

    return res.json({
      message: fallbackMessage,
      source: 'smart-template-fallback',
      warning: error?.message || 'Using smart fallback draft',
    });
  }
});

// Production or Vite development integration
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development: use Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production: serve built assets from dist
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MissedCall AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failure:', err);
  process.exit(1);
});
