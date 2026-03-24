'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const attachmentResults = {
  avoidant: {
    headline: "You learned to rely on yourself for a reason.",
    typeName: "Dismissive Avoidant",
    corePattern: "You value independence and self-sufficiency.\n\nConnection matters — but too much closeness can feel overwhelming, or even like pressure.\n\nSo you create space to stay regulated.",
    whyThisFormed: "Your nervous system learned early that depending on others wasn't safe, reliable, or necessary.\n\nSo instead, it adapted by turning inward.\n\nHandling things on your own became the safest option.",
    howItShowsUp: [
      "You need space to process and regulate",
      "You feel pressure when someone wants more closeness or emotion",
      "You can shut down during conflict or intensity",
      "You struggle to express deeper feelings, even when they're there",
      "You prefer action or problem-solving over emotional conversations"
    ],
    painPoint: "You can feel alone, even in relationships.\n\nAnd others can feel shut out — even when you care deeply.",
    theShift: "You don't have to lose your independence to build connection.\n\nYou just need a version of closeness that feels safe, not overwhelming.",
    ctaButton: "Start gently building connection",
    ctaSubtext: "Connection works best when your nervous system feels safe, not pressured."
  },

  anxious: {
    headline: "You care deeply — and your system doesn't want to lose that.",
    typeName: "Anxious Preoccupied",
    corePattern: "Connection is everything to you.\n\nBut when it feels uncertain, your system goes into overdrive trying to hold onto it.",
    whyThisFormed: "Your nervous system learned that connection could be inconsistent.\n\nSometimes it was there. Sometimes it wasn't.\n\nSo you adapted by staying highly aware — and doing whatever you could to keep it.",
    howItShowsUp: [
      "You seek reassurance when things feel uncertain",
      "You overthink shifts in tone, energy, or behavior",
      "You can feel anxious when communication changes",
      "You try to fix or repair quickly when something feels off",
      "You sometimes lose yourself while trying to maintain connection"
    ],
    painPoint: "You can feel like you're \"too much\" — while also feeling like it's never quite enough.",
    theShift: "You don't need to want less connection.\n\nYou need to feel more secure inside of it.",
    ctaButton: "Build internal safety",
    ctaSubtext: "Security starts in your nervous system, not just the relationship."
  },

  fearful: {
    headline: "You're not broken. This is protection.",
    typeName: "Fearful Avoidant",
    corePattern: "You crave deep connection — but when it starts to feel real, something in you pulls back.\n\nNot because you don't care.\n\nBecause closeness has never felt completely safe.",
    whyThisFormed: "At some point, your nervous system learned that love could be both comforting and overwhelming.\n\nSo instead of choosing one, it learned to move between both.\n\nGetting close… then protecting.",
    howItShowsUp: [
      "You feel deeply connected one moment, and distant the next",
      "You overthink your feelings and question what's real",
      "You want reassurance, but also feel suffocated by it",
      "You shut down when things feel emotionally intense",
      "You sometimes push away the very thing you want most"
    ],
    painPoint: "You don't feel stable in connection.\n\nAnd that makes it hard to trust your partner — or yourself.",
    theShift: "You don't need to become a different person.\n\nYou need a nervous system that feels safe staying.\n\nThat's what changes everything.",
    ctaButton: "Start your first practice",
    ctaSubtext: "Build safety before trying to fix the relationship."
  },

  secure: {
    headline: "You've built a foundation of safety.",
    typeName: "Secure",
    corePattern: "You're able to give and receive connection without losing yourself.\n\nCloseness feels safe, and space doesn't feel threatening.",
    whyThisFormed: "Your nervous system learned that connection is generally safe, consistent, and reliable.\n\nSo it doesn't need to overprotect or overcompensate.",
    howItShowsUp: [
      "You communicate openly and directly",
      "You can handle conflict without shutting down or escalating",
      "You trust connection without constant reassurance",
      "You respect both closeness and independence",
      "You stay relatively grounded during emotional moments"
    ],
    painPoint: "Even with security, relationships still require awareness and intention.\n\nOld patterns — yours or your partner's — can still show up.",
    theShift: "Security isn't a destination.\n\nIt's something you continue to choose and strengthen over time.",
    ctaButton: "Deepen your connection",
    ctaSubtext: "Strong relationships are built through ongoing awareness and intention."
  }
};

interface ResultsPageProps {
  resultType: 'anxious' | 'avoidant' | 'fearful' | 'secure';
  onBack: () => void;
  onViewActionPlan: () => void;
}

export default function ResultsPage({ resultType, onBack, onViewActionPlan }: ResultsPageProps) {
  const result = attachmentResults[resultType];

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
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Your Result</h1>
      </div>

      <div className="rounded-[32px] bg-gradient-to-br from-[#7A8F7B] to-[#6B7E6C] p-6 sm:p-8 text-white shadow-lg border border-[#D8D2C8]">
        <p className="text-lg text-white/80 mb-4">
          {result.headline}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold mb-6">
          {result.typeName}
        </h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
              Core Pattern
            </h3>
            <p className="text-base leading-relaxed text-white/95 whitespace-pre-line">
              {result.corePattern}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70 mb-3">
              Why This Formed
            </h3>
            <p className="text-base leading-relaxed text-white/95 whitespace-pre-line">
              {result.whyThisFormed}
            </p>
          </div>
        </div>
      </div>

      <Card className="rounded-[32px] border border-[#D8D2C8] shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-[#2E2A26]">How It Shows Up In Love</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {result.howItShowsUp.map((item, index) => (
              <li key={index} className="text-base leading-relaxed text-[#2E2A26]/80 flex gap-3">
                <span className="text-[#7A8F7B] mt-1">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-[#2E2A26]">The Pain Point</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-[#2E2A26]/80 whitespace-pre-line">
            {result.painPoint}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl text-[#2E2A26]">The Shift</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-[#2E2A26]/80 whitespace-pre-line">
            {result.theShift}
          </p>
        </CardContent>
      </Card>

      <div className="rounded-[32px] bg-gradient-to-br from-[#7A8F7B] to-[#6B7E6C] p-6 sm:p-8 text-white shadow-lg border border-[#D8D2C8]">
        <Button
          className="mt-2 h-14 w-full rounded-3xl bg-white hover:bg-white/90 text-[#7A8F7B] text-base font-medium shadow-md active:scale-[0.98] transition-transform"
          onClick={onViewActionPlan}
        >
          {result.ctaButton}
        </Button>
        <p className="text-sm text-white/80 text-center mt-4 leading-relaxed">
          {result.ctaSubtext}
        </p>
      </div>
    </div>
  );
}
