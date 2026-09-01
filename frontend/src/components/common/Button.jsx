export default function Button({
    children,
    variant = 'primary',
    fullWidth = false,
    loading = false,
    onClick,
    ...props
}) {
    const baseClasses = 'flex items-center justify-center px-6 py-3 rounded-btn font-medium font-body transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

    const variants = {
        primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:brightness-110 focus:ring-primary',
        secondary: 'bg-secondary text-white hover:brightness-110 focus:ring-secondary',
        danger: 'bg-error text-white hover:brightness-110 focus:ring-error'
    };

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className={`${baseClasses} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            {...props}
        >
            {loading ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>
            ) : null}
            {children}
        </button>
    );
}
