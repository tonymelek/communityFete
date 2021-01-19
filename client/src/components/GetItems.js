import React, { useContext, useEffect, useState } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext'

export default function GetItems() {
    const [menu, setMenu] = useState([])
    const { state } = useContext(AppContext)
    useEffect(() => {
        API.getMenu(state.token)
            .then(res => {
                setMenu(res.data)
            })
            .catch(err => console.log(err.response))

    }, [state.refreshAPI])
    //Build Delete Functionality to set Item as not available in the menu
    return (
        <div>
            <h3 className="text-center">Menu Items</h3>
            {menu.map(item => <div key={item.id} className="card my-2 p-2 d-flex flex-row flex-wap justify-content-between">
                <div>
                    <p><strong>{item.item_name}</strong></p>
                    <p>{item.item_desc}</p>
                    <p>{item.unit}-{item.serve}-${item.price}</p>
                    <button className="btn btn-danger" type="submit">Delete Item</button>
                </div>
                <div>
                    <img src={item.item_pic} height="150" alt={item.item_name} />
                </div>
            </div>)}
        </div>
    )
}


