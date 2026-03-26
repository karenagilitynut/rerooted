'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ProfilePageProps {
  attachmentType: 'anxious' | 'avoidant' | 'fearful' | 'secure';
}

interface ProfileData {
  name: string;
  relationship_status: string;
  goals: string[];
  awareness_level: string;
}

const relationshipOptions = [
  'In a relationship',
  'Dating',
  'Recently separated',
  'Single, working on patterns',
  "It's complicated"
];

const goalOptions = [
  'Feel less anxious in relationships',
  'Stop pulling away',
  'Improve communication',
  'Increase intimacy',
  'Understand my patterns'
];

const awarenessOptions = [
  'New to this',
  'Some experience',
  'Very familiar'
];

const attachmentLabels: Record<string, string> = {
  anxious: 'Anxious',
  avoidant: 'Avoidant',
  fearful: 'Fearful-Avoidant',
  secure: 'Secure'
};

export default function ProfilePage({ attachmentType }: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    relationship_status: '',
    goals: [],
    awareness_level: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setProfile({
          name: data.name || '',
          relationship_status: data.relationship_status || '',
          goals: Array.isArray(data.goals) ? data.goals : [],
          awareness_level: data.awareness_level || ''
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .maybeSingle();

      const profileData = {
        name: profile.name || null,
        attachment_type: attachmentType,
        relationship_status: profile.relationship_status || null,
        goals: profile.goals,
        awareness_level: profile.awareness_level || null
      };

      if (existingProfile) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', existingProfile.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('profiles')
          .insert(profileData);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter(g => g !== goal)
        : [...prev.goals, goal]
    }));
  };

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        saveProfile();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [profile, isLoading]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
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
    );
  }

  return (
    <div className="flex-1 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#2E2A26]">Profile</h1>
        {isSaving && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-[#7A8F7B]"
          >
            Saving...
          </motion.div>
        )}
      </div>

      <div className="space-y-4">
        <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
          <CardContent className="p-8 space-y-5">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                Name
              </label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                placeholder="How would you like to be called?"
                className="h-14 text-base rounded-[20px] border-2 border-[#D8D2C8] focus:border-[#7A8F7B]"
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                Attachment Style
              </label>
              <div className="px-5 py-4 rounded-[20px] bg-[#F5F2ED] border-2 border-[#E8E1D5]">
                <p className="text-base text-[#2E2A26] font-medium">
                  {attachmentLabels[attachmentType]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                What does your relationship look like right now?
              </label>
              <div className="space-y-3">
                {relationshipOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setProfile({ ...profile, relationship_status: option })}
                    className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                      profile.relationship_status === option
                        ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                        : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        profile.relationship_status === option
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                          : 'border-[#D8D2C8]'
                      }`}>
                        {profile.relationship_status === option && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <p className="text-base text-[#2E2A26]">
                        {option}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                What are you hoping will feel different?
              </label>
              <p className="text-sm text-[#2E2A26]/60">
                Select all that apply
              </p>
              <div className="space-y-3">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                      profile.goals.includes(goal)
                        ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                        : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                        profile.goals.includes(goal)
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                          : 'border-[#D8D2C8]'
                      }`}>
                        {profile.goals.includes(goal) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <p className="text-base text-[#2E2A26]">
                        {goal}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[32px] border border-[#D8D2C8] bg-white shadow-lg">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-[#7A8F7B] uppercase tracking-wide">
                How familiar are you with this kind of work?
              </label>
              <div className="space-y-3">
                {awarenessOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setProfile({ ...profile, awareness_level: option })}
                    className={`w-full text-left p-5 rounded-[24px] border-2 transition-all active:scale-[0.98] ${
                      profile.awareness_level === option
                        ? 'border-[#7A8F7B] bg-[#7A8F7B]/5'
                        : 'border-[#D8D2C8] hover:border-[#7A8F7B]/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        profile.awareness_level === option
                          ? 'border-[#7A8F7B] bg-[#7A8F7B]'
                          : 'border-[#D8D2C8]'
                      }`}>
                        {profile.awareness_level === option && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <p className="text-base text-[#2E2A26]">
                        {option}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
