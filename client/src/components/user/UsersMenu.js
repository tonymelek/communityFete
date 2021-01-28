import React, { useContext, useEffect, useState } from 'react'
import API from '../../utils/API'
import AppContext from '../../utils/AppContext'
import { Link, useHistory } from "react-router-dom";

export default function UsersMenu() {
    const { state, dispatch } = useContext(AppContext)
    const [menu, setMenu] = useState([])
    const history = useHistory();
    let expandShrink = ['d-none', 'd-block']
    const updatedBasket = state.basket;
    const [categories, setCategories] = useState([]);
    const expandIntSate = {}

    const [expand, setExpand] = useState(expandIntSate)
    const [tempMenu, setTempMenu] = useState([])

    useEffect(() => {
        API.getMenu_user()
            .then(res => {
                setMenu(res.data);
                setTempMenu(res.data)
            })
            .catch(err => console.log(err.response))

    }, [])

    useEffect(() => {
        let temp = [... new Set(tempMenu.map(item => item.Shop.category))]
        setCategories(temp)
        temp.forEach(category => expandIntSate[category] = 0)
    }, [tempMenu])

    const addToBasket = (e, item_id, item_name, price, shopId) => {
        let qty = parseInt(e.target.value);
        if (qty > 0) {
            updatedBasket[item_id] = { qty, item_name, price, shopId }
        } else {
            e.target.value = 0
            qty = 0
            delete updatedBasket[item_id]

        }
        dispatch({ type: 'updateBasket', basket: updatedBasket })
    }
    const handleTransfer = (e) => {
        e.preventDefault();
        if (Object.keys(state.basket).length === 0) {
            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `You need to have at least one item in basket to proceed` } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);
            return
        }
        history.push('/checkout')
    }
    const handleSearch = e => {
        e.preventDefault();
        const searchText = e.target['search-item'].value.trim().toLowerCase();
        setTempMenu(menu.filter(item => item.item_name.toLowerCase().includes(searchText)))
    }
    const handleEmpty = e => {
        e.preventDefault();
        if (e.target.value.trim() === "") {
            setTempMenu(menu)
        }
    }
    return (
        <div className="user__menu__main px-4 ">

            <form autocomplete="off" onSubmit={e => handleSearch(e)} >
                <div className="form-group my-2 pt-3">
                    <label htmlFor="search-item">Search Item</label>
                    <input type="text" name="search-item" id="search-item" className="form-control" onChange={e => handleEmpty(e)} />
                </div>
            </form>
            <hr />
            <div className="d-flex flex-column justify-content-between">
                <div className="user__menu__items" >
                    {categories.map(category => <div key={category}>
                        <div className={`card  bg-dark my-2 p-2   text-light cursor-pointer`} onClick={() => setExpand({ ...expand, [category]: !expand[category] })}><h5>{category}</h5></div>
                        {tempMenu.filter(items => items.Shop.category === category).map(item => <div key={item.id} className={`card  my-2 p-2 d-flex flex-row flex-wap justify-content-between animate__animated   animate__zoomIn ${expandShrink[expand[category] ? 1 : 0]}`}>
                            <div>
                                <p className="my-1"><strong>{item.item_name}</strong>-{item.serve}</p>
                                <p className="my-1">{item.item_desc}</p>
                                <p className="my-2">({item.unit}) ${item.price}</p>
                        Qty<input type="number" onChange={e => addToBasket(e, item.id, item.item_name, item.price, item.ShopId)} className="form-control w-50" />
                            </div>
                            <div>
                                <img src={item.item_pic} width="100" alt={item.item_name} />
                            </div>
                        </div>)}
                    </div>)}
                </div>

                <div>
                    <button type="submit" onClick={e => handleTransfer(e)} className="btn btn-success w-100 mb-3">Check out</button>
                </div>
            </div>
        </div>
    )
}


