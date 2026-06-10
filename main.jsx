import { useState } from "react";

const COLORS = {
  dark: "#1C1C1C",
  cream: "#F5F0E8",
  terracotta: "#C4622D",
  terracottaLight: "#E07848",
  muted: "#888",
  border: "#D9D3C7",
  white: "#FFFFFF",
};

const DATA_SOURCE_ID = "3fb3f897-5547-4c19-8d55-e02dee74cff5";

const steps = [
  {
    id: "contexto",
    label: "Contexto",
    title: "Primeiro, me conta quem você é",
    subtitle: "Informações básicas pra eu entender seu ponto de partida.",
    fields: [
      { id: "nome", label: "Nome completo", type: "text", placeholder: "Como você se chama?", required: true },
      { id: "linkedin", label: "LinkedIn", type: "text", placeholder: "linkedin.com/in/seuperfil", required: true },
      { id: "email", label: "E-mail", type: "email", placeholder: "seu@email.com", required: true },
      {
        id: "tempo_cs",
        label: "Há quanto tempo você trabalha com CS?",
        type: "select",
        required: true,
        options: ["Menos de 6 meses", "6 meses a 1 ano", "1 a 2 anos", "2 a 4 anos", "Mais de 4 anos"],
      },
      {
        id: "cargo_atual",
        label: "Qual é o seu cargo atual?",
        type: "select",
        required: true,
        options: ["Analista / Especialista de CS", "Customer Success Manager (CSM)", "Sênior CSM", "CS Lead / Team Lead", "Head / Gerente de CS", "Outro"],
      },
    ],
  },
  {
    id: "empresa",
    label: "Empresa",
    title: "Me fala do ambiente onde você atua",
    subtitle: "O contexto da sua empresa muda tudo na hora de te ajudar.",
    fields: [
      {
        id: "porte_empresa",
        label: "Porte da empresa",
        type: "select",
        required: true,
        options: ["Startup (até 50 pessoas)", "Scale-up (50 a 200 pessoas)", "Mid-market (200 a 1000 pessoas)", "Enterprise (mais de 1000 pessoas)"],
      },
      { id: "modelo", label: "Modelo de negócio", type: "radio", required: true, options: ["B2B", "B2C", "B2B2C"] },
      { id: "segmento", label: "Segmento / Setor", type: "text", placeholder: "Ex: SaaS, Fintechs, EdTech, Varejo...", required: true },
      {
        id: "carteira",
        label: "Quantas contas você gerencia hoje?",
        type: "select",
        required: false,
        options: ["Não gerencio contas atualmente", "Menos de 20", "20 a 50", "50 a 100", "Mais de 100"],
      },
    ],
  },
  {
    id: "dores",
    label: "Desafios",
    title: "Onde você sente que trava?",
    subtitle: "Seja honesto — aqui não tem resposta certa ou errada.",
    fields: [
      {
        id: "maior_dor",
        label: "Qual é o seu maior desafio hoje em CS?",
        type: "textarea",
        placeholder: "Ex: Tenho dificuldade em provar o valor do CS internamente, não sei como estruturar QBRs...",
        required: true,
      },
      {
        id: "areas_dificuldade",
        label: "Em quais áreas você sente mais dificuldade? (pode marcar mais de uma)",
        type: "checkbox",
        required: false,
        options: [
          "Redução de churn", "Expansão de receita (upsell/cross-sell)", "Onboarding de clientes",
          "Condução de QBRs / reuniões estratégicas", "Comunicação com C-level",
          "Gestão de carteira e priorização", "Métricas e dados de CS",
          "Relacionamento com outras áreas internas", "Crescimento de carreira",
          "Estruturação de processos do zero",
        ],
      },
      {
        id: "ja_tentou",
        label: "O que você já tentou fazer pra resolver esses desafios?",
        type: "textarea",
        placeholder: "Cursos, livros, conteúdo no LinkedIn, tentativas internas...",
        required: false,
      },
    ],
  },
  {
    id: "objetivos",
    label: "Objetivos",
    title: "Pra onde você quer ir?",
    subtitle: "Me ajuda a entender o que seria sucesso pra você.",
    fields: [
      {
        id: "objetivo_6_meses",
        label: "Qual é o seu principal objetivo profissional nos próximos 6 meses?",
        type: "textarea",
        placeholder: "Ex: Conseguir uma promoção, migrar de empresa, estruturar o CS da minha empresa...",
        required: true,
      },
      {
        id: "motivacao",
        label: "Por que agora? O que te fez buscar uma mentoria?",
        type: "textarea",
        placeholder: "Me conta o que desencadeou essa busca...",
        required: true,
      },
      {
        id: "expectativa",
        label: "O que você espera sair desse diagnóstico?",
        type: "textarea",
        placeholder: "Ex: Entender meus gaps, ter um plano de ação, clareza sobre o próximo passo...",
        required: false,
      },
      {
        id: "como_conheceu",
        label: "Como você me conheceu?",
        type: "select",
        required: false,
        options: ["LinkedIn", "Papo de CS", "Fofoca de CS (newsletter)", "Indicação de alguém", "Instagram", "Outro"],
      },
    ],
  },
];

async function submitToNotion(formData) {
  const porteMap = {
    "Startup (até 50 pessoas)": "Startup",
    "Scale-up (50 a 200 pessoas)": "Scale-up",
    "Mid-market (200 a 1000 pessoas)": "Mid-market",
    "Enterprise (mais de 1000 pessoas)": "Enterprise",
  };
  const conheceuMap = {
    "Fofoca de CS (newsletter)": "Fofoca de CS",
    "Indicação de alguém": "Indicação",
  };

  const prompt = `Use the Notion MCP to create a page in the database with data_source_id "${DATA_SOURCE_ID}".

Set these properties exactly:
- Nome (title): "${formData.nome || ""}"
- Status: "Novo"
- Email: "${formData.email || ""}"
- LinkedIn: "${formData.linkedin || ""}"
- Tempo em CS: "${formData.tempo_cs || ""}"
- Cargo Atual: "${formData.cargo_atual || ""}"
- Porte da Empresa: "${porteMap[formData.porte_empresa] || formData.porte_empresa || ""}"
- Modelo de Negócio: "${formData.modelo || ""}"
- Segmento: "${formData.segmento || ""}"
- Tamanho da Carteira: "${formData.carteira || ""}"
- Maior Desafio: "${(formData.maior_dor || "").replace(/"/g, "'")}"
- Áreas de Dificuldade: "${Array.isArray(formData.areas_dificuldade) ? formData.areas_dificuldade.join(", ") : ""}"
- Já Tentou: "${(formData.ja_tentou || "").replace(/"/g, "'")}"
- Objetivo 6 Meses: "${(formData.objetivo_6_meses || "").replace(/"/g, "'")}"
- Motivação: "${(formData.motivacao || "").replace(/"/g, "'")}"
- Expectativa: "${(formData.expectativa || "").replace(/"/g, "'")}"
- Como Conheceu: "${conheceuMap[formData.como_conheceu] || formData.como_conheceu || ""}"

Respond with only: {"success": true}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      mcp_servers: [{ type: "url", url: "https://mcp.notion.com/mcp", name: "notion-mcp" }],
    }),
  });

  if (!response.ok) throw new Error("API error");
  return true;
}

function Field({ field, value, onChange }) {
  const base = {
    width: "100%", padding: "12px 14px", borderRadius: "8px",
    border: `1.5px solid ${COLORS.border}`, fontSize: "15px",
    fontFamily: "inherit", background: COLORS.white, color: COLORS.dark,
    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  };

  if (field.type === "text" || field.type === "email") {
    return (
      <input type={field.type} placeholder={field.placeholder} value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)} style={base}
        onFocus={(e) => (e.target.style.borderColor = COLORS.terracotta)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.border)} />
    );
  }
  if (field.type === "textarea") {
    return (
      <textarea placeholder={field.placeholder} value={value || ""}
        onChange={(e) => onChange(field.id, e.target.value)} rows={4}
        style={{ ...base, resize: "vertical", lineHeight: "1.5" }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.terracotta)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.border)} />
    );
  }
  if (field.type === "select") {
    return (
      <select value={value || ""} onChange={(e) => onChange(field.id, e.target.value)}
        style={{ ...base, cursor: "pointer" }}
        onFocus={(e) => (e.target.style.borderColor = COLORS.terracotta)}
        onBlur={(e) => (e.target.style.borderColor = COLORS.border)}>
        <option value="">Selecione...</option>
        {field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }
  if (field.type === "radio") {
    return (
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
        {field.options.map((opt) => (
          <label key={opt} style={{
            display: "flex", alignItems: "center", gap: "8px", padding: "10px 18px",
            border: `1.5px solid ${value === opt ? COLORS.terracotta : COLORS.border}`,
            borderRadius: "8px", cursor: "pointer",
            background: value === opt ? "#FDF0EB" : COLORS.white,
            color: COLORS.dark, fontSize: "15px", transition: "all 0.2s", userSelect: "none",
          }}>
            <input type="radio" name={field.id} value={opt} checked={value === opt}
              onChange={() => onChange(field.id, opt)} style={{ display: "none" }} />
            {opt}
          </label>
        ))}
      </div>
    );
  }
  if (field.type === "checkbox") {
    const selected = value || [];
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {field.options.map((opt) => {
          const checked = selected.includes(opt);
          return (
            <label key={opt} style={{
              display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px",
              border: `1.5px solid ${checked ? COLORS.terracotta : COLORS.border}`,
              borderRadius: "8px", cursor: "pointer",
              background: checked ? "#FDF0EB" : COLORS.white,
              fontSize: "14px", color: COLORS.dark, transition: "all 0.2s", userSelect: "none",
            }}>
              <span style={{
                width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
                border: `2px solid ${checked ? COLORS.terracotta : COLORS.border}`,
                background: checked ? COLORS.terracotta : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s",
              }}>
                {checked && <span style={{ color: "white", fontSize: "11px", fontWeight: "bold" }}>✓</span>}
              </span>
              {opt}
              <input type="checkbox" checked={checked} onChange={() => {
                const next = checked ? selected.filter((x) => x !== opt) : [...selected, opt];
                onChange(field.id, next);
              }} style={{ display: "none" }} />
            </label>
          );
        })}
      </div>
    );
  }
  return null;
}

export default function DiagnosticoCS() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleChange = (id, val) => setFormData((prev) => ({ ...prev, [id]: val }));

  const canAdvance = () =>
    step.fields.filter((f) => f.required).every((f) => {
      const val = formData[f.id];
      if (!val) return false;
      return typeof val === "string" ? val.trim() !== "" : true;
    });

  const handleNext = async () => {
    if (isLast) {
      setLoading(true);
      setError(null);
      try {
        await submitToNotion(formData);
        setSubmitted(true);
      } catch (e) {
        setError("Ops, algo deu errado. Tenta de novo?");
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentStep((s) => s + 1);
    }
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: "100vh", background: COLORS.dark,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px 20px", fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}>
        <div style={{
          background: COLORS.cream, borderRadius: "16px", padding: "48px 40px",
          maxWidth: "520px", width: "100%", textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎯</div>
          <h2 style={{ fontSize: "26px", fontWeight: "800", color: COLORS.dark, margin: "0 0 12px" }}>
            Formulário recebido!
          </h2>
          <p style={{ color: "#555", fontSize: "16px", lineHeight: "1.6", margin: "0 0 24px" }}>
            Valeu por compartilhar tudo isso, <strong>{formData.nome?.split(" ")[0] || "aí"}</strong>. Vou analisar com cuidado e te mandar o diagnóstico com minha devolutiva em até <strong>3 dias úteis</strong>.
          </p>
          <div style={{
            background: "#FDF0EB", border: `1.5px solid ${COLORS.terracotta}`,
            borderRadius: "10px", padding: "16px 20px", marginBottom: "24px",
          }}>
            <p style={{ margin: 0, fontSize: "14px", color: COLORS.dark, lineHeight: "1.6" }}>
              📬 Fique de olho no seu e-mail. Se quiser me acionar antes, me chama no LinkedIn.
            </p>
          </div>
          <p style={{ fontSize: "13px", color: COLORS.muted, margin: 0 }}>— Bruno | Mentoria CS</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.dark, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{
        background: COLORS.terracotta, padding: "20px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "12px", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
            Bruno · Mentoria CS
          </div>
          <div style={{ color: COLORS.white, fontSize: "17px", fontWeight: "700" }}>
            Diagnóstico de Carreira CS
          </div>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.2)", borderRadius: "20px",
          padding: "4px 12px", color: COLORS.white, fontSize: "13px", fontWeight: "600",
        }}>
          {currentStep + 1} / {steps.length}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ height: "4px", background: "rgba(255,255,255,0.1)" }}>
        <div style={{
          height: "100%", width: `${progress}%`,
          background: COLORS.terracottaLight, transition: "width 0.4s ease",
        }} />
      </div>

      {/* Step tabs */}
      <div style={{
        display: "flex", background: "#252525", padding: "0 16px",
        borderBottom: "1px solid #333", overflowX: "auto",
      }}>
        {steps.map((s, i) => (
          <div key={s.id} style={{
            padding: "12px 16px", fontSize: "13px", fontWeight: "600",
            color: i === currentStep ? COLORS.terracottaLight : i < currentStep ? "#aaa" : "#555",
            borderBottom: i === currentStep ? `2px solid ${COLORS.terracottaLight}` : "2px solid transparent",
            whiteSpace: "nowrap", cursor: i < currentStep ? "pointer" : "default",
            transition: "color 0.2s",
          }} onClick={() => { if (i < currentStep) setCurrentStep(i); }}>
            {i < currentStep ? "✓ " : ""}{s.label}
          </div>
        ))}
      </div>

      {/* Form body */}
      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "32px 20px 80px" }}>
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: COLORS.cream, margin: "0 0 8px", lineHeight: "1.3" }}>
            {step.title}
          </h1>
          <p style={{ color: "#aaa", fontSize: "15px", margin: 0 }}>{step.subtitle}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {step.fields.map((field) => (
            <div key={field.id}>
              <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "600", color: COLORS.cream }}>
                {field.label}
                {field.required && <span style={{ color: COLORS.terracottaLight, marginLeft: "4px" }}>*</span>}
              </label>
              <Field field={field} value={formData[field.id]} onChange={handleChange} />
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            marginTop: "20px", padding: "12px 16px", borderRadius: "8px",
            background: "#3a1a1a", border: "1px solid #c44", color: "#ff8080", fontSize: "14px",
          }}>
            {error}
          </div>
        )}

        <div style={{
          marginTop: "40px", display: "flex",
          justifyContent: currentStep > 0 ? "space-between" : "flex-end", alignItems: "center",
        }}>
          {currentStep > 0 && (
            <button onClick={() => setCurrentStep((s) => s - 1)} style={{
              padding: "12px 24px", borderRadius: "8px", border: "1.5px solid #444",
              background: "transparent", color: "#aaa", fontSize: "15px", fontWeight: "600", cursor: "pointer",
            }}>
              ← Voltar
            </button>
          )}
          <button onClick={handleNext} disabled={!canAdvance() || loading} style={{
            padding: "14px 32px", borderRadius: "8px",
            background: canAdvance() && !loading ? COLORS.terracotta : "#444",
            color: canAdvance() && !loading ? COLORS.white : "#666",
            border: "none", fontSize: "15px", fontWeight: "700",
            cursor: canAdvance() && !loading ? "pointer" : "not-allowed", transition: "background 0.2s",
          }}>
            {loading ? "Enviando..." : isLast ? "Enviar diagnóstico →" : "Próximo →"}
          </button>
        </div>
      </div>
    </div>
  );
}
