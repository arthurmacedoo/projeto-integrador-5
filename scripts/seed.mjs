// scripts/seed.mjs
// Script para popular o Firestore com os 5 níveis e as 8 lições da Trilha Golpes Pix/WhatsApp
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAo-zBaFLZKzrqdtYp7eoDZonu0_xUpijI",
  authDomain: "finedu-app-f4087.firebaseapp.com",
  projectId: "finedu-app-f4087",
  storageBucket: "finedu-app-f4087.firebasestorage.app",
  messagingSenderId: "291439180019",
  appId: "1:291439180019:web:2376f8607bc454a5d81f86"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ── 1. NÍVEIS DE XP ──────────────────────────────────────────
const levels = [
  { level: 1, name: 'Iniciante', xpRequired: 0, avatarVariantUnlocked: 1 },
  { level: 2, name: 'Aprendiz', xpRequired: 150, avatarVariantUnlocked: 2 },
  { level: 3, name: 'Consciente', xpRequired: 350, avatarVariantUnlocked: 3 },
  { level: 4, name: 'Estrategista', xpRequired: 600, avatarVariantUnlocked: 4 },
  { level: 5, name: 'Guardião Financeiro', xpRequired: 900, avatarVariantUnlocked: 5 },
];

// ── 2. TRILHA PRINCIPAL ──────────────────────────────────────
const trailGolpes = {
  id: 'trail_golpes',
  title: 'Golpes Pix e WhatsApp',
  description: 'Aprenda na prática a identificar fraudes digitais, proteger seu dinheiro e blindar seus dados.',
  order: 1,
  isLocked: false,
  iconName: 'shield-alert',
  color: '#3b82f6',
};

// ── 3. AS 8 LIÇÕES ROLEPLAY ───────────────────────────────────
const lessons = [
  {
    id: 'lesson_01',
    trailId: 'trail_golpes',
    title: '1. A Mensagem Suspeita',
    order: 1,
    xpReward: 50,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'João está trabalhando no seu comércio quando chega uma mensagem no WhatsApp de um número com foto de banco: "Seu Pix de R$ 1.500 foi enviado por engano. Clique no link para estornar imediatamente ou sua conta será bloqueada."',
        background: 'phone_screen'
      },
      {
        type: 'decision',
        question: 'O que João deve fazer diante dessa mensagem urgente?',
        options: [
          { id: 'A', text: 'Clicar no link rápido para não ter a conta bloqueada.', isCorrect: false },
          { id: 'B', text: 'Ignorar o link, não clicar e checar o extrato no app oficial do banco.', isCorrect: true },
          { id: 'C', text: 'Responder a mensagem pedindo comprovante e mandando a senha.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'João clicou no link e foi para uma página falsa idêntica à do banco. Ao digitar sua senha, os golpistas limparam seu saldo. O senso de urgência é a principal arma do Phishing!',
        tip: 'Bancos e instituições NUNCA enviam links pedindo senhas ou cancelamentos via WhatsApp.'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Excelente decisão! João abriu o aplicativo oficial do seu banco e viu que não havia nenhum débito. A mensagem era uma tentativa de golpe e ele bloqueou o contato.',
        tip: 'Sempre consulte os canais oficiais do seu banco antes de qualquer ação sob pressão.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Perigo! Ao interagir e enviar dados, os fraudadores conseguiram invadir a conta de João.',
        tip: 'Nunca compartilhe senhas, tokens ou códigos de validação com ninguém.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_02',
    trailId: 'trail_golpes',
    title: '2. O Parente em Apuros',
    order: 2,
    xpReward: 60,
    slides: [
      {
        type: 'narrative',
        character: 'dona_cida',
        text: 'Dona Cida recebe uma mensagem no WhatsApp com a foto do seu filho: "Oi mãe, troquei de número porque meu celular estragou. Estou no mecânico e preciso de R$ 450 urgente no Pix para liberar o carro. Pode transferir pra essa chave?"',
        background: 'phone_screen'
      },
      {
        type: 'decision',
        question: 'Como Dona Cida deve agir para não cair no Golpe do Novo Número?',
        options: [
          { id: 'A', text: 'Fazer o Pix na hora, afinal é o filho dela pedindo socorro.', isCorrect: false },
          { id: 'B', text: 'Ligar para o número antigo do filho ou fazer uma chamada de vídeo.', isCorrect: true },
          { id: 'C', text: 'Mandar mensagem no novo número perguntando se está tudo bem.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Dona Cida transferiu R$ 450 para a conta de um laranja. Mais tarde, quando o filho chegou em casa, ela descobriu que ele nunca trocou de número.',
        tip: 'Golpistas pegam fotos de redes sociais e fingem ser parentes com urgências falsas.'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Perfeito! Dona Cida ligou para o número antigo do filho, que atendeu normalmente e confirmou que não era ele. Ela evitou o prejuízo!',
        tip: 'Sempre confirme a identidade por ligação de voz, chamada de vídeo ou pergunta pessoal que só a pessoa sabe.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'O golpista respondeu com mais mentiras convincentes e insistiu no Pix.',
        tip: 'Não tente tirar dúvidas pelo próprio chat suspeito. Ligue diretamente para a pessoa.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_03',
    trailId: 'trail_golpes',
    title: '3. A Promoção Imperdível',
    order: 3,
    xpReward: 60,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'Navegando nas redes sociais, João vê um anúncio patrocinado: "Smart TV 55 polegadas 4K por apenas R$ 499,00! Últimas unidades! Pagamento exclusivo via Chave Pix." O site tem visual idêntico a uma grande loja.',
        background: 'shopping'
      },
      {
        type: 'decision',
        question: 'Qual é o sinal de alerta e o que João deve fazer?',
        options: [
          { id: 'A', text: 'Comprar imediatamente antes que acabe o estoque.', isCorrect: false },
          { id: 'B', text: 'Desconfiar do preço fora da realidade e checar o endereço do site oficial.', isCorrect: true },
          { id: 'C', text: 'Fazer Pix para pessoa física que aparece como recebedor.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'João fez o Pix e o produto nunca chegou. O site falso foi tirado do ar 2 horas depois.',
        tip: 'Preços milagrosos e exigência de pagamento apenas por Pix para pessoa física são fortes indícios de golpe.'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Muito consciente! João viu que o link era "loja-promocoes-ofertas.xyz" e não o site oficial. Ele denunciou o anúncio falso.',
        tip: 'Sempre confira a URL (endereço) do site e pesquise a reputação da loja no Reclame Aqui.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Lojas grandes não recebem pagamentos em contas de pessoas físicas desconhecidas.',
        tip: 'Grandes empresas emitem Pix com CNPJ oficial correspondente à razão social da marca.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_04',
    trailId: 'trail_golpes',
    title: '4. A Falsa Vaga de Emprego',
    order: 4,
    xpReward: 70,
    slides: [
      {
        type: 'narrative',
        character: 'joao',
        text: 'Chega uma mensagem no SMS: "Parabéns! Você foi selecionado para uma vaga de assistente remoto (R$ 3.800/mês). Para liberação do treinamento e equipamentos, pague a taxa de cadastro de R$ 90 via Pix."',
        background: 'job'
      },
      {
        type: 'decision',
        question: 'O que você deve fazer ao receber essa proposta?',
        options: [
          { id: 'A', text: 'Pagar a taxa, pois o salário prometido compensa o pequeno investimento.', isCorrect: false },
          { id: 'B', text: 'Recusar e bloquear. Nenhuma empresa séria cobra taxa para contratar.', isCorrect: true },
          { id: 'C', text: 'Pedir desconto na taxa de inscrição.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Após pagar os R$ 90, o contato bloqueou João. A vaga não existia.',
        tip: 'Cobrança de material, teste ou taxa de cadastro em processo seletivo é fraude.'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Exato! Empresas idôneas arcam com os custos de seus processos seletivos. João protegeu seu bolso.',
        tip: 'Desconfie de salários muito altos para funções sem exigência de experiência prévia.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Negociar com golpistas só abre espaço para que eles criem novas artimanhas para te enganar.',
        tip: 'Corte contato imediatamente diante de pedidos de pagamento antecipado.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_05',
    trailId: 'trail_golpes',
    title: '5. O Golpe do Pix Agendado / Falso Comprovante',
    order: 5,
    xpReward: 70,
    slides: [
      {
        type: 'narrative',
        character: 'carlos',
        text: 'Carlos vendeu um lanche grande por entrega. O cliente enviou um print de comprovante de Pix no valor de R$ 120 e disse: "Já paguei, manda o motoboy agora!". No print, em letras miúdas, está escrito "Agendamento de Pix".',
        background: 'store'
      },
      {
        type: 'decision',
        question: 'Como Carlos deve proceder antes de entregar o pedido?',
        options: [
          { id: 'A', text: 'Liberar a entrega imediatamente com base no print do WhatsApp.', isCorrect: false },
          { id: 'B', text: 'Abrir a conta bancária da empresa e só entregar após o dinheiro cair no saldo disponível.', isCorrect: true },
          { id: 'C', text: 'Acreditar porque o comprovante tem o nome dele.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Carlos enviou o lanche e o cliente cancelou o agendamento do Pix logo em seguida. Carlos ficou no prejuízo!',
        tip: 'Prints de comprovante podem ser editados ou agendados e cancelados a qualquer momento.'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Perfeita postura profissional! Carlos checou seu extrato e viu que o dinheiro não havia caído. Ele pediu o pagamento instantâneo antes de despachar.',
        tip: 'Pix cai em poucos segundos. Nunca libere mercadorias sem conferir o saldo real na sua conta.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Agendamentos podem ser cancelados facilmente no app do banco antes do horário agendado.',
        tip: 'Pix efetuado é diferente de Pix agendado.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_06',
    trailId: 'trail_golpes',
    title: '6. A Falsa Central de Segurança',
    order: 6,
    xpReward: 80,
    slides: [
      {
        type: 'narrative',
        character: 'dona_cida',
        text: 'Dona Cida atende uma ligação com voz profissional: "Aqui é da Central de Prevenção a Fraudes do seu banco. Detectamos uma compra suspeita de R$ 2.800 nas Casas Bahia. Para cancelar, você precisa transferir seu saldo para uma conta de segurança temporária."',
        background: 'phone_call'
      },
      {
        type: 'decision',
        question: 'O que Dona Cida deve fazer diante dessa ligação?',
        options: [
          { id: 'A', text: 'Seguir as orientações e transferir o dinheiro para a "conta segura".', isCorrect: false },
          { id: 'B', text: 'Desligar a chamada na hora e ligar para o telefone que fica no verso do seu cartão físico.', isCorrect: true },
          { id: 'C', text: 'Passar a senha do cartão para o atendente verificar no sistema.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Essa "conta de segurança" é a conta dos próprios criminosos! Nenhum banco tem esse procedimento.',
        tip: 'Bancos JAMAIS solicitam transferências para "proteger" ou "estornar" seu saldo.'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Excelente! Dona Cida desligou imediatamente, ligou pelo número oficial do verso do cartão e descobriu que não havia compra alguma.',
        tip: 'Se receber ligação de "central de segurança", desligue e faça você mesmo a ligação para o canal oficial.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Senhas nunca devem ser digitadas ou faladas ao telefone para supostos operadores.',
        tip: 'Os bancos nunca pedem senha da conta ou código de segurança por telefone.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_07',
    trailId: 'trail_golpes',
    title: '7. O Golpe do Pix por Engano e Devolução Manual',
    order: 7,
    xpReward: 80,
    slides: [
      {
        type: 'narrative',
        character: 'carlos',
        text: 'Carlos recebe R$ 300 de um desconhecido via Pix. Logo em seguida, uma pessoa desesperada manda mensagem: "Por favor, errei a chave e mandei o dinheiro do remédio do meu filho! Faz um Pix de volta para a chave da minha esposa (outro CPF)?"',
        background: 'chat'
      },
      {
        type: 'decision',
        question: 'Qual é a forma correta e segura de devolver esse Pix?',
        options: [
          { id: 'A', text: 'Fazer uma nova transferência Pix para a chave diferente indicada pela pessoa.', isCorrect: false },
          { id: 'B', text: 'Usar exclusivamente a função oficial "Devolver Pix" dentro do próprio extrato do banco.', isCorrect: true },
          { id: 'C', text: 'Ficar com o dinheiro e não devolver.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: true,
        text: 'Cuidado com o Golpe do MED (Mecanismo Especial de Devolução)! O golpista pede para você transferir para outra conta e depois aciona o banco para estornar o Pix original. Você perde o dinheiro duas vezes!',
        tip: 'Nunca faça um novo Pix manual para outra chave. Use sempre o botão oficial "Devolver Valor".'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: false,
        text: 'Perfeito! Ao usar a função "Devolver", o sistema do Banco Central retorna o dinheiro exatamente para a conta de origem de forma rastreável e segura, sem risco de golpe duplo.',
        tip: 'A funcionalidade nativa de devolução do Pix protege você contra fraudes de estorno.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Apropriar-se de valores recebidos por engano é crime de apropriação indébita (Art. 169 do Código Penal).',
        tip: 'Sempre faça a devolução através do recurso oficial de devolução no seu app bancário.'
      },
      { type: 'xp_reward' }
    ]
  },
  {
    id: 'lesson_08',
    trailId: 'trail_golpes',
    title: '8. O Guardião Financeiro (Desafio Final)',
    order: 8,
    xpReward: 100,
    slides: [
      {
        type: 'narrative',
        character: 'assistente',
        text: 'Parabéns! Você chegou ao desafio final. Agora é sua vez de ser o Guardião! Dona Cida e João estão indecisos sobre como blindar a segurança de seus celulares no dia a dia.',
        background: 'trophy'
      },
      {
        type: 'decision',
        question: 'Qual conjunto de boas práticas você recomenda como Guardião?',
        options: [
          { id: 'A', text: 'Ativar autenticação em duas etapas no WhatsApp com PIN, definir limite de Pix noturno baixo e nunca salvar senhas no bloco de notas.', isCorrect: true },
          { id: 'B', text: 'Usar a mesma senha fácil em todas as contas e deixar o Pix sem limite para emergências.', isCorrect: false },
          { id: 'C', text: 'Desativar bloqueio de tela para acessar o celular mais rápido.', isCorrect: false }
        ]
      },
      {
        type: 'consequence',
        forOption: 'A',
        isNegative: false,
        text: 'Você se tornou um verdadeiro Guardião Financeiro! Com 2FA ativado, limites noturnos ajustados e senhas fortes, você e sua comunidade estão protegidos contra as maiores ameaças digitais.',
        tip: 'Compartilhe esse conhecimento com familiares, amigos e comerciantes locais da Baixada Cuiabana!'
      },
      {
        type: 'consequence',
        forOption: 'B',
        isNegative: true,
        text: 'Senhas repetidas e ausência de limites deixam suas contas extremamente vulneráveis.',
        tip: 'Configure sempre limites de segurança no seu app bancário para o período noturno.'
      },
      {
        type: 'consequence',
        forOption: 'C',
        isNegative: true,
        text: 'Sem bloqueio de tela, em caso de furto ou perda, qualquer pessoa acessa seus aplicativos bancários.',
        tip: 'Mantenha biometria ou senha forte ativada no bloqueio do aparelho.'
      },
      { type: 'xp_reward' }
    ]
  }
];

// ── EXECUÇÃO DO SEED ──────────────────────────────────────────
async function runSeed() {
  console.log('🌱 Iniciando Seed do FinEdu...');

  // 1. Salva Níveis
  console.log('📌 Populando config/levels...');
  for (const lvl of levels) {
    await setDoc(doc(db, 'config', `level_${lvl.level}`), lvl);
    console.log(`  ✓ Nível ${lvl.level}: ${lvl.name}`);
  }

  // 2. Salva Trilha
  console.log('📌 Criando trilha: Golpes Pix e WhatsApp...');
  await setDoc(doc(db, 'trails', trailGolpes.id), trailGolpes);
  console.log('  ✓ Trilha criada!');

  // 3. Salva Lições
  console.log('📌 Criando as 8 lições interativas...');
  for (const lesson of lessons) {
    await setDoc(doc(db, 'trails', trailGolpes.id, 'lessons', lesson.id), lesson);
    console.log(`  ✓ ${lesson.title} (${lesson.slides.length} slides, ${lesson.xpReward} XP)`);
  }

  console.log('\n🎉 SEED CONCLUÍDO COM SUCESSO! O Firestore está pronto para uso.');
  process.exit(0);
}

runSeed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
