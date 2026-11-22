# Lote 02 — RN-011 a RN-020 (22/11/2026)

Implementação demonstrativa: `assets/regras-lote-02.js`, ativada por `index.html`. Commit de ativação `db6ed089`, padronização de votos `d451218e`.

| Regra | Estado | Implementação e limitação |
|---|---|---|
| RN-011 | Parcial | Editor exige pergunta de voto obrigatória e valida tipos; participante valida obrigatoriedade. Não homologado E2E. |
| RN-012 | Parcial | PRESCON pode adicionar/remover cenários até 12; **12 é limite operacional provisório**, não decisão institucional sobre divergência V1 5/12. |
| RN-013 | Parcial | Sugestão de cenários a partir dos nomes das abas importadas, com revisão/edição manual; não há inferência semântica confiável de cenários. |
| RN-014 | Parcial | Campos separados pessimista/realista/otimista como referências, nunca opções de voto. Comparação quantitativa estruturada ainda limitada. |
| RN-015 | Parcial | Publicação de rascunho exige prazo futuro, perguntas válidas, cenários nomeados e confirmação PRESCON. Ainda sem validação institucional/backend. |
| RN-016 | Parcial | Cada cenário tem URL HTTPS de material e link para participante. A URL não é verificada quanto à disponibilidade/segurança do conteúdo. |
| RN-017 | Parcial, **não homologado** | Leitura de abas e detecção de células com fórmulas via biblioteca XLSX; tentativa de preservar arquivo original em localStorage (até 15 MB de entrada, sujeito à cota do navegador). Não há garantia de persistência entre dispositivos, recálculo, estilos na prévia ou equivalência da importação. O arquivo original é preservado como bytes no navegador quando a gravação é bem-sucedida; não declarar fidelidade integral da visualização. |
| RN-018 | Parcial | Checagem de resposta existente por EJ na sessão e no navegador; **não garante unicidade concorrente, nem entre navegadores** sem backend e índice único. |
| RN-019 | Parcial | Voto obrigatório em cada cenário configurado, justificativa quando aplicável, além das perguntas obrigatórias do formulário. Não homologado E2E. |
| RN-020 | Parcial | Lista de opções padronizada no formulário: Aprova, Aprova com sugestões, Aprova com ressalvas, Reprova, Abstenho. Dados históricos demonstrativos ainda usam nomes legados; relatórios precisam de migração/normalização. |

## Testes necessários
1. Entrar como PRESCON; criar um rascunho; acessar editor e gestão; configurar cenários, prazo futuro e materiais.
2. Tentar publicar sem confirmação, sem prazo e com cenário sem nome: deve bloquear.
3. Enviar XLSX válido e verificar abas sugeridas, contagem de fórmulas e download do arquivo original **no mesmo navegador**; comparar hash do original baixado com arquivo fonte.
4. Editar manualmente cenário sugerido e confirmar que não há equivalência automática aba = cenário.
5. Entrar como Conselho e preencher todas as votações por cenário; testar rejeição, sugestão e ressalva sem justificativa.
6. Verificar as cinco opções e a ausência de projeções financeiras entre elas.
7. Tentar enviar novamente pela mesma EJ; conferir bloqueio.
8. Verificar relatório: a apuração específica dos cenários ainda precisa integrar `scenarioVotes` e `scenarioManif` (pendência conhecida).
9. Testar comportamento com arquivo grande, cota de armazenamento esgotada e páginas em navegadores distintos.
10. Conferir console e fluxo real no GitHub Pages; até lá **não marcar nenhuma regra como homologada**.

## Limitações críticas
- GitHub Pages é frontend estático: nenhuma autorização real da PRESCON, unicidade global, sincronização de votos ou integridade transacional.
- As respostas do Conselho e os arquivos originais ficam no navegador local, não são compartilhados com a PRESCON em outro computador.
- Para uso oficial são necessários backend, autenticação, banco com unicidade, storage e testes automatizados.
- O lote 02 não implementa o fluxo de autorização para substituir voto; continua bloqueada a alteração direta conforme decisão institucional.
