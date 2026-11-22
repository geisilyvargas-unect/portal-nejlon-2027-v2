# Regras de negócio recuperadas da V1 — Portal NEJLON 2027 V2

Fonte: repositório histórico `geisilyvargas-unect/portal-nejlon-2027`, consultado em 22/11/2026. Este documento é um inventário de regras extraídas, **não uma declaração de implementação na V2**. Os estados I/P/B da especificação antiga não equivalem a homologação.

## 1. Atores e autorização
- RN-001 PRESCON administra formulários, deliberações, respostas, revisão, documentos, relatórios e demandas.
- RN-002 Conselheiro(a) delibera somente em nome de sua EJ vinculada, justifica demandas e solicita alteração de voto.
- RN-003 DIREX EJ consulta apenas dados permitidos da própria EJ, sem justificativas confidenciais ou votos individuais.
- RN-004 A V1 também tinha DIREX Núcleo com indicadores agregados, sem votos individuais de deliberações abertas. **Decisão V2 mais recente:** apenas PRESCON, Conselho e DIREX EJ; não habilitar DIREX Núcleo sem nova aprovação.
- RN-005 Perfis, EJ vinculada e situação ativa devem ser validados em cada operação sensível no servidor/banco; seleção de perfil no protótipo sem senha é apenas simulação.
- RN-006 Dados fictícios de demonstração devem ficar separados dos institucionais; ações simuladas não escrevem em banco oficial.
- RN-007 Acesso a registros pessoais deve seguir menor privilégio, trilha de auditoria e regras de privacidade.

## 2. Ciclo de vida de formulários/deliberações
- RN-008 Criar rascunho com título, descrição, público, prazo e perguntas.
- RN-009 Fluxo de estados do formulário: `draft → open → closed`; publicar apenas rascunhos, encerrar apenas abertos.
- RN-010 Não reabrir formulário encerrado sem regra institucional explícita.
- RN-011 Exigir perguntas obrigatórias e alternativas de voto válidas.
- RN-012 Deliberações de PF podem ter quantidade configurável de cenários; a interface antiga oferecia 1–5 em um fluxo, e o wizard de importação permitia até 12 sugestões de abas. **Divergência histórica a resolver antes de fixar limite na V2.**
- RN-013 Uma planilha pode sugerir cenários a revisar manualmente; aba da planilha e cenário a deliberar não são necessariamente equivalentes.
- RN-014 Projeções financeiras pessimista/realista/otimista são parâmetros de comparação, **não opções de voto**.
- RN-015 A PRESCON confere perguntas, materiais e prazo antes da publicação.
- RN-016 O material de cada cenário pode ter URL de consulta.
- RN-017 Importação fiel do XLSX (estrutura, fórmulas, cenários) era requisito planejado e não estava homologada na V1; não declarar como pronta.

## 3. Resposta e voto
- RN-018 Uma resposta vigente/aceita por EJ por formulário, com unicidade garantida inclusive em concorrência.
- RN-019 Conselheiro deve responder todos os cenários e perguntas finais obrigatórias antes de concluir envio.
- RN-020 Cinco opções oficiais: **Aprovo**, **Aprovo com sugestões**, **Aprovo com ressalvas**, **Reprovo**, **Abstenho**.
- RN-021 Aprovo e Aprovo com sugestões contam como aprovação confirmada.
- RN-022 Aprovo com ressalvas fica **pendente** até a decisão da PRESCON: ressalva aceita = aprovação; recusada = reprovação.
- RN-023 Reprovo conta como reprovação; Abstenho conta como abstenção.
- RN-024 Reprovação exige justificativa textual.
- RN-025 Aprovação com sugestões exige texto de sugestões.
- RN-026 Aprovação com ressalvas exige texto das condições/ressalvas.
- RN-027 Ao mudar a modalidade de voto, limpar campos de sugestões/ressalvas incompatíveis para não transportar manifestações indevidas.
- RN-028 O voto original e o resultado efetivo pós-análise são dados distintos; preservar ambos no relatório.
- RN-029 Alteração de voto: usuário solicita com motivo; solicitação pendente bloqueia nova solicitação; PRESCON analisa; substituição só com autorização específica.
- RN-030 A implementação antiga também previa atualização dentro do prazo em um formulário Next.js; há **conflito entre fluxos históricos** (atualização direta versus solicitação autorizada). Adotar a regra mais controlada na V2 até decisão institucional: solicitar autorização à PRESCON.
- RN-031 Após substituição autorizada, revisar novamente eventuais ressalvas; não reaproveitar automaticamente decisões anteriores.
- RN-032 Se o envio foi aceito mas a consulta posterior falhou, não incentivar reenvio que possa duplicar o voto.
- RN-033 Erro de gravação deve mostrar feedback e permitir nova tentativa segura.
- RN-034 Perguntas finais: clareza de 0 a 5, dificuldade de 0 a 5, melhorias opcionais (até 2.000 caracteres no formulário antigo).

## 4. Respostas externas e integrações
- RN-035 Resposta externa importada começa em `pending_review`, não entra automaticamente na apuração validada.
- RN-036 PRESCON identifica EJ e decide `accepted`, `duplicate` ou `rejected`.
- RN-037 Apenas respostas `accepted` entram na contagem validada.
- RN-038 Reimportação deve ser idempotente: não duplicar respostas pelo identificador de origem.
- RN-039 Importações e sincronizações devem paginar resultados, registrar erros, duplicatas e limites sem truncamento silencioso.
- RN-040 Falha em um formulário não deve interromper importação dos demais.
- RN-041 Integração Google exige OAuth e consentimento; nunca coletar senha Google nem expor tokens no frontend.
- RN-042 Integrações Google Forms, Drive, Sheets e sincronização agendada estavam parciais/bloqueadas na V1; são backlog, não funções prontas.
- RN-043 Não sobrescrever documento externo sem consentimento; respeitar tamanho e limites das APIs.

## 5. Análise da PRESCON
- RN-044 Revisar por resposta, cenário e aspecto: `rejection`, `suggestion` e `caveat`.
- RN-045 Cada aspecto possui situação `under_review`, `accepted` ou `rejected`, comentário/parecer e data de atualização.
- RN-046 Apenas a decisão de ressalva altera a contabilização do voto condicionado; sugestão não altera aprovação direta.
- RN-047 Preservar texto original da manifestação e parecer da PRESCON em campos distintos.
- RN-048 Revisões humanas e suas justificativas devem ser auditáveis.
- RN-049 Nenhuma regra automática de quórum ou aprovação institucional deve ser inventada: depende do Regimento Interno.

## 6. Relatório administrativo e publicação
- RN-050 Relatório PRESCON completo, separado da versão publicada ao Conselho.
- RN-051 Panorama: EJs cadastradas, EJs votantes, representatividade percentual e EJs pendentes.
- RN-052 Resultados **por cenário**: gráfico circular, cinco modalidades, quantidades e percentuais.
- RN-053 Mostrar aprovação direta, votos com ressalvas, aprovações confirmadas, reprovações confirmadas, ressalvas pendentes e abstenções.
- RN-054 Enquanto houver ressalvas pendentes, não apresentar contagem como consolidada.
- RN-055 Listar pontos que levaram à reprovação, sugestões e ressalvas, com EJ e parecer PRESCON no relatório administrativo.
- RN-056 Mostrar médias de clareza/dificuldade (0–5) e comentários de melhoria.
- RN-057 Listar EJs pendentes e permitir editar considerações e encaminhamentos finais da PRESCON.
- RN-058 Exportar CSV completo por resposta/cenário, incluindo voto original, justificativas, manifestações, pareceres e resultado efetivo; exportação texto/impressão.
- RN-059 Relatório publicado ao Conselho deve ser **anonimizado**, sem nomes de EJs, comentários individuais ou identidade dos votantes.
- RN-060 Publicação da versão anonimizada só após encerrar a deliberação.
- RN-061 Relatório publicado é um **snapshot imutável**; novos votos/pareceres não alteram versão já publicada. Publicar nova versão para atualizar.
- RN-062 Histórico pode armazenar deliberações consolidadas oficiais importadas, distinguindo dados históricos de respostas transacionais.
- RN-063 Relatório é informativo; validade formal e tratamento das ressalvas dependem do Regimento e de validação institucional.

## 7. Demandas (módulo adjacente)
- RN-064 Apenas PRESCON cria demandas, individualmente por EJ mesmo quando cadastradas em lote.
- RN-065 Severidade amarela/laranja/vermelha; modelos editáveis (reunião, imersão, Monday, horas, documentos).
- RN-066 Conselheiro ou DIREX EJ envia justificativa de sua EJ, com motivo, texto e comprovante HTTPS opcional.
- RN-067 Uma justificativa pendente por demanda; se recusada, pode enviar nova.
- RN-068 PRESCON aceita/recusa com explicação obrigatória; decisão atômica e auditada.
- RN-069 Aceita leva a `Justificada`; recusada preserva pendência/andamento.
- RN-070 `Concluída` e `Justificada` são estados diferentes.
- RN-071 PRESCON pode marcar em andamento, concluir ou reabrir; reabertura crítica exige motivo.
- RN-072 DIREX EJ e Conselho consultam apenas suas demandas e histórico permitido.

## 8. Gestão do Conselho (módulo adjacente)
- RN-073 Demo híbrida com agenda, formação, engajamento, acompanhamentos e encaminhamentos, isolada do banco real.
- RN-074 PRESCON gerencia dados simulados; Conselho vê e conclui apenas itens próprios; DIREX tem visão reduzida.
- RN-075 Acompanhamento individual é restrito à PRESCON.
- RN-076 Engajamento apresenta evidências, não rótulo/nota automática; ausência isolada não caracteriza desengajamento.
- RN-077 Eventos da demonstração não criam obrigações reais; reinício apaga apenas dados fictícios.
- RN-078 Recursos reais seguem autorização do destino, independentemente do seletor de perfil.

## 9. Requisitos transversais
- RN-079 HTTPS; autenticação/autorização no servidor e banco; não confiar apenas em botões ocultos.
- RN-080 Índices únicos e transações para evitar duplicatas e decisões parciais.
- RN-081 Auditoria de autor, ação, momento e motivo.
- RN-082 Relatórios/exportações paginados, sem perda silenciosa de registros.
- RN-083 Estados incompatíveis, arquivos inválidos e entradas incorretas devem ser rejeitados com feedback.
- RN-084 Navegação responsiva, teclado, foco visível, rótulos e contraste; auditar WCAG 2.2 AA.
- RN-085 Dados pessoais minimizados e retenção/acesso sujeitos a política LGPD.
- RN-086 Não considerar requisito implementado apenas por existir código; homologar com testes.
- RN-087 Não promover dados de teste a dados oficiais.

## 10. Decisões da V2 mais recentes (não são regras históricas)
- V2-01 Login demonstrativo sem senha: escolher `prescon`, `conselhoej` ou `direxej`; **não é autenticação segura**.
- V2-02 Conselho delibera; PRESCON administra; DIREX EJ **só consulta se sua própria EJ deliberou**, não vê demandas nem votos nesta experiência de deliberação.
- V2-03 Formulário participante e relatório em URLs independentes; PRESCON edita modelo institucional e pode pré-visualizar participante.
- V2-04 XLSX original deve ser acessível no formulário; a extração de cenários e comparações precisa ser conferida antes de publicar.
- V2-05 Reaproveitar experiência visual e organização completa do relatório web V1.
- V2-06 GitHub Pages é protótipo público; **não usar votos reais, dados pessoais ou informações sigilosas** sem backend/autenticação adequados.

## Fontes diretas consultadas
- `docs/REQUISITOS-ENGENHARIA-REVERSA.md`
- `docs/HOMOLOGACAO-24-11-2026.md`
- `docs/SISTEMA-DE-DEMANDAS.md`
- `docs/MODULO-07-GESTAO-CONSELHO.md`
- `portal-nejlon-2027/lib/constants.ts`
- `portal-nejlon-2027/lib/vote-rules.ts`
- `portal-nejlon-2027/lib/deliberation-form.ts`
- `portal-nejlon-2027/components/deliberation-response-form.tsx`
- `portal-nejlon-2027/components/pf-deliberation-wizard.tsx`
- `portal-nejlon-2027/app/(portal)/relatorios/[id]/page.tsx`
- `tests/vote-lifecycle.test.cjs`

**Observação:** inventário amplo das regras documentadas e dos fluxos centrais inspecionados; não é prova de que todos os comportamentos da V1 estavam funcionais em produção, nem auditoria exaustiva de cada arquivo do repositório.
