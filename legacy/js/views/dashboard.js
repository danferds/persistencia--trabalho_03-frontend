import { api } from "../api.js";
import { h, clear, spinner, emptyState } from "../ui.js";
import { errMsg } from "./crudView.js";

const CARDS = [
  { label: "Motoristas", icon: "bi-person-badge", resource: api.motoristas },
  { label: "Passageiros", icon: "bi-people", resource: api.passageiros },
  { label: "Veículos", icon: "bi-car-front", resource: api.veiculos },
  { label: "Localizações", icon: "bi-geo-alt", resource: api.localizacoes },
  { label: "Viagens", icon: "bi-signpost-split", resource: api.viagens },
];

export const dashboardView = {
  async render(container) {
    clear(container);
    container.append(
      h("div", { class: "mb-4" }, [
        h("h1", { class: "h3 fw-bold mb-1" }, "Painel"),
        h("p", { class: "text-body-secondary mb-0" }, "Visão geral dos dados da plataforma de mobilidade urbana."),
      ]),
    );

    const grid = h("div", { class: "row g-3 mb-4" });
    container.append(grid);

    for (const card of CARDS) {
      const valueEl = h("div", { class: "stat-value" }, "…");
      grid.append(
        h("div", { class: "col-6 col-md-4 col-xl" }, [
          h("div", { class: "card stat-card shadow-sm h-100" }, [
            h("div", { class: "card-body" }, [
              h("div", { class: "d-flex align-items-center gap-2 text-body-secondary mb-2" }, [
                h("i", { class: `bi ${card.icon}` }),
                h("span", { class: "card-kicker" }, card.label),
              ]),
              valueEl,
            ]),
          ]),
        ]),
      );
      card.resource
        .count()
        .then((n) => (valueEl.textContent = String(n)))
        .catch(() => (valueEl.textContent = "—"));
    }

    const partidaBox = h("div", {}, spinner());
    container.append(
      h("div", { class: "card shadow-sm" }, [
        h("div", { class: "card-body" }, [
          h("h2", { class: "card-kicker mb-3" }, "Viagens por ponto de partida"),
          partidaBox,
        ]),
      ]),
    );

    try {
      const rows = await api.viagens.contagemPorPontoPartida();
      clear(partidaBox);
      if (!rows.length) {
        partidaBox.append(emptyState("Sem viagens registradas."));
      } else {
        partidaBox.append(
          h("div", { class: "table-responsive" }, [
            h("table", { class: "table table-hover align-middle mb-0" }, [
              h("thead", { class: "table-light" }, [
                h("tr", {}, [
                  h("th", { class: "text-uppercase small text-body-secondary" }, "Cidade de partida"),
                  h("th", { class: "text-uppercase small text-body-secondary text-end" }, "Total de viagens"),
                ]),
              ]),
              h("tbody", {}, rows.map((r) =>
                h("tr", {}, [
                  h("td", {}, r.ponto_partida ?? "—"),
                  h("td", { class: "text-end fw-semibold" }, String(r.total ?? 0)),
                ]),
              )),
            ]),
          ]),
        );
      }
    } catch (err) {
      clear(partidaBox).append(emptyState(errMsg(err)));
    }
  },
};
