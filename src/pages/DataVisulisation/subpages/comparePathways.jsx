import React, { useEffect, useMemo, useState } from "react";
import * as XLSX from "xlsx";

const API_BASE = "https://entyre-backend.onrender.com";

const SCENARIOS = [
  "Econ_G",
  "Econ_L",
  "Enviro_G",
  "Enviro_L",
  "Tech_G",
  "Tech_L",
  "Equal_G",
  "Equal_L",
  "Hier_G",
  "Hier_L",
];

const SCENARIO_NAMES = {
  Econ_G: "Global Economic",
  Econ_L: "Local Economic",
  Enviro_G: "Global Environmental",
  Enviro_L: "Local Environmental",
  Tech_G: "Global Technological",
  Tech_L: "Local Technological",
  Equal_G: "Global Equality",
  Equal_L: "Local Equality",
  Hier_G: "Global Hierarchy",
  Hier_L: "Local Hierarchy",
};

const SCENARIO_DESCRIPTIONS = {
  Econ_G:
    "Global scenario with economic-focused weights, prioritising cost, revenue, and financial return indicators.",
  Econ_L:
    "Local scenario with economic-focused weights, optimised for regional cost, revenue, and local economic benefits.",
  Enviro_G:
    "Global scenario with environmental-focused weights, prioritising global climate impact, emissions reduction, and resource conservation.",
  Enviro_L:
    "Local scenario with environmental-focused weights, targeting local pollution control, ecosystem protection, and resource efficiency.",
  Tech_G:
    "Global scenario with technology-focused weights, favouring innovation level, technical readiness, and global scalability.",
  Tech_L:
    "Local scenario with technology-focused weights, favouring locally applicable technologies and ease of implementation in regional contexts.",
  Equal_G:
    "Global scenario with equal weights for all indicators, treating economic, environmental, and technical criteria as equally important.",
  Equal_L:
    "Local scenario with equal weights for all indicators, treating economic, environmental, and technical criteria as equally important within the local context.",
  Hier_G:
    "Global scenario with hierarchical weighting, where some criteria are prioritised over others based on structured global decision rules.",
  Hier_L:
    "Local scenario with hierarchical weighting, where some criteria are prioritised over others based on structured local decision rules.",
};

const PATHWAY_NAME_MAP = {
  "rCB from Pyrolysis": "pyrolysis-rcb",
  "SAF from Pyrolysis": "pyrolysis-saf",
  "Devulcanisation": "thermo-mechanical-devulcanisation",
  "Crumb Rubber-1": "crumb-rubber-concrete",
  "Crumb rubber-2": "rubberised-Asphalt",
  "ELT in Power Plant": "energy-recovery-cement-kiln",
  "ELT in Cement kiln": "energy-recovery-power-plant",
};

const PATHWAY_NAME_EXPLANATIONS = {
  "Crumb Rubber-1": "Crumb Rubber-1 = Crumb rubber in crumb rubber concrete",
  "Crumb rubber-2": "Crumb Rubber-2 = Crumb rubber in rubberised asphalt",
};

function getRealPathwayName(displayName) {
  return PATHWAY_NAME_MAP[displayName] || displayName;
}

function findFileForScenario(excelFiles, scenarioId) {
  if (!Array.isArray(excelFiles) || !excelFiles.length || !scenarioId)
    return null;

  const [themeRaw, scopeRaw] = String(scenarioId).split("_");
  const theme = themeRaw?.trim().toLowerCase();
  const scope = scopeRaw?.trim().toLowerCase();

  const themeMap = {
    econ: "econ",
    enviro: "enviro",
    tech: "tech",
    equal: "equal",
    hier: "hier",
  };

  const scopeMap = {
    g: "global",
    l: "local",
  };

  const targetScenarioType = themeMap[theme];
  const targetScopeType = scopeMap[scope];

  let candidate = excelFiles.find(
    (file) =>
      file.isActive &&
      file.scenarioType === targetScenarioType &&
      file.scopeType === targetScopeType
  );
  if (candidate) {
    return candidate;
  }

  candidate = excelFiles.find(
    (file) =>
      file.isActive &&
      file.scenarioType === targetScenarioType &&
      (file.scopeType === "unknown" || !file.scopeType)
  );
  if (candidate) {
    return candidate;
  }

  candidate = excelFiles.find(
    (file) =>
      file.isActive &&
      (file.scenarioType === "unknown" || !file.scenarioType) &&
      file.scopeType === targetScopeType
  );
  if (candidate) {
    return candidate;
  }

  candidate = excelFiles.find(
    (file) =>
      file.isActive &&
      file.scenarioType === targetScenarioType &&
      (file.scopeType === "global" || file.scopeType === "local")
  );
  if (candidate) {
    return candidate;
  }
  // 再找所有类型匹配的
  candidate = excelFiles.find(
    (file) => file.isActive && file.scenarioType === targetScenarioType
  );
  if (candidate) {
    return candidate;
  }

  const themePatterns = {
    econ: ["econ", "economic"],
    enviro: ["enviro", "environmental", "env"],
    tech: ["tech", "technical"],
    equal: ["equal"],
    hier: ["hier", "hierarchy"],
  };

  const scopePatterns = {
    g: [
      "_g_",
      "_g.",
      "_global",
      "global",
      /[_\s]g[_\s\.]/,
      /[_\s]g$/,
    ],
    l: [
      "_l_",
      "_l.",
      "_local",
      "local",
      /[_\s]l[_\s\.]/,
      /[_\s]l$/,
    ],
  };

  const themeKeys = themePatterns[theme] || [theme || ""];
  const scopeKeys = scopePatterns[scope] || [];

  const nameMatches = excelFiles.filter((file) => {
    if (!file.isActive) return false;
    const fileName = (file.originalName || file.title || "").toLowerCase();

    const hitTheme = themeKeys.some((k) => {
      if (typeof k === "string") {
        return fileName.includes(k);
      }
      return false;
    });

    const hitScope =
      scopeKeys.length > 0 &&
      scopeKeys.some((k) => {
        if (typeof k === "string") {
          return fileName.includes(k);
        } else if (k instanceof RegExp) {
          return k.test(fileName);
        }
        return false;
      });

    return hitTheme && hitScope;
  });

  if (nameMatches.length > 0) {
    nameMatches.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return nameMatches[0];
  }

  const themeOnlyMatches = excelFiles.filter((file) => {
    if (!file.isActive) return false;
    const fileName = (file.originalName || file.title || "").toLowerCase();
    return themeKeys.some((k) => {
      if (typeof k === "string") {
        return fileName.includes(k);
      }
      return false;
    });
  });
  if (themeOnlyMatches.length > 0) {
    themeOnlyMatches.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    return themeOnlyMatches[0];
  }

  return null;
}

function computeWeightedSumFromExcelBuffer(arrayBuffer) {
  const wb = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = wb.SheetNames[0];
  const ws = wb.Sheets[firstSheetName];

  const aoa = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: null,
    raw: true,
  });
  if (!Array.isArray(aoa) || aoa.length < 4) return { alternatives: [] };

  const headerRow = aoa[2] || [];
  if (headerRow.length < 2) return { alternatives: [] };

  const criteriaLabels = headerRow.slice(1, -1).map((c, i) => {
    const s = (c ?? "").toString().trim();
    return s || `Criterion ${i + 1}`;
  });

  const weightsRowIndex = aoa.findIndex(
    (row) => (row?.[0] ?? "").toString().trim() === "Criteria Weight"
  );
  if (weightsRowIndex === -1) return { alternatives: [] };

  const weightsRow = aoa[weightsRowIndex] || [];
  const rawWeights = criteriaLabels.map((_, idx) => {
    const v = parseFloat(weightsRow[idx + 1]);
    return Number.isFinite(v) ? v : 0;
  });
  const sumW = rawWeights.reduce((a, b) => a + b, 0);
  const weights = rawWeights.map((w) => (sumW > 0 ? w / sumW : 0));

  const dataRows = aoa.slice(3, weightsRowIndex);

  const alternatives = [];
  dataRows.forEach((row, rIdx) => {
    const nameCell = row?.[0];
    const name = (nameCell ?? "").toString().trim();
    if (!name) return;

    const values = criteriaLabels.map((_, idx) => {
      const v = parseFloat(row[idx + 1]);
      return Number.isFinite(v) ? v : 0;
    });

    let total = 0;
    const parts = criteriaLabels.map((label, i) => {
      const contrib = values[i] * (weights[i] || 0);
      total += contrib;
      return { label, value: contrib, raw: values[i], weight: weights[i] };
    });

    alternatives.push({ name, total, parts });
  });

  alternatives.sort((a, b) => b.total - a.total);
  return { alternatives };
}

function getPathwayExplorerLink(pathwayName) {
  const realName = getRealPathwayName(pathwayName);
  const slug = slugify(realName);
  return `#/pathway-explorer/${encodeURIComponent(slug)}`;
}

function slugify(s) {
  return String(s || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function BarChartLarge({ data, selected, onSelect, onViewWorkflow }) {
  if (!data || !data.length) return null;
  const safeTotals = data.map((d) => (Number.isFinite(d.total) ? d.total : 0));
  const max = Math.max(0, ...safeTotals);

  const maxRankLen = data.reduce((acc, d) => {
    const rankStr = d.rank ? `${d.rank}. ` : "";
    return Math.max(acc, rankStr.length);
  }, 0);

  const NAME_WIDTH = 180;
  const FONT_SIZE = 15;
  const CHAR_WIDTH = FONT_SIZE * 0.2;
  const RANK_PREFIX_WIDTH = maxRankLen * CHAR_WIDTH;
  const PATHWAY_NAME_WIDTH = NAME_WIDTH - RANK_PREFIX_WIDTH;

  return (
    <div style={{ width: 700, margin: "0 auto" }}>
      {data.map((d) => {
        const isChecked = selected.includes(d.name);
        const total = Number.isFinite(d.total) ? d.total : 0;
        const barWidth = max > 0 ? (total / max) * 300 : 0;
        return (
          <div
            key={d.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
              fontSize: 15,
              background: isChecked ? "#eaf1fb" : undefined,
              borderRadius: 8,
              padding: "6px 8px",
            }}
          >
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => onSelect(d.name)}
              style={{ width: 18, height: 18, accentColor: "#2563eb" }}
              aria-label={`Select ${d.name}`}
            />

            <div
              title={d.name}
              style={{
                fontWeight: 600,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: NAME_WIDTH,
                minWidth: NAME_WIDTH,
                maxWidth: NAME_WIDTH,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: RANK_PREFIX_WIDTH,
                  minWidth: RANK_PREFIX_WIDTH,
                  textAlign: "right",
                  marginRight: 2,
                  color: "#64748b",
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.5px",
                }}
              >
                {d.rank ? `${d.rank}.` : ""}
              </span>
              <span
                style={{
                  display: "inline-block",
                  width: PATHWAY_NAME_WIDTH,
                  minWidth: PATHWAY_NAME_WIDTH,
                  maxWidth: PATHWAY_NAME_WIDTH,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  verticalAlign: "middle",
                }}
                title={
                  d.name in PATHWAY_NAME_EXPLANATIONS
                    ? PATHWAY_NAME_EXPLANATIONS[d.name]
                    : undefined
                }
              >
                {d.name}
                {d.name in PATHWAY_NAME_EXPLANATIONS && (
                  <span
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginLeft: 4,
                      verticalAlign: "super",
                    }}
                    title={PATHWAY_NAME_EXPLANATIONS[d.name]}
                  >
                    *
                  </span>
                )}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                minWidth: 100,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div
                style={{
                  height: 18,
                  borderRadius: 6,
                  background: "#60a5fa",
                  width: barWidth,
                  minWidth: 2,
                  position: "relative",
                  transition: "width 0.3s",
                }}
                aria-label={`Score bar for ${d.name}`}
              />
              <span
                style={{
                  fontSize: 13,
                  color: "#333",
                  minWidth: 56,
                  textAlign: "right",
                  display: "inline-block",
                }}
                title={`Total score: ${total}`}
              >
                {total.toFixed(3)}
              </span>
            </div>

            <div style={{ alignSelf: "start" }}>
              {isChecked && (
                <a
                  href={getPathwayExplorerLink(d.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: "6px 10px",
                    borderRadius: 6,
                    border: "1px solid #cbd5e1",
                    background: "#fff",
                    cursor: "pointer",
                    fontSize: 13,
                    textDecoration: "none",
                    color: "#2563eb",
                    display: "inline-block",
                  }}
                  onClick={() => onViewWorkflow?.(d.name)}
                >
                  View Workflow
                </a>
              )}
            </div>
          </div>
        );
      })}
      <div style={{ fontSize: 14, color: "#64748b", marginTop: 10 }}>
        <span>
          <span style={{ fontWeight: 600 }}>
            Note:
          </span>
          Crumb Rubber-1 = Crumb rubber in Crumb Rubber Concrete; Crumb Rubber-2 = Crumb rubber in Rubberised Asphalt
        </span>
      </div>
    </div>
  );
}

function AnalysisPanel({ ranking, selected }) {
  const selectedItems = useMemo(
    () => ranking.filter((r) => selected.includes(r.name)),
    [ranking, selected]
  );

  if (!selectedItems.length) return null;

  return (
    <div
      style={{
        border: "1px solid #e5e5e5",
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        background: "#fafafa",
      }}
    >
      <h4 style={{ margin: "0 0 8px" }}>Selected Pathways — Quick Analysis</h4>
      <div style={{ fontSize: 14, color: "#475569", marginBottom: 14 }}>
        The numbers in brackets represent the weighted contributions of each indicator to the overall score. A higher value means that criterion had more influence on the ranking.
      </div>
      <div style={{ display: "grid", gap: 12 }}>
        {selectedItems.map((item) => {
          const topParts = [...(item.parts || [])]
            .sort((a, b) => (b?.value || 0) - (a?.value || 0))
            .slice(0, 3);

          const lines = topParts.map((p) => {
            return `${p.label} (${p.value.toFixed(2)})`;
          });

          const summary =
            topParts.length === 0
              ? `${item.name} ranks #${item.rank}.`
              : `${item.name} ranks #${item.rank}, mainly driven by ${lines.join(
                  ", "
                )}.`;

          return (
            <div
              key={item.name}
              style={{
                border: "1px solid #eee",
                borderRadius: 10,
                padding: 12,
                background: "#fff",
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: 6 }}>
                #{item.rank} · {item.name}
              </div>
              <div style={{ fontSize: 14, color: "#374151" }}>{summary}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ComparePathways() {
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0]);
  const [selected, setSelected] = useState([]);
  const [excelFiles, setExcelFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scenarioGroups = useMemo(
    () => ({
      Global: SCENARIOS.filter((id) => id.endsWith("_G")),
      Local: SCENARIOS.filter((id) => id.endsWith("_L")),
    }),
    []
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setError("");
        setLoading(true);

        const r = await fetch(
          `${API_BASE}/api/excel-files?active=true`,
          { mode: "cors" }
        );
        if (!r.ok) {
          const msg = await r.text().catch(() => "");
          throw new Error(`Failed to fetch files: HTTP ${r.status} ${msg}`);
        }

        const files = await r.json();
        if (!Array.isArray(files)) {
          throw new Error("Invalid response format from server");
        }

        if (!cancelled) setExcelFiles(files);
      } catch (e) {
        if (!cancelled)
          setError(`Failed to load files: ${e?.message || String(e)}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!excelFiles.length) return;

      try {
        setError("");
        setLoading(true);

        const targetFile = findFileForScenario(excelFiles, scenarioId);
        setCurrentFile(targetFile);

        if (!targetFile) {
          throw new Error(
            `No matching file found for scenario "${scenarioId}"`
          );
        }

        const resp = await fetch(targetFile.fileUrl, { mode: "cors" });
        if (!resp.ok) {
          const msg = await resp.text().catch(() => "");
          throw new Error(
            `Failed to download file: HTTP ${resp.status} ${msg}`
          );
        }

        const buf = await resp.arrayBuffer();
        const result = computeWeightedSumFromExcelBuffer(buf);

        setSelected([]);
        if (!cancelled) setRaw(result);
      } catch (e) {
        if (!cancelled) setRaw(null);
        if (!cancelled)
          setError(`Failed to process data: ${e?.message || String(e)}`);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scenarioId, excelFiles]);

  const ranking = useMemo(() => {
    const alts = Array.isArray(raw?.alternatives) ? raw.alternatives : [];
    return alts.map((a, i) => ({
      name: a?.name ?? `Alternative ${i + 1}`,
      total: Number.isFinite(a?.total) ? a.total : 0,
      parts: Array.isArray(a?.parts) ? a.parts : [],
      rank: i + 1,
    }));
  }, [raw]);

  const handleSelect = (name) => {
    setSelected((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : prev.length >= 3
        ? [...prev.slice(1), name]
        : [...prev, name]
    );
  };

  const openWorkflow = (name) => {
    const realName = getRealPathwayName(name);
    window.dispatchEvent(
      new CustomEvent("mcda:selectPathway", { detail: { name: realName } })
    );
  };

  const scenarioDescription = SCENARIO_DESCRIPTIONS[scenarioId] || "";
  const scenarioName = SCENARIO_NAMES[scenarioId] || scenarioId;

  function InfoNotice() {
    return (
      <div
        style={{
          background: "#e0f2fe",
          border: "1px solid #bae6fd",
          borderRadius: 8,
          padding: "14px 18px",
          marginBottom: 18,
          fontSize: 16,
          color: "#0c4a6e",
          lineHeight: 1.7,
        }}
      >
        <div>
          This page displays pathway rankings using the{" "}
          <strong>Weighted Sum Method (WSM)</strong>. Indicator weights are
          preset according to the selected scenario. To customize weights, visit
          the
          <a
            href="#/data-visualisation/mcda"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              margin: "0 4px",
            }}
            rel="noopener noreferrer"
          >
            MCDA Tool
          </a>
          page. For detailed instructions, see the
          <a
            href="#/data-visualisation/manual"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              margin: "0 4px",
            }}
            rel="noopener noreferrer"
          >
            User Guide
          </a>
          .
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 12px" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 10 }}>
        Pathway Rankings
      </h2>

      <InfoNotice />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          margin: "0 0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontWeight: 600,
              color: "#2563eb",
              marginRight: 4,
            }}
          >
            Global:
          </span>
          {scenarioGroups.Global.map((id) => (
            <button
              key={id}
              onClick={() => {
                setScenarioId(id);
              }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: scenarioId === id ? 600 : 400,
              }}
              title={SCENARIO_DESCRIPTIONS[id]}
            >
              {id.replace("_G", "")}
            </button>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginLeft: 24,
          }}
        >
          <span
            style={{
              fontWeight: 600,
              color: "#f59e42",
              marginRight: 4,
            }}
          >
            Local:
          </span>
          {scenarioGroups.Local.map((id) => (
            <button
              key={id}
              onClick={() => {
                setScenarioId(id);
              }}
              aria-pressed={scenarioId === id}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid #bbb",
                background: scenarioId === id ? "#eef3fb" : "#fff",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: scenarioId === id ? 600 : 400,
              }}
              title={SCENARIO_DESCRIPTIONS[id]}
            >
              {id.replace("_L", "")}
            </button>
          ))}
        </div>
      </div>

      {scenarioDescription && (
        <div
          style={{
            background: "#f3f4f6",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "12px 18px",
            marginBottom: 18,
            fontSize: 16,
            color: "#374151",
          }}
        >
          <strong>{scenarioName}: </strong>
          <span>{scenarioDescription}</span>
        </div>
      )}
      
      {loading && (
        <div style={{ fontSize: 14, color: "#555", marginBottom: 8 }}>
          Loading...
        </div>
      )}

      {error && (
        <div
          style={{
            color: "#b91c1c",
            fontSize: 14,
            marginBottom: 8,
            background: "#fef2f2",
            padding: "12px",
            borderRadius: 8,
            border: "1px solid #fecaca",
          }}
        >
          <strong>Error:</strong> {error}
          {excelFiles.length > 0 && (
            <details style={{ marginTop: 8 }}>
              <summary
                style={{ cursor: "pointer", color: "#2563eb" }}
              >
                Available files ({excelFiles.length})
              </summary>
              <ul style={{ marginTop: 6, fontSize: 12 }}>
                {excelFiles.map((f) => (
                  <li
                    key={f._id}
                    style={{
                      fontFamily: "monospace",
                      margin: "2px 0",
                    }}
                  >
                    {f.originalName} ({f.scenarioType}-{f.scopeType}) -{" "}
                    {f.isActive ? "Active" : "Inactive"}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      {!loading && !error && ranking.length > 0 && (
        <div
          style={{
            border: "1px solid #e5e5e5",
            borderRadius: 12,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <h3 style={{ margin: 0, fontSize: 19 }}>
              Top pathways (Weighted Sum)
            </h3>
            <span style={{ fontSize: 15, color: "#666" }}>
              Select up to 3 to highlight
            </span>
          </div>

          <BarChartLarge
            data={ranking.slice(0, 8)}
            selected={selected}
            onSelect={handleSelect}
            onViewWorkflow={(name) => openWorkflow(name)}
          />
        </div>
      )}

      <AnalysisPanel ranking={ranking} selected={selected} />
    </div>
  );
}