const api = {
  async get(url) {
    const r = await fetch(url);
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Erro na requisição');
    return r.json();
  },
  async send(method, url, body) {
    const r = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!r.ok) throw new Error((await r.json().catch(() => ({}))).error || 'Erro na requisição');
    return r.json();
  }
};

const toast = (msg, isError = false) => {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'toast' + (isError ? ' error' : '');
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => (el.hidden = true), 3000);
};

const escapeHtml = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const field = (name, label, opts = {}) => {
  const { type = 'text', required = false, full = false, value = '', options = [] } = opts;
  let input;
  if (type === 'textarea') {
    input = `<textarea name="${name}">${escapeHtml(value)}</textarea>`;
  } else if (type === 'select') {
    input = `<select name="${name}">${options.map((o) => `<option value="${escapeHtml(o.value)}"${String(o.value) === String(value) ? ' selected' : ''}>${escapeHtml(o.label)}</option>`).join('')}</select>`;
  } else {
    input = `<input name="${name}" type="${type}" value="${escapeHtml(value)}" ${required ? 'required' : ''} />`;
  }
  return `<div class="form-field ${full ? 'full' : ''}"><label>${label}${required ? ' *' : ''}</label>${input}</div>`;
};

/* ---------------- Modal ---------------- */
function openModal(title, formHtml, onSubmit) {
  document.getElementById('modal-title').textContent = title;
  const form = document.getElementById('modal-form');
  form.innerHTML = formHtml;
  document.getElementById('modal').hidden = false;
  form.onsubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      await onSubmit(data);
      closeModal();
      toast('Salvo com sucesso.');
    } catch (err) {
      toast(err.message, true);
    }
  };
}
function closeModal() { document.getElementById('modal').hidden = true; }

/* ---------------- Router ---------------- */
const views = ['dashboard', 'alunos', 'voluntarios', 'atividades', 'progressos', 'kanban'];
const renderers = {};

function navigate(view) {
  document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
  document.getElementById('view-' + view).classList.add('active');
  document.querySelectorAll('.nav-link').forEach((l) => l.classList.toggle('active', l.dataset.view === view));
  renderers[view]?.();
}

document.querySelectorAll('.nav-link').forEach((link) =>
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigate(link.dataset.view);
  })
);

document.querySelector('[data-close-modal]').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', (e) => {
  if (e.target.id === 'modal') closeModal();
});

/* ---------------- Dashboard ---------------- */
renderers.dashboard = async () => {
  const el = document.getElementById('view-dashboard');
  try {
    const d = await api.get('/api/dashboard');
    const kanbanQtd = (c) => d.kanban.find((k) => k.coluna === c)?.qtd || 0;
    el.innerHTML = `
      <div class="page-head"><div><h2>Dashboard</h2><p>Visão geral da plataforma de reforço escolar</p></div></div>
      <div class="ods-banner">
        <div class="num">04</div>
        <div><h3>Educação de Qualidade</h3>
        <p>Projeto alinhado ao ODS 04: garantir educação inclusiva e de qualidade, promovendo oportunidades de aprendizagem para crianças e adolescentes do Bairro Uruguai.</p></div>
      </div>
      <div class="cards">
        <div class="card"><div class="label">Alunos</div><div class="value">${d.alunos}</div></div>
        <div class="card"><div class="label">Voluntários</div><div class="value">${d.voluntarios}</div></div>
        <div class="card"><div class="label">Atividades</div><div class="value">${d.atividades}</div></div>
        <div class="card"><div class="label">Média de notas</div><div class="value">${d.media_notas ?? '—'}</div><div class="sub">registros de progresso: ${d.progressos}</div></div>
      </div>
      <div class="panel">
        <h3>Quadro Kanban do projeto</h3>
        <div class="cards">
          <div class="card"><div class="label">A fazer</div><div class="value">${kanbanQtd('a_fazer')}</div></div>
          <div class="card"><div class="label">Em andamento</div><div class="value">${kanbanQtd('em_andamento')}</div></div>
          <div class="card"><div class="label">Concluído</div><div class="value">${kanbanQtd('concluido')}</div></div>
        </div>
      </div>`;
  } catch (err) {
    el.innerHTML = `<div class="empty">Não foi possível carregar os dados. Verifique se o banco está acessível.<br><small>${escapeHtml(err.message)}</small></div>`;
  }
};

/* ---------------- Alunos ---------------- */
renderers.alunos = async () => {
  const el = document.getElementById('view-alunos');
  el.innerHTML = `<div class="page-head"><div><h2>Alunos</h2><p>Crianças e adolescentes atendidos em contraturno</p></div><button class="btn" id="add-aluno">+ Novo aluno</button></div><div class="panel" id="alunos-list"><div class="empty">Carregando…</div></div>`;
  document.getElementById('add-aluno').onclick = () => alunoForm();
  await loadAlunos();
};

async function loadAlunos() {
  const rows = await api.get('/api/alunos');
  const list = document.getElementById('alunos-list');
  list.innerHTML = rows.length
    ? `<table><thead><tr><th>Nome</th><th>Nascimento</th><th>Série</th><th>Responsável</th><th>Telefone</th><th></th></tr></thead><tbody>${rows.map((a) => `
      <tr><td>${escapeHtml(a.nome)}</td><td>${a.data_nascimento ? new Date(a.data_nascimento).toLocaleDateString('pt-BR') : '—'}</td><td>${escapeHtml(a.serie) || '—'}</td><td>${escapeHtml(a.responsavel) || '—'}</td><td>${escapeHtml(a.telefone) || '—'}</td>
      <td><div class="row-actions"><button class="btn secondary small" data-edit="${a.id}">Editar</button><button class="btn danger small" data-del="${a.id}">Excluir</button></div></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty">Nenhum aluno cadastrado.</div>`;
  list.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => alunoForm(rows.find((x) => x.id === Number(b.dataset.edit)))));
  list.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    if (!confirm('Excluir este aluno?')) return;
    await api.send('DELETE', '/api/alunos/' + b.dataset.del);
    toast('Aluno excluído.');
    loadAlunos();
  }));
}

function alunoForm(a = {}) {
  openModal(a.id ? 'Editar aluno' : 'Novo aluno', `
    <div class="form-grid">
      ${field('nome', 'Nome completo', { required: true, full: true, value: a.nome })}
      ${field('data_nascimento', 'Data de nascimento', { type: 'date', value: a.data_nascimento })}
      ${field('serie', 'Série', { value: a.serie })}
      ${field('responsavel', 'Responsável', { value: a.responsavel })}
      ${field('telefone', 'Telefone', { value: a.telefone })}
      ${field('necessidades', 'Necessidades / observações', { type: 'textarea', full: true, value: a.necessidades })}
    </div>
    <div class="form-actions"><button type="button" class="btn secondary" data-close-modal>Cancelar</button><button class="btn">Salvar</button></div>`,
    (data) => api.send(a.id ? 'PUT' : 'POST', a.id ? '/api/alunos/' + a.id : '/api/alunos', data).then(() => loadAlunos())
  );
  document.querySelectorAll('[data-close-modal]').forEach((b) => (b.onclick = closeModal));
}

/* ---------------- Voluntários ---------------- */
renderers.voluntarios = async () => {
  const el = document.getElementById('view-voluntarios');
  el.innerHTML = `<div class="page-head"><div><h2>Voluntários</h2><p>Equipe de apoio pedagógico e capacitação</p></div><button class="btn" id="add-vol">+ Novo voluntário</button></div><div class="panel" id="vol-list"><div class="empty">Carregando…</div></div>`;
  document.getElementById('add-vol').onclick = () => volForm();
  await loadVoluntarios();
};

async function loadVoluntarios() {
  const rows = await api.get('/api/voluntarios');
  const list = document.getElementById('vol-list');
  list.innerHTML = rows.length
    ? `<table><thead><tr><th>Nome</th><th>Área de atuação</th><th>Disponibilidade</th><th>Contato</th><th></th></tr></thead><tbody>${rows.map((v) => `
      <tr><td>${escapeHtml(v.nome)}</td><td>${escapeHtml(v.area_atuacao) || '—'}</td><td>${escapeHtml(v.disponibilidade) || '—'}</td><td>${escapeHtml(v.email) || ''} ${escapeHtml(v.telefone) || ''}</td>
      <td><div class="row-actions"><button class="btn secondary small" data-edit="${v.id}">Editar</button><button class="btn danger small" data-del="${v.id}">Excluir</button></div></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty">Nenhum voluntário cadastrado.</div>`;
  list.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => volForm(rows.find((x) => x.id === Number(b.dataset.edit)))));
  list.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    if (!confirm('Excluir este voluntário?')) return;
    await api.send('DELETE', '/api/voluntarios/' + b.dataset.del);
    toast('Voluntário excluído.');
    loadVoluntarios();
  }));
}

function volForm(v = {}) {
  openModal(v.id ? 'Editar voluntário' : 'Novo voluntário', `
    <div class="form-grid">
      ${field('nome', 'Nome completo', { required: true, full: true, value: v.nome })}
      ${field('email', 'E-mail', { type: 'email', value: v.email })}
      ${field('telefone', 'Telefone', { value: v.telefone })}
      ${field('area_atuacao', 'Área de atuação', { value: v.area_atuacao })}
      ${field('disponibilidade', 'Disponibilidade', { value: v.disponibilidade })}
    </div>
    <div class="form-actions"><button type="button" class="btn secondary" data-close-modal>Cancelar</button><button class="btn">Salvar</button></div>`,
    (data) => api.send(v.id ? 'PUT' : 'POST', v.id ? '/api/voluntarios/' + v.id : '/api/voluntarios', data).then(() => loadVoluntarios())
  );
  document.querySelectorAll('[data-close-modal]').forEach((b) => (b.onclick = closeModal));
}

/* ---------------- Atividades ---------------- */
renderers.atividades = async () => {
  const el = document.getElementById('view-atividades');
  el.innerHTML = `<div class="page-head"><div><h2>Atividades de reforço</h2><p>Aulas e oficinas realizadas na associação</p></div><button class="btn" id="add-atv">+ Nova atividade</button></div><div class="panel" id="atv-list"><div class="empty">Carregando…</div></div>`;
  document.getElementById('add-atv').onclick = () => atvForm();
  await loadAtividades();
};

async function loadAtividades() {
  const rows = await api.get('/api/atividades');
  const list = document.getElementById('atv-list');
  list.innerHTML = rows.length
    ? `<table><thead><tr><th>Título</th><th>Disciplina</th><th>Voluntário</th><th>Data</th><th>Status</th><th>Alunos</th><th></th></tr></thead><tbody>${rows.map((a) => `
      <tr><td>${escapeHtml(a.titulo)}</td><td>${escapeHtml(a.disciplina) || '—'}</td><td>${escapeHtml(a.voluntario) || '—'}</td><td>${a.data ? new Date(a.data).toLocaleDateString('pt-BR') : '—'}</td><td><span class="badge ${a.status}">${a.status.replace('_', ' ')}</span></td><td>${a.alunos.length}</td>
      <td><div class="row-actions"><button class="btn secondary small" data-edit="${a.id}">Editar</button><button class="btn danger small" data-del="${a.id}">Excluir</button></div></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty">Nenhuma atividade cadastrada.</div>`;
  list.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => atvForm(rows.find((x) => x.id === Number(b.dataset.edit)))));
  list.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    if (!confirm('Excluir esta atividade?')) return;
    await api.send('DELETE', '/api/atividades/' + b.dataset.del);
    toast('Atividade excluída.');
    loadAtividades();
  }));
}

async function atvForm(a = {}) {
  const [disciplinas, voluntarios, alunos] = await Promise.all([
    api.get('/api/disciplinas'), api.get('/api/voluntarios'), api.get('/api/alunos')
  ]);
  const selAlunos = a.alunos ? a.alunos.map((x) => x.id) : [];
  const statusOpts = [
    { value: 'planejada', label: 'Planejada' },
    { value: 'em_andamento', label: 'Em andamento' },
    { value: 'concluida', label: 'Concluída' }
  ];
  openModal(a.id ? 'Editar atividade' : 'Nova atividade', `
    <div class="form-grid">
      ${field('titulo', 'Título', { required: true, full: true, value: a.titulo })}
      ${field('descricao', 'Descrição', { type: 'textarea', full: true, value: a.descricao })}
      ${field('disciplina_id', 'Disciplina', { type: 'select', value: a.disciplina_id, options: [{ value: '', label: '—' }, ...disciplinas.map((d) => ({ value: d.id, label: d.nome }))] })}
      ${field('voluntario_id', 'Voluntário', { type: 'select', value: a.voluntario_id, options: [{ value: '', label: '—' }, ...voluntarios.map((v) => ({ value: v.id, label: v.nome }))] })}
      ${field('data', 'Data', { type: 'date', value: a.data })}
      ${field('horario', 'Horário', { type: 'time', value: a.horario })}
      ${field('status', 'Status', { type: 'select', value: a.status || 'planejada', options: statusOpts })}
      <div class="form-field full"><label>Alunos participantes</label><div class="checkbox-list">${alunos.map((al) => `<label><input type="checkbox" name="alunos" value="${al.id}" ${selAlunos.includes(al.id) ? 'checked' : ''} /><span>${escapeHtml(al.nome)}</span></label>`).join('') || '<span class="empty">Sem alunos cadastrados</span>'}</div></div>
    </div>
    <div class="form-actions"><button type="button" class="btn secondary" data-close-modal>Cancelar</button><button class="btn">Salvar</button></div>`,
    (data) => {
      data.alunos = [...document.querySelectorAll('input[name="alunos"]:checked')].map((c) => Number(c.value));
      return api.send(a.id ? 'PUT' : 'POST', a.id ? '/api/atividades/' + a.id : '/api/atividades', data).then(() => loadAtividades());
    }
  );
  document.querySelectorAll('[data-close-modal]').forEach((b) => (b.onclick = closeModal));
}

/* ---------------- Progressos ---------------- */
renderers.progressos = async () => {
  const el = document.getElementById('view-progressos');
  el.innerHTML = `<div class="page-head"><div><h2>Acompanhamento de progresso</h2><p>Registro de evolução de cada aluno</p></div><button class="btn" id="add-prog">+ Novo registro</button></div><div class="panel" id="prog-list"><div class="empty">Carregando…</div></div>`;
  document.getElementById('add-prog').onclick = () => progForm();
  await loadProgressos();
};

async function loadProgressos() {
  const rows = await api.get('/api/progressos');
  const list = document.getElementById('prog-list');
  list.innerHTML = rows.length
    ? `<table><thead><tr><th>Aluno</th><th>Disciplina</th><th>Avaliação</th><th>Nota</th><th>Data</th><th>Observação</th><th></th></tr></thead><tbody>${rows.map((p) => `
      <tr><td>${escapeHtml(p.aluno)}</td><td>${escapeHtml(p.disciplina) || '—'}</td><td>${escapeHtml(p.avaliacao) || '—'}</td><td>${p.nota ?? '—'}</td><td>${p.data ? new Date(p.data).toLocaleDateString('pt-BR') : '—'}</td><td>${escapeHtml(p.observacao) || '—'}</td>
      <td><button class="btn danger small" data-del="${p.id}">Excluir</button></td></tr>`).join('')}</tbody></table>`
    : `<div class="empty">Nenhum registro de progresso.</div>`;
  list.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    if (!confirm('Excluir este registro?')) return;
    await api.send('DELETE', '/api/progressos/' + b.dataset.del);
    toast('Registro excluído.');
    loadProgressos();
  }));
}

async function progForm() {
  const [alunos, disciplinas, atividades] = await Promise.all([
    api.get('/api/alunos'), api.get('/api/disciplinas'), api.get('/api/atividades')
  ]);
  openModal('Novo registro de progresso', `
    <div class="form-grid">
      ${field('aluno_id', 'Aluno', { type: 'select', required: true, options: alunos.map((a) => ({ value: a.id, label: a.nome })) })}
      ${field('disciplina_id', 'Disciplina', { type: 'select', options: [{ value: '', label: '—' }, ...disciplinas.map((d) => ({ value: d.id, label: d.nome }))] })}
      ${field('atividade_id', 'Atividade', { type: 'select', options: [{ value: '', label: '—' }, ...atividades.map((a) => ({ value: a.id, label: a.titulo }))] })}
      ${field('avaliacao', 'Avaliação', { options: [{ value: '', label: '—' }, { value: 'Em desenvolvimento', label: 'Em desenvolvimento' }, { value: 'Bom progresso', label: 'Bom progresso' }, { value: 'Ótimo desempenho', label: 'Ótimo desempenho' }], type: 'select' })}
      ${field('nota', 'Nota (0 a 10)', { type: 'number' })}
      ${field('data', 'Data', { type: 'date' })}
      ${field('observacao', 'Observação', { type: 'textarea', full: true })}
    </div>
    <div class="form-actions"><button type="button" class="btn secondary" data-close-modal>Cancelar</button><button class="btn">Salvar</button></div>`,
    (data) => api.send('POST', '/api/progressos', data).then(() => loadProgressos())
  );
  document.querySelectorAll('[data-close-modal]').forEach((b) => (b.onclick = closeModal));
}

/* ---------------- Kanban ---------------- */
renderers.kanban = async () => {
  const el = document.getElementById('view-kanban');
  el.innerHTML = `<div class="page-head"><div><h2>Quadro Kanban</h2><p>Metodologia ágil de gestão do projeto</p></div><button class="btn" id="add-kanban">+ Nova tarefa</button></div>
  <div class="kanban">
    <div class="kanban-col"><h4>A fazer</h4><div id="col-a_fazer"></div></div>
    <div class="kanban-col"><h4>Em andamento</h4><div id="col-em_andamento"></div></div>
    <div class="kanban-col"><h4>Concluído</h4><div id="col-concluido"></div></div>
  </div>`;
  document.getElementById('add-kanban').onclick = () => kanbanForm();
  await loadKanban();
};

async function loadKanban() {
  const rows = await api.get('/api/kanban');
  for (const col of ['a_fazer', 'em_andamento', 'concluido']) {
    const items = rows.filter((k) => k.coluna === col);
    document.getElementById('col-' + col).innerHTML = items.length
      ? items.map((k) => `
        <div class="kanban-item">
          <strong>${escapeHtml(k.titulo)}</strong>
          ${k.descricao ? `<p>${escapeHtml(k.descricao)}</p>` : ''}
          <div class="row-actions">
            ${col !== 'a_fazer' ? `<button class="btn secondary small" data-move="${k.id}" data-to="${col === 'em_andamento' ? 'a_fazer' : 'em_andamento'}">←</button>` : ''}
            ${col !== 'concluido' ? `<button class="btn small" data-move="${k.id}" data-to="${col === 'a_fazer' ? 'em_andamento' : 'concluido'}">→</button>` : ''}
            <button class="btn secondary small" data-edit="${k.id}">Editar</button>
            <button class="btn danger small" data-del="${k.id}">Excluir</button>
          </div>
        </div>`).join('')
      : `<div class="empty">Sem tarefas.</div>`;
  }
  document.querySelectorAll('[data-move]').forEach((b) => (b.onclick = async () => {
    const t = rows.find((x) => x.id === Number(b.dataset.move));
    await api.send('PUT', '/api/kanban/' + t.id, { ...t, coluna: b.dataset.to });
    loadKanban();
  }));
  document.querySelectorAll('[data-edit]').forEach((b) => (b.onclick = () => kanbanForm(rows.find((x) => x.id === Number(b.dataset.edit)))));
  document.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    if (!confirm('Excluir esta tarefa?')) return;
    await api.send('DELETE', '/api/kanban/' + b.dataset.del);
    toast('Tarefa excluída.');
    loadKanban();
  }));
}

function kanbanForm(k = {}) {
  const opts = [
    { value: 'a_fazer', label: 'A fazer' },
    { value: 'em_andamento', label: 'Em andamento' },
    { value: 'concluido', label: 'Concluído' }
  ];
  openModal(k.id ? 'Editar tarefa' : 'Nova tarefa', `
    <div class="form-grid">
      ${field('titulo', 'Título', { required: true, full: true, value: k.titulo })}
      ${field('descricao', 'Descrição', { type: 'textarea', full: true, value: k.descricao })}
      ${field('coluna', 'Coluna', { type: 'select', value: k.coluna || 'a_fazer', options: opts })}
    </div>
    <div class="form-actions"><button type="button" class="btn secondary" data-close-modal>Cancelar</button><button class="btn">Salvar</button></div>`,
    (data) => api.send(k.id ? 'PUT' : 'POST', k.id ? '/api/kanban/' + k.id : '/api/kanban', data).then(() => loadKanban())
  );
  document.querySelectorAll('[data-close-modal]').forEach((b) => (b.onclick = closeModal));
}

/* ---------------- Init ---------------- */
navigate('dashboard');
