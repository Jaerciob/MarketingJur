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
        bmc_rel_conquista: '• E-book: "Guia dos Direitos Trabalhistas"\n• Depoimentos de clientes no Google Meu Negócio\n• Artigos educativos que demonstram expertise',
        bmc_rel_fideliza: '• Newsletter mensal com atualizações trabalhistas\n• Acompanhamento pós-caso por 90 dias\n• Programa de indicação: desconto para quem indica\n• Check-in semestral com empresas assessoradas',
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
        bmc_rel_conquista: '• E-book gratuito: "Guia do Divórcio sem Trauma"\n• Depoimentos anônimos de clientes satisfeitos\n• Parceria visível com psicólogos (credibilidade)',
        bmc_rel_fideliza: '• Acompanhamento pós-acordo por 6 meses\n• Checklist de documentos enviado por WhatsApp\n• Indicação: carta de agradecimento + desconto futuro\n• Newsletter bimestral sobre direitos da família',
        bmc_seg_perfil: 'Persona 1: Fernanda, 42 anos, professora. Em processo de divórcio, mãe de 2 filhos, medo de perder a guarda.\nPersona 2: Roberto, 55 anos, empresário. Pai faleceu, precisa fazer inventário com irmãos.',
        bmc_seg_dores: '• Medo de perder a guarda ou o patrimônio\n• Processo demorado e emocionalmente desgastante\n• Não saber por onde começar o divórcio\n• Custo elevado percebido dos serviços jurídicos',
        bmc_seg_canais: '• Instagram (mulheres 35-55 anos)\n• Indicação de psicólogos e terapeutas\n• Google: "advogado divórcio [cidade]"\n• Grupos de apoio e comunidades online',
        bmc_res_conhecimento: 'Especialização em Direito de Família e Sucessões\nCurso de mediação familiar\nTreinamento em comunicação não-violenta',
        bmc_res_infra: 'Sala de atendimento acolhedora\nPlataforma de videoconferência segura\nSite com blog e depoimentos',
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
        bmc_activities_atend: '1. Diagnóstico jurídico gratuito (45 min)\n2. Proposta de "Pacote Startup Legal"\n3. Revisão e elaboração de contratos\n4. Reunião mensal de assessoria recorrente',
        bmc_activities_content: '2 posts/semana no LinkedIn sobre contratos e riscos\nGuia: "10 Riscos Jurídicos para Startups"\nParticipação em painéis e podcasts do ecossistema',
        bmc_value_servicos: '• Constituição e estruturação societária\n• Revisão e elaboração de contratos B2B\n• Pacote de assessoria jurídica mensal\n• Due diligence para investimentos\n• Compliance, LGPD e proteção de dados\n• Propriedade intelectual e marcas',
        bmc_value_diferenciais: '• Linguagem simples, sem juridiquês\n• Foco em prevenção, não só litígio\n• Pacotes mensais com preço fixo (previsibilidade)\n• Experiência com startups e scale-ups',
        bmc_value_posicionamento: '"O jurídico estratégico que cresce com sua empresa — proteção inteligente, sem complicar."',
        bmc_value_voz: 'Arquétipo do Sábio/Parceiro. Tom: estratégico, prático, direto. Linguagem de negócios.',
        bmc_rel_conquista: '• Diagnóstico jurídico gratuito (45 min)\n• Checklist: "10 Riscos Jurídicos para Startups"\n• Casos de sucesso publicados com autorização\n• Presença ativa em eventos do ecossistema',
        bmc_rel_fideliza: '• Relatório mensal de assessoria\n• Alertas por e-mail sobre mudanças regulatórias\n• Reunião trimestral estratégica incluída no pacote\n• Indicação: mês grátis para quem traz novo cliente',
        bmc_seg_perfil: 'Persona 1: Rafael, 34 anos, founder de SaaS B2B. Quer segurança jurídica sem gastar como grande empresa.\nPersona 2: Sócios de PME familiar (3 irmãos), sem acordo societário formalizado, crescendo rápido.',
        bmc_seg_dores: '• Assinar contratos sem entender os riscos\n• Conflitos societários por falta de acordo formal\n• Medo de multas por LGPD ou irregularidades\n• Custo percebido alto de grandes escritórios',
        bmc_seg_canais: '• LinkedIn (founders, CEOs, CFOs)\n• Indicação de contadores e aceleradoras\n• Google: "advogado empresarial startups"\n• Eventos: Demo Days, meetups de empreendedores',
        bmc_res_conhecimento: 'LLM em Direito Empresarial e Contratos\nConhecimento do ecossistema de startups\nCertificação em LGPD e proteção de dados',
        bmc_res_infra: 'Plataforma de assinatura digital\nSite com cases e calculadora de risco jurídico\nCRM para gestão de clientes recorrentes',
        bmc_costs_invest: 'LinkedIn Ads: R$ 500/mês\nProdução de conteúdo: R$ 700/mês\nEventos e networking: R$ 300/mês\nTotal: ~R$ 1.500/mês',
        bmc_costs_dist: '33% — LinkedIn Ads\n47% — Produção de conteúdo\n20% — Eventos e networking',
        bmc_rev_metricas: 'Meta: 5 leads qualificados/mês\nConversão para pacote mensal: 40% (2 clientes)\nTicket do pacote: R$ 2.500/mês\nRecorrência média: 12 meses',
        bmc_rev_roi: 'Investimento: R$ 1.500/mês\nRetorno esperado: 2 clientes × R$ 2.500 = R$ 5.000/mês\nROI: 233% ao mês | LTV médio: R$ 30.000/cliente',
        obj_lp_bienal: '• Tornar-se o escritório de referência para startups e PMEs no país\n• Atingir R$ 60.000/mês em receita recorrente com 24 clientes de pacote\n• Lançar "Legal as a Service" com plataforma própria\n• Contratar 2 advogados associados e 1 gerente de operações',
        obj_lp_anual: '• Tornar-se o advogado empresarial de referência para startups e PMEs da região\n• Atingir R$ 30.000/mês em receita recorrente com 12 clientes de pacote\n• Lançar programa "Startup Legal Kit" com contratos e compliance incluídos\n• Faturar R$ 360.000 no ano com 70% de receita previsível via assinaturas',
        obj_lp_t1: '• Fechar 2 contratos de assessoria jurídica recorrente (R$ 2.500/mês)\n• Publicar guia: "10 Riscos Jurídicos para Startups" e gerar 150 leads\n• Participar de 2 eventos do ecossistema de startups como palestrante\n• Implementar onboarding digital com contrato e assinatura eletrônica',
        obj_lp_t2: '• Atingir 8 clientes em pacote mensal recorrente (R$ 20.000 MRR)\n• Consolidar presença no LinkedIn com 2.000 seguidores e 5% de engajamento\n• Fechar parcerias com 3 contadores e 2 aceleradoras como fonte de indicação\n• Publicar 2 cases de sucesso com autorização dos clientes',
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
                <textarea data-canal-field="estrategia" rows="2" placeholder="Ex.: 3 posts/semana sobre casos reais (sem identificação)">${estrategia}</textarea>
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


// ─── KANBAN ──────────────────────────────────────────────────────────────────
const KANBAN_KEY = 'mktjur_kanban';

const DEFAULT_BOARDS = {
    planejamento: {
        name: 'Planejamento',
        columns: {
            todo: [
                { id: 1, title: 'Definir objetivos de marketing e metas claras', desc: 'Ex.: aumentar leads qualificados, reforçar posicionamento, lançar novo produto.', priority: 'media', date: today() },
                { id: 2, title: 'Revisar Canvas de Marketing e persona', desc: 'Validar proposta de valor, público-alvo e insights da análise de mercado.', priority: 'media', date: today() },
                { id: 3, title: 'Priorizar estratégias principais', desc: 'Escolher quais canais, campanhas e ações terão foco nas próximas semanas.', priority: 'alta', date: today() },
                { id: 4, title: 'Mapear concorrentes e diferenciais', desc: 'Listar concorrentes locais, analisar posicionamento e identificar lacunas.', priority: 'baixa', date: today() },
            ],
            doing: [],
            review: []
        }
    },
    execucao: {
        name: 'Execução',
        columns: {
            todo: [
                { id: 10, title: 'Publicar 3 posts no LinkedIn esta semana', desc: 'Temas: caso prático (sem identificar), dica jurídica, bastidores do escritório.', priority: 'alta', date: today() },
                { id: 11, title: 'Gravar vídeo curto para Reels/Stories', desc: 'Responder uma dúvida frequente dos clientes em até 60 segundos.', priority: 'media', date: today() },
                { id: 12, title: 'Atualizar Google Meu Negócio', desc: 'Adicionar fotos recentes, responder avaliações e atualizar horários.', priority: 'baixa', date: today() },
            ],
            doing: [],
            review: []
        }
    }
};

let kanbanData = null;
let currentBoard = 'planejamento';
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
                <button class="btn-card-action btn-card-del" onclick="deleteCard(${card.id},'${col}')" title="Remover"><i class="fas fa-trash"></i></button>
            </div>
        </div>`;

    // drag events
    div.addEventListener('dragstart', e => {
        e.dataTransfer.setData('cardId', card.id);
        e.dataTransfer.setData('fromCol', col);
        div.classList.add('dragging');
    });
    div.addEventListener('dragend', () => div.classList.remove('dragging'));
    return div;
}

function deleteCard(id, col) {
    const board = kanbanData[currentBoard];
    board.columns[col] = board.columns[col].filter(c => c.id !== id);
    saveKanban();
    renderKanban();
}

// Drop zones
['todo', 'doing', 'review'].forEach(col => {
    const container = document.getElementById(`col-${col}`);
    container.addEventListener('dragover', e => { e.preventDefault(); container.style.background = '#e0e7ff'; });
    container.addEventListener('dragleave', () => { container.style.background = ''; });
    container.addEventListener('drop', e => {
        e.preventDefault();
        container.style.background = '';
        const id = parseInt(e.dataTransfer.getData('cardId'));
        const fromCol = e.dataTransfer.getData('fromCol');
        if (fromCol === col) return;
        const board = kanbanData[currentBoard];
        const cardIdx = board.columns[fromCol].findIndex(c => c.id === id);
        if (cardIdx === -1) return;
        const [card] = board.columns[fromCol].splice(cardIdx, 1);
        board.columns[col].push(card);
        saveKanban();
        renderKanban();
        showToast('Tarefa movida!', 'fa-arrows-alt');
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
    currentBoard = 'planejamento';
    saveKanban();
    rebuildBoardSelect();
    renderKanban();
    showToast('Quadros resetados.', 'fa-undo');
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
