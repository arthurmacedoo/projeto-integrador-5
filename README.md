# 📱 TchôEduca — Educação Financeira Gamificada

> **Projeto Integrador 5 (PEI 5)**  
> Aplicativo de microlearning interativo focado na tomada de decisões financeiras seguras e proteção contra golpes digitais (Pix e WhatsApp) para jovens e microempreendedores da Baixada Cuiabana.

### 🌐 Acesse o app online
👉 **https://arthurmacedoo.github.io/projeto-integrador-5/**

Funciona direto no navegador do celular ou do computador — sem precisar instalar nada.

---

## ✨ Principais Recursos

- **Roleplay Educativo:** 8 lições baseadas em situações reais do dia a dia, com decisões interativas, consequências imediatas e *Dica do Guardião*.
- **Gamificação Humanizada:** Sistema de XP e 5 níveis de evolução com abordagem não punitiva (erros também geram aprendizado e XP parcial).
- **Acessibilidade Integrada:** Ajuste de tamanho do texto, modo de alto contraste (WCAG), navegação por teclado e leitura em voz alta em português (pt-BR).
- **Suporte Offline:** Cache local e fallback das lições para funcionar mesmo com conexão instável.

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
| :--- | :--- |
| **Front-end / Mobile** | React Native + Expo (SDK 57) + Expo Router |
| **Linguagem** | TypeScript |
| **Estilização & Tema** | StyleSheet + Tokens de Tema Acessíveis (`constants/theme.ts`, alto contraste WCAG AAA) |
| **Acessibilidade & Voz** | Expo Speech / Web Speech API (`pt-BR`), escala de fonte e navegação por teclado |
| **Estado** | Zustand + AsyncStorage |
| **Back-end** | Firebase (Authentication e Cloud Firestore com cache offline) |
| **Publicação Web** | GitHub Pages |

---

## 🚀 Como rodar localmente

1. Clone o repositório e instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo `.env` a partir do modelo `.env.example` e preencha com as credenciais do seu projeto Firebase:
   ```bash
   cp .env.example .env
   ```
3. Inicie o projeto:
   ```bash
   npm run web        # abrir no navegador
   npm run typecheck  # validar tipos TypeScript
   ```

---

## 📄 Documentação

- [Documento de Requisitos de Produto (PRD)](./docs/PRD.md)
- [Arquitetura Técnica](./docs/ARQUITETURA.md)
