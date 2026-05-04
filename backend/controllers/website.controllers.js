const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
`;

import { generateResponse } from "../config/openRouter.js";
import User from "../models/user.model.js";
import Website from "../models/website.model.js";

const parseAIResponse = async (prompt) => {
  let raw = "";
  let parsed = null;

  for (let i = 0; i < 3; i++) {
    raw = await generateResponse(
      i === 0 ? prompt : prompt + "\n\nCRITICAL: Return ONLY valid JSON with no extra text, markdown, or explanations. Format: {\"message\": \"confirmation\", \"code\": \"<html...>\"}",
    );

    console.log(`AI Response Attempt ${i + 1}:`, raw);

    try {
      // Clean the response by removing any markdown code blocks
      let cleanResponse = raw.trim();
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }

      parsed = JSON.parse(cleanResponse);
      if (parsed && typeof parsed === 'object' && parsed.code && parsed.message) {
        console.log('Successfully parsed AI response');
        break;
      } else {
        console.log('Parsed response missing required fields:', parsed);
        parsed = null;
      }
    } catch (error) {
      console.log('JSON parse error:', error.message);
      parsed = null;
    }
  }

  return parsed;
};

export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        message: "Not enough credits to generate website",
      });
    }

    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);
    const parsed = await parseAIResponse(finalPrompt);

    if (!parsed || !parsed.code) {
      return res.status(400).json({
        message: "AI returned invalid response",
      });
    }

    // Generate unique slug
    const slug = prompt.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 60);
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const uniqueSlug = `${slug}-${randomSuffix}`;

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 60),
      latestCode: parsed.code,
      slug: uniqueSlug,
      conversation: [
        {
          role: "user",
          content: prompt,
        },
        {
          role: "ai",
          content: parsed.message,
        },
      ],
    });

    user.credits -= 50;
    await user.save();

    return res.status(201).json({
      websiteId: website._id,
      remainingCredits: user.credits,
    });
  } catch (error) {
    console.error("Error generating website:", error);

    return res.status(500).json({
      message: "Internal server error",
      details: error.message,
    });
  }
};

export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        message: "Website not found",
      });
    }

    return res.status(200).json(website);
  } catch (error) {
    return res.status(500).json({
      message: `Get website by ID error: ${error.message}`,
    });
  }
};

export const changes = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }

    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        message: "Website not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.credits < 25) {
      return res.status(400).json({
        message: "Not enough credits to update website",
      });
    }

    const updatePrompt = `
You are a professional web developer. Update the existing website code with the requested changes.

EXISTING WEBSITE CODE:
${website.latestCode}

USER REQUEST:
${prompt}

INSTRUCTIONS:
- Make the requested changes to the existing code
- Keep all existing functionality and styling
- Ensure the website remains responsive and professional
- Return ONLY a valid JSON object with this exact format:
{"message": "Brief confirmation of changes made", "code": "<complete updated HTML document>"}

Do not include any explanations, markdown, or extra text outside the JSON.`;

    const parsed = await parseAIResponse(updatePrompt);

    if (!parsed || !parsed.code) {
      console.error('AI failed to return valid response after 3 attempts');
      return res.status(400).json({
        message: "AI service temporarily unavailable. Please try again with a simpler request.",
      });
    }

    website.conversation.push(
      {
        role: "user",
        content: prompt,
      },
      {
        role: "ai",
        content: parsed.message,
      },
    );

    website.latestCode = parsed.code;

    await website.save();

    user.credits -= 25;
    await user.save();

    return res.status(200).json({
      message: parsed.message,
      code: parsed.code,
      remainingCredits: user.credits,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Update website error: ${error.message}`,
    });
  }
};

// controller to save the website code without generating new code, just update the latest code with the one sent from frontend, this is for the safe save system in the editor
export const safeSave = async (req, res) => {
  try {
    const { code } = req.body;
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        message: "Website not found",
      });
    }

    website.latestCode = code;
    await website.save();

    return res.status(200).json({
      message: "Website saved successfully",
      code: website.latestCode,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Safe save error: ${error.message}`,
    });
  }
};

export const getAll = async (req, res) => {
  try {
    const websites = await Website.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json(websites);
  } catch (error) {
    return res.status(500).json({
      message: `Get all websites error: ${error.message}`,
    });
  }
};

export const deploy = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(400).json({ message: "website not found" });
    }

    if (!website.slug) {
      const slug = website.title.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 60);
      const randomSuffix = Math.random().toString(36).substring(2, 8);
      website.slug = `${slug}-${randomSuffix}`;
    }

    website.deployed = true;
    website.deployUrl = `${process.env.FRONTEND_URL}/site/${website.slug}`;
    await website.save();
    return res.status(200).json({
      message: "Website deployed successfully",
      url:website.deployUrl
    });
  } 
  
  catch (error) {
    console.error("Deployment error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export const getBySlug = async (req, res) => {
  try {
    const website = await Website.findOne({
      slug: req.params.slug,
      user: req.user._id,
    });

    if (!website) {
      return res.status(400).json({
        message: "website not found",
      });
    }

    return res.status(200).json(website);

  } catch (error) {
    console.error("Error fetching website by slug:", error);

    return res.status(500).json({
      message: "get by slug: Internal server error",
    });
  }
};