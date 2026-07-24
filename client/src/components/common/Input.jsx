/**
 * Reusable Input Component
 * Supports text, email, password, number, textarea, and select
 * With icon support, error states, and password toggle
 */

import { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const Input = forwardRef(({
  // Basic props
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  disabled = false,
  readOnly = false,
  
  // Styling
  className = '',
  inputClassName = '',
  labelClassName = '',
  
  // Error handling
  error = '',
  touched = false,
  success = false,
  
  // Icon
  icon: Icon,
  iconPosition = 'left',
  
  // Textarea specific
  rows = 4,
  
  // Select specific
  options = [],
  
  // Other props
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const isPassword = type === 'password';
  const isTextarea = type === 'textarea';
  const isSelect = type === 'select';
  
  // Determine input type
  const inputType = isPassword && showPassword ? 'text' : type;

  // Base input classes
  const baseInputClasses = `
    w-full 
    px-4 py-2.5 
    bg-white dark:bg-primary-900/30
    border-2 
    rounded-xl 
    text-primary-800 dark:text-primary-100
    placeholder:text-gray-400 dark:placeholder:text-gray-500
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary-500/30
    disabled:opacity-50 disabled:cursor-not-allowed
    read-only:bg-gray-50 dark:read-only:bg-primary-900/20
    ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-11' : ''}
    ${isPassword ? 'pr-11' : ''}
    ${error && touched ? 'border-red-500 focus:ring-red-500/30' : ''}
    ${success && !error ? 'border-green-500 focus:ring-green-500/30' : ''}
    ${!error && !success ? 'border-primary-200 dark:border-primary-700 focus:border-primary-500' : ''}
    ${isFocused ? 'border-primary-500' : ''}
    ${inputClassName}
  `;

  // Label classes
  const labelClasses = `
    block text-sm font-medium 
    ${error && touched ? 'text-red-500' : 'text-primary-700 dark:text-primary-300'}
    ${labelClassName}
  `;

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onBlur) onBlur(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Render textarea
  if (isTextarea) {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative mt-1.5">
          {Icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
              <Icon size={20} />
            </span>
          )}
          
          <textarea
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            rows={rows}
            disabled={disabled}
            readOnly={readOnly}
            className={baseInputClasses}
            {...props}
          />
          
          {Icon && iconPosition === 'right' && (
            <span className="absolute right-3 top-3 text-gray-400 dark:text-gray-500">
              <Icon size={20} />
            </span>
          )}
        </div>
        
        {/* Error Message */}
        {error && touched && (
          <div className="mt-1.5 flex items-start gap-1.5 text-sm text-red-500 animate-fade-up">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
        
        {/* Success Message (optional) */}
        {success && !error && touched && (
          <div className="mt-1.5 flex items-start gap-1.5 text-sm text-green-500 animate-fade-up">
            <span>✓</span>
            <span>Looks good!</span>
          </div>
        )}
      </div>
    );
  }

  // Render select
  if (isSelect) {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className={labelClasses}>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        
        <div className="relative mt-1.5">
          {Icon && iconPosition === 'left' && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              <Icon size={20} />
            </span>
          )}
          
          <select
            ref={ref}
            name={name}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            className={`
              ${baseInputClasses}
              appearance-none
              ${Icon && iconPosition === 'left' ? 'pl-11' : ''}
            `}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Custom dropdown arrow */}
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
        
        {error && touched && (
          <div className="mt-1.5 flex items-start gap-1.5 text-sm text-red-500 animate-fade-up">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }

  // Render normal input
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative mt-1.5">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Icon size={20} />
          </span>
        )}
        
        <input
          ref={ref}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          className={baseInputClasses}
          {...props}
        />
        
        {/* Password Toggle */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
        
        {/* Right Icon (non-password) */}
        {Icon && iconPosition === 'right' && !isPassword && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            <Icon size={20} />
          </span>
        )}
        
        {/* Error/Success indicator */}
        {error && touched && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <AlertCircle size={20} />
          </span>
        )}
        
        {success && !error && touched && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16.6667 5L7.5 14.1667L3.33333 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        )}
      </div>
      
      {/* Error Message */}
      {error && touched && (
        <div className="mt-1.5 flex items-start gap-1.5 text-sm text-red-500 animate-fade-up">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Success Message (optional) */}
      {success && !error && touched && (
        <div className="mt-1.5 flex items-start gap-1.5 text-sm text-green-500 animate-fade-up">
          <span>✓</span>
          <span>Looks good!</span>
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;