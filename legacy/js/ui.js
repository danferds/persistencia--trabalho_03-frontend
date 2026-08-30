/* Utilitários de UI: criação de elementos + toasts e modais do Bootstrap. */

const bs = () => window.bootstrap;

/**
 * Cria um elemento DOM.
 * @param {string} tag
 * @param {object} attrs  `class`, `dataset`, `html`, `onClick`, atributos comuns…
 * @param {(Node|string|null|Array)} children
 */
export function h(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs || {})) {
    if (value === null || value === undefined || value === false) continue;
    if (key === "class") el.className = value;
    else if (key === "dataset") Object.assign(el.dataset, value);
    else if (key === "html") el.innerHTML = value;
    else if (key.startsWith("on") && typeof value === "function") {
      el.addEventListener(key.slice(2).toLowerCase(), value);
    } else if (key.includes("-") || key.startsWith("aria")) {
      el.setAttribute(key, value);
    } else if (key in el && key !== "list") {
      try { el[key] = value; } catch { el.setAttribute(key, value); }
    } else {
      el.setAttribute(key, value);
    }
  }
  appendChildren(el, children);
  return el;
}

function appendChildren(el, children) {
  const list = Array.isArray(children) ? children : [children];
  for (const child of list) {
    if (child === null || child === undefined || child === false) continue;
    el.append(child instanceof Node ? child : document.createTextNode(String(child)));
  }
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
  return node;
}

/* ---------------- Toasts ---------------- */
export function toast(message, kind = "info") {
  const tone = { ok: "text-bg-success", error: "text-bg-danger", info: "text-bg-primary" }[kind] || "text-bg-primary";
  const root = document.getElementById("toasts");
  const el = h("div", { class: `toast align-items-center border-0 ${tone}`, role: "alert", "aria-live": "assertive", "aria-atomic": "true" }, [
    h("div", { class: "d-flex" }, [
      h("div", { class: "toast-body fw-medium" }, message),
      h("button", { class: "btn-close btn-close-white me-2 m-auto", type: "button", "data-bs-dismiss": "toast", "aria-label": "Fechar" }),
    ]),
  ]);
  root.append(el);
  const t = new (bs().Toast)(el, { delay: 4200 });
  t.show();
  el.addEventListener("hidden.bs.toast", () => el.remove());
}

export const notifyOk = (m) => toast(m, "ok");
export const notifyError = (m) => toast(m, "error");

/* ---------------- Modal genérico ---------------- */
export function openModal({ title, body, confirmText = "Salvar", onConfirm, confirmClass = "btn btn-primary" }) {
  const root = document.getElementById("modalRoot");
  clear(root);

  const confirmBtn = h("button", { class: confirmClass, type: "button" }, confirmText);

  const el = h("div", { class: "modal fade", tabindex: "-1", "aria-hidden": "true" }, [
    h("div", { class: "modal-dialog modal-dialog-centered" }, [
      h("div", { class: "modal-content" }, [
        h("div", { class: "modal-header" }, [
          h("h5", { class: "modal-title" }, title),
          h("button", { class: "btn-close", type: "button", "data-bs-dismiss": "modal", "aria-label": "Fechar" }),
        ]),
        h("div", { class: "modal-body" }, body),
        h("div", { class: "modal-footer" }, [
          h("button", { class: "btn btn-outline-secondary", type: "button", "data-bs-dismiss": "modal" }, "Cancelar"),
          confirmBtn,
        ]),
      ]),
    ]),
  ]);

  root.append(el);
  const modal = new (bs().Modal)(el);
  const close = () => modal.hide();

  confirmBtn.addEventListener("click", async () => {
    confirmBtn.disabled = true;
    try {
      const keepOpen = await onConfirm?.();
      if (!keepOpen) close();
    } finally {
      confirmBtn.disabled = false;
    }
  });

  el.addEventListener("hidden.bs.modal", () => clear(root));
  modal.show();
  return { close };
}

export function confirmDialog({ title = "Confirmar", message, confirmText = "Excluir", onConfirm }) {
  return openModal({
    title,
    body: h("p", { class: "mb-0 text-body-secondary" }, message),
    confirmText,
    confirmClass: "btn btn-danger",
    onConfirm,
  });
}

/* ---------------- Campo de formulário (coluna do grid do Bootstrap) ---------------- */
export function field(label, control, { colClass = "col-12 col-sm-6 col-lg-4" } = {}) {
  if (control && control.classList && !control.classList.contains("form-check-input")) {
    control.classList.add(control.tagName === "SELECT" ? "form-select" : "form-control");
  }
  return h("div", { class: colClass }, [
    h("label", { class: "form-label small fw-semibold text-body-secondary" }, label),
    control,
  ]);
}

export function fmtDate(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("pt-BR");
  } catch {
    return String(value);
  }
}

export function shortId(id) {
  if (!id) return "—";
  const s = String(id);
  return s.length > 10 ? `${s.slice(0, 8)}…` : s;
}

/** <code> com tooltip opcional — usado para exibir IDs. */
export function mono(text, title) {
  return h("code", { class: "user-select-all small", title: title || null }, String(text));
}

export function idCell(id) {
  return mono(shortId(id), id);
}

export function badge(text, kind = "secondary") {
  const tone = { ok: "success", warn: "warning", danger: "danger", info: "info", secondary: "secondary" }[kind] || "secondary";
  return h("span", { class: `badge rounded-pill text-bg-${tone}` }, text);
}

export function spinner(text = "carregando") {
  return h("div", { class: "text-center py-5" }, [
    h("div", { class: "spinner-border text-primary", role: "status" }, [
      h("span", { class: "visually-hidden" }, text),
    ]),
  ]);
}

export function emptyState(message) {
  return h("div", { class: "text-center text-body-secondary py-5" }, message);
}
