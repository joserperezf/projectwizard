import { useState } from "react";

// ---- Types ----------------------------------------------------------------

type Priority = "Alta" | "Media" | "Baja";
type TabName = "Por Hacer" | "En Proceso" | "Hecho";

// ---- Data -----------------------------------------------------------------

const TEAM = [
  { initials: "AG", name: "Ana García", role: "UX/UI", pct: 80 },
  { initials: "JL", name: "José López", role: "Frontend", pct: 60 },
  { initials: "CR", name: "Carlos Ruiz", role: "Backend", pct: 45 },
  { initials: "MS", name: "María Soto", role: "QA", pct: 90 },
  { initials: "LM", name: "Luis Mora", role: "Project Manager", pct: 70 },
];

const TABS: TabName[] = ["Por Hacer", "En Proceso", "Hecho"];

const TASKS: Record<TabName, { title: string; assignee: string; priority: Priority }[]> = {
  "Por Hacer": [
    { title: "Diseñar pantalla de login", assignee: "Ana García", priority: "Alta" },
    { title: "Configurar pipeline CI/CD", assignee: "Carlos Ruiz", priority: "Media" },
    { title: "Arquitectura de base de datos", assignee: "Luis Mora", priority: "Alta" },
  ],
  "En Proceso": [
    { title: "Implementar autenticación JWT", assignee: "Carlos Ruiz", priority: "Alta" },
    { title: "Componentes de navegación", assignee: "José López", priority: "Media" },
    { title: "Suite de pruebas E2E", assignee: "María Soto", priority: "Baja" },
  ],
  Hecho: [
    { title: "Configurar repositorio Git", assignee: "Luis Mora", priority: "Alta" },
    { title: "Wireframes de pantallas", assignee: "Ana García", priority: "Media" },
    { title: "Reunión de kickoff", assignee: "Luis Mora", priority: "Baja" },
  ],
};

const INITIAL_TASKS = [
  { id: 1, text: "Implementar pantalla de dashboard", done: true },
  { id: 2, text: "Crear componente TaskCard", done: true },
  { id: 3, text: "Integrar API de autenticación", done: true },
  { id: 4, text: "Añadir animaciones de transición", done: false },
  { id: 5, text: "Revisión de código con equipo", done: false },
];

// ---- Shared atoms ---------------------------------------------------------

function ProgressBar({ pct, h = 6 }: { pct: number; h?: number }) {
  return (
    <div style={{ width: "100%", height: h, background: "#E4E4E0", borderRadius: h }}>
      <div
        style={{
          width: `${Math.min(100, pct)}%`,
          height: "100%",
          background: "#1A1A1A",
          borderRadius: h,
          transition: "width 0.3s ease",
        }}
      />
    </div>
  );
}

function Avatar({ initials, size = 38 }: { initials: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1.5px solid #1A1A1A",
        background: "#FAFAF8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: size * 0.32,
          fontWeight: 500,
          color: "#1A1A1A",
          letterSpacing: "-0.5px",
        }}
      >
        {initials}
      </span>
    </div>
  );
}

function Badge({ priority }: { priority: Priority }) {
  const map: Record<Priority, React.CSSProperties> = {
    Alta: { background: "#1A1A1A", color: "#fff", border: "none" },
    Media: { background: "#fff", color: "#1A1A1A", border: "1.5px solid #1A1A1A" },
    Baja: { background: "#EFEFEB", color: "#999", border: "1px solid #D8D8D4" },
  };
  return (
    <span
      style={{
        fontFamily: "DM Mono, monospace",
        fontSize: 9,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        padding: "2px 7px",
        borderRadius: 3,
        ...map[priority],
      }}
    >
      {priority}
    </span>
  );
}

// ---- Status bar -----------------------------------------------------------

function StatusBar() {
  return (
    <div
      style={{
        height: 44,
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        borderBottom: "1px solid #EBEBEB",
        flexShrink: 0,
        position: "relative",
      }}
    >
      <span style={{ fontFamily: "DM Mono, monospace", fontSize: 13, fontWeight: 500, color: "#1A1A1A" }}>
        9:41
      </span>
      {/* Dynamic island */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 8,
          transform: "translateX(-50%)",
          width: 118,
          height: 34,
          background: "#1A1A1A",
          borderRadius: 20,
        }}
      />
      {/* Status icons */}
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12 }}>
          {[4, 7, 10].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, background: "#1A1A1A", borderRadius: 1 }} />
          ))}
        </div>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
          <path d="M7.5 2.5C9.7 2.5 11.7 3.4 13.1 4.9L14.2 3.8C12.5 2.1 10.1 1 7.5 1S2.5 2.1.8 3.8L1.9 4.9C3.3 3.4 5.3 2.5 7.5 2.5z" fill="#1A1A1A"/>
          <path d="M7.5 5.5c1.3 0 2.4.5 3.2 1.3L11.9 5.6C10.8 4.6 9.2 4 7.5 4S4.2 4.6 3.1 5.6L4.3 6.8C5.1 6 6.2 5.5 7.5 5.5z" fill="#1A1A1A"/>
          <circle cx="7.5" cy="9.5" r="1.5" fill="#1A1A1A"/>
        </svg>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 22, height: 11, border: "1.5px solid #1A1A1A", borderRadius: 3, padding: "1.5px" }}>
            <div style={{ width: "80%", height: "100%", background: "#1A1A1A", borderRadius: 1.5 }} />
          </div>
          <div style={{ width: 2, height: 5, background: "#1A1A1A", borderRadius: "0 1px 1px 0", marginLeft: 1 }} />
        </div>
      </div>
    </div>
  );
}

// ---- Screen 1: Dashboard -------------------------------------------------

function DashboardScreen() {
  const avgPct = Math.round(TEAM.reduce((s, m) => s + m.pct, 0) / TEAM.length);

  return (
    <div style={{ flex: 1, overflow: "hidden auto", scrollbarWidth: "none" }}>
      {/* App header */}
      <div
        style={{
          padding: "22px 24px 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: 4,
            }}
          >
            Pantalla 01
          </div>
          <div
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#1A1A1A",
              letterSpacing: "-0.8px",
              lineHeight: 1,
            }}
          >
            ProjectWizard
          </div>
        </div>
        <button
          style={{
            marginTop: 22,
            width: 36,
            height: 36,
            border: "1px solid #C8C8C4",
            borderRadius: 8,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2" stroke="#1A1A1A" strokeWidth="1.5" />
            <path
              d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1.1 1.1M11.1 11.1l1.1 1.1M3.8 12.2l1.1-1.1M11.1 4.9l1.1-1.1"
              stroke="#1A1A1A"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div style={{ margin: "18px 0 0", height: 1, background: "#EBEBEB" }} />

      {/* Project card */}
      <div
        style={{
          margin: "18px 24px 0",
          border: "1.5px solid #1A1A1A",
          borderRadius: 14,
          padding: "18px 18px 16px",
          background: "#fff",
          boxShadow: "3px 3px 0 #1A1A1A",
        }}
      >
        <div
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 6,
          }}
        >
          Proyecto Activo
        </div>
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 19,
            fontWeight: 700,
            color: "#1A1A1A",
            letterSpacing: "-0.4px",
            marginBottom: 3,
          }}
        >
          App Móvil v2.0
        </div>
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 12,
            color: "#999",
            marginBottom: 16,
          }}
        >
          Sprint 3 &nbsp;·&nbsp; 14 días restantes
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 9,
              color: "#666",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Progreso del Equipo
          </span>
          <span
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 14,
              fontWeight: 500,
              color: "#1A1A1A",
            }}
          >
            {avgPct}%
          </span>
        </div>
        <ProgressBar pct={avgPct} h={8} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#999" }}>
            12 completadas
          </span>
          <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#999" }}>
            20 total
          </span>
        </div>
      </div>

      {/* Team section */}
      <div style={{ margin: "22px 24px 0" }}>
        <div
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 14,
          }}
        >
          Equipo — {TEAM.length} miembros
        </div>

        {TEAM.map((m, i) => (
          <div
            key={m.initials}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "11px 0",
              borderBottom: i < TEAM.length - 1 ? "1px solid #EBEBEB" : "none",
            }}
          >
            <Avatar initials={m.initials} size={38} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 4,
                }}
              >
                <span
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#1A1A1A",
                  }}
                >
                  {m.name}
                </span>
                <span
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 10,
                    color: "#999",
                  }}
                >
                  {m.pct}%
                </span>
              </div>
              <div
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 9,
                  color: "#999",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                {m.role}
              </div>
              <ProgressBar pct={m.pct} h={3} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ margin: "22px 24px 36px" }}>
        <button
          style={{
            width: "100%",
            height: 52,
            background: "#1A1A1A",
            color: "#fff",
            fontFamily: "Outfit, sans-serif",
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: "0.01em",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Ver Tablero
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="#fff"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---- Screen 2: Task Board -----------------------------------------------

function TaskBoardScreen() {
  const [tab, setTab] = useState<TabName>("En Proceso");
  const tasks = TASKS[tab];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div
        style={{
          padding: "22px 24px 0",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "DM Mono, monospace",
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "#999",
              marginBottom: 4,
            }}
          >
            Pantalla 02
          </div>
          <div
            style={{
              fontFamily: "Outfit, sans-serif",
              fontSize: 24,
              fontWeight: 800,
              color: "#1A1A1A",
              letterSpacing: "-0.8px",
              lineHeight: 1,
            }}
          >
            Tablero
          </div>
        </div>
        <button
          style={{
            marginTop: 22,
            width: 36,
            height: 36,
            border: "1px solid #C8C8C4",
            borderRadius: 8,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none">
            <line x1="1" y1="1" x2="15" y2="1" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="1" y1="7" x2="11" y2="7" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="1" y1="13" x2="7" y2="13" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Filter tabs */}
      <div
        style={{
          margin: "18px 24px 0",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          border: "1.5px solid #1A1A1A",
          borderRadius: 10,
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              height: 38,
              fontFamily: "DM Mono, monospace",
              fontSize: 9.5,
              fontWeight: 500,
              letterSpacing: "0.02em",
              border: "none",
              borderRight: i < TABS.length - 1 ? "1.5px solid #1A1A1A" : "none",
              cursor: "pointer",
              background: tab === t ? "#1A1A1A" : "#fff",
              color: tab === t ? "#fff" : "#555",
              transition: "background 0.15s, color 0.15s",
              padding: "0 4px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Count */}
      <div style={{ padding: "10px 24px 0", flexShrink: 0 }}>
        <span style={{ fontFamily: "DM Mono, monospace", fontSize: 10, color: "#999" }}>
          {tasks.length} tareas &middot; {tab}
        </span>
      </div>

      {/* Tasks list */}
      <div
        style={{
          flex: 1,
          overflow: "hidden auto",
          scrollbarWidth: "none",
          padding: "10px 24px 28px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map((task, i) => (
            <div
              key={i}
              style={{
                border: "1.5px solid #1A1A1A",
                borderRadius: 12,
                padding: "14px 14px 12px",
                background: "#fff",
                boxShadow: "2px 2px 0 #1A1A1A",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 9,
                }}
              >
                <Badge priority={task.priority} />
                <span style={{ fontFamily: "DM Mono, monospace", fontSize: 9, color: "#CCC" }}>
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div
                style={{
                  fontFamily: "Outfit, sans-serif",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1A1A1A",
                  lineHeight: 1.35,
                  marginBottom: 12,
                }}
              >
                {task.title}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  paddingTop: 10,
                  borderTop: "1px solid #F0F0EC",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    border: "1px solid #1A1A1A",
                    background: "#FAFAF8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "DM Mono, monospace",
                      fontSize: 7,
                      fontWeight: 500,
                      color: "#1A1A1A",
                    }}
                  >
                    {task.assignee
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 11,
                    color: "#888",
                  }}
                >
                  {task.assignee}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Screen 3: My Tasks -------------------------------------------------

function MyTasksScreen() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const done = tasks.filter((t) => t.done).length;
  const pct = Math.round((done / tasks.length) * 100);

  const toggle = (id: number) =>
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "22px 24px 0", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#999",
            marginBottom: 4,
          }}
        >
          Pantalla 03
        </div>
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 24,
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: "-0.8px",
            lineHeight: 1,
          }}
        >
          Mis Tareas
        </div>
      </div>

      <div style={{ margin: "16px 0 0", height: 1, background: "#EBEBEB", flexShrink: 0 }} />

      {/* Greeting */}
      <div style={{ padding: "20px 24px 0", flexShrink: 0 }}>
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 13,
            color: "#999",
            marginBottom: 3,
          }}
        >
          Bienvenido de nuevo,
        </div>
        <div
          style={{
            fontFamily: "Outfit, sans-serif",
            fontSize: 28,
            fontWeight: 800,
            color: "#1A1A1A",
            letterSpacing: "-0.8px",
            lineHeight: 1.05,
          }}
        >
          Hola, José
        </div>
        <div
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 11,
            color: "#888",
            marginTop: 5,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              background: "#1A1A1A",
              color: "#fff",
              padding: "1px 6px",
              borderRadius: 3,
              fontSize: 9,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Frontend
          </span>
          Developer
        </div>
      </div>

      {/* Progress counter */}
      <div
        style={{
          margin: "18px 24px 0",
          border: "1.5px solid #1A1A1A",
          borderRadius: 14,
          padding: "16px 18px",
          background: "#fff",
          boxShadow: "3px 3px 0 #1A1A1A",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 14,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 9,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: 5,
              }}
            >
              Progreso Diario
            </div>
            <div
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 22,
                fontWeight: 700,
                color: "#1A1A1A",
                letterSpacing: "-0.5px",
              }}
            >
              {done}{" "}
              <span
                style={{
                  fontFamily: "DM Mono, monospace",
                  fontSize: 12,
                  fontWeight: 400,
                  color: "#888",
                }}
              >
                de {tasks.length} completadas
              </span>
            </div>
          </div>
          <div
            style={{
              width: 54,
              height: 54,
              border: "2px solid #1A1A1A",
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 15,
                fontWeight: 500,
                color: "#1A1A1A",
                lineHeight: 1,
              }}
            >
              {pct}
            </span>
            <span
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 8,
                color: "#999",
              }}
            >
              %
            </span>
          </div>
        </div>
        <ProgressBar pct={pct} h={7} />
      </div>

      {/* Checklist */}
      <div
        style={{
          flex: 1,
          overflow: "hidden auto",
          scrollbarWidth: "none",
          padding: "18px 24px 28px",
        }}
      >
        <div
          style={{
            fontFamily: "DM Mono, monospace",
            fontSize: 9,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 12,
          }}
        >
          Lista de Tareas
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {tasks.map((task, i) => (
            <div
              key={task.id}
              onClick={() => toggle(task.id)}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "13px 0",
                borderBottom: i < tasks.length - 1 ? "1px solid #EBEBEB" : "none",
                cursor: "pointer",
              }}
            >
              {/* Checkbox */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 1,
                  border: `1.5px solid ${task.done ? "#1A1A1A" : "#C0C0BC"}`,
                  borderRadius: 5,
                  background: task.done ? "#1A1A1A" : "#fff",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background 0.15s, border-color 0.15s",
                }}
              >
                {task.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.8 3L9 1"
                      stroke="#fff"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>

              {/* Task text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontFamily: "Outfit, sans-serif",
                    fontSize: 13,
                    fontWeight: task.done ? 400 : 500,
                    color: task.done ? "#BABAB6" : "#1A1A1A",
                    lineHeight: 1.45,
                    textDecoration: task.done ? "line-through" : "none",
                    transition: "color 0.15s",
                    display: "block",
                  }}
                >
                  {task.text}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Phone frame wrapper ------------------------------------------------

function PhoneFrame({
  label,
  number,
  children,
}: {
  label: string;
  number: string;
  children: React.ReactNode;
}) {
  const W = 390;
  const H = 844;
  const S = 0.68;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      {/* Screen number pill */}
      <div
        style={{
          fontFamily: "DM Mono, monospace",
          fontSize: 9,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#888",
          padding: "4px 10px",
          border: "1px solid #C8C8C4",
          borderRadius: 20,
          background: "#fff",
        }}
      >
        {number}
      </div>

      {/* Scaled phone container */}
      <div style={{ width: W * S, height: H * S, flexShrink: 0 }}>
        <div
          style={{
            width: W,
            height: H,
            transform: `scale(${S})`,
            transformOrigin: "top left",
          }}
        >
          {/* Phone shell */}
          <div
            style={{
              width: W,
              height: H,
              background: "#fff",
              border: "2px solid #1A1A1A",
              borderRadius: 46,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "6px 6px 0 #1A1A1A",
            }}
          >
            <StatusBar />
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              {children}
            </div>
            {/* Home indicator */}
            <div
              style={{
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#fff",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 120,
                  height: 5,
                  background: "#1A1A1A",
                  borderRadius: 3,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          fontFamily: "Outfit, sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: "#1A1A1A",
          letterSpacing: "-0.2px",
        }}
      >
        {label}
      </div>
    </div>
  );
}

// ---- App ----------------------------------------------------------------

export default function App() {
  return (
    <div
      style={{
        minHeight: "100%",
        background: "#F0EFE9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Page header */}
      <div
        style={{
          width: "100%",
          maxWidth: 1300,
          padding: "52px 40px 0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 52,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "DM Mono, monospace",
                fontSize: 10,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#888",
                marginBottom: 10,
              }}
            >
              Diseño de Wireframes
            </div>
            <h1
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 52,
                fontWeight: 800,
                color: "#1A1A1A",
                letterSpacing: "-2px",
                margin: 0,
                lineHeight: 0.95,
              }}
            >
              ProjectWizard
            </h1>
            <p
              style={{
                fontFamily: "Outfit, sans-serif",
                fontSize: 14,
                color: "#888",
                margin: "10px 0 0",
              }}
            >
              Aplicación de gestión para desarrolladores &nbsp;·&nbsp; React Native &nbsp;·&nbsp; iOS
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 24,
              alignItems: "flex-end",
            }}
          >
            {[
              ["3", "Pantallas"],
              ["390×844", "Dimensiones"],
              ["ES", "Idioma"],
            ].map(([val, lbl]) => (
              <div key={lbl} style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 18,
                    fontWeight: 500,
                    color: "#1A1A1A",
                    letterSpacing: "-0.5px",
                  }}
                >
                  {val}
                </div>
                <div
                  style={{
                    fontFamily: "DM Mono, monospace",
                    fontSize: 9,
                    color: "#999",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  {lbl}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1.5, background: "#1A1A1A", marginBottom: 52 }} />
      </div>

      {/* Three phone screens */}
      <div
        style={{
          display: "flex",
          gap: 40,
          alignItems: "flex-start",
          padding: "0 40px 72px",
          width: "100%",
          maxWidth: 1300,
          overflowX: "auto",
          scrollbarWidth: "none",
          justifyContent: "center",
        }}
      >
        <PhoneFrame label="Dashboard" number="01">
          <DashboardScreen />
        </PhoneFrame>
        <PhoneFrame label="Tablero de Tareas" number="02">
          <TaskBoardScreen />
        </PhoneFrame>
        <PhoneFrame label="Mis Tareas" number="03">
          <MyTasksScreen />
        </PhoneFrame>
      </div>
    </div>
  );
}
