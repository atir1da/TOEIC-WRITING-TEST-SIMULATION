import { Part1Question, Part2Question, Part3Question } from "./types";

export const PART1_QUESTIONS: Part1Question[] = [
  { id: 'p1-1', imageUrl: 'https://images.unsplash.com/photo-1600880212319-7832e5ef8c9c?auto=format&fit=crop&q=80&w=800', keywords: ['office', 'collaborate'] },
  { id: 'p1-2', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', keywords: ['meeting', 'presentation'] },
  { id: 'p1-3', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', keywords: ['team', 'discussion'] },
  { id: 'p1-4', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800', keywords: ['computer', 'monitor'] },
  { id: 'p1-5', imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=800', keywords: ['coffee', 'workshop'] },
  { id: 'p1-6', imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19480c5?auto=format&fit=crop&q=80&w=800', keywords: ['construction', 'helmet'] },
  { id: 'p1-7', imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=800', keywords: ['library', 'bookshelf'] },
  { id: 'p1-8', imageUrl: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800', keywords: ['restaurant', 'waiter'] },
  { id: 'p1-9', imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800', keywords: ['warehouse', 'forklift'] },
  { id: 'p1-10', imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800', keywords: ['laboratory', 'microscope'] },
  { id: 'p1-11', imageUrl: 'https://images.unsplash.com/photo-1530521954074-e64f6810b32d?auto=format&fit=crop&q=80&w=800', keywords: ['airport', 'terminal'] },
  { id: 'p1-12', imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', keywords: ['grocery', 'shopping'] },
  { id: 'p1-13', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800', keywords: ['park', 'bench'] },
  { id: 'p1-14', imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800', keywords: ['classroom', 'whiteboard'] },
  { id: 'p1-15', imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800', keywords: ['hospital', 'nurse'] },
  { id: 'p1-16', imageUrl: 'https://images.unsplash.com/photo-1565608438257-fac3c27beb36?auto=format&fit=crop&q=80&w=800', keywords: ['factory', 'assembly'] },
  { id: 'p1-17', imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', keywords: ['gym', 'equipment'] },
  { id: 'p1-18', imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&q=80&w=800', keywords: ['street', 'crossing'] },
  { id: 'p1-19', imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800', keywords: ['kitchen', 'chef'] },
  { id: 'p1-20', imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800', keywords: ['reception', 'lobby'] }
];

export const PART2_QUESTIONS: Part2Question[] = [
  { 
    id: 'p2-1', 
    type: 'business',
    emailContext: "Subject: Inquiry Regarding Project Management Software Training and Implementation\n\nDear Training Department,\n\nOur department is currently evaluating several project management platforms to streamline our internal workflows and improve cross-team collaboration. We have heard that your team has successfully implemented a new tracking tool that has significantly boosted productivity.\n\nCould you please provide detailed information regarding the specific software you are currently using? We are particularly interested in its integration capabilities with our existing systems and any training resources that might be available for new users.\n\nThank you for your assistance.\n\nBest regards,\n\nSarah Johnson\nSenior Project Coordinator, Operations Division", 
    requirements: ["Suggest a professional project management tool (e.g., Jira, Asana, or Monday.com)", "Ask two specific questions about their current workflow requirements"] 
  },
  { 
    id: 'p2-2', 
    type: 'business',
    emailContext: "Subject: Urgent: Low Inventory of Critical Office Supplies and Ordering Procedures\n\nHello Logistics Team,\n\nI am writing to bring to your attention that our inventory of essential office supplies, specifically high-capacity printer paper and premium ink cartridges, has reached a critical level. With several large-scale reports due by the end of this week, it is imperative that we restock these items immediately to avoid any operational delays.\n\nCould you please clarify who is currently designated as the primary point of contact for placing urgent supply orders? Additionally, if there is a specific procurement form I need to complete, kindly advise.\n\nThank you for your prompt attention to this matter.\n\nWarm regards,\n\nMark Henderson\nAdministrative Assistant", 
    requirements: ["Provide the full name and department of the supply manager", "Inquire about the expected delivery timeline for urgent requests"] 
  },
  { 
    id: 'p2-3', 
    type: 'business',
    emailContext: "Subject: Proposal to Reschedule the Monday Morning Project Sync Meeting\n\nHi Project Team,\n\nDue to an unforeseen scheduling conflict with an executive board meeting, I find it necessary to propose a change to our upcoming project synchronization session currently set for Monday at 10:00 AM. I apologize for any inconvenience this adjustment may cause to your schedules.\n\nWould it be feasible for the team to relocate our discussion to Tuesday morning? I believe a 9:30 AM start would allow us sufficient time to cover all agenda items before the afternoon deliverables are due.\n\nI look forward to your confirmation.\n\nRegards,\n\nAlex Sterling\nTeam Lead", 
    requirements: ["Confirm your availability for the proposed Tuesday slot", "Inquire about the specific agenda items the team wishes to prioritize"] 
  },
  { 
    id: 'p2-4', 
    type: 'business',
    emailContext: "Subject: Accommodation Recommendations for the Upcoming International Marketing Summit\n\nHello Travel Coordination Team,\n\nI am finalizing my plans to attend the International Marketing Summit scheduled for next month in downtown Chicago. Given the high volume of attendees expected this year, I am eager to secure my lodging as soon as possible to ensure proximity to the main conference venue.\n\nDo you happen to have a list of preferred or recommended hotels that offer corporate rates for our employees? Ideally, I am looking for accommodations within walking distance of the Convention Center.\n\nBest regards,\n\nEmily Vance\nMarketing Manager", 
    requirements: ["Suggest two reputable hotels with business amenities", "Ask a question regarding their preferred maximum nightly budget"] 
  },
  { 
    id: 'p2-5', 
    type: 'business',
    emailContext: "Subject: Strategic Feedback on the New Corporate Website Beta Mockups\n\nDear Design and UX Team,\n\nFollowing my comprehensive review of the latest beta mockups for our new corporate website, I would like to offer some initial feedback. While the overall layout is modern and user-friendly, I have significant concerns regarding the primary color palette, as it does not seem to fully align with our refreshed brand guidelines.\n\nI would appreciate the opportunity to sit down with your team to discuss potential adjustments. Could we schedule a brief session to walk through these concerns in person?\n\nThank you for your hard work on this project.\n\nSincerely,\n\nChristopher Miller\nBrand Strategy Director", 
    requirements: ["Propose two potential meeting times later this week", "Request a digital sample of an alternative color scheme before the meeting"] 
  },
  { 
    id: 'p2-6', 
    type: 'business',
    emailContext: "Subject: Formal Request for Vacation Leave and Temporary Task Handover\n\nDear Human Resources and Management,\n\nI am writing to formally request a period of vacation leave from July 10th through July 15th. I have reviewed my current project deadlines and have ensured that all my primary deliverables will be completed or at a stable milestone before my departure.\n\nI am committed to ensuring a smooth transition during my absence. Please let me know if this request is acceptable according to our department's current staffing schedule.\n\nRespectfully,\n\nJessica Thorne\nAccount Executive", 
    requirements: ["Formally approve the leave request", "Ask for a brief summary of which colleague will be handling their urgent client calls"] 
  },
  { 
    id: 'p2-7', 
    type: 'business',
    emailContext: "Subject: Clarification Request Regarding the Q4 Performance Bonus Criteria\n\nHello HR Department,\n\nI am seeking some clarification regarding the performance metrics that will be utilized to determine the Q4 annual bonus payouts this year. In particular, I am interested in how individual achievements are weighted against overall departmental goals in the final calculation.\n\nProviding more transparency on these criteria would be immensely helpful for my team's end-of-year planning. Thank you for your time and guidance.\n\nKind regards,\n\nMichael Chen\nDepartment Manager", 
    requirements: ["Detail three core performance indicators used in the evaluation", "Offer to schedule a brief departmental video call for further Q&A"] 
  },
  { 
    id: 'p2-8', 
    type: 'business',
    emailContext: "Subject: Invitation to the Annual Corporate Charity Gala and Awards Night\n\nDear Esteemed Colleagues,\n\nIt is my pleasure to invite you to represent our firm at the upcoming Annual Corporate Charity Gala, which will take place next Saturday evening at the Grand Ballroom. This event is a significant opportunity for us to support our local community partners while celebrating our collective successes over the past year.\n\nWe have reserved several tables for our management team. Please let us know if you will be able to join us for this prestigious evening.\n\nBest regards,\n\nDirector Arthur Stevens\nExecutive Vice President", 
    requirements: ["Formally accept the invitation on behalf of your team", "Inquire about the specific dress code requirements for the event"] 
  },
  { 
    id: 'p2-9', 
    type: 'business',
    emailContext: "Subject: Persistent Technical Difficulties with the CRM Client Portal Access\n\nHi Technical Support Team,\n\nI am experiencing persistent issues when attempting to log into the CRM client portal this morning. Despite multiple attempts to reset my credentials, I continue to receive an 'Access Denied' message. This has become a critical blocker as I need to update several high-priority client records before our noon briefing.\n\nI would appreciate it if you could investigate this matter as a priority. Thank you for your support.\n\nRegards,\n\nLaura Bennett\nSales Lead", 
    requirements: ["Suggest a troubleshooting step like clearing the browser cache", "Request their employee identification number to verify system permissions"] 
  },
  { 
    id: 'p2-10', 
    type: 'business',
    emailContext: "Subject: Inquiry Regarding the 2024 Summer Engineering Internship Program\n\nTo the Recruitment Manager,\n\nI am currently a third-year Mechanical Engineering student at State University and am writing to express my strong interest in your firm's summer internship program. Having followed your company's recent innovations in renewable energy, I am eager to potentially contribute to your research and development team.\n\nCould you please provide information on the application process and any specific prerequisites for engineering candidates? I look forward to your response.\n\nSincerely,\n\nRyan O'Malley\nEngineering Student", 
    requirements: ["Confirm that the company is currently accepting summer applications", "Request his updated resume and a copy of his most recent academic transcript"] 
  },
  { 
    id: 'p2-11', 
    type: 'personal',
    emailContext: "Subject: Coordination for our Upcoming Family Reunion Weekend\n\nHi Family,\n\nI'm so excited that we're finally getting together for our family reunion next month! I've been looking at some vacation rentals that can accommodate all fifteen of us. Most of the options are near the lake, which would be perfect for the kids.\n\nHowever, I need some help with the meal planning and deciding on the shared activities. Do we want to do a big BBQ on Saturday night, or would everyone prefer to go out to a local restaurant?\n\nCan't wait to see everyone!\n\nLove,\n\nUncle George", 
    requirements: ["Express your excitement about the reunion", "Suggest one group activity for the kids and ask about everyone's dietary preferences"] 
  },
  { 
    id: 'p2-12', 
    type: 'personal',
    emailContext: "Subject: A Small Request Regarding My Golden Retriever, Bella\n\nHi Neighbor,\n\nI hope you're having a great week. I'm writing because I have an unexpected trip coming up this weekend and I'm having some trouble finding a last-minute sitter for Bella. She's been a bit anxious lately, so I'd prefer if someone she knows could look after her.\n\nWould you be available to check in on her a few times a day on Saturday and Sunday? She mostly just needs a quick walk and her meals served at 8:00 AM and 6:00 PM.\n\nPlease let me know if this is possible!\n\nBest,\n\nSarah from Number 42", 
    requirements: ["Agree to help with Bella", "Ask for a reminder of where she keeps the spare key and the dog's favorite treats"] 
  },
  { 
    id: 'p2-13', 
    type: 'personal',
    emailContext: "Subject: Feedback Regarding Our Recent Group Dining Experience\n\nDear Management at The Silver Spoon,\n\nI am writing to share some feedback regarding the dinner my friends and I had at your restaurant last night. We were celebrating a birthday, and while the atmosphere was lovely, we encountered several issues with the service speed and the temperature of our main courses.\n\nWe've always enjoyed dining with you in the past, so we were a bit disappointed by this experience. I wanted to bring this to your attention directly so you can look into the busy Saturday night coordination.\n\nSincerely,\n\nMark Thompson", 
    requirements: ["Apologize for the poor experience (writing as the manager)", "Offer a specific discount or voucher for their next visit to make amends"] 
  },
  { 
    id: 'p2-14', 
    type: 'personal',
    emailContext: "Subject: Checking Interest for a New Local Book Club in our Neighborhood\n\nHi Everyone,\n\nI've been thinking about starting a small, informal book club for those of us living on Oak Street. I know many of us enjoy reading, and I thought it would be a wonderful way to connect and share our favorite titles over some coffee or tea once a month.\n\nI was thinking of starting with a popular historical fiction novel. Does this sound like something you'd be interested in joining? Also, what evening of the week usually works best for everyone?\n\nWarmly,\n\nLinda", 
    requirements: ["Express your strong interest in joining the book club", "Suggest a specific book title and mention your availability for weekday evenings"] 
  },
  { 
    id: 'p2-15', 
    type: 'personal',
    emailContext: "Subject: Invitation: Oak Ridge High School 10-Year Reunion Planning!\n\nHey Class of 2014!\n\nCan you believe it's been ten years since we graduated? A few of us are starting to organize a reunion for this coming September. We're looking at a few different venues, including the old school gymnasium or a private room at the downtown community center.\n\nWe really want to make sure as many people as possible can attend. Would you be interested in helping us track down some of our former classmates? Also, we're looking for suggestions for the evening's playlist!\n\nCheers,\n\nKevin (Your Former Class President)", 
    requirements: ["Confirm your attendance for the reunion", "Offer to help contact 5 of your old friends and suggest one specific song for the playlist"] 
  },
  { 
    id: 'p2-16', 
    type: 'personal',
    emailContext: "Subject: Quick Question About the Upcoming Photography Workshop\n\nHi Claire,\n\nI'm really looking forward to your 'Introduction to Nature Photography' workshop this Saturday! I've just bought a new DSLR camera, and I'm still learning how to adjust the manual settings correctly.\n\nI wanted to check if I need to bring a tripod for the outdoor session, or if we will mostly be doing handheld shots? Also, is there a specific meeting spot in the park, or should we just meet at the main entrance?\n\nThanks,\n\nDavid", 
    requirements: ["Confirm that a tripod is recommended for the session", "Provide the exact name of the pavilion in the park where the group will meet"] 
  },
  { 
    id: 'p2-17', 
    type: 'personal',
    emailContext: "Subject: Request for Advice on Local Gardening and Soil Preparation\n\nHi Mrs. Higgins,\n\nI noticed that your rose garden looks absolutely stunning this spring! I'm planning to start a small vegetable patch in my backyard, but I'm a bit concerned about the soil quality here, as it seems quite clay-heavy.\n\nSince you have such a green thumb, I was wondering if you could recommend a specific type of compost or fertilizer that works well for our local earth? Also, what are some easy vegetables for a beginner like me to start with?\n\nBest regards,\n\nEmily from across the street", 
    requirements: ["Share two specific tips for dealing with clay-heavy soil", "Suggest three easy-to-grow vegetables for a first-time gardener"] 
  },
  { 
    id: 'p2-18', 
    type: 'personal',
    emailContext: "Subject: Invitation to Ben and Chloe's Summer Wedding Celebration!\n\nHi Everyone,\n\nWe are so thrilled to finally invite you to celebrate our wedding with us on August 24th! It's going to be a casual outdoor ceremony followed by dinner and dancing under the stars. We've chosen a beautiful rustic farm as our venue.\n\nPlease let us know if you can make it by July 1st. We're also asking everyone to share a favorite memory they have of us for a special project we're putting together!\n\nWith love,\n\nBen & Chloe", 
    requirements: ["Formally accept the wedding invitation", "Briefly share a funny or touching memory you have with the couple"] 
  },
  { 
    id: 'p2-19', 
    type: 'personal',
    emailContext: "Subject: Organizing our Annual Neighborhood Block Party and Potluck\n\nHi Neighbors,\n\nIt's time for our annual block party! We're planning to close off the street on Saturday, July 20th. As usual, the neighborhood association will provide the main grills and paper supplies, but we're asking everyone to bring a dish to share for the potluck dinner.\n\nWe also need a few volunteers to help with the setup and the children's games. Does anyone have a portable speaker we could use for the music?\n\nBest regards,\n\nThe Social Committee", 
    requirements: ["Confirm what dish you will be bringing to the potluck", "Volunteer to help with the setup and mention that you have a speaker to lend"] 
  },
  { 
    id: 'p2-20', 
    type: 'personal',
    emailContext: "Subject: Planning our Long-Awaited Weekend Trip to the Mountains\n\nHey Friends,\n\nI've finally found a weekend where we're all (mostly) free! I've been looking at a cozy cabin in the Blue Ridge Mountains for the second weekend of October. It has a great fire pit and is close to several hiking trails.\n\nBefore I book it, I wanted to double-check if everyone is okay with sharing rooms, or if we should look for a larger place? Also, who is willing to be the primary driver for our group?\n\nBest,\n\nJason", 
    requirements: ["Confirm that you are happy with the room-sharing arrangement", "Volunteer to be the driver and ask about the total cost per person"] 
  }
];

export const PART3_QUESTIONS: Part3Question[] = [
  { id: 'p3-1', topic: "Some people prefer to work for a large company, while others prefer to work for a small company. Which do you prefer? Use specific reasons and examples to support your opinion." },
  { id: 'p3-2', topic: "Do you agree or disagree with the following statement? Modern technology has made our lives more complicated rather than simpler. Support your answer with reasons and examples." },
  { id: 'p3-3', topic: "Some people like to work in teams, while others prefer to work alone. Which do you think is more effective for completing a task? Explain your choice." },
  { id: 'p3-4', topic: "Is it better for a company to hire employees for their entire career or for a shorter period? Discuss the advantages and disadvantages of each approach." },
  { id: 'p3-5', topic: "Some people believe that school students should focus only on academic subjects. Others believe that sports and music are also important. What is your opinion?" },
  { id: 'p3-6', topic: "Do you think it is more important for a person to have a high salary or job satisfaction? Use specific reasons to support your position." },
  { id: 'p3-7', topic: "Some people prefer to live in a big city, while others prefer a small town. Which environment do you think is better for raising a family?" },
  { id: 'p3-8', topic: "Is it more effective to reward employees with money or with extra vacation time? Support your argument with examples." },
  { id: 'p3-9', topic: "Some people argue that advertisements have a negative influence on society. Do you agree or disagree? Why?" },
  { id: 'p3-10', topic: "Do you think working from home is more productive than working in a traditional office? Explain your reasoning." },
  { id: 'p3-11', topic: "Is it better to travel with a tour guide or to travel independently? Discuss both options and give your preference." },
  { id: 'p3-12', topic: "Some people believe that the government should spend more money on public transportation. Others think more should be spent on highways. What is your view?" },
  { id: 'p3-13', topic: "Should companies require their employees to wear uniforms? Why or why not?" },
  { id: 'p3-14', topic: "Do you think online education is as effective as traditional classroom learning? Support your opinion with examples." },
  { id: 'p3-15', topic: "Is it more important to preserve old buildings or to replace them with modern ones? Explain your choice." },
  { id: 'p3-16', topic: "Some people think that children should start learning a foreign language at an early age. Others disagree. What is your opinion?" },
  { id: 'p3-17', topic: "Should high school students be required to perform community service? Discuss the pros and cons." },
  { id: 'p3-18', topic: "Does competition among students in school have a positive or negative effect? Explain your view." },
  { id: 'p3-19', topic: "Is it better to choose a career that you love or one that is in high demand? Support your position." },
  { id: 'p3-20', topic: "Some people believe that the media has too much influence on our lives. Do you agree or disagree? Why?" }
];

export const REAL_TEST_PART1: Part1Question[] = [
  { id: 'rt-p1-1', imageUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800', keywords: ['team', 'technology'] },
  { id: 'rt-p1-2', imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=800', keywords: ['presentation', 'audience'] },
  { id: 'rt-p1-3', imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&q=80&w=800', keywords: ['collaboration', 'whiteboard'] },
  { id: 'rt-p1-4', imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800', keywords: ['research', 'laptop'] },
  { id: 'rt-p1-5', imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800', keywords: ['strategy', 'brainstorm'] },
  { id: 'rt-p1-6', imageUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&q=80&w=800', keywords: ['client', 'contract'] },
  { id: 'rt-p1-7', imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800', keywords: ['workshop', 'tools'] },
  { id: 'rt-p1-8', imageUrl: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800', keywords: ['office', 'layout'] },
  { id: 'rt-p1-9', imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=800', keywords: ['marketing', 'display'] },
  { id: 'rt-p1-10', imageUrl: 'https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&q=80&w=800', keywords: ['engineering', 'blueprint'] },
  { id: 'rt-p1-11', imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800', keywords: ['interview', 'candidate'] },
  { id: 'rt-p1-12', imageUrl: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800', keywords: ['staff', 'reception'] },
  { id: 'rt-p1-13', imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800', keywords: ['lunch', 'break'] },
  { id: 'rt-p1-14', imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=800', keywords: ['analysis', 'graph'] },
  { id: 'rt-p1-15', imageUrl: 'https://images.unsplash.com/photo-1542744095-2ad4870f443e?auto=format&fit=crop&q=80&w=800', keywords: ['accounting', 'files'] },
  { id: 'rt-p1-16', imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=800', keywords: ['coding', 'developer'] },
  { id: 'rt-p1-17', imageUrl: 'https://images.unsplash.com/photo-1556761175-5b413da4baf72?auto=format&fit=crop&q=80&w=800', keywords: ['negotiation', 'agreement'] },
  { id: 'rt-p1-18', imageUrl: 'https://images.unsplash.com/photo-1531973576160-7125cd663d86?auto=format&fit=crop&q=80&w=800', keywords: ['logistics', 'delivery'] },
  { id: 'rt-p1-19', imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb28f74b671?auto=format&fit=crop&q=80&w=800', keywords: ['lecture', 'seminar'] },
  { id: 'rt-p1-20', imageUrl: 'https://images.unsplash.com/photo-1454165833767-1296728c89c1?auto=format&fit=crop&q=80&w=800', keywords: ['training', 'materials'] }
];

export const REAL_TEST_PART2: Part2Question[] = [
  { 
    id: 'rt-p2-1', 
    type: 'business',
    emailContext: "Subject: Persistent Issues with Company Laptop Software Installation\n\nDear IT Support Desk,\n\nI am writing to report a recurring technical issue I've encountered while trying to install the new company-wide project management tool on my laptop. Every time I initiate the setup, the process halts with a 'Compatibility Error 404' notification.\n\nI have attempted to restart the machine and clear temporary files, but the problem persists. Could you please provide guidance or schedule a remote support session to resolve this?\n\nSincerely,\n\nDavid Brown\nSenior Analyst", 
    requirements: ["Propose a specific 30-minute window for a remote support call", "Ask him to email a high-resolution screenshot of the error message"] 
  },
  { 
    id: 'rt-p2-2', 
    type: 'business',
    emailContext: "Subject: Request for Peer Review and Feedback on the Q3 Quarterly Performance Report\n\nHi Everyone,\n\nI have just completed the initial draft of our Q3 Quarterly Performance Report and have uploaded the document to our team's shared drive. I would appreciate it if you could review the data and provide your critical feedback by the end of business this Friday.\n\nYour insights are vital to ensuring the accuracy of this report before it is submitted to the executive team. Thank you for your time.\n\nBest regards,\n\nJennifer Lawson\nOperations Director", 
    requirements: ["Confirm that you have successfully accessed the draft report", "Mention that you will specifically focus your review on the 'Market Trends' section"] 
  },
  { 
    id: 'rt-p2-3', 
    type: 'business',
    emailContext: "Subject: Inquiry Regarding Procedures for Adjusting Monthly Retirement Plan Contributions\n\nHello Human Resources,\n\nI am interested in increasing my monthly contributions to my company-sponsored retirement plan starting in the next fiscal quarter. After reviewing my recent statements, I believe I can afford a higher deduction to better prepare for the future.\n\nCould you please direct me to the appropriate forms or online portal where I can make these adjustments? Thank you for your assistance.\n\nRegards,\n\nSteven Mitchell\nLead Engineer", 
    requirements: ["Provide the specific URL for the employee benefits dashboard", "State the final deadline for changes to take effect in the upcoming quarter"] 
  },
  { 
    id: 'rt-p2-4', 
    type: 'business',
    emailContext: "Subject: Formal Invitation to Deliver the Keynote Address at the Charity Foundation Annual Gala\n\nDear CEO,\n\nOn behalf of the Bright Tomorrow Foundation, I am writing to formally invite you to serve as our keynote speaker for our upcoming Annual Fundraising Gala in October. Your leadership in corporate social responsibility has inspired our community, and we believe our donors would greatly appreciate your perspective.\n\nWe would be honored to host you for this prestigious evening. Please let us know if you would be open to this opportunity.\n\nWarmly,\n\nThe Charity Foundation Executive Board", 
    requirements: ["Accept the invitation tentatively pending schedule confirmation", "Request a list of suggested themes or topics that would resonate with the donors"] 
  },
  { 
    id: 'rt-p2-5', 
    type: 'business',
    emailContext: "Subject: Seeking Professional Mentorship Within the Marketing Department\n\nHello,\n\nI recently joined the firm as a Sales Associate and am very eager to learn more about the strategic marketing initiatives that drive our sales leads. I was wondering if there is a formal mentorship program or if there are any senior marketing professionals who might be open to a brief introductory meeting for career guidance.\n\nI am particularly interested in digital brand management. Thank you for your help.\n\nBest regards,\n\nPeter Gallagher\nSales Associate", 
    requirements: ["Suggest he reach out to the Director of Digital Marketing", "Mention the departmental 'Lunch and Learn' session happening next Tuesday"] 
  },
  { 
    id: 'rt-p2-6', 
    type: 'business',
    emailContext: "Subject: Discrepancy Identified in the Most Recent Consultancy Services Invoice\n\nHi Accounts Payable,\n\nI am writing to bring your attention to a potential discrepancy I've noticed in invoice #8841 for the consultancy services provided in May. The total amount billed appears to exceed the hourly rate we formally agreed upon in our initial contract.\n\nCould you please review these charges against our service agreement and provide a clarification? Thank you for your prompt attention to this matter.\n\nRegards,\n\nSarah Jenkins\nPrimary Client Contact", 
    requirements: ["Apologize for the oversight in the billing calculation", "Confirm that a revised and accurate invoice will be issued within 24 hours"] 
  },
  { 
    id: 'rt-p2-7', 
    type: 'business',
    emailContext: "Subject: Urgent Request for Additional Workspace Furniture in the North Wing Expansion\n\nHello Office Operations,\n\nAs our department continues to expand, we have officially run out of available workstations in the North Wing. With three new hires joining our team next month, it is imperative that we secure additional desks and ergonomic chairs as soon as possible.\n\nCould you please provide an update on the procurement timeline for new office furniture? Thank you for your support.\n\nBest regards,\n\nJulian Vane\nEngineering Team Lead", 
    requirements: ["Provide a specific date for the scheduled delivery of the new workstations", "Ask him to submit a proposed seating chart for the new layout"] 
  },
  { 
    id: 'rt-p2-8', 
    type: 'business',
    emailContext: "Subject: Inquiry Regarding the Corporate Commuter and Carpool Incentive Program\n\nHi Sustainability Team,\n\nI am looking into ways to reduce my daily commute costs and am interested in learning more about the company's carpooling initiatives. I heard that there may be financial incentives or specific benefits for employees who share their commute.\n\nCould you please provide a summary of the current program and how I can sign up? Thank you for your help.\n\nBest,\n\nGregory Hall\nSustainability Advocate", 
    requirements: ["Mention the monthly mileage stipend provided to carpool participants", "Note the availability of reserved priority parking spaces for carpool vehicles"] 
  },
  { 
    id: 'rt-p2-9', 
    type: 'business',
    emailContext: "Subject: Strategic Proposal for an Integrated Workplace Wellness and Yoga Program\n\nDear Human Resources,\n\nI am writing to propose the implementation of a weekly workplace wellness program, featuring professional-led yoga and mindfulness sessions. I believe such an initiative would greatly enhance employee morale and reduce workplace stress, ultimately leading to higher productivity levels.\n\nIs this a program the company would be willing to sponsor? I would be happy to put together a more detailed proposal if needed.\n\nThank you,\n\nElena Rossi\nWellness Committee Member", 
    requirements: ["Express positive interest in the proposal for the upcoming budget year", "Request a detailed cost estimate from at least two local wellness vendors"] 
  },
  { 
    id: 'rt-p2-10', 
    type: 'business',
    emailContext: "Subject: Technical Issues Reported During the Quarterly Client Webinar Session\n\nHi Technical Support Team,\n\nWe have received several complaints from clients regarding the audio quality during today's live marketing webinar. Many reported inconsistent sound levels and background noise. Could you please verify the quality of the local recording we made?\n\nIf the recording is clear, we would like to distribute it to all attendees as soon as possible. Thank you for your help.\n\nBest,\n\nThe Marketing Team", 
    requirements: ["Confirm that the master audio recording in the cloud is high-quality", "Offer to handle the uploading process to the client portal this afternoon"] 
  },
  { 
    id: 'rt-p2-11', 
    type: 'personal',
    emailContext: "Subject: Urgent: Neighborly Help Needed for Pet-Sitting This Weekend\n\nHi Neighbor,\n\nI hope you're doing well. I'm reaching out because I have to head out of town unexpectedly this weekend to visit my sister, and my usual dog sitter is unavailable. I was wondering if you might be around to help me out with Max?\n\nHe mostly needs someone to let him out into the backyard a few times and make sure his water bowl is full. He's very friendly and shouldn't be much trouble at all. Please let me know if you could spare some time!\n\nBest regards,\n\nDavid from house #15", 
    requirements: ["Happily agree to look after Max for the weekend", "Ask for a quick reminder of his feeding schedule and where his leash is kept"] 
  },
  { 
    id: 'rt-p2-12', 
    type: 'personal',
    emailContext: "Subject: Planning the Menu and Decor For Our Upcoming Summer Garden Party\n\nHi Sarah!\n\nI'm so excited about the garden party we're hosting next Saturday! I've been looking at some ideas for a Mediterranean-themed menu, including a big Greek salad and some grilled skewers. I think it will be perfect for the warm weather we're expecting.\n\nI wanted to ask if you could help with the decorations? Maybe some string lights and some colorful outdoor cushions? Let me know what you think of the plan!\n\nWarmly,\n\nChloe", 
    requirements: ["Express your enthusiasm for the party theme", "Confirm that you can bring the lights and cushions, and suggest adding a pitcher of iced tea to the menu"] 
  },
  { 
    id: 'rt-p2-13', 
    type: 'personal',
    emailContext: "Subject: Inquiry: Registration Details for the Local 'Pottery for Beginners' Class\n\nHello Community Center Team,\n\nI am very interested in enrolling in the 'Pottery for Beginners' class that I saw advertised on your community board. I've always wanted to learn how to use a potter's wheel and think this would be a great creative outlet for me.\n\nCould you please let me know if there are still spots available for the session starting next Tuesday? Also, are all the materials included in the registration fee, or should I purchase my own clay and tools beforehand?\n\nBest regards,\n\nMark Henderson", 
    requirements: ["Confirm that there are two spots remaining in the class", "Explain that all basic materials are included but suggest bringing an old apron"] 
  },
  { 
    id: 'rt-p2-14', 
    type: 'personal',
    emailContext: "Subject: Invitation to the Monthly Neighborhood 'Greener Streets' Meeting\n\nHi Everyone,\n\nWe are holding our monthly meeting for the 'Greener Streets' initiative this Wednesday at 7:00 PM in the community library. This month, we'll be discussing our plans for the new community garden and the upcoming tree-planting day in the park.\n\nWe really value everyone's input on which types of trees we should prioritize. We hope to see a good turnout! Please let us know if you can attend.\n\nBest,\n\nThe Greener Streets Committee", 
    requirements: ["Confirm your attendance for the meeting", "Suggest planting cherry blossom trees and volunteer to bring some snacks for the group"] 
  },
  { 
    id: 'rt-p2-15', 
    type: 'personal',
    emailContext: "Subject: Reconnecting and Planning a Catch-Up Coffee Next Week\n\nHi Michael,\n\nIt feels like it's been ages since we last caught up! I was just thinking about that hiking trip we took last summer and realized we haven't seen each other in months. I'd love to hear how your new job is going and catch up on everything else.\n\nAre you free for a coffee sometime next week? I'm mostly available on Tuesday or Thursday afternoons. Let me know if that works for you!\n\nCheers,\n\nSimon", 
    requirements: ["Express your mutual desire to catch up soon", "Confirm your availability for Thursday afternoon and suggest meeting at 'The Coffee Bean' downtown"] 
  },
  { 
    id: 'rt-p2-16', 
    type: 'personal',
    emailContext: "Subject: Seeking Your Expert Advice on Choosing a New Road Bike\n\nHi Alex,\n\nI'm finally looking to upgrade my old mountain bike to a proper road bike for my daily commute. I know you've been into cycling for years, so I was wondering if you could give me some recommendations for a reliable entry-level model?\n\nI'm mostly looking for something lightweight but durable enough for city streets. My budget is around $800. Any brands or specific models I should look out for?\n\nThanks in advance!\n\nBest,\n\nRyan", 
    requirements: ["Suggest two specific road bike brands known for quality", "Mention the importance of getting a proper professional fitting at a local bike shop"] 
  },
  { 
    id: 'rt-p2-17', 
    type: 'personal',
    emailContext: "Subject: RSVP: Invitation to Lily's 5th Birthday Tea Party Adventure!\n\nHi Friends and Family,\n\nOur little Lily is turning five! We're celebrating with a magical 'Tea Party Adventure' in our backyard on Sunday, June 12th at 2:00 PM. Expect plenty of tea (and juice!), finger sandwiches, and maybe even a visit from a fairy!\n\nPlease let us know if your little ones can join us by next Friday. We're so excited to celebrate this milestone with you all.\n\nWith love,\n\nThe Thompson Family", 
    requirements: ["Enthusiastically accept the invitation for yourself and your daughter", "Inquire if there is a specific theme for gifts or if Lily has any current favorite characters"] 
  },
  { 
    id: 'rt-p2-18', 
    type: 'personal',
    emailContext: "Subject: Inquiry Regarding Local Tennis Club Membership and Court Availability\n\nHello Membership Secretary,\n\nI've recently moved to the area and am interested in joining the local tennis club. I've been playing for about three years and am looking for a club that offers both casual social play and more competitive ladder matches.\n\nCould you please provide information on the various membership tiers and the annual fees? Also, what is the process for booking a court on weekday evenings?\n\nKind regards,\n\nVictoria Lane", 
    requirements: ["Explain the 'Full' and 'Social' membership options and their respective costs", "Detail the online court booking system and mention the weekly social mix-in sessions"] 
  },
  { 
    id: 'rt-p2-19', 
    type: 'personal',
    emailContext: "Subject: Discussion Regarding the Shared Boundary Fence Repair Project\n\nHi Neighbor,\n\nI hope you're having a good week. I wanted to touch base about the section of our shared boundary fence that was damaged in the recent storm. It's leaning quite heavily now, and I'm worried it might collapse if we have another windy day.\n\nI've already received a quote from a local fencing contractor for the repairs. Would you be open to discussing how we can split the costs? Happy to walk through the details of the quote with you whenever you're free.\n\nBest,\n\nMarcus from house #28", 
    requirements: ["Acknowledge the damage to the fence and the need for repair", "Agree to meet this weekend to review the contractor's quote together"] 
  },
  { 
    id: 'rt-p2-20', 
    type: 'personal',
    emailContext: "Subject: Confirming Details for our Weekend Photography Trip to the Coast\n\nHi Everyone,\n\nI'm so looking forward to our photography trip to the coast next weekend! I've been checking the weather forecast, and it looks like we'll have some beautiful clear skies for the sunset shots on Friday evening.\n\nI wanted to confirm the carpooling arrangements. Who is planning to drive, and what time should we all meet at the main transit center to head out? Also, has everyone finalized their hotel bookings?\n\nCan't wait!\n\nBest,\n\nJessica", 
    requirements: ["Confirm that you have booked your hotel and are ready to go", "Volunteer to drive your SUV and suggest meeting at the transit center at 2:00 PM"] 
  }
];

export const REAL_TEST_PART3: Part3Question[] = [
  { id: 'rt-p3-1', topic: "Some people believe that technology has made our lives simpler, while others argue that it has made our lives more complicated. What is your opinion? Support your view with specific reasons and examples." },
  { id: 'rt-p3-2', topic: "Is it better to have a wide variety of friends or a few close friends? Support your opinion with reasons and examples." },
  { id: 'rt-p3-3', topic: "Some people think that the government should focus on space exploration. Others believe that money should be spent on solving problems on Earth. What is your view?" },
  { id: 'rt-p3-4', topic: "Do you agree or disagree with the following statement? A person should never make an important decision alone. Support your position." },
  { id: 'rt-p3-5', topic: "Some people prefer to live in places where the climate remains the same all year round. Others like to live in areas where the seasons change. Which do you prefer?" },
  { id: 'rt-p3-6', topic: "Is it better to attend a large university or a small college? Explain the advantages of your choice." },
  { id: 'rt-p3-7', topic: "Do you think that being famous has more advantages than disadvantages? Support your answer with examples." },
  { id: 'rt-p3-8', topic: "Should businesses focus only on making a profit, or should they also have social responsibilities? Explain your view." },
  { id: 'rt-p3-9', topic: "Some people believe that hard work is the key to success. Others think that luck plays a bigger role. What is your opinion?" },
  { id: 'rt-p3-10', topic: "Is it more important to learn about the history of your own country or the history of the world? Explain your reasoning." },
  { id: 'rt-p3-11', topic: "Do you think that children should be required to learn how to play a musical instrument? Support your position." },
  { id: 'rt-p3-12', topic: "Is it better to spend money on experiences, such as travel, or on material possessions? Explain your choice." },
  { id: 'rt-p3-13', topic: "Some people think that competitive sports do more harm than good to children. Do you agree or disagree? Why?" },
  { id: 'rt-p3-14', topic: "Should the legal voting age be lowered to 16? Discuss the arguments for and against." },
  { id: 'rt-p3-15', topic: "Is it more important for a city to have many parks or many shopping centers? Support your opinion." },
  { id: 'rt-p3-16', topic: "Some people believe that parents are the best teachers. Others believe that professional teachers are more effective. What is your view?" },
  { id: 'rt-p3-17', topic: "Should all students be required to learn a second language? Explain your reasoning." },
  { id: 'rt-p3-18', topic: "Do you think that technology has improved the way we communicate? Support your answer with examples." },
  { id: 'rt-p3-19', topic: "Is it better to work for oneself or to work for an employer? Discuss the pros and cons of each." },
  { id: 'rt-p3-20', topic: "Some people believe that high school students should have a part-time job. Others think it interferes with their studies. What is your opinion?" }
];
