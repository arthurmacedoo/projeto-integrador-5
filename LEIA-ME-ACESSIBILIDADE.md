# Acessibilidade — FinEdu (PEI 5)

## Como aplicar
1. Extraia este zip na raiz do repositório e substitua os arquivos.
2. Rode `npm install` (entra a dependência `expo-speech ~57.0.2`).
3. `npm start` → Perfil → "♿ Acessibilidade".

## O que o usuário ganha
- **Leitura em voz alta (pt-BR):** botão "🔊 Ouvir" em todos os slides. Na decisão, lê a pergunta e as opções.
  Tem leitura automática opcional e velocidade lenta, normal ou rápida. A fala para ao trocar de slide.
  Se o TalkBack estiver ligado, a leitura automática fica desligada para as vozes não se sobreporem.
- **Tamanho do texto:** Normal / Grande / Extra grande, aplicado no **app inteiro**.
- **Alto contraste:** preto, branco e amarelo (contraste acima de 15:1), aplicado no **app inteiro**.
- **Leitor de tela (TalkBack):** rótulos, papéis (botão, opção, cabeçalho, barra de progresso) e áreas de toque de 48dp.
- As preferências ficam salvas no aparelho e funcionam offline.

## Funciona em todas as plataformas
| | Android (app) | iPhone (app) | Computador (navegador) | Celular (navegador) |
|---|---|---|---|---|
| Texto grande / alto contraste | ✅ | ✅ | ✅ | ✅ |
| Voz em pt-BR | ✅ voz do Android | ✅ voz do iOS | ✅ voz do Chrome/Edge/Safari | ✅ |
| Leitor de tela | TalkBack | VoiceOver | NVDA, JAWS, VoiceOver (Mac) | TalkBack / VoiceOver |
| Teclado (Tab, Enter, Espaço) | — | — | ✅ com contorno de foco amarelo | — |

Cuidados de cada plataforma, já tratados no código (`hooks/useSpeech.ts`):
- **Voz natural:** o app dá uma nota para cada voz em português e usa a mais natural (neural): Francisca e Antonio (Natural) no Edge, Google no Chrome, Aprimorada/Premium no iPhone e vozes de rede no Android. A voz antiga "Microsoft Maria", robótica e tremida, fica por último. Na tela de Acessibilidade dá para escolher a voz, e ela fala uma frase de exemplo.
- **Vozes com apelidos cuiabanos:** só aparecem as vozes brasileiras naturais. As de Portugal e as robóticas (Maria e Daniel) ficam escondidas, e as outras ganham apelidos: Siriri (Francisca), Cururu (Antonio), Rasqueado (Thalita), Chalana (Google), Pixé e Furrundu (iPhone/Mac), Mojica e Pintado (outras). Se o aparelho só tiver vozes escondidas, o app usa essas mesmo, para não ficar mudo.
- **Velocidade:** Lenta 0,65 / Normal 1,0 / Rápida 1,45, com frase de exemplo ao tocar.
- **Todas:** escolhe a voz pt-BR do aparelho de propósito. Se o aparelho não tiver nenhuma, a tela de Acessibilidade avisa e explica como instalar.
- **Chrome no PC:** fala frase por frase, porque o Chrome corta falas com mais de uns 15 segundos.
- **Safari / iPhone no navegador:** a voz é "destravada" no primeiro toque na página, que é uma exigência do Safari.
- **iPhone (app):** usa uma sessão de áudio própria para a fala.
- **Web:** a página é marcada como `lang="pt-BR"`, para os leitores de tela pronunciarem em português. As opções informam "marcada" com `aria-checked`.
- **Alertas:** `Alert.alert` não funciona no navegador. Foi trocado por `utils/alert.ts`, que funciona nas três plataformas. **Antes, o botão "Sair" e as mensagens de erro do login não funcionavam no PC.**
- **Lição:** a área segura (notch/barra de status) agora funciona também no Android.

## Arquivos
**Novos:** store/useAccessibilityStore.ts · constants/theme.ts · hooks/useSpeech.ts ·
components/accessibility/AccessibleText.tsx · components/accessibility/ListenButton.tsx ·
app/(app)/accessibility.tsx · css.d.ts · utils/alert.ts

**Alterados:** todas as telas e componentes visuais. As cores fixas viraram "tokens" do tema
(no modo normal, a cor é a mesma de antes) e os tamanhos de fonte passaram a seguir a escala escolhida.

## Correções em problemas que já existiam no projeto
1. **O build Android quebrava** (`parseAspectRatio ... reading '0'`) por causa do `@media` no `global.css`.
   O bloco saiu do CSS, e o mesmo visual (app centralizado em 480px no PC) agora é feito em `app/_layout.tsx`, só na web.
2. **Erro de TypeScript** no `import '../global.css'` → resolvido com o arquivo `css.d.ts`.
3. **Abas fantasmas** na barra inferior ("trails/[trailId]", "trails/lesson/...") → removidas.
   A lição agora abre em tela cheia.
4. **Contraste abaixo do WCAG AA** (exigido no PRD): os cinzas `#64748b` (3,7:1) e `#475569` (2,4:1)
   e a cor do Nível 1 (`#78716c`) foram clareados.

## Testes realizados
- `npx tsc --noEmit`: **0 erros**.
- `npx expo export --platform android`: bundle gerado (1264 módulos), com o `global.css` real.
- Navegador automatizado em tamanho de celular, com Firebase simulado, nos dois modos (normal e acessível):
  - Home, Trilhas, Trilha, Perfil e Acessibilidade abrem sem erros no console.
  - Lição percorrida do início ao XP.
  - Alto contraste e tamanho do texto mudam a tela e continuam salvos depois de recarregar.
  - Botão Ouvir: envia o texto em pt-BR, vira "Parar", cancela a fala e para ao trocar de slide.
  - Leitura automática fala sozinha e respeita a velocidade escolhida.
  - A barra inferior tem só 3 abas e fica escondida durante a lição.
- Builds de **Android (1265 módulos), iOS (1172) e Web (836)** gerados sem erro.
- Testes automatizados em tela de **computador (1366×768)**, **celular Android** e **iPhone** (tela e toque simulados):
  as telas cabem sem rolagem lateral, a voz usa a voz pt-BR escolhida e divide o texto em frases.
- **Teclado no PC:** Tab chega em todos os botões, com contorno de foco visível. Enter ouve, avança e escolhe a opção. Espaço liga o alto contraste.
- **Navegador sem voz em português:** mostra o aviso. **Navegador sem suporte a voz:** o app funciona normalmente, só sem a leitura.
- **Falta testar num celular de verdade** (Expo Go ou APK), principalmente a voz, que usa o motor de voz do Android.

## Critério de aceitação sugerido para o PRD
**CA-07: Acessibilidade.** Dado que o usuário ativou alto contraste, texto grande ou leitura automática,
quando navega pelo app ou abre uma lição, então os textos aparecem no tamanho e nas cores escolhidos,
o slide pode ser ouvido em pt-BR, e a configuração continua salva ao reabrir o app (inclusive offline).
