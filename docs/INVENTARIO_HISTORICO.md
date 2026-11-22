# Inventário histórico — Portal NEJLON 2027

> Documento de referência da V2. Não representa funcionalidades já implementadas na V2.

## Fonte preservada
- Repositório V1: https://github.com/geisilyvargas-unect/portal-nejlon-2027
- Histórico de commits da V1: https://github.com/geisilyvargas-unect/portal-nejlon-2027/commits/main
- A V2 é um recomeço independente; não copiar a implementação ou os estilos sem revisão.

## Objetivo
Portal de deliberações e governança do NEJ Londrina para 2027, com demonstração interativa e eventual evolução para uso institucional.

## Funcionalidades e requisitos levantados anteriormente
- Autenticação e perfis: PRESCON, Diretoria Executiva das EJs e Conselho; acessos demonstrativos por EJ, sujeitos a revisão antes do uso real.
- Deliberações: criação, cenários, perguntas independentes, votação, ressalvas, sugestões, acompanhamento de respostas, pendências e relatórios.
- Planejamento Financeiro (PF): importação e visualização por abas do XLSX original, preservação do arquivo intacto, leitura de CSV, gráficos e interpretações, exportação e relatórios.
- Gestão do Conselho: jornada, formação, pessoas, acompanhamento e demonstração interativa.
- Rede: cadastro/visão das EJs, indicadores de participação, mapa de calor e perfis.
- Outras ideias exploradas: demandas, calendário institucional, automações, fiscalização e páginas institucionais.

## Aprendizados e decisões para a V2
1. Definir requisitos e arquitetura antes da implementação.
2. Estabelecer uma identidade visual única e reutilizável, evitando folhas CSS sucessivas e conflitantes.
3. Não reduzir módulos nem alterar escopo sem decisão explícita.
4. Distinguir dados simulados de registros reais e autenticação de demonstração de autenticação segura.
5. Construir por módulos e validar fluxos completos antes de avançar.
6. Preservar modelos, planilhas e anexos originais fora do código quando necessário.

## Marcos históricos de código
- V1 antes da simplificação MVP: commit `bd03279b367d23f106ab8ac2f80e8b30cfb7e3c9`.
- Simplificações de navegação: `a45330afdacbf10d4e48730d5615ba21a8b289eb` e `8e7e18f0610039d37e4c2363e9289b44966a43ac`.
- Restauração de funcionalidades: `1f72631037e9b242e3aef90997c9f48c29113099` e `615700b55b32d5a7d3a52e1c9cd5bd93571ba95d`.
- A V1 contém também diversas alterações posteriores de estética, cuja adoção na V2 precisa ser decidida do zero.

## Pendências
- Consolidar anexos externos e modelos originais quando disponíveis.
- Revalidar escopo, permissões, entidades e critérios de aceite de cada módulo.
- Escolher identidade visual e stack da V2.
- Definir estratégia de dados e implantação sem depender de dados locais para uso multiusuário.
