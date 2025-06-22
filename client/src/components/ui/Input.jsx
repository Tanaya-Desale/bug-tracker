function Input({ type = 'text', value, onChange, placeholder, name, ...rest }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      {...rest}
    />
  );
}

export default Input;