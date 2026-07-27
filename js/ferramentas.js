/* ===================================
   Ferramentas de Planejamento - JS
   Marketing Jur
   =================================== */

// ─── TOAST ───────────────────────────────────────────────────────────────────
function showToast(msg, icon = 'fa-check-circle') {
    const t = document.getElementById('toast');
    t.innerHTML = `<i class="fas ${icon}"></i> ${msg}`;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ─── TABS ────────────────────────────────────────────────────────────────────
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ─── BIBLIOTECA DE PROMPTS ──────────────────────────────────────────────────
const PROMPT_PROFILE_KEY = 'mktjur_prompt_profile';
let activePromptTemplate = 'pestel';

const promptTemplates = {
    pestel: `Você é um consultor estratégico sênior especializado em gestão de escritórios de advocacia e inteligência de mercado no setor jurídico brasileiro. Realize uma pesquisa e análise detalhada do Macroambiente utilizando a ferramenta PESTEL (Político, Econômico, Social, Tecnológico, Ecológico/Ambiental e Legal), aplicada ao seguinte perfil de escritório:

{{perfil}}

INSTRUÇÕES DE ANÁLISE
Para CADA uma das 6 dimensões do PESTEL, estruture a resposta com:
1. TENDÊNCIAS PRINCIPAIS (3 a 5 pontos)
   - Fatos e movimentos observáveis no macroambiente, com dados ou fontes de referência sempre que possível.
2. OPORTUNIDADES
   - Como essas tendências podem ser convertidas em vantagem competitiva para o escritório, considerando seu perfil específico (áreas de atuação, clientes e diferenciais).
3. RISCOS/AMEAÇAS
   - Impactos negativos potenciais sobre a operação, o faturamento, a reputação ou a conformidade do escritório.
4. AÇÕES PRIORITÁRIAS PARA OS PRÓXIMOS 90 DIAS
   - De 2 a 4 ações concretas, específicas e executáveis (não genéricas), indicando responsável sugerido (sócio, marketing, jurídico, TI etc.) e critério de sucesso mensurável.

FORMATO DE SAÍDA
- Utilize tabelas ou tópicos claros para cada dimensão.
- Ao final, inclua um QUADRO-RESUMO consolidando as 5 ações mais críticas e urgentes (priorizadas por impacto x esforço) para os próximos 90 dias, conectadas diretamente ao objetivo estratégico informado.
- Sempre que fizer alguma constatação de tendência ou dado de mercado, sinalize se é baseado em pesquisa atual ou em conhecimento geral, para permitir validação posterior.`,
    competitiva: `Você é um consultor de estratégia e inteligência competitiva especializado no mercado jurídico brasileiro. Realize uma análise competitiva prática para o perfil de escritório abaixo.

{{perfil}}

INSTRUÇÕES DE ANÁLISE
1. Defina os concorrentes diretos, indiretos e substitutos que o escritório deve monitorar, considerando suas áreas de atuação, alcance e perfil de clientes.
2. Identifique de 5 a 8 critérios de comparação relevantes, como posicionamento, especialização, serviços, jornada do cliente, presença digital, autoridade, preço percebido, tecnologia e atendimento.
3. Apresente hipóteses de diferenciação defensável, conectando os diferenciais atuais ao objetivo estratégico.
4. Aponte lacunas competitivas, riscos de comoditização e oportunidades de nicho.
5. Recomende 5 ações para os próximos 90 dias, com responsável sugerido, prazo e métrica de sucesso.

FORMATO DE SAÍDA
- Organize em tabelas ou tópicos claros.
- Diferencie fatos que exigem pesquisa atual de hipóteses estratégicas a validar.
- Priorize recomendações viáveis e compatíveis com as regras de publicidade da OAB.`,
    swot: `Você é um consultor estratégico especializado em escritórios de advocacia. Elabore uma Matriz SWOT aprofundada e acionável para o perfil abaixo.

{{perfil}}

INSTRUÇÕES DE ANÁLISE
1. Liste de 5 a 7 FORÇAS internas que podem ser alavancadas.
2. Liste de 5 a 7 FRAQUEZAS internas que limitam crescimento, eficiência ou posicionamento.
3. Liste de 5 a 7 OPORTUNIDADES externas relevantes no mercado jurídico brasileiro.
4. Liste de 5 a 7 AMEAÇAS externas que podem afetar receita, reputação, operação ou conformidade.
5. Crie estratégias FO, FA, WO e WT, conectando os elementos da matriz ao objetivo estratégico informado.
6. Defina um plano de 90 dias com as 5 ações de maior impacto, responsável, indicador de sucesso e prioridade por impacto x esforço.

FORMATO DE SAÍDA
- Apresente primeiro uma matriz em tabela e depois as estratégias cruzadas.
- Sinalize claramente o que depende de pesquisa atual de mercado ou validação interna.
- Considere as regras éticas da OAB em toda recomendação de marketing e captação.`,
    branding: `Você é um estrategista de marca especializado em posicionamento de escritórios de advocacia no Brasil. Desenvolva uma base estratégica de branding para o perfil abaixo.

{{perfil}}

INSTRUÇÕES DE ANÁLISE
1. Defina propósito, visão e valores de marca coerentes com o perfil e o objetivo estratégico.
2. Delimite público prioritário, dores, necessidades, contexto de decisão e percepção desejada.
3. Proponha um posicionamento claro, com categoria, público, benefício principal, prova/diferencial e território de marca.
4. Sugira de 3 a 5 mensagens-chave, tom de voz, palavras a priorizar e palavras a evitar, em conformidade com as regras da OAB.
5. Recomende uma arquitetura de conteúdo e experiência do cliente que concretize o posicionamento.
6. Apresente um plano de implementação para os próximos 90 dias com responsáveis, entregáveis e métricas.

FORMATO DE SAÍDA
- Use títulos e tópicos claros.
- Diferencie recomendações estratégicas de informações que precisam ser validadas com clientes, equipe ou pesquisa de mercado.
- Evite promessas de resultado, linguagem mercantilista e qualquer prática incompatível com a publicidade advocatícia.`
};

function getPromptProfile() {
    const values = {};
    document.querySelectorAll('[data-prompt-profile]').forEach(field => {
        values[field.dataset.promptProfile] = field.value.trim() || 'Não informado';
    });
    return `PERFIL DO ESCRITÓRIO
Áreas de atuação: ${values.areas}
Tamanho: ${values.tamanho}
Localização/Alcance: ${values.alcance}
Perfil dos clientes: ${values.clientes}
Diferenciais competitivos: ${values.diferenciais}
Objetivo estratégico atual: ${values.objetivo}`;
}

function generatePrompt() {
    const output = document.getElementById('generated-prompt');
    output.value = promptTemplates[activePromptTemplate].replace('{{perfil}}', getPromptProfile());
}

function savePromptProfile() {
    const data = {};
    document.querySelectorAll('[data-prompt-profile]').forEach(field => {
        data[field.dataset.promptProfile] = field.value;
    });
    localStorage.setItem(PROMPT_PROFILE_KEY, JSON.stringify(data));
    generatePrompt();
}

function loadPromptProfile() {
    try {
        const data = JSON.parse(localStorage.getItem(PROMPT_PROFILE_KEY) || '{}');
        document.querySelectorAll('[data-prompt-profile]').forEach(field => {
            field.value = data[field.dataset.promptProfile] || '';
        });
    } catch (error) {}
    generatePrompt();
}

document.querySelectorAll('[data-prompt-profile]').forEach(field => field.addEventListener('input', savePromptProfile));
document.querySelectorAll('.prompt-template-btn').forEach(button => {
    button.addEventListener('click', () => {
        activePromptTemplate = button.dataset.promptTemplate;
        document.querySelectorAll('.prompt-template-btn').forEach(item => item.classList.toggle('active', item === button));
        generatePrompt();
    });
});

document.getElementById('btn-copy-prompt').addEventListener('click', async () => {
    const output = document.getElementById('generated-prompt');
    try {
        await navigator.clipboard.writeText(output.value);
    } catch (error) {
        output.select();
        document.execCommand('copy');
    }
    showToast('Prompt copiado para a área de transferência.', 'fa-copy');
});

loadPromptProfile();

// ─── CANVAS ──────────────────────────────────────────────────────────────────
const CANVAS_KEY = 'mktjur_canvas';

const EXAMPLES = {
    trabalhista: {
        bmc_partners_indicacao: 'Contadores e escritórios de contabilidade\nConsultores de RH e departamento pessoal\nMédicos do trabalho e peritos',
        bmc_partners_assoc: 'OAB — Comissão de Direito do Trabalho\nSindicatos patronais e laborais da região\nCDL e associações empresariais locais',
        bmc_partners_tech: 'Software jurídico (PJe, Projudi)\nAgência de marketing digital jurídico\nPlataforma de videoconferência para consultas',
        bmc_activities_atend: '1. Triagem de leads via WhatsApp/formulário\n2. Consulta inicial de diagnóstico (30 min)\n3. Proposta personalizada e contrato\n4. Acompanhamento semanal do caso',
        bmc_activities_content: '2 posts/semana no LinkedIn sobre riscos trabalhistas\n1 artigo/mês no site: "10 erros que geram processos"\nResposta a dúvidas frequentes em Stories',
        bmc_value_servicos: '• Defesa em reclamações trabalhistas\n• Consultoria preventiva para empresas\n• Elaboração e revisão de contratos CLT\n• Compliance trabalhista e LGPD\n• Assessoria em demissões e acordos',
        bmc_value_diferenciais: '• Resposta em até 24h úteis\n• Especialização certificada em Direito Trabalhista\n• Atendimento online para todo o Brasil\n• Relatório mensal de acompanhamento do caso',
        bmc_value_posicionamento: '"O advogado trabalhista que resolve sem complicar — clareza, segurança e resultado."',
        bmc_value_voz: 'Arquétipo do Herói/Sábio. Tom: direto, empático, seguro e acessível. Evita juridiquês.',
        bmc_rel_conquista: '• E-book: "Guia dos Direitos Trabalhistas"\n• Perfil completo e atualizado no Google Meu Negócio\n• Artigos educativos que demonstram expertise',
        bmc_rel_fideliza: '• Newsletter mensal com atualizações trabalhistas\n• Acompanhamento pós-caso por 90 dias\n• Atendimento de qualidade que estimula indicações espontâneas\n• Check-in semestral com empresas assessoradas',
        bmc_seg_perfil: 'Persona 1: Carlos, 42 anos, dono de PME com 15 funcionários. Medo de passivo trabalhista.\nPersona 2: Marina, 35 anos, trabalhadora CLT demitida sem justa causa. Quer saber seus direitos.',
        bmc_seg_dores: '• Medo de ações trabalhistas custosas\n• Insegurança sobre o que é legal no contrato\n• Falta de acesso a orientação jurídica confiável\n• Processo demorado e linguagem inacessível',
        bmc_seg_canais: '• LinkedIn (empresários e gestores de RH)\n• Google (busca por "advogado trabalhista")\n• Indicação de contadores e consultores\n• Eventos e palestras para RHs',
        bmc_res_conhecimento: 'Especialização em Direito do Trabalho\nMBA em Gestão Empresarial\nCursos de comunicação e marketing jurídico',
        bmc_res_infra: 'Site profissional com blog ativo\nSoftware de gestão de processos\nEstúdio simples para gravação de vídeos',
        bmc_costs_invest: 'LinkedIn Ads: R$ 400/mês\nProdução de conteúdo: R$ 600/mês\nSoftware jurídico: R$ 200/mês\nTotal: ~R$ 1.200/mês',
        bmc_costs_dist: '34% — LinkedIn Ads\n50% — Produção de conteúdo (designer/redator)\n16% — Ferramentas e software',
        bmc_rev_metricas: 'Meta: 8 leads/mês via LinkedIn\nTaxa de conversão: 37% (3 clientes novos/mês)\nCusto por lead: R$ 150\nTicket médio: R$ 3.000/caso',
        bmc_rev_roi: 'Investimento: R$ 1.200/mês\nRetorno esperado: 3 casos × R$ 3.000 = R$ 9.000\nROI: 650% | Payback: menos de 1 semana',
        obj_lp_bienal: '• Tornar-se referência nacional em Direito Trabalhista preventivo\n• Faturar R$ 600.000/ano com consultoria, cursos e contencioso\n• Ter 1 sócio e 1 colaborador contratados\n• Lançar plataforma de gestão trabalhista para PMEs',
        obj_lp_anual: '• Tornar-se referência regional em Direito Trabalhista preventivo\n• Produzir e lançar e-book completo sobre compliance trabalhista\n• Expandir atuação para 2 novos estados via atendimento 100% online\n• Faturar R$ 300.000 no ano com mix de consultoria e contencioso',
        obj_lp_t1: '• Atingir 8 leads qualificados/mês via LinkedIn\n• Publicar 1 artigo técnico por semana no blog\n• Fechar parceria formal com 2 escritórios de contabilidade\n• Implementar CRM para gestão de casos e follow-up',
        obj_lp_t2: '• Consolidar carteira com 20 empresas em assessoria preventiva\n• Lançar curso online: "Prevenção de Passivos Trabalhistas"\n• Alcançar nota 4,8+ no Google Meu Negócio com 50 avaliações\n• Gerar R$ 18.000/mês de receita recorrente',
    },
    familia: {
        bmc_partners_indicacao: 'Psicólogos e terapeutas de casal\nAssistentes sociais e mediadores\nCartórios de notas para inventários',
        bmc_partners_assoc: 'OAB — Comissão de Direito de Família\nInstitutos de mediação familiar\nAssociações de proteção à infância',
        bmc_partners_tech: 'Plataforma de mediação online\nSoftware de cálculo de partilha\nAgência especializada em marketing humanizado',
        bmc_activities_atend: '1. Acolhimento inicial por telefone ou chat\n2. Consulta presencial ou online (sigilosa)\n3. Mapeamento patrimonial e de guarda\n4. Elaboração de acordo ou defesa judicial',
        bmc_activities_content: '3 posts/semana no Instagram: dúvidas sobre divórcio e guarda\nReels educativos: "O que é guarda compartilhada?"\nBlog: artigos sobre inventário extrajudicial',
        bmc_value_servicos: '• Divórcio consensual e litigioso\n• Guarda compartilhada e regulamentação de visitas\n• Inventário extrajudicial e judicial\n• Pensão alimentícia e revisional\n• Adoção e reconhecimento de paternidade',
        bmc_value_diferenciais: '• Atendimento humanizado e sigiloso\n• Escuta ativa sem julgamento\n• Parcerias com psicólogos para suporte emocional\n• Opção de atendimento online para todo o Brasil',
        bmc_value_posicionamento: '"Advocacia familiar com escuta ativa — menos trauma, mais solução e recomeço."',
        bmc_value_voz: 'Arquétipo do Cuidador. Tom: acolhedor, seguro, esperançoso. Evita linguagem fria e técnica.',
        bmc_rel_conquista: '• E-book educativo: "Guia do Divórcio sem Trauma"\n• Conteúdo informativo sobre mediação e resolução consensual\n• Parceria visível com psicólogos (credibilidade)',
        bmc_rel_fideliza: '• Acompanhamento pós-acordo por 6 meses\n• Checklist de documentos enviado por WhatsApp\n• Indicação espontânea: carta de agradecimento (sem contrapartida financeira)\n• Newsletter bimestral sobre direitos da família',
        bmc_seg_perfil: 'Persona 1: Fernanda, 42 anos, professora. Em processo de divórcio, mãe de 2 filhos, medo de perder a guarda.\nPersona 2: Roberto, 55 anos, empresário. Pai faleceu, precisa fazer inventário com irmãos.',
        bmc_seg_dores: '• Medo de perder a guarda ou o patrimônio\n• Processo demorado e emocionalmente desgastante\n• Não saber por onde começar o divórcio\n• Custo elevado percebido dos serviços jurídicos',
        bmc_seg_canais: '• Instagram (mulheres 35-55 anos)\n• Indicação de psicólogos e terapeutas\n• Google: "advogado divórcio [cidade]"\n• Grupos de apoio e comunidades online',
        bmc_res_conhecimento: 'Especialização em Direito de Família e Sucessões\nCurso de mediação familiar\nTreinamento em comunicação não-violenta',
        bmc_res_infra: 'Sala de atendimento acolhedora\nPlataforma de videoconferência segura\nSite com blog e conteúdo educativo',
        bmc_costs_invest: 'Instagram Ads: R$ 350/mês\nProdução de Reels: R$ 500/mês\nE-book e materiais: R$ 200/mês\nTotal: ~R$ 1.050/mês',
        bmc_costs_dist: '33% — Instagram Ads\n48% — Produção de conteúdo\n19% — Materiais e ferramentas',
        bmc_rev_metricas: 'Meta: 6 leads qualificados/mês\nTaxa de conversão: 50% (3 clientes/mês)\nCusto por cliente: R$ 350\nTicket médio: R$ 4.500/caso',
        bmc_rev_roi: 'Investimento: R$ 1.050/mês\nRetorno esperado: 3 casos × R$ 4.500 = R$ 13.500\nROI: 1.186% | Payback: menos de 3 dias',
        obj_lp_bienal: '• Ser a referência em advocacia familiar humanizada no estado\n• Faturar R$ 400.000/ano com atendimento online nacional\n• Lançar plataforma de mediação digital com parceiros\n• Ter equipe com 1 advogado associado e 1 assistente',
        obj_lp_anual: '• Tornar-se referência em advocacia familiar humanizada na região\n• Lançar programa de mediação pré-judicial com psicólogo parceiro\n• Expandir atendimento online para todo o Brasil com pacote digital\n• Faturar R$ 200.000 no ano com foco em casos consensuais e inventários',
        obj_lp_t1: '• Atingir 6 leads qualificados/mês via Instagram e indicações\n• Publicar 3 Reels educativos por semana com 500+ visualizações\n• Fechar parceria ativa com 3 psicólogos e 2 mediadores\n• Lançar e-book "Guia do Divórcio sem Trauma" e capturar 200 e-mails',
        obj_lp_t2: '• Consolidar 15 casos ativos com ticket médio de R$ 4.500\n• Atingir 1.000 seguidores engajados no Instagram\n• Alcançar nota 4,9+ no Google com 30 avaliações verificadas\n• Gerar R$ 13.500/mês de receita e reduzir custo por lead para R$ 175',
    },
    empresarial: {
        bmc_partners_indicacao: 'Contadores e escritórios de contabilidade\nConsultores financeiros e de gestão\nAceleradoras e hubs de startups',
        bmc_partners_assoc: 'OAB — Comissão de Direito Empresarial\nAssociações de startups e fintechs\nCDL, Sebrae e câmaras de comércio',
        bmc_partners_tech: 'Plataforma de assinatura digital (DocuSign)\nSoftware de gestão societária\nAgência de marketing B2B',
        bmc_activities_atend: '1. Reunião inicial de diagnóstico jurídico\n2. Proposta de "Pacote Startup Legal"\n3. Revisão e elaboração de contratos\n4. Reunião mensal de assessoria recorrente',
        bmc_activities_content: '2 posts/semana no LinkedIn sobre contratos e riscos\nGuia: "10 Riscos Jurídicos para Startups"\nParticipação em painéis e podcasts do ecossistema',
        bmc_value_servicos: '• Constituição e estruturação societária\n• Revisão e elaboração de contratos B2B\n• Pacote de assessoria jurídica mensal\n• Due diligence para investimentos\n• Compliance, LGPD e proteção de dados\n• Propriedade intelectual e marcas',
        bmc_value_diferenciais: '• Linguagem simples, sem juridiquês\n• Foco em prevenção, não só litígio\n• Pacotes mensais com preço fixo (previsibilidade)\n• Experiência com startups e scale-ups',
        bmc_value_posicionamento: '"O jurídico estratégico que cresce com sua empresa — proteção inteligente, sem complicar."',
        bmc_value_voz: 'Arquétipo do Sábio/Parceiro. Tom: estratégico, prático, direto. Linguagem de negócios.',
        bmc_rel_conquista: '• Conteúdo educativo sobre riscos jurídicos de startups\n• Checklist: "10 Riscos Jurídicos para Startups"\n• Artigos técnicos que demonstram expertise (sem expor casos reais)\n• Presença ativa em eventos do ecossistema',
        bmc_rel_fideliza: '• Relatório mensal de assessoria\n• Alertas por e-mail sobre mudanças regulatórias\n• Reunião trimestral estratégica incluída no pacote\n• Atendimento próximo e relatórios claros que estimulam indicações espontâneas',
        bmc_seg_perfil: 'Persona 1: Rafael, 34 anos, founder de SaaS B2B. Quer segurança jurídica sem gastar como grande empresa.\nPersona 2: Sócios de PME familiar (3 irmãos), sem acordo societário formalizado, crescendo rápido.',
        bmc_seg_dores: '• Assinar contratos sem entender os riscos\n• Conflitos societários por falta de acordo formal\n• Medo de multas por LGPD ou irregularidades\n• Custo percebido alto de grandes escritórios',
        bmc_seg_canais: '• LinkedIn (founders, CEOs, CFOs)\n• Indicação de contadores e aceleradoras\n• Google: "advogado empresarial startups"\n• Eventos: Demo Days, meetups de empreendedores',
        bmc_res_conhecimento: 'LLM em Direito Empresarial e Contratos\nConhecimento do ecossistema de startups\nCertificação em LGPD e proteção de dados',
        bmc_res_infra: 'Plataforma de assinatura digital\nSite com conteúdo educativo e calculadora de risco jurídico\nCRM para gestão de clientes recorrentes',
        bmc_costs_invest: 'LinkedIn Ads: R$ 500/mês\nProdução de conteúdo: R$ 700/mês\nEventos e networking: R$ 300/mês\nTotal: ~R$ 1.500/mês',
        bmc_costs_dist: '33% — LinkedIn Ads\n47% — Produção de conteúdo\n20% — Eventos e networking',
        bmc_rev_metricas: 'Meta: 5 leads qualificados/mês\nConversão para pacote mensal: 40% (2 clientes)\nTicket do pacote: R$ 2.500/mês\nRecorrência média: 12 meses',
        bmc_rev_roi: 'Investimento: R$ 1.500/mês\nRetorno esperado: 2 clientes × R$ 2.500 = R$ 5.000/mês\nROI: 233% ao mês | LTV médio: R$ 30.000/cliente',
        obj_lp_bienal: '• Tornar-se o escritório de referência para startups e PMEs no país\n• Atingir R$ 60.000/mês em receita recorrente com 24 clientes de pacote\n• Lançar "Legal as a Service" com plataforma própria\n• Contratar 2 advogados associados e 1 gerente de operações',
        obj_lp_anual: '• Tornar-se o advogado empresarial de referência para startups e PMEs da região\n• Atingir R$ 30.000/mês em receita recorrente com 12 clientes de pacote\n• Lançar programa "Startup Legal Kit" com contratos e compliance incluídos\n• Faturar R$ 360.000 no ano com 70% de receita previsível via assinaturas',
        obj_lp_t1: '• Fechar 2 contratos de assessoria jurídica recorrente (R$ 2.500/mês)\n• Publicar guia: "10 Riscos Jurídicos para Startups" e gerar 150 leads\n• Participar de 2 eventos do ecossistema de startups como palestrante\n• Implementar onboarding digital com contrato e assinatura eletrônica',
        obj_lp_t2: '• Atingir 8 clientes em pacote mensal recorrente (R$ 20.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores e 5% de engajamento\n• Fechar parcerias com 3 contadores e 2 aceleradoras como fonte de indicação\n• Publicar 2 artigos técnicos aprofundados demonstrando expertise (sem expor casos reais)',
    }
};

function saveCanvas() {
    const data = {};
    document.querySelectorAll('#canvas-panel [data-field]').forEach(el => {
        data[el.dataset.field] = el.value;
    });
    // save canais
    data.__canais = collectCanais();
    localStorage.setItem(CANVAS_KEY, JSON.stringify(data));
    showToast('Canvas salvo com sucesso!');
}

function loadCanvas() {
    const raw = localStorage.getItem(CANVAS_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        document.querySelectorAll('#canvas-panel [data-field]').forEach(el => {
            if (data[el.dataset.field] !== undefined) el.value = data[el.dataset.field];
        });
        if (data.__canais) renderCanais(data.__canais);
    } catch(e) {}
}

function clearCanvas() {
    if (!confirm('Limpar todos os campos do Canvas?')) return;
    document.querySelectorAll('#canvas-panel [data-field]').forEach(el => el.value = '');
    document.getElementById('canais-list').innerHTML = '';
    localStorage.removeItem(CANVAS_KEY);
    showToast('Canvas limpo.', 'fa-trash');
}

function loadExample(key) {
    if (!key) return;
    const ex = EXAMPLES[key];
    if (!ex) return;
    Object.entries(ex).forEach(([field, val]) => {
        const el = document.querySelector(`#canvas-panel [data-field="${field}"]`);
        if (el) el.value = val;
    });
}

// Canal Management
const CANAL_ICONS = {
    LinkedIn: 'fab fa-linkedin',
    Instagram: 'fab fa-instagram',
    'Site/Blog': 'fas fa-globe',
    YouTube: 'fab fa-youtube',
    WhatsApp: 'fab fa-whatsapp',
    'Google Meu Negócio': 'fab fa-google',
    'E-mail Marketing': 'fas fa-envelope',
    'Palestras/Eventos': 'fas fa-microphone',
};

function collectCanais() {
    const items = [];
    document.querySelectorAll('.canal-item').forEach(item => {
        items.push({
            nome: item.dataset.canal,
            objetivo: item.querySelector('[data-canal-field="objetivo"]')?.value || '',
            estrategia: item.querySelector('[data-canal-field="estrategia"]')?.value || '',
        });
    });
    return items;
}

function renderCanais(list) {
    list.forEach(c => addCanalItem(c.nome, c.objetivo, c.estrategia));
}

function addCanalItem(nome, objetivo = '', estrategia = '') {
    const list = document.getElementById('canais-list');
    const icon = CANAL_ICONS[nome] || 'fas fa-share-alt';
    const div = document.createElement('div');
    div.className = 'canal-item';
    div.dataset.canal = nome;
    div.innerHTML = `
        <div class="canal-item-header">
            <span><i class="${icon}"></i>${nome}</span>
            <button class="btn-remove-canal" onclick="this.closest('.canal-item').remove()"><i class="fas fa-times"></i></button>
        </div>
        <div class="canal-item-body">
            <div class="canvas-field">
                <label>Objetivo</label>
                <textarea data-canal-field="objetivo" rows="2" placeholder="Ex.: Gerar autoridade e leads qualificados">${objetivo}</textarea>
            </div>
            <div class="canvas-field">
                <label>Estratégia</label>
                <textarea data-canal-field="estrategia" rows="2" placeholder="Ex.: 3 posts/semana com conteúdo educativo e informativo">${estrategia}</textarea>
            </div>
        </div>`;
    list.appendChild(div);
}

function addCanal() {
    const sel = document.getElementById('canal-select');
    const nome = sel.value;
    if (!nome) return;
    addCanalItem(nome);
    sel.value = '';
}

// Init canvas
document.getElementById('btn-save-canvas').addEventListener('click', saveCanvas);
document.getElementById('btn-clear-canvas').addEventListener('click', clearCanvas);
document.getElementById('btn-print-canvas').addEventListener('click', () => window.print());
document.getElementById('btn-add-canal').addEventListener('click', addCanal);
document.getElementById('canvas-example').addEventListener('change', e => loadExample(e.target.value));

loadCanvas();


// ─── CANVAS DE DIAGNÓSTICO ESTRATÉGICO ───────────────────────────────────────
const DIAG_KEY = 'mktjur_diagnostico';

const DIAG_EXAMPLES = {
    trabalhista: {
        mercado_oportunidade1: '6 milhões de PMEs sem assessoria trabalhista preventiva — mercado de R$ 500M/ano no Brasil totalmente subatendido localmente.',
        mercado_oportunidade2: 'Crescimento de consultas preventivas pós-Reforma Trabalhista: teletrabalho, IA no RH e nova jurisprudência gerando demanda especializada crescente.',
        mercado_ameaca1: 'LegalTechs automatizando cálculos de rescisão e triagem — reduzindo demanda por serviços básicos e pressionando honorários para baixo.',
        mercado_ameaca2: 'Advogados generalistas com preços 40% menores competindo pelos clientes que ainda não percebem o valor da especialização certificada.',
        obj_visao5: 'Ser o escritório de referência nacional em compliance trabalhista para PMEs, com plataforma digital própria, equipe de 5 advogados e MRR de R$ 100.000/mês.',
        obj_1ano: '• 15 clientes PMEs com contrato de assessoria recorrente (MRR R$ 13.500)\n• Ser palestrante em 2 eventos de RH da região\n• Site com blog ativo e 500 visitas/mês orgânicas',
        obj_trimestre: '• Publicar 2 artigos/semana no LinkedIn sobre riscos trabalhistas para PMEs\n• Fechar 2 contratos de assessoria preventiva mensais\n• Atingir nota 4.8 no Google com 30 avaliações\n• Lançar e-book "Guia do Compliance Trabalhista para PMEs"',
        forcas_forte1: 'Especialização certificada em Direito do Trabalho com 8 anos de experiência em contencioso e preventivo e rede de 8 contadores parceiros.',
        forcas_forte2: 'Atendimento 100% online para todo o Brasil com nota 4.9 no Google e 45 avaliações — reputação consolidada e diferencial percebido pelo mercado.',
        forcas_fraca1: 'Escritório solo sem equipe de apoio — capacidade limitada de atender mais clientes simultaneamente, criando gargalo de crescimento.',
        forcas_fraca2: 'LinkedIn com apenas 450 seguidores e sem budget de marketing definido — baixa visibilidade digital e dependência de 2 grandes clientes (60% da receita).',
        matriz_fo1: 'Usar especialização certificada (força) + mercado de PMEs sem assessoria (oportunidade) → lançar "Pacote Preventivo PME" a R$ 900/mês com meta de 15 contratos em 12 meses.',
        matriz_fo2: 'Usar rede de 8 contadores parceiros (força) + demanda pós-Reforma (oportunidade) → fortalecer o relacionamento institucional com conteúdo técnico exclusivo e eventos educativos conjuntos.',
        matriz_fa1: 'Usar certificação (força) para se diferenciar de generalistas (ameaça) — publicar conteúdo técnico e educativo no LinkedIn e no Google, com caráter informativo, destacando formação e especialização (sem prometer resultados, conforme Provimento 205/2021).',
        matriz_fa2: 'Usar atendimento personalizado (força) para criar fidelidade e barreira contra LegalTechs (ameaça) — check-in mensal obrigatório incluso no pacote preventivo.',
        matriz_fraqo1: 'Superar capacidade limitada (fraqueza) para aproveitar o mercado crescente (oportunidade) — contratar estagiário por R$ 600/mês e freelancer de conteúdo para dobrar capacidade.',
        matriz_fraqo2: 'Superar o LinkedIn fraco (fraqueza) para capturar demanda digital (oportunidade) — comprometer-se a publicar 3x/semana por 90 dias e investir R$ 300/mês em LinkedIn Ads.',
        obj_lp_bienal: '• Tornar-se referência nacional em Direito Trabalhista preventivo\n• Faturar R$ 600.000/ano com consultoria, cursos e contencioso\n• Ter 1 sócio e 1 colaborador contratados\n• Lançar plataforma de gestão trabalhista para PMEs',
        obj_lp_anual: '• Tornar-se referência regional em Direito Trabalhista preventivo\n• Produzir e lançar e-book completo sobre compliance trabalhista\n• Expandir atuação para 2 novos estados via atendimento 100% online\n• Faturar R$ 300.000 no ano com mix de consultoria e contencioso',
        obj_lp_t1: '• Atingir 8 leads qualificados/mês via LinkedIn\n• Publicar 1 artigo técnico por semana no blog\n• Fechar parceria formal com 2 escritórios de contabilidade\n• Implementar CRM para gestão de casos e follow-up',
        obj_lp_t2: '• Consolidar carteira com 20 empresas em assessoria preventiva\n• Lançar curso online: "Prevenção de Passivos Trabalhistas"\n• Alcançar nota 4,8+ no Google Meu Negócio com 50 avaliações\n• Gerar R$ 18.000/mês de receita recorrente',
        obj_lp_t3: '• Consolidar autoridade no LinkedIn: atingir 2.000 seguidores qualificados\n• Lançar webinar educativo "Gestão Trabalhista para PMEs" (meta: 150 participantes)\n• Fechar 5 novos contratos de assessoria preventiva\n• Atingir MRR de R$ 9.000 com carteira de 10 clientes recorrentes',
        obj_lp_t4: '• Avaliar resultados do ano e planejar próximo ciclo de crescimento\n• Atingir MRR de R$ 13.500 com 15 clientes de assessoria preventiva\n• Contratar estagiário para dobrar capacidade de atendimento\n• Publicar balanço do ano no LinkedIn e definir meta de R$ 300.000 para o próximo',
    },
    familia: {
        mercado_oportunidade1: 'Crescimento de divórcios (+18% pós-pandemia) e expansão do inventário extrajudicial — casos que exigem especialista humano e não podem ser automatizados.',
        mercado_oportunidade2: 'Famílias recompostas, contratos de convivência e guarda compartilhada gerando nova demanda especializada sem concorrente com atendimento integrado na cidade.',
        mercado_ameaca1: 'Plataformas de divórcio online por R$ 800 para casos simples — erodindo percepção de valor e pressionando os honorários de toda a categoria para baixo.',
        mercado_ameaca2: 'Crescimento de novos advogados de família na região com presença digital forte e preços inicialmente abaixo do mercado para ganhar carteira de clientes.',
        obj_visao5: 'Ser a referência estadual em advocacia familiar humanizada, com plataforma de mediação digital, equipe de 3 advogados e faturamento de R$ 400.000/ano.',
        obj_1ano: '• 10 casos novos/mês com ticket médio de R$ 5.000\n• Nota 4.9 no Google com 60 avaliações\n• 5.000 seguidores engajados no Instagram\n• Lançar programa de mediação pré-judicial com psicólogo parceiro',
        obj_trimestre: '• Lançar e-book "Guia do Divórcio sem Trauma" e captar 200 e-mails\n• Fechar parceria formal com 3 psicólogos da cidade\n• Publicar 3 posts/semana no Instagram com conteúdo acolhedor\n• Criar pacote de inventário extrajudicial com preço fixo',
        forcas_forte1: 'Certificação em mediação familiar + parceria exclusiva com psicóloga — único escritório da cidade com atendimento jurídico e emocional integrado.',
        forcas_forte2: 'Certificação em mediação com foco em resolução consensual, Instagram com 3.200 seguidores engajados e nota 4.9 no Google com 30 avaliações verificadas — forte reputação local.',
        forcas_fraca1: 'Ticket médio baixo (R$ 3.500 vs média de R$ 5.000) e sem serviço recorrente — fluxo de caixa instável e totalmente dependente de novos casos.',
        forcas_fraca2: 'Sem blog ou site com SEO ativo — depende exclusivamente do Instagram e indicações, sem captação orgânica via Google para casos mais complexos.',
        matriz_fo1: 'Usar parceria com psicóloga (força) + demanda por famílias recompostas (oportunidade) → lançar "Pacote Família Recomposta" com suporte jurídico e psicológico integrado por R$ 7.000.',
        matriz_fo2: 'Usar credibilidade do Instagram (força) + crescimento do inventário extrajudicial (oportunidade) → criar pacote de inventário com preço fixo (R$ 10.000) comunicado nas redes.',
        matriz_fa1: 'Usar certificação em mediação (força) para se diferenciar das plataformas digitais baratas (ameaça) — comunicar que casos com filhos e bens nunca são resolvidos por algoritmos.',
        matriz_fa2: 'Usar experiência em mediação e acordos (força) para se proteger da concorrência crescente (ameaça) — publicar conteúdo educativo sobre resolução consensual de conflitos, preservando o sigilo profissional (sem expor clientes ou casos reais).',
        matriz_fraqo1: 'Superar fluxo irregular (fraqueza) aproveitando crescimento do inventário (oportunidade) → criar "Pacote Inventário Expresso" com preço fixo para estabilizar receita mensal.',
        matriz_fraqo2: 'Superar ausência de SEO (fraqueza) para capturar buscas de divórcio no Google (oportunidade) → publicar 2 artigos/mês com palavras-chave "advogado divórcio [cidade]".',
        obj_lp_bienal: '• Ser a referência em advocacia familiar humanizada no estado\n• Faturar R$ 400.000/ano com atendimento online nacional\n• Lançar plataforma de mediação digital com parceiros\n• Ter equipe com 1 advogado associado e 1 assistente',
        obj_lp_anual: '• Tornar-se referência em advocacia familiar humanizada na região\n• Lançar programa de mediação pré-judicial com psicólogo parceiro\n• Expandir atendimento online para todo o Brasil com pacote digital\n• Faturar R$ 200.000 no ano com foco em casos consensuais e inventários',
        obj_lp_t1: '• Atingir 6 leads qualificados/mês via Instagram e indicações\n• Publicar 3 Reels educativos por semana com 500+ visualizações\n• Fechar parceria ativa com 3 psicólogos e 2 mediadores\n• Lançar e-book "Guia do Divórcio sem Trauma" e capturar 200 e-mails',
        obj_lp_t2: '• Consolidar 15 casos ativos com ticket médio de R$ 4.500\n• Atingir 1.000 seguidores engajados no Instagram\n• Alcançar nota 4,9+ no Google com 30 avaliações verificadas\n• Gerar R$ 13.500/mês de receita e reduzir custo por lead para R$ 175',
        obj_lp_t3: '• Lançar pacote "Família Recomposta" com psicólogo parceiro (R$ 7.000)\n• Atingir 2.500 seguidores engajados no Instagram\n• Consolidar 12 casos ativos com ticket médio de R$ 4.500\n• Alcançar nota 4.9 no Google com 40 avaliações verificadas',
        obj_lp_t4: '• Avaliar resultados do ano e estruturar expansão para atendimento online nacional\n• Atingir 15 casos ativos com ticket médio de R$ 4.500 (receita de R$ 13.500/mês)\n• Criar pacote de inventário extrajudicial com preço fixo comunicado no Instagram\n• Lançar newsletter bimestral para base de 200+ e-mails capturados',
    },
    empresarial: {
        mercado_oportunidade1: '15 milhões de PMEs no Brasil sem assessoria jurídica recorrente — um mercado subatendido que busca previsibilidade, preço fixo e linguagem de negócios.',
        mercado_oportunidade2: 'Reforma Tributária + regulação de IA e LGPD criando demanda massiva por especialistas — maior oportunidade para advogados empresariais nos últimos 50 anos.',
        mercado_ameaca1: 'Big 4 (consultorias internacionais) oferecendo serviços jurídicos integrados e LegalTechs para contratos simples e due diligence automatizada.',
        mercado_ameaca2: 'Boutiques jurídicas especializadas crescendo com modelo de assinatura similar — compressão de preços e dificuldade crescente de diferenciação.',
        obj_visao5: 'Ser o escritório de referência nacional para startups e PMEs, com "Legal as a Service" em plataforma própria, 8 advogados e MRR de R$ 150.000/mês.',
        obj_1ano: '• 20 clientes de assinatura mensal (MRR R$ 50.000)\n• LinkedIn com 8.000 seguidores qualificados e 5% de engajamento\n• 2 parcerias formais com aceleradoras de startups\n• Plataforma digital de acesso para clientes lançada',
        obj_trimestre: '• Webinar educativo sobre Reforma Tributária para PMEs (meta: 200 participantes)\n• Fechar 3 novos contratos de assinatura mensal\n• Publicar guia "10 Riscos Jurídicos para Startups"\n• Atingir 5.000 seguidores qualificados no LinkedIn',
        forcas_forte1: 'Expertise em contratos B2B, M&A e LGPD + 35 clientes recorrentes com MRR consolidado e modelo de assinatura com preço fixo único na região.',
        forcas_forte2: 'LinkedIn com 4.500 seguidores qualificados e 5 anos de experiência no ecossistema de startups — autoridade reconhecida e referência no nicho.',
        forcas_fraca1: '3 clientes representam 45% da receita — alto risco de concentração que pode comprometer o caixa em caso de cancelamento de um grande contrato.',
        forcas_fraca2: 'Onboarding ainda manual e demorado (7 dias úteis) — experiência abaixo das expectativas de startups que valorizam velocidade e automação de processos.',
        matriz_fo1: 'Usar expertise na Reforma Tributária (força) + demanda massiva do mercado (oportunidade) → lançar "Pacote Reestruturação 2025" para os 35 clientes existentes e gerar upsell imediato.',
        matriz_fo2: 'Usar LinkedIn com 4.500 seguidores (força) + 15M de PMEs sem assessoria (oportunidade) → campanha de LinkedIn Ads segmentada por cargo (CEO, CFO) com webinar como isca digital.',
        matriz_fa1: 'Usar expertise em startups (força) para se blindar contra Big 4 (ameaça) — comunicar que grandes consultorias não dominam o "startup legal stack" por meio de artigos técnicos e conteúdo educativo (sem expor casos ou clientes reais).',
        matriz_fa2: 'Usar modelo de assinatura com preço fixo (força) para contra-atacar boutiques concorrentes (ameaça) — adicionar relatório mensal e reunião trimestral inclusos para elevar valor percebido.',
        matriz_fraqo1: 'Superar concentração de receita (fraqueza) aproveitando o mercado de PMEs (oportunidade) → meta de diversificar para 50+ clientes em 12 meses, reduzindo os 3 maiores para no máximo 20% da receita.',
        matriz_fraqo2: 'Superar onboarding lento (fraqueza) para capturar startups que exigem agilidade (oportunidade) → implementar assinatura eletrônica + portal do cliente: reduzir de 7 dias para 1 dia.',
        obj_lp_bienal: '• Tornar-se o escritório de referência para startups e PMEs no país\n• Atingir R$ 60.000/mês em receita recorrente com 24 clientes de pacote\n• Lançar "Legal as a Service" com plataforma própria\n• Contratar 2 advogados associados e 1 gerente de operações',
        obj_lp_anual: '• Tornar-se o advogado empresarial de referência para startups e PMEs da região\n• Atingir R$ 30.000/mês em receita recorrente com 12 clientes de pacote\n• Lançar programa "Startup Legal Kit" com contratos e compliance incluídos\n• Faturar R$ 360.000 no ano com 70% de receita previsível via assinaturas',
        obj_lp_t1: '• Fechar 2 contratos de assessoria jurídica recorrente (R$ 2.500/mês)\n• Publicar guia: "10 Riscos Jurídicos para Startups" e gerar 150 leads\n• Participar de 2 eventos do ecossistema de startups como palestrante\n• Implementar onboarding digital com contrato e assinatura eletrônica',
        obj_lp_t2: '• Atingir 8 clientes em pacote mensal recorrente (R$ 20.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores e 5% de engajamento\n• Fechar parcerias com 3 contadores e 2 aceleradoras como fonte de indicação\n• Publicar 2 artigos técnicos aprofundados demonstrando expertise (sem expor casos reais)',
        obj_lp_t3: '• Lançar webinar sobre Reforma Tributária para PMEs (meta: 200 participantes)\n• Atingir 10 clientes em pacote mensal recorrente (MRR R$ 25.000)\n• Publicar 2 artigos técnicos com análises de mercado (sem expor casos ou resultados de clientes)\n• Consolidar parceria formal com 3 contadores e 2 aceleradoras',
        obj_lp_t4: '• Avaliar resultados do ano; publicar relatório "Riscos Jurídicos para PMEs 2026"\n• Atingir 12 clientes em pacote mensal recorrente (MRR R$ 30.000)\n• Reduzir concentração de receita: nenhum cliente acima de 25% do faturamento\n• Planejar lançamento do "Startup Legal Kit" e plataforma digital para o próximo ano',
    }
};

function saveDiag() {
    const data = {};
    document.querySelectorAll('#diagnostico-panel [data-diag]').forEach(el => {
        data[el.dataset.diag] = el.value;
    });
    localStorage.setItem(DIAG_KEY, JSON.stringify(data));
    showToast('Diagnóstico Estratégico salvo!');
}

function loadDiagData() {
    const raw = localStorage.getItem(DIAG_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        document.querySelectorAll('#diagnostico-panel [data-diag]').forEach(el => {
            if (data[el.dataset.diag] !== undefined) el.value = data[el.dataset.diag];
        });
    } catch(e) {}
}

function clearDiag() {
    if (!confirm('Limpar todos os campos do Diagnóstico Estratégico?')) return;
    document.querySelectorAll('#diagnostico-panel [data-diag]').forEach(el => el.value = '');
    localStorage.removeItem(DIAG_KEY);
    showToast('Diagnóstico limpo.', 'fa-trash');
}

function loadDiagExample(key) {
    if (!key) return;
    const ex = DIAG_EXAMPLES[key];
    if (!ex) return;
    Object.entries(ex).forEach(([field, val]) => {
        const el = document.querySelector(`#diagnostico-panel [data-diag="${field}"]`);
        if (el) el.value = val;
    });
    showToast('Exemplo carregado!', 'fa-magic');
}

// Examples tabs
document.querySelectorAll('.diag-ex-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.diag-ex-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.diag-ex-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.ex).classList.add('active');
    });
});

document.getElementById('btn-save-diag').addEventListener('click', saveDiag);
document.getElementById('btn-clear-diag').addEventListener('click', clearDiag);
document.getElementById('btn-print-diag').addEventListener('click', () => window.print());
document.getElementById('diag-example').addEventListener('change', e => loadDiagExample(e.target.value));

loadDiagData();


// ─── KANBAN ──────────────────────────────────────────────────────────────────
const KANBAN_KEY = 'mktjur_kanban';

const DEFAULT_BOARDS = {
    analise: {
        name: 'Análise',
        columns: {
            todo: [
                { id: 0, title: 'Defina Objetivos', desc: 'Estabeleça metas claras e mensuráveis para o seu marketing jurídico: o que você quer alcançar, em quanto tempo e como vai medir o sucesso.', priority: 'alta', date: today() },
                { id: 1, title: 'Analise Macroambiente (PESTEL)', desc: 'Mapeie os fatores políticos, econômicos, sociais, tecnológicos, ambientais e legais que impactam seu escritório.', priority: 'alta', date: today() },
                { id: 2, title: 'Mapei de 3 a 5 concorrentes / escritórios de referência', desc: 'Identifique concorrentes diretos e escritórios de referência, analise posicionamento, canais e diferenciais.', priority: 'alta', date: today() },
                { id: 3, title: 'Monte a SWOT do seu escritório', desc: 'Liste Forças, Fraquezas, Oportunidades e Ameaças com base nos dados coletados.', priority: 'media', date: today() },
            ],
            doing: [],
            review: []
        }
    },
    planejamento: {
        name: 'Planejamento',
        columns: {
            todo: [
                { id: 10, title: 'Público-Alvo', desc: 'Defina o perfil do cliente ideal (persona): demográfico, comportamental, dores e objetivos.', priority: 'alta', date: today() },
                { id: 11, title: 'Branding', desc: 'Construa a identidade visual e verbal do escritório: nome, logo, tom de voz e posicionamento.', priority: 'media', date: today() },
                { id: 12, title: 'Mix de Marketing', desc: 'Defina produto/serviço, preço, praça (canais de distribuição) e promoção (comunicação).', priority: 'media', date: today() },
            ],
            doing: [],
            review: []
        }
    },
    execucao: {
        name: 'Execução',
        columns: {
            todo: [
                { id: 20, title: 'Calendário de Conteúdo', desc: 'Planeje e organize os conteúdos a serem publicados nos canais digitais do escritório.', priority: 'alta', date: today() },
                { id: 21, title: 'Campanhas Pagas', desc: 'Configure e gerencie anúncios pagos (Google Ads, Meta Ads etc.) respeitando as normas da OAB.', priority: 'media', date: today() },
                { id: 22, title: 'Campanhas Orgânicas', desc: 'Produza e distribua conteúdo orgânico: posts, artigos, vídeos e e-mail marketing.', priority: 'media', date: today() },
            ],
            doing: [],
            review: []
        }
    },
    outro: {
        name: 'Outro',
        columns: {
            todo: [],
            doing: [],
            review: []
        }
    }
};

let kanbanData = null;
let currentBoard = 'analise';
let nextCardId = 100;
let addingToCol = null;

function today() {
    return new Date().toLocaleDateString('pt-BR');
}

function loadKanban() {
    const raw = localStorage.getItem(KANBAN_KEY);
    if (raw) {
        try { kanbanData = JSON.parse(raw); } catch(e) { kanbanData = JSON.parse(JSON.stringify(DEFAULT_BOARDS)); }
    } else {
        kanbanData = JSON.parse(JSON.stringify(DEFAULT_BOARDS));
    }
    // Migration: ensure "Defina Objetivos" is the first task in the analise board
    if (kanbanData.analise && kanbanData.analise.columns && kanbanData.analise.columns.todo) {
        const allCols = [
            ...kanbanData.analise.columns.todo,
            ...(kanbanData.analise.columns.doing || []),
            ...(kanbanData.analise.columns.review || [])
        ];
        const alreadyExists = allCols.some(t => t.id === 0 || t.title === 'Defina Objetivos');
        if (!alreadyExists) {
            kanbanData.analise.columns.todo.unshift({
                id: 0,
                title: 'Defina Objetivos',
                desc: 'Estabeleça metas claras e mensuráveis para o seu marketing jurídico: o que você quer alcançar, em quanto tempo e como vai medir o sucesso.',
                priority: 'alta',
                date: today()
            });
            saveKanban();
        }
    }
    // sync boards select
    rebuildBoardSelect();
    renderKanban();
}

function saveKanban() {
    localStorage.setItem(KANBAN_KEY, JSON.stringify(kanbanData));
}

function rebuildBoardSelect() {
    const sel = document.getElementById('kanban-board-select');
    sel.innerHTML = '';
    Object.entries(kanbanData).forEach(([key, board]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = board.name;
        if (key === currentBoard) opt.selected = true;
        sel.appendChild(opt);
    });
}

function getProgressPhrase(pct) {
    if (pct === 100) return '🏆 Incrível! Quadro 100% concluído. Você é imparável!';
    if (pct >= 75)  return '🔥 Quase lá! Um último esforço e você fecha o quadro com chave de ouro!';
    if (pct >= 50)  return '💪 Mais da metade concluída! Você está no caminho certo — não pare agora!';
    if (pct >= 25)  return '🚀 Ótimo ritmo! Cada tarefa feita te aproxima dos seus objetivos.';
    if (pct > 0)    return '✨ Começo é começo! Continue e veja o progresso crescer.';
    return '📋 Comece agora! Cada tarefa concluída é um passo rumo ao sucesso.';
}

function updateKanbanProgress() {
    const board = kanbanData[currentBoard];
    if (!board) return;
    const total = ['todo', 'doing', 'review'].reduce((sum, col) => sum + (board.columns[col] || []).length, 0);
    const done  = (board.columns['review'] || []).length;
    const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById('kanban-pct').textContent = `${pct}%`;
    const fill = document.getElementById('kanban-progress-fill');
    fill.style.width = `${pct}%`;
    fill.dataset.pct = pct;
    document.getElementById('kanban-progress-phrase').textContent = getProgressPhrase(pct);
}

function renderKanban() {
    const board = kanbanData[currentBoard];
    if (!board) return;
    ['todo', 'doing', 'review'].forEach(col => {
        const container = document.getElementById(`col-${col}`);
        container.innerHTML = '';
        const cards = board.columns[col] || [];
        // update count
        document.getElementById(`count-${col}`).textContent = cards.length;

        // add button at top
        const addBtn = document.createElement('button');
        addBtn.className = 'kanban-add-btn';
        addBtn.innerHTML = '<i class="fas fa-plus"></i> Adicionar Tarefa';
        addBtn.onclick = () => openAddModal(col);
        container.appendChild(addBtn);

        if (cards.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'kanban-empty';
            empty.innerHTML = '<i class="fas fa-inbox"></i>Nenhuma tarefa';
            container.appendChild(empty);
        } else {
            cards.forEach(card => {
                container.appendChild(createCardEl(card, col));
            });
        }
    });
    updateKanbanProgress();
}

function createCardEl(card, col) {
    const div = document.createElement('div');
    div.className = 'kanban-card';
    div.draggable = true;
    div.dataset.id = card.id;
    div.dataset.col = col;

    const priorityLabel = { alta: 'Alta', media: 'Média', baixa: 'Baixa' }[card.priority] || 'Média';
    const priorityClass = { alta: 'priority-alta', media: 'priority-media', baixa: 'priority-baixa' }[card.priority] || 'priority-media';

    div.innerHTML = `
        <div class="kanban-card-title">${card.title}</div>
        <div class="kanban-card-desc">${card.desc}</div>
        <div class="kanban-card-footer">
            <div class="kanban-card-meta">
                <span class="priority-badge ${priorityClass}">${priorityLabel}</span>
                <span class="kanban-card-date">Criada: ${card.date}</span>
            </div>
            <div class="kanban-card-actions">
                <button class="btn-card-action btn-card-edit" onclick="openEditModal(${card.id},'${col}')" title="Editar"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-card-action btn-card-del" onclick="deleteCard(${card.id},'${col}')" title="Remover"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;

    // Click anywhere on the card (except action buttons) to edit
    div.addEventListener('click', e => {
        if (e.target.closest('.kanban-card-actions')) return;
        openEditModal(card.id, col);
    });

    // Drag start / end
    div.addEventListener('dragstart', e => {
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('fromCol', col);
        div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => {
        div.classList.remove('dragging');
        clearDragIndicators();
    });

    // Per-card dragover — show insert indicator above or below the card
    div.addEventListener('dragover', e => {
        e.preventDefault();
        e.stopPropagation();
        const rect = div.getBoundingClientRect();
        clearDragIndicators();
        if (e.clientY < rect.top + rect.height / 2) {
            div.classList.add('drag-indicator-top');
        } else {
            div.classList.add('drag-indicator-bottom');
        }
    });

    div.addEventListener('dragleave', e => {
        if (!div.contains(e.relatedTarget)) {
            div.classList.remove('drag-indicator-top', 'drag-indicator-bottom');
        }
    });

    // Per-card drop — reorder within column or move across columns
    div.addEventListener('drop', e => {
        e.preventDefault();
        e.stopPropagation();
        const id = parseInt(e.dataTransfer.getData('cardId'));
        const fromCol = e.dataTransfer.getData('fromCol');
        const isAbove = div.classList.contains('drag-indicator-top');
        clearDragIndicators();

        if (id === card.id) return;

        const board = kanbanData[currentBoard];
        const srcIdx = board.columns[fromCol].findIndex(c => c.id === id);
        if (srcIdx === -1) return;
        const [movedCard] = board.columns[fromCol].splice(srcIdx, 1);

        const tgtArr = board.columns[col];
        let tgtIdx = tgtArr.findIndex(c => c.id === card.id);
        if (tgtIdx === -1) tgtIdx = tgtArr.length;
        if (!isAbove) tgtIdx++;
        tgtArr.splice(tgtIdx, 0, movedCard);

        saveKanban();
        renderKanban();
        showToast(fromCol !== col ? 'Tarefa movida!' : 'Tarefa reordenada!', fromCol !== col ? 'fa-arrows-alt' : 'fa-sort');
    });

    return div;
}

function clearDragIndicators() {
    document.querySelectorAll('.drag-indicator-top, .drag-indicator-bottom').forEach(el => {
        el.classList.remove('drag-indicator-top', 'drag-indicator-bottom');
    });
}

function deleteCard(id, col) {
    const board = kanbanData[currentBoard];
    board.columns[col] = board.columns[col].filter(c => c.id !== id);
    saveKanban();
    renderKanban();
}

// Drop zones (handle drops on empty column space; per-card drops are handled above)
['todo', 'doing', 'review'].forEach(col => {
    const container = document.getElementById(`col-${col}`);
    container.addEventListener('dragover', e => {
        e.preventDefault();
        if (!e.target.closest('.kanban-card')) container.style.background = '#e0e7ff';
    });
    container.addEventListener('dragleave', e => {
        if (!container.contains(e.relatedTarget)) container.style.background = '';
    });
    container.addEventListener('drop', e => {
        e.preventDefault();
        container.style.background = '';
        clearDragIndicators();
        const id = parseInt(e.dataTransfer.getData('cardId'));
        const fromCol = e.dataTransfer.getData('fromCol');
        const board = kanbanData[currentBoard];
        const cardIdx = board.columns[fromCol].findIndex(c => c.id === id);
        if (cardIdx === -1) return;
        const [card] = board.columns[fromCol].splice(cardIdx, 1);
        board.columns[col].push(card);
        saveKanban();
        renderKanban();
        showToast(fromCol !== col ? 'Tarefa movida!' : 'Tarefa reordenada!', 'fa-arrows-alt');
    });
});

// Add task modal
function openAddModal(col) {
    addingToCol = col;
    document.getElementById('add-task-modal').classList.add('open');
    document.getElementById('task-title').focus();
}

document.getElementById('btn-modal-cancel').addEventListener('click', () => {
    document.getElementById('add-task-modal').classList.remove('open');
    document.getElementById('task-form').reset();
});

document.getElementById('btn-modal-confirm').addEventListener('click', () => {
    const title = document.getElementById('task-title').value.trim();
    if (!title) { document.getElementById('task-title').focus(); return; }
    const desc = document.getElementById('task-desc').value.trim();
    const priority = document.getElementById('task-priority').value;
    const card = { id: nextCardId++, title, desc, priority, date: today() };
    kanbanData[currentBoard].columns[addingToCol].push(card);
    saveKanban();
    renderKanban();
    document.getElementById('add-task-modal').classList.remove('open');
    document.getElementById('task-form').reset();
    showToast('Tarefa adicionada!');
});

// Close modal on overlay click
document.getElementById('add-task-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
        e.currentTarget.classList.remove('open');
        document.getElementById('task-form').reset();
    }
});

// Board controls
document.getElementById('kanban-board-select').addEventListener('change', e => {
    currentBoard = e.target.value;
    renderKanban();
});

document.getElementById('btn-new-board').addEventListener('click', () => {
    const name = prompt('Nome do novo quadro:');
    if (!name || !name.trim()) return;
    const key = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now();
    kanbanData[key] = { name: name.trim(), columns: { todo: [], doing: [], review: [] } };
    currentBoard = key;
    saveKanban();
    rebuildBoardSelect();
    renderKanban();
    showToast(`Quadro "${name}" criado!`);
});

document.getElementById('btn-delete-board').addEventListener('click', () => {
    const keys = Object.keys(kanbanData);
    if (keys.length <= 1) { showToast('Não é possível excluir o único quadro.', 'fa-exclamation-triangle'); return; }
    if (!confirm(`Excluir o quadro "${kanbanData[currentBoard].name}"?`)) return;
    delete kanbanData[currentBoard];
    currentBoard = Object.keys(kanbanData)[0];
    saveKanban();
    rebuildBoardSelect();
    renderKanban();
    showToast('Quadro excluído.', 'fa-trash');
});

document.getElementById('btn-reset-boards').addEventListener('click', () => {
    if (!confirm('Resetar todos os quadros para o padrão?')) return;
    kanbanData = JSON.parse(JSON.stringify(DEFAULT_BOARDS));
    currentBoard = 'analise';
    saveKanban();
    rebuildBoardSelect();
    renderKanban();
    showToast('Quadros resetados.', 'fa-undo');
});

// Edit task modal
let editingCardId = null;
let editingCardCol = null;

function openEditModal(id, col) {
    const board = kanbanData[currentBoard];
    const card = board.columns[col].find(c => c.id === id);
    if (!card) return;
    editingCardId = id;
    editingCardCol = col;
    document.getElementById('edit-task-title').value = card.title;
    document.getElementById('edit-task-desc').value = card.desc || '';
    document.getElementById('edit-task-priority').value = card.priority || 'media';
    document.getElementById('edit-task-modal').classList.add('open');
    document.getElementById('edit-task-title').focus();
}

document.getElementById('btn-edit-cancel').addEventListener('click', () => {
    document.getElementById('edit-task-modal').classList.remove('open');
});

document.getElementById('btn-edit-confirm').addEventListener('click', () => {
    const title = document.getElementById('edit-task-title').value.trim();
    if (!title) { document.getElementById('edit-task-title').focus(); return; }
    const desc = document.getElementById('edit-task-desc').value.trim();
    const priority = document.getElementById('edit-task-priority').value;
    const board = kanbanData[currentBoard];
    const card = board.columns[editingCardCol].find(c => c.id === editingCardId);
    if (!card) return;
    card.title = title;
    card.desc = desc;
    card.priority = priority;
    saveKanban();
    renderKanban();
    document.getElementById('edit-task-modal').classList.remove('open');
    showToast('Tarefa atualizada!', 'fa-check');
});

document.getElementById('edit-task-modal').addEventListener('click', e => {
    if (e.target === e.currentTarget) e.currentTarget.classList.remove('open');
});

loadKanban();


// ─── FUNIL DE VENDAS ─────────────────────────────────────────────────────────
const FUNIL_KEY = 'mktjur_funil';

const STAGES = [
    { key: 'atracao',    label: 'Atração',        icon: 'fa-magnet' },
    { key: 'qualif',     label: 'Qualificação',    icon: 'fa-filter' },
    { key: 'consulta',   label: 'Consulta Inicial',icon: 'fa-comments' },
    { key: 'proposta',   label: 'Proposta',        icon: 'fa-file-signature' },
    { key: 'contrato',   label: 'Contratação',     icon: 'fa-handshake' },
    { key: 'fidelizacao',label: 'Fidelização',     icon: 'fa-heart' },
];

let funilData = null;
let nextProspectId = 200;

function loadFunil() {
    const raw = localStorage.getItem(FUNIL_KEY);
    if (raw) {
        try { funilData = JSON.parse(raw); } catch(e) { funilData = emptyFunil(); }
    } else {
        funilData = defaultFunil();
    }
    renderFunil();
}

function emptyFunil() {
    const d = {};
    STAGES.forEach(s => d[s.key] = []);
    return d;
}

function defaultFunil() {
    return {
        atracao: [
            { id: 200, name: 'Dr. Renato Lima', area: 'Consulta Trabalhista', date: today() },
            { id: 201, name: 'Dra. Patrícia Nunes', area: 'Assessoria Empresarial', date: today() },
        ],
        qualif: [
            { id: 202, name: 'Marcos Ferreira', area: 'Divórcio Consensual', date: today() },
        ],
        consulta: [
            { id: 203, name: 'Luísa Carvalho', area: 'Inventário Extrajudicial', date: today() },
        ],
        proposta: [],
        contrato: [
            { id: 204, name: 'Escritório Silva & Assis', area: 'Assessoria Mensal', date: today() },
        ],
        fidelizacao: [
            { id: 205, name: 'Dr. Eduardo Torres', area: 'Cliente Fidelizado', date: today() },
        ]
    };
}

function saveFunil() {
    localStorage.setItem(FUNIL_KEY, JSON.stringify(funilData));
}

function renderFunil() {
    // stats
    const total = STAGES.reduce((n, s) => n + (funilData[s.key]?.length || 0), 0);
    const emNeg = (funilData.qualif?.length || 0) + (funilData.consulta?.length || 0) + (funilData.proposta?.length || 0);
    const convertidos = funilData.contrato?.length || 0;
    const taxa = total > 0 ? Math.round((convertidos / total) * 100) : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-negociacao').textContent = emNeg;
    document.getElementById('stat-convertidos').textContent = convertidos;
    document.getElementById('stat-taxa').textContent = taxa + '%';

    // columns
    STAGES.forEach((stage, idx) => {
        const colEl = document.getElementById(`funil-col-${stage.key}`);
        colEl.innerHTML = '';
        const cards = funilData[stage.key] || [];

        // update count
        document.getElementById(`funil-count-${stage.key}`).textContent = cards.length + (cards.length === 1 ? ' lead' : ' leads');

        if (cards.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'funil-empty';
            empty.innerHTML = '<i class="fas fa-user-slash"></i>Nenhum lead';
            colEl.appendChild(empty);
        } else {
            cards.forEach(p => colEl.appendChild(createProspectEl(p, stage.key, idx)));
        }
    });
}

function createProspectEl(prospect, stageKey, stageIdx) {
    const div = document.createElement('div');
    div.className = 'prospect-card';
    const prevStage = stageIdx > 0 ? STAGES[stageIdx - 1] : null;
    const nextStage = stageIdx < STAGES.length - 1 ? STAGES[stageIdx + 1] : null;

    let actions = `<button class="btn-move btn-prospect-del" onclick="removeProspect(${prospect.id},'${stageKey}')"><i class="fas fa-times"></i> Remover</button>`;
    if (nextStage) actions += `<button class="btn-move btn-move-fwd" onclick="moveProspect(${prospect.id},'${stageKey}','${nextStage.key}')"><i class="fas fa-arrow-right"></i> ${nextStage.label}</button>`;
    if (prevStage) actions += `<button class="btn-move" onclick="moveProspect(${prospect.id},'${stageKey}','${prevStage.key}')"><i class="fas fa-arrow-left"></i></button>`;

    div.innerHTML = `
        <div class="prospect-name">${prospect.name}</div>
        <div class="prospect-area">${prospect.area}</div>
        <div class="prospect-date"><i class="fas fa-calendar"></i> ${prospect.date}</div>
        <div class="prospect-actions">${actions}</div>`;
    return div;
}

function moveProspect(id, fromKey, toKey) {
    const idx = funilData[fromKey].findIndex(p => p.id === id);
    if (idx === -1) return;
    const [p] = funilData[fromKey].splice(idx, 1);
    funilData[toKey].push(p);
    saveFunil();
    renderFunil();
    const toLabel = STAGES.find(s => s.key === toKey)?.label || toKey;
    showToast(`Movido para ${toLabel}!`, 'fa-arrows-alt');
}

function removeProspect(id, stageKey) {
    funilData[stageKey] = funilData[stageKey].filter(p => p.id !== id);
    saveFunil();
    renderFunil();
    showToast('Lead removido.', 'fa-trash');
}

document.getElementById('btn-add-prospect').addEventListener('click', () => {
    const name = document.getElementById('prospect_name').value.trim();
    const area = document.getElementById('prospect_area').value.trim();
    const stage = document.getElementById('prospect_stage').value;
    if (!name) { document.getElementById('prospect_name').focus(); return; }
    funilData[stage].push({ id: nextProspectId++, name, area: area || 'Área não informada', date: today() });
    saveFunil();
    renderFunil();
    document.getElementById('prospect_name').value = '';
    document.getElementById('prospect_area').value = '';
    showToast('Lead adicionado!');
});

loadFunil();

// expose for onclick handlers
window.deleteCard = deleteCard;
window.moveProspect = moveProspect;
window.removeProspect = removeProspect;


// ─── ANÁLISE PESTEL ──────────────────────────────────────────────────────────
const PESTEL_KEY = 'mktjur_pestel';

const PESTEL_EXAMPLES = {
    trabalhista: {
        p_oport: 'Reforma trabalhista gera demanda por reinterpretação de contratos e consultoria preventiva\nNovas normas sobre teletrabalho e home office abrem novo mercado\nDesjudicialização incentivando mediação e acordos extrajudiciais',
        p_risco: 'Mudanças políticas podem reduzir proteções trabalhistas e diminuir litígios\nRestrições do Código de Ética da OAB à publicidade ativa limitam canais de captação',
        p_acao: 'Monitorar projetos de lei trabalhistas e publicar análises semanais para se posicionar como referência\nParticipar de consultas públicas e comissões da OAB na área trabalhista',
        e_oport: 'Crise econômica aumenta demissões e processos trabalhistas em 30%+\nPMEs sem assessoria preventiva estruturada são um mercado subatendido\nCrescimento do empreendedorismo individual gerando nova demanda por orientação',
        e_risco: 'Recessão reduz capacidade de pagamento dos clientes pessoa física\nAumento de advogados trabalhistas baixando preços no mercado local',
        e_acao: 'Criar pacote de assessoria preventiva mensal para PMEs a partir de R$ 800/mês (valores apresentados apenas em propostas individuais)\nEstruturar reunião inicial de diagnóstico como etapa padrão do atendimento',
        s_oport: 'Maior consciência sobre direitos trabalhistas após cobertura midiática\nCrescimento de reclamações por home office e assédio no trabalho\nClasse trabalhadora mais informada e disposta a buscar orientação jurídica',
        s_risco: 'Plataformas de autoatendimento jurídico para casos simples\nDesconfiança cultural em relação ao custo de advogados',
        s_acao: 'Investir em conteúdo educativo para construir confiança e autoridade junto a trabalhadores e empresários\nPublicar conteúdo educativo com situações hipotéticas, sem expor casos reais nem prometer resultados',
        t_oport: 'IA jurídica reduzindo tempo em pesquisas de jurisprudência em 60%\nPlataformas digitais permitindo atendimento nacional sem escritório físico\nMarketing de conteúdo no LinkedIn com alto retorno orgânico para B2B',
        t_risco: 'LegalTechs com serviços automatizados competindo por cálculos de rescisão e FGTS\nVulnerabilidade de dados de clientes com processos sensíveis',
        t_acao: 'Adotar software jurídico com IA para ganhar eficiência e focar no trabalho estratégico\nImplementar contrato de confidencialidade digital e LGPD compliance',
        ec_oport: 'Escritório 100% digital reduzindo custos fixos e atraindo empresas ESG\nClientes valorizando fornecedores com política de sustentabilidade',
        ec_risco: 'Baixo impacto direto no segmento trabalhista — risco marginal',
        ec_acao: 'Comunicar escritório "paperless" como diferencial de modernidade e redução de custos',
        l_oport: 'Provimento 205/2021 permite marketing de conteúdo, LinkedIn e site profissional\nNormas trabalhistas em constante mudança criam demanda recorrente por atualização',
        l_risco: 'Vedação a publicidade ativa, captação mercantil e uso de títulos não reconhecidos\nRisco de processo disciplinar por marketing irregular ou captação via tabela de honorários',
        l_acao: 'Manter-se atualizado com o Código de Ética da OAB e usar apenas canais permitidos\nCriar política interna de marketing jurídico com checklist de conformidade',
        resumo_oport: 'A reforma trabalhista e o aumento de demissões geram alta demanda por consultoria preventiva para PMEs — momento ideal para lançar pacote de assessoria mensal recorrente.',
        resumo_risco: 'As restrições da OAB à publicidade limitam canais de aquisição. Mitigar com foco em indicação estruturada (contadores, RH) e marketing de conteúdo dentro das normas do Provimento 205/2021.',
        resumo_acao: 'Lançar blog jurídico com 2 artigos/semana sobre temas trabalhistas, iniciar parceria formal com 3 escritórios de contabilidade e criar pacote preventivo para PMEs no próximo trimestre.',
    },
    familia: {
        p_oport: 'Novas normas sobre guarda compartilhada e alimentos ampliam serviços oferecidos\nInventário extrajudicial consolidado como alternativa rápida ao processo judicial\nPolítica nacional de desjudicialização incentivando mediação familiar',
        p_risco: 'Agenda política pode atrasar reformas no Código Civil\nOAB restringe captação ativa de clientes em momento de vulnerabilidade emocional',
        p_acao: 'Monitorar projetos de lei sobre família e publicar análises antes da aprovação para se posicionar\nFocar em marketing de conteúdo acolhedor e educativo, não em captação direta',
        e_oport: 'Crescimento do número de divórcios em períodos de crise financeira (+15% em recessão)\nMercado de inventários extrajudiciais com alto ticket médio (R$ 8.000–15.000)\nExpansão do atendimento online eliminando barreira geográfica',
        e_risco: 'Clientes em situação de vulnerabilidade financeira durante separação ou inventário\nConcorrência de escritórios generalistas que cobram menos',
        e_acao: 'Oferecer consulta inicial acessível (R$ 200) e parcelamento em casos consensuais\nCriar pacote de inventário extrajudicial com preço fixo e transparente',
        s_oport: 'Aumento de famílias recompostas e novos arranjos familiares gerando demanda\nMaior disposição para buscar mediação como alternativa ao litígio\nConscientização sobre impacto do divórcio litigioso nas crianças',
        s_risco: 'Estigma social ainda dificulta busca de ajuda jurídica em famílias tradicionais\nClientes vulneráveis susceptíveis a promessas falsas de concorrentes',
        s_acao: 'Comunicar serviços de forma acolhedora, sigilosa e sem julgamento em todo o marketing\nParceria ativa com psicólogos e terapeutas como fonte de indicação qualificada',
        t_oport: 'Mediação online reduzindo custo e tempo dos processos em 40%\nAssinatura digital de acordos agilizando inventários extrajudiciais\nConteúdo no Instagram com alto alcance orgânico entre mulheres 35–55 anos',
        t_risco: 'Plataformas de divórcio online por R$ 800 atraindo casos simples\nRisco de vazamento de dados sensíveis de famílias',
        t_acao: 'Diferenciar pelo atendimento online humanizado vs plataformas automatizadas\nImplementar política LGPD rigorosa e comunicá-la como garantia de sigilo',
        ec_oport: 'Escritório digital elimina deslocamento, facilitando atendimento para cidades do interior\nConscientização ambiental alinhada com o público-alvo progressista',
        ec_risco: 'Baixo impacto direto no segmento de família',
        ec_acao: 'Expandir atendimento online para outras regiões do estado e comunicar como conveniência',
        l_oport: 'Provimento 205/2021 permite Instagram com conteúdo educativo sobre família\nInventário extrajudicial regulamentado e crescendo como área de alta demanda',
        l_risco: 'Restrições éticas à captação em momentos de vulnerabilidade (luto, separação)\nVedação ao sensacionalismo e à exploração da situação emocional do cliente',
        l_acao: 'Focar em conteúdo educativo e indicações de psicólogos, evitando qualquer apelo emocional mercantil',
        resumo_oport: 'O crescimento de divórcios em períodos de crise e o mercado de inventários extrajudiciais criam alta demanda — oportunidade de criar pacotes com preço fixo e atendimento online para todo o Brasil.',
        resumo_risco: 'As restrições éticas à captação em momentos de vulnerabilidade exigem atenção. Mitigar com marketing de conteúdo educativo, parcerias com psicólogos e foco em posicionamento de longo prazo.',
        resumo_acao: 'Publicar 3 Reels educativos/semana no Instagram, fechar parceria com 3 psicólogos e lançar e-book "Guia do Divórcio sem Trauma" para captar 200 leads qualificados.',
    },
    empresarial: {
        p_oport: 'Reforma tributária gerando demanda massiva por reestruturação societária\nReforma administrativa abrindo oportunidades de compliance para empresas públicas e privadas\nNovas regulações de IA e dados criando nova área de especialização jurídica',
        p_risco: 'Instabilidade política aumentando custo de capital para clientes\nMudanças regulatórias frequentes dificultando planejamento dos clientes',
        p_acao: 'Tornar-se referência na reforma tributária com webinars, guias e análises antecipadas\nPublicar análise rápida a cada mudança regulatória relevante para o setor',
        e_oport: 'Ecossistema de startups em crescimento precisando de suporte jurídico inicial\nEmpresários buscando reduzir carga tributária em tempos de crise\nCrescimento de M&A no setor de tecnologia e saúde',
        e_risco: 'Grandes escritórios com estrutura maior disputando os mesmos clientes\nCrise econômica aumentando inadimplência de clientes PME',
        e_acao: 'Especializar em startups e contratos de tecnologia como nicho não disputado pelos grandes escritórios\nExigir sinal de 40% e usar contrato robusto de honorários de êxito',
        s_oport: 'Empresários buscando clareza jurídica sem juridiquês e com foco em negócios\nCrescimento da cultura de compliance entre PMEs e startups\nFounders jovens mais abertos a modelos de assinatura mensal',
        s_risco: 'Descrença inicial de founders em advogados percebidos como caros\nConfusão entre serviços do advogado empresarial e do contador',
        s_acao: 'Comunicar valor em linguagem de negócios (ROI, risco financeiro, proteção patrimonial)\nCriar conteúdo explicando claramente o papel do advogado empresarial vs contador',
        t_oport: 'LGPD e regulação de IA criando nova demanda especializada de alto valor\nPlataformas de assinatura digital reduzindo custo operacional de contratos\nConteúdo no LinkedIn com alto alcance entre founders e CFOs',
        t_risco: 'Contratos gerados por IA reduzindo demanda por trabalho jurídico simples\nLegalTechs automatizando due diligence básica',
        t_acao: 'Adotar IA internamente para ganhar eficiência e focar em estratégia jurídica e regulatória\nCriar plataforma cliente com acesso digital 24/7 a documentos como diferencial',
        ec_oport: 'Empresas exigindo ESG de fornecedores, incluindo escritórios jurídicos\nIncentivos fiscais para empresas sustentáveis gerando oportunidades de consultoria',
        ec_risco: 'Clientes industriais com passivo ambiental complexo aumentando risco de responsabilidade',
        ec_acao: 'Oferecer due diligence ESG e consultoria de incentivos fiscais verdes como serviço complementar',
        l_oport: 'Proteção de dados e propriedade intelectual crescendo como áreas críticas e de alto valor\nProvimento 205/2021 permite ampla presença no LinkedIn com conteúdo educativo',
        l_risco: 'Restrições de confidencialidade limitando uso público de cases de sucesso\nRisco de responsabilidade civil por planejamento mal estruturado',
        l_acao: 'Demonstrar autoridade com artigos técnicos e conteúdo educativo autoral, sem expor casos ou clientes\nManter seguro de responsabilidade profissional e documentar todos os pareceres',
        resumo_oport: 'A reforma tributária é a maior oportunidade do século para advogados empresariais — tornar-se referência com webinars, guias e análises antecipadas pode gerar dezenas de leads qualificados em 90 dias.',
        resumo_risco: 'A concorrência com grandes escritórios e LegalTechs exige diferenciação clara. Mitigar com especialização em startups e PMEs, linguagem de negócios e modelo de assinatura mensal acessível.',
        resumo_acao: 'Publicar guia sobre Reforma Tributária 2025, lançar webinar educativo para startups e fechar 2 contratos de assessoria mensal nos próximos 60 dias.',
    },
    tributario: {
        p_oport: 'Reforma tributária é a maior mudança em 50 anos — maior oportunidade do século para tributaristas\nCriação do IBS, CBS e IS gera demanda massiva por restruturação societária\nTransição de 7 anos criando consultoria recorrente de longo prazo',
        p_risco: 'Instabilidade política pode alterar regras da transição e criar incerteza para planejamento\nNovas regulações constantemente alterando o que já foi planejado',
        p_acao: 'Tornar-se referência na reforma tributária com webinars mensais, newsletters e análises semanais\nPublicar calculadoras e simuladores de impacto da reforma para gerar leads',
        e_oport: 'Empresas buscando reduzir carga tributária em tempos de crise\nTese de "recuperação de créditos" gerando alto potencial de honorários de êxito\nPlanejamento sucessório com foco tributário crescendo entre empresários',
        e_risco: 'Inadimplência de clientes PME em dificuldade financeira\nConcorrência de escritórios contábeis oferecendo serviços jurídicos de forma irregular',
        e_acao: 'Exigir sinal de 40% em casos de recuperação de crédito\nDiferenciar claramente advogado tributário de contador em todo o marketing',
        s_oport: 'PMEs sem contador especializado precisando urgentemente de orientação tributária\nEmpresários buscando planejamento sucessório para proteger patrimônio familiar\nCrescimento da consciência sobre planejamento tributário como necessidade, não luxo',
        s_risco: 'Confusão do mercado entre advogado tributário e contador\nPercepção de que planejamento tributário é exclusivo para grandes empresas',
        s_acao: 'Criar conteúdo educativo mostrando casos de PMEs economizando 20–30% em tributos com planejamento\nComunicar o ROI concreto do serviço em todos os materiais de marketing',
        t_oport: 'Softwares de planejamento tributário e simuladores como ferramenta diferencial competitiva\nIA para análise de créditos fiscais reduzindo tempo de trabalho e aumentando precisão\nConteúdo sobre reforma tributária no LinkedIn com altíssimo alcance orgânico',
        t_risco: 'Soluções de IA para cálculo tributário básico reduzindo demanda por trabalho simples\nSoftwares contábeis com funcionalidades jurídicas invadindo o mercado',
        t_acao: 'Usar tecnologia internamente como vantagem operacional e focar em planejamento estratégico complexo\nCriar calculadoras e ferramentas digitais para gerar leads e demonstrar expertise',
        ec_oport: 'Incentivos fiscais para empresas sustentáveis (IPTU verde, ISS reduzido) gerando nova especialidade\nEmpresas buscando créditos tributários em projetos de energia renovável',
        ec_risco: 'Baixo impacto direto no segmento tributário principal',
        ec_acao: 'Desenvolver expertise em incentivos fiscais verdes como nicho complementar de alto crescimento',
        l_oport: 'Constantes mudanças na legislação tributária criam demanda contínua e recorrente\nProvimento 205/2021 permite publicação de análises técnicas e artigos no LinkedIn',
        l_risco: 'Risco de responsabilidade civil por planejamento mal estruturado ou abusivo\nFronteiras tênues entre planejamento tributário legítimo e evasão fiscal',
        l_acao: 'Manter seguro de responsabilidade profissional e documentar rigorosamente todos os pareceres\nEstabelecer critérios claros de conformidade para planejamentos ofertados',
        resumo_oport: 'A reforma tributária representa a maior oportunidade da geração — tornar-se referência agora, antes da implementação plena, pode garantir uma carteira de clientes recorrentes por 7+ anos.',
        resumo_risco: 'O risco de responsabilidade civil em planejamentos agressivos é real. Mitigar com documentação rigorosa, pareceres formais e seguro de responsabilidade profissional atualizado.',
        resumo_acao: 'Lançar webinar educativo sobre Reforma Tributária para PMEs, publicar análise semanal no LinkedIn e criar calculadora de impacto da reforma para gerar 100+ leads qualificados em 60 dias.',
    }
};

function savePestel() {
    const data = {};
    document.querySelectorAll('#pestel-panel [data-pestel]').forEach(el => {
        data[el.dataset.pestel] = el.value;
    });
    data.__area = document.getElementById('pestel-area').value;
    data.__size = document.getElementById('pestel-size').value;
    data.__scope = document.getElementById('pestel-scope').value;
    localStorage.setItem(PESTEL_KEY, JSON.stringify(data));
    showToast('Análise PESTEL salva!');
}

function loadPestelData() {
    const raw = localStorage.getItem(PESTEL_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        document.querySelectorAll('#pestel-panel [data-pestel]').forEach(el => {
            if (data[el.dataset.pestel] !== undefined) el.value = data[el.dataset.pestel];
        });
        if (data.__area) document.getElementById('pestel-area').value = data.__area;
        if (data.__size) document.getElementById('pestel-size').value = data.__size;
        if (data.__scope) document.getElementById('pestel-scope').value = data.__scope;
    } catch(e) {}
}

function clearPestel() {
    if (!confirm('Limpar todos os campos da análise PESTEL?')) return;
    document.querySelectorAll('#pestel-panel [data-pestel]').forEach(el => el.value = '');
    document.getElementById('pestel-area').value = '';
    document.getElementById('pestel-size').value = '';
    document.getElementById('pestel-scope').value = '';
    localStorage.removeItem(PESTEL_KEY);
    showToast('Análise PESTEL limpa.', 'fa-trash');
}

function loadPestelExample() {
    const area = document.getElementById('pestel-area').value;
    if (!area) { showToast('Selecione a área de atuação primeiro.', 'fa-exclamation-triangle'); return; }
    const ex = PESTEL_EXAMPLES[area];
    if (!ex) { showToast('Exemplo não disponível para esta área.', 'fa-info-circle'); return; }
    Object.entries(ex).forEach(([key, val]) => {
        const el = document.querySelector(`#pestel-panel [data-pestel="${key}"]`);
        if (el) el.value = val;
    });
    showToast('Exemplo carregado!', 'fa-magic');
}

// PESTEL examples tabs
document.querySelectorAll('.pestel-ex-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.pestel-ex-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.pestel-ex-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(`pestel-ex-${tab.dataset.ex}`).classList.add('active');
    });
});

document.getElementById('btn-save-pestel').addEventListener('click', savePestel);
document.getElementById('btn-clear-pestel').addEventListener('click', clearPestel);
document.getElementById('btn-print-pestel').addEventListener('click', () => window.print());
document.getElementById('btn-load-pestel-example').addEventListener('click', loadPestelExample);

document.getElementById('btn-print-pestel').addEventListener('click', () => window.print());
document.getElementById('btn-load-pestel-example').addEventListener('click', loadPestelExample);

loadPestelData();


// ─── ANÁLISE COMPETITIVA ──────────────────────────────────────────────────────
const COMPETITIVA_KEY = 'mktjur_competitiva';

const COMPETITIVA_EXAMPLES = {
    trabalhista: {
        dir_quem: 'Advogados trabalhistas da cidade com foco em contencioso para empregados\nEscritórios generalistas com sócio trabalhista atendendo de tudo\nCentros de atendimento jurídico de sindicatos com serviço gratuito',
        dir_vantagem: 'Poucos com modelo preventivo voltado para PMEs (empregadores)\nPoucos com presença digital ativa e conteúdo B2B para empresários\nNenhum com modelo de assinatura mensal com preço fixo e previsível',
        dir_acao: 'Pesquisar os 5 principais concorrentes locais no LinkedIn e Google Meu Negócio para mapear posicionamento, serviços ofertados e avaliações de clientes',
        ind_quem: 'Contadores e escritórios de contabilidade orientando PMEs informalmente sobre questões trabalhistas\nConsultores de RH fazendo análise de risco trabalhista sem base jurídica sólida\nEscritórios generalistas captando clientes PME com promessa de "cuidar de tudo"',
        ind_impacto: 'Contadores capturando consultas iniciais trabalhistas e resolvendo informalmente\nGeneralistas ganhando clientes pela variedade de serviços, não pela especialização\nRisco de o cliente resolver questões complexas sem advogado especializado',
        ind_acao: 'Construir relacionamento institucional com contadores: conteúdo técnico exclusivo e eventos educativos conjuntos (sem contrapartida por indicação, vedada pela OAB)',
        sub_plataformas: 'Plataformas online de rescisão e acordo por R$ 200–400\nIA jurídica (ChatGPT, Copilot) para redigir contratos e notificações básicas\nSindicatos com departamento jurídico gratuito para trabalhadores',
        sub_risco: 'Casos simples de rescisão sendo resolvidos sem advogado por R$ 200–400\nClientes usando IA para redigir contratos de trabalho sem revisão especializada\nSindicatos capturando trabalhadores que poderiam ser clientes pagantes',
        sub_acao: 'Criar conteúdo educativo sobre riscos de rescisão mal calculada demonstrando que o custo do erro é 10–50x o valor do advogado especializado',
        dig_status: 'Maioria dos concorrentes locais com Google Meu Negócio desatualizado ou incompleto\nPoucos com conteúdo no LinkedIn voltado para empresários e donos de PME\nNenhum concorrente local com blog de SEO ativo para "advogado trabalhista [cidade]"',
        dig_oport: 'Oportunidade de dominar o ranking local de SEO em 90–180 dias com publicação consistente\nLinkedIn com alto alcance orgânico entre donos de PME, RHs e contadores\nGoogle Meu Negócio otimizado captura quem pesquisa jurídico trabalhista na cidade',
        dig_acao: 'Configurar Google Meu Negócio completo + solicitar 20 avaliações de clientes antigos + publicar 1 artigo/mês otimizado para "advogado trabalhista [cidade]" com foco em empregadores',
        pos_atual: 'Maioria posicionada como "advogado de trabalhador" — deixando o nicho de empregadores aberto\nPreços geralmente por hora ou êxito sem transparência; poucos com assinatura mensal\nPoucos comunicam ROI ou valor preventivo do serviço, apenas reativo',
        pos_risco: 'Mercado comoditizado: clientes comparam apenas preço sem entender diferencial de especialização\nPercepção genérica de que todos os trabalhistas fazem a mesma coisa\nDificuldade em comunicar o valor preventivo (evitar processos) vs valor reativo',
        pos_acao: 'Posicionar claramente como "jurídico trabalhista para empresas" com mensagem de previsibilidade (assinatura mensal, preço fixo) diferenciando do mercado reativo',
        exp_status: 'Concorrentes com tempo médio de resposta de 1–5 dias úteis\nAtendimento predominantemente presencial sem canal digital ágil\nSem portal do cliente, relatório periódico ou comunicação proativa',
        exp_diferencial: 'WhatsApp Business com resposta garantida em 2h úteis\nRelatório mensal de riscos trabalhistas para clientes de assinatura\nOnboarding estruturado com checklist de riscos na 1ª semana do contrato',
        exp_acao: 'Implementar WhatsApp Business com mensagem automática + criar modelo de "Relatório Mensal de Riscos" padrão para todos os clientes de assinatura',
        resumo_diferenciacao: 'Único escritório trabalhista da região especializado em proteção preventiva de PMEs, com modelo de assinatura mensal (preço fixo), WhatsApp com resposta em 2h e relatório mensal de riscos — combinação que nenhum concorrente local oferece.',
        resumo_lacuna: 'O nicho de "jurídico trabalhista preventivo para PMEs com modelo de assinatura" está completamente vazio no mercado local. 95% da concorrência é 100% reativa. Ser o primeiro a ocupar esse posicionamento com consistência cria barreira competitiva difícil de replicar.',
        resumo_acao: '1. Mapear 5 concorrentes no LinkedIn e Google Meu Negócio (Semana 1)\n2. Configurar Google Meu Negócio completo + solicitar 20 avaliações (Semana 2)\n3. Lançar "Pacote Preventivo PME" R$ 800/mês com proposta e landing page (Semana 3)\n4. Publicar artigo de SEO "riscos trabalhistas que PMEs ignoram" (Semana 4)\n5. Visitar e apresentar proposta de parceria para 10 contadores locais (Mês 2)',
    },
    familia: {
        dir_quem: 'Advogados de família da cidade com foco em litígio e disputa de guarda\nEscritórios generalistas com sócio de família atendendo de tudo\nDefensores públicos para casos de gratuidade de justiça',
        dir_vantagem: 'Poucos com certificação em mediação familiar homologada\nPoucos com parceria formal com psicólogos para atendimento integrado\nNenhum com taxa de acordos documentada e comunicada publicamente',
        dir_acao: 'Pesquisar os 5 advogados de família mais visíveis na cidade no Google e Instagram para entender posicionamento e serviços ofertados',
        ind_quem: 'Psicólogos e terapeutas que orientam clientes sobre separação informalmente\nNotários e tabeliães captando inventários extrajudiciais de forma direta\nPlataformas de mediação digital como Acordo Fácil e Resolve Já',
        ind_impacto: 'Psicólogos com clientes em processo de separação que ainda não buscaram advogado — canal de indicação inexplorado\nTabeliães captando casos de inventário diretamente, sem advogado\nClientes buscando mediadores independentes antes de contratar advogado',
        ind_acao: 'Criar rede de indicação formal com 5 psicólogos, 3 terapeutas e 2 cartórios parceiros — oferecer palestra educativa sobre aspectos jurídicos do divórcio para seus pacientes',
        sub_plataformas: 'Plataformas de divórcio online consensual por R$ 800–1.500\nServidor de autocomposição online do CNJ (CEJUSC digital)\nIA gerando minutas de acordo de divórcio e inventário básico',
        sub_risco: 'Casos consensuais simples migrando para plataformas digitais a custo 60–80% menor\nCasais sem bens e sem filhos optando por divórcio extrajudicial sem advogado\nPercepção de que o divórcio "simples" não precisa de especialista',
        sub_acao: 'Comunicar que divórcio com filhos menores, bens compartilhados ou qualquer conflito exige advogado especializado — o acordo mal feito pode ser revisado judicialmente por anos',
        dig_status: 'Concorrentes predominantemente no Instagram com conteúdo genérico sobre divórcio\nPoucos com SEO otimizado para "advogado de família [cidade]"\nAusência de conteúdo acolhedor para quem está em momento de vulnerabilidade',
        dig_oport: 'Instagram com alto alcance orgânico para mulheres 35–55 anos — público-alvo principal\nSEO local para "advogado divórcio [cidade]" e "inventário extrajudicial [cidade]" com pouca concorrência\nConteúdo acolhedor e humanizado gera maior identificação e confiança que conteúdo técnico',
        dig_acao: 'Calendário de conteúdo mensal para Instagram com 3 posts/semana acolhedores + 1 artigo de blog/mês para SEO "advogado família [cidade]"',
        pos_atual: 'Maioria posicionada como "advogado de família" genérico sem nicho comunicado\nPreços geralmente por procedimento sem transparência ou opções de parcelamento\nPoucos comunicam índice de acordos ou metodologia humanizada como diferencial',
        pos_risco: 'Competição por preço em casos simples com plataformas digitais e generalistas\nDificuldade de comunicar diferencial de humanização vs advogado técnico convencional\nClientes em momento de vulnerabilidade tendem a escolher o primeiro contato, não o melhor',
        pos_acao: 'Comunicar a certificação em mediação, a parceria psicológica e a metodologia humanizada em TODOS os pontos de contato (sem divulgar taxas de êxito, vedado pela OAB) — site, Instagram, Google Meu Negócio e no primeiro atendimento',
        exp_status: 'Atendimento frio, formal e técnico — focado no processo, não na pessoa\nCliente navega sozinho sem suporte emocional ou orientação proativa\nComunicação esporádica sobre andamento do processo',
        exp_diferencial: 'Atendimento integrado com psicólogo parceiro desde o primeiro contato\n1ª sessão com psicólogo inclusa como parte do pacote de divórcio\nWhatsApp com comunicação proativa sobre andamento do processo',
        exp_acao: 'Incluir 1 sessão com psicólogo parceiro no pacote de divórcio consensual como diferencial; comunicar isso em toda a divulgação como o que separa de todos os concorrentes',
        resumo_diferenciacao: 'Único escritório da cidade com atendimento jurídico + psicológico integrado, certificação em mediação e metodologia humanizada que coloca o bem-estar da família acima do litígio — diferencial impossível de replicar rapidamente.',
        resumo_lacuna: 'O mercado de família está saturado em litígio reativo. O nicho de "advocacia familiar humanizada com suporte psicológico integrado" está vazio na maioria das cidades. Famílias em crise emocional pagam mais por quem as trata como pessoas, não como processos.',
        resumo_acao: '1. Mapear os 5 principais advogados de família no Google/Instagram (Semana 1)\n2. Formalizar parceria com 3 psicólogos e 2 terapeutas com proposta de indicação (Semana 2)\n3. Otimizar Google Meu Negócio + pedir 15 avaliações (Semana 2–3)\n4. Criar post de Instagram apresentando metodologia humanizada e parceria psicológica (Semana 3)\n5. Incluir 1 sessão de psicólogo no pacote de divórcio e comunicar nos canais (Semana 4)',
    },
    empresarial: {
        dir_quem: 'Grandes escritórios full-service com times completos e clientes de grande porte\nBoutiques especializadas em M&A, contratos ou LGPD\nEscritórios generalistas com sócio empresarial atendendo de tudo',
        dir_vantagem: 'Boutiques raramente falam a linguagem de negócios de founders e startups\nGrandes escritórios têm custo inacessível para PMEs e startups em fase inicial\nGeneralistas não têm profundidade em regulação de IA, LGPD ou contratos de tecnologia',
        dir_acao: 'Mapear os 5 principais escritórios empresariais da cidade no LinkedIn e analisar para quem comunicam, qual linguagem usam e quais serviços destacam',
        ind_quem: 'Consultorias de gestão e estratégia incluindo análise de risco jurídico no escopo\nEscritórios de contabilidade com departamento de planejamento societário\nAcceleradoras e hubs de inovação com advogado residente próprio',
        ind_impacto: 'Fundadores buscando consultores de gestão que "entendem o negócio" antes de buscar advogado\nContadores captando startups com proposta de planejamento societário e tributário completo\nAcceleradoras com advogado parceiro bloqueando acesso a seu portfólio de startups',
        ind_acao: 'Candidatar-se como advogado parceiro de 2 aceleradoras e 1 hub de inovação nos próximos 60 dias — oferecer palestras e conteúdo educativo sobre temas jurídicos para o ecossistema',
        sub_plataformas: 'LegalTechs de contratos automatizados (Contraktor, DocuSign + templates IA)\nIA generativa para minutas de NDA, prestação de serviços e acordos simples\nPlataformas de due diligence automatizada para M&A de pequeno porte',
        sub_risco: 'Contratos simples sendo gerados por IA sem revisão especializada — criando riscos que o cliente não vê\nStartups acreditando que template de NDA por IA é suficiente para proteger IP\nDue diligence básica sendo feita internamente com ferramentas digitais',
        sub_acao: 'Focar em serviços de alto valor estratégico que IA não substitui: M&A complexo, LGPD estratégica, regulação de IA, propriedade intelectual e governança',
        dig_status: 'Poucos escritórios empresariais com presença ativa no LinkedIn falando para founders e CFOs\nConteúdo predominantemente técnico em juridiquês, sem linguagem de negócios\nAusência de análises sobre regulação de IA, LGPD e temas quentes para o ecossistema tech',
        dig_oport: 'LinkedIn com alto alcance orgânico entre founders, CFOs e investidores\nConteúdo sobre LGPD, regulação de IA e M&A em linguagem de negócios é raro e muito consumido\nWebinars educativos sobre temas jurídicos de startups geram leads qualificados de alto valor',
        dig_acao: 'Publicar 3x/semana no LinkedIn com análises jurídicas em linguagem de negócios + organizar 1 webinar educativo/mês sobre tema jurídico hot para o ecossistema de startups',
        pos_atual: 'Maioria posicionada como fornecedor de serviços jurídicos transacionais — não como parceiro estratégico\nCobrança por hora cria relação adversarial (cliente evita ligar para economizar)\nPoucos se posicionam em nichos como startups, fintechs ou healthtechs',
        pos_risco: 'Commoditização de serviços padrão por LegalTechs tornando difícil competir em preço\nClientes comparando preço por hora sem considerar profundidade e especialização\nPerda de clientes para escritórios maiores quando a startup escala',
        pos_acao: 'Reposicionar como "parceiro jurídico estratégico para startups e scale-ups" com modelo de assinatura mensal — preço fixo, previsível e alinhado com o modelo de negócio das startups',
        exp_status: 'Atendimento formal e hierárquico sem acesso direto ao especialista\nComunicação lenta; updates esporádicos sobre andamento de casos\nSem plataforma digital de acesso a documentos e contratos',
        exp_diferencial: 'Acesso direto ao sócio via WhatsApp com resposta em 2h úteis\nPortal cliente com acesso 24/7 a documentos, contratos e status dos casos\nRelatório mensal de risco jurídico com alertas de compliance proativos',
        exp_acao: 'Implementar portal do cliente (pode começar com Google Drive estruturado) + criar relatório mensal de risco jurídico padrão para clientes de assinatura',
        resumo_diferenciacao: 'Único escritório empresarial da região especializado em startups e scale-ups, falando a linguagem de negócios, com modelo de assinatura mensal previsível, acesso direto ao sócio e portal digital — o parceiro jurídico estratégico que fundadores procuram mas raramente encontram.',
        resumo_lacuna: 'O ecossistema de startups e PMEs de tecnologia está crescendo em todas as cidades, mas a maioria dos escritórios empresariais ainda fala para grandes empresas em linguagem técnica. O nicho de "jurídico empresarial para startups com modelo de assinatura e linguagem de negócios" está vazio na maioria dos mercados.',
        resumo_acao: '1. Mapear 5 concorrentes no LinkedIn analisando posicionamento e linguagem (Semana 1)\n2. Candidatar-se a 2 aceleradoras como advogado parceiro com proposta de mentoria (Semana 2)\n3. Publicar análise sobre regulação de IA ou LGPD no LinkedIn (Semana 2)\n4. Lançar modelo de assinatura mensal para startups com 3 opções de pacote (Semana 3–4)\n5. Organizar webinar educativo sobre LGPD ou regulação de IA para startups (Mês 2)',
    }
};

function saveCompetitiva() {
    const data = {};
    document.querySelectorAll('#competitiva-panel [data-comp]').forEach(el => {
        data[el.dataset.comp] = el.value;
    });
    data.__area = document.getElementById('comp-area').value;
    data.__size = document.getElementById('comp-size').value;
    data.__scope = document.getElementById('comp-scope').value;
    localStorage.setItem(COMPETITIVA_KEY, JSON.stringify(data));
    showToast('Análise Competitiva salva!');
}

function loadCompetitivaData() {
    const raw = localStorage.getItem(COMPETITIVA_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        document.querySelectorAll('#competitiva-panel [data-comp]').forEach(el => {
            if (data[el.dataset.comp] !== undefined) el.value = data[el.dataset.comp];
        });
        if (data.__area) document.getElementById('comp-area').value = data.__area;
        if (data.__size) document.getElementById('comp-size').value = data.__size;
        if (data.__scope) document.getElementById('comp-scope').value = data.__scope;
    } catch(e) {}
}

function clearCompetitiva() {
    if (!confirm('Limpar todos os campos da Análise Competitiva?')) return;
    document.querySelectorAll('#competitiva-panel [data-comp]').forEach(el => el.value = '');
    document.getElementById('comp-area').value = '';
    document.getElementById('comp-size').value = '';
    document.getElementById('comp-scope').value = '';
    localStorage.removeItem(COMPETITIVA_KEY);
    showToast('Análise Competitiva limpa.', 'fa-trash');
}

function loadCompetitivaExample() {
    const area = document.getElementById('comp-area').value;
    if (!area) { showToast('Selecione a área de atuação primeiro.', 'fa-exclamation-triangle'); return; }
    const ex = COMPETITIVA_EXAMPLES[area];
    if (!ex) { showToast('Exemplo não disponível para esta área.', 'fa-info-circle'); return; }
    Object.entries(ex).forEach(([key, val]) => {
        const el = document.querySelector(`#competitiva-panel [data-comp="${key}"]`);
        if (el) el.value = val;
    });
    showToast('Exemplo carregado!', 'fa-magic');
}

// Competitiva examples tabs
document.querySelectorAll('#competitiva-panel .comp-ex-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('#competitiva-panel .comp-ex-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#competitiva-panel .comp-ex-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.ex).classList.add('active');
    });
});

document.getElementById('btn-save-comp').addEventListener('click', saveCompetitiva);
document.getElementById('btn-clear-comp').addEventListener('click', clearCompetitiva);
document.getElementById('btn-print-comp').addEventListener('click', () => window.print());
document.getElementById('btn-load-comp-example').addEventListener('click', loadCompetitivaExample);

loadCompetitivaData();


// ─── ANÁLISE SWOT ─────────────────────────────────────────────────────────────
const SWOT_KEY = 'mktjur_swot';

const SWOT_EXAMPLES = {
    trabalhista: {
        s_conhecimento: 'Especialização certificada em Direito do Trabalho\n10 anos de experiência em contencioso trabalhista complexo\nPalestrante reconhecido em eventos de RH e contabilidade',
        s_reputacao: 'Nota 4.9 no Google com 45 avaliações verificadas\nRede sólida de 8 contadores que indicam regularmente\n8 anos de experiência em casos contenciosos e preventivos',
        s_processos: 'Atendimento online para todo o Brasil\nRetorno garantido em 24 horas úteis\nCRM estruturado para gestão e follow-up de casos',
        w_capacidade: 'Escritório solo sem equipe de apoio\nTempo limitado para produção de conteúdo (máx. 3h/semana)\nSem expertise em marketing digital',
        w_marketing: 'LinkedIn com menos de 500 seguidores\nPresença no Instagram inexistente\nSem blog ativo com artigos de SEO',
        w_financeiro: 'Dependência de 2 grandes clientes (60% da receita)\nFluxo de caixa irregular (picos e vales)\nSem budget definido para marketing',
        o_mercado: 'Crescimento de 30% em reclamações trabalhistas pós-reforma\nPMEs sem assessoria preventiva estruturada — mercado subatendido\nDemanda crescente por consultoria sobre home office e teletrabalho',
        o_digital: 'LinkedIn com alto alcance orgânico para público empresarial\nMarketing de conteúdo com ROI comprovado na área jurídica\nAtendimento online eliminando barreira geográfica',
        o_parcerias: 'Parcerias com escritórios de contabilidade como fonte de indicação\nCo-marketing com consultores de RH\nPresença em associações empresariais regionais',
        t_concorrencia: 'Plataformas jurídicas online com preço 60% menor para casos simples\nSaturação de advogados trabalhistas na região\nEscritórios maiores com time de marketing profissional',
        t_regulacao: 'Vedação a publicidade ativa e captação mercantil pela OAB\nRisco de processo disciplinar por marketing irregular\nRestrições ao uso de tabelas de honorários em publicidade',
        t_mercado: 'IA automatizando cálculos de rescisão e documentos simples\nCrise econômica reduzindo tickets médios dos casos\nClientes cada vez mais pesquisando preços online antes de contratar',
        acao_so: 'Usar especialização trabalhista + crescimento de demanda preventiva → lançar "Pacote Preventivo PME" por R$ 800/mês incluindo: auditoria trabalhista trimestral, revisão de contratos e 2h de consultoria. Meta: 5 clientes recorrentes em 90 dias.',
        acao_wo: 'Resolver fraqueza no LinkedIn + alto alcance orgânico → contratar designer freelancer por R$ 400/mês para criar 3 peças/semana e publicar consistentemente por 60 dias. Meta: 1.500 seguidores qualificados.',
        acao_st: 'Usar reputação de especialista (nota 4.9) + ameaça das plataformas low-cost → criar campanha de conteúdo comunicando "o custo real de um processo trabalhista mal defendido". Diferenciação por profundidade técnica.',
        acao_wt: 'Reduzir dependência dos 2 grandes clientes + ameaça de recessão → implementar programa de indicação formal com desconto de 10% para clientes que indicarem, meta de diversificar para 8+ clientes recorrentes em 6 meses.',
    },
    familia: {
        s_conhecimento: 'Especialização certificada em Direito de Família e Sucessões\nCertificação em mediação familiar pelo CONIMA\nTreinamento em comunicação não-violenta e atendimento humanizado',
        s_reputacao: 'Parceria formal com psicóloga parceira — diferencial único na região\nNota 4.9 no Google com 30 avaliações verificadas\nCertificação em mediação com foco em acordo (reduz litígio e trauma)',
        s_processos: 'Atendimento 100% sigiloso e humanizado\nInstagram com 3.200 seguidores engajados\nAtendimento online para clientes de outras cidades',
        w_capacidade: 'Ticket médio baixo (R$ 3.500 vs média de mercado de R$ 5.000)\nAlta rotatividade de casos (baixa recorrência)\nDificuldade em cobrar honorários de clientes vulneráveis',
        w_marketing: 'Sem blog ou site com conteúdo de SEO\nAusência de estratégia de e-mail marketing\nDependência excessiva do Instagram como único canal digital',
        w_financeiro: 'Receita instável — concentração em casos consensuais simples de baixo ticket\nSem serviço recorrente como âncora financeira',
        o_mercado: 'Inventários extrajudiciais crescendo como serviço de alto ticket (R$ 8.000–15.000)\nCrescimento de famílias recompostas gerando novos tipos de demanda\nMercado de mediação pré-judicial em expansão',
        o_digital: 'Alta busca orgânica por "advogado divórcio [cidade]" no Google\nInstagram com altíssimo alcance para mulheres 35–55 anos — público-alvo\nAtendimento online eliminando barreira geográfica e de deslocamento',
        o_parcerias: 'Indicação de psicólogos, terapeutas e assistentes sociais\nParceria com cartórios para inventário extrajudicial\nCo-marketing com grupos de apoio a mulheres',
        t_concorrencia: 'Plataformas de divórcio online por R$ 800 para casos simples\nCrescimento de advogados especializados em família na região\nEscritórios generalistas cobrando menos e disputando casos consensuais',
        t_regulacao: 'Restrições éticas à captação ativa em momentos de vulnerabilidade emocional\nVedação ao sensacionalismo e exploração da situação do cliente em marketing',
        t_mercado: 'Percepção de custo elevado dificulta conversão de leads\nClientes vulneráveis susceptíveis a promessas irrealistas de concorrentes',
        acao_so: 'Usar parceria com psicóloga + crescimento de famílias recompostas → criar "Pacote Família Recomposta" com suporte jurídico e psicológico integrado. Preço: R$ 6.000. Comunicar como solução completa e humanizada.',
        acao_wo: 'Resolver falta de SEO + alta busca por "divórcio" no Google → criar blog com 2 artigos/mês otimizados para palavras-chave como "advogado divórcio [cidade]" e "inventário sem briga". Meta: ranking na 1ª página em 90 dias.',
        acao_st: 'Usar experiência em mediação + ameaça de plataformas baratas → comunicar ativamente que divórcio com filhos e bens compartilhados exige advogado especializado. Criar conteúdo sobre "o custo real do divórcio sem advogado".',
        acao_wt: 'Aumentar ticket médio + reduzir instabilidade financeira → incluir inventário extrajudicial no portfólio principal e criar meta de fechar 2 casos/mês com ticket médio de R$ 10.000.',
    },
    empresarial: {
        s_conhecimento: 'Equipe especializada em contratos B2B, M&A e LGPD\nLLM em Direito Empresarial e Contratos\nConhecimento profundo do ecossistema de startups e fintechs',
        s_reputacao: 'Carteira de 35 clientes recorrentes com MRR consolidado\nPresença forte em eventos e aceleradoras do ecossistema\nLinkedIn com 4.500 seguidores qualificados',
        s_processos: 'Modelo de assinatura mensal com preço fixo e previsível\nPlataforma digital de assinatura e gestão de documentos\nOnboarding estruturado com contrato e checklist digital',
        w_capacidade: 'Alta dependência de 3 clientes-chave representando 45% da receita\nProcesso de onboarding ainda manual e demorado\nSem área de contencioso — terceiriza toda a litigância',
        w_marketing: 'Blog com publicações irregulares (1–2 posts/mês)\nAusência de estratégia de remarketing e nutrição de leads\nSem case studies publicados com métricas de resultado',
        w_financeiro: 'Custo operacional alto em relação a escritórios menores\nModelo de precificação complexo dificulta comparação e conversão',
        o_mercado: 'Reforma tributária exigindo reestruturação societária massiva\nCrescimento de M&A no setor de tecnologia e saúde\nEmpresas internacionalizando e precisando de suporte jurídico especializado',
        o_digital: 'Regulação de IA e dados criando nova área de especialização de altíssimo valor\nLinkedIn com alto alcance orgânico entre founders, CEOs e CFOs\nWebinars educativos como geração de leads qualificados B2B',
        o_parcerias: 'Parcerias com aceleradoras e hubs de inovação como fonte de leads\nCo-marketing com escritórios de contabilidade especializados em startups\nParticipação em Demo Days e pitch events',
        t_concorrencia: 'Big 4 e consultorias oferecendo serviços jurídicos integrados\nLegalTechs automatizando contratos padrão e due diligence básica\nEscritórios menores cobrando menos para o mesmo escopo',
        t_regulacao: 'Restrições de confidencialidade limitando uso público de cases\nRisco de responsabilidade civil por planejamento societário mal estruturado',
        t_mercado: 'Guerra por talentos — risco real de perder sócios para concorrentes\nClientes comparando preços online com escritórios boutique menores',
        acao_so: 'Usar expertise em contratos + demanda da reforma tributária → lançar "Pacote Reestruturação Tributária 2025" para clientes existentes e prospectos. Webinar educativo de lançamento + artigo LinkedIn. Meta: 5 novos clientes em 60 dias.',
        acao_wo: 'Digitalizar onboarding + crescimento de M&A → criar plataforma cliente com acesso 24/7 a documentos, status dos casos e relatório mensal digital. Diferencial de experiência vs escritórios tradicionais.',
        acao_st: 'Usar presença consolidada no ecossistema de startups + ameaça das LegalTechs → posicionar como "parceiro jurídico estratégico de longo prazo", não fornecedor de contratos. Comunicar valor pelo que o advogado previne, não só pelo que executa.',
        acao_wt: 'Diversificar base de clientes + mitigar dependência excessiva → elevar a qualidade do atendimento e do conteúdo técnico para estimular indicações espontâneas, com meta de atingir 50 clientes recorrentes em 12 meses.',
    }
};

let swotTags = { s: [], w: [], o: [], t: [] };

function saveSWOT() {
    const data = {};
    document.querySelectorAll('#swot-panel [data-swot]').forEach(el => {
        data[el.dataset.swot] = el.value;
    });
    data.__tags = swotTags;
    localStorage.setItem(SWOT_KEY, JSON.stringify(data));
    showToast('Análise SWOT salva!');
}

function loadSWOTData() {
    const raw = localStorage.getItem(SWOT_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        document.querySelectorAll('#swot-panel [data-swot]').forEach(el => {
            if (data[el.dataset.swot] !== undefined) el.value = data[el.dataset.swot];
        });
        if (data.__tags) {
            swotTags = data.__tags;
            ['s','w','o','t'].forEach(q => renderSwotTags(q));
        }
    } catch(e) {}
}

function clearSWOT() {
    if (!confirm('Limpar todos os campos da análise SWOT?')) return;
    document.querySelectorAll('#swot-panel [data-swot]').forEach(el => el.value = '');
    swotTags = { s: [], w: [], o: [], t: [] };
    ['s','w','o','t'].forEach(q => renderSwotTags(q));
    localStorage.removeItem(SWOT_KEY);
    showToast('SWOT limpa.', 'fa-trash');
}

function loadSwotExample(key) {
    if (!key) return;
    const ex = SWOT_EXAMPLES[key];
    if (!ex) return;
    Object.entries(ex).forEach(([field, val]) => {
        const el = document.querySelector(`#swot-panel [data-swot="${field}"]`);
        if (el) el.value = val;
    });
    showToast('Exemplo SWOT carregado!', 'fa-magic');
}

function addSwotTag(quad) {
    const label = prompt(`Adicionar item rápido em ${quad === 's' ? 'Forças' : quad === 'w' ? 'Fraquezas' : quad === 'o' ? 'Oportunidades' : 'Ameaças'}:`);
    if (!label || !label.trim()) return;
    swotTags[quad].push(label.trim());
    renderSwotTags(quad);
}

function removeSwotTag(quad, idx) {
    swotTags[quad].splice(idx, 1);
    renderSwotTags(quad);
}

function renderSwotTags(quad) {
    const container = document.getElementById(`swot-tags-${quad}`);
    if (!container) return;
    container.innerHTML = '';
    swotTags[quad].forEach((tag, idx) => {
        const span = document.createElement('span');
        span.className = `swot-tag swot-tag-${quad}`;
        span.innerHTML = `${tag} <button class="btn-remove-tag" onclick="removeSwotTag('${quad}',${idx})"><i class="fas fa-times"></i></button>`;
        container.appendChild(span);
    });
}

// SWOT add item buttons
document.querySelectorAll('.btn-add-swot-item').forEach(btn => {
    btn.addEventListener('click', () => addSwotTag(btn.dataset.quad));
});

// SWOT example selector
document.querySelectorAll('.swot-ex-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.swot-ex-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.swot-ex-case').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
    });
});

document.getElementById('btn-save-swot').addEventListener('click', saveSWOT);
document.getElementById('btn-clear-swot').addEventListener('click', clearSWOT);
document.getElementById('btn-print-swot').addEventListener('click', () => window.print());
document.getElementById('swot-example').addEventListener('change', e => loadSwotExample(e.target.value));

loadSWOTData();

// expose for onclick handlers
window.removeSwotTag = removeSwotTag;


// ─── CANVAS DE DESENVOLVIMENTO DE BRANDING ───────────────────────────────────
const BRANDING_KEY = 'mktjur_branding';

const ARCHETYPE_DESCS = {
    heroi:     'Focado em resultado e conquista. Linguagem de ação, superação e vitória. Ideal para contencioso e advocacia de defesa.',
    sabio:     'Referência de conhecimento técnico e educação. Analítico e confiável. Ideal para advocacia preventiva e consultiva.',
    cuidador:  'Empatia e acolhimento acima de tudo. Comunicação humanizada. Ideal para direito de família e público vulnerável.',
    guardiao:  'Proteção e segurança como valores centrais. Tom firme, confiável e preventivo. Ideal para compliance e gestão de riscos.',
    parceiro:  'Confiança e proximidade com o cliente. Colaborativo e transparente. Ideal para assessoria recorrente e contratos.',
    inovador:  'Modernidade e soluções criativas. Digital-first e linguagem contemporânea. Ideal para startups e LegalTech.',
    governante:'Autoridade, liderança e excelência premium. Tom institucional e sofisticado. Ideal para grandes escritórios e bancas.',
    explorador:'Especialização em nicho, autenticidade e descoberta. Tom único e específico. Ideal para áreas emergentes e sub-atendidas.',
};

const BRANDING_EXAMPLES = {
    trabalhista: {
        fundacao_proposito: 'Fazer com que PMEs nunca percam dinheiro por desconhecer direitos trabalhistas — educando tanto quanto defendendo.',
        fundacao_visao: 'Ser o escritório trabalhista de referência para PMEs de Minas Gerais até 2028, com presença nacional via conteúdo digital educativo.',
        fundacao_valores: 'Transparência total com o cliente\nResultado mensurável e comunicado\nLinguagem acessível — sem juridiquês\nAtendimento próximo e responsivo em 24h\nÉtica acima do resultado em qualquer situação',
        pos_publico: 'Donos de PME com 5–50 funcionários, sem jurídico interno, setor de serviços e comércio. Medo de passivo trabalhista e linguagem jurídica inacessível.',
        pos_diferencial: 'Único pacote preventivo da região com preço fixo mensal + WhatsApp ilimitado + relatório mensal de riscos identificados — nenhum concorrente local oferece isso.',
        pos_mensagem: 'Para PMEs com 5–50 funcionários\nQue precisam de segurança trabalhista sem surpresas\nLima Advocacia Trabalhista\nOferece assessoria preventiva com preço fixo e relatório mensal\nDiferente dos escritórios tradicionais\nNós cobramos mensalidade fixa, respondemos em 24h e entregamos proteção real antes do processo.',
        personalidade_arquetipo: 'sabio',
        tom_formalidade: '2',
        tom_tecnico: '2',
        tom_serio: '3',
        personalidade_usa: 'Segurança, Clareza, Preventivo, Juntos, Proteção, Previsível, Simples, Resultado, Parceiro',
        personalidade_evita: '"Garantia de êxito", "Melhor advogado", "Vencemos sempre", "Especialista em tudo" — expressões vedadas pelo Provimento 205/2021 da OAB',
        cor_primaria: '#1a365d',
        cor_primaria_sig: 'Confiança e autoridade',
        cor_secundaria: '#d4af37',
        cor_secundaria_sig: 'Excelência e qualidade premium',
        cor_destaque: '#059669',
        cor_destaque_sig: 'Resultado e crescimento',
        visual_tipografia: 'Título: Playfair Display — sofisticação e tradição jurídica\nTexto: Inter — clareza e modernidade\nNunca usar fontes decorativas ou de difícil leitura',
        visual_elementos: 'Escudo minimalista com monograma da inicial do sobrenome. Sem balança ou toga clichê. Fotografia real do advogado (não stock photo). Estilo clean e profissional.',
        visual_nome: '"Lima Advocacia Trabalhista"\nTagline: "Proteção preventiva para a sua empresa."\nBase legal: art. 4º §2º Provimento 205/2021 — slogan descritivo é permitido.',
        exp_primeiro: 'Cliente encontra no LinkedIn → artigo informativo sobre risco trabalhista → clica no link WhatsApp → resposta personalizada em até 2h → agendamento de reunião inicial de diagnóstico.',
        exp_touchpoints: '• LinkedIn: autoridade e expertise técnica\n• WhatsApp: agilidade e proximidade\n• Contrato: organização e profissionalismo\n• Relatório mensal: transparência e cuidado ativo\n• E-mail: registro e formalidade necessária',
        exp_pos: 'E-mail de acompanhamento 30 dias após encerramento do caso\nNewsletter mensal com novidades trabalhistas relevantes\nLigação semestral de relacionamento\nLembrete anual de renovação do pacote preventivo',
        exp_sentimento: 'Seguro — mesmo quando o assunto é difícil.\nBem-informado — sempre sabe o que está acontecendo.\nProtegido — os riscos estão mapeados e monitorados.\nConfiante — sente que está nas mãos certas.',
        aut_conteudo: '3 posts/semana no LinkedIn (caso hipotético ético, dica prática, bastidor do escritório)\nArtigo técnico mensal no blog (SEO orgânico)\nNewsletter quinzenal com análise de mudanças legislativas\nResposta pública a dúvidas frequentes no LinkedIn',
        aut_prova: 'Especialização certificada em Direito do Trabalho — PUC/SP\n8 anos de experiência em contencioso e preventivo trabalhista\n200+ casos conduzidos ao longo da carreira (sem divulgar taxas de êxito, vedado pela OAB)\nPalestrante no SENAC e SEBRAE Regional',
        aut_parcerias: '3 escritórios de contabilidade como parceiros primários de indicação\nConsultores de RH e departamento pessoal\nSindicato patronal da cidade — co-marketing mensal\nMédicos do trabalho para assessoria integrada de saúde e segurança',
        aut_rp: 'Comentarista jurídico no jornal local sobre temas trabalhistas\nParticipação mensal no podcast do sindicato patronal\nArtigos publicados em portais de contabilidade parceiros\nEntrevistas para rádio sobre reforma trabalhista e CLT',
        valor_paraquem: 'Donos de PMEs com 5–50 funcionários, sem jurídico interno, no setor de serviços e comércio que estão expostos a riscos trabalhistas sem saber.',
        valor_entrega: 'Segurança jurídica trabalhista com preço fixo e previsível, atendimento via WhatsApp ilimitado, resposta em 24h e relatório mensal de riscos identificados.',
        valor_diferente: 'Única advocacia da região com modelo preventivo recorrente + relatório de riscos + WhatsApp ilimitado + preço fixo sem surpresas no boleto.',
        valor_frase: '"O jurídico que previne antes de precisar defender."',
    },
    familia: {
        fundacao_proposito: 'Guiar famílias nos momentos mais difíceis com clareza e humanidade — sem julgamentos, com soluções que colocam o bem-estar de todos acima do litígio.',
        fundacao_visao: 'Ser a referência estadual em advocacia familiar humanizada com programa de mediação pré-judicial próprio e parceria psicológica consolidada.',
        fundacao_valores: 'Acolhimento genuíno sem julgamento\nSigilo absoluto em todos os atendimentos\nResolução pacífica como primeiro caminho\nHumanização acima da tecnicidade\nParceria com psicólogos para cuidado integral',
        pos_publico: 'Mulheres 30–55 anos em processo de divórcio; cônjuges com filhos buscando acordo sem trauma; famílias que precisam de inventário ágil e acessível.',
        pos_diferencial: 'Único escritório da cidade com atendimento integrado jurídico + psicológico, com foco em mediação e resolução consensual. Inventário com processo previsível e transparente.',
        pos_mensagem: 'Para famílias em transição (divórcio, guarda ou inventário)\nQue precisam resolver sem mais trauma ou conflito\nDra. Ana Lima Advocacia Familiar\nOferece atendimento jurídico e psicológico integrado com foco em resolução consensual\nDiferente dos escritórios tradicionais\nNós colocamos o bem-estar da família antes do litígio, combinando direito e suporte emocional.',
        personalidade_arquetipo: 'cuidador',
        tom_formalidade: '3',
        tom_tecnico: '4',
        tom_serio: '4',
        personalidade_usa: 'Acolhimento, Recomeço, Resolução, Proteção, Juntos, Com você, Clareza, Seguro, Humanidade',
        personalidade_evita: '"Ganhamos a guarda", "Garantimos pensão", "O melhor acordo possível" — qualquer promessa de resultado específico vedada pela OAB',
        cor_primaria: '#0e7568',
        cor_primaria_sig: 'Tranquilidade e esperança',
        cor_secundaria: '#e8825a',
        cor_secundaria_sig: 'Calor humano e acolhimento',
        cor_destaque: '#d4af37',
        cor_destaque_sig: 'Qualidade e confiança',
        visual_tipografia: 'Título: Cormorant Garamond — humanidade e elegância clássica\nTexto: Lato — acessibilidade e leiturabilidade\nEvitar fontes frias, muito técnicas ou impessoais',
        visual_elementos: 'Ícone de mãos abertas ou folha estilizada (sem balança ou toga). Fotografias reais e acolhedoras da advogada e do ambiente. Estilo clean e esperançoso.',
        visual_nome: '"Dra. Ana Lima | Direito de Família"\nTagline: "Clareza nos momentos que mais importam."\nOpcional: logotipo com elemento floral minimalista.',
        exp_primeiro: 'Instagram (Reel educativo sobre guarda) → DM com link de agendamento → consulta inicial sigilosa e acolhedora (WhatsApp ou presencial).',
        exp_touchpoints: '• Instagram: humanização e educação acessível\n• WhatsApp: cuidado, agilidade e sigilo total\n• Sala de espera: acolhedora, sem ambiente frio de escritório\n• Contrato: clareza e organização\n• Relatório de progresso: transparência ativa',
        exp_pos: 'E-mail de acompanhamento 15 dias após encerramento\nNewsletter bimestral com dicas de direito de família\nMensagem de suporte no aniversário do acordo ou divórcio\nIndicação de psicólogos parceiros para suporte contínuo',
        exp_sentimento: 'Acolhida — sentir que alguém genuinamente está do seu lado.\nProtegida — seus direitos e os dos filhos são defendidos.\nCom esperança — o recomeço é possível e o caminho é claro.\nRespeitada — sem julgamentos, com dignidade em cada momento.',
        aut_conteudo: '3 Reels/semana no Instagram (dúvidas sobre divórcio, guarda e alimentos)\nBlog com artigos SEO mensais ("advogado divórcio [cidade]")\nE-book "Guia do Divórcio sem Trauma" como isca digital\nNewsletter mensal para a base de leads capturada',
        aut_prova: 'Certificação em mediação familiar pelo CONIMA\nParceria visível com psicóloga especialista em separação\nNota 4.9 no Google com 60 avaliações verificadas\nInventário extrajudicial: 30+ realizados com média de 15 dias',
        aut_parcerias: '3 psicólogos e terapeutas de casal como parceiros de indicação\nMediadores certificados para casos que precisam de mediação formal\nCartórios de notas para inventário extrajudicial ágil\nAssistentes sociais e grupos de apoio ao divórcio da cidade',
        aut_rp: 'Entrevistas em revistas femininas locais sobre direitos no divórcio\nParticipação em grupos de apoio online como especialista convidada\nArtigos sobre guarda e alimentos em portais de família\nWebinars mensais: "Seus direitos no divórcio"',
        valor_paraquem: 'Pessoas em processo de divórcio, guarda ou inventário que precisam de clareza jurídica com humanização — não apenas de documentos.',
        valor_entrega: 'Advocacia familiar com suporte jurídico e psicológico integrado, focada em resolução por acordo, com metodologia própria de mediação (sem divulgação de taxas de êxito, vedada pela OAB).',
        valor_diferente: 'Única da região com atendimento integrado jurídico + psicológico, foco em acordo antes do litígio e inventário extrajudicial com preço fixo.',
        valor_frase: '"Advocacia familiar — clareza nos momentos que mais importam."',
    },
    empresarial: {
        fundacao_proposito: 'Democratizar o acesso ao jurídico estratégico de qualidade — que não seja prerrogativa exclusiva de grandes empresas com recursos para Big Law.',
        fundacao_visao: 'O escritório empresarial de referência para o ecossistema de inovação do Brasil, com 100 clientes recorrentes em assinatura até 2027.',
        fundacao_valores: 'Linguagem clara — sem juridiquês desnecessário\nPreço justo e previsível para PMEs\nPrevenção acima da litigância sempre\nParceria de longo prazo com o cliente\nInovação contínua em processos e entrega',
        pos_publico: 'Founders e CEOs de startups Série Seed/A e donos de PMEs com 5–200 funcionários, sem jurídico interno, que precisam de segurança jurídica sem o custo da Big Law.',
        pos_diferencial: 'Único escritório com modelo de assinatura mensal por preço fixo + linguagem de negócios + reunião estratégica trimestral inclusa + onboarding digital em 24h.',
        pos_mensagem: 'Para startups e PMEs que crescem sem jurídico interno\nQue precisam de proteção contínua sem burocracia\nMotta Legal Advocacia Empresarial\nOferece assinatura mensal com preço fixo e linguagem de negócios\nDiferente de grandes escritórios e Big Law\nNós falamos a língua do founder, respondemos em 24h e entregamos estratégia, não só documentos.',
        personalidade_arquetipo: 'inovador',
        tom_formalidade: '2',
        tom_tecnico: '3',
        tom_serio: '2',
        personalidade_usa: 'Estratégia, Crescimento, Previsibilidade, Proteção, Parceria, Eficiência, ROI jurídico, Digital, Ágil',
        personalidade_evita: '"Ad referendum", "Douto", "Ilustríssimo" — qualquer linguagem que afaste founders sem formação jurídica; juridiquês desnecessário',
        cor_primaria: '#1e3a5f',
        cor_primaria_sig: 'Confiança e solidez institucional',
        cor_secundaria: '#ea580c',
        cor_secundaria_sig: 'Inovação, energia e ação',
        cor_destaque: '#334155',
        cor_destaque_sig: 'Sofisticação e solidez premium',
        visual_tipografia: 'Inter (toda a identidade) — moderna, tecnológica, sem serifa. Peso variável para criar hierarquia visual consistente em todas as plataformas.',
        visual_elementos: 'Design system contemporâneo e digital-first. Sem elementos jurídicos clichê. Ícones lineares e minimalistas. Cores contrastantes para CTAs. Grid limpo.',
        visual_nome: '"Motta Legal"\nTagline: "Jurídico estratégico para quem constrói o futuro."\nUsado com e sem tagline conforme o formato (digital vs impresso).',
        exp_primeiro: 'LinkedIn (artigo sobre risco jurídico para startups) → download de guia PDF educativo → reunião inicial de diagnóstico estratégico → proposta em 48h via documento digital.',
        exp_touchpoints: '• LinkedIn: thought leadership e autoridade técnica\n• Site: calculadora de risco jurídico como lead magnet\n• Contrato digital: organização e agilidade (DocuSign)\n• Dashboard do cliente: transparência e autonomia\n• Newsletter: parceria e atualização contínua',
        exp_pos: 'Alertas automáticos sobre mudanças regulatórias relevantes\nReunião estratégica trimestral inclusa em todos os planos\nAtendimento próximo e relatórios claros que estimulam indicações espontâneas\nCheck-in anual de revisão da estratégia jurídica',
        exp_sentimento: 'Confiante — as decisões são tomadas com informação jurídica sólida.\nEstratégico — o jurídico apoia o crescimento, não só previne problemas.\nEm parceria — o escritório cresce junto com a empresa.\nCom visibilidade — sempre sabe o que está acontecendo e por quê.',
        aut_conteudo: '3 posts/semana LinkedIn (análise de risco jurídico, contratos, regulação de IA)\nWebinar mensal sobre temas regulatórios relevantes para startups\nNewsletter semanal com análise de mudanças legislativas para PMEs\nGuia prático mensal para download ("Contratos para Startups", "LGPD na prática")',
        aut_prova: 'LLM em Direito Empresarial e Contratos — USP\n35 clientes recorrentes com MRR consolidado de R$ 87.500\nLinkedIn com 4.500 seguidores qualificados (founders e gestores)\nPalestrante confirmado em 3 aceleradoras e 2 hubs de inovação\nCitado em artigos da Exame e Época Negócios',
        aut_parcerias: '2 aceleradoras como parceiros de indicação primária (Deal Flow)\n3 hubs de inovação e co-working premium\n4 escritórios de contabilidade especializados em startups\nHub de co-working da cidade como parceiro de marca',
        aut_rp: 'Comentarista em portais especializados (Exame, StartupBase, Finsiders)\nParticipação em podcasts de empreendedorismo (Mova-se, Startups Inside)\nPresença em Demo Days como mentor jurídico de startups\nEntrevistas sobre regulação de IA e LGPD para veículos nacionais',
        valor_paraquem: 'Founders e donos de PMEs que crescem sem jurídico interno e precisam de segurança jurídica com linguagem de negócios e preço previsível.',
        valor_entrega: 'Parceria jurídica estratégica com assinatura mensal de preço fixo, linguagem acessível, onboarding digital em 24h e reunião estratégica trimestral.',
        valor_diferente: 'Único escritório com modelo de assinatura digital-first, linguagem de negócios sem juridiquês e reunião estratégica trimestral inclusa em todos os planos.',
        valor_frase: '"Jurídico estratégico para quem constrói o futuro."',
    }
};

function saveBranding() {
    const data = {};
    document.querySelectorAll('#branding-panel [data-brand]').forEach(el => {
        data[el.dataset.brand] = el.value;
    });
    localStorage.setItem(BRANDING_KEY, JSON.stringify(data));
    showToast('Canvas de Branding salvo!');
}

function loadBrandingData() {
    const raw = localStorage.getItem(BRANDING_KEY);
    if (!raw) return;
    try {
        const data = JSON.parse(raw);
        document.querySelectorAll('#branding-panel [data-brand]').forEach(el => {
            if (data[el.dataset.brand] !== undefined) el.value = data[el.dataset.brand];
        });
        if (data.personalidade_arquetipo) {
            selectArchetype(data.personalidade_arquetipo, false);
        }
    } catch(e) {}
}

function clearBranding() {
    if (!confirm('Limpar todos os campos do Canvas de Branding?')) return;
    document.querySelectorAll('#branding-panel [data-brand]').forEach(el => {
        if (el.type !== 'color') el.value = '';
    });
    document.querySelectorAll('.archetype-pill').forEach(p => p.classList.remove('selected'));
    const box = document.getElementById('archetype-desc-box');
    box.textContent = '';
    box.classList.remove('visible');
    document.querySelectorAll('#branding-panel .tone-range').forEach(r => { r.value = 3; });
    localStorage.removeItem(BRANDING_KEY);
    showToast('Canvas de Branding limpo.', 'fa-trash');
}

function loadBrandingExample(key) {
    if (!key) return;
    const ex = BRANDING_EXAMPLES[key];
    if (!ex) return;
    Object.entries(ex).forEach(([field, val]) => {
        const el = document.querySelector(`#branding-panel [data-brand="${field}"]`);
        if (el) el.value = val;
    });
    if (ex.personalidade_arquetipo) {
        selectArchetype(ex.personalidade_arquetipo, true);
    }
    showToast('Exemplo de branding carregado!', 'fa-magic');
}

function selectArchetype(key, showToastMsg) {
    document.querySelectorAll('.archetype-pill').forEach(p => {
        p.classList.toggle('selected', p.dataset.arch === key);
    });
    document.getElementById('brand-arquetipo-val').value = key;
    const desc = ARCHETYPE_DESCS[key];
    const box = document.getElementById('archetype-desc-box');
    if (desc) {
        box.textContent = desc;
        box.classList.add('visible');
    } else {
        box.classList.remove('visible');
    }
}

// Archetype pill interactions
document.querySelectorAll('.archetype-pill').forEach(pill => {
    pill.addEventListener('click', () => selectArchetype(pill.dataset.arch, false));
});

// Example tabs
document.querySelectorAll('.branding-ex-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.branding-ex-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.branding-ex-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.ex).classList.add('active');
    });
});

document.getElementById('btn-save-branding').addEventListener('click', saveBranding);
document.getElementById('btn-clear-branding').addEventListener('click', clearBranding);
document.getElementById('btn-print-branding').addEventListener('click', () => window.print());
document.getElementById('branding-example').addEventListener('change', e => loadBrandingExample(e.target.value));

loadBrandingData();

// ─── DIAGNÓSTICO: PONTOS FORTES E FRACOS ─────────────────────────────────────

const PF_DIMENSOES = [
    {
        id: 'especializacao',
        nome: 'Especialização e Posicionamento',
        icone: 'fa-bullseye',
        cor: '#1a365d',
        afirmacoes: [
            'Nosso escritório tem uma especialização clara e reconhecida pelo mercado.',
            'Conseguimos comunicar com precisão o que fazemos e para quem.',
            'Temos um posicionamento diferenciado da concorrência.',
            'O cliente-alvo está bem definido e nossas ações são direcionadas a ele.'
        ],
        comentario: {
            excelente: 'Excelente posicionamento! Seu escritório tem especialização sólida e bem comunicada. Capitalize essa força para atrair clientes de maior valor e fortalecer sua autoridade de mercado.',
            forte: 'Bom posicionamento. Há espaço para refinar ainda mais a comunicação do diferencial e tornar sua especialização ainda mais reconhecida.',
            estavel: 'Posicionamento moderado. Defina com mais clareza o nicho e o cliente-alvo para aumentar a efetividade das ações de marketing.',
            atencao: 'O posicionamento precisa de atenção urgente. Sem clareza sobre a especialização, é difícil se diferenciar e atrair os clientes certos.',
            critico: 'Ponto fraco crítico. Sem posicionamento claro, o escritório compete por preço e perde clientes qualificados. Redefinir a especialização é prioridade imediata.'
        },
        recomendacao: 'Defina em uma frase o que seu escritório faz, para quem faz e qual resultado entrega. Use essa declaração como base de toda a comunicação (site, LinkedIn, proposta).'
    },
    {
        id: 'relacionamento',
        nome: 'Relacionamento com Clientes',
        icone: 'fa-handshake',
        cor: '#0f766e',
        afirmacoes: [
            'Mantemos contato regular e proativo com clientes atuais e anteriores.',
            'Temos processos estruturados de acompanhamento pós-serviço.',
            'Nossa carteira de clientes ativos cresce de forma consistente.',
            'Recebemos indicações frequentes de novos clientes por parte dos atuais.'
        ],
        comentario: {
            excelente: 'Relacionamento exemplar! Seus clientes se sentem valorizados e são promotores do escritório. Continue investindo nessa dimensão, ela é um diferencial competitivo poderoso.',
            forte: 'Bom relacionamento com clientes. Estruture ainda melhor os processos de pós-atendimento e programas de indicação para amplificar os resultados.',
            estavel: 'Relacionamento satisfatório, mas com potencial de melhoria. Crie rituais regulares de contato com ex-clientes e implemente um sistema de indicação formal.',
            atencao: 'O relacionamento com clientes precisa de atenção. Muitos escritórios perdem receita por não manter o contato após o encerramento do caso.',
            critico: 'Relacionamento crítico. A ausência de contato pós-atendimento gera perda de retenção e indicações. Comece com um CRM simples e uma cadência de follow-up.'
        },
        recomendacao: 'Implante um CRM básico (pode ser uma planilha) e defina uma cadência de contato: e-mail ou mensagem de check-in a cada 90 dias para ex-clientes estratégicos.'
    },
    {
        id: 'autoridade',
        nome: 'Autoridade e Marca',
        icone: 'fa-star',
        cor: '#b45309',
        afirmacoes: [
            'Produzimos conteúdo técnico que demonstra expertise (artigos, posts, vídeos, palestras).',
            'Somos reconhecidos como referência em nossa área de atuação.',
            'Nossa presença digital (site, LinkedIn, redes sociais) reflete nossa especialização.',
            'Participamos de eventos, publicações ou mídias relevantes para o nosso público.'
        ],
        comentario: {
            excelente: 'Autoridade consolidada! Seu escritório é referência no mercado. Explore parcerias estratégicas, convites para palestrar e colaboração em publicações para ampliar ainda mais o alcance.',
            forte: 'Boa autoridade de marca. Intensifique a frequência de conteúdo e busque presença em canais de maior alcance para seu público-alvo.',
            estavel: 'Autoridade em desenvolvimento. Estabeleça uma rotina de produção de conteúdo e escolha 1-2 canais prioritários para concentrar esforços.',
            atencao: 'Autoridade frágil. Sem visibilidade, o escritório depende quase exclusivamente de indicações. Comece a publicar conteúdo útil ao seu público-alvo imediatamente.',
            critico: 'Marca praticamente invisível no mercado. Construir autoridade é urgente. Comece com o LinkedIn: 2 posts por semana sobre casos e tendências da sua área.'
        },
        recomendacao: 'Crie um calendário editorial mensal com pelo menos 2 publicações técnicas por semana no LinkedIn. Cada post deve responder a uma dúvida real do seu cliente-alvo.'
    },
    {
        id: 'gestao',
        nome: 'Gestão e Rentabilidade',
        icone: 'fa-chart-bar',
        cor: '#7c3aed',
        afirmacoes: [
            'Conhecemos com precisão o custo de cada caso e nossa margem de lucro.',
            'Temos metas de faturamento definidas e as acompanhamos regularmente.',
            'Fazemos precificação estratégica, não apenas por hora ou por "preço de mercado".',
            'Nosso faturamento cobre os custos operacionais e gera reserva de capital.'
        ],
        comentario: {
            excelente: 'Gestão financeira exemplar! Você tem controle dos números e toma decisões baseadas em dados. Use essa solidez para investir em crescimento com segurança.',
            forte: 'Boa gestão financeira. Refine a precificação por valor entregue e implante indicadores de acompanhamento mensal para otimizar a rentabilidade.',
            estavel: 'Gestão financeira adequada, mas com espaço para melhorias. Revise a precificação e comece a rastrear a margem por tipo de serviço.',
            atencao: 'Gestão financeira fraca. Sem controle de custos e metas claras, o escritório pode crescer em volume e diminuir em lucro. Priorize organizar as finanças.',
            critico: 'Gestão financeira crítica. Trabalhar sem conhecer custos e margens é um risco grave. Implante uma planilha financeira básica ainda esta semana.'
        },
        recomendacao: 'Defina o custo real do seu tempo (incluindo despesas fixas e pró-labore desejado), calcule a margem de cada serviço e revise a tabela de honorários a cada 6 meses.'
    },
    {
        id: 'operacional',
        nome: 'Eficiência Operacional',
        icone: 'fa-cogs',
        cor: '#0891b2',
        afirmacoes: [
            'Temos processos documentados para as principais atividades do escritório.',
            'A equipe utiliza ferramentas adequadas (software jurídico, gestão de prazos, controle de tarefas).',
            'O tempo administrativo é minimizado para que a equipe foque no trabalho jurídico.',
            'Monitoramos indicadores básicos de produtividade e cumprimento de prazos.'
        ],
        comentario: {
            excelente: 'Operação altamente eficiente! Processos bem definidos e ferramentas adequadas permitem que a equipe entregue mais valor com menos esforço. Avalie automação e delegação para escalar.',
            forte: 'Boa eficiência operacional. Há oportunidade de documentar os processos existentes e incorporar mais automação para liberar tempo estratégico da equipe.',
            estavel: 'Eficiência moderada. Mapeie os principais gargalos operacionais e priorize a implantação de um software de gestão de prazos e tarefas.',
            atencao: 'Eficiência baixa. Sem processos claros, o retrabalho e os prazos perdidos geram riscos jurídicos e prejudicam a experiência do cliente.',
            critico: 'Eficiência crítica. A ausência de processos documentados e ferramentas adequadas é um risco para a qualidade do serviço. Implante um sistema de gestão jurídica com urgência.'
        },
        recomendacao: 'Mapeie os 5 processos mais repetitivos do escritório, crie checklists para cada um e avalie a adoção de um software jurídico (ex.: Advwin, Toth, Jurídico Certo) para controle de prazos.'
    },
    {
        id: 'inovacao',
        nome: 'Inovação e Tecnologia',
        icone: 'fa-microchip',
        cor: '#059669',
        afirmacoes: [
            'Utilizamos tecnologia para automatizar tarefas repetitivas no dia a dia.',
            'A equipe está atualizada com as principais ferramentas digitais jurídicas (IA, automação, legal tech).',
            'Exploramos ativamente canais digitais para geração de novos negócios.',
            'Investimos periodicamente em formação tecnológica da equipe.'
        ],
        comentario: {
            excelente: 'Escritório altamente inovador! A adoção de tecnologia cria vantagem competitiva real. Compartilhe boas práticas com a equipe e avalie como a IA pode ampliar ainda mais sua eficiência.',
            forte: 'Boa adoção de tecnologia. Explore ferramentas de IA para pesquisa, redação e análise de contratos para ganhar ainda mais eficiência.',
            estavel: 'Tecnologia moderada. Identifique as tarefas que mais consomem tempo da equipe e pesquise soluções tecnológicas específicas para elas.',
            atencao: 'Baixa adoção de tecnologia. O risco de ficar para trás da concorrência é real. Comece com ferramentas gratuitas ou de baixo custo para dar os primeiros passos.',
            critico: 'Tecnologia crítica. A ausência de ferramentas digitais gera ineficiência e dificulta a competitividade. Defina um orçamento mínimo para investimento em tecnologia jurídica.'
        },
        recomendacao: 'Realize um inventário das ferramentas atuais, identifique as lacunas e estabeleça um plano trimestral de adoção de novas tecnologias. Comece com IA para pesquisa jurídica e redação de peças.'
    },
    {
        id: 'crescimento',
        nome: 'Crescimento e Estratégia',
        icone: 'fa-rocket',
        cor: '#dc2626',
        afirmacoes: [
            'Temos um plano estratégico formal para os próximos 12 meses com metas claras.',
            'Revisamos periodicamente os resultados em relação às metas definidas.',
            'Tomamos decisões de negócio com base em dados e indicadores, não apenas intuição.',
            'Temos clareza sobre os próximos passos para escalar e crescer o escritório.'
        ],
        comentario: {
            excelente: 'Estratégia exemplar! Seu escritório opera com visão de longo prazo e disciplina de execução. Compartilhe o plano com a equipe e revise-o trimestralmente para manter o alinhamento.',
            forte: 'Boa estratégia. Formalize o plano por escrito se ainda não fez, defina responsáveis para cada meta e crie uma rotina de revisão mensal dos indicadores.',
            estavel: 'Estratégia em desenvolvimento. Transforme as intenções em um plano escrito com metas SMART, prazos e indicadores de acompanhamento.',
            atencao: 'Estratégia fraca. Sem um plano definido, o escritório reage ao mercado em vez de projetar o seu futuro. Reserve um dia para planejar os próximos 12 meses.',
            critico: 'Ausência de estratégia. Trabalhar sem plano é o principal inibidor do crescimento sustentável. Comece com 3 metas anuais claras e 1 ação concreta por mês para cada uma.'
        },
        recomendacao: 'Elabore um plano de uma página com: visão de 3 anos, 3 metas anuais mensuráveis, 3 ações prioritárias para o próximo trimestre e 3 indicadores de acompanhamento mensal.'
    }
];

const PF_LIKERT_LABELS = ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'];
const PF_FAIXAS = [
    { min: 4.5, max: 5.0, classe: 'excelente', label: 'Excelente', badge: 'pf-badge-excelente', cor: '#15803d' },
    { min: 3.8, max: 4.4, classe: 'forte',     label: 'Forte',     badge: 'pf-badge-forte',     cor: '#065f46' },
    { min: 3.0, max: 3.7, classe: 'estavel',   label: 'Estável',   badge: 'pf-badge-estavel',   cor: '#92400e' },
    { min: 2.0, max: 2.9, classe: 'atencao',   label: 'Atenção',   badge: 'pf-badge-atencao',   cor: '#c2410c' },
    { min: 1.0, max: 1.9, classe: 'critico',   label: 'Ponto Fraco Crítico', badge: 'pf-badge-critico', cor: '#991b1b' }
];
const PF_OPEN_QUESTIONS = [
    { id: 'diferenciais',    label: 'Quais são os maiores diferenciais do seu escritório hoje?' },
    { id: 'desafios',        label: 'Quais são os principais desafios internos que limitam o crescimento?' },
    { id: 'melhoria12meses', label: 'Qual área você quer priorizar para melhorar nos próximos 12 meses?' }
];

let pfRespostas = {};
let pfAbertas = {};
let pfEscritorioNome = '';
let pfRespondente = '';
let pfRadarChart = null;

function pfClassificar(media) {
    for (const f of PF_FAIXAS) {
        if (media >= f.min && media <= f.max) return f;
    }
    return PF_FAIXAS[PF_FAIXAS.length - 1];
}

function pfCalcularMediaDim(dimId) {
    const dim = PF_DIMENSOES.find(d => d.id === dimId);
    const notas = dim.afirmacoes.map((_, i) => pfRespostas[`${dimId}_${i}`] || 0);
    const respondidas = notas.filter(n => n > 0);
    if (!respondidas.length) return 0;
    return respondidas.reduce((a, b) => a + b, 0) / respondidas.length;
}

function pfContarRespondidas() {
    let total = 0;
    PF_DIMENSOES.forEach(d => { total += d.afirmacoes.length; });
    let respondidas = Object.keys(pfRespostas).filter(k => pfRespostas[k] > 0).length;
    return { respondidas, total };
}

function pfAtualizarProgresso() {
    const { respondidas, total } = pfContarRespondidas();
    const pct = total > 0 ? (respondidas / total) * 100 : 0;
    const fill = document.getElementById('pf-progress-fill');
    const count = document.getElementById('pf-progress-count');
    const totalEl = document.getElementById('pf-progress-total');
    if (fill) fill.style.width = pct + '%';
    if (count) count.textContent = respondidas;
    if (totalEl) totalEl.textContent = total;
}

function pfRenderIntro() {
    const grid = document.getElementById('pf-dimensoes-preview');
    if (!grid) return;
    const cores = ['#1a365d','#0f766e','#b45309','#7c3aed','#0891b2','#059669','#dc2626'];
    grid.innerHTML = PF_DIMENSOES.map((d, i) => `
        <div class="pf-dim-tag" style="border-color:${cores[i]}22; color:${cores[i]}">
            <i class="fas ${d.icone}" style="color:${cores[i]}"></i>
            <span>${d.nome}</span>
        </div>
    `).join('');
}

function pfRenderQuiz() {
    const container = document.getElementById('pf-quiz-container');
    if (!container) return;

    let html = '';
    PF_DIMENSOES.forEach((dim, di) => {
        html += `
        <div class="pf-dim-card">
            <div class="pf-dim-card-header" style="background: linear-gradient(135deg, ${dim.cor}, ${dim.cor}cc)">
                <div class="pf-dim-card-icon"><i class="fas ${dim.icone}"></i></div>
                <div>
                    <div class="pf-dim-card-title">${dim.nome}</div>
                    <div class="pf-dim-card-num">Dimensão ${di + 1} de ${PF_DIMENSOES.length}</div>
                </div>
            </div>
            <div class="pf-dim-card-body">
                ${dim.afirmacoes.map((texto, qi) => `
                <div class="pf-question">
                    <div class="pf-question-text">${qi + 1}. ${texto}</div>
                    <div class="pf-likert">
                        ${[1,2,3,4,5].map(val => `
                        <label class="pf-likert-option" title="${PF_LIKERT_LABELS[val-1]}">
                            <input type="radio" name="pf_${dim.id}_${qi}" value="${val}"
                                onchange="pfSetResposta('${dim.id}',${qi},${val})"
                                ${pfRespostas[`${dim.id}_${qi}`] === val ? 'checked' : ''}>
                            <span class="pf-likert-btn">${val}</span>
                            <span class="pf-likert-label">${PF_LIKERT_LABELS[val-1]}</span>
                        </label>`).join('')}
                    </div>
                </div>`).join('')}
            </div>
        </div>`;
    });

    // Open questions
    html += `
    <div style="margin-top:8px; margin-bottom:12px;">
        <div class="pf-section-title"><i class="fas fa-pen-to-square" style="color:var(--primary-light)"></i> Perguntas Abertas</div>
    </div>`;
    PF_OPEN_QUESTIONS.forEach((q, qi) => {
        html += `
        <div class="pf-open-card">
            <div class="pf-open-header">
                <i class="fas fa-comment-dots"></i>
                <span>${qi + 1}. ${q.label}</span>
            </div>
            <div class="pf-open-body">
                <textarea id="pf-open-${q.id}" placeholder="Escreva sua resposta aqui..."
                    oninput="pfAbertas['${q.id}']=this.value">${pfAbertas[q.id] || ''}</textarea>
            </div>
        </div>`;
    });

    html += `
    <div class="pf-nav-row">
        <span></span>
        <button class="pf-btn-nav next" onclick="pfFinalizar()">
            Ver resultado <i class="fas fa-chart-line"></i>
        </button>
    </div>`;

    container.innerHTML = html;
    pfAtualizarProgresso();
}

function pfSetResposta(dimId, qi, val) {
    pfRespostas[`${dimId}_${qi}`] = val;
    pfAtualizarProgresso();
}

function pfFinalizar() {
    const { respondidas, total } = pfContarRespondidas();
    if (respondidas < total * 0.5) {
        alert('Por favor, responda pelo menos metade das afirmações antes de gerar o resultado.');
        return;
    }
    pfRenderResultados();
    pfShowScreen('results');
    document.getElementById('pontos-fortes-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pfRenderResultados() {
    const container = document.getElementById('pf-results-container');
    if (!container) return;

    const medias = PF_DIMENSOES.map(d => pfCalcularMediaDim(d.id));
    const classificacoes = medias.map(m => pfClassificar(m));
    const mediaGeral = medias.filter(m => m > 0).reduce((a, b) => a + b, 0) / medias.filter(m => m > 0).length || 0;
    const pontuacaoGeral = Math.round(((mediaGeral - 1) / 4) * 100);
    const classGeral = pfClassificar(mediaGeral);

    // Top 5 forças e fraquezas por afirmação
    const afirmacoesPontuadas = [];
    PF_DIMENSOES.forEach(d => {
        d.afirmacoes.forEach((texto, i) => {
            const nota = pfRespostas[`${d.id}_${i}`] || 0;
            if (nota > 0) {
                afirmacoesPontuadas.push({ texto, nota, dim: d.nome, dimId: d.id });
            }
        });
    });
    afirmacoesPontuadas.sort((a, b) => b.nota - a.nota);
    const top5Forcas = afirmacoesPontuadas.filter(a => a.nota >= 4).slice(0, 5);
    const top5Fraquezas = [...afirmacoesPontuadas].sort((a, b) => a.nota - b.nota).filter(a => a.nota <= 3).slice(0, 5);

    // Top 3 prioridades (piores dimensões)
    const dimComMedia = PF_DIMENSOES.map((d, i) => ({ ...d, media: medias[i] }));
    const prioridades = [...dimComMedia].filter(d => d.media > 0).sort((a, b) => a.media - b.media).slice(0, 3);

    // Header
    let html = `
    <div class="pf-result-header">
        <h2><i class="fas fa-chart-pie" style="margin-right:8px;opacity:.8"></i>Relatório de Diagnóstico — Pontos Fortes e Fracos</h2>
        <div class="pf-result-meta">
            ${pfEscritorioNome ? `<strong>${pfEscritorioNome}</strong> · ` : ''}
            ${pfRespondente ? `Respondido por: ${pfRespondente} · ` : ''}
            ${new Date().toLocaleDateString('pt-BR')}
        </div>
        <div class="pf-score-row">
            <div class="pf-score-circle">
                <span class="pf-score-num">${pontuacaoGeral}</span>
                <span class="pf-score-of">/ 100</span>
            </div>
            <div class="pf-score-info">
                <div class="pf-score-badge">${classGeral.label}</div>
                <p style="margin-top:10px">${pfTextoGeral(pontuacaoGeral, classGeral.classe)}</p>
            </div>
        </div>
    </div>`;

    // Radar chart
    html += `
    <div class="pf-chart-section">
        <div class="pf-chart-wrap">
            <canvas id="pf-radar-canvas" width="400" height="400"></canvas>
        </div>
    </div>`;

    // Dimension table
    html += `
    <div class="pf-dim-table-section">
        <div class="pf-section-title"><i class="fas fa-table" style="color:var(--primary-light)"></i> Pontuação por Dimensão</div>
        <table class="pf-dim-table">
            <thead><tr><th>Dimensão</th><th>Média</th><th>Maturidade</th></tr></thead>
            <tbody>
                ${PF_DIMENSOES.map((d, i) => {
                    const m = medias[i];
                    const cl = classificacoes[i];
                    const barColor = cl.cor;
                    const barWidth = m > 0 ? ((m - 1) / 4 * 100).toFixed(0) : 0;
                    return `<tr>
                        <td><i class="fas ${d.icone}" style="color:${d.cor};margin-right:7px;font-size:13px"></i>${d.nome}</td>
                        <td>
                            <div class="pf-score-bar-wrap">
                                <strong>${m > 0 ? m.toFixed(1) : '–'}</strong>
                                <div class="pf-score-bar-bg">
                                    <div class="pf-score-bar-fill" style="width:${barWidth}%;background:${barColor}"></div>
                                </div>
                            </div>
                        </td>
                        <td><span class="pf-badge-class ${cl.badge}">${cl.label}</span></td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>
    </div>`;

    // Forças e Fraquezas
    html += `<div class="pf-ff-grid">
        <div class="pf-ff-card">
            <div class="pf-ff-header forcas"><i class="fas fa-thumbs-up"></i> Top 5 Pontos Fortes</div>
            ${top5Forcas.length ? top5Forcas.map(a => `
            <div class="pf-ff-item">
                <i class="fas fa-circle-check pf-ff-icon pos"></i>
                <span><strong style="font-size:11px;color:#15803d;display:block">${a.dim}</strong>${a.texto}</span>
            </div>`).join('') : '<div class="pf-ff-item"><i class="fas fa-info-circle pf-ff-icon pos"></i><span>Nenhuma força destacada ainda. Responda mais afirmações.</span></div>'}
        </div>
        <div class="pf-ff-card">
            <div class="pf-ff-header fraquezas"><i class="fas fa-thumbs-down"></i> Top 5 Pontos Fracos</div>
            ${top5Fraquezas.length ? top5Fraquezas.map(a => `
            <div class="pf-ff-item">
                <i class="fas fa-circle-xmark pf-ff-icon neg"></i>
                <span><strong style="font-size:11px;color:#b91c1c;display:block">${a.dim}</strong>${a.texto}</span>
            </div>`).join('') : '<div class="pf-ff-item"><i class="fas fa-info-circle pf-ff-icon neg"></i><span>Nenhuma fraqueza destacada ainda. Responda mais afirmações.</span></div>'}
        </div>
    </div>`;

    // 90-day priorities
    html += `
    <div class="pf-priorities-section">
        <div class="pf-section-title"><i class="fas fa-flag" style="color:#dc2626"></i> 3 Prioridades Estratégicas — Próximos 90 Dias</div>
        ${prioridades.map((d, i) => `
        <div class="pf-priority-item">
            <div class="pf-priority-num">${i + 1}</div>
            <div class="pf-priority-body">
                <div class="pf-priority-dim">${d.nome} · Média: ${d.media.toFixed(1)} — ${pfClassificar(d.media).label}</div>
                <div class="pf-priority-rec">${d.recomendacao}</div>
            </div>
        </div>`).join('')}
    </div>`;

    // Comments by dimension
    html += `
    <div class="pf-comments-section">
        <div class="pf-section-title"><i class="fas fa-comment-alt" style="color:var(--primary-light)"></i> Comentários Estratégicos por Dimensão</div>
        ${PF_DIMENSOES.map((d, i) => {
            const m = medias[i];
            if (m === 0) return '';
            const cl = classificacoes[i];
            return `<div class="pf-comment-item">
                <div class="pf-comment-dim">
                    <i class="fas ${d.icone}" style="color:${d.cor}"></i>
                    ${d.nome} <span class="pf-badge-class ${cl.badge}" style="font-size:11px">${cl.label}</span>
                </div>
                <div class="pf-comment-text">${d.comentario[cl.classe]}</div>
            </div>`;
        }).join('')}
    </div>`;

    // Open answers
    const temAberta = Object.values(pfAbertas).some(v => v && v.trim());
    if (temAberta) {
        html += `
        <div class="pf-open-answers-section">
            <div class="pf-section-title"><i class="fas fa-pen" style="color:var(--primary-light)"></i> Respostas Abertas</div>
            ${PF_OPEN_QUESTIONS.map(q => {
                const resp = pfAbertas[q.id];
                if (!resp || !resp.trim()) return '';
                return `<div class="pf-open-answer">
                    <div class="pf-open-answer-q">${q.label}</div>
                    <div class="pf-open-answer-a">"${resp}"</div>
                </div>`;
            }).join('')}
        </div>`;
    }

    container.innerHTML = html;

    // Render radar chart
    setTimeout(() => pfRenderRadar(medias), 80);
}

function pfTextoGeral(pontuacao, classe) {
    const textos = {
        excelente: 'Seu escritório apresenta maturidade estratégica excepcional. Você está entre os mais bem posicionados do mercado.',
        forte: 'Seu escritório tem fundamentos sólidos. Pequenos ajustes nas dimensões mais fracas podem alavancar significativamente os resultados.',
        estavel: 'Seu escritório tem uma base funcional. Priorize as dimensões com menor pontuação para dar um salto de qualidade.',
        atencao: 'Existem fragilidades importantes que limitam o crescimento. Foque nas prioridades identificadas para evoluir rapidamente.',
        critico: 'O escritório precisa de intervenção estratégica urgente. As prioridades identificadas são o ponto de partida para a transformação.'
    };
    return textos[classe] || '';
}

function pfRenderRadar(medias) {
    const canvas = document.getElementById('pf-radar-canvas');
    if (!canvas || typeof Chart === 'undefined') return;
    if (pfRadarChart) { pfRadarChart.destroy(); pfRadarChart = null; }
    pfRadarChart = new Chart(canvas, {
        type: 'radar',
        data: {
            labels: PF_DIMENSOES.map(d => d.nome.split(' e ')[0]),
            datasets: [{
                label: 'Maturidade',
                data: medias.map(m => m > 0 ? parseFloat(m.toFixed(2)) : 0),
                backgroundColor: 'rgba(26, 54, 93, 0.15)',
                borderColor: 'rgba(26, 54, 93, 0.9)',
                pointBackgroundColor: 'rgba(212, 175, 55, 1)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgba(26, 54, 93, 1)',
                borderWidth: 2,
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    min: 0, max: 5,
                    ticks: { stepSize: 1, font: { size: 11 }, color: '#64748b', backdropColor: 'transparent' },
                    pointLabels: { font: { size: 11, family: 'Inter' }, color: '#1a365d' },
                    grid: { color: 'rgba(26,54,93,0.1)' },
                    angleLines: { color: 'rgba(26,54,93,0.1)' }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.raw.toFixed(1)} / 5.0`
                    }
                }
            }
        }
    });
}

function pfShowScreen(name) {
    ['intro', 'quiz', 'results'].forEach(s => {
        const el = document.getElementById(`pf-screen-${s}`);
        if (el) el.classList.toggle('pf-hidden', s !== name);
    });
}

function pfIniciar(e) {
    e.preventDefault();
    pfEscritorioNome = document.getElementById('pf-input-escritorio').value.trim();
    pfRespondente   = document.getElementById('pf-input-respondente').value.trim();
    pfRenderQuiz();
    pfShowScreen('quiz');
    document.getElementById('pontos-fortes-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function pfNovoDiagnostico() {
    pfRespostas = {};
    pfAbertas = {};
    pfEscritorioNome = '';
    pfRespondente = '';
    if (pfRadarChart) { pfRadarChart.destroy(); pfRadarChart = null; }
    document.getElementById('pf-input-escritorio').value = '';
    document.getElementById('pf-input-respondente').value = '';
    document.getElementById('pf-results-container').innerHTML = '';
    pfShowScreen('intro');
    pfRenderIntro();
    document.getElementById('pontos-fortes-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Init
(function pfInit() {
    pfRenderIntro();
    const form = document.getElementById('pf-form-identificacao');
    if (form) form.addEventListener('submit', pfIniciar);
    const btnNovo = document.getElementById('pf-btn-novo');
    if (btnNovo) btnNovo.addEventListener('click', pfNovoDiagnostico);
    const { total } = pfContarRespondidas();
    const totalEl = document.getElementById('pf-progress-total');
    if (totalEl) totalEl.textContent = total;
})();
