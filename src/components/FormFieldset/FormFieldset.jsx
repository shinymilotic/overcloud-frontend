function FormFieldset({
  key,
  autoFocus,
  children,
  handler,
  minLength,
  name,
  normal,
  placeholder,
  required,
  type,
  value,
  keydownHandler
}) {
  return (
    <fieldset className="form-group">
      <input
        key={key}
        autoFocus={autoFocus}
        className={`form-control ${normal ? "" : "form-control-lg"}`}
        minLength={minLength}
        name={name}
        onChange={handler}
        placeholder={placeholder}
        required={required}
        type={type}
        value={value}
        onKeyDown={keydownHandler}
      />
      {children}
    </fieldset>
  );
}

export default FormFieldset;
