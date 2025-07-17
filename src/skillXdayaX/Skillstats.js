
export default function SkillStatus({ name, level }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <strong>{name}</strong> (Lv. {level}/10)
      <div style={{ background: "#ddd", width: "100%", height: "12px", marginTop: "4px" }}>
        <div
          style={{
            background: "linear-gradient(to right, #5ee7df, #b490ca)",
            width: `${(level / 10) * 100}%`,
            height: "100%",
            borderRadius: "4px",
          }}
        ></div>
      </div>
    </div>
  );
}