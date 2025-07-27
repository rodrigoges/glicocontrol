# GlicoControl

GlicoControl é um aplicativo web para registro, classificação e histórico de medições glicêmicas, com autenticação via Google e persistência de dados no Firebase Firestore.

## Funcionalidades

- Cadastro e login de usuários usando conta Google
- Registro de medições glicêmicas com classificação automática (normal, hipo, hiper)
- Histórico de medições salvo na nuvem (Firestore)
- Dados acessíveis de qualquer dispositivo
- Interface moderna e responsiva

## Tecnologias Utilizadas
- React + TypeScript
- Vite
- Firebase Firestore (persistência de dados)
- Google Identity Services (login/cadastro)
- Gemini API (classificação das medições)

## Como rodar localmente

**Pré-requisitos:**
- Node.js (recomendado: versão 18 ou superior)
- Conta no Firebase (Firestore ativado)
- Credencial de OAuth do Google (Client ID)
- Chave da Gemini API

### 1. Instale as dependências
```bash
npm install
```

### 2. Configure as variáveis e serviços

- Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave Gemini:
  ```
  GEMINI_API_KEY=SUA_CHAVE_AQUI
  ```
- Configure o Firebase:
  - Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
  - Ative o Firestore Database
  - Copie as credenciais do Firebase e preencha o arquivo `firebaseConfig.ts`:
    ```ts
    const firebaseConfig = {
      apiKey: "SUA_API_KEY",
      authDomain: "SEU_AUTH_DOMAIN",
      projectId: "SEU_PROJECT_ID",
      storageBucket: "SEU_STORAGE_BUCKET",
      messagingSenderId: "SEU_MESSAGING_SENDER_ID",
      appId: "SEU_APP_ID"
    };
    ```
- Configure o login Google:
  - Crie uma credencial OAuth 2.0 no [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
  - Adicione o Client ID ao arquivo `config.ts`:
    ```ts
    export const GOOGLE_CLIENT_ID = 'SEU_CLIENT_ID_GOOGLE';
    ```

### 3. Rode o app
```bash
npm run dev
```
O app estará disponível em `http://localhost:5173`.

## Fluxo de uso

1. **Cadastro/Login:**
   - Clique em "Cadastre-se" ou "Login com Google".
   - Permita o acesso à sua conta Google.
2. **Registro de Medição:**
   - Insira o valor da glicemia e salve.
   - O app classifica automaticamente a medição.
3. **Histórico:**
   - Todas as medições ficam salvas no Firestore, acessíveis após login em qualquer dispositivo.

## Observações
- O app não armazena senhas, apenas autenticação via Google.
- As medições são privadas por usuário.
- Para produção, ajuste as regras de segurança do Firestore.

## Licença
MIT
