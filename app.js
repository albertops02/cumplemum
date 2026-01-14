/* =========================
   CONFIG: PRUEBAS
   ========================= */

// Personaliza aquí preguntas, respuestas, pistas y el regalo final.
// Nota: si pones la respuesta en minúsculas, se comparará sin importar mayúsculas.
// Si la pones con mayúsculas (ej: "LUNA"), entonces exige exactamente ese formato.

const stages = [
    {
      cover: true,
      title: "¡Feliz 60 cumpleaños! 🎉",
      text: "Hoy empieza una gymkhana hecha con muchísimo cariño. Supera las pruebas y llega al regalo final 🎁",
      subtext: "Cuando estés listo/a… pulsa “Empezar la gymkhana”.",
    },
  
    {
      title: "Prueba 1 — La fecha",
      text: "Introduce un código relacionado con una fecha especial. (Formato sugerido: DDMM)",
      placeholder: "Ej: 1206",
      answer: "1206",
    },
  
    {
      title: "Prueba 2 — La palabra mágica",
      text: "Escribe la palabra clave de algo muy vuestro (una canción, un lugar, un apodo…).",
      placeholder: "Ej: aventura",
      answer: "aventura",
    },
  
    {
      title: "Prueba 3 — Código secreto",
      text: "Busca una nota escondida. En la nota hay un código de 4 letras. Escríbelo aquí.",
      placeholder: "Ej: LUNA",
      answer: "LUNA",
    },
  
    {
      final: true,
      title: "Final — Regalo 🎁",
      text: "¡Lo conseguiste! Aquí está tu premio final:",
      giftHtml: `
        <ul>
          <li><strong>Tu regalo:</strong> Una cena sorpresa + tu postre favorito 🍰</li>
          <li><strong>Fecha:</strong> Cuando tú elijas</li>
          <li><strong>Extra:</strong> Vale por un abrazo infinito 🫂</li>
        </ul>
        <p class="small">Aquí puedes poner un link (Drive/Spotify/Canva), una foto o un mensaje final.</p>
      `
    }
  ];
  
  
  /* =========================
     STATE
     ========================= */
  
  const KEY = "bday_gymkhana_progress_v2";
  let current = 0;
  
  const stageCard = document.getElementById("stageCard");
  const barFill = document.getElementById("barFill");
  const pill = document.getElementById("pill");
  
  function load() {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    current = Number.isFinite(saved.current) ? saved.current : 0;
  }
  
  function save() {
    localStorage.setItem(KEY, JSON.stringify({ current }));
  }
  
  function normalize(s) {
    return (s ?? "").trim();
  }
  
  function isAnswerCorrect(inputValue, expected) {
    const val = normalize(inputValue);
  
    if (typeof expected !== "string") return false;
  
    // Si la respuesta esperada está en minúsculas, comparamos case-insensitive
    if (expected === expected.toLowerCase()) {
      return val.toLowerCase() === expected;
    }
    // Si no, exigimos exactitud (útil para códigos tipo "LUNA")
    return val === expected;
  }
  
  
  /* =========================
     PROGRESS
     ========================= */
  
  function renderProgress() {
    const coverCount = stages.filter(s => s.cover).length; // normalmente 1
    const finalCount = stages.filter(s => s.final).length; // normalmente 1
  
    const total = stages.length - coverCount - finalCount; // solo pruebas
    const done = Math.min(Math.max(current - coverCount, 0), total);
  
    const pct = total <= 0 ? 0 : Math.round((done / total) * 100);
    barFill.style.width = pct + "%";
    pill.textContent = `${done}/${total}`;
  }
  
  
  /* =========================
     RENDER
     ========================= */
  
  function renderCover(stage) {
    stageCard.className = "card cover";
    stageCard.innerHTML = `
      <div class="decor">
        <div class="balloon" style="left: 6%; top: 10%;"></div>
        <div class="balloon b2" style="right: 8%; top: 18%; transform: scale(0.92);"></div>
        <div class="balloon" style="left: 78%; top: 62%; transform: scale(0.75); opacity:.65;"></div>
      </div>
  
      <div class="confetti" id="confetti"></div>
  
      <h2 class="big">${stage.title}</h2>
  
      <div class="badge60">
        <div class="num">60</div>
        <div>
          <div style="font-weight:800;">Años increíbles</div>
          <div style="font-size:12px; color:var(--muted);">y lo mejor aún está por venir ✨</div>
        </div>
      </div>
  
      <p class="subtitle">${stage.text}</p>
      <p class="note">${stage.subtext || ""}</p>
  
      <div class="panel">
        <p>
          Hoy celebramos 60 años llenos de historias, risas y momentos que valen oro.
          Esta gymkhana es un pequeño homenaje… hecho con mucho amor 💛
        </p>
      </div>
  
      <div class="ctaRow">
        <button id="startBtn">Empezar la gymkhana 🚀</button>
        <button class="secondary" id="resetBtn" title="Reinicia el juego desde el principio">Reiniciar</button>
      </div>
  
      <p class="note" style="margin-top:12px;">
        Consejo: si estás en móvil, sube el brillo y pon el sonido activo 😉
      </p>
    `;
  
    // Confetti
    const conf = document.getElementById("confetti");
    conf.innerHTML = "";
    const pieces = 34;
    for (let i = 0; i < pieces; i++) {
      const el = document.createElement("i");
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDuration = (2.6 + Math.random() * 2.8) + "s";
      el.style.animationDelay = (Math.random() * 1.8) + "s";
      el.style.opacity = (0.55 + Math.random() * 0.45).toFixed(2);
      el.style.width = (8 + Math.random() * 10) + "px";
      el.style.height = (10 + Math.random() * 16) + "px";
      conf.appendChild(el);
    }
  
    document.getElementById("startBtn").onclick = () => {
      current += 1;
      save();
      renderAll();
    };
  
    // Reinicio accesible (por si alguien se equivoca probando)
    document.getElementById("resetBtn").onclick = () => {
      localStorage.removeItem(KEY);
      current = 0;
      renderAll();
    };
  }
  
  function renderFinal(stage) {
    stageCard.className = "card";
    stageCard.innerHTML = `
      <h2>${stage.title}</h2>
      <p>${stage.text}</p>
  
      <div class="panel">
        ${stage.giftHtml}
      </div>
  
      <div class="row" style="margin-top:14px;">
        <button class="secondary" id="replayBtn">Volver a empezar</button>
      </div>
    `;
  
    document.getElementById("replayBtn").onclick = () => {
      localStorage.removeItem(KEY);
      current = 0;
      renderAll();
    };
  }
  
  function renderPuzzle(stage) {
    stageCard.className = "card";
    stageCard.innerHTML = `
      <h2>${stage.title}</h2>
      <p>${stage.text}</p>
  
      <div class="row">
        <input id="answerInput" placeholder="${stage.placeholder || "Escribe aquí…"}" autocomplete="off" />
        <button id="checkBtn">Comprobar</button>
      </div>
  
      <div class="msg" id="msg"></div>
  
      <p class="small" style="margin-top:10px;">
        Tip: escribe la respuesta y pulsa Enter.
      </p>
    `;
  
    const input = document.getElementById("answerInput");
    const msg = document.getElementById("msg");
  
    const check = () => {
      const ok = isAnswerCorrect(input.value, stage.answer);
  
      if (ok) {
        msg.textContent = "¡Correcto! Desbloqueando la siguiente prueba… ✅";
        msg.className = "msg good";
        current += 1;
        save();
        setTimeout(renderAll, 550);
      } else {
        msg.textContent = "Mmm… no es. Prueba otra vez 😈";
        msg.className = "msg bad";
      }
    };
  
    document.getElementById("checkBtn").onclick = check;
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") check();
    });
  }
  
  function renderStage() {
    const stage = stages[current] || stages[stages.length - 1];
  
    if (stage.cover) return renderCover(stage);
    if (stage.final) return renderFinal(stage);
    return renderPuzzle(stage);
  }
  
  function renderAll() {
    renderStage();
    renderProgress();
  }
  
  
  /* =========================
     INIT
     ========================= */
  
  load();
  renderAll();
  