export default function Alert({ type = 'info', message }) {
    const variants = {
        success: 'bg-green-100 border-green-400 text-green-800',
        error: 'bg-error/10 border-error text-error',
        info: 'bg-blue-100 border-info text-blue-800',
        warning: 'bg-accent/10 border-accent text-amber-800'
    };

    if (!message) return null;

    return (
        <div className={`p-3 mb-4 rounded-input border ${variants[type]} text-sm`}>
            {message}
        </div>
    );
}
