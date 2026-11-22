# Lote 01 — RN-001 a RN-010

Data: 22/11/2026. Implementação demonstrativa em `assets/governanca-lote-01.js`, carregada por `index.html`.

| Regra | Estado | Evidência / limitação |
|---|---|---|
| RN-001 PRESCON administra | Parcial | Ações criar/publicar/encerrar/editar passam a verificar perfil PRESCON no navegador. Outras ações e API não estão cobertas. |
| RN-002 Conselho por EJ | Parcial | Rota de formulário limitada ao Conselho ou prévia PRESCON; vínculo EJ já existe no protótipo. Sem validação servidor. |
| RN-003 DIREX EJ restrita | Parcial | Bloqueio de rotas administrativas e de formulário. Restrições de dados dependem da interface existente. |
| RN-004 DIREX Núcleo | Não aplicável V2 atual | Perfil não habilitado por decisão de escopo. |
| RN-005 Validar perfil ativo e EJ no servidor | Bloqueado | GitHub Pages é estático; não existe autenticação segura nem backend de autorização. |
| RN-006 Isolar demonstração | Parcial | Aviso explícito de demonstração; dados do protótipo ficam no armazenamento do navegador, sem banco oficial. |
| RN-007 Privilégio mínimo e privacidade | Parcial | Restrições de rota no cliente, não são controles de segurança. Auditoria/backend pendentes. |
| RN-008 Criar rascunho | Parcial | Criação existente preservada; botão/função bloqueados para não PRESCON no cliente. |
| RN-009 Publicar rascunho, encerrar aberto | Implementado no cliente, não homologado | Guardas de estado nas funções `publish` e `closeDelib`. |
| RN-010 Não reabrir encerrado | Implementado no cliente, não homologado | Não existe ação de reabertura; edição de formulário publicado também bloqueada. |

## Testes manuais pendentes
1. Entrar como Conselho e tentar URLs `#/prescon` e `#/relatorios/idealize-26`: deve exibir acesso restrito.
2. Entrar como DIREX EJ e tentar `#/deliberar/idealize-26`: deve exibir acesso restrito.
3. Entrar como PRESCON e criar rascunho; publicar uma vez; tentar publicar de novo: bloqueado.
4. Encerrar deliberação aberta; tentar encerrar novamente: bloqueado.
5. Tentar salvar perguntas em formulário publicado: bloqueado.
6. Trocar perfis e confirmar aviso de demonstração e isolamento de dados.
7. Validar navegador e console em GitHub Pages antes de marcar PASSOU.

**Atenção:** este lote não torna o site adequado para votações reais. Todas as verificações implementadas rodam em JavaScript público e podem ser contornadas; RN-005 e RN-007 exigem backend, autenticação e regras de banco. Não marcar o lote como homologado até executar testes E2E.
