export function renderCandidateCards(candidates, container, onDeleteCallback) {
  container.innerHTML = "";

  if (candidates.length === 0) { // verifica que candidatos tenga valores
    container.innerHTML = `
      <div class="empty-state">
        [NO_DATA] No se encontraron registros coincidentes.
      </div>
    `;
    return;
  }

  candidates.forEach((candidate) => {
    const card = document.createElement("article");
    card.className = "cv-card";

    const avatarHTML = candidate.foto
      ? `<img src="${candidate.foto}" alt="Avatar" class="card-avatar">`
      : `<div class="card-avatar-placeholder">NO_FOTO</div>`;

    const payload = candidate.payload || {};
    const techs = payload.tecnologias || payload.skills || [];
    let techsHTML = "";
    if (Array.isArray(techs) && techs.length > 0) {
      techsHTML = `
        <div class="card-body-section">
          <span class="section-label">Tecnologías & Skills</span>
          <div class="tags-container">
            ${techs.map((t) => `<span class="tech-tag">${escapeHTML(t)}</span>`).join("")}
          </div>
        </div>
      `;
    }

    const exp = payload.experiencia || payload.resumen || payload.bio || null;
    let expHTML = "";
    if (exp) {
      const expText =
        typeof exp === "object" ? JSON.stringify(exp, null, 2) : exp;
      expHTML = `
        <div class="card-body-section">
          <span class="section-label">Experiencia / Resumen</span>
          <p class="json-summary-text">${escapeHTML(expText)}</p>
        </div>
      `;
    }

    // anade codigo html desde js
    card.innerHTML = ` 
      <div class="card-top">
        ${avatarHTML}
        <div class="card-identity">
          <h3>${escapeHTML(candidate.nombre)} ${escapeHTML(candidate.apellidos)}</h3>
          <div class="card-role">${escapeHTML(candidate.puesto)}</div>
          <div class="card-age">Edad: ${candidate.edad} años | ID: #${candidate.id.slice(-6)}</div>
        </div>
      </div>

      ${techsHTML}
      ${expHTML}

      <div class="card-actions">
        <button class="btn-delete" data-id="${candidate.id}">[ELIMINAR_REGISTRO]</button>
      </div>
    `;

    const deleteBtn = card.querySelector(".btn-delete");
    deleteBtn.addEventListener("click", () => onDeleteCallback(candidate.id));

    container.appendChild(card);
  });
}

export function updateCounter(count) {
  const el = document.getElementById("cv-counter");
  if (el) el.textContent = count;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
