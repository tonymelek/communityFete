import React from 'react'

export default function Notifier({ display }) {
    return (
        <div className={`notification animate__animated animate__bounceInDown  ${display.color} ${display.class}`}>
            <p className="p-3">{display.text}</p>
        </div>
    )
}


