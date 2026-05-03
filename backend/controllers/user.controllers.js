export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.json({ user: null });
    }
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({
      message: `Internal server error ${error}`,
    });
  }
};

import { generateResponse } from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";

export const generateDemo = async (req, res) => {
  try {

    const result = await generateResponse("Hello");

    // const content = result.choices[0].message.content;

    // const data = extractJson(content);

    return res.status(200).json(result);

  } catch (error) {
    console.error("Error generating website:", error);
    res.status(500).json({ error: "Failed to generate website" });
  }
};
