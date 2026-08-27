export default function Input({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    ...props
}) {
    return (
        <div className="mb-4">
            {label && (
                <label className="block text-sm font-medium text-text-primary mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`w-full px-4 py-3 rounded-input border bg-card text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-shadow ${
                    error
                        ? 'border-error focus:ring-error'
                        : 'border-border focus:ring-primary'
                }`}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-error">{error}</p>
            )}
        </div>
    );
}
