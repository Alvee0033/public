'use client';
import Link from 'next/link';
import { useState } from 'react';

const Button = ({
  href,
  onClick,
  variant = 'filled',
  isFullWidth = false,
  className = '',
  type = 'button',
  children,
  isLoading,
  loaderText = 'Loading...',
  enableLoader,
  colorDisabled,
  disabled,
  style,
  ...props
}) => {
  const [isHovered, setIsHovered] = useState(false);


  // Always use solid primaryColor for background
  const buttonStyle = {
    background: 'var(--primaryColor)',
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    transition:
      'transform 0.2s cubic-bezier(0.4,0,0.2,1), background 0.2s cubic-bezier(0.4,0,0.2,1)',
    ...style,
  };

  const finalClassName = `${
    isFullWidth ? 'flex w-full justify-center' : 'inline-flex'
  } items-center gap-x-2 px-8 py-2 rounded-full border transition-all duration-300 text-white ${className} ${
    !disabled ? 'active:scale-90 active:opacity-90' : ''
  } border-transparent`;

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const buttonProps = {
    className: finalClassName,
    style: buttonStyle,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    disabled,
    ...props,
  };

  if (enableLoader) {
    return (
      <button type={type} {...buttonProps}>
        {isLoading ? (
          <>
            <span className="flex w-7 animate-spin items-center justify-center">
              <span className="h-5 w-5 rounded-full border-b-2 border-t-2 border-white"></span>
            </span>
            {isLoading && loaderText}
          </>
        ) : (
          children
        )}
      </button>
    );
  }

  if (href) {
    return (
      <Link
        href={href}
        onClick={() => (typeof onClick === 'function' ? onClick() : undefined)}
        {...buttonProps}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={() => (typeof onClick === 'function' ? onClick() : undefined)}
      type={type}
      {...buttonProps}
    >
      {children}
    </button>
  );
};

export default Button;
