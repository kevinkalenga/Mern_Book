import React from 'react'

function Message({ variant, children }) {
  
     const variantClasses = {
        info: "bg-blue-100 text-blue-800 border-blue-300",
        success: "bg-green-100 text-green-800 border-green-300",
        danger: "bg-red-100 text-red-800 border-red-300",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
     }
  
    return (
    <div className={`p-4 border-l-4 rounded-md ${variantClasses[variant] || variantClasses.info}`}>
       {children}
    </div>
  )
}

export default Message;
