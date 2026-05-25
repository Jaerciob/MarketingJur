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
        mercado_imagem: 'Especialista em Direito Trabalhista com foco em pequenas e médias empresas e trabalhadores CLT.',
        mercado_oportunidades: '- Alta litigiosidade trabalhista no Brasil\n- Empresas buscando compliance\n- Trabalhadores com direitos violados',
        mercado_concorrentes: '- Escritórios generalistas que atuam pontualmente na área\n- Aplicativos de orientação jurídica online',
        obj_principal: 'Tornar-se referência em Direito Trabalhista na cidade, captando 5 novos clientes/mês via LinkedIn e indicação.',
        obj_metas: '- 500 seguidores LinkedIn em 90 dias\n- 2 artigos semanais sobre direitos trabalhistas\n- 1 palestra mensal para RHs',
        obj_audiencia: 'Trabalhadores CLT, RHs e PMEs na região',
        brand_posicionamento: 'Defensor estratégico dos direitos trabalhistas — clareza e resultado sem burocracia.',
        brand_mensagem: '"Seus direitos merecem quem entende o que está em jogo."',
        brand_voz: 'Arquétipo do Herói/Sábio. Tom: direto, empático, seguro.',
        persona_perfil: 'Nome: Carlos, 38 anos, analista de RH em PME.\nDor: medo de passivos trabalhistas.\nObjetivo: compliance e segurança jurídica.\nCanal favorito: LinkedIn.',
        jornada: 'Atração: conteúdo sobre riscos trabalhistas no LinkedIn\nConsideração: artigo "10 erros que geram processos trabalhistas"\nDecisão: consulta gratuita de 30 min\nPós-venda: newsletter mensal sobre atualizações',
    },
    familia: {
        mercado_imagem: 'Especialista em Direito de Família com abordagem humanizada para divórcios, guarda e inventários.',
        mercado_oportunidades: '- Alta taxa de divórcios no Brasil\n- Inventários extrajudiciais em crescimento\n- Demanda por mediação familiar',
        mercado_concorrentes: '- Escritórios que tratam família como área secundária\n- Cartórios para inventários simples',
        obj_principal: 'Ser a referência em Direito de Família na região com atendimento humanizado, captando 4 clientes/mês.',
        obj_metas: '- 300 seguidores Instagram em 60 dias\n- 3 Reels/semana sobre divórcio e guarda\n- Parcerias com psicólogos e terapeutas',
        obj_audiencia: 'Casais em processo de separação e famílias em conflito de herança',
        brand_posicionamento: 'Advocacia familiar com escuta ativa e resolução estratégica — menos trauma, mais solução.',
        brand_mensagem: '"Cuidando de quem você mais ama nos momentos mais difíceis."',
        brand_voz: 'Arquétipo do Cuidador. Tom: acolhedor, seguro, esperançoso.',
        persona_perfil: 'Nome: Fernanda, 42 anos, professora em processo de divórcio.\nDor: medo de perder a guarda dos filhos e o apartamento.\nCanal favorito: Instagram e indicação de amigos.',
        jornada: 'Atração: vídeos sobre divórcio consensual e guarda compartilhada\nConsideração: e-book "Guia do Divórcio sem Trauma"\nDecisão: consulta sigilosa\nPós-venda: acompanhamento pós-acordo',
    },
    empresarial: {
        mercado_imagem: 'Assessoria jurídica preventiva para startups e empresas em crescimento, com foco em contratos e societário.',
        mercado_oportunidades: '- Ecossistema de startups em expansão\n- PMEs sem assessoria jurídica fixa\n- Contratos internacionais em crescimento',
        mercado_concorrentes: '- Grandes escritórios com custos elevados\n- LegalTechs de contratos automáticos',
        obj_principal: 'Assinar 3 contratos de assessoria mensal recorrente com startups até o final do trimestre.',
        obj_metas: '- Presença ativa no LinkedIn com 2 posts/semana\n- Participação em 2 eventos de startups/mês\n- Criar proposta de "Pacote Startup Legal"',
        obj_audiencia: 'Founders de startups e sócios de PMEs em crescimento',
        brand_posicionamento: 'O jurídico estratégico que acompanha o crescimento da sua empresa — sem juridiquês.',
        brand_mensagem: '"Seu negócio protegido para crescer sem medo."',
        brand_voz: 'Arquétipo do Sábio/Parceiro. Tom: estratégico, prático, direto.',
        persona_perfil: 'Nome: Rafael, 34 anos, founder de SaaS B2B.\nDor: assinar contratos sem entender os riscos.\nObjetivo: ter segurança jurídica sem gastar como grande empresa.\nCanal favorito: LinkedIn e indicação de aceleradoras.',
        jornada: 'Atração: posts sobre contratos e erros societários no LinkedIn\nConsideração: checklist "10 Riscos Jurídicos para Startups"\nDecisão: reunião de diagnóstico gratuito\nPós-venda: relatório mensal de assessoria',
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
