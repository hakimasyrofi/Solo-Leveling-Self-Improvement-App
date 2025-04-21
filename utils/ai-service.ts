// Utility functions for AI API key management and quest generation

// Store the API key in localStorage
export const storeAPIKey = (provider: string, apiKey: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("soloLevelUpAIProvider", provider)
    localStorage.setItem("soloLevelUpAIKey", apiKey)
  }
}

// Retrieve the API provider from localStorage
export const getAIProvider = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("soloLevelUpAIProvider") || "openai"
  }
  return null
}

// Retrieve the API key from localStorage
export const getAPIKey = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("soloLevelUpAIKey")
  }
  return null
}

// Check if any API key exists
export const hasAPIKey = (): boolean => {
  return getAPIKey() !== null
}

// Remove the API key from localStorage
export const removeAPIKey = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("soloLevelUpAIProvider")
    localStorage.removeItem("soloLevelUpAIKey")
  }
}

// Interface for AI-generated quest data
export interface AIQuestData {
  title: string
  description: string
  difficulty: "S" | "A" | "B" | "C" | "D" | "E"
  expiry: string
  expReward: number
  statPointsReward: number
  goldReward: number
  statRewards: {
    str?: number
    agi?: number
    per?: number
    int?: number
    vit?: number
  }
  itemRewards?: {
    name: string
    type: string
    description: string
  }[]
}

// Generate quest data using OpenAI API
const generateQuestWithOpenAI = async (description: string): Promise<AIQuestData> => {
  const apiKey = getAPIKey()

  if (!apiKey) {
    throw new Error("OpenAI API key not found")
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for a Solo Leveling themed self-improvement app. 
            The user will provide a quest description, and you need to generate appropriate quest data.
            Format your response as a valid JSON object with the following structure:
            {
              "title": "Short, catchy title for the quest",
              "description": "Refined, motivational description of the quest",
              "difficulty": "One of: S, A, B, C, D, E (S is hardest, E is easiest)",
              "expiry": "One of: Daily, Weekly, Monthly, One-time",
              "expReward": number (10-500 based on difficulty),
              "statPointsReward": number (1-10 based on difficulty),
              "goldReward": number (10-1000 based on difficulty),
              "statRewards": {
                "str": number (optional),
                "agi": number (optional),
                "per": number (optional),
                "int": number (optional),
                "vit": number (optional)
              },
              "itemRewards": [
                {
                  "name": "Item name",
                  "type": "One of: Material, Consumable, Weapon, Armor, Accessory, Rune",
                  "description": "Brief description of the item"
                }
              ] (optional)
            }
            Analyze the description to determine appropriate stats to reward based on the activity.
            For example, physical activities should reward STR and VIT, mental activities should reward INT and PER, etc.
            The difficulty should be based on how challenging the task seems.
            Only include 1-2 item rewards for difficult quests (S, A, B), and none for easier quests.`,
          },
          {
            role: "user",
            content: description,
          },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    // Parse the JSON response
    try {
      const questData = JSON.parse(content) as AIQuestData
      return questData
    } catch (error) {
      console.error("Failed to parse OpenAI response:", content)
      throw new Error("Failed to parse AI response")
    }
  } catch (error) {
    console.error("Error generating quest data with OpenAI:", error)
    throw error
  }
}

// Generate quest data using Gemini API
const generateQuestWithGemini = async (description: string): Promise<AIQuestData> => {
  const apiKey = getAPIKey()

  if (!apiKey) {
    throw new Error("Gemini API key not found")
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are an AI assistant for a Solo Leveling themed self-improvement app. 
                I will provide a quest description, and you need to generate appropriate quest data.
                Format your response as a valid JSON object with the following structure:
                {
                  "title": "Short, catchy title for the quest",
                  "description": "Refined, motivational description of the quest",
                  "difficulty": "One of: S, A, B, C, D, E (S is hardest, E is easiest)",
                  "expiry": "One of: Daily, Weekly, Monthly, One-time",
                  "expReward": number (10-500 based on difficulty),
                  "statPointsReward": number (1-10 based on difficulty),
                  "goldReward": number (10-1000 based on difficulty),
                  "statRewards": {
                    "str": number (optional),
                    "agi": number (optional),
                    "per": number (optional),
                    "int": number (optional),
                    "vit": number (optional)
                  },
                  "itemRewards": [
                    {
                      "name": "Item name",
                      "type": "One of: Material, Consumable, Weapon, Armor, Accessory, Rune",
                      "description": "Brief description of the item"
                    }
                  ] (optional)
                }
                Analyze the description to determine appropriate stats to reward based on the activity.
                For example, physical activities should reward STR and VIT, mental activities should reward INT and PER, etc.
                The difficulty should be based on how challenging the task seems.
                Only include 1-2 item rewards for difficult quests (S, A, B), and none for easier quests.
                
                Quest description: ${description}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          },
        }),
      },
    )

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Extract the content from Gemini's response format
    const content = data.candidates[0].content.parts[0].text

    // Find the JSON object in the response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not find JSON in Gemini response")
    }

    // Parse the JSON response
    try {
      const questData = JSON.parse(jsonMatch[0]) as AIQuestData
      return questData
    } catch (error) {
      console.error("Failed to parse Gemini response:", content)
      throw new Error("Failed to parse AI response")
    }
  } catch (error) {
    console.error("Error generating quest data with Gemini:", error)
    throw error
  }
}

// Generate quest data using the selected AI provider
export const generateQuestData = async (description: string): Promise<AIQuestData> => {
  const provider = getAIProvider()

  if (provider === "gemini") {
    return generateQuestWithGemini(description)
  } else {
    // Default to OpenAI
    return generateQuestWithOpenAI(description)
  }
}
