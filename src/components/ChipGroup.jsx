// Grupo de chips clicáveis. Cada chip é um botão de alternância (aria-pressed).
// multiple=false: escolha única (value é string). multiple=true: vários (value é array).
export default function ChipGroup({ options, value, onChange, multiple = false, labelledBy }) {
  function toggle(id) {
    if (!multiple) return onChange(id);
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  return (
    <div className="chips" role="group" aria-labelledby={labelledBy}>
      {options.map(({ id, label }) => {
        const pressed = multiple ? value.includes(id) : value === id;
        return (
          <button key={id} type="button" className="chip" aria-pressed={pressed} onClick={() => toggle(id)}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
