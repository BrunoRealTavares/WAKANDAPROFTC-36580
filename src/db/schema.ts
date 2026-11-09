import { sql } from "drizzle-orm";
import { check, index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

// ======= enums / listas (fonte ?nica p/ valida??o zod + UI) =======
export const PAPEIS = ["admin", "lider", "integrante"] as const;
export type Papel = (typeof PAPEIS)[number];
export const CATEGORIAS_TASK = ["engenharia", "programacao", "estrategia", "comunicacao", "gestao"] as const;
export const PRIORIDADES = ["baixa", "media", "alta"] as const;
export const STATUS_TASK = ["pendente", "em_andamento", "em_revisao", "concluida"] as const;
export const TIPOS_EVENTO = ["reuniao", "treino", "entrega", "teste", "competicao", "evento_escolar"] as const;
export const TIPOS_MOVIMENTO = ["entrada", "saida", "ajuste"] as const;
export const TIPOS_FINANCEIRO = ["entrada", "despesa"] as const;
export const STATUS_PUBLICACAO = ["rascunho", "revisao", "publicado", "arquivado"] as const;
export const CATEGORIAS_GALERIA = ["equipe", "treinos", "escola", "engenharia", "competicoes", "robo"] as const;
export const TIPOS_ROBO = ["mecanica", "programacao"] as const;

// Regras de papel (ACL) ? ver src/lib/auth.ts
// admin: tudo; lider: tudo exceto gest?o de usu?rios e exclus?o de documentos;
// integrante: leitura geral (exceto financeiro) + escrita em tarefas/eventos/presen?a/engenharia/rob?/invent?rio.

const criadoEm = () =>
  integer("created_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`);
const atualizadoEm = () =>
  integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`)
    .$onUpdate(() => new Date());

export const users = sqliteTable(
  "users",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    email: text("email").notNull(),
    senhaHash: text("senha_hash").notNull(),
    papel: text("papel").notNull().default("integrante"),
    ativo: integer("ativo").notNull().default(1),
    convitePendente: integer("convite_pendente").notNull().default(0),
    ultimoLogin: integer("ultimo_login", { mode: "timestamp" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [
    uniqueIndex("users_nome_uq").on(t.nome),
    uniqueIndex("users_email_uq").on(t.email),
    check("users_papel_check", sql`${t.papel} in ('admin','lider','integrante')`),
  ],
);

export const sessions = sqliteTable(
  "sessions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    // Token aleat?rio 32 bytes hex; cookie leva token + "." + HMAC-SHA256(token, WP_SESSION_SECRET)
    token: text("token").notNull(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiraEm: integer("expira_em", { mode: "timestamp" }).notNull(),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [uniqueIndex("sessions_token_uq").on(t.token)],
);

export const teamMembers = sqliteTable(
  "team_members",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    funcao: text("funcao").notNull(),
    area: text("area").notNull(),
    bio: text("bio"),
    fotoUrl: text("foto_url"),
    exibir: integer("exibir").notNull().default(1),
    status: text("status").notNull().default("rascunho"),
    publicadoEm: integer("publicado_em", { mode: "timestamp" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [check("team_members_status_check", sql`${t.status} in ('rascunho','revisao','publicado','arquivado')`)],
);

export const tasks = sqliteTable(
  "tasks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titulo: text("titulo").notNull(),
    descricao: text("descricao"),
    categoria: text("categoria").notNull(),
    prioridade: text("prioridade").notNull().default("media"),
    status: text("status").notNull().default("pendente"),
    responsavelId: integer("responsavel_id").references(() => users.id, { onDelete: "set null" }),
    prazo: integer("prazo", { mode: "timestamp" }),
    criadoPorId: integer("criado_por_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [
    index("tasks_status_idx").on(t.status),
    check("tasks_categoria_check", sql`${t.categoria} in ('engenharia','programacao','estrategia','comunicacao','gestao')`),
    check("tasks_prioridade_check", sql`${t.prioridade} in ('baixa','media','alta')`),
    check("tasks_status_check", sql`${t.status} in ('pendente','em_andamento','em_revisao','concluida')`),
  ],
);

export const taskComments = sqliteTable("task_comments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  autorId: integer("autor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  texto: text("texto").notNull(),
  createdAt: criadoEm(),
  updatedAt: atualizadoEm(),
});

export const events = sqliteTable(
  "events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titulo: text("titulo").notNull(),
    tipo: text("tipo").notNull(),
    inicio: integer("inicio", { mode: "timestamp" }).notNull(),
    local: text("local"),
    notas: text("notas"),
    criadoPorId: integer("criado_por_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [
    index("events_inicio_idx").on(t.inicio),
    check("events_tipo_check", sql`${t.tipo} in ('reuniao','treino','entrega','teste','competicao','evento_escolar')`),
  ],
);

export const attendance = sqliteTable(
  "attendance",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    eventId: integer("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    presente: integer("presente").notNull().default(0),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [uniqueIndex("attendance_event_user_uq").on(t.eventId, t.userId)],
);
export const documents = sqliteTable("documents", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  titulo: text("titulo").notNull(),
  categoria: text("categoria").notNull().default("geral"),
  arquivoNome: text("arquivo_nome").notNull(),
  arquivoPath: text("arquivo_path").notNull(),
  mime: text("mime").notNull().default("application/octet-stream"),
  tamanho: integer("tamanho").notNull().default(0),
  enviadoPorId: integer("enviado_por_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: criadoEm(),
  updatedAt: atualizadoEm(),
});

export const robotVersions = sqliteTable(
  "robot_versions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    tipo: text("tipo").notNull(),
    notas: text("notas"),
    alteracoes: text("alteracoes"),
    registradoPorId: integer("registrado_por_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [check("robot_versions_tipo_check", sql`${t.tipo} in ('mecanica','programacao')`)],
);

export const robotTests = sqliteTable("robot_tests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  versionId: integer("version_id")
    .notNull()
    .references(() => robotVersions.id, { onDelete: "cascade" }),
  objetivo: text("objetivo").notNull(),
  procedimento: text("procedimento"),
  resultado: text("resultado"),
  problemas: text("problemas"),
  createdAt: criadoEm(),
  updatedAt: atualizadoEm(),
});

export const engineeringLogs = sqliteTable("engineering_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  problema: text("problema").notNull(),
  hipotese: text("hipotese"),
  solucao: text("solucao"),
  experimento: text("experimento"),
  materiais: text("materiais"),
  resultado: text("resultado"),
  aprendizados: text("aprendizados"),
  proximasAcoes: text("proximas_acoes"),
  taskId: integer("task_id").references(() => tasks.id, { onDelete: "set null" }),
  robotVersionId: integer("robot_version_id").references(() => robotVersions.id, { onDelete: "set null" }),
  autorId: integer("autor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  data: integer("data", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
  createdAt: criadoEm(),
  updatedAt: atualizadoEm(),
});

export const inventoryItems = sqliteTable("inventory_items", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  categoria: text("categoria").notNull().default("geral"),
  quantidade: integer("quantidade").notNull().default(0),
  minimo: integer("minimo").notNull().default(0),
  localizacao: text("localizacao"),
  estado: text("estado").notNull().default("bom"),
  observacoes: text("observacoes"),
  createdAt: criadoEm(),
  updatedAt: atualizadoEm(),
});

export const inventoryMovements = sqliteTable(
  "inventory_movements",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    itemId: integer("item_id")
      .notNull()
      .references(() => inventoryItems.id, { onDelete: "cascade" }),
    tipo: text("tipo").notNull(),
    quantidade: integer("quantidade").notNull(),
    motivo: text("motivo"),
    usuarioId: integer("usuario_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [check("inventory_movements_tipo_check", sql`${t.tipo} in ('entrada','saida','ajuste')`)],
);

export const financialEntries = sqliteTable(
  "financial_entries",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    tipo: text("tipo").notNull(),
    categoria: text("categoria").notNull().default("geral"),
    valorEmCentavos: integer("valor_em_centavos").notNull(),
    data: integer("data", { mode: "timestamp" }).notNull(),
    descricao: text("descricao"),
    comprovanteDocId: integer("comprovante_doc_id").references(() => documents.id, { onDelete: "set null" }),
    aprovado: integer("aprovado").notNull().default(0),
    criadoPorId: integer("criado_por_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [check("financial_entries_tipo_check", sql`${t.tipo} in ('entrada','despesa')`)],
);
export const posts = sqliteTable(
  "posts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    slug: text("slug").notNull(),
    titulo: text("titulo").notNull(),
    categoria: text("categoria").notNull().default("geral"),
    autor: text("autor").notNull(),
    resumo: text("resumo"),
    conteudo: text("conteudo"),
    imagemUrl: text("imagem_url"),
    status: text("status").notNull().default("rascunho"),
    publicadoEm: integer("publicado_em", { mode: "timestamp" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [
    uniqueIndex("posts_slug_uq").on(t.slug),
    index("posts_status_idx").on(t.status),
    check("posts_status_check", sql`${t.status} in ('rascunho','revisao','publicado','arquivado')`),
  ],
);

export const galleryAssets = sqliteTable(
  "gallery_assets",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titulo: text("titulo").notNull(),
    categoria: text("categoria").notNull().default("equipe"),
    url: text("url").notNull(),
    descricao: text("descricao"),
    status: text("status").notNull().default("rascunho"),
    publicadoEm: integer("publicado_em", { mode: "timestamp" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [
    index("gallery_categoria_idx").on(t.categoria),
    check("gallery_assets_categoria_check", sql`${t.categoria} in ('equipe','treinos','escola','engenharia','competicoes','robo')`),
    check("gallery_assets_status_check", sql`${t.status} in ('rascunho','revisao','publicado','arquivado')`),
  ],
);

export const partners = sqliteTable(
  "partners",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    nome: text("nome").notNull(),
    nivel: text("nivel").notNull().default("apoio"),
    url: text("url"),
    status: text("status").notNull().default("rascunho"),
    publicadoEm: integer("publicado_em", { mode: "timestamp" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [check("partners_status_check", sql`${t.status} in ('rascunho','revisao','publicado','arquivado')`)],
);

export const timelineEvents = sqliteTable(
  "timeline_events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    titulo: text("titulo").notNull(),
    // data em TEXTO LIVRE (ex.: "Data a preencher")
    data: text("data"),
    descricao: text("descricao"),
    ordem: integer("ordem").notNull().default(0),
    status: text("status").notNull().default("rascunho"),
    publicadoEm: integer("publicado_em", { mode: "timestamp" }),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [check("timeline_events_status_check", sql`${t.status} in ('rascunho','revisao','publicado','arquivado')`)],
);

export const siteSettings = sqliteTable(
  "site_settings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    chave: text("chave").notNull(),
    valor: text("valor"),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [uniqueIndex("site_settings_chave_uq").on(t.chave)],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    usuarioId: integer("usuario_id").references(() => users.id, { onDelete: "set null" }),
    acao: text("acao").notNull(),
    detalheResumido: text("detalhe_resumido"),
    // IP truncado/anonimizado ? sem dados sens?veis
    ip: text("ip"),
    createdAt: criadoEm(),
    updatedAt: atualizadoEm(),
  },
  (t) => [index("audit_logs_acao_idx").on(t.acao)],
);

export const contactMessages = sqliteTable("contact_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  nome: text("nome").notNull(),
  email: text("email").notNull(),
  assunto: text("assunto").notNull(),
  mensagem: text("mensagem").notNull(),
  ip: text("ip"),
  createdAt: criadoEm(),
  updatedAt: atualizadoEm(),
});

// tipos inferidos ?teis
export type User = typeof users.$inferSelect;
export type Task = typeof tasks.$inferSelect;
export type Event = typeof events.$inferSelect;
export type Document = typeof documents.$inferSelect;
export type Post = typeof posts.$inferSelect;
