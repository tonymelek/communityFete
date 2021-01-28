import React from 'react'
import { FaUserCircle } from 'react-icons/fa';

export default function UserHeader({ state }) {
    return (
        <div className="header__main ">
            <div className="d-flex justify-content-end header__flex__container">
                <div className="d-flex align-items-center">
                    <FaUserCircle className="FaUserCircle" />
                    <p className="p-0 my-0 mx-2"> {state.user_email} </p>
                </div>
            </div>

        </div>
    )
}


