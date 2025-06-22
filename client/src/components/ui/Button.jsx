function Button({ children, type = 'button', variant = 'primary', ...rest }) {
  const base =
    'px-4 py-2 rounded font-semibold transition text-sm focus:outline-none';
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    success: 'bg-green-500 text-white hover:bg-green-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100'
  };

  return (
    <button type={type} className={`${base} ${variants[variant]}`} {...rest}>
      {children}
    </button>
  );
}

export default Button;