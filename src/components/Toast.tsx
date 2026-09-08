import { useEffect, useState } from 'react';

export type ToastType = 'info' | 'success' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300); // Dar tiempo para la animación de salida
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColors = {
    info: '#1A1A1A',
    success: '#2dd36f',
    warning: '#ffc409'
  };
  
  const textColors = {
    info: '#fff',
    success: '#fff',
    warning: '#000'
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? '0' : '100px'})`,
        opacity: visible ? 1 : 0,
        backgroundColor: bgColors[type],
        color: textColors[type],
        padding: '12px 24px',
        borderRadius: '24px',
        fontFamily: 'Outfit, sans-serif',
        fontSize: '14px',
        fontWeight: 500,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        zIndex: 10000,
        pointerEvents: 'none'
      }}
    >
      {message}
    </div>
  );
}
