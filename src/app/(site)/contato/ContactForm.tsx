"use client";

import { useState, type FormEvent } from "react";

type Estado = "idle" | "enviando" | "sucesso" | "erro";

const ASSUNTOS = ["Discussão geral", "Interesse em patrocínio", "Imprensa", "Outro"] as const;

const classeCampo =
  "w-full rounded border border-[var(--wp-edge)] bg-[var(--wp-void)] px-4 py-3 text-sm text-[var(--wp-silver)] placeholder:text-[var(--wp-silver-dim)] outline-none transition-colors focus:border-[var(--wp-cyan)]";
const classeLabel = "tech-meta mb-2 block";
const classeErro = "mt-1 text-xs text-[var(--wp-red)]";

export function ContactForm({ assuntoFixo }: { assuntoFixo?: string }) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [erros, setErros] = useState<Record<string, string>>({});
  const [erroGeral, setErroGeral] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    assunto: ASSUNTOS[0],
    mensagem: "",
    consentimento: false,
  });

  function atualizar(campo: "nome" | "email" | "assunto" | "mensagem", valor: string) {
    setForm((f) => ({ ...f, [campo]: valor }));
  }

  function validar(): Record<string, string> {
    const novos: Record<string, string> = {};
    if (!form.nome.trim()) novos.nome = "Informe seu nome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) novos.email = "Informe um e-mail válido.";
    if (form.mensagem.trim().length < 10) novos.mensagem = "Escreva uma mensagem de pelo menos 10 caracteres.";
    if (!form.consentimento) novos.consentimento = "É necessário aceitar este item para enviar.";
    return novos;
  }

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroGeral("");
    const novos = validar();
    setErros(novos);
    if (Object.keys(novos).length > 0) return;

    setEstado("enviando");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          assunto: assuntoFixo ?? form.assunto,
          mensagem: form.mensagem.trim(),
          consentimento: true,
        }),
      });
      if (!res.ok) {
        try {
          const data: unknown = await res.json();
          if (data && typeof data === "object" && "erros" in data) {
            const errosApi = (data as { erros?: Record<string, string> }).erros;
            if (errosApi && typeof errosApi === "object") {
              setErros(errosApi);
              throw new Error("erros-campo");
            }
          }
        } catch (parse) {
          if (parse instanceof Error && parse.message === "erros-campo") throw parse;
        }
        throw new Error();
      }
      setEstado("sucesso");
    } catch (erro) {
      if (erro instanceof Error && erro.message === "erros-campo") {
        setEstado("erro");
        setErroGeral("Revise os campos destacados e tente novamente.");
        return;
      }
      setEstado("erro");
      setErroGeral("Não foi possível enviar agora. Tente novamente em alguns instantes.");
    }
  }

  if (estado === "sucesso") {
    return (
      <div
        role="status"
        className="rounded-xl border border-[var(--wp-gold)] bg-[var(--wp-coal)] p-8 text-center lg:p-10"
      >
        <p className="tech-meta text-[var(--wp-gold-soft)]">MENSAGEM ENVIADA</p>
        <h3 className="font-display mt-4 text-2xl font-extrabold text-[var(--wp-white)] lg:text-3xl">
          Chegou com segurança.
        </h3>
        <p className="mx-auto mt-4 max-w-md text-sm text-[var(--wp-silver-mute)]">
          Obrigado por falar com a Wakanda Pro. A equipe lê cada mensagem com
          o mesmo cuidado de quem aperta o último parafuso antes do teste.
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ nome: "", email: "", assunto: ASSUNTOS[0], mensagem: "", consentimento: false });
            setErros({});
            setEstado("idle");
          }}
          className="mt-6 inline-flex rounded-full border border-[var(--wp-edge)] px-5 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-silver-mute)] transition-colors hover:border-[var(--wp-silver-dim)] hover:text-[var(--wp-white)]"
        >
          Enviar outra mensagem
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contato-nome" className={classeLabel}>
            Nome *
          </label>
          <input
            id="contato-nome"
            type="text"
            required
            autoComplete="name"
            value={form.nome}
            onChange={(e) => atualizar("nome", e.target.value)}
            aria-invalid={Boolean(erros.nome)}
            className={classeCampo}
          />
          {erros.nome && <p className={classeErro}>{erros.nome}</p>}
        </div>
        <div>
          <label htmlFor="contato-email" className={classeLabel}>
            E-mail *
          </label>
          <input
            id="contato-email"
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => atualizar("email", e.target.value)}
            aria-invalid={Boolean(erros.email)}
            className={classeCampo}
          />
          {erros.email && <p className={classeErro}>{erros.email}</p>}
        </div>
      </div>

      {assuntoFixo ? (
        <div>
          <span className={classeLabel}>Assunto</span>
          <p className="rounded border border-[var(--wp-edge)] bg-[var(--wp-void)] px-4 py-3 text-sm text-[var(--wp-silver-mute)]">
            Interesse em patrocínio e parceria
          </p>
        </div>
      ) : (
        <div>
          <label htmlFor="contato-assunto" className={classeLabel}>
            Assunto *
          </label>
          <select
            id="contato-assunto"
            required
            value={form.assunto}
            onChange={(e) => atualizar("assunto", e.target.value)}
            className={classeCampo}
          >
            {ASSUNTOS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label htmlFor="contato-mensagem" className={classeLabel}>
          Mensagem *
        </label>
        <textarea
          id="contato-mensagem"
          rows={5}
          required
          value={form.mensagem}
          onChange={(e) => atualizar("mensagem", e.target.value)}
          aria-invalid={Boolean(erros.mensagem)}
          className={`${classeCampo} resize-y`}
        />
        {erros.mensagem && <p className={classeErro}>{erros.mensagem}</p>}
      </div>

      <div className="rounded-lg border border-[var(--wp-edge)] bg-[var(--wp-coal)] p-4">
        <div className="flex items-start gap-3">
          <input
            id="contato-consentimento"
            type="checkbox"
            required
            checked={form.consentimento}
            onChange={(e) => setForm((f) => ({ ...f, consentimento: e.target.checked }))}
            aria-invalid={Boolean(erros.consentimento)}
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--wp-red)]"
          />
          <label htmlFor="contato-consentimento" className="text-sm text-[var(--wp-silver-mute)]">
            Seus dados são usados apenas para resposta ao contato; dados de
            menores não são coletados sem autorização. Aviso completo será
            publicado na próxima fase. *
          </label>
        </div>
        {erros.consentimento && <p className={classeErro}>{erros.consentimento}</p>}
      </div>

      {estado === "erro" && erroGeral && (
        <p role="alert" className="text-sm text-[var(--wp-red)]">
          {erroGeral}
        </p>
      )}

      <button
        type="submit"
        disabled={estado === "enviando"}
        className="inline-flex items-center gap-2 rounded-full border border-[var(--wp-red)] px-8 py-3 font-mono text-xs uppercase tracking-[0.18em] text-[var(--wp-white)] transition-colors hover:bg-[var(--wp-red)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {estado === "enviando" ? "Enviando…" : "Enviar mensagem"}
      </button>
    </form>
  );
}
