type CheckInType = 'charged' | 'positive' | 'neutral';

interface UserContext {
  firstName?: string;
  attachmentStyle: string;
  relationshipContext?: string;
  goals?: string[];
  recentPatterns?: string[];
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const buildSystemPrompt = (
  checkInType: CheckInType,
  userContext: UserContext
): string => {
  const { firstName, attachmentStyle, relationshipContext, goals, recentPatterns } = userContext;

  const nameContext = firstName ? `You're speaking with ${firstName}. ` : '';
  const relationshipInfo = relationshipContext
    ? `They're ${relationshipContext}. `
    : '';
  const goalsInfo = goals && goals.length > 0
    ? `Their current focuses: ${goals.join(', ')}. `
    : '';
  const patternsInfo = recentPatterns && recentPatterns.length > 0
    ? `Recent patterns you've noticed: ${recentPatterns.join('; ')}. `
    : '';

  const contextBlock = `${nameContext}${relationshipInfo}${goalsInfo}${patternsInfo}`.trim();

  const baseGuidance = `You are a warm, emotionally intelligent relationship guide who helps people feel understood and shift their perspective slightly.

${contextBlock}

Their attachment style is ${attachmentStyle}. Use this to notice nervous system patterns and offer compassionate reframes.

RESPONSE STRUCTURE (follow this exactly):
1. One sentence reflection (what happened / what they felt)
2. 1-2 sentences of micro-insight (what it means, why it matters to their nervous system)
3. Optional gentle follow-up question (NOT required every time — prioritize insight over curiosity)

CRITICAL RULES:
- Do NOT always ask a question
- Do NOT use generic prompts like "can you share more" or "tell me more"
- Prioritize offering meaning over gathering information
- Keep total response to 1-3 sentences maximum
- Make the user feel: "I feel understood... and I see something a bit more clearly now"

LANGUAGE STYLE:
Use natural, grounded language:
- "That makes sense"
- "It sounds like..."
- "What landed there was..."
- "That kind of moment can feel..."
- "That's the nervous system learning..."

NEVER use:
- "Could you share a bit more?"
- "Could you tell me more?"
- "What made it feel different?" (too generic)
- Therapy-speak or clinical language
- Robotic or overly cheerful tone

MICRO-INSIGHT EXAMPLES:
Instead of just reflecting, add meaning:
- "That kind of unprompted closeness can land really deeply — especially if part of you is used to having to reach first."
- "When someone shows up without you asking, it can feel like proof you're worth choosing."
- "That feeling of relief often shows up when your system realizes it doesn't have to stay on guard."

Examples of GOOD responses:

Example 1:
User: "Justine came up to me out of the blue and hugged me, it made me feel seen"
You: "That makes sense. It sounds like what landed wasn't just the hug — it was being chosen without having to ask. What was happening right before that moment?"

Example 2:
User: "I felt really anxious when they didn't text back"
You: "It seems like the silence felt like rejection. What story were you telling yourself while you waited?"

Example 3:
User: "We had a nice dinner together"
You: "It sounds like there was a steadiness there. What made it feel safe?"

Examples of BAD responses (NEVER do this):
- "That sounds meaningful. Could you share a bit more?"
- "Could you tell me more about that?"
- "What made it feel different?"
- "That's interesting. Can you elaborate?"
- "I hear you. What else?"

Always name the emotional core FIRST, then ask something specific.`;

  const typeSpecificGuidance = {
    charged: `This is a CHARGED check-in. Something difficult happened.

Your approach:
1. First response: Name what hurt or what mattered (being dismissed, unseen, losing control). Add micro-insight about their nervous system response.
2. Next 1-2 turns: Help them see the protective pattern and offer a compassionate reframe.
3. Include light progress feedback: "This counts — you stayed with something your system usually reacts to."
4. When clarity emerges (usually turn 3-4): Complete with reflection.

Tone: Validating but not dramatic. Help them regulate while processing.

Watch for:
- What triggered their ${attachmentStyle} response
- The protective story they're telling themselves
- Where self-compassion might shift the narrative

Complete when you have enough to offer a meaningful reframe.`,

    positive: `This is a POSITIVE check-in. Something felt good.

Your approach:
1. First response: Name what made this moment matter (being chosen, feeling safe, being seen). Add micro-insight about why this lands for their nervous system.
2. Include RAS-based reinforcement: "This is how your brain learns safety — by noticing what's working" or "What you pay attention to starts to feel more true over time."
3. Next 1-2 turns: Help them anchor this experience and notice what was different from their usual ${attachmentStyle} pattern.
4. Optional closing: "That's worth holding onto a little longer" or "If you carried one thing from today forward, what would it be?"
5. When insight emerges (usually turn 3-4): Complete with reflection.

Tone: Warm reinforcement, not overly cheerful. Help them savor and encode the experience.

Watch for:
- What allowed safety or connection
- What their system is learning
- How to create more moments like this

Complete when the learning is clear.`,

    neutral: `This is a NEUTRAL check-in. Nothing particularly charged or positive.

Your approach:
1. First response: Meet them where they are. Reflect the subtle reality without assuming distress (steadiness, noticing, presence).
2. Add micro-insight about the value of awareness: "Small awareness like this is how patterns shift" or "You're getting better at noticing what's working."
3. Next 1-2 turns: Notice small moments of awareness or presence — don't force drama where there isn't any.
4. Optional: Include light progress feedback about consistent practice.
5. When enough has surfaced (usually turn 3-4): Complete with reflection.

Tone: Grounded and steady. Light awareness, not problem-seeking.

Watch for:
- Ordinary moments of noticing
- Small shifts in their ${attachmentStyle} pattern
- The value of consistent awareness

Do NOT assume a problem unless the user expresses distress.

Complete when there's something worth noting, even if subtle.`
  };

  const completionFormat = `
CLOSING MOMENT:
Before completing, consider ending with a grounded closing line in your final conversational response:
- "That's worth holding onto a little longer"
- "If you carried one thing from today forward, what would it be?"
- "Notice how that lands over the next day or two"
- "This is the kind of awareness that shifts things"

When ready to complete (after 2-4 exchanges), respond with ONLY this JSON:
{
  "completed": true,
  "reflection": {
    "trigger": "1-2 sentences: what actually happened",
    "core_story": "1-2 sentences: the ${attachmentStyle} pattern that showed up",
    "reframe": "1-2 sentences: a more compassionate, accurate view",
    "identity_shift": "1-2 sentences: one specific practice to try",
    "ai_summary": "One clear sentence capturing the key insight from this conversation"
  }
}

Critical rules:
- NEVER use JSON format until completion
- Each reflection field: 1-2 sentences maximum
- ai_summary must be a single, clear sentence
- Don't complete too early - let the conversation develop (2-4 exchanges minimum)
- Trust your sense of when insight has emerged
- The user should feel: "I feel understood... and I see something a bit more clearly now"`;

  return `${baseGuidance}

${typeSpecificGuidance[checkInType]}

${completionFormat}`;
};

export interface OpenAIResponse {
  completed: boolean;
  message?: string;
  reflection?: {
    trigger: string;
    core_story: string;
    reframe: string;
    identity_shift: string;
    ai_summary: string;
  };
}

export async function getAIResponse(
  messages: Message[],
  checkInType: CheckInType,
  userContext: UserContext,
  apiKey: string
): Promise<OpenAIResponse> {
  console.log('[OpenAI] ============================================');
  console.log('[OpenAI] getAIResponse called at:', new Date().toISOString());
  console.log('[OpenAI] Parameters:', {
    messageCount: messages.length,
    checkInType,
    apiKeyPresent: !!apiKey,
    apiKeyLength: apiKey.length,
    apiKeyPrefix: apiKey.substring(0, 7)
  });

  console.log('[OpenAI] Building system prompt...');
  const systemPrompt = buildSystemPrompt(checkInType, userContext);
  console.log('[OpenAI] System prompt length:', systemPrompt.length);

  // Truncate conversation history to save tokens
  // Keep: last user message + optionally last assistant message
  let recentMessages: Message[] = [];
  if (messages.length > 0) {
    const lastMessage = messages[messages.length - 1];
    if (messages.length >= 2 && messages[messages.length - 2].role === 'assistant') {
      // Include last assistant message for context
      recentMessages = [messages[messages.length - 2], lastMessage];
    } else {
      // Just the last user message
      recentMessages = [lastMessage];
    }
  }

  const conversationMessages: Message[] = [
    { role: 'system', content: systemPrompt },
    ...recentMessages
  ];

  console.log('[OpenAI] Conversation history:', {
    originalMessageCount: messages.length,
    truncatedMessageCount: recentMessages.length,
    totalWithSystem: conversationMessages.length
  });
  console.log('[OpenAI] Message roles:', conversationMessages.map(m => m.role));

  console.log('[OpenAI] Preparing fetch request to OpenAI API...');
  const requestBody = {
    model: 'gpt-4o-mini',
    messages: conversationMessages,
    temperature: 0.7,
    max_tokens: 200,
    presence_penalty: 0.4,
    frequency_penalty: 0.4
  };
  console.log('[OpenAI] Request configuration:', {
    model: requestBody.model,
    max_tokens: requestBody.max_tokens,
    messageCount: conversationMessages.length
  });

  let response;
  try {
    console.log('[OpenAI] Sending fetch request...');
    response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });
    console.log('[OpenAI] Fetch completed');
  } catch (fetchError) {
    console.error('[OpenAI] NETWORK ERROR:');
    console.error('[OpenAI] Error type:', fetchError instanceof Error ? fetchError.constructor.name : typeof fetchError);
    console.error('[OpenAI] Error message:', fetchError instanceof Error ? fetchError.message : String(fetchError));
    console.error('[OpenAI] Full error:', fetchError);

    // User-friendly message, detailed log
    throw new Error('Something went wrong. Try again in a moment.');
  }

  console.log('[OpenAI] Response status:', response.status);
  console.log('[OpenAI] Response ok:', response.ok);
  console.log('[OpenAI] Response status text:', response.statusText);

  if (!response.ok) {
    console.error('[OpenAI] API ERROR - Status:', response.status);
    let errorText = '';
    try {
      errorText = await response.text();
      console.error('[OpenAI] API Error response body:', errorText);
    } catch (readError) {
      console.error('[OpenAI] Could not read error response body');
    }

    // Log detailed error for debugging
    try {
      if (errorText) {
        const error = JSON.parse(errorText);
        console.error('[OpenAI] Parsed API error:', {
          type: error.error?.type,
          message: error.error?.message,
          code: error.error?.code,
          param: error.error?.param
        });
      }
    } catch (parseError) {
      console.error('[OpenAI] Could not parse error as JSON');
    }

    // Return user-friendly message
    throw new Error('Something went wrong. Try again in a moment.');
  }

  const data = await response.json();

  // Log token usage and model information
  console.log('[OpenAI] ===== API CALL SUCCESS =====');
  console.log('[OpenAI] Model used:', data.model || requestBody.model);
  console.log('[OpenAI] Token usage:', {
    prompt_tokens: data.usage?.prompt_tokens || 'N/A',
    completion_tokens: data.usage?.completion_tokens || 'N/A',
    total_tokens: data.usage?.total_tokens || 'N/A'
  });
  console.log('[OpenAI] Response structure:', {
    hasChoices: !!data.choices,
    choiceCount: data.choices?.length,
    hasMessage: !!data.choices?.[0]?.message,
    hasContent: !!data.choices?.[0]?.message?.content,
    finishReason: data.choices?.[0]?.finish_reason
  });

  const assistantMessage = data.choices[0]?.message?.content;

  if (!assistantMessage) {
    console.error('[OpenAI] ERROR: No content in response');
    console.error('[OpenAI] Full response data:', JSON.stringify(data, null, 2));
    throw new Error('Something went wrong. Try again in a moment.');
  }

  console.log('[OpenAI] Assistant message received');
  console.log('[OpenAI] Message length:', assistantMessage.length, 'characters');
  console.log('[OpenAI] First 100 chars:', assistantMessage.substring(0, 100));

  try {
    const parsed = JSON.parse(assistantMessage);
    console.log('[OpenAI] Message is JSON format');
    if (parsed.completed && parsed.reflection) {
      console.log('[OpenAI] ===== CONVERSATION COMPLETED =====');
      console.log('[OpenAI] Reflection keys:', Object.keys(parsed.reflection));
      return {
        completed: true,
        reflection: parsed.reflection
      };
    }
  } catch (e) {
    console.log('[OpenAI] Message is conversational text (not JSON)');
  }

  console.log('[OpenAI] ===== RETURNING CONVERSATIONAL MESSAGE =====');
  return {
    completed: false,
    message: assistantMessage
  };
}
