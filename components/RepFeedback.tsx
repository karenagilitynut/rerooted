'use client';

import { motion } from 'framer-motion';

interface RepFeedbackProps {
  repType: 'regulation' | 'reinforcement' | 'awareness';
}

const REP_MESSAGES = {
  regulation: [
    "This counts. You stayed with something your system usually reacts to.",
    "You're building capacity to be with discomfort without fixing it.",
    "Your nervous system is learning it's safe to feel this.",
    "This is the work. Staying present when it's hard.",
  ],
  reinforcement: [
    "You're training your brain to notice what feels safe.",
    "Your RAS is learning to scan for evidence of goodness.",
    "Small moments like this rewire old protective patterns.",
    "This is how you teach your system that good things are real.",
  ],
  awareness: [
    "Small awareness like this is how patterns shift over time.",
    "You're building the muscle of noticing without judgment.",
    "Consistent presence changes your baseline over time.",
    "This kind of check-in is evidence of growth itself.",
  ],
};

const INSIGHTS = [
  "Your Reticular Activating System (RAS) notices what you pay attention to. What you practice seeing becomes what you see more of.",
  "The nervous system learns through repetition, not insight. Small consistent practice creates more change than big realizations.",
  "Childhood patterns formed to keep you safe. They're not wrong—they're outdated strategies that once protected you.",
  "Change happens in the body first, understanding comes later. Your system is already learning even when your mind isn't convinced.",
  "Secure attachment is built through repeated experiences of being seen and staying regulated, not through perfect relationships.",
  "Your nervous system can't tell the difference between old danger and current safety without practice. These reps are that practice.",
  "Anxious and avoidant patterns aren't opposites—they're both protection strategies. Both can shift toward earned security.",
  "The goal isn't to eliminate emotions. It's to increase your capacity to be with them without collapsing or disconnecting.",
];

export default function RepFeedback({ repType }: RepFeedbackProps) {
  const messages = REP_MESSAGES[repType];
  const message = messages[Math.floor(Math.random() * messages.length)];
  const insight = INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 py-8"
    >
      <div className="text-center space-y-2">
        <p className="text-lg text-slate-700 font-medium leading-relaxed">
          {message}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-slate-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div className="bg-slate-50 rounded-lg p-6 border border-slate-100">
        <p className="text-sm text-slate-600 leading-relaxed italic">
          {insight}
        </p>
      </div>
    </motion.div>
  );
}
