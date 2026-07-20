/**
 * Reusable Button Component
 * @todo Add loading state
 * @todo Add different sizes (sm, md, lg)
 * @todo Add different variants (primary, secondary, danger, success)
 */

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg',
    secondary: 'bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400 hover:shadow-md',
    danger: 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg',
    success: 'bg-green-600 text-white hover:bg-green-700 hover:shadow-lg',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={classes}
      {...props}
    >
      {loading && (
        <span className="animate-spin rounded-full border-2 border-white border-t-transparent w-4 h-4" />
      )}
      {children}
    </button>
  );
};

export default Button;