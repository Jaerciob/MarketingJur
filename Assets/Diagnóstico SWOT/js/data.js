/* ======================================================================
   DADOS DO DIAGNÓSTICO ESTRATÉGICO – AMBIENTE INTERNO (SWOT)
   Escritórios de Advocacia
   ====================================================================== */

// Escala Likert padrão
const ESCALA_LIKERT = [
  { valor: 1, label: 'Discordo totalmente' },
  { valor: 2, label: 'Discordo parcialmente' },
  { valor: 3, label: 'Neutro' },
  { valor: 4, label: 'Concordo' },
  { valor: 5, label: 'Concordo totalmente' }
];

// As 7 dimensões estratégicas, cada uma com 3-4 afirmações
const DIMENSOES = [
  {
    id: 'especializacao',
    numero: 1,
    nome: 'Especialização e Posicionamento',
    icone: 'fa-bullseye',
    descricao: 'Nicho definido, diferenciação e clareza estratégica.',
    itens: [
      { id: 'esp1', texto: 'Nosso escritório tem uma área de atuação (nicho) clara e bem definida.' },
      { id: 'esp2', texto: 'Sabemos exatamente o que nos diferencia dos concorrentes.' },
      { id: 'esp3', texto: 'Nossos clientes entendem facilmente qual é a nossa especialidade.' },
      { id: 'esp4', texto: 'Recusamos ou evitamos casos que não se encaixam no nosso posicionamento estratégico.' }
    ],
    comentarios: {
      positivo: 'O escritório tem um posicionamento claro, o que funciona como vantagem competitiva relevante, facilitando a atração de clientes ideais e a precificação diferenciada dos serviços.',
      neutro: 'O posicionamento existe, mas ainda não está totalmente consolidado. Há espaço para tornar o nicho mais evidente na comunicação e na seleção de casos.',
      negativo: 'A falta de um posicionamento claro dificulta a diferenciação frente à concorrência, tornando o escritório mais vulnerável à disputa por preço.'
    },
    impacto: 'O posicionamento é a base da estratégia comercial: escritórios especializados cobram mais, são lembrados com mais facilidade e sofrem menos com concorrência por preço.',
    recomendacoes: {
      positivo: 'Reforçar a comunicação da especialização em todos os canais e explorar novas frentes dentro do nicho já consolidado.',
      neutro: 'Definir com mais clareza os critérios de aceitação de casos e alinhar a comunicação externa ao nicho escolhido.',
      negativo: 'Priorizar a definição de um nicho ou público prioritário nos próximos meses, revisando o portfólio de serviços oferecidos.'
    }
  },
  {
    id: 'relacionamento',
    numero: 2,
    nome: 'Relacionamento com Clientes',
    icone: 'fa-handshake',
    descricao: 'Fidelização, experiência do cliente, indicações e qualidade do relacionamento.',
    itens: [
      { id: 'rel1', texto: 'Mantemos contato próximo e constante com nossos clientes.' },
      { id: 'rel2', texto: 'A maioria dos nossos novos clientes chega por indicação.' },
      { id: 'rel3', texto: 'Temos um processo estruturado para ouvir a satisfação dos clientes.' },
      { id: 'rel4', texto: 'Nossos clientes renovam ou voltam a contratar nossos serviços.' }
    ],
    comentarios: {
      positivo: 'O relacionamento próximo com os clientes gera fidelização e um fluxo consistente de indicações, reduzindo a dependência de investimentos em captação.',
      neutro: 'O relacionamento com os clientes é adequado, mas ainda depende de iniciativas pontuais, sem um processo estruturado de acompanhamento.',
      negativo: 'A fragilidade no relacionamento com clientes aumenta o risco de perda de contratos e reduz a geração de indicações, prejudicando o crescimento orgânico.'
    },
    impacto: 'Clientes bem atendidos indicam, renovam contratos e toleram melhor eventuais falhas. É um dos fatores mais baratos e eficazes de crescimento.',
    recomendacoes: {
      positivo: 'Formalizar um programa de relacionamento (pesquisas de satisfação periódicas, encontros anuais) para sustentar o nível de excelência.',
      neutro: 'Criar um processo simples de acompanhamento pós-serviço e pesquisa de satisfação recorrente.',
      negativo: 'Implementar imediatamente um canal estruturado de escuta e acompanhamento de clientes, com responsável definido.'
    }
  },
  {
    id: 'autoridade',
    numero: 3,
    nome: 'Autoridade e Marca',
    icone: 'fa-award',
    descricao: 'Reputação, presença digital, produção de conteúdo e reconhecimento da marca.',
    itens: [
      { id: 'aut1', texto: 'Nosso escritório é reconhecido como referência na área em que atua.' },
      { id: 'aut2', texto: 'Produzimos conteúdo (artigos, posts, palestras) que fortalece nossa marca.' },
      { id: 'aut3', texto: 'Temos presença digital ativa e profissional (site, redes sociais, LinkedIn).' },
      { id: 'aut4', texto: 'Somos frequentemente lembrados ou indicados quando o assunto é nossa especialidade.' }
    ],
    comentarios: {
      positivo: 'A marca do escritório já é reconhecida como referência, o que reduz o esforço de vendas e fortalece o poder de precificação.',
      neutro: 'Existem iniciativas de construção de marca, mas ainda de forma pontual e pouco consistente ao longo do tempo.',
      negativo: 'A baixa visibilidade da marca limita o reconhecimento do escritório no mercado, tornando a captação mais dependente do esforço individual dos sócios.'
    },
    impacto: 'Marca e autoridade reduzem o ciclo de vendas, aumentam a conversão de propostas e sustentam honorários mais altos.',
    recomendacoes: {
      positivo: 'Ampliar a presença em veículos de imprensa especializada e eventos do setor para consolidar a autoridade já construída.',
      neutro: 'Estabelecer um calendário regular de conteúdo (artigos, posts, palestras) para fortalecer a presença de marca.',
      negativo: 'Iniciar a construção de presença digital básica (site atualizado, LinkedIn ativo) como prioridade de curto prazo.'
    }
  },
  {
    id: 'gestao',
    numero: 4,
    nome: 'Gestão e Rentabilidade',
    icone: 'fa-chart-line',
    descricao: 'Planejamento, indicadores, gestão financeira e capacidade de geração de lucro.',
    itens: [
      { id: 'ges1', texto: 'Temos metas financeiras claras e acompanhamos indicadores de resultado.' },
      { id: 'ges2', texto: 'Sabemos qual é a rentabilidade de cada área ou cliente do escritório.' },
      { id: 'ges3', texto: 'Temos planejamento orçamentário e fluxo de caixa organizados.' },
      { id: 'ges4', texto: 'A distribuição de lucros e custos entre os sócios é clara e sustentável.' }
    ],
    comentarios: {
      positivo: 'A gestão financeira estruturada permite decisões rápidas e seguras, sustentando a rentabilidade e a saúde financeira no longo prazo.',
      neutro: 'Existem alguns controles financeiros, mas as decisões ainda são pouco baseadas em indicadores consistentes.',
      negativo: 'A ausência de controle financeiro e de indicadores de rentabilidade é um risco relevante, podendo comprometer a sustentabilidade do negócio.'
    },
    impacto: 'Sem gestão financeira e indicadores claros, o escritório opera "no escuro", dificultando decisões estratégicas e o crescimento sustentável.',
    recomendacoes: {
      positivo: 'Avançar para relatórios gerenciais mensais e análise de rentabilidade por área e por cliente.',
      neutro: 'Implementar indicadores financeiros básicos (faturamento, custos, margem) com acompanhamento mensal.',
      negativo: 'Estruturar com urgência um controle financeiro básico e um fluxo de caixa, com apoio de um profissional de gestão/financeiro.'
    }
  },
  {
    id: 'eficiencia',
    numero: 5,
    nome: 'Eficiência Operacional',
    icone: 'fa-gears',
    descricao: 'Organização dos processos, produtividade, delegação, padronização e cumprimento de prazos.',
    itens: [
      { id: 'efi1', texto: 'Nossos processos internos são padronizados e documentados.' },
      { id: 'efi2', texto: 'Cumprimos prazos processuais e compromissos com consistência.' },
      { id: 'efi3', texto: 'Há delegação eficiente de tarefas entre sócios, advogados e equipe de apoio.' },
      { id: 'efi4', texto: 'Usamos indicadores de produtividade para acompanhar o desempenho da equipe.' }
    ],
    comentarios: {
      positivo: 'Processos padronizados e bem delegados aumentam a capacidade produtiva do escritório sem exigir crescimento proporcional da equipe.',
      neutro: 'Os processos funcionam, mas dependem fortemente de pessoas específicas, com pouca padronização documentada.',
      negativo: 'A baixa padronização operacional gera retrabalho, riscos de prazo e sobrecarga dos sócios, limitando a capacidade de crescimento.'
    },
    impacto: 'Eficiência operacional impacta diretamente a rentabilidade e a capacidade de atender mais clientes com a mesma equipe.',
    recomendacoes: {
      positivo: 'Automatizar etapas já padronizadas e criar indicadores de produtividade por equipe.',
      neutro: 'Documentar os principais processos e definir responsáveis claros por cada etapa.',
      negativo: 'Mapear e padronizar os processos críticos (prazos, atendimento, entrega) como prioridade imediata.'
    }
  },
  {
    id: 'inovacao',
    numero: 6,
    nome: 'Inovação e Tecnologia',
    icone: 'fa-microchip',
    descricao: 'Uso de softwares jurídicos, automação, Inteligência Artificial e cultura de inovação.',
    itens: [
      { id: 'ino1', texto: 'Utilizamos softwares jurídicos para gestão de processos e prazos.' },
      { id: 'ino2', texto: 'Já incorporamos Inteligência Artificial ou automação em tarefas do dia a dia.' },
      { id: 'ino3', texto: 'Existe uma cultura aberta à inovação e à experimentação de novas ferramentas.' }
    ],
    comentarios: {
      positivo: 'O uso avançado de tecnologia e IA gera ganhos de produtividade e posiciona o escritório como inovador diante de clientes e concorrentes.',
      neutro: 'Há uso de tecnologia básica, mas ainda pouca exploração de automação e Inteligência Artificial no dia a dia.',
      negativo: 'A baixa adoção tecnológica coloca o escritório em desvantagem competitiva frente a concorrentes mais digitalizados.'
    },
    impacto: 'Tecnologia e IA reduzem custos operacionais e liberam tempo dos advogados para atividades estratégicas e de maior valor.',
    recomendacoes: {
      positivo: 'Explorar novos casos de uso de IA generativa em pesquisa, redação e atendimento ao cliente.',
      neutro: 'Testar ferramentas de automação e IA em tarefas repetitivas (triagem de documentos, redação de peças simples).',
      negativo: 'Adotar um software jurídico de gestão de processos e prazos como primeiro passo de digitalização.'
    }
  },
  {
    id: 'crescimento',
    numero: 7,
    nome: 'Crescimento e Estratégia',
    icone: 'fa-arrow-trend-up',
    descricao: 'Visão de longo prazo, capacidade de expansão, adaptação ao mercado e desenvolvimento do negócio.',
    itens: [
      { id: 'cre1', texto: 'Temos um planejamento estratégico formal, com metas de curto e longo prazo.' },
      { id: 'cre2', texto: 'Monitoramos ativamente o mercado e a concorrência.' },
      { id: 'cre3', texto: 'Temos capacidade e estrutura para crescer (novos sócios, unidades, áreas de atuação).' },
      { id: 'cre4', texto: 'Nos adaptamos rapidamente a mudanças no mercado jurídico.' }
    ],
    comentarios: {
      positivo: 'O planejamento estratégico consistente permite crescimento sustentável e rápida adaptação a mudanças de mercado.',
      neutro: 'Existe alguma visão de futuro, mas o planejamento ainda não é formalizado nem revisado periodicamente.',
      negativo: 'A ausência de planejamento estratégico formal aumenta o risco de decisões reativas e limita a capacidade de crescimento.'
    },
    impacto: 'Escritórios com planejamento estratégico claro crescem de forma mais previsível e se adaptam melhor a crises e oportunidades de mercado.',
    recomendacoes: {
      positivo: 'Revisar o planejamento estratégico anualmente e formalizar metas de expansão (novas áreas, sócios, unidades).',
      neutro: 'Formalizar um planejamento estratégico simples, com metas para os próximos 12 meses.',
      negativo: 'Realizar com urgência um planejamento estratégico básico, definindo prioridades para os próximos 90 dias.'
    }
  }
];

// Perguntas abertas finais
const PERGUNTAS_ABERTAS = [
  { id: 'diferenciais', label: 'Quais são os três maiores diferenciais do escritório?' },
  { id: 'desafios', label: 'Quais são os três principais desafios internos?' },
  { id: 'melhoria', label: 'Se pudesse melhorar apenas uma área do escritório nos próximos 12 meses, qual seria?' }
];

// Faixas de classificação de maturidade
const FAIXAS_CLASSIFICACAO = [
  { min: 4.5, max: 5.001, label: 'Excelente', sub: 'Ponto Forte Estratégico', cor: '#15803d', bg: '#dcfce7', grupo: 'positivo' },
  { min: 3.8, max: 4.5, label: 'Forte', sub: '', cor: '#22c55e', bg: '#eafff0', grupo: 'positivo' },
  { min: 3.0, max: 3.8, label: 'Estável', sub: '', cor: '#b45309', bg: '#fef9c3', grupo: 'neutro' },
  { min: 2.0, max: 3.0, label: 'Atenção', sub: '', cor: '#c2410c', bg: '#ffedd5', grupo: 'negativo' },
  { min: 1.0, max: 2.0, label: 'Ponto Fraco Crítico', sub: '', cor: '#b91c1c', bg: '#fee2e2', grupo: 'negativo' }
];

function classificarMedia(media) {
  for (const faixa of FAIXAS_CLASSIFICACAO) {
    if (media >= faixa.min && media <= faixa.max) return faixa;
  }
  // fallback (medias abaixo de 1 não deveriam ocorrer)
  return FAIXAS_CLASSIFICACAO[FAIXAS_CLASSIFICACAO.length - 1];
}
