import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default forwardRef(function PasswordInput({ className = '', ...props }, ref) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <input
                {...props}
                ref={ref}
                type={visible ? 'text' : 'password'}
                className={
                    'block w-full rounded-lg border-gray-300 pr-10 shadow-sm focus:border-brand focus:ring-brand ' +
                    className
                }
            />
            <button
                type="button"
                onClick={() => setVisible(!visible)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
            >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
});