import { Article } from '../types/reading'

export const sampleArticles: Article[] = [
  {
    id: 'toeic-1',
    title: 'Workplace Communication in the Digital Age',
    content: `In today's fast-paced business environment, effective communication is more important than ever. The rise of digital technology has transformed how we interact in the workplace. Email, instant messaging, and video conferencing have become standard tools for daily communication.

While these digital tools offer convenience and speed, they also present new challenges. Employees must learn to convey their messages clearly and professionally across various platforms. Understanding when to use each communication channel is crucial for workplace success.

For example, complex discussions often benefit from face-to-face meetings or video calls, where participants can read non-verbal cues. Quick updates or simple questions, however, might be better suited for instant messaging or email.

Organizations are also adopting new collaboration platforms that combine multiple communication features. These tools aim to streamline workflow and improve team coordination. However, employees need proper training to use these tools effectively and maintain productivity.`,
    level: 'TOEIC',
    category: 'Business',
    estimatedTime: 5,
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        text: 'What is the main challenge of digital communication mentioned in the passage?',
        options: [
          'The cost of digital tools',
          'Learning to use each platform appropriately',
          'Internet connection issues',
          'Time zone differences'
        ],
        correctAnswer: 'Learning to use each platform appropriately',
        explanation: 'The passage emphasizes the importance of understanding when and how to use different communication channels effectively.'
      },
      {
        id: 'q2',
        type: 'TrueFalse',
        text: 'According to the passage, video calls are better than emails for complex discussions.',
        correctAnswer: 'true',
        explanation: 'The passage states that complex discussions benefit from face-to-face meetings or video calls due to the ability to read non-verbal cues.'
      }
    ],
    vocabulary: [
      {
        word: 'crucial',
        meaning: '중요한, 결정적인',
        pronunciation: 'ˈkruːʃəl',
        partOfSpeech: 'adjective',
        example: 'Timing is crucial for the success of this project.',
        synonyms: ['essential', 'critical', 'vital']
      },
      {
        word: 'streamline',
        meaning: '효율화하다, 간소화하다',
        pronunciation: 'ˈstriːmlaɪn',
        partOfSpeech: 'verb',
        example: 'We need to streamline our production process.',
        synonyms: ['optimize', 'simplify', 'rationalize']
      }
    ]
  },
  {
    id: 'toefl-1',
    title: 'The Impact of Artificial Intelligence on Modern Healthcare',
    content: `Artificial Intelligence (AI) is revolutionizing healthcare in unprecedented ways. From diagnostic assistance to personalized treatment plans, AI technologies are enhancing medical professionals' capabilities and improving patient care outcomes.

One significant application is in medical imaging analysis. AI algorithms can process X-rays, MRIs, and CT scans with remarkable accuracy, often detecting subtle abnormalities that human eyes might miss. This technology serves as a valuable second opinion for radiologists and helps prioritize urgent cases.

Additionally, AI-powered predictive analytics help healthcare providers anticipate patient needs and potential health risks. By analyzing vast amounts of medical data, these systems can identify patterns and trends that suggest the likelihood of specific conditions developing.

However, the integration of AI in healthcare also raises important ethical considerations. Questions about data privacy, algorithm bias, and the balance between human judgment and machine learning continue to be debated in the medical community.`,
    level: 'TOEFL',
    category: 'Science',
    estimatedTime: 7,
    questions: [
      {
        id: 'q1',
        type: 'MCQ',
        text: 'What is one major advantage of AI in medical imaging according to the passage?',
        options: [
          'It replaces radiologists completely',
          'It can detect subtle abnormalities more easily',
          'It makes the imaging process faster',
          'It reduces the cost of medical imaging'
        ],
        correctAnswer: 'It can detect subtle abnormalities more easily',
        explanation: 'The passage mentions that AI can detect subtle abnormalities that human eyes might miss in medical imaging.'
      },
      {
        id: 'q2',
        type: 'ShortAnswer',
        text: 'Name two ethical concerns mentioned regarding AI in healthcare.',
        correctAnswer: 'data privacy and algorithm bias',
        explanation: 'The passage mentions data privacy and algorithm bias as ethical considerations in AI healthcare integration.'
      }
    ],
    vocabulary: [
      {
        word: 'unprecedented',
        meaning: '전례 없는',
        pronunciation: 'ʌnˈpresɪdentɪd',
        partOfSpeech: 'adjective',
        example: 'The speed of technological change is unprecedented.',
        synonyms: ['unparalleled', 'unique', 'extraordinary']
      },
      {
        word: 'integration',
        meaning: '통합, 결합',
        pronunciation: 'ˌɪntɪˈɡreɪʃn',
        partOfSpeech: 'noun',
        example: 'The integration of new systems will take time.',
        synonyms: ['incorporation', 'combination', 'unification']
      }
    ]
  }
]