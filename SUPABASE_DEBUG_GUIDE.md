# Guia de Diagnóstico - Timeout Supabase para Empresas

## Problema Identificado
- ❌ **Timeout do banco Supabase** apenas quando empresas fazem upload de imagens
- ✅ **Usuários funcionam normalmente** - problema específico de empresas

## Modificações Implementadas para Diagnóstico

### 1. **Logs Detalhados no SDK Supabase** (`utils/supabase-sdk.ts`)
- ✅ **Logs de token**: Verifica se token está sendo definido corretamente
- ✅ **Logs de configuração**: Monitora cliente Supabase
- ✅ **Logs de upload**: Acompanha cada etapa do processo
- ✅ **Timeouts configurados**: 30 segundos para conexões

### 2. **Função de Diagnóstico** (`diagnosticarSupabase()`)
- ✅ **Teste de buckets**: Verifica se consegue listar buckets
- ✅ **Teste de acesso**: Confirma acesso ao bucket 'Imagens'
- ✅ **Logs detalhados**: Identifica exatamente onde falha

### 3. **Integração no Release Modal**
- ✅ **Diagnóstico automático**: Executa para empresas antes do upload
- ✅ **Logs contextuais**: Mostra tipo de usuário e IDs
- ✅ **Import correto**: useAuthStore integrado

## Como Usar o Diagnóstico

### Passo 1: Abrir DevTools
1. Pressione `F12` no navegador
2. Vá para a aba **Console**
3. Faça login como empresa

### Passo 2: Testar Upload
1. Vá para **Criar Lançamento**
2. Adicione uma imagem
3. Preencha os dados
4. Clique em **Salvar**

### Passo 3: Analisar Logs
Procure por estes logs no console:

```
🔑 Token Supabase atualizado
🔧 Cliente Supabase configurado
🏢 Executando diagnóstico para empresa antes do upload...
🔍 Iniciando diagnóstico do Supabase...
📋 Teste 1: Listando buckets...
📂 Teste 2: Verificando bucket 'Imagens'...
📤 Iniciando upload de imagens
```

## Possíveis Causas e Soluções

### **Causa 1: Token de Empresa Inválido**
- **Sintoma**: Erro nos testes de bucket
- **Solução**: Verificar autenticação enterprise no backend

### **Causa 2: Permissões RLS Supabase**
- **Sintoma**: Buckets listados mas acesso negado
- **Solução**: Ajustar Row Level Security para empresas

### **Causa 3: Configuração de Timeout**
- **Sintoma**: Timeout nas requests
- **Solução**: Aumentar timeouts ou otimizar conexão

### **Causa 4: Diferença de Headers**
- **Sintoma**: Funciona para users mas não empresas
- **Solução**: Verificar se headers JWT são diferentes

## Próximos Passos

1. **Execute o teste** e colete os logs
2. **Identifique onde falha** (buckets, acesso, upload)
3. **Compare logs** entre usuário e empresa
4. **Ajuste configurações** baseado nos resultados

## Arquivos Modificados
- ✅ `utils/supabase-sdk.ts` - Logs e diagnóstico
- ✅ `components/releaseModal.tsx` - Integração diagnóstico
- ✅ Compilação testada e funcionando

---

**Execute o teste e me mande os logs do console para identificarmos exatamente onde está o problema!**