import { Part1Question, Part2Question, Part3Question } from "./types";

export const PART1_QUESTIONS: Part1Question[] = [
  {
    id: 'p1-1',
    imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800',
    keywords: ['office', 'collaborate']
  },
  {
    id: 'p1-2',
    imageUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800',
    keywords: ['meeting', 'presentation']
  },
  {
    id: 'p1-3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=800',
    keywords: ['team', 'discussion']
  },
  {
    id: 'p1-4',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
    keywords: ['computer', 'monitor']
  },
  {
    id: 'p1-5',
    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800',
    keywords: ['coffee', 'workshop']
  }
];

export const PART2_QUESTIONS: Part2Question[] = [
  {
    id: 'p2-1',
    emailContext: "Subject: Request for information about our new project management tool.\n\nDear Training Team,\n\nI am interested in learning more about the software your company uses for project tracking. Could you please provide some details?\n\nBest regards,\nSarah Johnson",
    requirements: ["Give one suggestion for a specific tool", "Ask two questions about their needs"]
  },
  {
    id: 'p2-2',
    emailContext: "Subject: Inquiry about office supply orders.\n\nHi,\n\nI noticed that we are running low on printer paper and ink cartridges. Do you know who is responsible for placing these orders?\n\nThanks,\nMark",
    requirements: ["Provide the name of the contact person", "Ask one question about urgency"]
  }
];

export const PART3_QUESTIONS: Part3Question[] = [
  {
    id: 'p3-1',
    topic: "Some people prefer to work for a large company, while others prefer to work for a small company. Which do you prefer? Use specific reasons and examples to support your opinion."
  }
];

export const REAL_TEST_PART1: Part1Question[] = [
  {
    id: 'rt-p1-1',
    imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
    keywords: ['team', 'technology']
  },
  {
    id: 'rt-p1-2',
    imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800',
    keywords: ['presentation', 'audience']
  },
  {
    id: 'rt-p1-3',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800',
    keywords: ['collaboration', 'whiteboard']
  },
  {
    id: 'rt-p1-4',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800',
    keywords: ['research', 'laptop']
  },
  {
    id: 'rt-p1-5',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800',
    keywords: ['strategy', 'brainstorm']
  }
];

export const REAL_TEST_PART2: Part2Question[] = [
  {
    id: 'rt-p2-1',
    emailContext: "Subject: Issues with the new office software installation.\n\nDear IT Support,\n\nI am having trouble installing the new project management tool on my company laptop. It keeps showing an error message regarding compatibility. Could you assist me with this?\n\nSincerely,\nDavid Brown",
    requirements: ["Offer a specific time for technical support", "Ask for a screenshot of the error"]
  },
  {
    id: 'rt-p2-2',
    emailContext: "Subject: Request for feedback on the quarterly report.\n\nHi everyone,\n\nI've just uploaded the draft of our quarterly performance report to the shared folder. Please review it and send me your comments by Friday.\n\nThanks,\nJennifer",
    requirements: ["Confirm receipt of the report", "Mention one specific section you will focus on"]
  }
];

export const REAL_TEST_PART3: Part3Question[] = [
  {
    id: 'rt-p3-1',
    topic: "Some people believe that technology has made our lives simpler, while others argue that it has made our lives more complicated. What is your opinion? Support your view with specific reasons and examples."
  }
];
