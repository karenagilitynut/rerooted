'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Heart, Lightbulb, Target, TrendingUp } from 'lucide-react';

const connectionRituals = {
  avoidant: [
    {
      title: "Stay 10% Longer",
      why: "Your instinct is to pull away when things feel too close. This keeps you safe, but it also prevents deeper safety from forming.",
      practice: "Next time you feel the urge to disconnect, stay just 10% longer than you normally would. One more minute, one more sentence, one more moment.",
      expect: "It will feel slightly uncomfortable. That's the edge of change.",
      builds: "You teach your system that staying doesn't mean losing yourself."
    },
    {
      title: "Name It Before You Leave",
      why: "You often take space without explaining, which can feel like disconnection to your partner.",
      practice: "Before you pull away, say one simple sentence: 'I'm feeling a bit overwhelmed, I just need a few minutes.'",
      expect: "It may feel unnecessary or vulnerable.",
      builds: "You create safety without losing space."
    }
  ],

  anxious: [
    {
      title: "One Clear Reach",
      why: "When connection feels uncertain, you tend to reach multiple times to feel safe.",
      practice: "Make one clear, direct reach. Then pause. No follow-up. No second message.",
      expect: "It will feel exposed and incomplete.",
      builds: "You learn that connection doesn't require urgency to survive."
    },
    {
      title: "Regulate Before You Reach",
      why: "Your system seeks connection when it feels unsafe.",
      practice: "Before reaching out, take 60 seconds. Breathe, ground, and ask: what do I actually need right now?",
      expect: "You may still want to reach — that's okay.",
      builds: "You stop outsourcing your safety."
    }
  ],

  fearful: [
    {
      title: "Name Both Sides",
      why: "You often feel pulled in two directions and don't know which one is right.",
      practice: "Say out loud: 'Part of me wants closeness, and part of me feels scared.'",
      expect: "It may feel confusing or vulnerable.",
      builds: "You stop fighting yourself."
    },
    {
      title: "Slow the Reaction",
      why: "Your system reacts quickly to both closeness and threat.",
      practice: "When you feel the urge to act (pull away or reach hard), pause for 30 seconds before doing anything.",
      expect: "It will feel intense at first.",
      builds: "You create space between feeling and action."
    }
  ],

  secure: [
    {
      title: "Name It Early",
      why: "You may wait until something builds before saying it.",
      practice: "Say one honest thing earlier than you normally would.",
      expect: "It may feel small or unnecessary.",
      builds: "You maintain clarity before tension builds."
    },
    {
      title: "Offer Stability",
      why: "Your steadiness is one of your greatest strengths.",
      practice: "In a moment of tension, say: 'We're okay. We'll figure this out.'",
      expect: "It may feel simple.",
      builds: "You reinforce safety in the relationship."
    }
  ]
};

interface ConnectionRitualsPageProps {
  attachmentType: 'anxious' | 'avoidant' | 'fearful' | 'secure';
  onBack: () => void;
}

export default function ConnectionRitualsPage({ attachmentType, onBack }: ConnectionRitualsPageProps) {
  const rituals = connectionRituals[attachmentType];
  const [selectedRitual, setSelectedRitual] = useState(0);

  return (
    <div className="flex-1 space-y-5">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-12 w-12 active:scale-95 transition-transform text-[#2E2A26] hover:bg-[#E8E1D5]"
          onClick={onBack}
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Connection Rituals</h1>
      </div>

      <div className="rounded-[32px] bg-gradient-to-br from-[#C47A5A] to-[#B36A4A] p-6 sm:p-8 text-white shadow-lg border border-[#D8D2C8]">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-3">
          Do this tonight
        </h2>
        <p className="text-base leading-relaxed text-white/90">
          These aren't concepts. These are practices designed for your nervous system.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {rituals.map((ritual, index) => (
          <button
            key={index}
            onClick={() => setSelectedRitual(index)}
            className={`flex-shrink-0 px-5 py-3 rounded-full text-sm font-medium transition-all active:scale-95 ${
              selectedRitual === index
                ? 'bg-[#7A8F7B] text-white shadow-md'
                : 'bg-white border-2 border-[#D8D2C8] text-[#2E2A26] hover:bg-[#E8E1D5]'
            }`}
          >
            Ritual {index + 1}
          </button>
        ))}
      </div>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl text-[#2E2A26]">
            {rituals[selectedRitual].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#2E2A26]/70">
              <Lightbulb className="h-5 w-5 text-[#C47A5A]" />
              <h3 className="font-semibold text-base">Why this matters</h3>
            </div>
            <p className="text-base leading-relaxed text-[#2E2A26]/80 pl-7">
              {rituals[selectedRitual].why}
            </p>
          </div>

          <div className="rounded-[28px] bg-gradient-to-br from-[#7A8F7B]/10 to-[#7A8F7B]/5 p-5 border border-[#7A8F7B]/20">
            <div className="flex items-center gap-2 mb-3 text-[#2E2A26]">
              <Target className="h-5 w-5 text-[#7A8F7B]" />
              <h3 className="font-semibold text-base">The Practice</h3>
            </div>
            <p className="text-base leading-relaxed text-[#2E2A26] font-medium">
              {rituals[selectedRitual].practice}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#2E2A26]/70">
              <Heart className="h-5 w-5 text-[#C47A5A]" />
              <h3 className="font-semibold text-base">What to expect</h3>
            </div>
            <p className="text-base leading-relaxed text-[#2E2A26]/80 pl-7">
              {rituals[selectedRitual].expect}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#2E2A26]/70">
              <TrendingUp className="h-5 w-5 text-[#7A8F7B]" />
              <h3 className="font-semibold text-base">What this builds</h3>
            </div>
            <p className="text-base leading-relaxed text-[#2E2A26]/80 pl-7">
              {rituals[selectedRitual].builds}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-[#E8E1D5] shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed text-[#2E2A26]/70 text-center">
            Small, consistent practices rewire how your nervous system experiences connection. Start with one ritual and practice it for a week.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
