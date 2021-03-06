import React, { useContext } from 'react'
import AppContext from '../utils/AppContext';
import './Notifier.css'
export default function Notifier() {
    const { state } = useContext(AppContext);
    const display = state.display
    return (
        <div className={`notification animate__animated animate__bounceInDown  ${display.color} ${display.class}`}>
            <p className="p-3">{display.text}</p>
        </div>
    )
}


