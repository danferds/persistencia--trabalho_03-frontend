import { h, clear, field, notifyOk, notifyError, openModal, confirmDialog, spinner, emptyState } from "../ui.js";
import { ApiError } from "../api.js";

/**
 * Monta uma tela de CRUD completa (criar / listar / filtrar / ordenar /
 * paginar / editar / excluir) para um recurso da API.
 *
 * @param {object} cfg
 * @param {string} cfg.title
 * @param {string} [cfg.subtitle]
 * @param {string} [cfg.idKey="_id"]
 * @param {Array<{value:string,label:string,op?:string}>} cfg.searchFields
 * @param {Array<{key:string,label:string,render?:(row:any)=>(Node|string)}>} cfg.columns
 * @param {Array<FieldDef>} cfg.createFields
 * @param {Array<FieldDef>} [cfg.editFields]
 * @param {(form:Record<string,string>) => object} cfg.toCreateParams
 * @param {(form:Record<string,string>, row:any) => object} [cfg.toEditParams]
 */
export function createCrudView(cfg) {
  const idKey = cfg.idKey || "_id";
  const rowId = (row) => row[idKey] ?? row.id;
  const singular = cfg.title.replace(/s$/, "");
  const collapseId = `create-${Math.random().toString(36).slice(2, 9)}`;

  const state = {
    page: 1,
    pageSize: 10,
    sortField: "", // sem ordenação por padrão (o back end valida a coluna)
    sortDir: "asc",
    searchField: cfg.searchFields[0]?.value || "",
    searchTerm: "",
  };

  let container;

  async function render(target) {
    container = target;
    clear(container);
    container.append(
      h("div", { class: "d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4" }, [
        h("div", {}, [
          h("h1", { class: "h3 fw-bold mb-1" }, cfg.title),
          cfg.subtitle ? h("p", { class: "text-body-secondary mb-0" }, cfg.subtitle) : null,
        ]),
      ]),
      await buildCreateCard(),
      buildListCard(),
    );
    await loadTable();
  }

  /* ----------------------- Criar ----------------------- */
  async function buildCreateCard() {
    const { formEl, getValues, reset } = await buildForm(cfg.createFields, {});
    const submit = h("button", { class: "btn btn-primary", type: "submit" }, [
      h("i", { class: "bi bi-plus-lg me-1" }), `Adicionar ${singular.toLowerCase()}`,
    ]);

    formEl.append(h("div", { class: "col-12 d-flex gap-2 pt-1" }, [submit]));
    formEl.addEventListener("submit", async (e) => {
      e.preventDefault();
      submit.disabled = true;
      try {
        await cfg.resource.create(cfg.toCreateParams(getValues()));
        notifyOk(`${singular} criado com sucesso.`);
        reset();
        state.page = 1;
        await loadTable();
      } catch (err) {
        notifyError(errMsg(err));
      } finally {
        submit.disabled = false;
      }
    });

    return h("div", { class: "card shadow-sm mb-4" }, [
      h("div", { class: "card-header bg-transparent py-3" }, [
        h("button", {
          class: "btn btn-link text-decoration-none p-0 fw-semibold d-flex align-items-center gap-2 collapsed",
          type: "button", "data-bs-toggle": "collapse", "data-bs-target": `#${collapseId}`,
          "aria-expanded": "false",
        }, [
          h("i", { class: "bi bi-plus-circle" }),
          "Novo registro",
        ]),
      ]),
      h("div", { class: "collapse", id: collapseId }, [
        h("div", { class: "card-body" }, [formEl]),
      ]),
    ]);
  }

  /* ----------------------- Listagem ----------------------- */
  function buildListCard() {
    const searchFieldSel = h(
      "select",
      { onChange: (e) => (state.searchField = e.target.value) },
      cfg.searchFields.map((f) => h("option", { value: f.value, selected: f.value === state.searchField }, f.label)),
    );
    const searchInput = h("input", {
      type: "text",
      placeholder: "buscar…",
      value: state.searchTerm,
      onKeydown: (e) => { if (e.key === "Enter") { state.searchTerm = e.target.value; state.page = 1; loadTable(); } },
    });
    const searchBtn = h("button", {
      class: "btn btn-primary", type: "button",
      onClick: () => { state.searchTerm = searchInput.value; state.page = 1; loadTable(); },
    }, [h("i", { class: "bi bi-search" })]);
    const clearBtn = h("button", {
      class: "btn btn-outline-secondary", type: "button",
      onClick: () => { searchInput.value = ""; state.searchTerm = ""; state.page = 1; loadTable(); },
    }, "Limpar");

    const sortFieldSel = h(
      "select",
      { onChange: (e) => { state.sortField = e.target.value; state.page = 1; loadTable(); } },
      [
        h("option", { value: "", selected: state.sortField === "" }, "— sem ordenação —"),
        ...cfg.searchFields.map((f) => h("option", { value: f.value, selected: f.value === state.sortField }, f.label)),
      ],
    );
    const sortDirSel = h(
      "select",
      { onChange: (e) => { state.sortDir = e.target.value; state.page = 1; loadTable(); } },
      [
        h("option", { value: "asc", selected: state.sortDir === "asc" }, "crescente"),
        h("option", { value: "desc", selected: state.sortDir === "desc" }, "decrescente"),
      ],
    );
    const pageSizeSel = h(
      "select",
      { onChange: (e) => { state.pageSize = Number(e.target.value); state.page = 1; loadTable(); } },
      [5, 10, 20, 50].map((n) => h("option", { value: n, selected: n === state.pageSize }, `${n} / página`)),
    );

    const toolbar = h("div", { class: "row g-2 align-items-end mb-3" }, [
      field("Campo", searchFieldSel, { colClass: "col-6 col-md-2" }),
      field("Termo", searchInput, { colClass: "col-12 col-md-4" }),
      h("div", { class: "col-auto" }, [searchBtn]),
      h("div", { class: "col-auto" }, [clearBtn]),
      field("Ordenar por", sortFieldSel, { colClass: "col-6 col-md" }),
      field("Direção", sortDirSel, { colClass: "col-6 col-md-2" }),
      field("Tamanho", pageSizeSel, { colClass: "col-6 col-md-2" }),
    ]);

    const tableWrap = h("div", { id: "tableWrap" }, [spinner()]);
    const pagination = h("div", { class: "d-flex justify-content-between align-items-center flex-wrap gap-2 mt-3 small text-body-secondary", id: "pagination" });

    return h("div", { class: "card shadow-sm" }, [
      h("div", { class: "card-body" }, [
        h("h2", { class: "card-kicker mb-3" }, "Registros"),
        toolbar,
        tableWrap,
        pagination,
      ]),
    ]);
  }

  async function loadTable() {
    const wrap = container.querySelector("#tableWrap");
    const pag = container.querySelector("#pagination");
    if (!wrap) return;
    clear(wrap).append(spinner());

    const searchDef = cfg.searchFields.find((f) => f.value === state.searchField);
    const op = searchDef?.op || "$regex";
    let filter = {};
    if (state.searchTerm.trim()) {
      let val = state.searchTerm.trim();
      if (["$eq", "$gt", "$lt", "$gte", "$lte"].includes(op)) {
        const n = Number(val);
        val = Number.isNaN(n) ? val : n;
      }
      filter = { [state.searchField]: { [op]: val } };
    }

    try {
      const res = await cfg.resource.filter({
        filter,
        sortBy: state.sortField ? [state.sortField, state.sortDir] : null,
        page: state.page,
        pageSize: state.pageSize,
      });
      const rows = res?.data ?? [];
      renderRows(wrap, rows);
      renderPagination(pag, rows.length);
    } catch (err) {
      clear(wrap).append(emptyState(errMsg(err)));
      clear(pag);
    }
  }

  function renderRows(wrap, rows) {
    clear(wrap);
    if (!rows.length) {
      wrap.append(emptyState("Nenhum registro encontrado."));
      return;
    }
    const hasEdit = Array.isArray(cfg.editFields) && cfg.editFields.length > 0;

    const thead = h("thead", { class: "table-light" }, [
      h("tr", {}, [
        ...cfg.columns.map((c) => h("th", { scope: "col", class: "text-uppercase small text-body-secondary" }, c.label)),
        h("th", { scope: "col", class: "text-end text-uppercase small text-body-secondary" }, "Ações"),
      ]),
    ]);
    const tbody = h("tbody", {}, rows.map((row) => {
      const tds = cfg.columns.map((c) => {
        const content = c.render ? c.render(row) : (row[c.key] ?? "—");
        return h("td", {}, content instanceof Node ? content : String(content));
      });
      const actions = h("td", { class: "text-end text-nowrap" }, [
        hasEdit
          ? h("button", { class: "btn btn-sm btn-outline-secondary me-2", type: "button", onClick: () => openEdit(row) }, [
              h("i", { class: "bi bi-pencil" }),
            ])
          : null,
        h("button", { class: "btn btn-sm btn-outline-danger", type: "button", onClick: () => openDelete(row) }, [
          h("i", { class: "bi bi-trash" }),
        ]),
      ]);
      return h("tr", {}, [...tds, actions]);
    }));

    wrap.append(
      h("div", { class: "table-responsive" }, [
        h("table", { class: "table table-hover align-middle mb-0" }, [thead, tbody]),
      ]),
    );
  }

  function renderPagination(pag, rowCount) {
    clear(pag);
    const canPrev = state.page > 1;
    const canNext = rowCount === state.pageSize; // heurística: página cheia => provável próxima
    pag.append(
      h("span", {}, `Página ${state.page} · ${rowCount} registro(s) exibido(s)`),
      h("div", { class: "btn-group" }, [
        h("button", {
          class: "btn btn-sm btn-outline-secondary", type: "button", disabled: !canPrev,
          onClick: () => { state.page--; loadTable(); },
        }, [h("i", { class: "bi bi-chevron-left" }), " Anterior"]),
        h("button", {
          class: "btn btn-sm btn-outline-secondary", type: "button", disabled: !canNext,
          onClick: () => { state.page++; loadTable(); },
        }, ["Próxima ", h("i", { class: "bi bi-chevron-right" })]),
      ]),
    );
  }

  /* ----------------------- Editar ----------------------- */
  async function openEdit(row) {
    const values = {};
    for (const f of cfg.editFields) {
      values[f.key] = f.initial ? f.initial(row) : (row[f.key] ?? "");
    }
    const { formEl, getValues } = await buildForm(cfg.editFields, values);
    openModal({
      title: `Editar ${singular}`,
      body: formEl,
      confirmText: "Salvar alterações",
      onConfirm: async () => {
        try {
          const params = cfg.toEditParams ? cfg.toEditParams(getValues(), row) : getValues();
          await cfg.resource.update(rowId(row), params);
          notifyOk("Registro atualizado.");
          await loadTable();
        } catch (err) {
          notifyError(errMsg(err));
          return true; // mantém modal aberto
        }
      },
    });
  }

  /* ----------------------- Excluir ----------------------- */
  function openDelete(row) {
    confirmDialog({
      title: "Excluir registro",
      message: `Tem certeza que deseja excluir este registro (${rowId(row)})? Essa ação não pode ser desfeita.`,
      onConfirm: async () => {
        try {
          await cfg.resource.remove(rowId(row));
          notifyOk("Registro excluído.");
          await loadTable();
        } catch (err) {
          notifyError(errMsg(err));
          return true;
        }
      },
    });
  }

  return { render };
}

/* ------------------------------------------------------------------ */
/* Helpers compartilhados                                             */
/* ------------------------------------------------------------------ */
export async function buildForm(fields, values = {}) {
  const controls = {};
  const nodes = [];

  for (const f of fields) {
    const type = f.type || "text";
    let control;
    if (type === "select") {
      let options = f.staticOptions || [];
      if (f.options) {
        try {
          options = (await f.options()) || [];
        } catch {
          options = [];
        }
      }
      control = h("select", { required: !!f.required }, [
        f.placeholder ? h("option", { value: "" }, f.placeholder) : null,
        ...options.map((o) =>
          h("option", { value: String(o.value), selected: String(o.value) === String(values[f.key] ?? "") }, o.label),
        ),
      ]);
    } else {
      control = h("input", {
        type,
        required: !!f.required,
        step: f.step,
        value: values[f.key] ?? "",
        placeholder: f.placeholder || "",
      });
    }
    controls[f.key] = control;
    nodes.push(field(f.label, control, { colClass: "col-12 col-sm-6" }));
  }

  const formEl = h("form", { class: "row g-3" }, nodes);

  return {
    formEl,
    getValues() {
      const out = {};
      for (const [key, ctrl] of Object.entries(controls)) out[key] = ctrl.value;
      return out;
    },
    reset() {
      for (const ctrl of Object.values(controls)) ctrl.value = "";
    },
  };
}

export function errMsg(err) {
  if (err instanceof ApiError) return err.message;
  return err?.message || "Erro inesperado.";
}
