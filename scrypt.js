async function loadJSON(path) {
  try {
    const res = await fetch(path);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  if (page === 'home') {
    const org = await loadJSON('data/organism.json');
    const dash = await loadJSON('data/dashboard.json');
    const campaigns = await loadJSON('data/campaigns.json');

    const pill = document.getElementById('home-status-pill');
    const orgState = document.getElementById('home-organism-state');
    const lastCamp = document.getElementById('home-last-campaign');

    if (org && pill && orgState) {
      pill.textContent = `Organismo: ${org.energia}, focus ${org.focus}`;
      orgState.textContent = `Energia: ${org.energia}, focus: ${org.focus}, umore: ${org.umore}`;
    }

    if (campaigns && campaigns.length && lastCamp) {
      const last = campaigns[0];
      lastCamp.textContent = `${last.titolo} — ${last.data} — ${last.stato}`;
    }

    const conn = document.getElementById('home-connections');
    if (dash && conn) {
      conn.textContent = `Discord: ${dash.discord}, Meta: ${dash.meta}, LinkedIn: ${dash.linkedin}, xCLOUD: ${dash.xcloud}`;
    }
  }

  if (page === 'organismo') {
    const org = await loadJSON('data/organism.json');
    if (!org) return;

    const energia = document.getElementById('org-energia');
    const focus = document.getElementById('org-focus');
    const umore = document.getElementById('org-umore');
    const agentsContainer = document.getElementById('org-agents');
    const ritualsList = document.getElementById('org-rituals');

    if (energia) energia.textContent = org.energia;
    if (focus) focus.textContent = org.focus;
    if (umore) umore.textContent = org.umore;

    if (agentsContainer && org.agenti) {
      agentsContainer.innerHTML = '';
      Object.entries(org.agenti).forEach(([key, agent]) => {
        const div = document.createElement('article');
        div.className = 'card';
        div.innerHTML = `
          <h3>${key}</h3>
          <p><strong>Ruolo:</strong> ${agent.ruolo}</p>
          <p><strong>Stato:</strong> ${agent.stato}</p>
          <p><strong>Focus:</strong> ${agent.focus || '—'}</p>
        `;
        agentsContainer.appendChild(div);
      });
    }

    if (ritualsList && org.rituali) {
      ritualsList.innerHTML = '';
      org.rituali.forEach((r) => {
        const li = document.createElement('li');
        li.textContent = `${r.nome} — ${r.descrizione}`;
        ritualsList.appendChild(li);
      });
    }
  }

  if (page === 'dashboard') {
    const dash = await loadJSON('data/dashboard.json');
    const campaigns = await loadJSON('data/campaigns.json');

    if (dash) {
      const d = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };
      d('dash-discord', dash.discord);
      d('dash-meta', dash.meta);
      d('dash-linkedin', dash.linkedin);
      d('dash-xcloud', dash.xcloud);

      const lc = document.getElementById('dash-last-campaigns');
      const lt = document.getElementById('dash-last-tickets');
      const lr = document.getElementById('dash-last-reports');

      if (lc && campaigns) {
        lc.innerHTML = '';
        campaigns.slice(0, 5).forEach((c) => {
          const li = document.createElement('li');
          li.textContent = `${c.data} — ${c.titolo} [${c.stato}]`;
          lc.appendChild(li);
        });
      }

      if (lt && dash.tickets) {
        lt.innerHTML = '';
        dash.tickets.forEach((t) => {
          const li = document.createElement('li');
          li.textContent = `${t.data} — ${t.titolo} [${t.stato}]`;
          lt.appendChild(li);
        });
      }

      if (lr && dash.reports) {
        lr.innerHTML = '';
        dash.reports.forEach((r) => {
          const li = document.createElement('li');
          li.textContent = `${r.data} — ${r.titolo}`;
          lr.appendChild(li);
        });
      }
    }
  }

  if (page === 'campagne') {
    const campaigns = await loadJSON('data/campaigns.json');
    const container = document.getElementById('campaigns-timeline');
    if (!campaigns || !container) return;

    container.innerHTML = '';
    campaigns.forEach((c) => {
      const div = document.createElement('div');
      div.className = 'timeline-item';
      div.innerHTML = `
        <h3>${c.titolo}</h3>
        <div class="timeline-meta">${c.data} — ${c.stato} — Piattaforme: ${c.piattaforme.join(', ')}</div>
        <p>${c.messaggio}</p>
      `;
      container.appendChild(div);
    });
  }
});
