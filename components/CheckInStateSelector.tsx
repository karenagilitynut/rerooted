'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export type CheckInType = 'charged' | 'positive' | 'neutral';

interface CheckInStateSelectorProps {
  onBack: () => void;
  onSelect: (type: CheckInType) => void;
}

export default function CheckInStateSelector({ onBack, onSelect }: CheckInStateSelectorProps) {
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
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Check In</h1>
      </div>

      <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-[#2E2A26]">
              How does today feel?
            </h2>
            <p className="text-base leading-relaxed text-[#2E2A26]/70">
              This helps guide the reflection.
            </p>
          </div>

          <div className="space-y-3">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect('charged')}
              className="w-full text-left p-6 rounded-[24px] border-2 border-[#D8D2C8] hover:border-[#7A8F7B] hover:bg-[#7A8F7B]/5 transition-all"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#2E2A26]">
                  Something felt charged
                </h3>
                <p className="text-sm text-[#2E2A26]/70">
                  A difficult moment or feeling that's still with you
                </p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect('positive')}
              className="w-full text-left p-6 rounded-[24px] border-2 border-[#D8D2C8] hover:border-[#7A8F7B] hover:bg-[#7A8F7B]/5 transition-all"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#2E2A26]">
                  Something felt good
                </h3>
                <p className="text-sm text-[#2E2A26]/70">
                  A moment of connection, safety, or ease
                </p>
              </div>
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect('neutral')}
              className="w-full text-left p-6 rounded-[24px] border-2 border-[#D8D2C8] hover:border-[#7A8F7B] hover:bg-[#7A8F7B]/5 transition-all"
            >
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-[#2E2A26]">
                  Just checking in
                </h3>
                <p className="text-sm text-[#2E2A26]/70">
                  Nothing intense, just noticing what's present
                </p>
              </div>
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
