'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const aiPatterns = {
  anxious: [
    "Something is wrong in the connection",
    "They're pulling away",
    "I need to fix this quickly"
  ],
  avoidant: [
    "This is too much",
    "I need space",
    "This feels overwhelming"
  ],
  fearful: [
    "I want closeness but this feels unsafe",
    "Something feels off but I don't know why",
    "I might get hurt"
  ],
  secure: [
    "I want to address this calmly",
    "Something feels off and I want to understand it",
    "I'm noticing tension"
  ]
};

const alternativeTruths = {
  anxious: [
    "They might just need space, not distance from me",
    "My need for connection is valid, and so is their pace",
    "Uncertainty doesn't mean disconnection"
  ],
  avoidant: [
    "I can stay present even when it feels intense",
    "Closeness doesn't mean losing myself",
    "I can ask for space without disappearing"
  ],
  fearful: [
    "I can want closeness and feel scared at the same time",
    "Safety grows slowly, not all at once",
    "My conflicting feelings don't mean something is wrong"
  ],
  secure: [
    "This tension is temporary and workable",
    "We can navigate this together",
    "It's okay to not have all the answers right now"
  ]
};

const identityShifts = {
  anxious: [
    "Trusting connection without needing constant reassurance",
    "Allowing space without creating stories",
    "Being present with uncertainty"
  ],
  avoidant: [
    "Staying 10% longer than feels comfortable",
    "Naming what I need before I leave",
    "Choosing presence over protection"
  ],
  fearful: [
    "Holding both the want and the fear without acting on either urgently",
    "Trusting my nervous system to settle without needing to fix anything",
    "Moving toward connection in small, safe steps"
  ],
  secure: [
    "Speaking up earlier before tension builds",
    "Offering steadiness when things feel uncertain",
    "Trusting the process even when it's uncomfortable"
  ]
};

export interface CheckInResponses {
  date: string;
  trigger: string;
  coreStory: string;
  reframe: string;
  identityShift: string;
  attachmentType: string;
}

interface CheckInPageProps {
  attachmentType: 'anxious' | 'avoidant' | 'fearful' | 'secure';
  onBack: () => void;
  onComplete: (responses: CheckInResponses) => void;
}

export default function CheckInPage({ attachmentType, onBack, onComplete }: CheckInPageProps) {
  const [step, setStep] = useState(1);
  const [whatStuck, setWhatStuck] = useState('');
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedTruth, setSelectedTruth] = useState('');
  const [customTruth, setCustomTruth] = useState('');
  const [selectedShift, setSelectedShift] = useState('');
  const [customShift, setCustomShift] = useState('');
  const [showCustomTruth, setShowCustomTruth] = useState(false);
  const [showCustomShift, setShowCustomShift] = useState(false);

  const handleStep1Continue = () => {
    if (whatStuck.trim()) {
      setStep(2);
    }
  };

  const handlePatternSelect = (fits: boolean) => {
    if (fits && selectedPattern) {
      setStep(3);
    } else {
      setStep(3);
    }
  };

  const handleTruthContinue = () => {
    if (selectedTruth || customTruth.trim()) {
      setStep(4);
    }
  };

  const handleComplete = () => {
    const responses: CheckInResponses = {
      date: new Date().toISOString(),
      trigger: whatStuck.trim(),
      coreStory: selectedPattern,
      reframe: customTruth.trim() || selectedTruth,
      identityShift: customShift.trim() || selectedShift,
      attachmentType
    };
    onComplete(responses);
  };

  const patterns = aiPatterns[attachmentType];
  const truths = alternativeTruths[attachmentType];
  const shifts = identityShifts[attachmentType];

  return (
    <div className="flex-1 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-12 w-12 active:scale-95 transition-transform text-[#2E2A26] hover:bg-[#E8E1D5]"
            onClick={onBack}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-semibold text-[#2E2A26]">Daily Check-In</h1>
        </div>
        <div className="text-sm text-[#2E2A26]/60">
          Step {step} of 4
        </div>
      </div>

      <div className="h-2 bg-[#E8E1D5] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-[#7A8F7B]"
          initial={{ width: '25%' }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <CardContent className="p-8 space-y-5">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#2E2A26]">
                    What stuck with you today?
                  </h2>
                  <p className="text-base leading-relaxed text-[#2E2A26]/70">
                    A moment, feeling, or interaction that's still on your mind.
                  </p>
                </div>

                <Textarea
                  value={whatStuck}
                  onChange={(e) => setWhatStuck(e.target.value)}
                  placeholder="Type here..."
                  className="min-h-[120px] text-base rounded-[20px] border-2 border-[#D8D2C8] focus:border-[#7A8F7B] resize-none"
                />

                <Button
                  onClick={handleStep1Continue}
                  disabled={!whatStuck.trim()}
                  className="w-full h-14 rounded-full text-base font-semibold bg-[#7A8F7B] hover:bg-[#6B7F6C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#2E2A26]">
                    Your brain might be saying...
                  </h2>
                  <p className="text-base leading-relaxed text-[#2E2A26]/70">
                    Does any of this sound familiar?
                  </p>
                </div>

                <div className="space-y-3">
                  {patterns.map((pattern, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPattern(pattern)}
                      className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                        selectedPattern === pattern
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                          : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedPattern === pattern
                            ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                            : 'border-[#D8D2C8]'
                        }`}>
                          {selectedPattern === pattern && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <p className="text-base text-[#2E2A26] leading-relaxed">
                          "{pattern}"
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => handlePatternSelect(false)}
                    variant="outline"
                    className="flex-1 h-14 rounded-full text-base font-semibold border-2 border-[#D8D2C8] hover:bg-[#E8E1D5]"
                  >
                    Not quite
                  </Button>
                  <Button
                    onClick={() => handlePatternSelect(true)}
                    disabled={!selectedPattern}
                    className="flex-1 h-14 rounded-full text-base font-semibold bg-[#7A8F7B] hover:bg-[#6B7F6C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Yes, that fits
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#2E2A26]">
                    What else could be true?
                  </h2>
                  <p className="text-base leading-relaxed text-[#2E2A26]/70">
                    A different way to see this moment.
                  </p>
                </div>

                <div className="space-y-3">
                  {truths.map((truth, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedTruth(truth);
                        setShowCustomTruth(false);
                      }}
                      className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                        selectedTruth === truth && !showCustomTruth
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                          : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedTruth === truth && !showCustomTruth
                            ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                            : 'border-[#D8D2C8]'
                        }`}>
                          {selectedTruth === truth && !showCustomTruth && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <p className="text-base text-[#2E2A26] leading-relaxed">
                          {truth}
                        </p>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setShowCustomTruth(true);
                      setSelectedTruth('');
                    }}
                    className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                      showCustomTruth
                        ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                        : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        showCustomTruth
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                          : 'border-[#D8D2C8]'
                      }`}>
                        {showCustomTruth && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <p className="text-base text-[#2E2A26] leading-relaxed">
                        Write my own...
                      </p>
                    </div>
                  </button>

                  {showCustomTruth && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Textarea
                        value={customTruth}
                        onChange={(e) => setCustomTruth(e.target.value)}
                        placeholder="What else could be true?"
                        className="min-h-[100px] text-base rounded-[20px] border-2 border-[#D8D2C8] focus:border-[#7A8F7B] resize-none"
                      />
                    </motion.div>
                  )}
                </div>

                <Button
                  onClick={handleTruthContinue}
                  disabled={!selectedTruth && !customTruth.trim()}
                  className="w-full h-14 rounded-full text-base font-semibold bg-[#7A8F7B] hover:bg-[#6B7F6C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold text-[#2E2A26]">
                    What do you want to practice instead?
                  </h2>
                  <p className="text-base leading-relaxed text-[#2E2A26]/70">
                    Choose the shift you want to make.
                  </p>
                </div>

                <div className="space-y-3">
                  {shifts.map((shift, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedShift(shift);
                        setShowCustomShift(false);
                      }}
                      className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                        selectedShift === shift && !showCustomShift
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                          : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedShift === shift && !showCustomShift
                            ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                            : 'border-[#D8D2C8]'
                        }`}>
                          {selectedShift === shift && !showCustomShift && (
                            <Check className="h-3 w-3 text-white" />
                          )}
                        </div>
                        <p className="text-base text-[#2E2A26] leading-relaxed">
                          {shift}
                        </p>
                      </div>
                    </button>
                  ))}

                  <button
                    onClick={() => {
                      setShowCustomShift(true);
                      setSelectedShift('');
                    }}
                    className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                      showCustomShift
                        ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                        : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        showCustomShift
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                          : 'border-[#D8D2C8]'
                      }`}>
                        {showCustomShift && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <p className="text-base text-[#2E2A26] leading-relaxed">
                        Write my own...
                      </p>
                    </div>
                  </button>

                  {showCustomShift && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Textarea
                        value={customShift}
                        onChange={(e) => setCustomShift(e.target.value)}
                        placeholder="What do you want to practice?"
                        className="min-h-[100px] text-base rounded-[20px] border-2 border-[#D8D2C8] focus:border-[#7A8F7B] resize-none"
                      />
                    </motion.div>
                  )}
                </div>

                <Button
                  onClick={handleComplete}
                  disabled={!selectedShift && !customShift.trim()}
                  className="w-full h-14 rounded-full text-base font-semibold bg-[#7A8F7B] hover:bg-[#6B7F6C] text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Check-In
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
