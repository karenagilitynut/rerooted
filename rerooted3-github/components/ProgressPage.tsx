"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { format, subDays, isAfter } from "date-fns";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface CheckIn {
  id: string;
  created_at: string;
  date: string;
  trigger: string;
  core_story: string;
  reframe: string;
  identity_shift: string;
  attachment_type: string;
}

interface ProgressPageProps {
  onBack: () => void;
}

interface EmotionalTrend {
  grounded: 'up' | 'down' | 'stable';
  anxious: 'up' | 'down' | 'stable';
  avoidant: 'up' | 'down' | 'stable';
}

export default function ProgressPage({ onBack }: ProgressPageProps) {
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [recurringPatterns, setRecurringPatterns] = useState<{ pattern: string; count: number }[]>([]);
  const [topShifts, setTopShifts] = useState<{ shift: string; count: number }[]>([]);
  const [regulationWins, setRegulationWins] = useState<{ date: string; summary: string }[]>([]);
  const [emotionalTrend, setEmotionalTrend] = useState<EmotionalTrend>({
    grounded: 'stable',
    anxious: 'stable',
    avoidant: 'stable'
  });

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = async () => {
    try {
      const { data, error } = await supabase
        .from("checkins")
        .select("*")
        .order("date", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        setCheckIns(data);
        analyzePatterns(data);
        analyzeShifts(data);
        identifyRegulationWins(data);
        analyzeTrends(data);
      }
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const analyzePatterns = (data: CheckIn[]) => {
    const patternCounts: Record<string, number> = {};

    data.forEach(checkIn => {
      if (checkIn.core_story && checkIn.core_story.trim()) {
        const pattern = checkIn.core_story.trim();
        patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
      }
    });

    const sorted = Object.entries(patternCounts)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    setRecurringPatterns(sorted);
  };

  const analyzeShifts = (data: CheckIn[]) => {
    const shiftCounts: Record<string, number> = {};

    data.forEach(checkIn => {
      if (checkIn.identity_shift && checkIn.identity_shift.trim()) {
        const shift = checkIn.identity_shift.trim();
        shiftCounts[shift] = (shiftCounts[shift] || 0) + 1;
      }
    });

    const sorted = Object.entries(shiftCounts)
      .map(([shift, count]) => ({ shift, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    setTopShifts(sorted);
  };

  const identifyRegulationWins = (data: CheckIn[]) => {
    const wins = data
      .filter(checkIn => {
        const reframe = checkIn.reframe?.toLowerCase() || '';
        const shift = checkIn.identity_shift?.toLowerCase() || '';

        const positiveIndicators = [
          'can', 'able', 'choose', 'practice', 'trust',
          'stay', 'grounded', 'safe', 'okay', 'workable'
        ];

        return positiveIndicators.some(indicator =>
          reframe.includes(indicator) || shift.includes(indicator)
        );
      })
      .slice(0, 4)
      .map(checkIn => ({
        date: format(new Date(checkIn.date), 'MMM d'),
        summary: checkIn.reframe || checkIn.identity_shift
      }));

    setRegulationWins(wins);
  };

  const analyzeTrends = (data: CheckIn[]) => {
    const oneWeekAgo = subDays(new Date(), 7);
    const recentCheckIns = data.filter(c => isAfter(new Date(c.date), oneWeekAgo));
    const olderCheckIns = data.filter(c => !isAfter(new Date(c.date), oneWeekAgo)).slice(0, 7);

    if (recentCheckIns.length === 0) {
      return;
    }

    const analyzeGroup = (group: CheckIn[]) => {
      let groundedScore = 0;
      let anxiousScore = 0;
      let avoidantScore = 0;

      group.forEach(checkIn => {
        const story = checkIn.core_story?.toLowerCase() || '';
        const reframe = checkIn.reframe?.toLowerCase() || '';

        if (
          reframe.includes('can') ||
          reframe.includes('safe') ||
          reframe.includes('okay') ||
          reframe.includes('workable') ||
          reframe.includes('trust')
        ) {
          groundedScore++;
        }

        if (
          story.includes('wrong') ||
          story.includes('pulling away') ||
          story.includes('fix') ||
          story.includes('worried') ||
          story.includes('scared')
        ) {
          anxiousScore++;
        }

        if (
          story.includes('too much') ||
          story.includes('space') ||
          story.includes('overwhelming') ||
          story.includes('pressure')
        ) {
          avoidantScore++;
        }
      });

      return {
        grounded: groundedScore / group.length,
        anxious: anxiousScore / group.length,
        avoidant: avoidantScore / group.length
      };
    };

    const recentScores = analyzeGroup(recentCheckIns);
    const olderScores = olderCheckIns.length > 0 ? analyzeGroup(olderCheckIns) : recentScores;

    const getTrend = (recent: number, older: number): 'up' | 'down' | 'stable' => {
      const diff = recent - older;
      if (Math.abs(diff) < 0.1) return 'stable';
      return diff > 0 ? 'up' : 'down';
    };

    setEmotionalTrend({
      grounded: getTrend(recentScores.grounded, olderScores.grounded),
      anxious: getTrend(recentScores.anxious, olderScores.anxious),
      avoidant: getTrend(recentScores.avoidant, olderScores.avoidant)
    });
  };

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'up') return <TrendingUp className="h-5 w-5 text-[#7A8F7B]" />;
    if (trend === 'down') return <TrendingDown className="h-5 w-5 text-[#7A8F7B]" />;
    return <Minus className="h-5 w-5 text-[#2E2A26]/40" />;
  };

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
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Progress</h1>
      </div>

      <div className="space-y-5">
        {checkIns.length === 0 ? (
          <div className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg p-8">
            <div className="text-center space-y-3">
              <p className="text-lg text-[#2E2A26]">
                Your progress will appear here after your first check-in.
              </p>
              <p className="text-base text-[#2E2A26]/70">
                Each check-in helps you see your patterns more clearly.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#2E2A26]">
                    Pattern Mirror
                  </h2>
                  <p className="text-sm text-[#2E2A26]/60">
                    What your system has been focusing on lately
                  </p>
                </div>

                {recurringPatterns.length > 0 ? (
                  <div className="space-y-3">
                    {recurringPatterns.map((item, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-[24px] bg-[#E8E1D5]/30 border border-[#D8D2C8]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-base text-[#2E2A26] leading-relaxed flex-1">
                            "{item.pattern}"
                          </p>
                          <span className="text-sm font-medium text-[#2E2A26]/60 whitespace-nowrap">
                            {item.count}×
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-[#2E2A26]/60 italic">
                    Keep checking in to see patterns emerge
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#2E2A26]">
                    Growth Direction
                  </h2>
                  <p className="text-sm text-[#2E2A26]/60">
                    What you're practicing more of
                  </p>
                </div>

                {topShifts.length > 0 ? (
                  <div className="space-y-3">
                    {topShifts.map((item, index) => (
                      <div
                        key={index}
                        className="p-5 rounded-[24px] bg-[#7A8F7B]/5 border border-[#7A8F7B]/20"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-base text-[#2E2A26] leading-relaxed flex-1">
                            {item.shift}
                          </p>
                          <span className="text-sm font-medium text-[#7A8F7B] whitespace-nowrap">
                            {item.count}×
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-[#2E2A26]/60 italic">
                    Your growth patterns will appear here
                  </p>
                )}
              </div>
            </div>

            {regulationWins.length > 0 && (
              <div className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
                <div className="p-8 space-y-5">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-[#2E2A26]">
                      Regulation Wins
                    </h2>
                    <p className="text-sm text-[#2E2A26]/60">
                      Moments you chose differently
                    </p>
                  </div>

                  <div className="space-y-3">
                    {regulationWins.map((win, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-[20px] bg-[#F5F1E8]"
                      >
                        <span className="text-sm font-medium text-[#2E2A26]/60 whitespace-nowrap">
                          {win.date}
                        </span>
                        <p className="text-base text-[#2E2A26] leading-relaxed">
                          {win.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
              <div className="p-8 space-y-5">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-[#2E2A26]">
                    Emotional Trend
                  </h2>
                  <p className="text-sm text-[#2E2A26]/60">
                    This week, your system felt more:
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#F5F1E8]">
                    <span className="text-base font-medium text-[#2E2A26]">
                      Grounded
                    </span>
                    <TrendIcon trend={emotionalTrend.grounded} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#F5F1E8]">
                    <span className="text-base font-medium text-[#2E2A26]">
                      Anxious
                    </span>
                    <TrendIcon trend={emotionalTrend.anxious} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-[20px] bg-[#F5F1E8]">
                    <span className="text-base font-medium text-[#2E2A26]">
                      Avoidant
                    </span>
                    <TrendIcon trend={emotionalTrend.avoidant} />
                  </div>
                </div>

                <p className="text-sm text-[#2E2A26]/60 pt-2 leading-relaxed">
                  Trends show direction, not judgment. Your nervous system is learning.
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
