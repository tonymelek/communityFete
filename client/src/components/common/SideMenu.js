import React from 'react'
import './SideMenu.css'
export default function SideMenu({ side, items }) {
    return (
        <div className={`side__menu ${side.side}`}>
            {items.map(item =>
                <div key={item} className="side__menu__item py-2 px-5 m-2">
                    <a href={`#${item}`} onClick={() => side.setSide(side.side === 'd-none' ? 'd-block animate__animated animate__fadeInDown' : 'd-none')}>{item.split('-').join(' ')}</a>
                </div>
            )}

        </div >
    )
}
