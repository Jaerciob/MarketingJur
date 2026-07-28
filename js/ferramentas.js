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

// ─── TABS (two-level navigation) ─────────────────────────────────────────────
const subnav = document.getElementById('tools-subnav');

function showPanel(panelId) {
    document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
}

function activateSubnav(groupId) {
    document.querySelectorAll('.subnav-group').forEach(g => g.classList.remove('active'));
    const group = document.getElementById('subnav-' + groupId);
    if (group) {
        group.classList.add('active');
        subnav.classList.add('visible');
        // activate first subtab in the group
        const firstBtn = group.querySelector('.subtab-btn');
        if (firstBtn) {
            group.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
            firstBtn.classList.add('active');
            showPanel(firstBtn.dataset.panel);
        }
    } else {
        subnav.classList.remove('visible');
    }
}

document.querySelectorAll('.group-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.group-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const direct = btn.dataset.direct;
        if (direct) {
            // Direct panel — hide subnav
            subnav.classList.remove('visible');
            document.querySelectorAll('.subnav-group').forEach(g => g.classList.remove('active'));
            showPanel(direct);
        } else {
            activateSubnav(btn.dataset.group);
        }
    });
});

document.querySelectorAll('.subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const group = btn.closest('.subnav-group');
        group.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        showPanel(btn.dataset.panel);
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
    },
    previdenciario: {
        bmc_partners_indicacao: 'Contadores e escritórios de contabilidade rural\nSindicatos rurais e associações de trabalhadores\nMédicos peritos e clínicas de laudos ocupacionais',
        bmc_partners_assoc: 'OAB — Comissão de Direito Previdenciário\nSindicatos rurais e de categorias específicas\nAssociações de aposentados e pensionistas',
        bmc_partners_tech: 'Software de cálculo de benefícios (CNIS/simuladores)\nPlataforma de peticionamento eletrônico do INSS (Meu INSS)\nAgência de marketing digital jurídico',
        bmc_activities_atend: '1. Triagem do segurado via WhatsApp/formulário\n2. Reunião inicial de diagnóstico e análise do CNIS\n3. Simulação de benefício e proposta de trabalho\n4. Protocolo administrativo e acompanhamento do processo',
        bmc_activities_content: '2 posts/semana no Instagram sobre direitos previdenciários\n1 artigo/mês no blog: "Como planejar a aposentadoria após a Reforma"\nRespostas a dúvidas frequentes sobre BPC/LOAS em Stories',
        bmc_value_servicos: '• Aposentadorias (idade, tempo de contribuição, especial, rural)\n• BPC/LOAS para idosos e pessoas com deficiência\n• Benefícios por incapacidade (auxílio-doença e aposentadoria)\n• Revisões de benefícios já concedidos\n• Planejamento previdenciário personalizado',
        bmc_value_diferenciais: '• Análise detalhada do CNIS antes de qualquer protocolo\n• Especialização certificada em Direito Previdenciário\n• Atendimento acessível ao segurado do interior via online\n• Acompanhamento do processo com linguagem simples',
        bmc_value_posicionamento: '"O advogado previdenciário que planeja antes de pedir — segurança para a sua aposentadoria."',
        bmc_value_voz: 'Arquétipo do Sábio/Cuidador. Tom: didático, acolhedor, paciente. Traduz o "INSS" em linguagem simples.',
        bmc_rel_conquista: '• E-book: "Guia da Aposentadoria após a Reforma"\n• Perfil completo e atualizado no Google Meu Negócio\n• Conteúdo educativo sobre requisitos de cada benefício',
        bmc_rel_fideliza: '• Newsletter mensal com atualizações previdenciárias\n• Acompanhamento até a concessão e primeiro pagamento\n• Atendimento cuidadoso que estimula indicações espontâneas\n• Revisão periódica do CNIS de clientes assessorados',
        bmc_seg_perfil: 'Persona 1: Sr. José, 63 anos, trabalhador rural. Não sabe se já pode se aposentar por idade.\nPersona 2: Dona Maria, 58 anos, mãe de filho com deficiência. Busca o BPC/LOAS e teve o pedido negado.',
        bmc_seg_dores: '• Medo de perder tempo de contribuição não reconhecido\n• Dificuldade em entender as regras da Reforma da Previdência\n• Benefício negado ou concedido com valor menor que o devido\n• Insegurança sobre quando e como se aposentar',
        bmc_seg_canais: '• Instagram e Facebook (público 50+ e famílias)\n• Google (busca por "advogado aposentadoria")\n• Indicação de contadores e sindicatos rurais\n• Palestras em associações de aposentados',
        bmc_res_conhecimento: 'Especialização em Direito Previdenciário\nDomínio das regras de transição da Reforma da Previdência\nCursos de cálculo de benefícios e leitura de CNIS',
        bmc_res_infra: 'Site profissional com blog e simulador de aposentadoria\nSoftware de cálculo de benefícios e análise de CNIS\nEstrutura para atendimento online do interior',
        bmc_costs_invest: 'Instagram/Facebook Ads: R$ 400/mês\nProdução de conteúdo: R$ 500/mês\nSoftware de cálculo previdenciário: R$ 250/mês\nTotal: ~R$ 1.150/mês',
        bmc_costs_dist: '35% — Instagram/Facebook Ads\n43% — Produção de conteúdo\n22% — Software e ferramentas',
        bmc_rev_metricas: 'Meta: 10 leads/mês via redes e indicações\nTaxa de conversão: 40% (4 clientes novos/mês)\nCusto por lead: R$ 115\nTicket médio: R$ 3.500/caso',
        bmc_rev_roi: 'Investimento: R$ 1.150/mês\nRetorno esperado: 4 casos × R$ 3.500 = R$ 14.000\nROI: 1.117% | Payback: menos de 3 dias',
        obj_lp_bienal: '• Tornar-se referência regional em planejamento previdenciário\n• Faturar R$ 500.000/ano com concessões, revisões e planejamento\n• Ter 1 advogado associado e 1 analista de cálculos\n• Lançar programa de análise preventiva de CNIS para sindicatos',
        obj_lp_anual: '• Consolidar autoridade em planejamento previdenciário na região\n• Produzir e lançar e-book completo sobre aposentadoria pós-Reforma\n• Expandir atendimento online para 3 novos municípios\n• Faturar R$ 250.000 no ano com mix de concessões e revisões',
        obj_lp_t1: '• Atingir 10 leads qualificados/mês via redes e indicações\n• Publicar 1 artigo técnico por semana no blog\n• Fechar parceria formal com 2 sindicatos rurais\n• Implementar CRM e software de cálculo integrado',
        obj_lp_t2: '• Consolidar carteira com 30 processos ativos\n• Lançar palestra educativa "Aposentadoria após a Reforma"\n• Alcançar nota 4,8+ no Google Meu Negócio com 40 avaliações\n• Estruturar linha de revisões de benefícios já concedidos',
    },
    consumidor: {
        bmc_partners_indicacao: 'Associações de defesa do consumidor e Procon\nContadores e educadores financeiros\nPlataformas de reclamação (relacionamento institucional)',
        bmc_partners_assoc: 'OAB — Comissão de Defesa do Consumidor\nInstitutos de proteção ao superendividado\nAssociações de moradores e sindicatos',
        bmc_partners_tech: 'Software de gestão de alto volume de processos\nPlataforma de atendimento e triagem automatizada\nAgência de marketing digital jurídico',
        bmc_activities_atend: '1. Triagem rápida do caso via formulário/WhatsApp\n2. Reunião inicial de diagnóstico (online ou presencial)\n3. Análise de documentos e proposta objetiva\n4. Ajuizamento e acompanhamento em escala',
        bmc_activities_content: '3 posts/semana no Instagram sobre direitos do consumidor\nReels: "O que fazer quando o banco cobra taxa indevida"\nBlog: artigos sobre superendividamento e telecom',
        bmc_value_servicos: '• Repactuação de dívidas e superendividamento\n• Ações contra bancos, telecom e planos de saúde\n• Problemas com e-commerce e compras online\n• Negativação indevida e revisão de contratos\n• Cobrança abusiva e produtos/serviços defeituosos',
        bmc_value_diferenciais: '• Atendimento ágil para alto volume de casos\n• Especialização certificada em Direito do Consumidor\n• Linguagem simples e processo transparente\n• Atendimento online para todo o Brasil',
        bmc_value_posicionamento: '"O advogado do consumidor que descomplica — seus direitos, sem burocracia."',
        bmc_value_voz: 'Arquétipo do Herói/Parceiro. Tom: direto, acessível, empático. Fala a linguagem do dia a dia.',
        bmc_rel_conquista: '• E-book: "Guia dos Direitos do Consumidor"\n• Perfil completo e atualizado no Google Meu Negócio\n• Conteúdo educativo sobre situações comuns de consumo',
        bmc_rel_fideliza: '• Newsletter mensal com dicas de consumo consciente\n• Acompanhamento transparente do andamento do caso\n• Bom atendimento que estimula indicações espontâneas\n• Conteúdo educativo contínuo sobre novos direitos',
        bmc_seg_perfil: 'Persona 1: Paula, 38 anos, endividada com cartão e empréstimos. Busca repactuar sem perder o mínimo existencial.\nPersona 2: Marcos, 45 anos, teve produto de e-commerce não entregue e cobrança indevida no plano de saúde.',
        bmc_seg_dores: '• Dívidas que não param de crescer e cobranças abusivas\n• Negativação indevida atrapalhando o crédito\n• Descaso de empresas em resolver problemas simples\n• Sensação de impotência diante de grandes empresas',
        bmc_seg_canais: '• Instagram e TikTok (público amplo)\n• Google (busca por "advogado consumidor" e temas específicos)\n• Indicação de clientes e relacionamento institucional\n• Grupos e comunidades sobre finanças pessoais',
        bmc_res_conhecimento: 'Especialização em Direito do Consumidor\nDomínio da Lei do Superendividamento\nProcessos otimizados para gestão de alto volume',
        bmc_res_infra: 'Site com blog e formulário de triagem\nSoftware de gestão de processos em escala\nEstrutura de atendimento online padronizado',
        bmc_costs_invest: 'Instagram/Google Ads: R$ 500/mês\nProdução de conteúdo: R$ 500/mês\nSoftware de gestão em escala: R$ 300/mês\nTotal: ~R$ 1.300/mês',
        bmc_costs_dist: '38% — Instagram/Google Ads\n39% — Produção de conteúdo\n23% — Software e automação',
        bmc_rev_metricas: 'Meta: 25 leads/mês via redes e busca\nTaxa de conversão: 32% (8 clientes novos/mês)\nCusto por lead: R$ 52\nTicket médio: R$ 1.200/caso',
        bmc_rev_roi: 'Investimento: R$ 1.300/mês\nRetorno esperado: 8 casos × R$ 1.200 = R$ 9.600\nROI: 638% | Payback: menos de 1 semana',
        obj_lp_bienal: '• Tornar-se referência regional em Direito do Consumidor\n• Faturar R$ 480.000/ano com operação de alto volume\n• Ter equipe de 2 advogados e 1 assistente de triagem\n• Lançar plataforma de triagem digital de casos',
        obj_lp_anual: '• Consolidar operação de alto volume com processos padronizados\n• Produzir e lançar e-book sobre superendividamento\n• Expandir atendimento online para todo o Brasil\n• Faturar R$ 240.000 no ano com ticket menor e volume alto',
        obj_lp_t1: '• Atingir 25 leads qualificados/mês via redes e busca\n• Publicar 3 Reels educativos por semana\n• Estruturar fluxo de triagem e onboarding padronizado\n• Implementar software de gestão de alto volume',
        obj_lp_t2: '• Consolidar carteira com 80 processos ativos\n• Lançar linha de atendimento para superendividamento\n• Alcançar nota 4,8+ no Google Meu Negócio com 60 avaliações\n• Reduzir custo por lead para R$ 45',
    },
    tributario: {
        bmc_partners_indicacao: 'Contadores e escritórios de contabilidade\nConsultores financeiros e de gestão empresarial\nAssociações comerciais e câmaras de dirigentes lojistas',
        bmc_partners_assoc: 'OAB — Comissão de Direito Tributário\nSindicatos patronais e federações de indústria/comércio\nSebrae e associações de PMEs',
        bmc_partners_tech: 'Software de análise e recuperação de créditos tributários\nPlataforma de gestão de contencioso administrativo\nAgência de marketing B2B',
        bmc_activities_atend: '1. Reunião inicial de diagnóstico tributário\n2. Análise de carga tributária e oportunidades de crédito\n3. Proposta de planejamento ou recuperação\n4. Reunião mensal de acompanhamento e atualização',
        bmc_activities_content: '2 posts/semana no LinkedIn sobre planejamento e Reforma Tributária\nGuia: "Recuperação de créditos para PMEs"\nWebinars educativos sobre a transição da Reforma Tributária',
        bmc_value_servicos: '• Planejamento tributário e reestruturação societária\n• Recuperação de créditos tributários\n• Contencioso administrativo e defesa em autuações\n• Consultoria sobre a Reforma Tributária (IBS/CBS/IS)\n• Regularização fiscal e parcelamentos',
        bmc_value_diferenciais: '• Diagnóstico tributário completo antes de qualquer tese\n• Especialização certificada em Direito Tributário\n• Linguagem de negócios voltada ao empresário\n• Pareceres formais e documentação rigorosa',
        bmc_value_posicionamento: '"O jurídico tributário que enxerga oportunidade onde outros veem só imposto — estratégia e segurança."',
        bmc_value_voz: 'Arquétipo do Sábio/Parceiro. Tom: estratégico, técnico e prático. Fala de ROI e segurança fiscal.',
        bmc_rel_conquista: '• Conteúdo educativo sobre a Reforma Tributária\n• Guia: "Recuperação de Créditos para PMEs"\n• Artigos técnicos que demonstram expertise (sem expor clientes)\n• Presença ativa em eventos empresariais',
        bmc_rel_fideliza: '• Relatório periódico de acompanhamento tributário\n• Alertas por e-mail sobre mudanças na legislação fiscal\n• Reunião trimestral estratégica incluída na assessoria\n• Atendimento próximo que estimula indicações espontâneas',
        bmc_seg_perfil: 'Persona 1: Ricardo, 48 anos, dono de indústria de médio porte. Quer reduzir carga tributária dentro da lei.\nPersona 2: Sócios de comércio (2 irmãos) com autuação fiscal e créditos de ICMS a recuperar.',
        bmc_seg_dores: '• Carga tributária alta corroendo a margem\n• Medo de autuações e passivo fiscal\n• Insegurança sobre os impactos da Reforma Tributária\n• Confusão entre o papel do contador e do advogado tributário',
        bmc_seg_canais: '• LinkedIn (empresários, CFOs e gestores)\n• Indicação de contadores e consultores\n• Google: "advogado tributário empresas"\n• Eventos e palestras em associações comerciais',
        bmc_res_conhecimento: 'Especialização/LLM em Direito Tributário\nDomínio da Reforma Tributária e regras de transição\nCertificação em recuperação de créditos e contencioso',
        bmc_res_infra: 'Site com conteúdo educativo e simulador de créditos\nSoftware de análise tributária e gestão de contencioso\nCRM para gestão de clientes recorrentes',
        bmc_costs_invest: 'LinkedIn Ads: R$ 500/mês\nProdução de conteúdo: R$ 700/mês\nEventos e networking: R$ 300/mês\nTotal: ~R$ 1.500/mês',
        bmc_costs_dist: '33% — LinkedIn Ads\n47% — Produção de conteúdo\n20% — Eventos e networking',
        bmc_rev_metricas: 'Meta: 6 leads qualificados/mês\nConversão para projeto/assessoria: 33% (2 clientes)\nTicket médio: R$ 8.000/projeto (ou R$ 3.000/mês recorrente)\nRecorrência média: 12 meses',
        bmc_rev_roi: 'Investimento: R$ 1.500/mês\nRetorno esperado: 2 projetos × R$ 8.000 = R$ 16.000\nROI: 967% | LTV médio: R$ 36.000/cliente recorrente',
        obj_lp_bienal: '• Tornar-se referência regional em planejamento tributário para PMEs\n• Atingir R$ 60.000/mês em receita entre projetos e recorrência\n• Contratar 2 advogados associados e 1 analista fiscal\n• Lançar programa de assessoria contínua da Reforma Tributária',
        obj_lp_anual: '• Consolidar autoridade em Reforma Tributária e recuperação de créditos\n• Atingir R$ 30.000/mês em receita com projetos e assessoria\n• Lançar programa "Diagnóstico Tributário PME"\n• Faturar R$ 360.000 no ano com 60% de receita recorrente',
        obj_lp_t1: '• Fechar 2 projetos de recuperação de créditos ou planejamento\n• Publicar guia "Recuperação de Créditos para PMEs" e gerar 150 leads\n• Realizar 1 webinar educativo sobre a Reforma Tributária\n• Implementar CRM e software de análise tributária',
        obj_lp_t2: '• Atingir 6 clientes em assessoria recorrente (R$ 18.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores qualificados\n• Fechar parcerias com 3 contadores e 2 associações comerciais\n• Publicar 2 artigos técnicos sobre a transição da Reforma (sem expor clientes)',
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
    },
    previdenciario: {
        mercado_oportunidade1: 'Envelhecimento populacional e milhões de segurados sem planejamento previdenciário — mercado crescente e subatendido no interior do país.',
        mercado_oportunidade2: 'Regras de transição da Reforma da Previdência tornaram o cálculo complexo, gerando demanda por especialista humano para planejar a melhor data e regra de aposentadoria.',
        mercado_ameaca1: 'Escritórios "de massa" ajuizando pedidos sem análise prévia do CNIS — pressionando honorários e desgastando a percepção de valor do trabalho especializado.',
        mercado_ameaca2: 'Digitalização do INSS (Meu INSS) permitindo que segurados protocolem sozinhos pedidos simples, reduzindo a demanda por casos básicos.',
        obj_visao5: 'Ser referência estadual em planejamento previdenciário, com equipe de 4 advogados, analista de cálculos e carteira de sindicatos rurais parceiros.',
        obj_1ano: '• 30 processos ativos com ticket médio de R$ 3.500\n• Parceria formal com 3 sindicatos rurais e 5 contadores\n• Nota 4.8 no Google com 40 avaliações\n• Blog com 500 visitas/mês orgânicas sobre aposentadoria',
        obj_trimestre: '• Publicar 2 artigos/semana sobre regras da Reforma da Previdência\n• Fechar parceria com 2 sindicatos rurais para triagem de segurados\n• Atingir nota 4.8 no Google com 30 avaliações\n• Lançar e-book "Guia da Aposentadoria após a Reforma"',
        forcas_forte1: 'Especialização em Direito Previdenciário com domínio das regras de transição e análise rigorosa do CNIS antes de qualquer protocolo.',
        forcas_forte2: 'Rede de contadores e sindicatos rurais que encaminham segurados, com atendimento online que alcança o público do interior sem barreira geográfica.',
        forcas_fraca1: 'Dependência de perícias médicas e prazos do INSS que alongam o ciclo do caso e tornam o fluxo de caixa irregular.',
        forcas_fraca2: 'Presença digital incipiente e ausência de conteúdo educativo estruturado para o público 50+, principal segmento de decisão.',
        matriz_fo1: 'Usar especialização em cálculo previdenciário (força) + demanda por planejamento pós-Reforma (oportunidade) → lançar serviço de "Planejamento de Aposentadoria" com simulação de cenários.',
        matriz_fo2: 'Usar rede de sindicatos rurais (força) + público subatendido do interior (oportunidade) → estruturar relacionamento institucional com palestras educativas e mutirões de análise de CNIS.',
        matriz_fa1: 'Usar análise rigorosa do CNIS (força) para se diferenciar dos escritórios de massa (ameaça) — publicar conteúdo educativo mostrando por que o planejamento prévio evita indeferimentos (sem prometer resultados, conforme Provimento 205/2021).',
        matriz_fa2: 'Usar atendimento humanizado (força) contra a digitalização impessoal do INSS (ameaça) — oferecer acompanhamento com linguagem simples do protocolo até o primeiro pagamento.',
        matriz_fraqo1: 'Superar o fluxo irregular (fraqueza) aproveitando a demanda por planejamento (oportunidade) → criar linha de planejamento previdenciário pago à vista, independente de perícia, para estabilizar a receita.',
        matriz_fraqo2: 'Superar a presença digital fraca (fraqueza) para alcançar o público 50+ (oportunidade) → publicar 3x/semana no Instagram/Facebook e investir R$ 300/mês em anúncios segmentados por idade.',
        obj_lp_bienal: '• Tornar-se referência regional em planejamento previdenciário\n• Faturar R$ 500.000/ano com concessões, revisões e planejamento\n• Ter 1 advogado associado e 1 analista de cálculos\n• Lançar programa de análise preventiva de CNIS para sindicatos',
        obj_lp_anual: '• Consolidar autoridade em planejamento previdenciário na região\n• Produzir e lançar e-book completo sobre aposentadoria pós-Reforma\n• Expandir atendimento online para 3 novos municípios\n• Faturar R$ 250.000 no ano com mix de concessões e revisões',
        obj_lp_t1: '• Atingir 10 leads qualificados/mês via redes e indicações\n• Publicar 1 artigo técnico por semana no blog\n• Fechar parceria formal com 2 sindicatos rurais\n• Implementar CRM e software de cálculo integrado',
        obj_lp_t2: '• Consolidar carteira com 30 processos ativos\n• Lançar palestra educativa "Aposentadoria após a Reforma"\n• Alcançar nota 4,8+ no Google Meu Negócio com 40 avaliações\n• Estruturar linha de revisões de benefícios já concedidos',
        obj_lp_t3: '• Lançar serviço de planejamento previdenciário pago à vista\n• Atingir 1.500 seguidores no Instagram/Facebook\n• Consolidar 25 processos ativos com ticket médio de R$ 3.500\n• Realizar 2 palestras educativas em sindicatos rurais parceiros',
        obj_lp_t4: '• Avaliar resultados do ano e estruturar expansão para novos municípios\n• Atingir 30 processos ativos e receita mensal de R$ 14.000\n• Estruturar mutirões de análise de CNIS com sindicatos parceiros\n• Publicar balanço do ano e definir meta de R$ 250.000 para o próximo',
    },
    consumidor: {
        mercado_oportunidade1: 'A Lei do Superendividamento ampliou os direitos de repactuação — milhões de brasileiros endividados formam um mercado de alto volume e demanda constante.',
        mercado_oportunidade2: 'Crescimento do e-commerce e dos serviços digitais (telecom, streaming, bancos digitais) multiplicando conflitos de consumo com ticket menor, porém recorrentes.',
        mercado_ameaca1: 'Plataformas de resolução de conflitos (consumidor.gov.br, apps de reclamação) resolvendo casos simples sem advogado, reduzindo a demanda por casos de baixa complexidade.',
        mercado_ameaca2: 'Escritórios de massa e "fábricas de ações" competindo por preço e volume, pressionando honorários e a percepção de qualidade da categoria.',
        obj_visao5: 'Ser referência regional em Direito do Consumidor com operação de alto volume estruturada, equipe de 4 advogados e triagem digital de casos.',
        obj_1ano: '• 80 processos ativos com ticket médio de R$ 1.200\n• Fluxo de triagem padronizado com 25 leads/mês\n• Nota 4.8 no Google com 60 avaliações\n• Instagram com 5.000 seguidores engajados',
        obj_trimestre: '• Estruturar fluxo de triagem e onboarding padronizado\n• Publicar 3 Reels/semana sobre direitos do consumidor\n• Atingir nota 4.8 no Google com 40 avaliações\n• Lançar linha de atendimento para superendividamento',
        forcas_forte1: 'Especialização em Direito do Consumidor com processos padronizados que permitem operar alto volume mantendo qualidade e agilidade.',
        forcas_forte2: 'Comunicação acessível nas redes sociais gerando reconhecimento e fluxo constante de leads de baixo custo por aquisição.',
        forcas_fraca1: 'Ticket médio baixo (R$ 1.200) exige alto volume e eficiência operacional — margem sensível a ineficiências de processo.',
        forcas_fraca2: 'Dependência de mídia paga e redes sociais como principal fonte de captação, sem canais orgânicos consolidados (SEO/indicação).',
        matriz_fo1: 'Usar processos padronizados (força) + demanda da Lei do Superendividamento (oportunidade) → criar linha dedicada de repactuação de dívidas com fluxo de triagem otimizado.',
        matriz_fo2: 'Usar comunicação acessível nas redes (força) + crescimento dos conflitos de e-commerce e telecom (oportunidade) → produzir conteúdo educativo que capta leads qualificados de forma escalável.',
        matriz_fa1: 'Usar especialização (força) contra as fábricas de ações (ameaça) — comunicar qualidade e acompanhamento transparente por meio de conteúdo educativo (sem prometer resultados, conforme OAB).',
        matriz_fa2: 'Usar eficiência operacional (força) diante das plataformas de resolução direta (ameaça) — focar em casos que exigem advogado (danos morais, superendividamento, contratos complexos).',
        matriz_fraqo1: 'Superar o ticket baixo (fraqueza) aproveitando o volume da Lei do Superendividamento (oportunidade) → montar pacotes de repactuação que agregam valor e elevam o ticket por cliente.',
        matriz_fraqo2: 'Superar a dependência de mídia paga (fraqueza) para capturar demanda orgânica (oportunidade) → publicar 2 artigos/mês de SEO sobre temas de consumo de alta busca.',
        obj_lp_bienal: '• Tornar-se referência regional em Direito do Consumidor\n• Faturar R$ 480.000/ano com operação de alto volume\n• Ter equipe de 2 advogados e 1 assistente de triagem\n• Lançar plataforma de triagem digital de casos',
        obj_lp_anual: '• Consolidar operação de alto volume com processos padronizados\n• Produzir e lançar e-book sobre superendividamento\n• Expandir atendimento online para todo o Brasil\n• Faturar R$ 240.000 no ano com ticket menor e volume alto',
        obj_lp_t1: '• Atingir 25 leads qualificados/mês via redes e busca\n• Publicar 3 Reels educativos por semana\n• Estruturar fluxo de triagem e onboarding padronizado\n• Implementar software de gestão de alto volume',
        obj_lp_t2: '• Consolidar carteira com 80 processos ativos\n• Lançar linha de atendimento para superendividamento\n• Alcançar nota 4,8+ no Google Meu Negócio com 60 avaliações\n• Reduzir custo por lead para R$ 45',
        obj_lp_t3: '• Publicar 2 artigos/mês de SEO sobre temas de consumo de alta busca\n• Atingir 3.500 seguidores engajados no Instagram\n• Consolidar 60 processos ativos com ticket médio de R$ 1.200\n• Estruturar pacotes de repactuação para elevar ticket por cliente',
        obj_lp_t4: '• Avaliar resultados do ano e planejar expansão da operação\n• Atingir 80 processos ativos e receita mensal de R$ 9.600\n• Consolidar canal orgânico (SEO) como fonte de leads complementar\n• Publicar balanço do ano e definir meta de R$ 240.000 para o próximo',
    },
    tributario: {
        mercado_oportunidade1: 'A Reforma Tributária (IBS, CBS e IS) é a maior mudança em 50 anos — a transição de 7 anos cria demanda recorrente por reestruturação e consultoria contínua para PMEs.',
        mercado_oportunidade2: 'Teses de recuperação de créditos tributários (PIS/COFINS, ICMS) com alto potencial de honorários de êxito e mercado de PMEs ainda pouco explorado.',
        mercado_ameaca1: 'Escritórios contábeis oferecendo serviços jurídicos de forma irregular e disputando a percepção do empresário sobre quem deve cuidar da estratégia tributária.',
        mercado_ameaca2: 'Instabilidade regulatória durante a transição pode alterar regras já planejadas, exigindo revisões constantes e gerando insegurança nos clientes.',
        obj_visao5: 'Ser referência regional em planejamento tributário para PMEs, com equipe de 4 advogados, analista fiscal e programa de assessoria contínua da Reforma.',
        obj_1ano: '• 6 clientes em assessoria recorrente (MRR R$ 18.000)\n• Ser palestrante em 2 eventos empresariais da região\n• LinkedIn com 2.000 seguidores qualificados\n• 4 projetos de recuperação de créditos concluídos',
        obj_trimestre: '• Publicar 2 artigos/semana sobre planejamento e Reforma Tributária\n• Fechar 2 projetos de recuperação de créditos ou planejamento\n• Realizar 1 webinar educativo sobre a Reforma Tributária\n• Lançar guia "Recuperação de Créditos para PMEs"',
        forcas_forte1: 'Especialização em Direito Tributário com domínio da Reforma e das teses de recuperação de créditos, com pareceres formais e documentação rigorosa.',
        forcas_forte2: 'Rede de contadores parceiros e linguagem de negócios que traduz o tributário em ROI e segurança fiscal para o empresário.',
        forcas_fraca1: 'Ciclo de vendas longo (projetos exigem diagnóstico e confiança) e concentração de receita em poucos projetos de alto valor.',
        forcas_fraca2: 'Presença digital ainda em construção e ausência de material educativo estruturado sobre a Reforma Tributária.',
        matriz_fo1: 'Usar expertise na Reforma Tributária (força) + demanda massiva da transição (oportunidade) → lançar programa "Diagnóstico Tributário PME" com assessoria contínua.',
        matriz_fo2: 'Usar rede de contadores (força) + teses de recuperação de créditos (oportunidade) → estruturar relacionamento institucional com conteúdo técnico e eventos educativos conjuntos.',
        matriz_fa1: 'Usar pareceres formais e documentação (força) contra escritórios contábeis irregulares (ameaça) — comunicar claramente o papel do advogado tributário vs contador por meio de conteúdo educativo.',
        matriz_fa2: 'Usar linguagem de negócios (força) diante da instabilidade regulatória (ameaça) — oferecer acompanhamento contínuo que atualiza o cliente a cada mudança da transição.',
        matriz_fraqo1: 'Superar a concentração de receita (fraqueza) aproveitando a transição de 7 anos (oportunidade) → migrar clientes de projeto para assessoria recorrente da Reforma Tributária.',
        matriz_fraqo2: 'Superar a presença digital fraca (fraqueza) para capturar a demanda da Reforma (oportunidade) → publicar 2x/semana no LinkedIn e realizar 1 webinar educativo mensal.',
        obj_lp_bienal: '• Tornar-se referência regional em planejamento tributário para PMEs\n• Atingir R$ 60.000/mês em receita entre projetos e recorrência\n• Contratar 2 advogados associados e 1 analista fiscal\n• Lançar programa de assessoria contínua da Reforma Tributária',
        obj_lp_anual: '• Consolidar autoridade em Reforma Tributária e recuperação de créditos\n• Atingir R$ 30.000/mês em receita com projetos e assessoria\n• Lançar programa "Diagnóstico Tributário PME"\n• Faturar R$ 360.000 no ano com 60% de receita recorrente',
        obj_lp_t1: '• Fechar 2 projetos de recuperação de créditos ou planejamento\n• Publicar guia "Recuperação de Créditos para PMEs" e gerar 150 leads\n• Realizar 1 webinar educativo sobre a Reforma Tributária\n• Implementar CRM e software de análise tributária',
        obj_lp_t2: '• Atingir 6 clientes em assessoria recorrente (R$ 18.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores qualificados\n• Fechar parcerias com 3 contadores e 2 associações comerciais\n• Publicar 2 artigos técnicos sobre a transição da Reforma (sem expor clientes)',
        obj_lp_t3: '• Lançar programa "Diagnóstico Tributário PME" com assessoria contínua\n• Atingir 4 clientes em assessoria recorrente (MRR R$ 12.000)\n• Realizar webinar mensal sobre a transição da Reforma Tributária\n• Concluir 2 projetos de recuperação de créditos',
        obj_lp_t4: '• Avaliar resultados do ano e migrar clientes de projeto para recorrência\n• Atingir 6 clientes em assessoria recorrente (MRR R$ 18.000)\n• Reduzir concentração de receita: nenhum cliente acima de 25% do faturamento\n• Publicar relatório "Impactos da Reforma Tributária para PMEs" e planejar o próximo ano',
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


// ─── CANVAS DE DIAGNÓSTICO E AÇÕES ───────────────────────────────────────────
const DIAG_ACOES_KEY = 'mktjur_diagnostico_acoes';
const PLANO_KEY      = 'mktjur_plano_acoes';

// ── DIAG_ACOES_EXAMPLES ───────────────────────────────────────────────────────
const DIAG_ACOES_EXAMPLES = {
    trabalhista: {
        mercado_oportunidade1: '6 milhões de PMEs sem assessoria trabalhista preventiva — mercado de R$ 500M/ano no Brasil totalmente subatendido localmente.',
        mercado_oportunidade2: 'Crescimento de consultas preventivas pós-Reforma Trabalhista: teletrabalho, IA no RH e nova jurisprudência gerando demanda especializada crescente.',
        mercado_ameaca1: 'LegalTechs automatizando cálculos de rescisão e triagem — reduzindo demanda por serviços básicos e pressionando honorários para baixo.',
        mercado_ameaca2: 'Advogados generalistas com preços 40% menores competindo pelos clientes que ainda não percebem o valor da especialização certificada.',
        mercado_insights: 'O mercado de PMEs sem assessoria preventiva é a grande oportunidade — mas exige comunicação de valor clara para competir com generalistas baratos.',
        obj_visao5: 'Ser o escritório de referência nacional em compliance trabalhista para PMEs, com plataforma digital própria, equipe de 5 advogados e MRR de R$ 100.000/mês.',
        obj_1ano: '• 15 clientes PMEs com contrato de assessoria recorrente (MRR R$ 13.500)\n• Ser palestrante em 2 eventos de RH da região\n• Site com blog ativo e 500 visitas/mês orgânicas',
        obj_trimestre: '• Publicar 2 artigos/semana no LinkedIn sobre riscos trabalhistas para PMEs\n• Fechar 2 contratos de assessoria preventiva mensais\n• Atingir nota 4.8 no Google com 30 avaliações\n• Lançar e-book "Guia do Compliance Trabalhista para PMEs"',
        forcas_forte1: 'Especialização certificada em Direito do Trabalho com 8 anos de experiência em contencioso e preventivo e rede de 8 contadores parceiros.',
        forcas_forte2: 'Atendimento 100% online para todo o Brasil com nota 4.9 no Google e 45 avaliações — reputação consolidada e diferencial percebido pelo mercado.',
        forcas_fraca1: 'Escritório solo sem equipe de apoio — capacidade limitada de atender mais clientes simultaneamente, criando gargalo de crescimento.',
        forcas_fraca2: 'LinkedIn com apenas 450 seguidores e sem budget de marketing definido — baixa visibilidade digital e dependência de 2 grandes clientes (60% da receita).',
        forcas_insights: 'A especialização é forte mas a visibilidade digital é o gargalo. Resolver o LinkedIn resolve o principal obstáculo de crescimento.',
        acoes_preservar1: 'Manter o check-in mensal com todos os clientes de assessoria preventiva — essa prática tem zero churn e gera indicações espontâneas. Não abrir mão mesmo com crescimento de carteira.',
        acoes_preservar2: 'Preservar a rede de 8 contadores parceiros: envio quinzenal de boletim técnico exclusivo e ligação de relacionamento uma vez por mês. É a principal fonte de clientes qualificados.',
        acoes_iniciar1: 'Iniciar publicação sistemática no LinkedIn: 2 posts educativos/semana sobre riscos trabalhistas para PMEs. Meta: 1.000 seguidores em 90 dias e 3 leads qualificados/mês via rede.',
        acoes_iniciar2: 'Iniciar uso de CRM (HubSpot gratuito): cadastrar todos os leads, registrar follow-ups e medir taxa de conversão. Hoje não há visibilidade sobre o pipeline.',
        acoes_aprimorar1: 'Aprimorar proposta comercial: criar template PDF profissional com escopo detalhado, prazo e honorários — substituir o envio informal por WhatsApp e aumentar taxa de fechamento.',
        acoes_aprimorar2: 'Aprimorar onboarding de clientes: criar checklist digital e contrato com assinatura eletrônica (DocuSign) para reduzir de 7 dias manuais para 1 dia automatizado.',
        acoes_eliminar1: 'Eliminar reuniões de prospecção sem pré-qualificação: 2h/semana perdidas com empresas fora do perfil. Implementar formulário de triagem antes de qualquer agendamento.',
        acoes_eliminar2: 'Eliminar clientes com ticket abaixo de R$ 500 que consomem o mesmo tempo que clientes maiores — comunicar reajuste ou encerrar com 30 dias de antecedência.',
        obj_lp_bienal: '• Tornar-se referência nacional em Direito Trabalhista preventivo\n• Faturar R$ 600.000/ano com consultoria, cursos e contencioso\n• Ter 1 sócio e 1 colaborador contratados\n• Lançar plataforma de gestão trabalhista para PMEs',
        obj_lp_anual: '• Tornar-se referência regional em Direito Trabalhista preventivo\n• Produzir e lançar e-book completo sobre compliance trabalhista\n• Expandir atuação para 2 novos estados via atendimento 100% online\n• Faturar R$ 300.000 no ano com mix de consultoria e contencioso',
        obj_lp_t1: '• Atingir 8 leads qualificados/mês via LinkedIn\n• Publicar 1 artigo técnico por semana no blog\n• Fechar parceria formal com 2 escritórios de contabilidade\n• Implementar CRM para gestão de casos e follow-up',
        obj_lp_t2: '• Consolidar carteira com 20 empresas em assessoria preventiva\n• Lançar curso online: "Prevenção de Passivos Trabalhistas"\n• Alcançar nota 4,8+ no Google Meu Negócio com 50 avaliações\n• Gerar R$ 18.000/mês de receita recorrente',
        acoes_plano: [
            { acao: 'Publicar 2 posts/semana no LinkedIn sobre riscos trabalhistas', data: '2025-08-15', responsavel: 'Advogado(a) sócio(a)', status: 'fazendo' },
            { acao: 'Implementar CRM HubSpot gratuito e cadastrar pipeline de leads', data: '2025-08-30', responsavel: 'Advogado(a) sócio(a)', status: 'afazer' },
            { acao: 'Criar proposta comercial em PDF e substituir envio por WhatsApp', data: '2025-09-15', responsavel: 'Advogado(a) sócio(a)', status: 'afazer' }
        ]
    },
    familia: {
        mercado_oportunidade1: 'Crescimento de divórcios (+18% pós-pandemia) e expansão do inventário extrajudicial — casos que exigem especialista humano e não podem ser automatizados.',
        mercado_oportunidade2: 'Famílias recompostas, contratos de convivência e guarda compartilhada gerando nova demanda especializada sem concorrente com atendimento integrado na cidade.',
        mercado_ameaca1: 'Plataformas de divórcio online por R$ 800 para casos simples — erodindo percepção de valor e pressionando os honorários de toda a categoria para baixo.',
        mercado_ameaca2: 'Crescimento de novos advogados de família na região com presença digital forte e preços inicialmente abaixo do mercado para ganhar carteira de clientes.',
        mercado_insights: 'A oportunidade está nos casos que exigem especialização humana (guarda, famílias recompostas) — não compete diretamente com as plataformas baratas de casos simples.',
        obj_visao5: 'Ser a referência estadual em advocacia familiar humanizada, com plataforma de mediação digital, equipe de 3 advogados e faturamento de R$ 400.000/ano.',
        obj_1ano: '• 10 casos novos/mês com ticket médio de R$ 5.000\n• Nota 4.9 no Google com 60 avaliações\n• 5.000 seguidores engajados no Instagram\n• Lançar programa de mediação pré-judicial com psicólogo parceiro',
        obj_trimestre: '• Lançar e-book "Guia do Divórcio sem Trauma" e captar 200 e-mails\n• Fechar parceria formal com 3 psicólogos da cidade\n• Publicar 3 posts/semana no Instagram com conteúdo acolhedor\n• Criar pacote de inventário extrajudicial com preço fixo',
        forcas_forte1: 'Certificação em mediação familiar + parceria exclusiva com psicóloga — único escritório da cidade com atendimento jurídico e emocional integrado.',
        forcas_forte2: 'Instagram com 3.200 seguidores engajados e nota 4.9 no Google com 30 avaliações verificadas — forte reputação local consolidada.',
        forcas_fraca1: 'Ticket médio baixo (R$ 3.500 vs média de R$ 5.000) e sem serviço recorrente — fluxo de caixa instável e totalmente dependente de novos casos.',
        forcas_fraca2: 'Sem blog ou site com SEO ativo — depende exclusivamente do Instagram e indicações, sem captação orgânica via Google.',
        forcas_insights: 'A parceria com psicóloga é o diferencial mais difícil de copiar — vale aprofundar essa proposta de valor em toda a comunicação.',
        acoes_preservar1: 'Preservar a parceria exclusiva com a psicóloga parceira — este diferencial é único na cidade e é citado em 80% das avaliações positivas. Formalizar e ampliar a colaboração.',
        acoes_preservar2: 'Manter a cadência de 3 posts/semana no Instagram com conteúdo acolhedor — é o principal canal de captação orgânica com custo zero.',
        acoes_iniciar1: 'Iniciar blog com SEO: publicar 2 artigos/mês sobre "advogado divórcio [cidade]" e "inventário extrajudicial" para capturar buscas no Google.',
        acoes_iniciar2: 'Iniciar pacote de inventário extrajudicial com preço fixo apresentado em propostas individuais — hoje o serviço existe mas não é comunicado estruturadamente.',
        acoes_aprimorar1: 'Aprimorar atendimento inicial: criar roteiro de acolhimento por telefone para reduzir o tempo da primeira conversa de 45 min para 20 min sem perder a qualidade humanizada.',
        acoes_aprimorar2: 'Aprimorar comunicação de honorários: criar proposta visual com etapas claras do processo para elevar o ticket médio de R$ 3.500 para R$ 5.000 sem perder conversão.',
        acoes_eliminar1: 'Eliminar atendimentos de triagem não qualificados: criar formulário de pré-atendimento para filtrar casos fora do perfil ideal antes de agendar consulta.',
        acoes_eliminar2: 'Eliminar a gestão de redes sociais feita na madrugada — causa esgotamento. Contratar freelancer de conteúdo por R$ 600/mês para assumir a produção dos posts.',
        obj_lp_bienal: '• Ser a referência em advocacia familiar humanizada no estado\n• Faturar R$ 400.000/ano com atendimento online nacional\n• Lançar plataforma de mediação digital com parceiros\n• Ter equipe com 1 advogado associado e 1 assistente',
        obj_lp_anual: '• Tornar-se referência em advocacia familiar humanizada na região\n• Lançar programa de mediação pré-judicial com psicólogo parceiro\n• Expandir atendimento online para todo o Brasil com pacote digital\n• Faturar R$ 200.000 no ano com foco em casos consensuais e inventários',
        obj_lp_t1: '• Atingir 6 leads qualificados/mês via Instagram e indicações\n• Publicar 3 Reels educativos por semana com 500+ visualizações\n• Fechar parceria ativa com 3 psicólogos e 2 mediadores\n• Lançar e-book "Guia do Divórcio sem Trauma" e capturar 200 e-mails',
        obj_lp_t2: '• Consolidar 15 casos ativos com ticket médio de R$ 4.500\n• Atingir 1.000 seguidores engajados no Instagram\n• Alcançar nota 4,9+ no Google com 30 avaliações verificadas\n• Gerar R$ 13.500/mês de receita e reduzir custo por lead para R$ 175',
        acoes_plano: [
            { acao: 'Publicar 2 artigos de SEO/mês sobre divórcio e inventário', data: '2025-08-20', responsavel: 'Advogada + Redator', status: 'afazer' },
            { acao: 'Contratar freelancer de conteúdo para Instagram (R$ 600/mês)', data: '2025-08-10', responsavel: 'Advogada sócia', status: 'fazendo' },
            { acao: 'Criar proposta visual de honorários com etapas do processo', data: '2025-09-01', responsavel: 'Advogada sócia', status: 'feito' }
        ]
    },
    empresarial: {
        mercado_oportunidade1: '15 milhões de PMEs no Brasil sem assessoria jurídica recorrente — mercado subatendido que busca previsibilidade, preço fixo e linguagem de negócios.',
        mercado_oportunidade2: 'Reforma Tributária + regulação de IA e LGPD criando demanda massiva por especialistas — maior oportunidade para advogados empresariais nos últimos 50 anos.',
        mercado_ameaca1: 'Big 4 (consultorias internacionais) oferecendo serviços jurídicos integrados e LegalTechs para contratos simples e due diligence automatizada.',
        mercado_ameaca2: 'Boutiques jurídicas especializadas crescendo com modelo de assinatura similar — compressão de preços e dificuldade crescente de diferenciação.',
        mercado_insights: 'A Reforma Tributária é uma janela de 7 anos de demanda recorrente — quem se posicionar como referência agora tem vantagem de longo prazo.',
        obj_visao5: 'Ser o escritório de referência nacional para startups e PMEs, com "Legal as a Service" em plataforma própria, 8 advogados e MRR de R$ 150.000/mês.',
        obj_1ano: '• 20 clientes de assinatura mensal (MRR R$ 50.000)\n• LinkedIn com 8.000 seguidores qualificados e 5% de engajamento\n• 2 parcerias formais com aceleradoras de startups\n• Plataforma digital de acesso para clientes lançada',
        obj_trimestre: '• Webinar educativo sobre Reforma Tributária para PMEs (meta: 200 participantes)\n• Fechar 3 novos contratos de assinatura mensal\n• Publicar guia "10 Riscos Jurídicos para Startups"\n• Atingir 5.000 seguidores qualificados no LinkedIn',
        forcas_forte1: 'Expertise em contratos B2B, M&A e LGPD + 35 clientes recorrentes com MRR consolidado e modelo de assinatura com preço fixo único na região.',
        forcas_forte2: 'LinkedIn com 4.500 seguidores qualificados e 5 anos de experiência no ecossistema de startups — autoridade reconhecida e referência no nicho.',
        forcas_fraca1: '3 clientes representam 45% da receita — alto risco de concentração que pode comprometer o caixa em caso de cancelamento de um grande contrato.',
        forcas_fraca2: 'Onboarding ainda manual e demorado (7 dias úteis) — experiência abaixo das expectativas de startups que valorizam velocidade e automação de processos.',
        forcas_insights: 'Concentração de receita é o maior risco operacional — resolver isso é prioridade antes de qualquer crescimento.',
        acoes_preservar1: 'Preservar o modelo de assinatura com preço fixo e reunião trimestral incluída — é o principal diferencial competitivo e responsável pela retenção dos 35 clientes recorrentes.',
        acoes_preservar2: 'Manter a produção de conteúdo educativo no LinkedIn: 2 posts/semana sobre riscos jurídicos para startups. É a principal fonte de leads qualificados sem custo de mídia.',
        acoes_iniciar1: 'Iniciar programa de diversificação de carteira: meta de 50 clientes em 12 meses para reduzir concentração dos 3 maiores de 45% para menos de 20% da receita.',
        acoes_iniciar2: 'Iniciar webinars mensais educativos sobre a Reforma Tributária para PMEs — posicionar como a referência do nicho e gerar leads qualificados de alto valor.',
        acoes_aprimorar1: 'Aprimorar onboarding: implementar assinatura eletrônica + portal do cliente para reduzir de 7 dias para 1 dia — startups esperam velocidade e automação.',
        acoes_aprimorar2: 'Aprimorar relatório mensal: adicionar dashboard visual com indicadores jurídicos do cliente para elevar percepção de valor e justificar o ticket do pacote.',
        acoes_eliminar1: 'Eliminar a prática de aceitar clientes fora do perfil ideal que consomem mais tempo do que geram receita. Criar critério de qualificação mínima antes de aceitar novos contratos.',
        acoes_eliminar2: 'Eliminar reuniões internas sem pauta definida — consomem 4h/semana sem decisão. Adotar formato assíncrono via Loom para atualizações e reservar reuniões apenas para decisões.',
        obj_lp_bienal: '• Tornar-se o escritório de referência para startups e PMEs no país\n• Atingir R$ 60.000/mês em receita recorrente com 24 clientes de pacote\n• Lançar "Legal as a Service" com plataforma própria\n• Contratar 2 advogados associados e 1 gerente de operações',
        obj_lp_anual: '• Tornar-se o advogado empresarial de referência para startups e PMEs da região\n• Atingir R$ 30.000/mês em receita recorrente com 12 clientes de pacote\n• Lançar programa "Startup Legal Kit" com contratos e compliance incluídos\n• Faturar R$ 360.000 no ano com 70% de receita previsível via assinaturas',
        obj_lp_t1: '• Fechar 2 contratos de assessoria jurídica recorrente (R$ 2.500/mês)\n• Publicar guia: "10 Riscos Jurídicos para Startups" e gerar 150 leads\n• Participar de 2 eventos do ecossistema de startups como palestrante\n• Implementar onboarding digital com contrato e assinatura eletrônica',
        obj_lp_t2: '• Atingir 8 clientes em pacote mensal recorrente (R$ 20.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores e 5% de engajamento\n• Fechar parcerias com 3 contadores e 2 aceleradoras como fonte de indicação\n• Publicar 2 artigos técnicos aprofundados demonstrando expertise (sem expor casos reais)',
        acoes_plano: [
            { acao: 'Implementar onboarding digital com assinatura eletrônica', data: '2025-08-25', responsavel: 'Sócio + TI', status: 'fazendo' },
            { acao: 'Realizar primeiro webinar sobre Reforma Tributária para PMEs', data: '2025-09-10', responsavel: 'Advogado sócio', status: 'afazer' },
            { acao: 'Criar critério de qualificação de clientes e implementar triagem', data: '2025-08-15', responsavel: 'Sócios', status: 'feito' }
        ]
    },
    previdenciario: {
        mercado_oportunidade1: 'Envelhecimento populacional e mais de 30 milhões de beneficiários do INSS — demanda crescente por aposentadorias, revisões e planejamento previdenciário.',
        mercado_oportunidade2: 'Complexidade após a Reforma da Previdência e alto índice de indeferimentos de BPC/LOAS e auxílios por incapacidade geram procura por especialista.',
        mercado_ameaca1: 'Escritórios "de massa" com atendimento padronizado disputando o segurado por volume e desvalorizando o trabalho técnico especializado.',
        mercado_ameaca2: 'Digitalização do INSS (Meu INSS) exigindo atualização constante e segurados protocolando pedidos simples sozinhos, reduzindo demanda por casos básicos.',
        mercado_insights: 'O público previdenciário valoriza atendimento próximo e linguagem simples — diferencial que escritórios de massa não conseguem replicar.',
        obj_visao5: 'Ser referência regional em Direito Previdenciário com equipe de 4 advogados, atendimento híbrido e forte produção de conteúdo educativo sobre benefícios do INSS.',
        obj_1ano: '• 20 novos requerimentos/mês, rede de 10 parceiros entre contadores e sindicatos\n• Canal no YouTube com vídeos explicativos sobre aposentadorias\n• Nota 4.8 no Google com 40 avaliações',
        obj_trimestre: '• Publicar 2 artigos/semana sobre regras de aposentadoria\n• Realizar 1 palestra educativa em sindicato\n• Estruturar checklist de planejamento previdenciário\n• Lançar e-book "Guia da Aposentadoria após a Reforma"',
        forcas_forte1: 'Especialização em Direito Previdenciário com 7 anos de experiência em concessão, revisão e incapacidade, e domínio do sistema Meu INSS.',
        forcas_forte2: 'Rede de contadores e sindicatos rurais que encaminham segurados e atendimento acolhedor reconhecido por um público que valoriza clareza e proximidade.',
        forcas_fraca1: 'Processos de longa duração e receita concentrada em honorários de êxito — fluxo de caixa irregular ao longo do ano.',
        forcas_fraca2: 'Baixa presença digital e ausência de material educativo estruturado para orientar segurados antes da procura.',
        forcas_insights: 'A dependência de honorários de êxito é o principal risco financeiro — criar linha de planejamento pago à vista é a prioridade estratégica.',
        acoes_preservar1: 'Manter a análise detalhada do CNIS antes de qualquer protocolo — é o principal diferencial que evita indeferimentos e gera confiança do segurado. Não abrir mão por volume.',
        acoes_preservar2: 'Preservar a parceria com sindicatos rurais — é a fonte mais qualificada de segurados com real necessidade. Manter reunião mensal de relacionamento.',
        acoes_iniciar1: 'Iniciar linha de planejamento previdenciário pago à vista (honorários fixos): serviço independente de perícia que estabiliza a receita no curto prazo.',
        acoes_iniciar2: 'Iniciar canal no YouTube com vídeos educativos semanais sobre regras de aposentadoria pós-Reforma — alcançar o público 50+ que pesquisa no YouTube antes de procurar advogado.',
        acoes_aprimorar1: 'Aprimorar comunicação durante o processo: criar atualização quinzenal por WhatsApp para o segurado com status simplificado — hoje o cliente fica sem notícias por semanas.',
        acoes_aprimorar2: 'Aprimorar diagnóstico inicial de CNIS: criar relatório visual com simulação de cenários de aposentadoria para o segurado entender as opções antes de decidir.',
        acoes_eliminar1: 'Eliminar casos de BPC/LOAS sem diagnóstico mínimo prévio — geram retrabalho com indeferimentos previsíveis. Exigir laudo médico básico antes de aceitar o caso.',
        acoes_eliminar2: 'Eliminar deslocamentos presenciais desnecessários: hoje 40% das consultas iniciais são presenciais sem necessidade. Migrar triagem e diagnóstico para online.',
        obj_lp_bienal: '• Tornar-se referência regional em planejamento previdenciário\n• Faturar R$ 500.000/ano com concessões, revisões e planejamento\n• Ter 1 advogado associado e 1 analista de cálculos\n• Lançar programa de análise preventiva de CNIS para sindicatos',
        obj_lp_anual: '• Consolidar autoridade em planejamento previdenciário na região\n• Produzir e lançar e-book completo sobre aposentadoria pós-Reforma\n• Expandir atendimento online para 3 novos municípios\n• Faturar R$ 250.000 no ano com mix de concessões e revisões',
        obj_lp_t1: '• Atingir 10 leads qualificados/mês via redes e indicações\n• Publicar 1 artigo técnico por semana no blog\n• Fechar parceria formal com 2 sindicatos rurais\n• Implementar CRM e software de cálculo integrado',
        obj_lp_t2: '• Consolidar carteira com 30 processos ativos\n• Lançar palestra educativa "Aposentadoria após a Reforma"\n• Alcançar nota 4,8+ no Google Meu Negócio com 40 avaliações\n• Estruturar linha de revisões de benefícios já concedidos',
        acoes_plano: [
            { acao: 'Criar serviço de planejamento previdenciário com honorários fixos', data: '2025-08-20', responsavel: 'Advogado(a) especialista', status: 'afazer' },
            { acao: 'Gravar e publicar primeiros 4 vídeos sobre aposentadoria no YouTube', data: '2025-09-01', responsavel: 'Advogado(a) + Editor', status: 'fazendo' },
            { acao: 'Implementar atualização quinzenal via WhatsApp para clientes ativos', data: '2025-08-15', responsavel: 'Assistente + Advogado(a)', status: 'feito' }
        ]
    },
    consumidor: {
        mercado_oportunidade1: 'A Lei do Superendividamento ampliou os direitos de repactuação — milhões de brasileiros endividados formam um mercado de alto volume e demanda constante.',
        mercado_oportunidade2: 'Crescimento do e-commerce e dos serviços digitais multiplicando conflitos de consumo com ticket menor, porém recorrentes.',
        mercado_ameaca1: 'Plataformas de resolução de conflitos resolvendo casos simples sem advogado, reduzindo a demanda por casos de baixa complexidade.',
        mercado_ameaca2: 'Escritórios de massa e "fábricas de ações" competindo por preço e volume, pressionando honorários e a percepção de qualidade da categoria.',
        mercado_insights: 'Focar nos casos que exigem advogado (danos morais, superendividamento, contratos) é mais estratégico do que competir por volume no mercado básico.',
        obj_visao5: 'Ser referência em Direito do Consumidor na região, com operação eficiente para alto volume, equipe de 5 pessoas e forte conteúdo educativo sobre direitos do consumidor.',
        obj_1ano: '• 40 casos novos/mês com processo padronizado\n• Base de conteúdo com 40 artigos educativos\n• Canal de esclarecimento sobre superendividamento\n• Nota 4.8 no Google com 60 avaliações',
        obj_trimestre: '• Publicar 3 conteúdos/semana sobre direitos do consumidor\n• Estruturar fluxo de triagem digital\n• Realizar 1 palestra educativa sobre superendividamento\n• Lançar linha de atendimento para superendividamento',
        forcas_forte1: 'Experiência de 6 anos em demandas contra bancos, telecom e planos de saúde e processos internos preparados para alto volume.',
        forcas_forte2: 'Presença digital consolidada com conteúdo educativo e boa reputação em avaliações verificadas.',
        forcas_fraca1: 'Ticket médio menor por caso — rentabilidade depende de escala e eficiência operacional.',
        forcas_fraca2: 'Dependência de honorários de êxito e alto custo de triagem manual de novos casos.',
        forcas_insights: 'A eficiência operacional é o ativo mais importante — cada processo padronizado é um diferencial competitivo que escritórios novos não têm.',
        acoes_preservar1: 'Preservar os processos padronizados de peças jurídicas repetitivas — são a base da operação de alto volume com qualidade. Documentar e proteger contra rotatividade da equipe.',
        acoes_preservar2: 'Manter a produção de conteúdo educativo nas redes sociais: 3 posts/semana sobre direitos do consumidor — principal fonte de leads com menor custo por aquisição.',
        acoes_iniciar1: 'Iniciar linha dedicada de repactuação de dívidas (superendividamento): criar fluxo específico de triagem e peças para este tipo de caso que cresce com a Lei 14.181/2021.',
        acoes_iniciar2: 'Iniciar estratégia de SEO: publicar 2 artigos/mês sobre temas de alto volume de busca para gerar leads orgânicos e reduzir dependência de mídia paga.',
        acoes_aprimorar1: 'Aprimorar triagem de casos: criar formulário digital de pré-análise para reduzir triagem manual de 30 min para 5 min por caso e escalar o volume sem aumentar custo.',
        acoes_aprimorar2: 'Aprimorar comunicação com clientes: criar painel no WhatsApp Business para atualizar todos os clientes sobre andamento dos processos sem custo de tempo individual.',
        acoes_eliminar1: 'Eliminar casos com valor de causa abaixo de R$ 2.000 que consomem tanto recurso quanto casos maiores — revisar critério de aceitação com piso de valor mínimo.',
        acoes_eliminar2: 'Eliminar o processo manual de acompanhamento de prazos em planilha — migrar para sistema jurídico com alertas automáticos para eliminar risco de perda de prazo.',
        obj_lp_bienal: '• Tornar-se referência regional em Direito do Consumidor\n• Faturar R$ 480.000/ano com operação de alto volume\n• Ter equipe de 2 advogados e 1 assistente de triagem\n• Lançar plataforma de triagem digital de casos',
        obj_lp_anual: '• Consolidar operação de alto volume com processos padronizados\n• Produzir e lançar e-book sobre superendividamento\n• Expandir atendimento online para todo o Brasil\n• Faturar R$ 240.000 no ano com ticket menor e volume alto',
        obj_lp_t1: '• Atingir 25 leads qualificados/mês via redes e busca\n• Publicar 3 Reels educativos por semana\n• Estruturar fluxo de triagem e onboarding padronizado\n• Implementar software de gestão de alto volume',
        obj_lp_t2: '• Consolidar carteira com 80 processos ativos\n• Lançar linha de atendimento para superendividamento\n• Alcançar nota 4,8+ no Google Meu Negócio com 60 avaliações\n• Reduzir custo por lead para R$ 45',
        acoes_plano: [
            { acao: 'Criar formulário digital de triagem e pré-análise de casos', data: '2025-08-18', responsavel: 'Advogado(a) + Dev', status: 'fazendo' },
            { acao: 'Estruturar linha de repactuação de dívidas com fluxo próprio', data: '2025-09-05', responsavel: 'Advogado(a) sócio(a)', status: 'afazer' },
            { acao: 'Migrar controle de prazos de planilha para sistema jurídico', data: '2025-08-10', responsavel: 'Equipe jurídica', status: 'feito' }
        ]
    },
    tributario: {
        mercado_oportunidade1: 'A Reforma Tributária (IBS, CBS e IS) é a maior mudança em 50 anos — a transição de 7 anos cria demanda recorrente por reestruturação e consultoria contínua para PMEs.',
        mercado_oportunidade2: 'Teses de recuperação de créditos tributários (PIS/COFINS, ICMS) com alto potencial de honorários de êxito e mercado de PMEs ainda pouco explorado.',
        mercado_ameaca1: 'Escritórios contábeis oferecendo serviços jurídicos de forma irregular e disputando a percepção do empresário sobre quem deve cuidar da estratégia tributária.',
        mercado_ameaca2: 'Instabilidade regulatória durante a transição pode alterar regras já planejadas, exigindo revisões constantes e gerando insegurança nos clientes.',
        mercado_insights: 'A Reforma Tributária é uma janela única — quem se comunicar primeiro como referência tem vantagem de longo prazo sobre quem esperar o cenário se estabilizar.',
        obj_visao5: 'Ser referência regional em planejamento tributário para PMEs, com equipe de 4 advogados, analista fiscal e programa de assessoria contínua da Reforma.',
        obj_1ano: '• 6 clientes em assessoria recorrente (MRR R$ 18.000)\n• Ser palestrante em 2 eventos empresariais da região\n• LinkedIn com 2.000 seguidores qualificados\n• 4 projetos de recuperação de créditos concluídos',
        obj_trimestre: '• Publicar 2 artigos/semana sobre planejamento e Reforma Tributária\n• Fechar 2 projetos de recuperação de créditos ou planejamento\n• Realizar 1 webinar educativo sobre a Reforma Tributária\n• Lançar guia "Recuperação de Créditos para PMEs"',
        forcas_forte1: 'Especialização em Direito Tributário com domínio da Reforma e das teses de recuperação de créditos, com pareceres formais e documentação rigorosa.',
        forcas_forte2: 'Rede de contadores parceiros e linguagem de negócios que traduz o tributário em ROI e segurança fiscal para o empresário.',
        forcas_fraca1: 'Ciclo de vendas longo (projetos exigem diagnóstico e confiança) e concentração de receita em poucos projetos de alto valor.',
        forcas_fraca2: 'Presença digital ainda em construção e ausência de material educativo estruturado sobre a Reforma Tributária.',
        forcas_insights: 'A combinação de linguagem de negócios + expertise técnica é rara no mercado tributário — é o diferencial central a ser amplificado.',
        acoes_preservar1: 'Manter os eventos educativos conjuntos com contadores parceiros — são a principal fonte de leads qualificados de PMEs com real demanda tributária. Realizar ao menos 1 evento por bimestre.',
        acoes_preservar2: 'Preservar a atualização constante sobre a Reforma Tributária: assinar publicações especializadas, participar de grupos técnicos e ser o primeiro a comunicar mudanças para os clientes.',
        acoes_iniciar1: 'Iniciar programa "Diagnóstico Tributário PME": serviço pago à vista de diagnóstico de enquadramento e oportunidades de recuperação de créditos — porta de entrada para assessoria recorrente.',
        acoes_iniciar2: 'Iniciar produção de conteúdo no LinkedIn: 2 posts/semana sobre a Reforma Tributária em linguagem de negócios para CEOs e CFOs — hoje a presença digital é quase zero.',
        acoes_aprimorar1: 'Aprimorar relatório de assessoria recorrente: adicionar painel mensal com alertas de mudanças regulatórias da Reforma e impactos específicos para o cliente — aumentar valor percebido.',
        acoes_aprimorar2: 'Aprimorar processo de recuperação de créditos: contratar analista fiscal júnior para análise documental e reduzir o gargalo do sócio que hoje ocupa 60% do tempo em tarefas delegáveis.',
        acoes_eliminar1: 'Eliminar a prestação de serviços operacionais de baixo valor (obrigações acessórias) que podem ser feitos por contadores — focar em consultoria e estratégia tributária de alto valor.',
        acoes_eliminar2: 'Eliminar contatos de prospecção sem qualificação prévia: criar formulário de diagnóstico rápido para filtrar empresas com porte e complexidade tributária compatíveis com o serviço.',
        obj_lp_bienal: '• Tornar-se referência regional em planejamento tributário para PMEs\n• Atingir R$ 60.000/mês em receita entre projetos e recorrência\n• Contratar 2 advogados associados e 1 analista fiscal\n• Lançar programa de assessoria contínua da Reforma Tributária',
        obj_lp_anual: '• Consolidar autoridade em Reforma Tributária e recuperação de créditos\n• Atingir R$ 30.000/mês em receita com projetos e assessoria\n• Lançar programa "Diagnóstico Tributário PME"\n• Faturar R$ 360.000 no ano com 60% de receita recorrente',
        obj_lp_t1: '• Fechar 2 projetos de recuperação de créditos ou planejamento\n• Publicar guia "Recuperação de Créditos para PMEs" e gerar 150 leads\n• Realizar 1 webinar educativo sobre a Reforma Tributária\n• Implementar CRM e software de análise tributária',
        obj_lp_t2: '• Atingir 6 clientes em assessoria recorrente (R$ 18.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores qualificados\n• Fechar parcerias com 3 contadores e 2 associações comerciais\n• Publicar 2 artigos técnicos sobre a transição da Reforma (sem expor clientes)',
        acoes_plano: [
            { acao: 'Lançar programa "Diagnóstico Tributário PME" com proposta padrão', data: '2025-08-30', responsavel: 'Advogado(a) sócio(a)', status: 'afazer' },
            { acao: 'Publicar primeiros 4 posts sobre Reforma Tributária no LinkedIn', data: '2025-08-15', responsavel: 'Advogado(a) sócio(a)', status: 'fazendo' },
            { acao: 'Contratar analista fiscal júnior para recuperação de créditos', data: '2025-09-15', responsavel: 'Sócios', status: 'feito' }
        ]
    }
};

// ── Plano de Ação ─────────────────────────────────────────────────────────────
let planoAcoes = [];
let planoNextId = 1;

function savePlano() {
    localStorage.setItem(PLANO_KEY, JSON.stringify({ acoes: planoAcoes, nextId: planoNextId }));
}

function loadPlano() {
    try {
        const raw = localStorage.getItem(PLANO_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        planoAcoes = data.acoes || [];
        planoNextId = data.nextId || (planoAcoes.length + 1);
    } catch(e) { planoAcoes = []; planoNextId = 1; }
    renderPlano();
}

function renderPlano() {
    const tbody = document.getElementById('plano-acoes-tbody');
    const empty = document.getElementById('diag-plano-empty');
    if (!tbody) return;
    tbody.innerHTML = '';
    if (planoAcoes.length === 0) {
        if (empty) empty.style.display = '';
        return;
    }
    if (empty) empty.style.display = 'none';
    planoAcoes.forEach(item => {
        const tr = document.createElement('tr');
        tr.dataset.id = item.id;
        const statusClass = item.status === 'fazendo' ? 'status-fazendo' : (item.status === 'feito' ? 'status-feito' : 'status-afazer');
        tr.innerHTML = `
            <td class="col-acao"><input type="text" value="${escHtml(item.acao)}" placeholder="Descreva a ação..." oninput="updateAcaoField(${item.id},'acao',this.value)"></td>
            <td class="col-data"><input type="date" value="${escHtml(item.data)}" oninput="updateAcaoField(${item.id},'data',this.value)"></td>
            <td class="col-resp"><input type="text" value="${escHtml(item.responsavel)}" placeholder="Responsável..." oninput="updateAcaoField(${item.id},'responsavel',this.value)"></td>
            <td class="col-status">
                <select class="${statusClass}" onchange="updateAcaoStatus(${item.id},this)">
                    <option value="afazer"${item.status==='afazer'?' selected':''}>A FAZER</option>
                    <option value="fazendo"${item.status==='fazendo'?' selected':''}>FAZENDO</option>
                    <option value="feito"${item.status==='feito'?' selected':''}>FEITO</option>
                </select>
            </td>
            <td class="col-del"><button class="btn-del-acao" onclick="removeAcao(${item.id})" title="Remover"><i class="fas fa-times"></i></button></td>`;
        tbody.appendChild(tr);
    });
}

function escHtml(str) {
    return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function addAcao() {
    planoAcoes.push({ id: planoNextId++, acao: '', data: '', responsavel: '', status: 'afazer' });
    savePlano();
    renderPlano();
    // Focus the new row's first input
    const tbody = document.getElementById('plano-acoes-tbody');
    if (tbody && tbody.lastElementChild) {
        const inp = tbody.lastElementChild.querySelector('input[type="text"]');
        if (inp) inp.focus();
    }
}

function removeAcao(id) {
    planoAcoes = planoAcoes.filter(a => a.id !== id);
    savePlano();
    renderPlano();
}

function updateAcaoField(id, field, value) {
    const item = planoAcoes.find(a => a.id === id);
    if (item) { item[field] = value; savePlano(); }
}

function updateAcaoStatus(id, selectEl) {
    const item = planoAcoes.find(a => a.id === id);
    if (item) {
        item.status = selectEl.value;
        selectEl.className = 'status-' + item.status;
        savePlano();
    }
}

// ── Save / Load / Clear ───────────────────────────────────────────────────────
function saveDiagAcoes() {
    const data = {};
    document.querySelectorAll('#diagnostico-acoes-panel [data-diag-acoes]').forEach(el => {
        data[el.dataset.diagAcoes] = el.value;
    });
    localStorage.setItem(DIAG_ACOES_KEY, JSON.stringify(data));
    savePlano();
    showToast('Diagnóstico e Ações salvo!');
}

function loadDiagAcoes() {
    try {
        const data = JSON.parse(localStorage.getItem(DIAG_ACOES_KEY) || '{}');
        document.querySelectorAll('#diagnostico-acoes-panel [data-diag-acoes]').forEach(el => {
            if (data[el.dataset.diagAcoes] !== undefined) el.value = data[el.dataset.diagAcoes];
        });
    } catch(e) {}
    loadPlano();
}

function clearDiagAcoes() {
    if (!confirm('Limpar todos os campos do Diagnóstico e Ações, incluindo o Plano de Ação?')) return;
    document.querySelectorAll('#diagnostico-acoes-panel [data-diag-acoes]').forEach(el => el.value = '');
    localStorage.removeItem(DIAG_ACOES_KEY);
    planoAcoes = [];
    planoNextId = 1;
    savePlano();
    renderPlano();
    showToast('Diagnóstico e Ações limpo.', 'fa-trash');
}

function loadDiagAcoesExample(key) {
    if (!key) return;
    const ex = DIAG_ACOES_EXAMPLES[key];
    if (!ex) return;
    Object.entries(ex).forEach(([field, val]) => {
        if (field === 'acoes_plano') return;
        const el = document.querySelector(`#diagnostico-acoes-panel [data-diag-acoes="${field}"]`);
        if (el) el.value = val;
    });
    // Load plano
    if (ex.acoes_plano) {
        planoAcoes = ex.acoes_plano.map((item, i) => ({ id: i + 1, ...item }));
        planoNextId = planoAcoes.length + 1;
        renderPlano();
    }
    showToast('Exemplo carregado!', 'fa-magic');
}

// Examples tabs — scoped to #diagnostico-acoes-panel
document.querySelectorAll('#diag-acoes-ex-tabs .diag-ex-tab').forEach(tab => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('#diag-acoes-ex-tabs .diag-ex-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('#diagnostico-acoes-panel .diag-ex-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        document.getElementById(tab.dataset.acoesEx).classList.add('active');
    });
});

document.getElementById('btn-save-diag-acoes').addEventListener('click', saveDiagAcoes);
document.getElementById('btn-clear-diag-acoes').addEventListener('click', clearDiagAcoes);
document.getElementById('btn-print-diag-acoes').addEventListener('click', () => window.print());
document.getElementById('diag-acoes-example').addEventListener('change', e => loadDiagAcoesExample(e.target.value));
document.getElementById('btn-add-acao').addEventListener('click', addAcao);

loadDiagAcoes();


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
    },
    previdenciario: {
        p_oport: 'Regras de transição da Reforma da Previdência geram demanda por planejamento e escolha da melhor data de aposentadoria\nPolítica de desjudicialização incentivando acordos e revisões na via administrativa\nProgramas de revisão da vida toda e teses previdenciárias criando novas frentes',
        p_risco: 'Mudanças políticas podem restringir benefícios (BPC/LOAS) ou endurecer requisitos\nRestrições do Código de Ética da OAB à captação de público vulnerável',
        p_acao: 'Monitorar decisões do STF/STJ e mudanças de regra e publicar análises educativas para o segurado\nParticipar de comissões da OAB e de audiências públicas na área previdenciária',
        e_oport: 'Envelhecimento populacional ampliando o número de potenciais aposentados a cada ano\nSegurados do interior sem acesso a advogado especializado — mercado subatendido\nPlanejamento previdenciário como serviço de alto valor pago à vista',
        e_risco: 'Segurados com baixa capacidade de pagamento em regiões de renda menor\nAumento de escritórios de massa pressionando honorários para baixo',
        e_acao: 'Criar serviço de planejamento previdenciário com valor apresentado apenas em proposta individual\nEstruturar reunião inicial de diagnóstico com análise de CNIS como etapa padrão',
        s_oport: 'Maior consciência sobre direito ao BPC/LOAS após cobertura na mídia\nFamílias de pessoas com deficiência buscando orientação sobre benefícios assistenciais\nPúblico 50+ cada vez mais presente e informado nas redes sociais',
        s_risco: 'Desinformação e "atravessadores" prometendo aposentadoria fácil\nDesconfiança do segurado quanto ao custo do advogado previdenciário',
        s_acao: 'Investir em conteúdo educativo acolhedor para construir confiança junto ao público 50+\nPublicar conteúdo com situações hipotéticas, sem expor casos reais nem prometer resultados',
        t_oport: 'Softwares de cálculo e leitura de CNIS aumentando precisão e eficiência\nMeu INSS e peticionamento eletrônico permitindo atendimento 100% online do interior\nInstagram/Facebook com alto alcance orgânico para o público 50+',
        t_risco: 'Digitalização do INSS permitindo que segurados protocolem pedidos simples sozinhos\nVulnerabilidade de dados sensíveis (médicos, contributivos) dos segurados',
        t_acao: 'Adotar software de cálculo para ganhar precisão e focar no planejamento estratégico\nImplementar política de LGPD e sigilo para dados médicos e contributivos',
        ec_oport: 'Atendimento online reduz deslocamento de segurados idosos e do meio rural\nEscritório paperless alinhado a clientes e parceiros com pauta ESG',
        ec_risco: 'Baixo impacto direto no segmento previdenciário — risco marginal',
        ec_acao: 'Comunicar atendimento online como conveniência e acessibilidade para o segurado do interior',
        l_oport: 'Legislação previdenciária em constante mudança gera demanda recorrente por atualização\nProvimento 205/2021 permite conteúdo educativo no Instagram, blog e YouTube',
        l_risco: 'Vedação à captação de público em situação de vulnerabilidade e à promessa de benefício\nRisco de processo disciplinar por publicidade que garanta concessão de aposentadoria',
        l_acao: 'Manter-se atualizado com o Código de Ética da OAB e usar apenas canais educativos permitidos\nCriar checklist interno de conformidade para todo conteúdo previdenciário publicado',
        resumo_oport: 'O envelhecimento populacional e a complexidade das regras de transição criam demanda crescente por planejamento previdenciário — momento ideal para posicionar o serviço de análise de CNIS e escolha da melhor aposentadoria.',
        resumo_risco: 'As restrições da OAB à captação de público vulnerável exigem cautela. Mitigar com conteúdo educativo acolhedor, parceria com sindicatos e contadores e foco em relacionamento institucional dentro do Provimento 205/2021.',
        resumo_acao: 'Lançar e-book "Guia da Aposentadoria após a Reforma", firmar parceria com 2 sindicatos rurais e publicar 2 conteúdos educativos/semana para o público 50+ nos próximos 90 dias.',
    },
    consumidor: {
        p_oport: 'Lei do Superendividamento ampliando direitos de repactuação e criando nova frente de atuação\nPolíticas de defesa do consumidor fortalecendo Procons e plataformas oficiais\nRegulação crescente de bancos digitais, telecom e planos de saúde',
        p_risco: 'Mudanças políticas podem enfraquecer órgãos de defesa do consumidor\nRestrições do Código de Ética da OAB à publicidade de massa e à captação',
        p_acao: 'Monitorar mudanças no CDC e na Lei do Superendividamento e publicar análises educativas\nParticipar de comissões da OAB e de fóruns de defesa do consumidor',
        e_oport: 'Alto endividamento das famílias brasileiras gerando demanda constante por repactuação\nCrescimento do e-commerce multiplicando conflitos de consumo de ticket menor\nMercado de alto volume permitindo escala com processos padronizados',
        e_risco: 'Baixa capacidade de pagamento de clientes endividados\nEscritórios de massa e "fábricas de ações" pressionando honorários',
        e_acao: 'Estruturar operação de alto volume com processos padronizados para viabilizar ticket menor\nApresentar valores apenas em proposta individual, com honorários de êxito quando cabível',
        s_oport: 'Consumidor mais consciente dos seus direitos após cobertura nas redes e na mídia\nCrescimento da cultura de reclamar e buscar reparação por serviços ruins\nPúblico amplo e engajado com conteúdo educativo sobre consumo no Instagram e TikTok',
        s_risco: 'Percepção de que problemas simples se resolvem sozinhos em apps de reclamação\nDesconfiança quanto a custos e à real efetividade da ação judicial',
        s_acao: 'Produzir conteúdo educativo mostrando quando o caso exige advogado (danos morais, superendividamento)\nUsar situações hipotéticas, sem expor clientes nem prometer resultados',
        t_oport: 'Softwares de gestão de alto volume viabilizando escala com eficiência\nPlataformas digitais permitindo triagem e atendimento 100% online\nRedes sociais com altíssimo alcance orgânico para conteúdo de consumo',
        t_risco: 'Plataformas como consumidor.gov.br resolvendo casos simples sem advogado\nVulnerabilidade de dados pessoais e financeiros dos consumidores',
        t_acao: 'Adotar software de gestão em escala e fluxo de triagem digital para ganhar eficiência\nImplementar política de LGPD para proteção dos dados dos clientes',
        ec_oport: 'Atendimento online reduz custos e amplia alcance nacional do escritório\nConsumo consciente e ESG como pauta alinhada ao público jovem',
        ec_risco: 'Baixo impacto direto no segmento de consumidor — risco marginal',
        ec_acao: 'Comunicar atendimento 100% digital como conveniência e alcance para todo o Brasil',
        l_oport: 'Provimento 205/2021 permite ampla produção de conteúdo educativo sobre direitos do consumidor\nConstante evolução do CDC e da jurisprudência gera demanda recorrente por informação',
        l_risco: 'Vedação à captação mercantil e à publicidade de massa que banalize o litígio\nRisco de litigância predatória e de sanções por marketing irregular',
        l_acao: 'Focar em conteúdo educativo de caráter informativo, evitando incentivar litígio artificial\nCriar checklist interno de conformidade para todo conteúdo publicado',
        resumo_oport: 'A Lei do Superendividamento e o crescimento dos conflitos de consumo digital criam um mercado de alto volume — oportunidade de estruturar operação padronizada e escalável com conteúdo educativo como principal fonte de leads.',
        resumo_risco: 'A vedação à captação mercantil e o risco de litigância predatória exigem atenção. Mitigar com conteúdo educativo de caráter informativo, foco em casos que exigem advogado e checklist de conformidade com o Provimento 205/2021.',
        resumo_acao: 'Estruturar fluxo de triagem padronizado, lançar linha de repactuação de dívidas e publicar 3 conteúdos educativos/semana sobre direitos do consumidor nos próximos 90 dias.',
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
    },
    previdenciario: {
        dir_quem: 'Advogados previdenciários locais com foco em concessão de benefícios\nEscritórios generalistas com sócio previdenciário atendendo de tudo\nEscritórios de massa que ajuizam pedidos em larga escala sem análise prévia',
        dir_vantagem: 'Poucos oferecem planejamento previdenciário antes do protocolo\nPoucos analisam o CNIS em detalhe para evitar indeferimentos\nNenhum com atendimento estruturado e didático para o segurado do interior',
        dir_acao: 'Pesquisar os 5 principais concorrentes previdenciários locais no Google e Instagram para mapear posicionamento, serviços e avaliações de segurados',
        ind_quem: 'Contadores orientando segurados informalmente sobre aposentadoria\nSindicatos rurais com departamento jurídico próprio\n"Atravessadores" e despachantes prometendo aposentadoria rápida',
        ind_impacto: 'Contadores capturando as primeiras dúvidas sobre aposentadoria\nSindicatos atendendo o público rural que poderia ser cliente\nDespachantes desinformando e comprometendo o histórico contributivo do segurado',
        ind_acao: 'Construir relacionamento institucional com contadores e sindicatos rurais: conteúdo técnico exclusivo e palestras educativas (sem contrapartida por indicação, vedada pela OAB)',
        sub_plataformas: 'Meu INSS permitindo protocolo de pedidos simples pelo próprio segurado\nSimuladores de aposentadoria gratuitos online\nGrupos de redes sociais trocando informações previdenciárias',
        sub_risco: 'Segurados protocolando pedidos simples sozinhos e recebendo valor menor que o devido\nUso de simuladores genéricos sem considerar regras de transição\nDesinformação em grupos comprometendo decisões importantes de aposentadoria',
        sub_acao: 'Criar conteúdo educativo mostrando que o planejamento previdenciário evita indeferimentos e garante a melhor regra — o custo do erro é uma aposentadoria menor por toda a vida',
        dig_status: 'Concorrentes com Google Meu Negócio desatualizado ou incompleto\nPoucos com conteúdo educativo voltado ao público 50+ no Instagram/Facebook\nNenhum concorrente local com blog de SEO ativo para "advogado aposentadoria [cidade]"',
        dig_oport: 'Instagram/Facebook com alto alcance orgânico para o público 50+\nSEO local para "advogado aposentadoria [cidade]" com pouca concorrência\nGoogle Meu Negócio otimizado captura quem pesquisa direito previdenciário na cidade',
        dig_acao: 'Configurar Google Meu Negócio completo + solicitar 20 avaliações de clientes antigos + publicar 1 artigo/mês otimizado para "advogado aposentadoria [cidade]"',
        pos_atual: 'Maioria posicionada como "advogado de aposentadoria" genérico, apenas reativo ao indeferimento\nPoucos comunicam o valor do planejamento prévio e da análise do CNIS\nMensagem técnica e distante do segurado leigo',
        pos_risco: 'Mercado comoditizado: segurados comparam apenas preço sem entender o valor da análise\nPercepção de que "qualquer advogado resolve" aposentadoria\nDificuldade em comunicar o valor do planejamento vs o pedido reativo',
        pos_acao: 'Posicionar claramente como "planejamento previdenciário" com mensagem de escolher a melhor aposentadoria, diferenciando do mercado reativo (sem prometer concessão, vedado pela OAB)',
        exp_status: 'Atendimento técnico e distante, sem tradução das regras para o segurado\nSegurado sem acompanhamento claro do andamento do processo\nComunicação esporádica e linguagem inacessível',
        exp_diferencial: 'Reunião de diagnóstico com análise detalhada do CNIS na 1ª etapa\nAcompanhamento com linguagem simples do protocolo ao primeiro pagamento\nWhatsApp com atualização proativa sobre o andamento do benefício',
        exp_acao: 'Implementar reunião inicial de diagnóstico com análise de CNIS padronizada + criar comunicação didática de acompanhamento para cada etapa do processo',
        resumo_diferenciacao: 'Único escritório previdenciário da região com planejamento prévio, análise detalhada do CNIS e atendimento didático ao segurado do interior — combinação que os escritórios de massa e generalistas não oferecem.',
        resumo_lacuna: 'O nicho de "planejamento previdenciário com análise de CNIS antes do protocolo" está vazio no mercado local. A maioria da concorrência é reativa, atuando só após o indeferimento. Ocupar o posicionamento preventivo cria diferenciação sólida.',
        resumo_acao: '1. Mapear 5 concorrentes no Google e Instagram (Semana 1)\n2. Configurar Google Meu Negócio completo + solicitar 20 avaliações (Semana 2)\n3. Lançar serviço de "Planejamento Previdenciário" com proposta e landing page (Semana 3)\n4. Publicar artigo de SEO "erros que reduzem a sua aposentadoria" (Semana 4)\n5. Apresentar proposta de parceria educativa para 2 sindicatos rurais (Mês 2)',
    },
    consumidor: {
        dir_quem: 'Advogados de consumidor locais com foco em ações pontuais\nEscritórios generalistas com sócio de consumidor atendendo de tudo\nEscritórios de massa e "fábricas de ações" operando em larga escala',
        dir_vantagem: 'Poucos com operação estruturada e processos padronizados de qualidade\nPoucos com comunicação educativa clara para o consumidor leigo\nNenhum com linha dedicada de repactuação de superendividamento bem comunicada',
        dir_acao: 'Pesquisar os 5 principais concorrentes de consumidor locais no Google e Instagram para mapear posicionamento, serviços ofertados e avaliações',
        ind_quem: 'Procons e associações de defesa do consumidor com atendimento gratuito\nEducadores financeiros orientando endividados informalmente\nContadores e correspondentes bancários resolvendo pendências pontuais',
        ind_impacto: 'Procon capturando reclamações que poderiam virar ação judicial\nEducadores financeiros atendendo endividados antes do advogado\nConsumidores resolvendo casos simples sozinhos por vias administrativas',
        ind_acao: 'Construir relacionamento institucional com associações e educadores financeiros: palestras educativas e conteúdo técnico (sem contrapartida por indicação, vedada pela OAB)',
        sub_plataformas: 'Plataforma consumidor.gov.br resolvendo casos diretamente com empresas\nApps de reclamação (Reclame Aqui) pressionando empresas sem ação judicial\nIA gerando notificações e reclamações básicas para o consumidor',
        sub_risco: 'Casos simples migrando para plataformas oficiais gratuitas\nConsumidores acreditando que reclamação em app resolve qualquer problema\nBanalização de casos que na verdade exigem reparação judicial (danos morais)',
        sub_acao: 'Comunicar que superendividamento, danos morais e contratos complexos exigem advogado — o app resolve o simples, mas não garante a reparação devida',
        dig_status: 'Concorrentes predominantemente no Instagram com conteúdo genérico\nPoucos com SEO otimizado para temas de consumo de alta busca\nAusência de conteúdo educativo claro sobre superendividamento',
        dig_oport: 'Instagram e TikTok com altíssimo alcance orgânico para conteúdo de consumo\nSEO local para "advogado consumidor [cidade]" e temas específicos com boa demanda\nConteúdo educativo sobre dívidas e cobranças abusivas gera alta identificação',
        dig_acao: 'Calendário de conteúdo com 3 posts/semana educativos + 2 artigos/mês de SEO sobre temas de consumo de alta busca ("cobrança indevida", "superendividamento")',
        pos_atual: 'Maioria posicionada como "advogado de consumidor" genérico sem nicho comunicado\nComunicação focada em litígio, não em resolução e educação\nPoucos comunicam metodologia de atendimento ágil e transparente',
        pos_risco: 'Competição por preço e volume com fábricas de ações\nRisco de percepção mercantilista e de litigância predatória\nDificuldade de comunicar qualidade em um mercado de alto volume',
        pos_acao: 'Posicionar como "advocacia do consumidor que descomplica", com atendimento ágil e transparente, comunicando qualidade por meio de conteúdo educativo (sem apelo mercantil, conforme OAB)',
        exp_status: 'Atendimento impessoal e demorado típico das fábricas de ações\nCliente sem acompanhamento claro do andamento do processo\nComunicação burocrática e inacessível',
        exp_diferencial: 'Triagem rápida e reunião de diagnóstico objetiva\nAcompanhamento transparente e em linguagem simples\nWhatsApp com atualização proativa sobre o andamento do caso',
        exp_acao: 'Implementar fluxo de triagem rápida + comunicação padronizada de acompanhamento em linguagem simples para todos os casos',
        resumo_diferenciacao: 'Escritório de consumidor com operação de alto volume estruturada, processos padronizados de qualidade e comunicação educativa clara — combinando escala com atendimento transparente, algo que as fábricas de ações não entregam.',
        resumo_lacuna: 'O mercado de consumidor é de alto volume, mas dominado por atendimento impessoal e por plataformas para casos simples. O nicho de "operação estruturada com qualidade e educação do consumidor", com linha dedicada de superendividamento, é uma oportunidade clara.',
        resumo_acao: '1. Mapear 5 concorrentes no Google/Instagram (Semana 1)\n2. Estruturar fluxo de triagem e onboarding padronizado (Semana 2)\n3. Otimizar Google Meu Negócio + pedir 20 avaliações (Semana 2–3)\n4. Publicar conteúdo sobre superendividamento e cobrança indevida (Semana 3)\n5. Lançar linha dedicada de repactuação de dívidas com landing page (Semana 4)',
    },
    tributario: {
        dir_quem: 'Advogados tributaristas locais atendendo empresas de médio porte\nBoutiques especializadas em contencioso tributário\nEscritórios generalistas com sócio tributário atendendo de tudo',
        dir_vantagem: 'Poucos com linguagem de negócios acessível ao empresário de PME\nPoucos comunicando a Reforma Tributária de forma clara e antecipada\nNenhum com programa estruturado de assessoria contínua da transição',
        dir_acao: 'Mapear os 5 principais escritórios tributários da região no LinkedIn e Google, analisando para quem comunicam, a linguagem usada e os serviços destacados',
        ind_quem: 'Escritórios de contabilidade oferecendo consultoria tributária (por vezes irregular)\nConsultorias de gestão incluindo análise fiscal no escopo\nSoftwares e plataformas de recuperação de créditos automatizada',
        ind_impacto: 'Contadores capturando o empresário antes do advogado e resolvendo informalmente\nConsultorias posicionando-se como quem "entende o negócio"\nPlataformas automatizando recuperação de créditos de baixa complexidade',
        ind_acao: 'Construir relacionamento institucional com contadores: conteúdo técnico exclusivo e eventos educativos conjuntos, delimitando claramente o papel do advogado tributário (sem contrapartida por indicação, vedada pela OAB)',
        sub_plataformas: 'Softwares contábeis com módulos de recuperação de créditos\nIA para cálculo tributário básico e simulações\nEscritórios contábeis oferecendo planejamento tributário simples',
        sub_risco: 'Recuperação de créditos simples sendo automatizada por softwares\nEmpresários acreditando que o contador resolve toda a estratégia tributária\nRisco de planejamentos mal estruturados feitos sem parecer jurídico',
        sub_acao: 'Focar em serviços de alto valor que exigem parecer jurídico: teses complexas, contencioso, reestruturação societária e consultoria da Reforma Tributária',
        dig_status: 'Poucos escritórios tributários com presença ativa no LinkedIn falando para empresários\nConteúdo predominantemente técnico em juridiquês, sem linguagem de negócios\nAusência de material educativo claro sobre a Reforma Tributária',
        dig_oport: 'LinkedIn com alto alcance orgânico entre empresários, CFOs e gestores\nConteúdo sobre Reforma Tributária em linguagem de negócios é raro e muito consumido\nWebinars educativos sobre a transição geram leads qualificados de alto valor',
        dig_acao: 'Publicar 2x/semana no LinkedIn com análises em linguagem de negócios + organizar 1 webinar educativo/mês sobre a Reforma Tributária para PMEs',
        pos_atual: 'Maioria posicionada como fornecedor de serviços tributários pontuais, não como parceiro estratégico\nCobrança por hora ou por êxito sem transparência de valor\nPoucos se posicionam no nicho de PMEs com linguagem de negócios',
        pos_risco: 'Comoditização da recuperação de créditos simples por softwares\nEmpresários comparando preço sem entender profundidade e segurança jurídica\nConfusão do mercado entre o papel do advogado tributário e o do contador',
        pos_acao: 'Reposicionar como "parceiro tributário estratégico para PMEs", com diagnóstico e assessoria contínua da Reforma, comunicando ROI e segurança fiscal',
        exp_status: 'Atendimento formal e transacional sem acompanhamento estratégico\nComunicação lenta e updates esporádicos sobre projetos e teses\nSem relatório periódico ou reunião estratégica estruturada',
        exp_diferencial: 'Diagnóstico tributário completo na primeira etapa\nRelatório periódico de acompanhamento e reunião trimestral estratégica\nAlertas proativos sobre mudanças da transição da Reforma Tributária',
        exp_acao: 'Implementar diagnóstico tributário padronizado + criar relatório periódico e reunião trimestral estratégica para clientes de assessoria recorrente',
        resumo_diferenciacao: 'Único escritório tributário da região focado em PMEs, com linguagem de negócios, diagnóstico completo, assessoria contínua da Reforma Tributária e reunião estratégica trimestral — o parceiro estratégico que o empresário procura mas raramente encontra.',
        resumo_lacuna: 'O mercado tributário local ainda fala para grandes empresas em juridiquês e atua de forma pontual. O nicho de "assessoria tributária estratégica para PMEs com linguagem de negócios e acompanhamento contínuo da Reforma" está praticamente vazio.',
        resumo_acao: '1. Mapear 5 concorrentes no LinkedIn analisando posicionamento e linguagem (Semana 1)\n2. Publicar análise sobre a Reforma Tributária no LinkedIn (Semana 2)\n3. Estruturar relacionamento institucional com 3 contadores parceiros (Semana 2–3)\n4. Lançar programa "Diagnóstico Tributário PME" com proposta e landing page (Semana 3–4)\n5. Organizar webinar educativo sobre a Reforma Tributária para PMEs (Mês 2)',
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
    },
    previdenciario: {
        s_conhecimento: 'Especialização certificada em Direito Previdenciário\nDomínio das regras de transição da Reforma da Previdência\nExperiência em análise de CNIS e cálculo de benefícios',
        s_reputacao: 'Rede sólida de contadores e sindicatos rurais que indicam segurados\nNota 4.8 no Google com 40 avaliações verificadas\nAtendimento didático reconhecido pelo público 50+',
        s_processos: 'Análise detalhada do CNIS antes de qualquer protocolo\nAtendimento online para segurados do interior\nSoftware de cálculo previdenciário estruturado',
        w_capacidade: 'Ciclo de casos longo por dependência de perícias e prazos do INSS\nTempo limitado para produção de conteúdo educativo\nEscritório com equipe enxuta e gargalo de capacidade',
        w_marketing: 'Presença digital incipiente no Instagram/Facebook\nSem blog ativo com artigos de SEO previdenciário\nAusência de material educativo estruturado para o público 50+',
        w_financeiro: 'Fluxo de caixa irregular por depender de concessões e prazos do INSS\nConcentração de receita em concessões, sem serviço pago à vista',
        o_mercado: 'Envelhecimento populacional ampliando o número de potenciais aposentados\nRegras de transição complexas gerando demanda por planejamento\nSegurados do interior sem acesso a advogado especializado',
        o_digital: 'Instagram/Facebook com alto alcance orgânico para o público 50+\nSEO local para "advogado aposentadoria [cidade]" com pouca concorrência\nAtendimento online eliminando barreira geográfica do interior',
        o_parcerias: 'Parcerias com contadores e sindicatos rurais como fonte de indicação\nRelacionamento institucional com associações de aposentados\nCo-marketing educativo com médicos peritos',
        t_concorrencia: 'Escritórios de massa ajuizando pedidos sem análise prévia\nDespachantes e "atravessadores" prometendo aposentadoria fácil\nSaturação de advogados previdenciários reativos na região',
        t_regulacao: 'Vedação à captação de público vulnerável e à promessa de benefício\nRisco de processo disciplinar por publicidade que garanta concessão',
        t_mercado: 'Digitalização do INSS permitindo protocolo de pedidos simples pelo segurado\nMudanças de regra que exigem constante atualização',
        acao_so: 'Usar especialização em cálculo de CNIS + demanda por planejamento pós-Reforma → lançar serviço de "Planejamento de Aposentadoria" com simulação de cenários e escolha da melhor regra. Meta: 5 planejamentos pagos à vista/mês.',
        acao_wo: 'Resolver presença digital fraca + alto alcance para o público 50+ → publicar 3x/semana no Instagram/Facebook conteúdo educativo e investir R$ 300/mês em anúncios segmentados por idade. Meta: 1.500 seguidores qualificados.',
        acao_st: 'Usar análise rigorosa do CNIS + ameaça dos escritórios de massa → criar conteúdo educativo mostrando por que o planejamento prévio evita indeferimentos e garante a melhor aposentadoria (sem prometer concessão, vedado pela OAB).',
        acao_wt: 'Estabilizar o fluxo de caixa + mitigar dependência de prazos do INSS → criar linha de planejamento previdenciário pago à vista, independente de concessão, e diversificar com revisões de benefícios já concedidos.',
    },
    consumidor: {
        s_conhecimento: 'Especialização certificada em Direito do Consumidor\nDomínio da Lei do Superendividamento e do CDC\nExperiência em gestão de alto volume de processos',
        s_reputacao: 'Comunicação acessível reconhecida nas redes sociais\nNota 4.8 no Google com 60 avaliações verificadas\nBase de leads recorrente de baixo custo por aquisição',
        s_processos: 'Processos padronizados que viabilizam operação em escala\nFluxo de triagem rápida e onboarding estruturado\nAtendimento online para todo o Brasil',
        w_capacidade: 'Ticket médio baixo (R$ 1.200) exige alto volume e eficiência\nMargem sensível a ineficiências operacionais\nEquipe precisa escalar junto com o volume de casos',
        w_marketing: 'Dependência de mídia paga e redes sociais como principal fonte de leads\nSem canal orgânico consolidado (SEO)\nAusência de estratégia de nutrição e relacionamento de longo prazo',
        w_financeiro: 'Receita depende de alto volume constante de casos novos\nSem serviço recorrente como âncora financeira',
        o_mercado: 'Alto endividamento das famílias gerando demanda por repactuação\nCrescimento do e-commerce multiplicando conflitos de consumo\nLei do Superendividamento ampliando direitos e frentes de atuação',
        o_digital: 'Instagram e TikTok com altíssimo alcance orgânico para conteúdo de consumo\nSEO local para temas de consumo de alta busca com boa demanda\nAtendimento online eliminando barreira geográfica',
        o_parcerias: 'Relacionamento institucional com associações de defesa do consumidor\nCo-marketing com educadores financeiros\nParcerias educativas com Procons e sindicatos',
        t_concorrencia: 'Fábricas de ações competindo por preço e volume\nPlataformas oficiais (consumidor.gov.br) resolvendo casos simples\nSaturação de escritórios de consumidor na região',
        t_regulacao: 'Vedação à captação mercantil e à publicidade de massa que banalize o litígio\nRisco de sanções por litigância predatória',
        t_mercado: 'Apps de reclamação reduzindo a demanda por casos simples\nBaixa capacidade de pagamento de clientes endividados',
        acao_so: 'Usar processos padronizados + demanda da Lei do Superendividamento → criar linha dedicada de repactuação de dívidas com fluxo de triagem otimizado e pacotes que agregam valor. Meta: 10 casos de superendividamento/mês.',
        acao_wo: 'Resolver dependência de mídia paga + alto alcance orgânico → publicar 3 Reels/semana educativos e 2 artigos/mês de SEO sobre temas de consumo de alta busca. Meta: canal orgânico como fonte complementar de leads.',
        acao_st: 'Usar especialização + ameaça das fábricas de ações → comunicar qualidade e acompanhamento transparente por conteúdo educativo, focando em casos que exigem advogado (danos morais, superendividamento).',
        acao_wt: 'Reduzir dependência de casos novos + mitigar risco de baixa margem → elevar o ticket com pacotes de repactuação e otimizar processos para manter a eficiência da operação de alto volume.',
    },
    tributario: {
        s_conhecimento: 'Especialização/LLM em Direito Tributário\nDomínio da Reforma Tributária e das teses de recuperação de créditos\nExperiência em contencioso administrativo e planejamento',
        s_reputacao: 'Rede de contadores parceiros que indicam empresários\nLinkedIn com presença ativa entre empresários e gestores\nPareceres formais e documentação rigorosa reconhecidos no mercado',
        s_processos: 'Diagnóstico tributário completo antes de qualquer tese\nSoftware de análise tributária e gestão de contencioso\nLinguagem de negócios voltada ao empresário de PME',
        w_capacidade: 'Ciclo de vendas longo — projetos exigem diagnóstico e confiança\nConcentração de receita em poucos projetos de alto valor\nEquipe enxuta para atender demanda crescente da Reforma',
        w_marketing: 'Presença digital ainda em construção\nBlog com publicações irregulares\nAusência de material educativo estruturado sobre a Reforma Tributária',
        w_financeiro: 'Receita irregular por depender de projetos pontuais\nBaixa parcela de receita recorrente na composição do faturamento',
        o_mercado: 'Reforma Tributária (IBS/CBS/IS) gerando demanda massiva por reestruturação\nTeses de recuperação de créditos com alto potencial de honorários de êxito\nTransição de 7 anos criando demanda recorrente de longo prazo',
        o_digital: 'LinkedIn com alto alcance orgânico entre empresários e CFOs\nConteúdo sobre Reforma Tributária em linguagem de negócios é raro e muito consumido\nWebinars educativos gerando leads qualificados de alto valor',
        o_parcerias: 'Parcerias com contadores e escritórios de contabilidade\nRelacionamento institucional com associações comerciais e Sebrae\nCo-marketing educativo com consultores de gestão',
        t_concorrencia: 'Escritórios contábeis oferecendo serviços jurídicos de forma irregular\nSoftwares automatizando recuperação de créditos simples\nBoutiques tributárias disputando os mesmos clientes',
        t_regulacao: 'Risco de responsabilidade civil por planejamento mal estruturado ou abusivo\nFronteiras tênues entre planejamento legítimo e evasão fiscal',
        t_mercado: 'Instabilidade regulatória alterando regras já planejadas na transição\nConfusão do mercado entre o papel do advogado tributário e o do contador',
        acao_so: 'Usar expertise na Reforma Tributária + demanda massiva da transição → lançar programa "Diagnóstico Tributário PME" com assessoria contínua e webinar educativo de apoio. Meta: 4 clientes em assessoria recorrente em 90 dias.',
        acao_wo: 'Resolver presença digital fraca + alto alcance no LinkedIn → publicar 2x/semana análises em linguagem de negócios e realizar 1 webinar educativo/mês sobre a Reforma Tributária. Meta: 2.000 seguidores qualificados.',
        acao_st: 'Usar pareceres formais e documentação (força) + risco de responsabilidade civil (ameaça) → estabelecer critérios claros de conformidade e comunicar segurança jurídica como diferencial, diferenciando-se de planejamentos irregulares de contabilidade.',
        acao_wt: 'Reduzir concentração de receita + mitigar instabilidade regulatória → migrar clientes de projeto para assessoria recorrente da Reforma Tributária, criando receita previsível e acompanhamento contínuo das mudanças.',
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
    },
    previdenciario: {
        fundacao_proposito: 'Garantir que nenhum segurado se aposente com menos do que tem direito — planejando com clareza cada etapa da vida contributiva.',
        fundacao_visao: 'Ser a referência estadual em planejamento previdenciário até 2028, com atendimento acolhedor ao segurado do interior via conteúdo digital educativo.',
        fundacao_valores: 'Análise rigorosa antes de qualquer protocolo\nLinguagem simples — traduzindo o INSS para o segurado\nAcolhimento e paciência com o público 50+\nTransparência sobre prazos e possibilidades\nÉtica acima do resultado em qualquer situação',
        pos_publico: 'Segurados 50+ próximos da aposentadoria, trabalhadores rurais e famílias de pessoas com deficiência buscando BPC/LOAS. Dúvida sobre regras e medo de perder tempo de contribuição.',
        pos_diferencial: 'Análise detalhada do CNIS e planejamento da melhor regra antes de qualquer pedido — atendimento didático que traduz o INSS em linguagem simples, com acompanhamento até o primeiro pagamento.',
        pos_mensagem: 'Para segurados próximos da aposentadoria\nQue precisam de clareza sobre a melhor regra e a data ideal\nSilva Advocacia Previdenciária\nOferece planejamento com análise detalhada do CNIS e acompanhamento didático\nDiferente dos escritórios que só entram após o indeferimento\nNós planejamos antes de pedir, para que você tenha a melhor aposentadoria possível.',
        personalidade_arquetipo: 'sabio',
        tom_formalidade: '3',
        tom_tecnico: '2',
        tom_serio: '3',
        personalidade_usa: 'Planejamento, Clareza, Segurança, Com você, Simples, Direito, Análise, Tranquilidade, Cuidado',
        personalidade_evita: '"Aposentadoria garantida", "Benefício certo", "Aprovação rápida" — qualquer promessa de concessão vedada pelo Provimento 205/2021 da OAB',
        cor_primaria: '#1b4965',
        cor_primaria_sig: 'Confiança e estabilidade',
        cor_secundaria: '#5fa8d3',
        cor_secundaria_sig: 'Serenidade e acessibilidade',
        cor_destaque: '#62b6cb',
        cor_destaque_sig: 'Cuidado e proximidade',
        visual_tipografia: 'Título: Merriweather — legibilidade e confiança para o público 50+\nTexto: Inter — clareza e leitura confortável\nUsar corpo de fonte maior, pensando na acessibilidade do público idoso',
        visual_elementos: 'Ícone de trajetória/caminho ou guarda-chuva estilizado (sem balança ou toga). Fotografia real e acolhedora do advogado. Estilo clean, com contraste alto para leitura.',
        visual_nome: '"Silva Advocacia Previdenciária"\nTagline: "Planejamento para a sua aposentadoria."\nBase legal: art. 4º §2º Provimento 205/2021 — slogan descritivo é permitido.',
        exp_primeiro: 'Segurado encontra no Instagram/Facebook → conteúdo educativo sobre regras de aposentadoria → clica no link do WhatsApp → atendimento acolhedor → agendamento de reunião inicial de diagnóstico com análise de CNIS.',
        exp_touchpoints: '• Instagram/Facebook: educação acessível ao público 50+\n• WhatsApp: proximidade e linguagem simples\n• Análise de CNIS: cuidado técnico e transparência\n• Contrato: organização e clareza\n• Acompanhamento: didático em cada etapa do processo',
        exp_pos: 'Mensagem de acompanhamento após a concessão e o primeiro pagamento\nNewsletter mensal com atualizações previdenciárias\nRevisão periódica do CNIS de clientes assessorados\nLigação de relacionamento em datas relevantes',
        exp_sentimento: 'Seguro — sabe que fez a melhor escolha de aposentadoria.\nBem-orientado — entende cada etapa em linguagem simples.\nAcolhido — foi tratado com paciência e respeito.\nTranquilo — o histórico contributivo foi analisado com cuidado.',
        aut_conteudo: '3 posts/semana no Instagram/Facebook (regras de aposentadoria, BPC/LOAS, dúvidas comuns)\nArtigo mensal no blog otimizado para SEO ("advogado aposentadoria [cidade]")\nNewsletter mensal com mudanças de regras previdenciárias\nResposta pública a dúvidas frequentes com situações hipotéticas',
        aut_prova: 'Especialização certificada em Direito Previdenciário\nDomínio das regras de transição da Reforma da Previdência\nExperiência em análise de CNIS e cálculo de benefícios (sem divulgar taxas de êxito, vedado pela OAB)\nPalestrante em sindicatos rurais e associações de aposentados',
        aut_parcerias: '3 contadores parceiros como fonte de indicação\n2 sindicatos rurais para triagem educativa de segurados\nMédicos peritos para casos de benefício por incapacidade\nAssociações de aposentados para palestras educativas',
        aut_rp: 'Comentarista sobre temas previdenciários em rádios locais\nParticipação em programas de sindicatos rurais\nArtigos publicados em portais de contabilidade parceiros\nWebinars educativos: "Aposentadoria após a Reforma"',
        valor_paraquem: 'Segurados 50+, trabalhadores rurais e famílias de pessoas com deficiência que precisam de clareza sobre a melhor aposentadoria ou benefício assistencial.',
        valor_entrega: 'Planejamento previdenciário com análise detalhada do CNIS, escolha da melhor regra e acompanhamento didático até o primeiro pagamento (sem promessa de concessão, vedada pela OAB).',
        valor_diferente: 'Único escritório da região com planejamento prévio e análise de CNIS antes do protocolo, atendimento didático ao público 50+ e acompanhamento em cada etapa.',
        valor_frase: '"Planejamento previdenciário — a melhor aposentadoria começa com uma boa análise."',
    },
    consumidor: {
        fundacao_proposito: 'Equilibrar a relação entre o consumidor e as grandes empresas — descomplicando direitos que muita gente nem sabe que tem.',
        fundacao_visao: 'Ser a referência regional em Direito do Consumidor até 2028, com operação de alto volume estruturada e triagem digital acessível a todo o Brasil.',
        fundacao_valores: 'Agilidade no atendimento de alto volume\nLinguagem simples e transparente\nEducação do consumidor sobre seus direitos\nÉtica acima do litígio artificial\nCompromisso com a qualidade em cada caso',
        pos_publico: 'Consumidores endividados buscando repactuação; pessoas com problemas em bancos, telecom, planos de saúde e e-commerce. Sentem-se impotentes diante de grandes empresas.',
        pos_diferencial: 'Operação estruturada de alto volume com atendimento ágil e transparente + linha dedicada de repactuação de superendividamento + comunicação educativa clara em linguagem do dia a dia.',
        pos_mensagem: 'Para consumidores que enfrentam problemas com bancos, telecom, planos ou e-commerce\nQue se sentem impotentes diante de grandes empresas\nRocha Advocacia do Consumidor\nOferece atendimento ágil, transparente e em linguagem simples\nDiferente das fábricas de ações impessoais\nNós descomplicamos os seus direitos e acompanhamos o seu caso com clareza.',
        personalidade_arquetipo: 'heroi',
        tom_formalidade: '2',
        tom_tecnico: '1',
        tom_serio: '2',
        personalidade_usa: 'Direitos, Descomplicar, Ágil, Transparente, Ao seu lado, Simples, Solução, Justo, Clareza',
        personalidade_evita: '"Processo garantido", "Dinheiro certo", "Vitória assegurada" — qualquer promessa de resultado vedada pelo Provimento 205/2021 da OAB',
        cor_primaria: '#c62828',
        cor_primaria_sig: 'Energia e defesa de direitos',
        cor_secundaria: '#f9a825',
        cor_secundaria_sig: 'Otimismo e acessibilidade',
        cor_destaque: '#2e7d32',
        cor_destaque_sig: 'Resolução e equilíbrio',
        visual_tipografia: 'Título: Poppins — moderna, direta e acessível\nTexto: Inter — clareza e leitura fácil\nEvitar fontes rebuscadas — a comunicação é do dia a dia',
        visual_elementos: 'Ícone de escudo ou balança simplificada e amigável. Ilustrações leves e diretas. Fotografia real e próxima. Estilo clean, contemporâneo e acessível.',
        visual_nome: '"Rocha Advocacia do Consumidor"\nTagline: "Seus direitos, sem burocracia."\nBase legal: art. 4º §2º Provimento 205/2021 — slogan descritivo é permitido.',
        exp_primeiro: 'Consumidor encontra no Instagram/TikTok → conteúdo educativo sobre cobrança indevida → clica no link → formulário de triagem rápida → reunião inicial de diagnóstico objetiva.',
        exp_touchpoints: '• Instagram/TikTok: educação e alcance amplo\n• Formulário de triagem: agilidade e organização\n• WhatsApp: proximidade e linguagem simples\n• Contrato: transparência e clareza\n• Acompanhamento: atualização proativa do caso',
        exp_pos: 'Mensagem de acompanhamento ao final do caso\nNewsletter mensal com dicas de consumo consciente\nConteúdo educativo contínuo sobre novos direitos\nCanal aberto para dúvidas sobre novas situações de consumo',
        exp_sentimento: 'Fortalecido — sente que não está mais sozinho contra a empresa.\nBem-informado — entende seus direitos em linguagem simples.\nAmparado — o caso é acompanhado com transparência.\nRespeitado — foi atendido com agilidade e clareza.',
        aut_conteudo: '3 Reels/semana no Instagram/TikTok (cobrança indevida, superendividamento, e-commerce)\n2 artigos/mês de SEO sobre temas de consumo de alta busca\nE-book "Guia dos Direitos do Consumidor" como isca educativa\nNewsletter mensal para a base de leads capturada',
        aut_prova: 'Especialização certificada em Direito do Consumidor\nDomínio da Lei do Superendividamento e do CDC\nExperiência em gestão de alto volume de processos (sem divulgar taxas de êxito, vedado pela OAB)\nPalestrante em associações de defesa do consumidor',
        aut_parcerias: 'Relacionamento institucional com associações de defesa do consumidor\nEducadores financeiros como parceiros de conteúdo educativo\nProcons e sindicatos para palestras educativas\nContadores para orientação de consumidores endividados',
        aut_rp: 'Comentarista sobre direitos do consumidor em rádios e portais locais\nParticipação em eventos de educação financeira\nArtigos sobre superendividamento e consumo em portais parceiros\nWebinars educativos: "Como sair das dívidas com segurança"',
        valor_paraquem: 'Consumidores endividados ou com problemas em bancos, telecom, planos de saúde e e-commerce que precisam de orientação clara e ágil sobre seus direitos.',
        valor_entrega: 'Advocacia do consumidor com atendimento ágil e transparente, linha dedicada de repactuação de dívidas e comunicação educativa em linguagem simples (sem promessa de resultado, vedada pela OAB).',
        valor_diferente: 'Operação estruturada de alto volume com qualidade e transparência, linha dedicada de superendividamento e comunicação educativa clara — diferente das fábricas de ações impessoais.',
        valor_frase: '"Seus direitos, sem burocracia."',
    },
    tributario: {
        fundacao_proposito: 'Transformar a carga tributária de peso em estratégia — para que PMEs cresçam com segurança fiscal e sem surpresas.',
        fundacao_visao: 'Ser a referência regional em planejamento tributário para PMEs até 2028, com programa consolidado de assessoria contínua da Reforma Tributária.',
        fundacao_valores: 'Diagnóstico completo antes de qualquer tese\nLinguagem de negócios — ROI e segurança fiscal\nConformidade e documentação rigorosa\nParceria de longo prazo com o empresário\nÉtica acima do resultado em qualquer situação',
        pos_publico: 'Donos de PMEs e indústrias de médio porte, sem jurídico interno, que buscam reduzir carga tributária dentro da lei e se preparar para a Reforma Tributária.',
        pos_diferencial: 'Diagnóstico tributário completo + linguagem de negócios + assessoria contínua da transição da Reforma + reunião estratégica trimestral — combinação voltada especificamente para PMEs.',
        pos_mensagem: 'Para donos de PMEs que sentem o peso da carga tributária\nQue precisam de estratégia fiscal segura e preparação para a Reforma\nMoraes Advocacia Tributária\nOferece diagnóstico completo e assessoria contínua em linguagem de negócios\nDiferente dos escritórios que atuam só de forma pontual\nNós enxergamos oportunidade onde outros veem só imposto, com segurança jurídica.',
        personalidade_arquetipo: 'sabio',
        tom_formalidade: '2',
        tom_tecnico: '3',
        tom_serio: '2',
        personalidade_usa: 'Estratégia, Segurança fiscal, ROI, Diagnóstico, Oportunidade, Conformidade, Parceria, Previsibilidade, Crescimento',
        personalidade_evita: '"Imposto zero", "Economia garantida", "Sem risco fiscal" — qualquer promessa de resultado ou incentivo à evasão vedado pelo Provimento 205/2021 da OAB',
        cor_primaria: '#14532d',
        cor_primaria_sig: 'Solidez e crescimento sustentável',
        cor_secundaria: '#b8860b',
        cor_secundaria_sig: 'Valor e excelência premium',
        cor_destaque: '#334155',
        cor_destaque_sig: 'Sofisticação e confiança institucional',
        visual_tipografia: 'Título: Libre Franklin — solidez e modernidade institucional\nTexto: Inter — clareza e legibilidade em relatórios\nNunca usar fontes decorativas — a comunicação é técnica e estratégica',
        visual_elementos: 'Ícone de gráfico ascendente ou pilar estilizado (sem balança ou toga clichê). Fotografia real e profissional do advogado. Estilo clean, corporativo e sóbrio.',
        visual_nome: '"Moraes Advocacia Tributária"\nTagline: "Estratégia fiscal para a sua empresa crescer."\nBase legal: art. 4º §2º Provimento 205/2021 — slogan descritivo é permitido.',
        exp_primeiro: 'Empresário encontra no LinkedIn → análise sobre a Reforma Tributária → download de guia educativo → reunião inicial de diagnóstico tributário → proposta em 48h via documento digital.',
        exp_touchpoints: '• LinkedIn: autoridade e linguagem de negócios\n• Site: guia educativo sobre a Reforma como lead magnet\n• Diagnóstico tributário: profundidade e cuidado técnico\n• Contrato digital: organização e agilidade\n• Relatório periódico: transparência e acompanhamento',
        exp_pos: 'Alertas sobre mudanças da transição da Reforma Tributária\nReunião estratégica trimestral inclusa na assessoria\nRelatório periódico de acompanhamento tributário\nAtendimento próximo que estimula indicações espontâneas',
        exp_sentimento: 'Seguro — as decisões fiscais têm respaldo jurídico sólido.\nEstratégico — o tributário apoia o crescimento da empresa.\nEm parceria — o escritório acompanha cada mudança da Reforma.\nCom visibilidade — sempre entende o impacto fiscal das decisões.',
        aut_conteudo: '2 posts/semana no LinkedIn (planejamento, Reforma Tributária, recuperação de créditos)\nWebinar mensal sobre a transição da Reforma Tributária para PMEs\nNewsletter mensal com mudanças na legislação fiscal\nGuia prático para download ("Recuperação de Créditos para PMEs")',
        aut_prova: 'Especialização/LLM em Direito Tributário\nDomínio da Reforma Tributária e das teses de recuperação de créditos\nExperiência em contencioso administrativo e planejamento (sem divulgar taxas de êxito, vedado pela OAB)\nPalestrante em associações comerciais e no Sebrae regional',
        aut_parcerias: '3 contadores parceiros como fonte de indicação\n2 associações comerciais para eventos educativos\nSebrae e câmaras de dirigentes lojistas para palestras\nConsultores de gestão para atuação complementar',
        aut_rp: 'Comentarista sobre a Reforma Tributária em portais empresariais\nParticipação em podcasts de empreendedorismo e gestão\nArtigos técnicos em portais de contabilidade parceiros\nWebinars educativos sobre a transição da Reforma para PMEs',
        valor_paraquem: 'Donos de PMEs e indústrias de médio porte sem jurídico interno que precisam reduzir carga tributária dentro da lei e se preparar para a Reforma Tributária.',
        valor_entrega: 'Assessoria tributária estratégica com diagnóstico completo, linguagem de negócios, acompanhamento contínuo da Reforma e reunião estratégica trimestral (sem promessa de resultado, vedada pela OAB).',
        valor_diferente: 'Único escritório da região focado em PMEs com diagnóstico completo, assessoria contínua da Reforma Tributária e linguagem de negócios sem juridiquês.',
        valor_frase: '"Estratégia fiscal para a sua empresa crescer com segurança."',
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
