# 📊 Sistema de Gestão Empresarial

Um sistema moderno e intuitivo para gestão empresarial com foco em lançamentos contábeis, períodos fiscais e controle de notas fiscais. Desenvolvido com tecnologias de ponta para oferecer uma experiência rápida, confiável e colaborativa.

## ✨ Sobre o Projeto

Este sistema foi desenvolvido para simplificar e automatizar processos empresariais críticos, oferecendo:

- **Gestão de Lançamentos**: Controle completo de lançamentos contábeis com geolocalização e anexos
- **Períodos Fiscais**: Organização e fechamento de períodos contábeis com auditoria
- **Notas Fiscais**: Importação e gestão de notas fiscais com validação XML
- **Controle de Acesso**: Sistema robusto de permissões por grupos e empresas
- **Dashboards Inteligentes**: Visualização de dados em tempo real com gráficos interativos

## 🚀 Tecnologias Utilizadas

### Frontend Core
- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool ultrarrápido
- **React Router DOM** - Roteamento SPA

### UI/UX
- **Tailwind CSS** - Framework CSS utilitário
- **Shadcn/UI** - Componentes acessíveis e customizáveis
- **Radix UI** - Primitivos de UI sem estilo
- **Lucide React** - Ícones modernos
- **Recharts** - Gráficos e visualizações

### Estado e Dados
- **Zustand** - Gerenciamento de estado global
- **React Hook Form** - Formulários performáticos
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP

### Backend Integration
- **Supabase** - Backend as a Service
- **JWT** - Autenticação segura

### Desenvolvimento
- **ESLint** - Linting de código
- **Prettier** - Formatação automática
- **PNPM** - Gerenciador de pacotes

## 🎯 MVP - Funcionalidades Principais

### 1. **Sistema de Autenticação Dual**
- Login para **Usuários** (CPF/Email + Senha)
- Login para **Empresas** (CNPJ + Senha)
- Recuperação de senha
- Controle de sessões

### 2. **Gestão de Lançamentos**
- Criação de lançamentos com geolocalização
- Anexo de imagens e documentos
- Vinculação com notas fiscais
- Histórico de alterações
- Filtros avançados por data, valor e status

### 3. **Controle de Períodos**
- Criação de períodos contábeis
- Fechamento automático com relatórios
- Reabertura com justificativa
- Cálculo automático de totais

### 4. **Dashboard Executivo**
- Gráficos de desempenho temporal
- Indicadores financeiros
- Análise de lançamentos por período
- Relatórios exportáveis

### 5. **Gestão de Permissões**
- Grupos de usuários personalizáveis
- Permissões granulares por funcionalidade
- Controle de acesso por empresa
- Auditoria de ações

## 📖 Manual do Usuário

### 🏁 Primeiros Passos

#### 1. **Cadastro de Empresa**
1. Acesse a página inicial
2. Clique em "Cadastro Empresarial"
3. Preencha os dados da empresa (CNPJ, Razão Social, etc.)
4. Defina uma senha segura
5. Confirme o email de verificação

#### 2. **Login no Sistema**
- **Empresas**: Use CNPJ + Senha
- **Usuários**: Use CPF/Email + Senha

#### 3. **Configuração Inicial**
1. No dashboard, acesse "Configurações"
2. Configure grupos de usuários
3. Defina permissões por grupo
4. Cadastre os primeiros usuários

### 📊 Funcionalidades Detalhadas

#### **Dashboard**
- **Visão Geral**: Métricas principais em cards informativos
- **Gráficos Temporais**: Análise de evolução de lançamentos
- **Indicadores**: Valores totais, médias e comparativos
- **Filtros**: Por data, usuário, grupo ou período

#### **Lançamentos**
1. **Criar Novo Lançamento**:
   - Clique no botão "+" no menu lateral
   - Preencha dados da nota fiscal
   - Adicione localização (manual ou automática)
   - Anexe imagens/documentos
   - Salve ou vincule a um período

2. **Gerenciar Lançamentos**:
   - Use filtros para encontrar lançamentos específicos
   - Edite informações quando necessário
   - Visualize histórico de alterações
   - Exporte relatórios

#### **Períodos**
1. **Criar Período**:
   - Defina data de início e fim
   - Adicione observações (opcional)
   - O período fica aberto para lançamentos

2. **Fechar Período**:
   - Selecione lançamentos para incluir
   - Revise totais calculados
   - Adicione observações finais
   - Confirme o fechamento

3. **Reabrir Período**:
   - Apenas administradores podem reabrir
   - Necessário informar motivo
   - Lançamentos voltam a ficar editáveis

#### **Usuários e Permissões**
1. **Criar Grupos**:
   - Acesse "Grupos" no menu
   - Defina nome do grupo
   - Selecione permissões específicas
   - Salve as configurações

2. **Cadastrar Usuários**:
   - Preencha dados pessoais
   - Associe a um grupo
   - Envie convite por email
   - Usuário define senha no primeiro acesso

### 🔐 Tipos de Permissões

- **Ver Lançamentos**: Visualizar lista de lançamentos
- **Criar Lançamentos**: Adicionar novos lançamentos
- **Editar Lançamentos**: Modificar lançamentos existentes
- **Deletar Lançamentos**: Remover lançamentos
- **Ver Períodos**: Visualizar períodos
- **Editar Períodos**: Modificar períodos
- **Fechar Períodos**: Finalizar períodos contábeis
- **Deletar Períodos**: Remover períodos

### 🛠️ Configurações Avançadas

#### **Perfis de Usuário**
- **Administrador**: Acesso total ao sistema
- **Gestor**: Pode gerenciar lançamentos e períodos
- **Usuário**: Acesso limitado conforme grupo

#### **Integrações**
- Importação de XMLs de notas fiscais
- Exportação de relatórios (PDF/Excel)
- Backup automático de dados

### 🆘 Suporte e Resolução de Problemas

#### **Problemas Comuns**

1. **Não consigo fazer login**
   - Verifique se o CNPJ/CPF está correto
   - Confirme se a senha está correta
   - Tente recuperar a senha

2. **Erro ao carregar dashboard**
   - Verifique sua conexão com internet
   - Recarregue a página
   - Limpe o cache do navegador

3. **Lançamento não aparece no período**
   - Verifique se o lançamento está na data do período
   - Confirme se você tem permissão para ver
   - Verifique se o período não está fechado

#### **Contato para Suporte**
- Email: suporte@sistema.com
- Telefone: (11) 9999-9999
- Chat online: Disponível 24/7 no sistema

## 🚦 Como Executar

### Pré-requisitos
- Node.js 18+
- PNPM (recomendado) ou npm

### Instalação
```bash
# Clone o repositório
git clone <url-do-repositorio>

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
pnpm dev
```

### Scripts Disponíveis
```bash
pnpm dev      # Servidor de desenvolvimento
pnpm build    # Build para produção
pnpm preview  # Preview da build
pnpm lint     # Verificação de código
```

### Configuração do Ambiente
```bash
# .env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
```

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para:
- **Desktop**: Experiência completa com sidebar e múltiplas colunas
- **Tablet**: Layout adaptado com navegação por abas
- **Mobile**: Interface simplificada com menu hambúrguer

## 🔒 Segurança

- Autenticação JWT com refresh tokens
- Criptografia de senhas com bcrypt
- Validação de dados em frontend e backend
- Controle de acesso baseado em roles
- Logs de auditoria para ações críticas

## 📈 Roadmap

### Próximas Funcionalidades
- [ ] Módulo de relatórios avançados
- [ ] Integração com contabilidade
- [ ] App mobile nativo
- [ ] API para integrações externas
- [ ] Backup automático na nuvem

## 👥 Contribuição

Para contribuir com o projeto:
1. Faça um fork do repositório
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

**Desenvolvido com ❤️ para simplificar a gestão empresarial**
