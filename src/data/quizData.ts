export interface QuizQuestion {
  id: string;
  type: "multiple-choice" | "comprehension" | "vocabulary";
  question: string;
  questionHi: string;
  options: {
    text: string;
    textHi: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  explanationHi: string;
}

export interface StoryQuiz {
  storyId: number;
  titleKey: string;
  questions: QuizQuestion[];
}

export const storyQuizzes: StoryQuiz[] = [
  {
    storyId: 1,
    titleKey: "stories.braveFarmer",
    questions: [
      {
        id: "bf-mc-1",
        type: "multiple-choice",
        question: "What was the main character's occupation?",
        questionHi: "मुख्य पात्र का व्यवसाय क्या था?",
        options: [
          { text: "Teacher", textHi: "शिक्षक", isCorrect: false },
          { text: "Farmer", textHi: "किसान", isCorrect: true },
          { text: "Merchant", textHi: "व्यापारी", isCorrect: false },
          { text: "Soldier", textHi: "सैनिक", isCorrect: false },
        ],
        explanation: "The story is about a brave farmer who protects the village.",
        explanationHi: "कहानी एक बहादुर किसान के बारे में है जो गाँव की रक्षा करता है।",
      },
      {
        id: "bf-comp-1",
        type: "comprehension",
        question: "Why did the farmer decide to protect the village?",
        questionHi: "किसान ने गाँव की रक्षा करने का फैसला क्यों किया?",
        options: [
          { text: "For money", textHi: "पैसों के लिए", isCorrect: false },
          { text: "Because of his love for the community", textHi: "समुदाय के प्रति प्यार के कारण", isCorrect: true },
          { text: "The king ordered him", textHi: "राजा ने आदेश दिया", isCorrect: false },
          { text: "He was forced to", textHi: "उसे मजबूर किया गया", isCorrect: false },
        ],
        explanation: "The farmer's bravery came from his deep love for his community and neighbors.",
        explanationHi: "किसान की बहादुरी उसके समुदाय और पड़ोसियों के प्रति गहरे प्यार से आई।",
      },
      {
        id: "bf-vocab-1",
        type: "vocabulary",
        question: "What does 'brave' mean in this story?",
        questionHi: "'बहादुर' का इस कहानी में क्या मतलब है?",
        options: [
          { text: "Scared", textHi: "डरा हुआ", isCorrect: false },
          { text: "Courageous and fearless", textHi: "साहसी और निडर", isCorrect: true },
          { text: "Weak", textHi: "कमजोर", isCorrect: false },
          { text: "Lazy", textHi: "आलसी", isCorrect: false },
        ],
        explanation: "'Brave' means showing courage in the face of danger or difficulty.",
        explanationHi: "'बहादुर' का मतलब है खतरे या कठिनाई का सामना करते समय साहस दिखाना।",
      },
    ],
  },
  {
    storyId: 2,
    titleKey: "stories.talkingTree",
    questions: [
      {
        id: "tt-mc-1",
        type: "multiple-choice",
        question: "What made the tree special?",
        questionHi: "पेड़ को विशेष क्या बनाता था?",
        options: [
          { text: "It could fly", textHi: "वह उड़ सकता था", isCorrect: false },
          { text: "It could talk", textHi: "वह बात कर सकता था", isCorrect: true },
          { text: "It was invisible", textHi: "वह अदृश्य था", isCorrect: false },
          { text: "It was made of gold", textHi: "वह सोने का था", isCorrect: false },
        ],
        explanation: "The tree had the magical ability to speak and share wisdom.",
        explanationHi: "पेड़ में बात करने और ज्ञान साझा करने की जादुई क्षमता थी।",
      },
      {
        id: "tt-comp-1",
        type: "comprehension",
        question: "What lesson did the tree teach?",
        questionHi: "पेड़ ने क्या सबक सिखाया?",
        options: [
          { text: "How to climb trees", textHi: "पेड़ पर कैसे चढ़ें", isCorrect: false },
          { text: "The importance of nature and wisdom", textHi: "प्रकृति और ज्ञान का महत्व", isCorrect: true },
          { text: "How to cook food", textHi: "खाना कैसे पकाएं", isCorrect: false },
          { text: "How to build houses", textHi: "घर कैसे बनाएं", isCorrect: false },
        ],
        explanation: "The talking tree shared wisdom about respecting and caring for nature.",
        explanationHi: "बात करने वाले पेड़ ने प्रकृति का सम्मान और देखभाल करने के बारे में ज्ञान साझा किया।",
      },
      {
        id: "tt-vocab-1",
        type: "vocabulary",
        question: "What does 'wisdom' mean?",
        questionHi: "'ज्ञान' का क्या मतलब है?",
        options: [
          { text: "Being silly", textHi: "मूर्ख होना", isCorrect: false },
          { text: "Knowledge and good judgment", textHi: "ज्ञान और अच्छा निर्णय", isCorrect: true },
          { text: "Running fast", textHi: "तेज दौड़ना", isCorrect: false },
          { text: "Being loud", textHi: "जोर से बोलना", isCorrect: false },
        ],
        explanation: "'Wisdom' means having experience, knowledge, and good judgment.",
        explanationHi: "'ज्ञान' का मतलब है अनुभव, ज्ञान और अच्छा निर्णय होना।",
      },
    ],
  },
  {
    storyId: 3,
    titleKey: "stories.lostPlanet",
    questions: [
      {
        id: "lp-mc-1",
        type: "multiple-choice",
        question: "Where did the story take place?",
        questionHi: "कहानी कहाँ हुई?",
        options: [
          { text: "In the ocean", textHi: "समुद्र में", isCorrect: false },
          { text: "In outer space", textHi: "अंतरिक्ष में", isCorrect: true },
          { text: "In a forest", textHi: "जंगल में", isCorrect: false },
          { text: "In a city", textHi: "शहर में", isCorrect: false },
        ],
        explanation: "The story is set in outer space, exploring a lost planet.",
        explanationHi: "कहानी अंतरिक्ष में है, एक खोए हुए ग्रह की खोज।",
      },
      {
        id: "lp-comp-1",
        type: "comprehension",
        question: "What was the main theme of the story?",
        questionHi: "कहानी का मुख्य विषय क्या था?",
        options: [
          { text: "Cooking recipes", textHi: "खाना पकाने की विधि", isCorrect: false },
          { text: "Exploration and discovery", textHi: "अन्वेषण और खोज", isCorrect: true },
          { text: "Building houses", textHi: "घर बनाना", isCorrect: false },
          { text: "Sports competition", textHi: "खेल प्रतियोगिता", isCorrect: false },
        ],
        explanation: "The story focuses on the adventure of exploring and discovering new worlds.",
        explanationHi: "कहानी नई दुनिया की खोज और अन्वेषण के साहसिक कार्य पर केंद्रित है।",
      },
      {
        id: "lp-vocab-1",
        type: "vocabulary",
        question: "What does 'lost' mean in 'The Lost Planet'?",
        questionHi: "'खोया हुआ ग्रह' में 'खोया' का क्या मतलब है?",
        options: [
          { text: "Defeated in a game", textHi: "खेल में हारा", isCorrect: false },
          { text: "Forgotten or undiscovered", textHi: "भूला हुआ या अनदेखा", isCorrect: true },
          { text: "Very small", textHi: "बहुत छोटा", isCorrect: false },
          { text: "Very bright", textHi: "बहुत चमकीला", isCorrect: false },
        ],
        explanation: "'Lost' here means something that was forgotten or waiting to be discovered.",
        explanationHi: "'खोया' यहाँ का मतलब है कुछ जो भूला गया था या खोजे जाने की प्रतीक्षा में था।",
      },
    ],
  },
  {
    storyId: 4,
    titleKey: "stories.lionAndMouse",
    questions: [
      {
        id: "lm-mc-1",
        type: "multiple-choice",
        question: "Who were the main characters in this story?",
        questionHi: "इस कहानी में मुख्य पात्र कौन थे?",
        options: [
          { text: "A lion and a mouse", textHi: "एक शेर और एक चूहा", isCorrect: true },
          { text: "A fox and a crow", textHi: "एक लोमड़ी और एक कौआ", isCorrect: false },
          { text: "A rabbit and a turtle", textHi: "एक खरगोश और एक कछुआ", isCorrect: false },
          { text: "A dog and a cat", textHi: "एक कुत्ता और एक बिल्ली", isCorrect: false },
        ],
        explanation: "The classic fable features a mighty lion and a tiny mouse.",
        explanationHi: "यह प्रसिद्ध कहानी एक शक्तिशाली शेर और एक छोटे चूहे की है।",
      },
      {
        id: "lm-comp-1",
        type: "comprehension",
        question: "What is the moral of this story?",
        questionHi: "इस कहानी की शिक्षा क्या है?",
        options: [
          { text: "Big is always better", textHi: "बड़ा हमेशा बेहतर होता है", isCorrect: false },
          { text: "Even the small can help the great", textHi: "छोटे भी बड़ों की मदद कर सकते हैं", isCorrect: true },
          { text: "Never trust anyone", textHi: "कभी किसी पर भरोसा न करें", isCorrect: false },
          { text: "Always run away from danger", textHi: "हमेशा खतरे से भागो", isCorrect: false },
        ],
        explanation: "The story teaches that even the smallest creatures can help in big ways.",
        explanationHi: "कहानी सिखाती है कि सबसे छोटे प्राणी भी बड़े तरीकों से मदद कर सकते हैं।",
      },
      {
        id: "lm-vocab-1",
        type: "vocabulary",
        question: "What does 'mighty' mean when describing the lion?",
        questionHi: "शेर का वर्णन करते समय 'शक्तिशाली' का क्या मतलब है?",
        options: [
          { text: "Very weak", textHi: "बहुत कमजोर", isCorrect: false },
          { text: "Very small", textHi: "बहुत छोटा", isCorrect: false },
          { text: "Very powerful and strong", textHi: "बहुत शक्तिशाली और मजबूत", isCorrect: true },
          { text: "Very quiet", textHi: "बहुत शांत", isCorrect: false },
        ],
        explanation: "'Mighty' means having great power, strength, or size.",
        explanationHi: "'शक्तिशाली' का मतलब है बड़ी शक्ति, ताकत या आकार होना।",
      },
    ],
  },
];

export const getQuizByStoryId = (storyId: number): StoryQuiz | undefined => {
  return storyQuizzes.find((quiz) => quiz.storyId === storyId);
};

export const getQuizByVideoUrl = (videoUrl: string): StoryQuiz | undefined => {
  // Map video URLs to story IDs
  if (videoUrl.includes("lion-and-mouse")) {
    return getQuizByStoryId(4);
  }
  // Default to first story if no match
  return getQuizByStoryId(1);
};
