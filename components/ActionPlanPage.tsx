'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Circle as XCircle, CircleCheck as CheckCircle, MessageSquare, Heart, Target } from 'lucide-react';

const attachmentActionPlans = {
  avoidant: {
    title: "Your ReRooted Action Plan",
    intro:
      "You do not need to become more emotional overnight. You do not need to force vulnerability. Your growth path is about creating enough safety inside connection that you no longer need distance as quickly.",
    stopDoing: [
      "Stop waiting until you're already shut down to take space.",
      "Stop assuming your overwhelm is always obvious to the other person.",
      "Stop equating need with weakness or closeness with loss of self."
    ],
    startPracticing: [
      "Name your need for space earlier, before you disappear.",
      "Offer a bridge when you pull back: a sentence, a touch, or a return time.",
      "Practice staying emotionally present for slightly longer than your body prefers."
    ],
    conflict: [
      "Conflict feels safer when it is paced, specific, and not emotionally flooding.",
      "You do better with one issue at a time, clear language, and room to respond without pressure.",
      "Repair gets easier when you know space does not mean punishment."
    ],
    intimacy: [
      "Your body opens through low-pressure warmth, not expectation.",
      "Mutuality matters. Shared touch usually feels safer than being the sole focus.",
      "The less intimacy feels like obligation, the more room there is for genuine desire."
    ],
    todayRep:
      "Offer one small signal of warmth before taking space today. Even one sentence counts."
  },

  anxious: {
    title: "Your ReRooted Action Plan",
    intro:
      "Your growth path is not becoming less relational. It is becoming less ruled by fear when connection feels uncertain. You do not need to shut your heart down. You need more steadiness inside it.",
    stopDoing: [
      "Stop treating every shift in tone like proof something is wrong.",
      "Stop making repeated bids for connection when one clear bid would do.",
      "Stop abandoning your own center while waiting for someone else to regulate you."
    ],
    startPracticing: [
      "Make one direct request instead of several indirect ones.",
      "Pause and ask: what do I actually know right now?",
      "Soothe your body before you seek more reassurance."
    ],
    conflict: [
      "Conflict feels safer when you know it will come back around, even if repair is not immediate.",
      "You need clarity, but urgency can make the conversation harder.",
      "Your power grows when you can stay connected to your need without escalating the fear around it."
    ],
    intimacy: [
      "Your body often wants emotional closeness before sexual openness.",
      "Feeling chosen, wanted, and connected matters deeply to your desire.",
      "The more secure you feel, the less intimacy has to carry the weight of reassurance."
    ],
    todayRep:
      "Before sending a second message or asking again, take one full minute and name what is fear versus what is fact."
  },

  fearful: {
    title: "Your ReRooted Action Plan",
    intro:
      "Your growth path is not choosing one side of yourself. It is learning how to hold both: the part that longs for closeness and the part that protects you from getting hurt. Healing is not becoming simpler. It is becoming safer.",
    stopDoing: [
      "Stop forcing clarity while you are highly activated.",
      "Stop assuming your mixed signals mean you are broken or impossible.",
      "Stop treating every internal shift like a final answer."
    ],
    startPracticing: [
      "Name both truths: what I want, and what I'm afraid of.",
      "Slow the moment down when you feel the urge to lunge or flee.",
      "Look for small believable repair instead of dramatic certainty."
    ],
    conflict: [
      "Conflict feels safer when it is slowed down and made less absolute.",
      "You need emotional honesty, but too much intensity can tip you into self-protection.",
      "Repair works best when it is explicit, gentle, and repeated over time."
    ],
    intimacy: [
      "Your body usually needs both closeness and safety at the same time.",
      "Desire can rise strongly when you feel connected, then vanish when fear enters the room.",
      "Intimacy becomes more possible when your body stops expecting pain to follow closeness."
    ],
    todayRep:
      "When you feel torn, say out loud: part of me wants closeness, and part of me feels scared."
  },

  secure: {
    title: "Your ReRooted Action Plan",
    intro:
      "Your growth path is not fixing yourself. It is using your stability with intention. Security becomes even more powerful when it is conscious, relational, and responsive to people who experience closeness differently than you do.",
    stopDoing: [
      "Stop assuming your calm automatically feels safe to others.",
      "Stop underestimating how intense conflict or distance may feel for a more activated partner.",
      "Stop relying on good instincts alone when clearer language would help."
    ],
    startPracticing: [
      "Keep naming needs before resentment builds.",
      "Use your steadiness to create safety without overfunctioning.",
      "Stay curious about how different nervous systems experience the same moment."
    ],
    conflict: [
      "Conflict is one of your strengths when you stay engaged and honest.",
      "You often help by bringing clarity, pacing, and reassurance that the bond can hold tension.",
      "Your challenge is to stay present without becoming overly managerial or detached."
    ],
    intimacy: [
      "Intimacy often feels more flexible for you because your system does not interpret every shift as threat.",
      "That gives you room for honesty, play, and repair.",
      "Your greatest gift here is helping create an atmosphere where both people can stay real."
    ],
    todayRep:
      "Notice one place today where your steadiness could become a small act of safety for someone else."
  }
};

interface ActionPlanPageProps {
  resultType: 'anxious' | 'avoidant' | 'fearful' | 'secure';
  onBack: () => void;
}

export default function ActionPlanPage({ resultType, onBack }: ActionPlanPageProps) {
  const plan = attachmentActionPlans[resultType];

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
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Action Plan</h1>
      </div>

      <div className="rounded-[32px] bg-gradient-to-br from-[#7A8F7B] to-[#6B7E6C] p-6 sm:p-8 text-white shadow-lg border border-[#D8D2C8]">
        <h2 className="text-3xl sm:text-4xl font-semibold mb-4">
          {plan.title}
        </h2>
        <p className="text-base leading-relaxed text-white/90">
          {plan.intro}
        </p>
      </div>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-gradient-to-br from-[#C47A5A]/10 to-[#C47A5A]/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-[#2E2A26]">
            <XCircle className="h-5 w-5 text-[#C47A5A]" />
            Stop Doing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.stopDoing.map((item, index) => (
            <p key={index} className="text-base leading-relaxed text-[#2E2A26]/80">
              {item}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-gradient-to-br from-[#7A8F7B]/10 to-[#7A8F7B]/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-[#2E2A26]">
            <CheckCircle className="h-5 w-5 text-[#7A8F7B]" />
            Start Practicing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.startPracticing.map((item, index) => (
            <p key={index} className="text-base leading-relaxed text-[#2E2A26]/80">
              {item}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-gradient-to-br from-[#E8E1D5] to-[#F5F1E8] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-[#2E2A26]">
            <MessageSquare className="h-5 w-5 text-[#C47A5A]" />
            In Conflict
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.conflict.map((item, index) => (
            <p key={index} className="text-base leading-relaxed text-[#2E2A26]/80">
              {item}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-gradient-to-br from-[#C47A5A]/10 to-[#C47A5A]/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-[#2E2A26]">
            <Heart className="h-5 w-5 text-[#C47A5A]" />
            With Intimacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {plan.intimacy.map((item, index) => (
            <p key={index} className="text-base leading-relaxed text-[#2E2A26]/80">
              {item}
            </p>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-gradient-to-br from-[#7A8F7B] to-[#6B7E6C] shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-white">
            <Target className="h-5 w-5" />
            Today's Rep
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-white/90">
            {plan.todayRep}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-[#E8E1D5] shadow-sm">
        <CardContent className="p-6">
          <p className="text-sm leading-relaxed text-[#2E2A26]/70">
            This action plan is personalized to your attachment pattern. Small, consistent changes create lasting shifts in how you experience connection.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
