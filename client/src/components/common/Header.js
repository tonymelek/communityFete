import React from 'react'
import { BiMenu } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { RiLogoutBoxRFill } from 'react-icons/ri'
import { useHistory } from 'react-router-dom';

export default function Header({ state, sideDisplay }) {
    const { side, setSide } = sideDisplay
    const history = useHistory()
    const handleLogout = () => {
        localStorage.removeItem('conmmFete')
        history.replace('/');

    }
    return (
        <div className="header__main ">
            <div className="d-flex justify-content-between align-items-center">
                <BiMenu className="BiMenu" onClick={() => setSide(side === 'd-none' ? 'd-block animate__animated animate__fadeInDown' : 'd-none')} />

                <div className="d-flex align-items-center justify-content-center">
                    <div className='d-flex align-items-center cursor-pointer' onClick={() => history.push(`/${state.role}`)}>
                        <FaUserCircle className="FaUserCircle" />
                        <p className="p-0 my-0 mx-2"> {state.user_email} </p>
                    </div>
                    <div className="d-flex flex-column p-1 align-items-center  justify-content-center cursor-pointer" onClick={handleLogout}>
                        <RiLogoutBoxRFill className="FaUserCircle" />
                        <p className="py-1 m-0">Logout</p>
                    </div>
                </div>
            </div>

        </div>
    )
}


