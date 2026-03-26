import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getAIResponse } from '@/lib/openai-service';

export const dynamic = 'force-dynamic';

type CheckInType = 'charged' | 'positive' | 'neutral';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getUserContext(profileId?: string) {
  if (!profileId) {
    return {
      attachmentStyle: 'anxious',
      goals: [],
      recentPatterns: []
    };
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('name, attachment_type, relationship_status, goals')
    .eq('id', profileId)
    .maybeSingle();

  const { data: recentCheckins } = await supabase
    .from('checkins')
    .select('ai_summary, completed_at')
    .eq('profile_id', profileId)
    .not('ai_summary', 'is', null)
    .order('completed_at', { ascending: false })
    .limit(3);

  const recentPatterns = recentCheckins
    ?.map(c => c.ai_summary)
    .filter(Boolean) || [];

  return {
    firstName: profile?.name || undefined,
    attachmentStyle: profile?.attachment_type || 'anxious',
    relationshipContext: profile?.relationship_status || undefined,
    goals: (profile && Array.isArray(profile.goals)) ? (profile.goals as string[]) : [],
    recentPatterns
  };
}

export async function POST(request: Request) {
  console.log('[API] ============================================');
  console.log('[API] Chat request received at:', new Date().toISOString());
  console.log('[API] OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
  console.log('[API] OpenAI API Key starts with:', process.env.OPENAI_API_KEY?.substring(0, 7));

  try {
    const body = await request.json();
    console.log('[API] Request body parsed successfully');
    console.log('[API] Request details:', {
      hasMessages: !!body.messages,
      messageCount: body.messages?.length,
      checkInType: body.checkInType,
      attachmentType: body.attachmentType,
      profileId: body.profileId
    });

    const {
      messages,
      checkInType = 'charged',
      attachmentType = 'anxious',
      profileId
    } = body;

    if (!messages || !Array.isArray(messages)) {
      console.error('[API] ERROR: Invalid messages format');
      return NextResponse.json({
        success: false,
        error: 'Invalid messages format'
      }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    console.log('[API] Checking API key...');
    console.log('[API] API key exists:', !!apiKey);
    console.log('[API] API key is placeholder:', apiKey === 'your_openai_api_key_here');

    if (!apiKey || apiKey === 'your_openai_api_key_here') {
      console.error('[API] ERROR: OpenAI API key not configured');
      return NextResponse.json({
        success: false,
        error: 'OpenAI API key not configured. Please add your API key to the .env file.'
      }, { status: 500 });
    }
    console.log('[API] API key validation passed');

    console.log('[API] Fetching user context...');
    const userContext = await getUserContext(profileId);
    console.log('[API] User context fetched:', {
      firstName: userContext.firstName,
      attachmentStyle: userContext.attachmentStyle,
      hasRelationshipContext: !!userContext.relationshipContext,
      goalsCount: userContext.goals?.length || 0,
      recentPatternsCount: userContext.recentPatterns?.length || 0
    });

    console.log('[API] Calling OpenAI service...');
    console.log('[API] Parameters:', {
      messageCount: messages.length,
      checkInType,
      apiKeyLength: apiKey.length
    });

    let result;
    try {
      result = await getAIResponse(
        messages,
        checkInType,
        userContext,
        apiKey
      );
      console.log('[API] OpenAI service returned successfully');
      console.log('[API] Result structure:', {
        completed: result.completed,
        hasMessage: !!result.message,
        hasReflection: !!result.reflection,
        messageLength: result.message?.length,
        reflectionKeys: result.reflection ? Object.keys(result.reflection) : []
      });
    } catch (openaiError) {
      console.error('[API] ERROR in OpenAI service call:');
      console.error('[API] Error type:', openaiError instanceof Error ? openaiError.constructor.name : typeof openaiError);
      console.error('[API] Error message:', openaiError instanceof Error ? openaiError.message : String(openaiError));
      if (openaiError instanceof Error && openaiError.stack) {
        console.error('[API] Error stack:', openaiError.stack);
      }
      throw openaiError;
    }

    // Always return success with the same structure
    const response = {
      success: true,
      completed: result.completed,
      message: result.message || undefined,
      reflection: result.reflection || undefined
    };

    console.log('[API] Returning response:', {
      success: response.success,
      completed: response.completed,
      hasMessage: !!response.message,
      hasReflection: !!response.reflection
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('[API] ============================================');
    console.error('[API] CATCH BLOCK - Top level error handler');
    console.error('[API] Error caught at:', new Date().toISOString());
    console.error('[API] Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('[API] Error message:', error instanceof Error ? error.message : String(error));

    if (error instanceof Error) {
      console.error('[API] Error name:', error.name);
      console.error('[API] Error stack:', error.stack);
    }

    // Return the actual error message to help with debugging
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred. Please try again.';
    console.error('[API] Returning error response:', errorMessage);

    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status: 500 });
  }
}
