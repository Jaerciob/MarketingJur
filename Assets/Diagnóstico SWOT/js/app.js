/* ==========================================================================
   DIAGNÓSTICO ESTRATÉGICO – LÓGICA DA APLICAÇÃO
   ========================================================================== */

(function () {
  'use strict';

  const state = {
    escritorio: '',
    respondente: '',
    respostas: {},      // { itemId: valorLikert }
    abertas: {},         // { perguntaId: texto }
    startedAt: null
  };

  const TOTAL_ITENS = DIMENSOES.reduce((acc, d) => acc + d.itens.length, 0);

  // ---------------------------------------------------------------------
  // INIT
  // ---------------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    renderDimensoesPreview();
    document.getElementById('progress-total').textContent = TOTAL_ITENS;
    document.getElementById('form-identificacao').addEventListener('submit', onStartQuiz);
  });

  function renderDimensoesPreview() {
    const wrap = document.getElementById('dimensoes-preview');
    wrap.innerHTML = DIMENSOES.map(d => `
      <div class="dim-chip">
        <i class="fa-solid ${d.icone}"></i>
        <span>${d.numero}. ${d.nome}</span>
      </div>
    `).join('');
  }

  function onStartQuiz(e) {
    e.preventDefault();
    state.escritorio = document.getElementById('input-escritorio').value.trim();
    state.respondente = document.getElementById('input-respondente').value.trim();
    if (!state.escritorio || !state.respondente) return;
    state.startedAt = new Date();

    renderQuiz();
    document.getElementById('screen-intro').classList.add('hidden');
    document.getElementById('screen-quiz').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------------------------------------------------------------
  // RENDER QUIZ
  // ---------------------------------------------------------------------
  function renderQuiz() {
    const container = document.getElementById('quiz-container');
    let html = '';

    DIMENSOES.forEach(dim => {
      html += `
      <section class="dimension-block" id="dim-block-${dim.id}">
        <div class="dimension-header">
          <div class="dim-num">${dim.numero}</div>
          <div>
            <h2><i class="fa-solid ${dim.icone}" style="color:var(--color-accent-dark); margin-right:8px;"></i>${dim.nome}</h2>
            <p>${dim.descricao}</p>
          </div>
        </div>
        ${dim.itens.map(item => renderLikertItem(item)).join('')}
      </section>`;
    });

    html += `
    <section class="open-questions-block">
      <h2><i class="fa-solid fa-comment-dots" style="color:var(--color-accent-dark); margin-right:8px;"></i>Perguntas abertas</h2>
      <p>Respostas curtas e diretas — elas complementam a análise quantitativa.</p>
      ${PERGUNTAS_ABERTAS.map(p => `
        <div class="open-item">
          <label for="open-${p.id}">${p.label}</label>
          <textarea id="open-${p.id}" data-open-id="${p.id}" placeholder="Escreva livremente..."></textarea>
        </div>
      `).join('')}
    </section>

    <div class="quiz-nav">
      <span class="quiz-nav-hint"><i class="fa-solid fa-circle-info"></i> Responda todas as afirmações para gerar o diagnóstico completo.</span>
      <button type="button" class="btn-primary btn-large" id="btn-ver-resultado" style="width:auto;">
        Ver diagnóstico <i class="fa-solid fa-chart-simple"></i>
      </button>
    </div>
    <p class="required-hint" id="required-hint">Por favor, responda todas as afirmações da escala antes de continuar.</p>
    `;

    container.innerHTML = html;

    // Listeners para likert
    container.querySelectorAll('input[type="radio"]').forEach(input => {
      input.addEventListener('change', (e) => {
        const itemId = e.target.name;
        state.respostas[itemId] = parseInt(e.target.value, 10);
        updateProgress();
      });
    });

    // Listeners para abertas
    container.querySelectorAll('textarea[data-open-id]').forEach(ta => {
      ta.addEventListener('input', (e) => {
        state.abertas[e.target.dataset.openId] = e.target.value;
      });
    });

    document.getElementById('btn-ver-resultado').addEventListener('click', onFinishQuiz);
    updateProgress();
  }

  function renderLikertItem(item) {
    return `
    <div class="likert-item">
      <div class="likert-statement">${item.texto}</div>
      <div class="likert-scale">
        ${ESCALA_LIKERT.map(op => `
          <div class="likert-option">
            <input type="radio" name="${item.id}" id="${item.id}-${op.valor}" value="${op.valor}">
            <label for="${item.id}-${op.valor}"><span class="num">${op.valor}</span>${op.label}</label>
          </div>
        `).join('')}
      </div>
    </div>`;
  }

  function updateProgress() {
    const answered = Object.keys(state.respostas).length;
    document.getElementById('progress-count').textContent = answered;
    const pct = Math.min(100, Math.round((answered / TOTAL_ITENS) * 100));
    document.getElementById('progress-fill').style.width = pct + '%';
  }

  function onFinishQuiz() {
    const answered = Object.keys(state.respostas).length;
    if (answered < TOTAL_ITENS) {
      document.getElementById('required-hint').classList.add('show');
      // scroll to first unanswered
      const firstMissing = DIMENSOES.flatMap(d => d.itens).find(i => !(i.id in state.respostas));
      if (firstMissing) {
        document.getElementById('dim-block-' + DIMENSOES.find(d => d.itens.includes(firstMissing)).id)
          .scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    document.getElementById('required-hint').classList.remove('show');
    computeAndRenderResults();
    document.getElementById('screen-quiz').classList.add('hidden');
    document.getElementById('screen-results').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ---------------------------------------------------------------------
  // CÁLCULO
  // ---------------------------------------------------------------------
  let ultimoResultado = null;

  function computeAndRenderResults() {
    const dimResults = DIMENSOES.map(dim => {
      const valores = dim.itens.map(i => state.respostas[i.id]);
      const media = valores.reduce((a, b) => a + b, 0) / valores.length;
      const faixa = classificarMedia(media);
      return { dim, media, faixa };
    });

    const mediaGeral = dimResults.reduce((a, r) => a + r.media, 0) / dimResults.length;
    const pontuacao100 = Math.round(((mediaGeral - 1) / 4) * 100); // escala 1-5 -> 0-100

    // Pontos fortes / fracos por dimensão (grupo positivo/negativo)
    const ordenado = [...dimResults].sort((a, b) => b.media - a.media);
    const fortes = ordenado.filter(r => r.faixa.grupo === 'positivo');
    const fracos = [...ordenado].reverse().filter(r => r.faixa.grupo === 'negativo' || r.faixa.grupo === 'neutro');

    // top 5 fortalezas / fragilidades (usando também os itens individuais mais altos/baixos)
    const todosItens = [];
    DIMENSOES.forEach(dim => {
      dim.itens.forEach(item => {
        todosItens.push({ dimNome: dim.nome, texto: item.texto, valor: state.respostas[item.id] });
      });
    });
    const itensOrdenadosDesc = [...todosItens].sort((a, b) => b.valor - a.valor);
    const itensOrdenadosAsc = [...todosItens].sort((a, b) => a.valor - b.valor);

    const top5Fortalezas = itensOrdenadosDesc.slice(0, 5);
    const top5Fragilidades = itensOrdenadosAsc.slice(0, 5);

    // Prioridades 90 dias: as 3 dimensões com pior média
    const piores3 = [...dimResults].sort((a, b) => a.media - b.media).slice(0, 3);

    const classificacaoGeral = classificarMedia(mediaGeral);

    ultimoResultado = {
      dimResults, mediaGeral, pontuacao100, fortes, fracos,
      top5Fortalezas, top5Fragilidades, piores3, classificacaoGeral
    };

    renderResults(ultimoResultado);
  }

  function nivelGrupoLabel(grupo) {
    if (grupo === 'positivo') return 'Ponto Forte';
    if (grupo === 'neutro') return 'Estável';
    return 'Ponto de Atenção';
  }

  // ---------------------------------------------------------------------
  // RENDER RESULTADOS
  // ---------------------------------------------------------------------
  function renderResults(res) {
    const container = document.getElementById('results-container');

    const fortalezasHtml = res.top5Fortalezas.map(i =>
      `<li><strong>${i.dimNome}:</strong> ${i.texto} <em>(nota ${i.valor})</em></li>`
    ).join('');

    const fragilidadesHtml = res.top5Fragilidades.map(i =>
      `<li><strong>${i.dimNome}:</strong> ${i.texto} <em>(nota ${i.valor})</em></li>`
    ).join('');

    const prioridadesHtml = res.piores3.map((r, idx) => `
      <div class="priority-item">
        <div class="priority-num">${idx + 1}</div>
        <div>
          <h4 style="margin:0 0 4px; font-size:14.5px; color:var(--color-primary);">${r.dim.nome}</h4>
          <p style="margin:0; font-size:13.5px; color:var(--color-text-muted);">${r.faixa.grupo === 'negativo' ? r.dim.recomendacoes.negativo : r.dim.recomendacoes.neutro}</p>
        </div>
      </div>
    `).join('');

    const dimTableRows = res.dimResults.map(r => `
      <tr>
        <td class="dim-name"><i class="fa-solid ${r.dim.icone}" style="color:var(--color-accent-dark); margin-right:8px;"></i>${r.dim.numero}. ${r.dim.nome}</td>
        <td class="dim-media">${r.media.toFixed(2)}</td>
        <td><span class="badge-class" style="background:${r.faixa.bg}; color:${r.faixa.cor};">${r.faixa.label}</span></td>
      </tr>
    `).join('');

    const dimensionDetails = res.dimResults.map(r => {
      const comentario = r.dim.comentarios[r.faixa.grupo];
      const recomendacao = r.dim.recomendacoes[r.faixa.grupo];
      return `
      <div class="dimension-detail">
        <div class="dimension-detail-head">
          <h4><i class="fa-solid ${r.dim.icone}" style="color:var(--color-accent-dark); margin-right:8px;"></i>${r.dim.numero}. ${r.dim.nome}</h4>
          <span class="badge-class" style="background:${r.faixa.bg}; color:${r.faixa.cor};">${r.faixa.label} · ${r.media.toFixed(2)}</span>
        </div>
        <p><strong>Comentário estratégico:</strong> ${comentario}</p>
        <p><strong>Impacto na competitividade:</strong> ${r.dim.impacto}</p>
        <p><strong>Recomendação inicial:</strong> ${recomendacao}</p>
      </div>`;
    }).join('');

    const abertasHtml = PERGUNTAS_ABERTAS.map(p => `
      <div class="open-answer-block">
        <h5>${p.label}</h5>
        <p>${(state.abertas[p.id] || '').trim() || '<span style="color:#94a3b8;">(não respondido)</span>'}</p>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="results-header">
        <h2>Diagnóstico Estratégico — ${escapeHtml(state.escritorio)}</h2>
        <p>Respondido por ${escapeHtml(state.respondente)} em ${formatDate(new Date())}. Este relatório resume o Ambiente Interno para subsidiar a Análise SWOT.</p>
      </div>

      <div class="score-hero">
        <div class="score-circle">
          <span class="score-value">${res.pontuacao100}</span>
          <span class="score-max">de 100</span>
        </div>
        <div class="score-hero-text">
          <h3>Nível Geral de Maturidade</h3>
          <p>Média geral das 7 dimensões: <strong>${res.mediaGeral.toFixed(2)}</strong> / 5,0</p>
          <span class="score-badge">${res.classificacaoGeral.label}${res.classificacaoGeral.sub ? ' — ' + res.classificacaoGeral.sub : ''}</span>
        </div>
      </div>

      <div class="card-block">
        <h3><i class="fa-solid fa-chart-simple"></i> Maturidade por Dimensão</h3>
        <div class="chart-wrap"><canvas id="radar-chart"></canvas></div>
        <table class="dim-table">
          <thead><tr><th>Dimensão</th><th>Média</th><th>Classificação</th></tr></thead>
          <tbody>${dimTableRows}</tbody>
        </table>
      </div>

      <div class="two-col">
        <div class="card-block">
          <h3><i class="fa-solid fa-circle-check" style="color:var(--excelente);"></i> Principais Pontos Fortes</h3>
          <ul class="list-strength">${fortalezasHtml}</ul>
        </div>
        <div class="card-block">
          <h3><i class="fa-solid fa-triangle-exclamation" style="color:var(--critico);"></i> Principais Pontos Fracos</h3>
          <ul class="list-weak">${fragilidadesHtml}</ul>
        </div>
      </div>

      <div class="card-block">
        <h3><i class="fa-solid fa-flag-checkered"></i> Prioridades Estratégicas — Próximos 90 Dias</h3>
        <div class="priority-list">${prioridadesHtml}</div>
      </div>

      <div class="card-block">
        <h3><i class="fa-solid fa-magnifying-glass-chart"></i> Comentários Estratégicos por Dimensão</h3>
        ${dimensionDetails}
      </div>

      <div class="card-block open-answers-summary">
        <h3><i class="fa-solid fa-comment-dots"></i> Respostas Abertas</h3>
        ${abertasHtml}
      </div>

      <div class="results-actions">
        <button class="btn-secondary" id="btn-print"><i class="fa-solid fa-print"></i> Imprimir / Exportar PDF</button>
        <button class="btn-secondary" id="btn-restart"><i class="fa-solid fa-rotate-left"></i> Novo diagnóstico</button>
        <button class="btn-primary" id="btn-save"><i class="fa-solid fa-cloud-arrow-up"></i> Salvar resultado</button>
      </div>
      <p class="save-status" id="save-status"></p>
    `;

    renderRadarChart(res);

    document.getElementById('btn-print').addEventListener('click', () => window.print());
    document.getElementById('btn-restart').addEventListener('click', () => window.location.reload());
    document.getElementById('btn-save').addEventListener('click', () => saveResultado(res));
  }

  function renderRadarChart(res) {
    const ctx = document.getElementById('radar-chart');
    if (!ctx) return;
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: res.dimResults.map(r => r.dim.nome),
        datasets: [{
          label: 'Maturidade (0 a 5)',
          data: res.dimResults.map(r => r.media),
          backgroundColor: 'rgba(201, 163, 78, 0.25)',
          borderColor: '#a9822f',
          pointBackgroundColor: '#0f2c4c',
          borderWidth: 2
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          r: {
            min: 0, max: 5, ticks: { stepSize: 1 },
            pointLabels: { font: { size: 11 } }
          }
        },
        plugins: { legend: { display: false } }
      }
    });
  }

  // ---------------------------------------------------------------------
  // PERSISTÊNCIA (RESTful Table API)
  // ---------------------------------------------------------------------
  async function saveResultado(res) {
    const statusEl = document.getElementById('save-status');
    statusEl.textContent = 'Salvando...';
    statusEl.className = 'save-status';

    const medias_dimensoes = {};
    res.dimResults.forEach(r => {
      medias_dimensoes[r.dim.id] = {
        nome: r.dim.nome,
        media: Number(r.media.toFixed(2)),
        classificacao: r.faixa.label
      };
    });

    const payload = {
      nome_escritorio: state.escritorio,
      respondente: state.respondente,
      data_diagnostico: new Date().toISOString(),
      respostas_json: JSON.stringify(state.respostas),
      medias_dimensoes_json: JSON.stringify(medias_dimensoes),
      pontuacao_geral: res.pontuacao100,
      classificacao_geral: res.classificacaoGeral.label,
      maiores_fortalezas: res.top5Fortalezas.map(i => `${i.dimNome}: ${i.texto} (nota ${i.valor})`).join('\n'),
      maiores_fragilidades: res.top5Fragilidades.map(i => `${i.dimNome}: ${i.texto} (nota ${i.valor})`).join('\n'),
      prioridades_90dias: res.piores3.map((r, idx) => `${idx + 1}. ${r.dim.nome}`).join('\n'),
      diferenciais: state.abertas['diferenciais'] || '',
      desafios: state.abertas['desafios'] || '',
      melhoria_12meses: state.abertas['melhoria'] || ''
    };

    try {
      const response = await fetch('tables/diagnosticos_swot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Falha ao salvar (' + response.status + ')');
      statusEl.textContent = 'Diagnóstico salvo com sucesso!';
      statusEl.className = 'save-status ok';
    } catch (err) {
      statusEl.textContent = 'Não foi possível salvar agora. Você ainda pode imprimir/exportar o resultado.';
      statusEl.className = 'save-status err';
      console.error(err);
    }
  }

  // ---------------------------------------------------------------------
  // UTILS
  // ---------------------------------------------------------------------
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(d) {
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  }

})();
