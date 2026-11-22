# Plano de implementação integral RN-001–RN-087 — 22/11/2026

**Status geral: NÃO HOMOLOGADO.** Inventário fonte: `docs/REGRAS_DE_NEGOCIO_V1_RECUPERADAS.md`. A existência de código não é prova de cumprimento. Não utilizar o GitHub Pages para deliberações oficiais, dados pessoais reais ou informações sigilosas.

## Entregue nesta rodada (implementação parcial)
- RN-021–028, RN-044–048, RN-050–061: módulo `assets/governanca-relatorios-v1.js` implementa classificação de votos, contagem por cenário, pendências de ressalvas, análise PRESCON já existente, CSV administrativo e publicação manual de snapshot anonimizado após encerramento. Os pareceres continuam em armazenamento local; não são auditáveis institucionalmente.
- RN-029–031: solicitação de alteração com motivo, decisão PRESCON e registro demonstrativo de auditoria. **Substituição efetiva após autorização NÃO implementada**; o voto continua bloqueado. Não declarar fluxo completo.
- RN-034 e RN-056: médias das respostas de clareza e dificuldade e comentários de melhoria, a depender da estrutura da deliberação.
- RN-059–061: relatório público oculto até publicação após encerramento; snapshot HTML congelado por versão no navegador.
- RN-051–055 e RN-058: contagens e percentuais por cenário, CSV administrativo e manifestações. **Gráfico circular e paginação ainda pendentes.**
- RN-011–020: fluxo anterior permanece, com visualizador de XLSX e formulário unificado; importação fiel e unicidade global não homologadas.

## Matriz por grupos
| Regras | Estado | Pendência principal |
|---|---|---|
| RN-001–010 | Parcial | Perfis e permissões são demonstrativos, não autenticação |
| RN-011–020 | Parcial | XLSX completo, normalização oficial dos rótulos, transações e testes E2E |
| RN-021–028 | Parcial | Apuração e revisão em backend e testes de todas as modalidades |
| RN-029–034 | Parcial | Substituição autorizada do voto, controle de revisão e testes |
| RN-035–043 | Não implementado integralmente | Importações externas, OAuth Google, idempotência e sincronização |
| RN-044–049 | Parcial | Pareceres por aspecto, auditoria confiável e validação regimental |
| RN-050–063 | Parcial | Gráficos, exportação completa, relatórios versionados em servidor e homologação |
| RN-064–072 | Pendente | Módulo de demandas com fluxos e permissões reais |
| RN-073–078 | Pendente | Gestão do Conselho híbrida com evidências e segregação de dados |
| RN-079–087 | Pendente | Backend, autenticação, índices, transações, LGPD, WCAG e testes |

## Decisões preservadas
- PRESCON administra o núcleo; Conselho vota em nome da EJ; DIREX EJ consulta somente o permitido.
- Alteração de voto apenas após autorização expressa da PRESCON; sem edição direta.
- Projeções pessimista/realista/otimista não são opções de voto.
- Não inventar quórum ou aprovação institucional.
- Os rótulos oficiais são **Aprovo**, **Aprovo com sugestões**, **Aprovo com ressalvas**, **Reprovo**, **Abstenho**. Parte do frontend ainda usa variantes legadas, a normalizar antes da homologação.

## Testes e arquitetura necessários
1. Validar sintaxe e execução de todos os scripts na página publicada.
2. Testar criação, importação, publicação, preenchimento, revisão, relatórios e exportação em perfis separados.
3. Migrar para backend autenticado com banco de dados (unicidade EJ/deliberação), storage do XLSX e trilha de auditoria transacional.
4. Implementar módulos de demandas e gestão do Conselho, além de importação externa e integração Google com OAuth.
5. Homologar cada RN com evidência e critérios de aceite; **nenhuma RN está homologada nesta rodada**.

Commits desta rodada: `ec2c7ed1`, `c7457a99`, `8052aa4a`.
