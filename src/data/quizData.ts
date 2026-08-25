export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Qual elemento possui número atômico 8?",
    options: ["Carbono", "Oxigênio", "Nitrogênio", "Flúor"],
    correctIndex: 1,
    explanation: "O Oxigênio (O) tem número atômico 8, com configuração eletrônica 1s² 2s² 2p⁴. É o terceiro elemento mais abundante do universo.",
    difficulty: "easy",
    topic: "Tabela Periódica",
  },
  {
    id: 2,
    question: "Qual é o elemento mais abundante na crosta terrestre?",
    options: ["Ferro", "Silício", "Oxigênio", "Alumínio"],
    correctIndex: 2,
    explanation: "O Oxigênio representa cerca de 46% da massa da crosta terrestre, sendo o elemento mais abundante.",
    difficulty: "easy",
    topic: "Propriedades dos Elementos",
  },
  {
    id: 3,
    question: "Qual partícula subatômica determina o número atômico de um elemento?",
    options: ["Nêutrons", "Elétrons", "Prótons", "Quarks"],
    correctIndex: 2,
    explanation: "O número atômico (Z) é igual ao número de prótons no núcleo. É esse número que define a identidade química de um elemento.",
    difficulty: "easy",
    topic: "Estrutura Atômica",
  },
  {
    id: 4,
    question: "Quais elementos compõem a molécula de água (H₂O)?",
    options: ["Hidrogênio e Oxigênio", "Hidrogênio e Carbono", "Oxigênio e Carbono", "Hélio e Oxigênio"],
    correctIndex: 0,
    explanation: "A água (H₂O) é formada por 2 átomos de Hidrogênio e 1 átomo de Oxigênio, unidos por ligações covalentes polares.",
    difficulty: "easy",
    topic: "Ligações Químicas",
  },
  {
    id: 5,
    question: "O que é um isótopo?",
    options: [
      "Átomos de elementos diferentes com o mesmo número de elétrons",
      "Átomos do mesmo elemento com números de nêutrons diferentes",
      "Átomos com a mesma massa atômica mas elementos diferentes",
      "Íons formados pela perda de elétrons",
    ],
    correctIndex: 1,
    explanation: "Isótopos são átomos do mesmo elemento (mesmo número de prótons) que diferem no número de nêutrons, portanto possuem massas atômicas diferentes.",
    difficulty: "medium",
    topic: "Estrutura Atômica",
  },
  {
    id: 6,
    question: "Qual família da tabela periódica possui os elementos mais reativos?",
    options: ["Gases Nobres", "Metais de Transição", "Metais Alcalinos", "Halogênios"],
    correctIndex: 2,
    explanation: "Os Metais Alcalinos (Grupo 1) possuem apenas 1 elétron na camada de valência e tendem a perdê-lo facilmente, tornando-os extremamente reativos.",
    difficulty: "medium",
    topic: "Tabela Periódica",
  },
  {
    id: 7,
    question: "Qual tipo de ligação química ocorre entre um metal e um ametal?",
    options: ["Ligação covalente apolar", "Ligação metálica", "Ligação iônica", "Ligação de hidrogênio"],
    correctIndex: 2,
    explanation: "Entre metais e ametais ocorre a ligação iônica, onde o metal doa elétrons para o ametal, formando íons de cargas opostas que se atraem.",
    difficulty: "medium",
    topic: "Ligações Químicas",
  },
  {
    id: 8,
    question: "Qual é a configuração eletrônica do Sódio (Na, Z=11)?",
    options: ["1s² 2s² 2p⁵ 3s²", "1s² 2s² 2p⁶ 3s¹", "1s² 2s² 2p⁶ 3s²", "1s² 2s² 2p⁴ 3s²"],
    correctIndex: 1,
    explanation: "O Sódio tem 11 elétrons distribuídos como: 1s² 2s² 2p⁶ 3s¹. Seu elétron de valência na camada 3s é facilmente cedido.",
    difficulty: "medium",
    topic: "Distribuição Eletrônica",
  },
  {
    id: 9,
    question: "O que acontece com o raio atômico ao longo de um período (da esquerda para a direita)?",
    options: [
      "Aumenta gradualmente",
      "Permanece constante",
      "Diminui gradualmente",
      "Primeiro aumenta, depois diminui",
    ],
    correctIndex: 2,
    explanation: "O raio atômico diminui ao longo do período pois o número de prótons aumenta (maior atração nuclear) sem acrescentar novas camadas, puxando os elétrons mais para o núcleo.",
    difficulty: "hard",
    topic: "Propriedades Periódicas",
  },
  {
    id: 10,
    question: "Qual elemento é base de toda a química orgânica?",
    options: ["Hidrogênio", "Oxigênio", "Nitrogênio", "Carbono"],
    correctIndex: 3,
    explanation: "O Carbono é a base da química orgânica por sua capacidade única de formar até 4 ligações covalentes e cadeias longas e ramificadas.",
    difficulty: "easy",
    topic: "Química Orgânica",
  },
  {
    id: 11,
    question: "Qual é o número máximo de elétrons na segunda camada eletrônica?",
    options: ["2", "8", "18", "32"],
    correctIndex: 1,
    explanation: "A segunda camada (n=2) possui os subníveis 2s e 2p, comportando no máximo 8 elétrons (2 + 6).",
    difficulty: "medium",
    topic: "Distribuição Eletrônica",
  },
  {
    id: 12,
    question: "Por que os gases nobres são quimicamente inertes?",
    options: [
      "Por terem massa atômica muito alta",
      "Por terem a camada de valência completa (8 elétrons)",
      "Por serem muito leves e voláteis",
      "Por não possuírem prótons no núcleo",
    ],
    correctIndex: 1,
    explanation: "Os gases nobres têm a camada de valência completamente preenchida (octeto completo), atingindo a configuração mais estável — por isso praticamente não reagem.",
    difficulty: "easy",
    topic: "Tabela Periódica",
  },
];
