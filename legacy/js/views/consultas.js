import { api } from "../api.js";
import { h, clear, field, notifyError, emptyState } from "../ui.js";
import { errMsg } from "./crudView.js";

/* Renderiza uma tabela genérica a partir de uma lista de objetos planos. */
function resultTable(rows, labels = {}) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return emptyState("Nenhum resultado.");
  }
  const keys = Object.keys(rows[0]);
  return h("div", { class: "table-responsive" }, [
    h("table", { class: "table table-sm table-hover align-middle mb-0" }, [
      h("thead", { class: "table-light" }, [
        h("tr", {}, keys.map((k) => h("th", { class: "text-uppercase small text-body-secondary" }, labels[k] || k))),
      ]),
      h("tbody", {}, rows.map((row) => h("tr", {}, keys.map((k) => h("td", {}, format(row[k])))))),
    ]),
  ]);
}

function format(v) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return JSON.stringify(v);
  return String(v);
}

/* Um "bloco" de consulta: título, formulário e área de resultado. */
function queryBlock({ title, description, inputs, run, labels }) {
  const resultBox = h("div", { class: "mt-3" }, emptyState("Informe os parâmetros e clique em Consultar."));
  const controls = {};

  const inputNodes = inputs.map((inp) => {
    const control = h("input", { type: inp.type || "text", placeholder: inp.placeholder || "" });
    controls[inp.key] = control;
    return field(inp.label, control, { colClass: "col-12 col-sm-6" });
  });

  const btn = h("button", { class: "btn btn-primary", type: "submit" }, [
    h("i", { class: "bi bi-search me-1" }), "Consultar",
  ]);
  const form = h("form", { class: "row g-3 align-items-end" }, [
    ...inputNodes,
    h("div", { class: "col-auto" }, [btn]),
  ]);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const args = {};
    for (const [k, ctrl] of Object.entries(controls)) args[k] = ctrl.value.trim();
    btn.disabled = true;
    clear(resultBox).append(h("div", { class: "text-body-secondary small py-3" }, "consultando…"));
    try {
      const rows = await run(args);
      clear(resultBox).append(resultTable(rows, labels));
    } catch (err) {
      clear(resultBox).append(emptyState(errMsg(err)));
      notifyError(errMsg(err));
    } finally {
      btn.disabled = false;
    }
  });

  return h("div", { class: "card shadow-sm mb-4" }, [
    h("div", { class: "card-body" }, [
      h("h2", { class: "h6 fw-bold mb-1" }, title),
      description ? h("p", { class: "text-body-secondary small mb-3" }, description) : null,
      form,
      resultBox,
    ]),
  ]);
}

export const consultasView = {
  async render(container) {
    clear(container);
    container.append(
      h("div", { class: "mb-4" }, [
        h("h1", { class: "h3 fw-bold mb-1" }, "Consultas complexas"),
        h("p", { class: "text-body-secondary mb-0" }, "Consultas que envolvem múltiplas entidades (motorista, veículo, passageiro, localização e viagem)."),
      ]),
      queryBlock({
        title: "Viagens por modelo de veículo",
        description: "Relaciona viagem → motorista → veículo → localização de partida.",
        inputs: [{ key: "modelo", label: "Modelo do veículo", placeholder: "ex.: Onix" }],
        run: ({ modelo }) => api.viagens.porModeloVeiculo(modelo),
        labels: {
          motorista_nome: "Motorista",
          veiculo_placa: "Placa",
          veiculo_modelo: "Modelo",
          cidade_partida: "Cidade de partida",
        },
      }),
      queryBlock({
        title: "Viagens por cidade de partida",
        description: "Relaciona viagem → passageiro → localização inicial → localização final.",
        inputs: [{ key: "cidade", label: "Cidade de partida", placeholder: "ex.: Fortaleza" }],
        run: ({ cidade }) => api.viagens.porCidadePartida(cidade),
        labels: {
          passageiro_nome: "Passageiro",
          cidade_partida: "Partida",
          cidade_chegada: "Chegada",
        },
      }),
      queryBlock({
        title: "Total de viagens por ano",
        description: "Agrupa as viagens criadas no ano informado.",
        inputs: [{ key: "ano", label: "Ano", type: "number", placeholder: "ex.: 2026" }],
        run: ({ ano }) => api.viagens.porAno(ano),
        labels: { ano: "Ano", total: "Total", _id: "Data" },
      }),
      queryBlock({
        title: "Contagem de viagens por ponto de partida",
        description: "Agrupa todas as viagens pela cidade da localização inicial.",
        inputs: [],
        run: () => api.viagens.contagemPorPontoPartida(),
        labels: { ponto_partida: "Ponto de partida", total: "Total" },
      }),
    );
  },
};
