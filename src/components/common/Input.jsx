import { useState } from 'react';

export default function Input({ 
    type = "text", 
    placeholder, 
    value, 
    onChange, 
    icon: Icon,
    required = false,
    label,
    step
}) {
    const [focused, setFocused] = useState(false);

    return (
        <div style={{ width: '100%' }}>
            {label && (
                <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151'
                }}>
                    {label}
                </label>
            )}
            <div style={{ position: 'relative', width: '100%' }}>
                {Icon && (
                    <Icon 
                        size={20} 
                        style={{
                            position: 'absolute',
                            left: '16px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: focused ? '#63b099' : '#94a3b8',
                            transition: 'color 0.2s'
                        }}
                    />
                )}
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    step={step}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                        width: '100%',
                        padding: Icon ? '14px 16px 14px 48px' : '14px 16px',
                        fontSize: '15px',
                        border: `2px solid ${focused ? '#63b099' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        boxSizing: 'border-box'
                    }}
                />
            </div>
        </div>
    );
}
