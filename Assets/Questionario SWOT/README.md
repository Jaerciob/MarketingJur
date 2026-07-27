# Diagnóstico Estratégico — Ambiente Interno (Análise SWOT) para Escritórios de Advocacia

## 🎯 Objetivo do Projeto

Ferramenta web interativa para conduzir, em até 5 minutos, um **diagnóstico do Ambiente Interno** de um escritório de advocacia, subsidiando a etapa de **Pontos Fortes e Pontos Fracos** de uma Análise SWOT. O questionário avalia a maturidade do escritório em **7 dimensões estratégicas**, gera automaticamente médias, classificações, gráficos, pontos fortes/fracos, comentários estratégicos, recomendações e um resumo executivo — sem jargões acadêmicos, pensado para sócios de escritórios.

## ✅ Funcionalidades implementadas

- **Tela de identificação**: nome do escritório e nome/cargo do respondente.
- **Questionário de 7 dimensões**, cada uma com 3–4 afirmações em escala Likert de 1 a 5:
  1. Especialização e Posicionamento
  2. Relacionamento com Clientes
  3. Autoridade e Marca
  4. Gestão e Rentabilidade
  5. Eficiência Operacional
  6. Inovação e Tecnologia
  7. Crescimento e Estratégia
- **3 perguntas abertas finais**: diferenciais, desafios internos e prioridade de melhoria em 12 meses.
- **Barra de progresso** em tempo real (respostas dadas / total).
- **Cálculo automático**:
  - Média por dimensão.
  - Classificação de maturidade (Excelente, Forte, Estável, Atenção, Ponto Fraco Crítico), com as faixas exatamente conforme especificado (4,5–5,0 / 3,8–4,4 / 3,0–3,7 / 2,0–2,9 / 1,0–1,9).
  - Nível geral de maturidade em escala de **0 a 100**.
- **Geração automática de**:
  - Gráfico radar (Chart.js) com as 7 dimensões.
  - Tabela de médias e classificação por dimensão (com cores).
  - Top 5 Pontos Fortes e Top 5 Pontos Fracos (com base nas afirmações individuais mais/menos pontuadas).
  - Comentários estratégicos e impacto na competitividade, por dimensão.
  - Recomendações iniciais de melhoria, por dimensão.
  - As 3 prioridades estratégicas para os próximos 90 dias (as 3 dimensões com pior desempenho).
  - Exibição das respostas abertas no relatório final.
- **Exportação/impressão** do relatório (botão "Imprimir / Exportar PDF" usa a impressão nativa do navegador).
- **Persistência dos resultados**: botão "Salvar resultado" grava o diagnóstico completo na tabela `diagnosticos_swot` via RESTful Table API, permitindo histórico de diagnósticos por escritório.
- **Botão "Novo diagnóstico"** para reiniciar o processo.
- Layout **responsivo**, com identidade visual sóbria/corporativa (azul-marinho + dourado), tipografia `Inter` + `Lora`, ícones Font Awesome.

## 🗂️ Estrutura de arquivos

```
index.html          → página única com as 3 telas (intro, quiz, resultados)
css/style.css        → estilos completos (responsivo, cores por classificação, impressão)
js/data.js            → dados estruturados: dimensões, afirmações, escala, faixas de classificação,
                        comentários/impactos/recomendações por dimensão e grupo de resultado
js/app.js             → lógica da aplicação: renderização dinâmica, cálculo de médias,
                        geração do relatório, gráfico radar, persistência via API
```

## 🔗 Entrada funcional (URI)

- `index.html` — página única (Single Page Application simples, sem parâmetros de URL). Todo o fluxo (identificação → questionário → resultado) ocorre na mesma página, controlado por JavaScript.

## 🗄️ Modelo de dados (armazenamento)

Tabela `diagnosticos_swot` (via RESTful Table API — `tables/diagnosticos_swot`):

| Campo | Tipo | Descrição |
|---|---|---|
| `id` | text | Identificador único (gerado automaticamente) |
| `nome_escritorio` | text | Nome do escritório avaliado |
| `respondente` | text | Nome/cargo de quem respondeu |
| `data_diagnostico` | datetime | Data/hora do diagnóstico |
| `respostas_json` | rich_text | JSON com todas as respostas Likert (1–5) por afirmação |
| `medias_dimensoes_json` | rich_text | JSON com média e classificação de cada uma das 7 dimensões |
| `pontuacao_geral` | number | Nível geral de maturidade (0 a 100) |
| `classificacao_geral` | text | Classificação textual do nível geral |
| `maiores_fortalezas` | rich_text | Top 5 fortalezas identificadas |
| `maiores_fragilidades` | rich_text | Top 5 fragilidades identificadas |
| `prioridades_90dias` | rich_text | 3 prioridades estratégicas recomendadas |
| `diferenciais` | rich_text | Resposta aberta: diferenciais |
| `desafios` | rich_text | Resposta aberta: desafios internos |
| `melhoria_12meses` | rich_text | Resposta aberta: área prioritária em 12 meses |

Cada envio do botão "Salvar resultado" cria um novo registro, permitindo repetir o diagnóstico periodicamente (ex.: trimestral) e comparar a evolução do escritório ao longo do tempo.

## 📐 Modelo de interpretação (implementado em `js/data.js` e `js/app.js`)

1. **Média por dimensão** = média aritmética simples das notas (1–5) das afirmações daquela dimensão.
2. **Classificação de maturidade**:
   - 4,5 a 5,0 → **Excelente** (Ponto Forte Estratégico)
   - 3,8 a 4,4 → **Forte**
   - 3,0 a 3,7 → **Estável**
   - 2,0 a 2,9 → **Atenção**
   - 1,0 a 1,9 → **Ponto Fraco Crítico**
3. **Geração automática**: pontos fortes/fracos (nível de afirmação e de dimensão), comentário estratégico por dimensão, impacto na competitividade, recomendação inicial, e as 3 prioridades de 90 dias (dimensões com pior média).
4. **Resumo executivo**: nível geral (0–100), badge de classificação geral, top 5 fortalezas, top 5 fragilidades e as 3 prioridades — tudo já reunido na tela/relatório final, pronto para impressão em PDF.

## 🚧 Funcionalidades não implementadas (fora do escopo de site estático)

- Login/autenticação de sócios ou controle de usuários.
- Comparação automática entre múltiplos diagnósticos históricos (ex.: dashboard de evolução ao longo do tempo) — atualmente os dados ficam salvos na tabela, mas não há tela de histórico/comparação.
- Geração de PDF nativo (usa-se a função de impressão do navegador, que já produz um PDF de boa qualidade via "Salvar como PDF").
- Envio automático do relatório por e-mail.
- Integração com IA para gerar comentários personalizados adicionais (os comentários atuais são baseados em regras/faixas pré-definidas).

## 🔭 Próximos passos recomendados

1. Criar uma **tela de histórico** que liste diagnósticos salvos (via `GET tables/diagnosticos_swot`) e compare a evolução do escritório entre diagnósticos.
2. Adicionar **exportação de PDF customizada** (ex.: com biblioteca client-side como `jsPDF`) para um layout de relatório ainda mais elaborado.
3. Permitir **múltiplos respondentes** por escritório (ex.: cada sócio responde e o sistema calcula uma média consolidada), útil para eliminar viés individual.
4. Adicionar módulo complementar de **Ambiente Externo (Oportunidades e Ameaças)** para completar a Matriz SWOT integralmente.

## 🖌️ Bibliotecas utilizadas (via CDN)

- **Chart.js** — gráfico radar de maturidade por dimensão.
- **Font Awesome 6** — iconografia.
- **Google Fonts** (`Inter` + `Lora`) — tipografia.

## 🌐 URL pública

Para publicar e obter o link ao vivo, utilize a aba **Publish** do ambiente — ela cuidará de todo o processo de deploy automaticamente.
