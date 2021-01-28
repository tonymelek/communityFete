import React, { useEffect, useState } from 'react'
import { BiMenu } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';

export default function Header({ state, sideDisplay }) {
    const { side, setSide } = sideDisplay
    return (
        <div className="header__main ">
            <div className="d-flex justify-content-between align-items-center">
                <BiMenu className="BiMenu" onClick={() => setSide(side === 'd-none' ? 'd-block animate__animated animate__fadeInDown' : 'd-none')} />

                <div className="d-flex align-items-center">
                    <FaUserCircle className="FaUserCircle" />
                    <p className="p-0 my-0 mx-2"> {state.user_email} </p>
                </div>
            </div>

        </div>
    )
}


