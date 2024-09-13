import React, { useEffect, useState } from 'react'

function Toast({show = false, message, type = 'info', duration = 10000}) {
    const [visible, setVisible] = useState(show)

    useEffect(() => {
        if (!show) return
        
        const timer = setTimeout(() => setVisible(false), duration)
        
        return () => clearTimeout(timer)
    }, [show, duration])

    useEffect(() => {
        setVisible(show)
    }, [show])

    if (!visible) return null

    const baseStyles = "absolute top-20 left-48 z-50 flex items-center justify-evenly p-2 rounded-lg text-center";
    
    let toastStyles = '';
    switch (type) {
        case 'success':
            toastStyles = 'bg-green-300 text-green-800';
            break;
        case 'warning':
            toastStyles = 'bg-yellow-300 text-yellow-800';
            break;
        case 'error':
            toastStyles = 'bg-red-300 text-red-800';
            break;
        default:
            toastStyles = 'bg-blue-300 text-blue-800';
            break;
    }

    return (
        <div className={`${baseStyles} ${toastStyles}`}>
            {message}
            <button className="ml-2 bg-orange-700 w-6 h-6 rounded-full text-white " onClick={() => setVisible(false)}>X</button>
        </div>
    );
}


export default Toast
