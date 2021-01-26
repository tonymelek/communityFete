import React, { useContext, useEffect, useState } from 'react'
import API from '../../utils/API'
import AppContext from '../../utils/AppContext'


export default function GetItems() {
    const [menu, setMenu] = useState([])
    const { dispatch, state } = useContext(AppContext)
    useEffect(() => {
        if (state.token !== "") {
            API.getMenu(state.token)
                .then(res => {
                    setMenu(res.data)
                })
                .catch(err => console.log(err.response))
        }
    }, [state])
    //Build Delete Functionality to set Item as not available in the menu
    const deleteItem = (e, id) => {
        e.preventDefault();
        API.deleteMenuItem({ item_id: id }, state.token)
            .then(res => {
                setMenu(menu.map(item => {
                    if (item.id === id) {
                        item.availability = false
                    }
                    return item
                }))
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-success', text: 'Item deleted Successfully' } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })
            .catch(err => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `Error deleting Item` } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
                console.log(err.response.data);
            })
    }
    return (
        <div className="mb-10">
            <h3 className="text-center">Menu Items</h3>
            {menu.filter(meal => meal.availability).map(item => <div key={item.id} className="card m-2 p-2 d-flex flex-row flex-wap justify-content-between">
                <div>
                    <p><strong>{item.item_name}</strong> - {item.item_desc}</p>
                    <p>{item.unit}-{item.serve}-${item.price}</p>
                    <button onClick={e => deleteItem(e, item.id)} className="btn btn-danger" type="submit">Delete Item</button>
                </div>
                <div>
                    <img src={item.item_pic} height="80" alt={item.item_name} />
                </div>
            </div>)}
        </div>
    )
}


