async function loadJSON(path) {
  try {
    const res = await fetch(path + "?v=" + Date.now());
    return await res.json();
  } catch (e) {
    console.error("Errore caricamento JSON:", path, e);
    return null;
  }
}

async function initHome() {
  const pill = document.getElementById("home-status-pill");
  if (!pill) return;

  const organism = await loadJSON("data/organism.json");
  if (!organism) {
    pill.textContent = "Organismo: offline";
    pill.classList.remove("pill-ok");
    return;
  }

  pill.textContent = `Organismo: ${organism.energia}`;
}

async function initOrganismo() {
  const container = document.getElementById("organismo-container");
  if (!container) return;

  const organism = await loadJSON("data/organism.json");
  if (!organism) {
    container.innerHTML = "<p>Impossibile caricare l’organismo.</p>";
    return;
  }

  container.innerHTML = `
    <h2>Energia: ${organism.energia}</h2>
    <h3>Focus: ${organism.focus}</h3>
    <h3>Agenti</h3>
    <ul>
      ${Object.entries(organism.agenti)
        .map(([k, v]) => `<li><strong>${k}</strong>: ${v.stato} — ${v.focus}</li>`)
        .join("")}
    </ul>
  `;
}

async function initDashboard() {
  const container = document.getElementById("dashboard-container");
  if (!container) return;

  const dash = await loadJSON("data/dashboard.json");
  if (!dash) {
    container.innerHTML = "<p>Dashboard non disponibile.</p>";
    return;
  }

  container.innerHTML = `
    <h2>Servizi</h2>
    <ul>
      <li>Discord: ${dash.discord}</li>
      <li>Meta: ${dash.meta}</li>
      <li>LinkedIn: ${dash.linkedin}</li>
      <li>xCLOUD: ${dash.xcloud}</li>
    </ul>

    <h2>Tickets</h2>
    <ul>
      ${dash.tickets.map(t => `<li>${t.data} — ${t.titolo} (${t.stato})</li>`).join("")}
    </ul>

    <h2>Reports</h2>
    <ul>
      ${dash.reports.map(r => `<li>${r.data} — ${r.titolo}</li>`).join("")}
    </ul>
  `;
}

async function initCampagne() {
  const container = document.getElementById("campagne-container");
  if (!container) return;

  const campaigns = await loadJSON("data/campaigns.json");
  if (!campaigns) {
    container.innerHTML = "<p>Nessuna campagna disponibile.</p>";
    return;
  }

  container.innerHTML = `
    <div class="timeline">
      ${campaigns
        .map(
          c => `
        <div class="timeline-item">
          <h3>${c.titolo}</h3>
          <div class="timeline-meta">${c.data} — ${c.stato}</div>
          <p>${c.messaggio}</p>
        </div>
      `
        )
        .join("")}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;

  if (page === "home") initHome();
  if (page === "organismo") initOrganismo();
  if (page === "dashboard") initDashboard();
  if (page === "campagne") initCampagne();
});
