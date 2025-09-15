# 📋 ReObserve: Seu Sistema de Controle de Notas Fiscais

> Este projeto tem como finalidade criar e organizar a emissão de NFs (Notas fiscais) para melhor controle às empresas.

## 🚀 Status do Projeto
**Em desenvolvimento** - Backend implementado | Frontend planejado com React.js

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **TypeScript** - Tipagem estática 
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **Zod** - Validação de schemas
- **bcrypt** - Hash de senhas
- **JWT** - Autenticação

### Ferramentas de Desenvolvimento
- **[PREENCHER: outras ferramentas que você usa]**

---

## ✨ Funcionalidades Implementadas

### 🏢 Gestão de Empresas
- [ ] Cadastro de empresas com validação de CNPJ
- [ ] [PREENCHER: outras funcionalidades de empresa]

### 👥 Gestão de Usuários  
- [ ] Cadastro de usuários com validação de CPF
- [ ] [PREENCHER: outras funcionalidades de usuário]

### 🔐 Autenticação
- [ ] [PREENCHER: funcionalidades de auth que você implementou]

### 📄 Gestão de Notas Fiscais
- [ ] [PREENCHER: funcionalidades de NF que você planeja/implementou]

---

## 🏗️ Estrutura do Projeto

```
src/
├── controllers/          # Lógica de controle
│   └── auth/
│       └── register/
├── routes/              # Definição de rotas
├── prisma/              # Configuração do banco
│   └── schema.prisma
├── types/               # Tipos TypeScript
└── [PREENCHER: outras pastas]
```

---

## ⚙️ Como Executar

### Pré-requisitos
```bash
# [PREENCHER: versões necessárias]
Node.js >= X.X.X
PostgreSQL >= X.X
```

### Instalação
```bash
# 1. Clone o repositório
git clone [SEU_REPO_URL]

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# [PREENCHER: quais variáveis são necessárias]

# 4. Execute as migrations
npx prisma migrate dev

# 5. Inicie o servidor
npm run dev
```

---

## 📡 Endpoints da API

### 🏢 Empresas
```http
POST /api/empresas/register
# [PREENCHER: outros endpoints]
```

### 👥 Usuários
```http
POST /api/usuarios/register
# [PREENCHER: outros endpoints]
```

### 🔐 Autenticação
```http
# [PREENCHER: endpoints de auth]
```

---

## 🔒 Boas Práticas Implementadas

- ✅ **Validação de dados** com Zod
- ✅ **Hash de senhas** com bcrypt
- ✅ **Tipagem forte** com TypeScript
- ✅ **Validação de documentos** (CPF/CNPJ)
- ✅ **Tratamento de erros** estruturado
- ✅ [PREENCHER: outras práticas que você implementou]

---

## 🎯 Próximos Passos

- [ ] **Frontend React.js**
- [ ] **Testes automatizados**
- [ ] **Deploy em produção**
- [ ] **[PREENCHER: outros planos]**

---

## 🤝 Contribuição

[PREENCHER: instruções se quiser aceitar contribuições]

---

## 📄 Licença

[PREENCHER: tipo de licença ou "Projeto pessoal"]

---

## 👨‍💻 Desenvolvedor

**[SEU NOME]**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu perfil](https://linkedin.com/in/seu-perfil)
- Email: seu.email@exemplo.com
