export type Locale = "en" | "pt-BR";

export const translations: Record<Locale, Record<string, unknown>> = {
  en: {
    nav: {
      howItWorks: "How it Works",
      privacy: "Privacy",
      safety: "Safety",
      donate: "Support",
      startOnWhatsApp: "Start on WhatsApp",
      ariaHome: "Between Clouds home",
      ariaDonate: "Donate to support this project",
    },
    hero: {
      badge: "Lives on WhatsApp",
      title1: "Think. Process.",
      titleAccent: "Let Go.",
      description:
        "An ephemeral mental health companion. Your conversations disappear after processing. No data stored. No algorithms. Just a safe space to think — right where you already are.",
      howItWorks: "How It Works",
    },
    heroTrust: {
      endToEnd: "End-to-end",
      noDataStored: "No data stored",
      crisisSupport: "Crisis support",
    },
    valueProps: {
      subtitle:
        "An impartial environment is a bridge, not a common place of judgment. On the other side, your words find a safe place to unfold.",
      items: [
        {
          title: "Messages Disappear",
          description:
            "Your words exist only in the moment. After the AI responds, they're gone forever from our servers.",
          whatsapp:
            "Just like a real conversation that stays between you and your companion.",
        },
        {
          title: "No New App Needed",
          description:
            "Between Clouds lives inside WhatsApp. No downloads, no sign-up forms, no new passwords.",
          whatsapp: "Open WhatsApp. Start talking. That's it.",
        },
        {
          title: "Safety Comes First",
          description:
            "Crisis detection runs before the AI even thinks. If you're in danger, you get real help instantly.",
          whatsapp: "988 (US) or 188 (Brazil) — one tap away, always.",
        },
        {
          title: "Zero Tracking",
          description:
            "No engagement metrics. No streaks. No \"we miss you\" messages. We don't even count how often you visit.",
          whatsapp: "You come when you need to. We never reach out first.",
        },
      ],
    },
    howItWorks: {
      subtitle: "From WhatsApp tap to meaningful reflection",
      title: "What Happens When You Start",
      steps: [
        {
          title: "You send a message on WhatsApp",
          description:
            "Open WhatsApp, find Between Clouds, and send any message. No sign-up, no forms, no app store.",
          chatText: "Hi, I need someone to talk to...",
        },
        {
          title: "You give your consent",
          description:
            "We explain what Between Clouds is (and isn't). You consent to the ephemeral, private nature of the conversation. You can say no — or ask for more info.",
          consentWelcome: "Welcome to Between Clouds.",
          consentBefore: "Before we begin, I need your consent.",
          consentEphemeral:
            "Your messages are ephemeral — processed in real-time and never stored.",
          consentButton: "I understand and consent",
        },
        {
          title: "You talk. Between Clouds listens.",
          description:
            "Share what's on your mind. The AI companion reflects, validates, and asks thoughtful questions — never diagnosing, never prescribing, never pretending to be human.",
          userMsg:
            "I've been feeling really overwhelmed at work lately.",
          aiMsg:
            "That sounds exhausting. When you say everything piles up, is there one particular area that feels most heavy right now?",
        },
        {
          title: "Your words vanish. The insight stays.",
          description:
            "After processing, your messages are permanently deleted from our servers. Nothing is stored. Optionally, Memory Mode extracts abstract themes — not your words.",
          deletedText:
            "Messages processed and deleted from all servers",
        },
      ],
    },
    privacy: {
      title: "Your words are yours. Guaranteeing your privacy is our ethical commitment.",
      subtitle:
        "We built the system so we technically cannot access your conversations. Here's how.",
      guarantees: [
        {
          text: "No message content is ever written to our database. The schema literally doesn't have a column for it.",
          detail: "CI blocks any migration that tries to add one.",
        },
        {
          text: "No engagement metrics. We don't track DAU, session length, or message count. Structurally blocked.",
          detail: "ADR-0005: three independent enforcement layers.",
        },
        {
          text: "Your OpenAI API key is encrypted at rest (AES-256). We never see it unencrypted.",
          detail: "Only last 4 characters displayed in your dashboard.",
        },
        {
          text: "GDPR & LGPD compliant. Full data erasure on request, automated.",
          detail: "30-day hard delete after soft delete.",
        },
        {
          text: "We will never sell, share, or monetize your data. Not now, not ever.",
          detail: "This is a red line, not a policy.",
        },
      ],
    },
    memory: {
      title: "Memory Mode",
      badge: "Pro Plan",
      subtitle: "Remember the insights, not the words.",
      description:
        "Opt-in paid feature. Instead of storing your conversations, we extract gentle abstractions — emotional themes, recurring patterns, meaningful insights. Your actual words are still deleted.",
      example:
        "Example: What Memory Mode stores (not your words)",
      exampleTheme: {
        label: "Emotional theme:",
        value: "anxiety — recurring in work contexts",
      },
      exampleInsight: {
        label: "Insight:",
        value:
          "user finds journaling helpful for managing stress",
      },
      examplePattern: {
        label: "Pattern:",
        value:
          "sleep difficulties mentioned 3 sessions in a row",
      },
      footer:
        "Think of it as remembering the weather, not the words you said about it. Only you can see your memory abstractions. Delete anytime.",
    },
    safety: {
      title: "Need Immediate Help?",
      subtitle:
        "Between Clouds detects crisis signals before responding. If you're in danger, help is one tap away.",
      header: "Crisis Resources — Seek Specialized Help",
      footer:
        "Between Clouds is not a crisis service. If you or someone you know is in danger, please reach out to these resources. You are not alone.",
      crisis: [
        {
          name: "988 Suicide & Crisis Lifeline",
          info: "US — Call or text 988, 24/7",
          badge: "US",
        },
        {
          name: "CVV — Centro de Valorização da Vida",
          info: "Brazil — Ligue 188, 24 horas",
          badge: "BR",
        },
        {
          name: "Samaritans",
          info: "UK — Call 116 123, 24/7",
          badge: "UK",
        },
        {
          name: "NHS 111 (non-emergency) / 999 (emergency)",
          info: "UK — NHS mental health support line",
          badge: "UK",
        },
        {
          name: "European Emergency Number",
          info: "EU/EEA — Call 112, 24/7",
          badge: "EU",
        },
      ],
    },
    faq: {
      title: "Common Questions",
      items: [
        {
          q: "What does 'ephemeral' mean?",
          a: "Your messages exist temporarily in memory while being processed. Once the AI generates a response, your words are deleted. Nothing is written to our database. It's like talking to someone who listens carefully and then forgets — by design.",
        },
        {
          q: "Is my data really private?",
          a: "Yes. We don't store message content, don't track engagement, and don't share data with third parties. Your OpenAI API key is encrypted and never logged. We can't show you your chat history because we don't have it.",
        },
        {
          q: "How does the AI work?",
          a: "We use OpenAI's models with a carefully designed prompt that prioritizes empathy and safety. Your API key is used exclusively for your conversations. The AI acts as a reflective mirror — it validates emotions and asks thoughtful questions, never diagnosing or prescribing.",
        },
        {
          q: "What happens if I'm in crisis?",
          a: "Our system detects signs of crisis before generating any AI response. If detected, you'll receive immediate crisis resources (988 in the US, 188 in Brazil). We are not a replacement for professional help — we are a bridge to it.",
        },
        {
          q: "What is Memory Mode?",
          a: "An optional paid feature that extracts abstract insights from your conversations (themes, patterns). Your actual words are still deleted. Only summaries of patterns are stored. Think of it as remembering the weather, not the words you said about it.",
        },
        {
          q: "Can I delete all my data?",
          a: "Yes. You can request full data erasure at any time, compliant with GDPR and LGPD. Since we never store your message content, erasure means removing your account metadata, consent records, and any Memory Mode abstractions.",
        },
      ],
    },
    cta: {
      title: "Ready to talk?",
      subtitle:
        "No sign-up forms. No downloads. Just open WhatsApp and start.",
      button: "Start on WhatsApp",
      footer:
        "Free to start. Your own OpenAI API key required for Pro features.",
    },
    footer: {
      disclaimer:
        "Between Clouds is not a medical device, therapist, or crisis service.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      safetyResources: "Safety Resources",
      copyright: "© {year} Between Clouds. All rights reserved.",
    },
    donate: {
      title: "Donate to Between Clouds",
      subtitle: "Help keep this project alive and growing.",
      story1:
        "Between Clouds is a pro-life, pro-wellbeing initiative built by a solo developer. Someone who has faced unemployment, emotional struggles, and the weight of carrying difficult feelings alone — and believes that no one should have to go through that without a safe space to land.",
      story2:
        "This project exists because I know what it means to need someone to talk to at 3am, with no judgment, no agenda, no data being collected. I built Between Clouds to be exactly that: a 100% impartial, welcoming, and ephemeral companion.",
      story3:
        "Every donation helps me maintain this project, keep the servers running, and expand to reach more people across Brazil and the world through the digital space.",
      storyQuote:
        "Your words deserve a safe place. Thank you for helping me protect that.",
      chooseAmount: "Choose an amount",
      customPlaceholder: "Custom amount",
      paymentMethod: "Payment method",
      pixLabel: "Pix",
      pixDesc: "Free · Instant · Brazil",
      pixNote:
        "Pix is completely free with zero fees. QR code will be generated for your donation.",
      cardLabel: "Card",
      cardDesc: "International · Stripe",
      cardNote:
        "International card payments processed securely via Stripe.",
      donateButton: "Donate",
      feeNote:
        "100% of your donation goes directly to maintaining and expanding Between Clouds.",
      cardFeeNote:
        " Standard Stripe processing fees may apply.",
    },
    mockup: {
      onlineStatus: "online",
      today: "Today",
      typeMessage: "Type a message",
      conversation0:
        "Welcome to Between Clouds.\n\nBefore we begin, I need your consent.\n\nBetween Clouds is a mental health companion, not a substitute for professional care. Your messages are ephemeral — they are processed in real-time and never stored.",
      conversationButtons0: "I understand and consent",
      conversationButtons1: "Tell me more",
      conversationStatus:
        "Thank you. Your consent is recorded.",
      conversationHowHelp: "How can I help you today?",
      conversationUser1:
        "I've been feeling really overwhelmed at work lately. Everything piles up and I can't seem to catch a break.",
      conversationAi1:
        "That sounds exhausting. When you say everything piles up, is there one particular area that feels most heavy right now?",
      conversationUser2:
        "Honestly it's my boss. They keep giving me more work without acknowledging what I'm already doing.",
      conversationAi2:
        "It's frustrating to feel like your efforts aren't being seen. How does that lack of recognition affect you beyond the workplace?",
      ephemeralityNote: "Messages processed and deleted",
    },
  },

  "pt-BR": {
    nav: {
      howItWorks: "Como Funciona",
      privacy: "Privacidade",
      safety: "Segurança",
      donate: "Apoiar",
      startOnWhatsApp: "Comece no WhatsApp",
      ariaHome: "Página inicial do Between Clouds",
      ariaDonate: "Doar para apoiar este projeto",
    },
    hero: {
      badge: "Vive no WhatsApp",
      title1: "Pense. Processe.",
      titleAccent: "Deixe Ir.",
      description:
        "Um companheiro de saúde mental efêmero. Suas conversas desaparecem após o processamento. Sem dados armazenados. Sem algoritmos. Apenas um espaço seguro para pensar — onde você já está.",
      howItWorks: "Como Funciona",
    },
    heroTrust: {
      endToEnd: "Criptografia",
      noDataStored: "Sem dados salvos",
      crisisSupport: "Apoio em crise",
    },
    valueProps: {
      subtitle:
        "O ambiente imparcial é uma ponte, não um lugar comum e de julgamentos. Do outro lado, suas palavras encontram um lugar seguro para externalizar.",
      items: [
        {
          title: "Mensagens Desaparecem",
          description:
            "Suas palavras existem apenas no momento. Depois que a IA responde, elas se vão para sempre dos nossos servidores.",
          whatsapp:
            "Como uma conversa real que fica só entre você e seu companheiro.",
        },
        {
          title: "Sem Novo App",
          description:
            "O Between Clouds vive dentro do WhatsApp. Sem downloads, sem formulários de cadastro, sem novas senhas.",
          whatsapp: "Abra o WhatsApp. Comece a conversar. Pronto.",
        },
        {
          title: "Segurança em Primeiro Lugar",
          description:
            "A detecção de crise acontece antes mesmo da IA processar. Se você estiver em perigo, recebe ajuda real na hora.",
          whatsapp:
            "188 (CVV) ou 988 (EUA) — a um toque de distância, sempre.",
        },
        {
          title: "Zero Rastreamento",
          description:
            "Sem métricas de engajamento. Sem sequências. Sem mensagens de \"sentimos sua falta\". Não contamos nem quantas vezes você visita.",
          whatsapp:
            "Você vem quando precisa. Nós nunca procuramos primeiro.",
        },
      ],
    },
    howItWorks: {
      subtitle: "Do toque no WhatsApp à reflexão significativa",
      title: "O Que Acontece Quando Você Começa",
      steps: [
        {
          title: "Você envia uma mensagem no WhatsApp",
          description:
            "Abra o WhatsApp, encontre Between Clouds, e envie qualquer mensagem. Sem cadastro, sem formulários, sem loja de apps.",
          chatText: "Oi, preciso conversar com alguém...",
        },
        {
          title: "Você dá seu consentimento",
          description:
            "Explicamos o que é (e o que não é) o Between Clouds. Você consente com a natureza efêmera e privada da conversa. Pode dizer não — ou pedir mais informações.",
          consentWelcome: "Bem-vindo ao Between Clouds.",
          consentBefore:
            "Antes de começarmos, preciso do seu consentimento.",
          consentEphemeral:
            "Suas mensagens são efêmeras — processadas em tempo real e nunca armazenadas.",
          consentButton: "Eu entendo e aceito",
        },
        {
          title: "Você conversa. O Between Clouds escuta.",
          description:
            "Compartilhe o que está em sua mente. O companheiro de IA reflete, valida e faz perguntas reflexivas — nunca diagnosticando, nunca prescrevendo, nunca fingindo ser humano.",
          userMsg:
            "Ultimamente me sinto muito sobrecarregado no trabalho.",
          aiMsg:
            "Parece exaustivo. Quando você diz que tudo se acumula, existe alguma área específica que parece mais pesada agora?",
        },
        {
          title: "Suas palavras somem. O insight permanece.",
          description:
            "Após o processamento, suas mensagens são permanentemente excluídas dos nossos servidores. Nada é armazenado. Opcionalmente, o Modo Memória extrai temas abstratos — não suas palavras.",
          deletedText:
            "Mensagens processadas e excluídas de todos os servidores",
        },
      ],
    },
    privacy: {
      title: "As palavras são suas. Garantir sua Privacidade é o nosso compromisso ético.",
      subtitle:
        "Construímos o sistema de forma que tecnicamente não podemos acessar suas conversas. Veja como.",
      guarantees: [
        {
          text: "Nenhum conteúdo de mensagem é escrito no nosso banco de dados. O schema literalmente não tem coluna para isso.",
          detail:
            "CI bloqueia qualquer migração que tente adicionar uma.",
        },
        {
          text: "Sem métricas de engajamento. Não rastreamos DAU, duração de sessão ou contagem de mensagens. Bloqueado estruturalmente.",
          detail:
            "ADR-0005: três camadas independentes de fiscalização.",
        },
        {
          text: "Sua chave de API OpenAI é criptografada em repouso (AES-256). Nunca a vemos descriptografada.",
          detail:
            "Apenas os últimos 4 caracteres exibidos no seu painel.",
        },
        {
          text: "Conforme com GDPR e LGPD. Exclusão completa de dados mediante solicitação, automatizada.",
          detail:
            "Exclusão definitiva em 30 dias após exclusão suave.",
        },
        {
          text: "Nunca venderemos, compartilharemos ou monetizaremos seus dados. Nem agora, nem nunca.",
          detail: "Esta é uma linha vermelha, não uma política.",
        },
      ],
    },
    memory: {
      title: "Modo Memória",
      badge: "Plano Pro",
      subtitle: "Lembre dos insights, não das palavras.",
      description:
        "Recurso pago opcional. Em vez de armazenar suas conversas, extraímos abstrações suaves — temas emocionais, padrões recorrentes, insights significativos. Suas palavras reais continuam sendo excluídas.",
      example:
        "Exemplo: O que o Modo Memória armazena (não suas palavras)",
      exampleTheme: {
        label: "Tema emocional:",
        value: "ansiedade — recorrente em contextos de trabalho",
      },
      exampleInsight: {
        label: "Insight:",
        value:
          "usuário encontra útil escrever em diário para gerenciar estresse",
      },
      examplePattern: {
        label: "Padrão:",
        value:
          "dificuldades de sono mencionadas 3 sessões seguidas",
      },
      footer:
        "Pense como lembrar do clima, não das palavras que você disse sobre ele. Só você pode ver suas abstrações de memória. Exclua a qualquer momento.",
    },
    safety: {
      title: "Precisa de Ajuda Imediata?",
      subtitle:
        "O Between Clouds detecta sinais de crise antes de responder. Se você estiver em perigo, a ajuda está a um toque.",
      header: "Recursos de Crise — Procure ajuda especializada",
      footer:
        "Between Clouds não é um serviço de crise. Se você ou alguém que conhece estiver em perigo, por favor entre em contato com esses recursos. Você não está sozinho.",
      crisis: [
        {
          name: "988 — Linha de Prevenção ao Suicídio",
          info: "EUA — Ligue ou envie mensagem para 988, 24h",
          badge: "US",
        },
        {
          name: "CVV — Centro de Valorização da Vida",
          info: "Brasil — Ligue 188, 24 horas",
          badge: "BR",
        },
        {
          name: "Samaritanos",
          info: "Reino Unido — Ligue 116 123, 24h",
          badge: "UK",
        },
        {
          name: "NHS 111 (não emergência) / 999 (emergência)",
          info:
            "Reino Unido — Linha de apoio em saúde mental do NHS",
          badge: "UK",
        },
        {
          name: "Número de Emergência Europeu",
          info: "UE/EEE — Ligue 112, 24h",
          badge: "EU",
        },
      ],
    },
    faq: {
      title: "Perguntas Frequentes",
      items: [
        {
          q: "O que significa 'efêmero'?",
          a: "Suas mensagens existem temporariamente na memória enquanto são processadas. Assim que a IA gera uma resposta, suas palavras são excluídas. Nada é escrito no nosso banco de dados. É como conversar com alguém que escuta com atenção e depois esquece — por design.",
        },
        {
          q: "Meus dados são realmente privados?",
          a: "Sim. Não armazenamos conteúdo de mensagens, não rastreamos engajamento e não compartilhamos dados com terceiros. Sua chave de API OpenAI é criptografada e nunca registrada. Não podemos mostrar seu histórico de chat porque não o temos.",
        },
        {
          q: "Como funciona a IA?",
          a: "Usamos modelos da OpenAI com um prompt cuidadosamente projetado que prioriza empatia e segurança. Sua chave de API é usada exclusivamente para suas conversas. A IA atua como um espelho reflexivo — valida emoções e faz perguntas reflexivas, nunca diagnosticando ou prescrevendo.",
        },
        {
          q: "O que acontece se eu estiver em crise?",
          a: "Nosso sistema detecta sinais de crise antes de gerar qualquer resposta da IA. Se detectado, você receberá recursos de crise imediatos (988 nos EUA, 188 no Brasil). Não somos substitutos de ajuda profissional — somos uma ponte para ela.",
        },
        {
          q: "O que é o Modo Memória?",
          a: "Um recurso pago opcional que extrai insights abstratos das suas conversas (temas, padrões). Suas palavras reais continuam sendo excluídas. Apenas resumos de padrões são armazenados. Pense como lembrar do clima, não das palavras que você disse sobre ele.",
        },
        {
          q: "Posso excluir todos os meus dados?",
          a: "Sim. Você pode solicitar a exclusão completa dos dados a qualquer momento, em conformidade com GDPR e LGPD. Como nunca armazenamos o conteúdo das suas mensagens, a exclusão significa remover os metadados da sua conta, registros de consentimento e quaisquer abstrações do Modo Memória.",
        },
      ],
    },
    cta: {
      title: "Pronto para conversar?",
      subtitle:
        "Sem formulários de cadastro. Sem downloads. Apenas abra o WhatsApp e comece.",
      button: "Comece no WhatsApp",
      footer:
        "Grátis para começar. Sua própria chave de API OpenAI necessária para recursos Pro.",
    },
    footer: {
      disclaimer:
        "Between Clouds não é um dispositivo médico, terapeuta ou serviço de crise.",
      privacyPolicy: "Política de Privacidade",
      termsOfService: "Termos de Serviço",
      safetyResources: "Recursos de Segurança",
      copyright:
        "© {year} Between Clouds. Todos os direitos reservados.",
    },
    donate: {
      title: "Doar para o Between Clouds",
      subtitle: "Ajude a manter este projeto vivo e em crescimento.",
      story1:
        "Between Clouds é uma iniciativa pró-vida e pró-bem-estar construída por um desenvolvedor solo. Alguém que enfrentou desemprego, dificuldades emocionais e o peso de carregar sentimentos difíceis sozinho — e acredita que ninguém deveria passar por isso sem um espaço seguro para aterrissar.",
      story2:
        "Este projeto existe porque eu sei o que é precisar de alguém para conversar às 3 da manhã, sem julgamento, sem agenda, sem dados sendo coletados. Eu construí o Between Clouds para ser exatamente isso: um companheiro 100% imparcial, acolhedor e efêmero.",
      story3:
        "Cada doação me ajuda a manter este projeto, manter os servidores funcionando e expandir para alcançar mais pessoas pelo Brasil e pelo mundo através do espaço digital.",
      storyQuote:
        "Suas palavras merecem um lugar seguro. Obrigado por me ajudar a proteger isso.",
      chooseAmount: "Escolha um valor",
      customPlaceholder: "Valor personalizado",
      paymentMethod: "Método de pagamento",
      pixLabel: "Pix",
      pixDesc: "Grátis · Instantâneo · Brasil",
      pixNote:
        "O Pix é completamente gratuito, sem taxas. O QR code será gerado para sua doação.",
      cardLabel: "Cartão",
      cardDesc: "Internacional · Stripe",
      cardNote:
        "Pagamentos com cartão internacional processados com segurança pelo Stripe.",
      donateButton: "Doar",
      feeNote:
        "100% da sua doação vai diretamente para manter e expandir o Between Clouds.",
      cardFeeNote:
        " Taxas padrão de processamento do Stripe podem ser aplicadas.",
    },
    mockup: {
      onlineStatus: "online",
      today: "Hoje",
      typeMessage: "Digite uma mensagem",
      conversation0:
        "Bem-vindo ao Between Clouds.\n\nAntes de começarmos, preciso do seu consentimento.\n\nBetween Clouds é um companheiro de saúde mental, não um substituto para cuidados profissionais. Suas mensagens são efêmeras — são processadas em tempo real e nunca armazenadas.",
      conversationButtons0: "Eu entendo e aceito",
      conversationButtons1: "Quero saber mais",
      conversationStatus: "Obrigado. Seu consentimento foi registrado.",
      conversationHowHelp: "Como posso te ajudar hoje?",
      conversationUser1:
        "Ultimamente tenho me sentido muito sobrecarregado no trabalho. Tudo se acumula e parece que não consigo respirar.",
      conversationAi1:
        "Parece exaustivo. Quando você diz que tudo se acumula, tem alguma área específica que parece mais pesada agora?",
      conversationUser2:
        "Sinceramente é meu chefe. Eles continuam me dando mais trabalho sem reconhecer o que eu já faço.",
      conversationAi2:
        "É frustrante sentir que seus esforços não estão sendo vistos. Como essa falta de reconhecimento te afeta além do trabalho?",
      ephemeralityNote: "Mensagens processadas e excluídas",
    },
  },
};
