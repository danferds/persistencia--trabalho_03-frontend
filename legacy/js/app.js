import { api } from "./api.js";
import { getApiBaseUrl, setApiBaseUrl } from "./config.js";
import { h, clear, openModal, notifyOk } from "./ui.js";
import { dashboardView } from "./views/dashboard.js";
import { motoristasView } from "./views/motoristas.js";
import { passageirosView } from "./views/passageiros.js";
import { veiculosView } from "./views/veiculos.js";
import { localizacoesView } from "./views/localizacoes.js";
import { viagensView } from "./views/viagens.js";
import { consultasView } from "./views/consultas.js";

const ROUTES = [
  { hash: "#/", label: "Painel", icon: "bi-grid-1x2", view: dashboardView },
  { hash: "#/motoristas", label: "Motoristas", icon: "bi-person-badge", view: motoristasView },
  { hash: "#/passageiros", label: "Passageiros", icon: "bi-people", view: passageirosView },
  { hash: "#/veiculos", label: "Veículos", icon: "bi-car-front", view: veiculosView },
  { hash: "#/localizacoes", label: "Localizações", icon: "bi-geo-alt", view: localizacoesView },
  { hash: "#/viagens", label: "Viagens", icon: "bi-signpost-split", view: viagensView },
  { hash: "#/consultas", label: "Consultas", icon: "bi-search", view: consultasView },
];

const nav = document.getElementById("nav");
const viewEl = document.getElementById("view");

function buildNav() {
  clear(nav);
  for (const route of ROUTES) {
    nav.append(
      h("button", {
        class: "nav-link text-start",
        dataset: { hash: route.hash },
        onClick: () => (location.hash = route.hash),
      }, [
        h("i", { class: `bi ${route.icon}` }),
        h("span", {}, route.label),
      ]),
    );
  }
}

function highlightNav(hash) {
  for (const btn of nav.querySelectorAll("button[data-hash]")) {
    btn.classList.toggle("active", btn.dataset.hash === hash);
  }
}

async function router() {
  const hash = location.hash || "#/";
  const route = ROUTES.find((r) => r.hash === hash) || ROUTES[0];
  highlightNav(route.hash);
  document.title = `${route.label} — Mobilidade Urbana`;
  clear(viewEl);
  try {
    await route.view.render(viewEl);
    window.scrollTo({ top: 0 });
  } catch (err) {
    clear(viewEl).append(
      h("div", { class: "alert alert-danger" }, [
        h("h5", { class: "alert-heading" }, "Erro ao renderizar a tela"),
        h("p", { class: "mb-0" }, err?.message || String(err)),
      ]),
    );
  }
}

/* ---------------- Status da API ---------------- */
async function checkApi() {
  const dot = document.getElementById("apiDot");
  const label = document.getElementById("apiLabel");
  dot.className = "status-dot";
  try {
    await api.ping();
    dot.classList.add("ok");
    label.textContent = "API online";
  } catch {
    dot.classList.add("bad");
    label.textContent = "API offline";
  }
  label.title = getApiBaseUrl();
}

/* ---------------- Configurações ---------------- */
function openSettings() {
  const input = h("input", {
    class: "form-control",
    type: "text",
    value: getApiBaseUrl(),
    placeholder: "http://localhost:8000",
  });
  openModal({
    title: "Configurar URL da API",
    body: h("div", {}, [
      h("label", { class: "form-label small fw-semibold text-body-secondary" }, "Endereço base do back end (FastAPI)"),
      input,
    ]),
    confirmText: "Salvar",
    onConfirm: async () => {
      setApiBaseUrl(input.value.trim() || "http://localhost:8000");
      notifyOk("URL da API atualizada.");
      await checkApi();
      await router();
    },
  });
}

/* ---------------- Bootstrap ---------------- */
document.documentElement.setAttribute("data-bs-theme", "light");
buildNav();
document.getElementById("settingsBtn").addEventListener("click", openSettings);
window.addEventListener("hashchange", router);
router();
checkApi();
setInterval(checkApi, 30000);
