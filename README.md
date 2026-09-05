# Gemmp Construção Civil & Imobiliária

Portal oficial da **Gemmp Construção Civil & Imobiliária** em Luanda, Angola (Kilamba, Futungo de Belas, Talatona e toda a província). Plataforma completa para divulgação, venda e arrendamento de vivendas de alto padrão, casas T1 a T4+, lotes/terrenos e serviços de engenharia e construção civil.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Motion
- **Bundler / Dev Server:** Vite 6
- **Ícones:** Lucide React
- **Banco de Dados & Autenticação:** Firebase Firestore & Firebase Auth (com motor UltraBoost de sincronização local e offline-first)

---

## 💻 Instruções de Instalação e Execução Local

### Pré-requisitos
- Node.js (v18 ou superior)
- npm ou yarn ou pnpm

### Passos:
1. Clone o repositório:
```bash
git clone https://github.com/SEU-USUARIO/gemmp-construcao-civil-imobiliaria.git
cd gemmp-construcao-civil-imobiliaria
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```
O projeto estará disponível em `http://localhost:3000` (ou na porta indicada pelo terminal).

4. Para testar a compilação para produção:
```bash
npm run build
```
Os arquivos otimizados e prontos para publicação serão gerados na pasta `dist/`.

5. Para pré-visualizar a versão de produção:
```bash
npm run preview
```

---

## 🔒 Regras do Firebase Firestore (Plano Gratuito)

Copie e cole as regras abaixo no separador **Firestore Database > Regras (Rules)** no [Firebase Console](https://console.firebase.google.com/):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Properties / Lotes Collection (Public Read, Controlled Write)
    match /properties/{propertyId} {
      allow read: if true;
      allow write: if true;
    }

    // Client - Imobiliária Conversations Collection
    match /conversations/{conversationId} {
      allow read, write: if true;

      // Private Messages Subcollection
      match /messages/{messageId} {
        allow read, write: if true;
      }
    }

    // System Settings, Publicity & Backups
    match /system/{documentId} {
      allow read, write: if true;
    }

    // Dynamic Categories and Localities (Config)
    match /config/{documentId} {
      allow read, write: if true;
    }

    // Connectivity health-check path
    match /test/{documentId} {
      allow read, write: if true;
    }

    // Fallback security rule
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🔐 Acesso Administrativo (Painel ADM)

O acesso ao Painel de Administração do portal é realizado através do botão **"Entrar"** no canto superior direito da barra de navegação.

- **Email do Administrador:** `gemmpeimoveis93221@gmail.com`
- **Senha Padrão:** `gempe123@#`
- **Contacto WhatsApp Oficial:** `+244 935973494`
- **Localização:** Kilamba & Futungo de Belas, Luanda - Angola

### Recursos do Painel ADM:
- Postagem e edição de imóveis com fotos comprimidas automaticamente.
- Gestão de Cómodos detalhados (quartos, suites, casas de banho, cozinhas, salas, varandas, despensas, escritórios).
- Cadastro dinâmico de Novas Categorias e Novas Localidades em Angola.
- Gestão das 3 Caixas de Publicidade de alta visibilidade no topo do site.
- Chat em Tempo Real com clientes visitantes do portal.

---

## 🌐 Como Publicar (Deploy)

### 1. Vercel (Recomendado - 1 Clique)
1. Conecte sua conta GitHub à [Vercel](https://vercel.com).
2. Importe o repositório.
3. A Vercel detectará automaticamente as configurações do Vite:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Clique em **Deploy**.

### 2. Netlify
1. Conecte ao [Netlify](https://netlify.com) com o GitHub.
2. Selecione o repositório.
3. Configure:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Clique em **Deploy Site**.

### 3. Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Selecione 'dist' como diretório público e configure como SPA (single-page app)
npm run build
firebase deploy --only hosting
```

### 4. Servidor VPS / Nginx / Apache
Basta executar `npm run build` e apontar o DocumentRoot do servidor para a pasta `dist/`.
Certifique-se de configurar o roteamento SPA para redirecionar requisições para `index.html`.

---

© 2026 Gemmp Construção Civil & Imobiliária. Todos os direitos reservados.
