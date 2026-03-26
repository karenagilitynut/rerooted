'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import RepFeedback from './RepFeedback';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export type CheckInType = 'charged' | 'positive' | 'neutral';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Reflection {
  trigger: string;
  core_story: string;
  reframe: string;
  identity_shift: string;
  ai_summary?: string;
}

interface ChatCheckInProps {
  checkInType: CheckInType;
  attachmentType: 'anxious' | 'avoidant' | 'fearful' | 'secure';
  profileId?: string;
  onBack: () => void;
  onComplete: () => void;
}

const getInitialMessage = (checkInType: CheckInType): string => {
  switch (checkInType) {
    case 'charged':
      return 'What felt hard today — even something small?';
    case 'positive':
      return 'What stood out today — even a small moment?';
    case 'neutral':
      return 'What felt noticeable today?';
  }
};

const getQuickReplies = (checkInType: CheckInType): string[] => {
  switch (checkInType) {
    case 'charged':
      return ['It felt important', 'I\'m not sure why it bothered me', 'It surprised me'];
    case 'positive':
      return ['That felt important', 'I\'m not sure why it mattered', 'It surprised me', 'I want more like this'];
    case 'neutral':
      return ['Just checking in', 'Nothing big', 'Noticing patterns'];
  }
};

const getRepType = (checkInType: CheckInType): 'regulation' | 'reinforcement' | 'awareness' => {
  switch (checkInType) {
    case 'charged':
      return 'regulation';
    case 'positive':
      return 'reinforcement';
    case 'neutral':
      return 'awareness';
  }
};

export default function ChatCheckIn({ attachmentType, checkInType, profileId, onBack, onComplete }: ChatCheckInProps) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: getInitialMessage(checkInType) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reflection, setReflection] = useState<Reflection | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSend = async (messageText?: string) => {
    const userMessage = messageText || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setShowQuickReplies(false);

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      console.log('[Frontend] Sending message to API...');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          checkInType,
          attachmentType,
          profileId
        })
      });

      console.log('[Frontend] Response status:', response.status);
      console.log('[Frontend] Response ok:', response.ok);
      console.log('[Frontend] Response headers:', {
        contentType: response.headers.get('content-type')
      });

      const responseText = await response.text();
      console.log('[Frontend] Raw response text (first 500 chars):', responseText.substring(0, 500));

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('[Frontend] Parsed response data:', {
          success: data.success,
          completed: data.completed,
          hasMessage: !!data.message,
          hasReflection: !!data.reflection,
          hasError: !!data.error
        });
      } catch (parseError) {
        console.error('[Frontend] Failed to parse response as JSON:', parseError);
        throw new Error('Received invalid response from server. Please try again.');
      }

      if (!data.success) {
        console.error('[Frontend] API returned error:', data.error);
        throw new Error(data.error || 'Failed to get response');
      }

      if (data.completed && data.reflection) {
        console.log('[Frontend] Conversation completed, showing reflection');
        const assistantReflection: Reflection = {
          trigger: data.reflection.trigger,
          core_story: data.reflection.core_story,
          reframe: data.reflection.reframe,
          identity_shift: data.reflection.identity_shift
        };

        setReflection(assistantReflection);
        await saveReflection(newMessages, assistantReflection);
      } else if (data.message) {
        console.log('[Frontend] Adding assistant message to conversation');
        setMessages([...newMessages, { role: 'assistant', content: data.message }]);
      } else {
        console.error('[Frontend] Response missing both message and reflection');
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('[Frontend] Chat error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
      setMessages([
        ...newMessages,
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveReflection = async (conversationMessages: Message[], reflectionData: Reflection) => {
    try {
      const { data: checkinData, error: checkinError } = await supabase
        .from('checkins')
        .insert({
          profile_id: profileId || null,
          attachment_type: attachmentType,
          check_in_type: checkInType,
          trigger: reflectionData.trigger,
          core_story: reflectionData.core_story,
          reframe: reflectionData.reframe,
          identity_shift: reflectionData.identity_shift,
          ai_summary: reflectionData.ai_summary || null,
          completed_at: new Date().toISOString(),
          date: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (checkinError) throw checkinError;

      const { data: conversationData, error: conversationError } = await supabase
        .from('chat_conversations')
        .insert({
          messages: conversationMessages,
          reflection_id: checkinData?.id,
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .select()
        .maybeSingle();

      if (conversationError) throw conversationError;

      setConversationId(conversationData?.id);

      const { data: { user } } = await supabase.auth.getUser();
      if (user && checkinData?.id) {
        await supabase
          .from('user_reps')
          .insert({
            user_id: user.id,
            rep_type: getRepType(checkInType),
            checkin_id: checkinData.id
          });
      }
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (reflection) {
    return (
      <div className="flex-1 space-y-5">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-12 w-12 active:scale-95 transition-transform text-[#2E2A26] hover:bg-[#E8E1D5]"
            onClick={onComplete}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#2E2A26]">Your Reflection</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
            <CardContent className="p-8 space-y-6">
              <RepFeedback repType={getRepType(checkInType)} />

              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                    What Happened
                  </h3>
                  <p className="text-base text-[#2E2A26] leading-relaxed">
                    {reflection.trigger}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                    The Pattern
                  </h3>
                  <p className="text-base text-[#2E2A26] leading-relaxed">
                    {reflection.core_story}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                    A Fairer View
                  </h3>
                  <p className="text-base text-[#2E2A26] leading-relaxed">
                    {reflection.reframe}
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                    What to Practice
                  </h3>
                  <p className="text-base text-[#2E2A26] leading-relaxed">
                    {reflection.identity_shift}
                  </p>
                </div>
              </div>

              <Button
                onClick={onComplete}
                className="w-full h-14 rounded-full text-base font-semibold bg-[#7A8F7B] hover:bg-[#6B7F6C] text-white"
              >
                Done
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-5">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 active:scale-95 transition-transform text-[#2E2A26] hover:bg-[#E8E1D5]"
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Check In</h1>
      </div>

      <div className="flex-1 overflow-y-auto mb-5 space-y-4 px-1">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] px-5 py-4 rounded-[24px] ${
                  message.role === 'user'
                    ? 'bg-[#7A8F7B] text-white'
                    : 'bg-[#F5F2ED] text-[#2E2A26]'
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#F5F2ED] px-5 py-4 rounded-[24px]">
              <div className="flex gap-2">
                <motion.div
                  className="w-2 h-2 bg-[#7A8F7B] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#7A8F7B] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 bg-[#7A8F7B] rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="sticky bottom-0 bg-[#FAF8F4] pb-5 space-y-3">
        {showQuickReplies && messages.length <= 2 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-wrap gap-2"
          >
            {getQuickReplies(checkInType).map((reply) => (
              <Button
                key={reply}
                onClick={() => handleSend(reply)}
                variant="outline"
                className="rounded-full px-4 py-2 h-auto text-sm border-2 border-[#D8D2C8] bg-white hover:bg-[#F5F2ED] hover:border-[#7A8F7B] text-[#2E2A26] transition-all"
              >
                {reply}
              </Button>
            ))}
          </motion.div>
        )}

        <div className="flex gap-3 items-end">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type here..."
            disabled={isLoading}
            className="flex-1 min-h-[56px] max-h-[200px] text-base rounded-[28px] border-2 border-[#D8D2C8] focus:border-[#7A8F7B] resize-none px-5 py-4 disabled:opacity-50"
            rows={1}
          />
          <Button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="h-[56px] w-[56px] rounded-full bg-[#7A8F7B] hover:bg-[#6B7F6C] text-white disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
