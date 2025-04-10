const SelectField = ({ id, options, label }) => {
  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <select id={id}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
