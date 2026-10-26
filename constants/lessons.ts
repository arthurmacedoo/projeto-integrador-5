// constants/lessons.ts
// Fallback completo e offline das 8 lições da Trilha Golpes Pix/WhatsApp
import type { Lesson } from '@/types';

export const ALL_LESSONS: Record<string, Lesson> = {
  lesson_01: {
    id: 'lesson_01',
    trailId: 'trail_golpes',
    title: 'A Mensagem Suspeita',
    order: 1,
    xpReward: 50,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'João está trabalhando no seu comércio quando chega uma mensagem no WhatsApp de um número com foto de banco: "Seu Pix de R$ 1.500 foi enviado por engano. Clique no link para estornar imediatamente ou sua conta será bloqueada."',
        background: 'phone_screen',
      },
      {
        type: 'decision',
        question: 'O que João deve fazer diante dessa mensagem urgente?',
        options: [
          {
            id: 'A',
            text: 'Clicar no link rápido para não ter a conta bloqueada.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Ignorar o link, não clicar e checar o extrato no app oficial do banco.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Responder a mensagem pedindo comprovante e mandando seus dados.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'João clicou no link e foi para uma página falsa idêntica à do banco. Ao digitar sua senha, os golpistas limparam seu saldo. O senso de urgência é a principal arma do Phishing!',
        tip: 'Bancos e instituições NUNCA enviam links pedindo senhas ou cancelamentos via WhatsApp.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Excelente decisão! João abriu o aplicativo oficial do seu banco e viu que não havia nenhum débito. A mensagem era uma tentativa de golpe e ele bloqueou o contato.',
        tip: 'Sempre consulte os canais oficiais do seu banco antes de qualquer ação sob pressão.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Perigo! Ao interagir e enviar dados, os fraudadores conseguiram invadir a conta de João.',
        tip: 'Nunca compartilhe senhas, tokens ou códigos de validação com ninguém.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_02: {
    id: 'lesson_02',
    trailId: 'trail_golpes',
    title: 'O Link do Banco',
    order: 2,
    xpReward: 60,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'João recebe um SMS dizendo: "Banco Alerta: Atualização de segurança obrigatória pendente no seu token Pix. Evite o cancelamento da sua chave acessando: banco-seguranca-pix.meuapp.net".',
        background: 'phone_screen',
      },
      {
        type: 'decision',
        question: 'Como João deve verificar a autenticidade dessa notificação?',
        options: [
          {
            id: 'A',
            text: 'Acessar o link pelo celular para atualizar o token rapidamente.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Desconfiar do link estranho, não clicar e abrir diretamente o app do seu banco.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Encaminhar o SMS para parentes perguntando se eles também receberam.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'O link direcionava para um site clonado. Ao tentar "atualizar o token", João entregou a chave de acesso da sua conta para criminosos.',
        tip: 'Bancos não enviam links por SMS pedindo atualização de cadastros ou tokens de segurança.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Decisão perfeita! João reparou que o endereço do site não era o oficial do banco. No app legítimo, confirmou que tudo estava em ordem.',
        tip: 'Sempre verifique o domínio do site e nunca clique em links enviados por mensagens de texto.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Encaminhar links suspeitos pode espalhar o golpe e fazer amigos ou familiares caírem na armadilha.',
        tip: 'Não compartilhe mensagens duvidosas antes de checar a veracidade nos canais oficiais.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_03: {
    id: 'lesson_03',
    trailId: 'trail_golpes',
    title: 'A Promoção Imperdível',
    order: 3,
    xpReward: 60,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'Depois do trabalho, João vê um anúncio nas redes sociais de uma Smart TV por R$ 499 (preço normal R$ 2.400). A loja virtual diz que a promoção relâmpago é válida só para quem pagar agora via Pix para uma chave de pessoa física.',
        background: 'shopping',
      },
      {
        type: 'decision',
        question: 'O que João deve fazer diante desse superdesconto?',
        options: [
          {
            id: 'A',
            text: 'Pagar logo por Pix para não perder o desconto antes que o estoque acabe.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Desconfiar do preço fora da realidade e pesquisar a reputação da loja em fontes independentes.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Confiar apenas nos depoimentos que estão dentro do próprio anúncio e fazer o Pix.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Nesta simulação, a oferta era falsa. Pagar por Pix para pessoa física desconhecida colocou o dinheiro de João em risco, sem produto entregue e sem como estornar.',
        tip: 'Desconfie de preços muito abaixo da média de mercado e de exigência exclusiva de Pix para CPF de terceiros.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'João pesquisou a loja fora do anúncio e encontrou centenas de reclamações de fraude. Ao não pagar, ele protegeu seu dinheiro suado.',
        tip: 'Pesquise a reputação no Reclame Aqui e confirme se o CNPJ é verdadeiro antes de comprar em sites novos.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Depoimentos em páginas de anúncios falsos são facilmente criados pelos próprios fraudadores.',
        tip: 'Nunca use avaliações do próprio anúncio como prova de segurança.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_04: {
    id: 'lesson_04',
    trailId: 'trail_golpes',
    title: 'O Parente em Apuros',
    order: 4,
    xpReward: 70,
    slides: [
      {
        type: 'narrative',
        character: 'dona_cida',
        text: 'Dona Cida recebe uma mensagem no WhatsApp com a foto do seu filho: "Oi mãe, troquei de número porque meu celular caiu e estragou. Estou no mecânico e preciso de R$ 450 urgente no Pix para liberar o carro. Pode transferir pra essa chave?"',
        background: 'phone_screen',
      },
      {
        type: 'decision',
        question: 'Como Dona Cida deve agir para não cair no Golpe do Novo Número?',
        options: [
          {
            id: 'A',
            text: 'Fazer o Pix na hora, afinal é a foto do filho dela pedindo socorro.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Ligar para o número antigo do filho ou fazer uma chamada de vídeo para confirmar.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Responder no chat suspeito perguntando os dados do mecânico.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Dona Cida transferiu R$ 450 para a conta de um criminoso. Mais tarde, quando o filho chegou em casa, ela descobriu que ele nunca trocou de número.',
        tip: 'Golpistas copiam fotos de perfis públicos em redes sociais para fingir urgências familiares.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Perfeito! Dona Cida ligou para o número antigo do filho, que atendeu tranquilamente e confirmou que estava tudo bem. O golpe foi desarmado!',
        tip: 'Sempre confirme pedidos urgentes de dinheiro por ligação de voz ou chamada de vídeo.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'O golpista inventou mais histórias e dados falsos, pressionando Dona Cida até ela pagar.',
        tip: 'Não tente tirar dúvidas pelo próprio chat suspeito. Ligue diretamente para quem você conhece.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_05: {
    id: 'lesson_05',
    trailId: 'trail_golpes',
    title: 'A Vaga de Emprego',
    order: 5,
    xpReward: 70,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'Chega uma mensagem no WhatsApp: "Parabéns! Seu currículo foi aprovado para vaga remota de Digitador (R$ 3.800/mês, 4h por dia). Para envio do notebook da empresa e cadastro no RH, transfira a taxa de seguro de R$ 90 via Pix."',
        background: 'job',
      },
      {
        type: 'decision',
        question: 'O que João deve fazer ao receber essa proposta de trabalho?',
        options: [
          {
            id: 'A',
            text: 'Pagar a taxa de R$ 90, afinal o salário alto vai compensar com sobra.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Recusar e bloquear. Nenhuma empresa séria cobra taxa para contratar funcionários.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Pedir para parcelar a taxa no primeiro pagamento de salário.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Após receber os R$ 90, o golpista bloqueou João imediatamente. O emprego dos sonhos era apenas uma isca.',
        tip: 'Cobrança antecipada de taxa para treinamento, exame ou equipamento em seleção de emprego é SEMPRE fraude.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Excelente! João lembrou que processos seletivos reais nunca exigem pagamentos do candidato. Ele protegeu seu bolso e denunciou o número.',
        tip: 'Empresas sérias arcam com seus próprios custos operacionais de contratação.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Tentar negociar manteve João em contato com fraudadores que tentaram outros golpes.',
        tip: 'Corte contato imediatamente diante de qualquer pedido de pagamento antecipado em vagas de emprego.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_06: {
    id: 'lesson_06',
    trailId: 'trail_golpes',
    title: 'O Bilhete Premiado',
    order: 6,
    xpReward: 80,
    slides: [
      {
        type: 'narrative',
        character: 'dona_cida',
        text: 'Dona Cida recebe uma notificação: "Seu número foi sorteado na Promoção Felicidade Financeira! Você ganhou R$ 50.000. Para liberar o depósito do prêmio no seu Pix, envie o pagamento de R$ 150 referente à taxa de custódia federal."',
        background: 'trophy',
      },
      {
        type: 'decision',
        question: 'Como Dona Cida deve reagir a essa premiação?',
        options: [
          {
            id: 'A',
            text: 'Pagar os R$ 150 rápido para não perder o prêmio de R$ 50.000.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Ignorar e apagar a mensagem. Não existe prêmio em sorteio que você nunca participou.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Mandar a chave Pix e pedir para descontarem os R$ 150 do valor do prêmio.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Dona Cida pagou os R$ 150 e em seguida os golpistas pediram mais R$ 300 de "impostos". O prêmio nunca existiu.',
        tip: 'Prêmios legítimos nunca exigem pagamento prévio para serem resgatados.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Dona Cida agiu com muita esperteza! Lembrou que não havia entrado em nenhum sorteio e apagou o golpe na hora.',
        tip: 'Se você não participou de nenhum sorteio oficial registrado pela Caixa/Receita, não há prêmio algum a receber.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Ao insistir, o golpista solicitou dados pessoais e documentos que poderiam ser usados em novas fraudes.',
        tip: 'Nunca envie documentos pessoais ou dados bancários para contatos desconhecidos.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_07: {
    id: 'lesson_07',
    trailId: 'trail_golpes',
    title: 'A Chave Pix Errada',
    order: 7,
    xpReward: 80,
    slides: [
      {
        type: 'narrative',
        character: 'carlos',
        text: 'Carlos recebe um Pix de R$ 300 de um desconhecido. Minutos depois, uma pessoa desesperada manda mensagem: "Moço, transferi errado o dinheiro do remédio do meu filho! Por favor, faz um Pix de volta pra chave da minha mãe (outro CPF)?"',
        background: 'chat',
      },
      {
        type: 'decision',
        question: 'Qual é o procedimento correto e seguro para devolver esse valor?',
        options: [
          {
            id: 'A',
            text: 'Fazer uma nova transferência Pix para a chave diferente que a pessoa passou.',
            isCorrect: false,
          },
          {
            id: 'B',
            text: 'Utilizar exclusivamente o botão oficial "Devolver Valor" no extrato do seu próprio banco.',
            isCorrect: true,
          },
          {
            id: 'C',
            text: 'Ficar com o dinheiro, já que o erro foi da outra pessoa.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Cuidado com o Golpe do MED! Ao fazer um novo Pix para outra conta, o golpista ainda pede o estorno oficial no banco dele. Você perde o valor duas vezes!',
        tip: 'Nunca faça um novo Pix avulso. Use sempre a funcionalidade oficial de Devolução do Pix.',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Carlos agiu com total segurança e honestidade! O botão "Devolver" devolve o dinheiro exatamente para a conta pagadora de origem sem risco de fraude.',
        tip: 'O recurso oficial de devolução do Banco Central estorna o valor com rastreabilidade total.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Apropriar-se de dinheiro recebido por engano é crime de apropriação indébita (Artigo 169 do Código Penal).',
        tip: 'Sempre faça a devolução pelo canal oficial para manter sua conta segura e dentro da lei.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },

  lesson_08: {
    id: 'lesson_08',
    trailId: 'trail_golpes',
    title: 'Você é o Guardião',
    order: 8,
    xpReward: 100,
    slides: [
      {
        type: 'narrative',
        character: 'assistente',
        text: 'Parabéns por chegar ao desafio final da trilha! Agora você tem o conhecimento para proteger a si mesmo e orientar sua família e amigos na Baixada Cuiabana.',
        background: 'trophy',
      },
      {
        type: 'decision',
        question: 'Qual a combinação ideal de proteção no celular para blindar suas contas contra invasões?',
        options: [
          {
            id: 'A',
            text: 'Ativar verificação em duas etapas com PIN no WhatsApp, configurar limite noturno de Pix baixo e usar biometria no celular.',
            isCorrect: true,
          },
          {
            id: 'B',
            text: 'Usar a mesma senha fácil em todos os aplicativos para não esquecer e deixar limites ilimitados.',
            isCorrect: false,
          },
          {
            id: 'C',
            text: 'Desativar senhas de bloqueio de tela para poder atender rápido qualquer ligação.',
            isCorrect: false,
          },
        ],
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: false,
        text: 'Você se tornou um verdadeiro Guardião Financeiro! Com 2FA, senhas fortes e limites bancários inteligentes, suas finanças digitais estão superprotegidas.',
        tip: 'Espalhe essas dicas para comerciantes, vizinhos e parentes: conhecimento compartilhado é proteção comunitária!',
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: true,
        text: 'Senhas repetidas e falta de limites deixam suas finanças totalmente vulneráveis em caso de furto ou vazamento.',
        tip: 'Senhas devem ser únicas e limites noturnos devem ser mantidos baixos.',
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Sem bloqueio de tela, qualquer pessoa que pegar seu aparelho terá acesso livre aos seus dados e contas bancárias.',
        tip: 'O bloqueio do celular por biometria ou PIN é a primeira linha de defesa do cidadão.',
      },
      {
        type: 'xp_reward',
      },
    ],
  },
};
