import { ButtonHTMLAttributes } from 'react';

type IconButtonProps = Readonly<{
  children: React.ReactNode;
  title?: string;
  ariaLabel?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> &
  ButtonHTMLAttributes<HTMLButtonElement>;

export function IconButton({ children, title, ariaLabel, onClick, disabled, className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      className={`w-10 h-10 flex items-center justify-center rounded hover:bg-surface-alt ${className} ${
        disabled ? 'text-text-weak cursor-not-allowed' : 'text-text-default hover:text-text-strong'
      }`}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      {...props}
    >
      <div className="w-6 h-6">{children}</div>
    </button>
  );
}
