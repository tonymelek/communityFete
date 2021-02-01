import React, { useEffect, useState } from 'react'
import { FcShop } from 'react-icons/fc';
import { FaUsers } from 'react-icons/fa'
import { RiAdminLine } from 'react-icons/ri'
import API from '../../utils/API';
import { useHistory } from 'react-router-dom';
export default function AdminFooter({ state }) {
    const [details, setDetails] = useState({})
    const history = useHistory();
    useEffect(() => {
        if (state.token.length < 20) {
            return
        }
        API.getAdminFooter(state.token)
            .then(res => {
                setDetails(res.data)

            })
    }, [state])
    const handleCreateAdmin = () => {
        history.push('/create-admin')
    }
    return (
        <div className="merchant__footer__main py-2">

            <div className="d-flex justify-content-around">
                <div className="d-flex flex-column align-items-center">
                    <FcShop className="FcShop" />
                    <p className="p-0 my-0 mx-2"><strong>{details.shops} </strong> </p>

                </div>
                <div className="d-flex flex-column align-items-center">
                    <FaUsers className="GrDocumentTime " />
                    <p className="p-0 my-0 mx-2"> <strong> {details.users}</strong> </p>
                </div>
                <div className="d-flex flex-column align-items-center" onClick={handleCreateAdmin}>
                    <RiAdminLine className="AiOutlineDollar" />
                    <p className="p-0 my-0 mx-2">Create Admin </p>
                </div>
            </div>
        </div>
    )
}


