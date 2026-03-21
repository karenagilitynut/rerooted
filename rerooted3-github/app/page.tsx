'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Heart, Sparkles, Shield, Chrome as Home, ClipboardList, ChartBar as BarChart3, User, BookOpen, ArrowLeft } from 'lucide-react';

const attachmentQuestions = [
  {
    id: 'q1',
    prompt: 'When connection feels uncertain, I usually…',
    options: [
      { text: 'Reach for reassurance and closeness', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'Pull back and handle it on my own', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 1 } },
      { text: 'Want closeness but also feel overwhelmed by it', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Name what I need and stay connected', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q2',
    prompt: 'During conflict, my nervous system tends to…',
    options: [
      { text: 'Get activated fast and scan for signs of disconnection', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'Go flat, shut down, or need space right away', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 1 } },
      { text: 'Swing between needing reassurance and needing distance', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Stay fairly steady and open to repair', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q3',
    prompt: 'When someone gets very close to me emotionally, I often…',
    options: [
      { text: 'Feel relieved and want even more closeness', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 0 } },
      { text: 'Feel pressured or like I might lose myself', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 1 } },
      { text: 'Crave it deeply, but part of me wants to run', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Enjoy it without feeling trapped', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q4',
    prompt: 'If your partner pulls back emotionally, you tend to…',
    options: [
      { text: 'Move toward them and try to reconnect quickly', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'Give space and focus on yourself', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 0 } },
      { text: 'Feel torn between chasing and withdrawing', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Check in calmly without overreacting', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q5',
    prompt: 'In intimacy, what feels most true for you?',
    options: [
      { text: 'I want to feel deeply wanted and chosen', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'I struggle when things feel too intense or expected', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 1 } },
      { text: 'I want it, but something in me pulls away once it starts', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'I can stay present and connected most of the time', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q6',
    prompt: 'After conflict, what do you need most?',
    options: [
      { text: 'Quick reassurance and reconnection', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'Time and space to reset', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 0 } },
      { text: 'Repair, but I\'m unsure if I can trust it', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'A calm, mutual repair conversation', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q7',
    prompt: 'When you feel emotionally unsafe, you tend to…',
    options: [
      { text: 'Cling tighter to the relationship', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'Withdraw and become self-sufficient', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 0 } },
      { text: 'Feel chaotic—want closeness but fear it', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Name it and try to co-regulate', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q8',
    prompt: 'How do you typically express needs?',
    options: [
      { text: 'Indirectly, hoping they\'ll notice', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'I tend not to express them', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 0 } },
      { text: 'I go back and forth between sharing and hiding', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Directly and calmly', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q9',
    prompt: 'When your partner wants more closeness than you do, you feel…',
    options: [
      { text: 'Relieved—they\'re showing they care', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 0 } },
      { text: 'Pressured or overwhelmed', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 1 } },
      { text: 'Conflicted—part of me wants it, part resists', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Able to respond without losing yourself', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
  {
    id: 'q10',
    prompt: 'When things are going well in your relationship, you tend to…',
    options: [
      { text: 'Feel relief but still scan for shifts', scores: { anxious: 2, secure: 0, avoidant: 0, fearful: 1 } },
      { text: 'Enjoy it but keep emotional independence', scores: { anxious: 0, secure: 0, avoidant: 2, fearful: 0 } },
      { text: 'Feel good but slightly on edge', scores: { anxious: 1, secure: 0, avoidant: 1, fearful: 2 } },
      { text: 'Relax into it and trust the connection', scores: { anxious: 0, secure: 2, avoidant: 0, fearful: 0 } },
    ],
  },
];

const ritualsByType = {
  anxious: {
    label: "Anxious-Leaning",
    path: "Rekindle",
    tone: "Your system does best with reassurance, steadiness, and clear signs of being chosen.",
    ritual: "Send one clean bid for connection, then take a 90-second body anchor before checking for a response.",
    rep: "Name one thing that is true without mind-reading.",
  },
  avoidant: {
    label: "Dismissive-Leaning",
    path: "Ignite",
    tone: "Your system protects through space, self-containment, and lowering emotional intensity.",
    ritual: "Stay in shared space for 3 quiet minutes without needing to perform closeness.",
    rep: "Offer one low-pressure signal of warmth without opening a big conversation.",
  },
  fearful: {
    label: "Fearful-Avoidant",
    path: "Rekindle",
    tone: "Your system longs for closeness and braces for pain at the same time.",
    ritual: "Do a co-regulation sit: feet on floor, one hand on your own body, one point of gentle contact if available.",
    rep: "Practice naming both truths: what you want and what feels scary.",
  },
  secure: {
    label: "Secure-Leaning",
    path: "Ignite",
    tone: "Your system has more room for repair, directness, and mutual regulation.",
    ritual: "Do a 5-minute appreciation and desire check-in with one honest sentence each.",
    rep: "Lead one repair bid or connection ritual today.",
  },
};

const attachmentEducation = {
  anxious: {
    title: "Anxious-Preoccupied",
    shortLabel: "AP",
    intro:
      "You feel relationships deeply. When something feels off, your whole system notices — because connection matters, and your body has learned not to take it for granted.",
    sections: [
      {
        title: "Opening",
        body: [
          "You're not too much. You're not needy in the way people have made it sound. And you're not weak for wanting reassurance.",
          "You just feel relationships deeply.",
          "Connection matters to you. Closeness matters to you. Being wanted, chosen, and emotionally held matters to you.",
          "So when something feels off — even a little — your whole system notices.",
          "A delayed text. A shift in tone. A little distance.",
          "It doesn't feel small. It feels important.",
          "Because your system has learned: connection can go away. I need to pay attention."
        ]
      },
      {
        title: "How this formed",
        body: [
          "Somewhere early on, your nervous system learned that love or connection didn't always feel fully steady.",
          "Maybe care was loving but inconsistent. Maybe you had to work hard to feel close. Maybe emotional attunement came and went.",
          "Maybe you learned to track other people carefully so you could stay connected.",
          "So your system adapted.",
          "It learned: notice changes quickly, stay close, repair fast, don't miss the signs.",
          "It learned that relationships matter so much that it feels risky to relax too fully inside them.",
          "And over time, that became a kind of default setting: if I pay close enough attention, maybe I can keep us okay."
        ]
      },
      {
        title: "How this shows up in your life",
        body: [
          "You're often deeply relational.",
          "You likely care a lot about people, notice mood and energy shifts quickly, and feel affected by connection, disconnection, and ambiguity.",
          "You may replay conversations, seek clarity when things feel uncertain, overfocus on tone or timing, and struggle to settle when something feels unresolved.",
          "A lot of your energy can go toward trying to understand: are we okay?",
          "Not because you're dramatic. Because your system is scanning for safety in connection."
        ]
      },
      {
        title: "In relationships",
        body: [
          "This is where it really comes alive.",
          "You may love hard, show up hard, and care hard.",
          "And when things feel good, that can be beautiful.",
          "But when something feels off, you may feel it immediately, want reassurance, want to talk it through, and struggle to focus on anything else until things feel settled.",
          "You may reach more when you're scared — more texts, more questions, more attempts to reconnect, more emotional energy.",
          "Not because you're trying to overwhelm someone. Because closeness is how your system tries to come back to safety."
        ]
      },
      {
        title: "Your core bias",
        body: [
          "Underneath it all, your system often holds this belief: connection is precious, but it can disappear.",
          "So your brain scans for distance, inconsistency, delay, and signs someone might be pulling away.",
          "And once you notice it, it can be hard to un-notice.",
          "Even small things can start to feel loaded when your system is already activated."
        ]
      },
      {
        title: "What happens in conflict",
        body: [
          "When something feels off, your body often wants to move toward it right away.",
          "You might want to talk now, need reassurance now, feel desperate for clarity, and struggle with waiting, space, or unfinished tension.",
          "And when someone pulls back, your fear can get louder.",
          "You may start thinking: are they leaving? Do they still want this? What did I do wrong? Why do I suddenly feel so alone?",
          "The pain is real, even when the trigger looks small from the outside."
        ]
      },
      {
        title: "What your partner experiences",
        body: [
          "Your partner may experience you as sensitive, reactive, hard to soothe once activated, or wanting more closeness than they know how to give.",
          "They may feel pressured by your urgency.",
          "But what they're not always seeing is this: you're not trying to create drama. You're trying to find your footing again.",
          "When connection feels shaky, your whole body wants to restore it."
        ]
      },
      {
        title: "Intimacy + desire",
        body: [
          "For you, intimacy often feels deeply tied to emotional closeness.",
          "You usually don't just want sex or touch in a vacuum. You want to feel wanted, connected, chosen, and emotionally close.",
          "When things feel secure, desire may come more easily.",
          "When things feel distant, your desire may get tangled up with longing, reassurance, or fear.",
          "A lot of the time, what your body is really asking is: are we close? Am I still wanted here?"
        ]
      },
      {
        title: "Why your partner feels so different",
        body: [
          "If your partner leans more avoidant, it can feel brutal.",
          "You reach because you want connection. They pull back because they want space.",
          "You want repair now. They want time.",
          "You want reassurance. They feel pressure.",
          "Then the loop starts: the more you reach, the more they back away. The more they back away, the more distressed you feel.",
          "It can start to feel like your need for closeness is the problem.",
          "It isn't. The problem is usually the cycle — not your heart."
        ]
      },
      {
        title: "The reframe",
        body: [
          "There's nothing wrong with the part of you that longs for closeness.",
          "Your system learned to value connection deeply, notice disconnection fast, move toward repair, and hold on tightly when things felt uncertain.",
          "That made sense. It was adaptive.",
          "But now it can leave you feeling like your peace depends too much on someone else's tone, timing, or availability.",
          "Not because you're broken. Because your system still equates distance with danger."
        ]
      },
      {
        title: "Closing",
        body: [
          "You're not too much for wanting to feel close. You're not broken for caring this deeply. And you're not the needy one.",
          "You're someone whose system learned to hold tight to connection because it mattered.",
          "And with the right support, closeness can start to feel less fragile — and a lot less exhausting."
        ]
      }
    ],
    cta:
      "If you want help actually working with this — not just understanding it — we've built something for that."
  },
  avoidant: {
    title: "Dismissive-Avoidant",
    shortLabel: "DA",
    intro:
      "You care more than people think. But when closeness starts to feel like pressure, your system pulls back to protect your space and peace.",
    sections: [
      {
        title: "Opening",
        body: [
          "You're not cold. You're not incapable of love. And you're not as unaffected as people think.",
          "You've just learned that relying on other people can feel complicated.",
          "A part of you wants love, connection, and closeness like anyone else.",
          "But another part of you feels safer when there's a little space. A little room. A little less pressure.",
          "So when relationships start to feel intense, needy, or emotionally loaded, something in you starts to pull back.",
          "Not because you don't care. Because your system has learned: connection can cost me."
        ]
      },
      {
        title: "How this formed",
        body: [
          "Somewhere early on, your nervous system got the message that vulnerability wasn't exactly the safest place to rest.",
          "Maybe emotional needs weren't always welcomed. Maybe you learned to be easy, capable, low-maintenance, or self-sufficient.",
          "Maybe no one taught you what to do with big feelings — yours or anyone else's.",
          "So your system adapted.",
          "It learned: don't need too much, don't depend too much, and don't let other people have too much power over your peace.",
          "It learned that being independent was safer than being deeply impacted.",
          "And over time, that became your normal: I'll handle it myself."
        ]
      },
      {
        title: "How this shows up in your life",
        body: [
          "You're often the one who seems steady, competent, and capable.",
          "You likely value independence, don't love feeling managed, and prefer solving problems over sitting in emotion.",
          "People may see you as grounded, strong, self-contained, and hard to rattle.",
          "But underneath that, you may also downplay your own needs, disconnect from your feelings, or feel crowded when too much is being asked of you emotionally.",
          "A lot of the time, it's less I don't care and more I care, but this is starting to feel like too much."
        ]
      },
      {
        title: "In relationships",
        body: [
          "This is where the tension really shows up.",
          "You may deeply love your partner and still feel yourself pulling away when they want more emotional depth than you feel ready for, conflict gets intense, or closeness starts to feel like pressure.",
          "You might need space after heavy conversations, go quiet when overwhelmed, or struggle to explain what's happening inside while it's happening.",
          "From the outside, this can look distant or shut down.",
          "But inside it often feels more like: I need room to breathe so I don't disappear in this."
        ]
      },
      {
        title: "Your core bias",
        body: [
          "Underneath it all, your system often holds this belief: connection can become pressure. Closeness can cost me freedom.",
          "So your brain scans for demands, emotional intensity, expectations, and anything that feels engulfing or hard to escape.",
          "You may not even notice you're doing it.",
          "You just start to feel tired, irritated, distant, or less available.",
          "Not because love isn't there. Because your system is trying to protect your autonomy."
        ]
      },
      {
        title: "What happens in conflict",
        body: [
          "When conflict gets heated or emotionally heavy, your system often wants out.",
          "You might shut down, go quiet, need time before you can respond, or feel flooded by someone else's intensity.",
          "And the harder someone pushes for immediate repair, the more your body may say: nope, too much.",
          "This can be painful for both people.",
          "Because while your partner may experience distance, what you're often experiencing is overwhelm."
        ]
      },
      {
        title: "What your partner experiences",
        body: [
          "Your partner may experience you as distant, hard to reach, emotionally unavailable at times, or confusing — especially if you were more open earlier on.",
          "They may think you don't care as much as they do.",
          "But what they're not always seeing is this: closeness matters to you too. It just stops feeling safe sooner."
        ]
      },
      {
        title: "Intimacy + desire",
        body: [
          "For you, desire often does best when connection feels low pressure, mutual, warm, and free of obligation.",
          "When intimacy starts to feel like expectation, performance, or emotional debt, your system can pull back fast.",
          "You may still want closeness, touch, sex, affection, or shared moments.",
          "But your body often needs one key thing first: space inside the connection.",
          "You want to feel like you can still be yourself there."
        ]
      },
      {
        title: "Why your partner feels so different",
        body: [
          "If your partner leans more anxious or fearful, it can feel like they want to talk when you need space, reach harder when you're already overwhelmed, and their urgency makes you shut down even more.",
          "Then you get stuck in the classic loop: the more they pursue, the more you withdraw. The more you withdraw, the more they pursue.",
          "Neither of you are trying to make it worse.",
          "You're both trying to feel safe.",
          "You just reach safety from opposite directions."
        ]
      },
      {
        title: "The reframe",
        body: [
          "There's nothing wrong with you.",
          "Your system learned to rely on yourself, keep things manageable, protect your peace, and survive by not needing too much.",
          "That probably helped you for a long time.",
          "But now it can make love feel harder than it needs to.",
          "Not because you're broken. Because your system still equates closeness with cost."
        ]
      },
      {
        title: "Closing",
        body: [
          "You're not heartless. You're not incapable of intimacy. And you're not the problem.",
          "You're someone who learned that staying self-contained was safer than being deeply impacted.",
          "And with the right kind of safety, connection doesn't have to feel like something that takes you away from yourself."
        ]
      }
    ],
    cta:
      "If you want help actually working with this — not just understanding it — we've built something for that."
  },
  fearful: {
    title: "Fearful-Avoidant",
    shortLabel: "FA",
    intro:
      "You want closeness deeply, but part of you stays alert. Your system learned that connection matters — and that it can hurt.",
    sections: [
      {
        title: "Opening",
        body: [
          "You don't feel inconsistent.",
          "You feel pulled.",
          "Like part of you wants closeness — really wants it. To feel chosen, safe, settled with someone.",
          "And another part of you is a little braced. Watching. Questioning. Not fully relaxing.",
          "You can feel really connected… and then something shifts, and you're not so sure anymore.",
          "It's confusing. Even for you.",
          "But it's not random.",
          "It's what happens when your system learned: connection matters… but it can also hurt."
        ]
      },
      {
        title: "How this formed",
        body: [
          "At some point growing up, your system had to figure out: how do I stay close to people and not get hurt doing it?",
          "And instead of landing on one clear answer, it learned both: stay close and stay ready.",
          "Maybe connection felt inconsistent, a bit unpredictable, or sometimes good and other times confusing.",
          "Maybe you had to read the room, adjust quickly, or manage how other people were feeling.",
          "Or maybe your needs just weren't met in a steady, reliable way.",
          "So your system adapted.",
          "It got really good at noticing things. Really good at subtle shifts. Really good at preparing for something to change.",
          "It learned: I need connection, but I can't fully let my guard down.",
          "And now it does that automatically — even when you actually want to relax."
        ]
      },
      {
        title: "How this shows up in your life",
        body: [
          "You're usually pretty tuned in.",
          "You notice things. You pick up on tone, energy, small changes.",
          "People might see you as thoughtful, aware, or emotionally intelligent.",
          "But inside, it can feel like a lot.",
          "You might replay conversations, second-guess yourself, or go back and forth on decisions.",
          "There's often a quiet hum of: just make sure everything's okay… even when things seem fine."
        ]
      },
      {
        title: "In relationships",
        body: [
          "This is where it really shows up.",
          "You can feel really close to someone… and then suddenly unsure.",
          "You might want to be close, then feel overwhelmed by it. Reach for them, then pull back if something feels off.",
          "From the outside, it can look like hot and cold.",
          "But inside it's more like: I really want this… I just don't know if I can fully trust it yet."
        ]
      },
      {
        title: "Your core bias",
        body: [
          "Underneath everything, your system holds this: connection is important… but it's not fully safe.",
          "So your brain keeps an eye on things.",
          "You notice small changes, tone shifts, and things that feel even slightly off.",
          "Even in good moments, there can be a tiny voice saying: don't get too comfortable…",
          "Not because you're negative — because your system is trying to protect you from being surprised."
        ]
      },
      {
        title: "What happens in conflict",
        body: [
          "When something feels off, it hits fast.",
          "You might feel a rush of emotion, want to talk it through right away, or need reassurance and clarity.",
          "And if that doesn't happen, something can flip.",
          "You might pull back, shut down, or start questioning everything.",
          "Like: if this isn't okay… maybe none of it is."
        ]
      },
      {
        title: "What your partner experiences",
        body: [
          "Your partner might experience you as intense sometimes, hard to fully settle with, or going back and forth between closeness and distance.",
          "They might not understand why.",
          "But what's actually happening is this: you're trying to find a way to stay without getting hurt in the process."
        ]
      },
      {
        title: "Intimacy + desire",
        body: [
          "For you, intimacy isn't just physical.",
          "It's really connected to feeling safe, feeling chosen, and feeling emotionally close.",
          "When something feels off between you, your body usually feels it too: less desire, less openness, harder to stay present.",
          "But when things feel good, you can be really open, really connected, really there.",
          "It's not that you don't have desire. It's that your desire follows: do I feel safe here?"
        ]
      },
      {
        title: "Why your partner feels so different",
        body: [
          "If your partner leans more avoidant, it can feel like you're reaching while they're pulling away.",
          "You want to talk. They want space.",
          "You feel urgency. They feel pressure.",
          "And you get stuck in this loop: the more you reach, the more they back up. The more they back up, the less safe you feel.",
          "Not because either of you are doing something wrong. But because you're both trying to feel safe in totally different ways."
        ]
      },
      {
        title: "The reframe",
        body: [
          "There's nothing wrong with you.",
          "You learned to pay attention, stay aware, and protect yourself while staying connected.",
          "That made sense. It helped you.",
          "But now it can feel like your system is working overtime — even when it doesn't need to."
        ]
      },
      {
        title: "Closing",
        body: [
          "You're not too much. You're not confusing.",
          "You're someone who learned how to love and how to protect yourself at the same time.",
          "And those two parts don't have to keep fighting forever."
        ]
      }
    ],
    cta:
      "If you want help actually working with this — not just understanding it — we've built something for that."
  },
  secure: {
    title: "Secure",
    shortLabel: "Secure",
    intro:
      "You don't need relationships to be perfect to feel okay in them. Your system has learned that connection can stay safe, even when life gets messy.",
    sections: [
      {
        title: "Opening",
        body: [
          "You don't experience connection as perfect. You experience it as workable.",
          "You know relationships can be messy, emotional, imperfect, and still okay.",
          "You can love someone without disappearing into them. You can need closeness without panicking. You can need space without shutting love out.",
          "That doesn't mean you never get hurt, triggered, or thrown off.",
          "It just means your system has learned something important: connection can be safe, even when it isn't perfect."
        ]
      },
      {
        title: "How this formed",
        body: [
          "Usually, secure attachment grows when connection is steady enough, safe enough, and reliable enough that your nervous system doesn't have to work overtime to protect itself.",
          "It doesn't mean childhood was flawless. It doesn't mean no one ever hurt you.",
          "It means you got enough of the message that your needs matter, closeness can be trusted, conflict can be repaired, and being yourself doesn't automatically threaten connection.",
          "So your system learned it could stay in relationship without constantly bracing for loss, engulfment, or chaos."
        ]
      },
      {
        title: "How this shows up in your life",
        body: [
          "You're often able to stay grounded under stress, name what you feel without getting swallowed by it, and ask for what you need without a huge amount of shame.",
          "You may still overthink sometimes. You may still get triggered. You may still have hard days.",
          "But in general, you can usually come back to center.",
          "There's an underlying sense of: we can probably work with this."
        ]
      },
      {
        title: "In relationships",
        body: [
          "You tend to have room for both closeness and individuality.",
          "You can let someone in without feeling trapped, ask for reassurance without collapsing, offer space without using it as escape, and stay connected during conflict without needing everything to be instantly fixed.",
          "You're not perfect in love.",
          "You're just less likely to confuse discomfort with danger."
        ]
      },
      {
        title: "Your core bias",
        body: [
          "If there is a secure bias, it's something like this: connection can hold real life.",
          "Your brain is less likely to assume distance means abandonment, closeness means engulfment, or conflict means the relationship is doomed.",
          "You're more likely to interpret bumps in the road as something to understand, something to work through, and something survivable.",
          "That doesn't make you naive. It makes you resourced."
        ]
      },
      {
        title: "What happens in conflict",
        body: [
          "When conflict comes up, you may still feel hurt, angry, protective, or overwhelmed.",
          "But you're more likely to stay present, communicate clearly, take a pause without disappearing, return to the conversation, and believe repair is possible.",
          "You don't usually need conflict to mean more than it means.",
          "It can just be conflict."
        ]
      },
      {
        title: "What your partner experiences",
        body: [
          "A partner often experiences you as grounding, available, clear, and easier to repair with.",
          "That doesn't mean they never feel frustrated with you.",
          "It means your system is less likely to turn normal relationship strain into a full threat response.",
          "You often help create safety simply by staying emotionally available without becoming overwhelming."
        ]
      },
      {
        title: "Intimacy + desire",
        body: [
          "For you, intimacy can often feel like an extension of connection rather than a test of it.",
          "You may still go through dry spells, stress, mismatches, or changing desire.",
          "But your system is less likely to turn those moments into proof something is deeply wrong, proof you're unwanted, or proof you're trapped.",
          "That often creates more room for honesty, play, mutuality, and repair."
        ]
      },
      {
        title: "Why your partner feels so different",
        body: [
          "If your partner is more anxious, avoidant, or fearful, you may sometimes feel confused by how high the stakes seem for them.",
          "You may think: we're okay, why does this feel so big? or why does space feel so threatening?",
          "The answer is usually simple: their nervous system learned something different than yours did.",
          "That doesn't make them difficult. It means their body has different alarms."
        ]
      },
      {
        title: "The reframe",
        body: [
          "Secure attachment isn't perfection. It's flexibility.",
          "It's the ability to stay yourself in connection, stay connected during discomfort, and trust that strain doesn't automatically mean rupture.",
          "It's something some people start with — and something many people can build more of over time."
        ]
      },
      {
        title: "Closing",
        body: [
          "You're not secure because you never struggle.",
          "You're secure because struggle doesn't instantly become a threat to connection, identity, or safety.",
          "And that steadiness doesn't just help you. It helps create safety for the people you love too."
        ]
      }
    ],
    cta:
      "If you want help actually working with this — not just understanding it — we've built something for that."
  }
};

const premiumInsights = {
  anxious: {
    longFor: "You don't just want someone to stay. You want to feel chosen. To feel like you matter so much to them that they wouldn't dream of leaving. You want love that doesn't make you second-guess every pause, every shift in tone, every moment of quiet. You long for the kind of safety where you can finally exhale.",
    triggers: "Distance, even when it's not about you. Delayed responses. A shift in energy. When your partner seems fine but won't talk about it. When they need space and you don't know why. When reassurance doesn't land the way you hoped. When closeness feels conditional, like it could be taken away at any moment.",
    protection: "You move toward. You check in. You reach. You analyze. You replay conversations looking for proof that things are okay—or proof that they're not. You try to fix it before it becomes unfixable. You offer more, give more, show up harder. Not because you're needy. Because your system learned that if you pay close enough attention, maybe you can keep love from slipping away.",
    partnerExperiences: "Your partner may feel like they can't ever fully settle you. Like no amount of reassurance is quite enough. They might feel pressure to respond quickly, explain themselves often, or manage your emotional state. They may love you deeply and still feel exhausted by how much energy it takes to help you feel safe. What they might not see is that you're not asking them to fix you—you're asking them to help you trust that they're not going anywhere.",
    shift: "The shift isn't learning to need less. It's learning that your safety can't live entirely in someone else's hands. It's building the capacity to soothe yourself before you reach for reassurance. It's trusting that distance doesn't always mean disconnection. It's letting your nervous system learn, slowly, that love can stay even when it doesn't feel perfect in the moment."
  },
  avoidant: {
    longFor: "You want love without losing yourself. You want closeness that doesn't feel like pressure, intimacy that doesn't require constant emotional labor, and connection that lets you breathe. You long for someone who won't make you feel guilty for needing space, who won't collapse when you pull back, and who trusts that your love is real even when you go quiet.",
    triggers: "Neediness. Emotional intensity. When someone wants to 'talk about us' and you're not ready. When your partner interprets your need for space as rejection. When closeness starts to feel like obligation. When you're expected to show up emotionally in ways that feel forced. When vulnerability feels like a trap instead of a relief.",
    protection: "You create space. You minimize. You handle things alone. You prioritize independence over interdependence. You go quiet when things get too heavy. You downplay your own needs so no one expects too much. Not because you don't care. Because your system learned that relying on others costs more than it gives. That being self-sufficient is safer than being deeply impacted.",
    partnerExperiences: "Your partner may feel locked out. Like they can't quite reach you, no matter how hard they try. They might interpret your withdrawal as coldness or lack of care. They may feel like they're always the one reaching, always the one asking for more, while you seem fine on your own. What they might not see is that you do care—you just don't know how to stay close without feeling like you're disappearing.",
    shift: "The shift isn't forcing yourself to be more emotional. It's learning that healthy closeness doesn't require losing yourself. It's staying present during uncomfortable conversations instead of shutting down. It's recognizing that your need for space is valid, but so is your partner's need for connection. It's letting yourself be impacted without feeling engulfed. It's trusting that you can be both connected and free."
  },
  fearful: {
    longFor: "You want to feel safe enough to stay. You want love that doesn't feel unpredictable. You want to trust someone fully without the other shoe dropping. You long for connection that doesn't trigger your fear and space that doesn't trigger your abandonment. You want both closeness and safety, and you're exhausted from feeling like you can't have both at the same time.",
    triggers: "Inconsistency. When someone gets too close too fast. When they pull away right after things felt good. When you can't predict how they'll respond. When emotional safety feels conditional. When you start to relax and then something shifts. When your partner seems fine one moment and distant the next. When intimacy brings up old pain you didn't expect to feel.",
    protection: "You oscillate. You reach, then retreat. You open up, then shut down. You want reassurance, but when you get it, it doesn't always feel safe to receive. You test. You monitor. You brace. Not because you're confusing or unstable. Because your system learned that connection matters and connection hurts, and it's trying to do both at once—stay close and stay ready.",
    partnerExperiences: "Your partner may feel like they can never get it right. Like you want them close and then push them away. They might feel confused, exhausted, or like they're constantly walking on eggshells. They may love you and still not understand why you're hot one moment and cold the next. What they might not see is that you're not playing games—you're trying to figure out if it's safe to let your guard down.",
    shift: "The shift isn't picking one strategy and sticking to it. It's building enough safety that both parts of you—the one that wants closeness and the one that fears it—can coexist without fighting. It's learning to name the push-pull out loud instead of acting it out. It's letting your nervous system experience small moments of safety without waiting for the threat. It's trusting that you don't have to choose between connection and protection forever."
  },
  secure: {
    longFor: "You want depth without drama. You want intimacy that feels easeful, not effortful. You want to grow together, repair cleanly, and love in a way that doesn't require constant vigilance. You long for someone who can match your capacity for both closeness and autonomy—someone who doesn't collapse under conflict or disappear when things get real.",
    triggers: "Persistent insecurity that no amount of reassurance resolves. Emotional escalation that feels disproportionate. When repair becomes impossible because your partner can't regulate. When you're expected to manage someone else's nervous system. When closeness starts to feel like caretaking instead of partnership. When you're the only one doing the emotional heavy lifting.",
    protection: "You stay steady. You name what's happening. You offer repair. You hold space. You don't collapse or shut down easily. But when the cycle keeps repeating and your efforts aren't met, you may start to pull back—not out of fear, but out of self-preservation. Not because you don't care, but because you recognize when the relationship is asking more than it's giving.",
    partnerExperiences: "Your partner may experience you as a grounding force. Someone who doesn't make everything a catastrophe. Someone who can stay present during hard conversations. But they may also feel intimidated by your steadiness, or frustrated that you don't seem to struggle the way they do. What they might not see is that your security isn't effortless—it's the result of learning to regulate, repair, and trust that rupture doesn't mean ending.",
    shift: "The shift isn't about you becoming more secure—it's about protecting your security while staying open. It's learning to recognize when someone's nervous system needs co-regulation versus when they need to build their own capacity. It's staying connected without absorbing someone else's dysregulation. It's knowing that you can offer safety without sacrificing your own. It's understanding that love isn't always enough if the nervous systems can't sync."
  }
};

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'quiz', label: 'Quiz', icon: ClipboardList },
  { id: 'progress', label: 'Progress', icon: BarChart3 },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function ReRootedApp() {
  const [screen, setScreen] = useState('home');
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedEducationType, setSelectedEducationType] = useState<'anxious' | 'avoidant' | 'fearful' | 'secure'>('anxious');
  const [isPremium, setIsPremium] = useState(false);

  const quizProgress = Math.round(
    (Object.keys(answers).length / attachmentQuestions.length) * 100
  );

  const result = useMemo(() => {
    const totals = { anxious: 0, avoidant: 0, fearful: 0, secure: 0 };

    Object.values(answers).forEach((option: any) => {
      Object.entries(option.scores).forEach(([key, value]) => {
        totals[key as keyof typeof totals] += value as number;
      });
    });

    const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
    const topType = (sorted[0]?.[0] as keyof typeof ritualsByType) || 'secure';
    return { topType, totals, config: ritualsByType[topType] };
  }, [answers]);

  const currentQuestion = attachmentQuestions[quizIndex];

  const chooseAnswer = (option: any) => {
    const nextAnswers = { ...answers, [currentQuestion.id]: option };
    setAnswers(nextAnswers);

    if (quizIndex < attachmentQuestions.length - 1) {
      setQuizIndex(quizIndex + 1);
    } else {
      setScreen('dashboard');
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuizIndex(0);
    setScreen('quiz');
  };

  const openEducation = (type: 'anxious' | 'avoidant' | 'fearful' | 'secure') => {
    setSelectedEducationType(type);
    setScreen('learn');
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 pb-28 pt-4 sm:pt-6">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <div className="rounded-[28px] bg-gradient-to-b from-white to-stone-100 p-6 sm:p-8 shadow-sm">
                <Badge className="mb-4 rounded-full bg-stone-900 px-4 py-1.5 text-sm text-stone-50 hover:bg-stone-900">
                  Nervous-system safe relationship growth
                </Badge>
                <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                  ReRooted
                </h1>
                <p className="mt-4 text-base sm:text-lg leading-7 text-stone-600">
                  Rebuild connection through emotional safety, structured
                  intimacy, and repair that your body can actually trust.
                </p>
                <div className="mt-7 grid grid-cols-1 gap-3">
                  <Button
                    className="h-14 rounded-2xl text-base font-medium shadow-sm active:scale-[0.98] transition-transform"
                    onClick={() => setScreen('quiz')}
                  >
                    Start attachment quiz
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 rounded-2xl text-base font-medium active:scale-[0.98] transition-transform"
                    onClick={() => setScreen('dashboard')}
                  >
                    Preview dashboard
                  </Button>
                </div>
              </div>

              <div className="grid gap-3">
                <Card className="rounded-3xl border-none shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-2xl bg-stone-100 p-3">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base mb-1">Attachment-aware</p>
                      <p className="text-sm leading-6 text-stone-600">
                        Understand your protection patterns before trying to fix
                        the relationship.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-2xl bg-stone-100 p-3">
                      <Heart className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base mb-1">Intimacy you can build</p>
                      <p className="text-sm leading-6 text-stone-600">
                        Move from pressure and shutdown into safety, desire, and
                        mutual connection.
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="rounded-3xl border-none shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className="rounded-2xl bg-stone-100 p-3">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-base mb-1">Personalized path</p>
                      <p className="text-sm leading-6 text-stone-600">
                        Route into Rekindle or Ignite with practices matched to
                        your nervous system.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {screen === 'quiz' && (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm text-stone-500">
                  <span>Attachment Quiz</span>
                  <span>
                    {quizIndex + 1} / {attachmentQuestions.length}
                  </span>
                </div>
                <Progress value={quizProgress} className="h-2 rounded-full" />
              </div>

              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader className="pb-5">
                  <CardTitle className="text-2xl sm:text-3xl leading-8">
                    {currentQuestion.prompt}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.text}
                      onClick={() => chooseAnswer(option)}
                      className="w-full rounded-2xl border-2 border-stone-200 bg-white p-5 text-left text-base leading-6 transition hover:border-stone-400 hover:shadow-md active:scale-[0.98] active:bg-stone-50"
                    >
                      {option.text}
                    </button>
                  ))}
                </CardContent>
              </Card>

              <p className="px-1 text-sm leading-6 text-stone-500">
                This is your first-pass attachment read, not a diagnosis. Later
                we can add subtype nuance, intimacy patterns, protest behavior,
                repair style, and Enneagram overlays.
              </p>
            </motion.div>
          )}

          {screen === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <div className="rounded-[28px] bg-stone-900 p-6 sm:p-8 text-stone-50 shadow-lg">
                <p className="text-sm text-stone-400 font-medium">Your current result</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-semibold">
                  {result.config.label}
                </h2>
                <div className="mt-4 flex items-center gap-2">
                  <Badge className="rounded-full bg-stone-50 text-stone-900 hover:bg-stone-50 px-4 py-1.5 text-sm font-medium">
                    {result.config.path} Path
                  </Badge>
                </div>
                <p className="mt-5 text-base leading-7 text-stone-300">
                  {result.config.tone}
                </p>
                <Button
                  variant="outline"
                  className="mt-6 h-12 w-full rounded-2xl border-2 border-stone-700 bg-transparent text-stone-50 hover:bg-stone-800 hover:text-stone-50 active:scale-[0.98] transition-transform font-medium"
                  onClick={() => openEducation(result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure')}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn this pattern
                </Button>
              </div>

              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Today&apos;s grounding ritual</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-7 text-stone-600">
                    {result.config.ritual}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Daily connection rep</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-base leading-7 text-stone-600">
                    {result.config.rep}
                  </p>
                </CardContent>
              </Card>

{!isPremium ? (
                <Card className="rounded-[28px] border-none bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                      <CardTitle>Unlock Your Insight</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm leading-6 text-stone-700">
                      Get a deeply personalized breakdown of your attachment pattern — what you truly long for, what actually triggers you, and the exact shift that will help you most.
                    </p>
                    <Button
                      className="w-full h-14 rounded-2xl bg-stone-900 hover:bg-stone-800 text-base font-medium shadow-md active:scale-[0.98] transition-transform"
                      onClick={() => setIsPremium(true)}
                    >
                      Unlock premium insight
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-[28px] border-none bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <CardTitle>Your Insight</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm leading-6 text-stone-700">
                      A deeply personalized analysis of your attachment pattern is ready.
                    </p>
                    <Button
                      className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-base font-medium shadow-md active:scale-[0.98] transition-transform"
                      onClick={() => setScreen('insight')}
                    >
                      View your insight
                    </Button>
                  </CardContent>
                </Card>
              )}

              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader>
                  <CardTitle>What comes next</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-stone-600">
                  <p>
                    Next we can layer in your full attachment quiz, your
                    Enneagram typing, partner-dynamic routing, and the
                    intimacy/conflict tracks that make ReRooted actually
                    sellable.
                  </p>
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={resetQuiz}
                  >
                    Retake quiz
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-stone-600">
                  <p>
                    This screen is ready for streaks, completed rituals,
                    intimacy milestones, and repair wins.
                  </p>
                  <p>For a paid product, this is where retention lives.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm leading-6 text-stone-600">
                  <p>
                    Add user accounts, saved quiz results, partner linking,
                    subscription access, and settings here.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12 active:scale-95 transition-transform"
                  onClick={() => setScreen('dashboard')}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-semibold">Attachment Education</h1>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {(['anxious', 'avoidant', 'fearful', 'secure'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedEducationType(type)}
                    className={`rounded-2xl border-2 px-3 py-3 text-sm font-medium transition-all active:scale-95 ${
                      selectedEducationType === type
                        ? 'border-stone-900 bg-stone-900 text-stone-50 shadow-sm'
                        : 'border-stone-200 bg-white text-stone-600 active:bg-stone-50'
                    }`}
                  >
                    {ritualsByType[type].label.split('-')[0]}
                  </button>
                ))}
              </div>

              <Card className="rounded-[28px] border-none shadow-sm">
                <CardHeader>
                  <CardTitle>{attachmentEducation[selectedEducationType].title}</CardTitle>
                  <p className="text-sm leading-6 text-stone-600">
                    {attachmentEducation[selectedEducationType].intro}
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {attachmentEducation[selectedEducationType].sections.map((section, index) => (
                    <div key={index}>
                      <h3 className="mb-3 font-semibold text-stone-900">{section.title}</h3>
                      <div className="space-y-3">
                        {section.body.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-sm leading-6 text-stone-600">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none bg-stone-100 shadow-sm">
                <CardContent className="p-5">
                  <p className="text-sm leading-6 text-stone-600">
                    {attachmentEducation[selectedEducationType].cta}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {screen === 'insight' && isPremium && (
            <motion.div
              key="insight"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex-1 space-y-5"
            >
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-12 w-12 active:scale-95 transition-transform"
                  onClick={() => setScreen('dashboard')}
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
                <h1 className="text-2xl font-semibold">Your Insight</h1>
              </div>

              <div className="rounded-[28px] bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 p-6 text-white shadow-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5" />
                  <Badge className="rounded-full bg-white/20 text-white hover:bg-white/20 backdrop-blur">
                    Premium
                  </Badge>
                </div>
                <h2 className="text-3xl font-semibold mb-2">
                  {attachmentEducation[result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure'].title}
                </h2>
                <p className="text-sm leading-6 text-white/90">
                  A deeply personalized breakdown of your attachment pattern
                </p>
              </div>

              <Card className="rounded-[28px] border-none bg-gradient-to-br from-rose-50 to-pink-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500" />
                    What you long for
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-700">
                    {premiumInsights[result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure'].longFor}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-amber-600">⚡</span>
                    What actually triggers you
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-700">
                    {premiumInsights[result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure'].triggers}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none bg-gradient-to-br from-blue-50 to-cyan-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-blue-500" />
                    What your protection pattern looks like
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-700">
                    {premiumInsights[result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure'].protection}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none bg-gradient-to-br from-purple-50 to-indigo-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-500" />
                    What your partner likely experiences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-700">
                    {premiumInsights[result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure'].partnerExperiences}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none bg-gradient-to-br from-emerald-50 to-teal-50 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-emerald-500" />
                    The shift that will help you most
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-stone-700">
                    {premiumInsights[result.topType as 'anxious' | 'avoidant' | 'fearful' | 'secure'].shift}
                  </p>
                </CardContent>
              </Card>

              <Card className="rounded-[28px] border-none bg-stone-900 shadow-sm">
                <CardContent className="p-5 text-center">
                  <p className="text-sm leading-6 text-stone-300">
                    This insight is based on your attachment pattern. As you grow, your patterns can shift — and so will your understanding of yourself.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-md border-t border-stone-200 bg-white/80 px-4 py-2 backdrop-blur-xl shadow-lg">
          <div className="grid grid-cols-4 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-xs font-medium transition-all active:scale-95 ${
                    active
                      ? 'bg-stone-900 text-stone-50 shadow-sm'
                      : 'text-stone-600 active:bg-stone-100'
                  }`}
                >
                  <Icon className={`transition-all ${active ? 'h-5 w-5' : 'h-5 w-5'}`} />
                  <span className="leading-none">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
