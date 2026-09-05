# Gemmp Construção Civil & Imobiliária

Portal oficial da **Gemmp Construção Civil & Imobiliária** em Luanda, Angola (Kilamba, Futungo de Belas, Talatona e toda a província). Plataforma moderna para divulgação, venda e arrendamento de vivendas de alto padrão, casas T1 a T4+, lotes/terrenos e contratação de serviços de engenharia e construção civil.

---

## 🚀 Tecnologias e Arquitetura

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion
- **Bundler & Tooling:** Vite 6
- **Ícones:** Lucide React
- **Banco de Dados & Autenticação:** Firebase Firestore & Firebase Auth (com motor UltraBoost de sincronização local e offline-first)
- **Hospedagem & CI/CD:** Suporte nativo para Vercel, Netlify, GitHub Actions, Firebase Hosting e VPS

---

## 💻 Instalação e Execução Local

### Pré-requisitos
- Node.js (v18 ou superior)
- npm, yarn ou pnpm

### Comandos:
```bash
# 1. Clonar repositório
git clone https://github.com/SEU-USUARIO/gemmp-construcao-civil-imobiliaria.git
cd gemmp-construcao-civil-imobiliaria

# 2. Instalar dependências
npm install

# 3. Executar em modo de desenvolvimento
npm run dev

# 4. Verificar TypeScript e Linters
npm run lint

# 5. Compilar para produção
npm run build

# 6. Pré-visualizar a versão compilada
npm run preview
```

---

## 🔒 Regras de Segurança do Firebase Firestore (Segurança Ativa)

As regras abaixo garantem que o catálogo de imóveis seja lido publicamente por todos os visitantes, enquanto as operações de inserção, edição e exclusão de imóveis e publicidades ficam estritamente restritas a administradores autenticados. O chat de clientes conta com validação estrita de tamanho e formato para prevenir abusos.

Copie e cole este código no [Firebase Console](https://console.firebase.google.com/) no menu **Firestore Database > Regras (Rules)**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Funções auxiliares
    function isAuthenticated() {
      return request.auth != null;
    }

    function isValidMessage() {
      return request.resource.data.text is string 
          && request.resource.data.text.size() > 0 
          && request.resource.data.text.size() <= 2000
          && request.resource.data.sender is string;
    }

    function isValidConversation() {
      return request.resource.data.clientName is string 
          && request.resource.data.clientName.size() > 0 
          && request.resource.data.clientName.size() <= 100;
    }

    // 1. Catálogo de Imóveis, Casas e Terrenos
    // Leitura pública; inserção, atualização e exclusão apenas para ADM autenticado
    match /properties/{propertyId} {
      allow read: if true;
      allow create, update, delete: if isAuthenticated();
    }

    // 2. Chat de Atendimento ao Cliente
    // Clientes iniciam conversas e enviam mensagens validadas
    match /conversations/{conversationId} {
      allow read: if true;
      allow create: if isValidConversation();
      allow update: if true;
      allow delete: if isAuthenticated();

      match /messages/{messageId} {
        allow read: if true;
        allow create: if isValidMessage();
        allow update, delete: if isAuthenticated();
      }
    }

    // 3. Caixas de Publicidade & Configurações de Sistema
    // Leitura pública; edição exclusiva para ADM autenticado
    match /system/{documentId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // 4. Categorias e Localidades Adicionadas Dinamicamente
    // Leitura pública para filtros; alteração exclusiva para ADM autenticado
    match /config/{documentId} {
      allow read: if true;
      allow write: if isAuthenticated();
    }

    // 5. Bloqueio padrão para qualquer outra rota não declarada
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🔐 Acesso ao Painel Administrativo (ADM)

O acesso administrativo é protegido através do Firebase Authentication e validação criptográfica (SHA-256):
- **Email do Administrador:** `gemmpeimoveis93221@gmail.com`
- **Senha Padrão:** `gempe123@#`
- **Contacto WhatsApp Oficial:** `+244 935973494`
- **Sede:** Kilamba & Futungo de Belas, Luanda - Angola

### Configuração de Usuário no Firebase Authentication:
1. No Firebase Console, acesse **Authentication > Usuários**.
2. Clique em **Adicionar usuário**.
3. Insira o email `gemmpeimoveis93221@gmail.com` e a senha `gempe123@#`.
4. Conclua a criação.

---

## 🌐 Guia Completo de Deployment

O projeto inclui arquivos de configuração dedicados (`vercel.json` e `netlify.toml`) com roteamento SPA, cabeçalhos de segurança (CORS, CSP, X-Frame-Options, Strict-Transport-Security) e otimização de cache.

### Opção A: Vercel (Linha de Comando ou GitHub)

#### Via CLI do Vercel:
```bash
# 1. Instalar a CLI globalmente
npm install -g vercel

# 2. Fazer login
vercel login

# 3. Publicar diretamente em produção
vercel --prod
```

#### Via Painel Web da Vercel:
1. Acesse [vercel.com](https://vercel.com) e conecte sua conta do GitHub.
2. Clique em **Add New Project** e selecione o repositório `gemmp-construcao-civil-imobiliaria`.
3. As configurações já estão predefinidas pelo `vercel.json`:
   - **Framework:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em **Deploy**.

---

### Opção B: Netlify (Linha de Comando ou GitHub)

#### Via CLI do Netlify:
```bash
# 1. Instalar a CLI
npm install -g netlify-cli

# 2. Fazer login
netlify login

# 3. Publicar em produção
netlify deploy --prod --dir=dist
```

#### Via Painel Web do Netlify:
1. Acesse [netlify.com](https://netlify.com) e importe o repositório do GitHub.
2. O arquivo `netlify.toml` já configura automaticamente os redirecionamentos SPA e os cabeçalhos de segurança.
3. Clique em **Deploy Site**.

---

### Opção C: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Selecione a pasta 'dist' e confirme como Single Page App (SPA)
npm run build
firebase deploy --only hosting
```

---

## 🌍 Configuração de Domínio Personalizado

Para utilizar um domínio próprio (ex.: `gemmpimoveis.ao` ou `gemmp.co.ao`):

### 1. Na Vercel:
1. Vá em **Project Settings > Domains**.
2. Adicione seu domínio (ex.: `gemmpimoveis.ao`).
3. No seu registrador de domínio DNS (ex.: Reg.it, GoDaddy, Cloudflare, etc.), configure:
   - **Tipo A:** `@` apontando para `76.76.21.21`
   - **Tipo CNAME:** `www` apontando para `cname.vercel-dns.com`
4. O certificado SSL gratuito (HTTPS) será gerado automaticamente.

### 2. No Netlify:
1. Vá em **Site configuration > Domain management**.
2. Adicione seu domínio.
3. Configure os DNS apontando para o Netlify conforme instruído no painel.

---

## 🛡️ Variáveis de Ambiente em Produção

Se desejar definir ou customizar as variáveis no painel da Vercel ou Netlify (menu **Settings > Environment Variables**):

| Variável | Descrição | Exemplo |
|---|---|---|
| `VITE_FIREBASE_API_KEY` | Chave de API do Firebase | `AIzaSyBmReFge...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Domínio de Auth do Firebase | `gemmp-49e82.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | ID do Projeto no Firebase | `gemmp-49e82` |
| `VITE_FIREBASE_STORAGE_BUCKET` | Bucket do Storage | `gemmp-49e82.firebasestorage.app` |
| `VITE_ADMIN_EMAIL` | Email de acesso administrativo | `gemmpeimoveis93221@gmail.com` |
| `VITE_ADMIN_PASSWORD` | Senha alternativa (opcional) | `gempe123@#` |
| `VITE_BASE_URL` | Caminho base do deploy | `/` |

---

© 2026 Gemmp Construção Civil & Imobiliária. Luanda, Angola.
