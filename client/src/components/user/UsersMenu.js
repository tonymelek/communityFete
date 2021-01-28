import React, { useContext, useEffect, useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import API from '../../utils/API';
import AppContext from '../../utils/AppContext'

export default function UsersMenu({ history }) {
    const { dispatch, state } = useContext(AppContext);
    const [menu, setMenu] = useState([])
    const getItemsForCategory = (item = '') => [... new Set(menu.filter(element => element.item_name.toLowerCase().includes(item)).map(item => item.Shop.category))]
    let expandShrink = ['d-none', 'd-block']
    const updatedBasket = state.basket;
    const [search, setSearch] = useState('')
    const [categories, setCategories] = useState([])

    useEffect(() => {
        API.getMenu_user()
            .then(res => {
                setMenu(res.data.map(item => { return { ...item, expand: false, qty: 0 } }))
                setCategories([... new Set(res.data.filter(element => element.item_name.toLowerCase()).map(item => item.Shop.category))])
            })
            .catch(err => console.log(err.response))
    }, [])


    const addToBasket = (e, item) => {
        const { id, item_name, price, ShopId } = item
        let qty = parseInt(e.target.value);
        setMenu(menu.map(item => item.id === id ? { ...item, qty: qty } : item))
        if (qty > 0) {
            updatedBasket[id] = { qty, item_name, price, ShopId }
        } else {
            setMenu(menu.map(item => item.id === id ? { ...item, qty: 0 } : item))
            delete updatedBasket[id]
        }
        dispatch({ type: 'updateBasket', basket: updatedBasket })
    }
    const changeQty = (id, action) => {
        setMenu(menu.map(item => {
            if (item.id === id) {
                let tempItem = { ...item, qty: action === "+" ? item.qty + 1 : item.qty - 1 }
                if (tempItem.qty > 0) {
                    updatedBasket[id] = { qty: tempItem.qty, item_name: tempItem.item_name, price: tempItem.price, ShopId: tempItem.ShopId }
                    return tempItem
                } else {
                    tempItem = { ...item, qty: 0 }
                    delete updatedBasket[id]
                    return tempItem
                }

            }
            else {
                return item
            }

        }))
        console.log(menu);
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
    }

    return (
        <div className="user__menu__main px-4 ">

            <form autoComplete="off" onSubmit={e => handleSearch(e)} >
                <div className="form-group my-2 pt-3 d-flex align-items-end" >
                    <div className="flex-grow-1  mx-2" >
                        <label htmlFor="search-item">Filter Items</label>
                        <input type="text" name="search-item" value={search} id="search-item" className="form-control" onChange={(e) => {
                            setSearch(e.target.value.trim().toLowerCase())
                            setCategories(getItemsForCategory(e.target.value))

                        }} />
                    </div>
                    <button className="btn btn-primary mx-2" type="submit"><BiSearch /></button>
                </div>
            </form>
            <hr />
            <div className="d-flex flex-column justify-content-between">
                <div className="user__menu__items" >

                    {categories.map(category => <div key={category}>
                        <div className={`card  bg-dark my-2 p-2   text-light cursor-pointer`} onClick={() => {
                            setMenu(menu.map(item => item.Shop.category === category ? { ...item, expand: !item.expand } : item))

                        }} ><h5>{category}</h5></div>

                        {menu.filter(element => element.item_name.toLowerCase().includes(search)).filter(items => items.Shop.category === category).map(item => <div key={item.id} className={`card  my-2 p-2 d-flex flex-row flex-wap justify-content-between animate__animated   animate__zoomIn ${expandShrink[item.expand ? 1 : 0]}`}>

                            <div>
                                <p className="my-1"><strong>{item.item_name}</strong>-{item.serve}</p>
                                <p className="my-1">{item.item_desc}</p>
                                <p className="my-2">({item.unit}) ${item.price}</p>
                        Qty
                        <button onClick={() => changeQty(item.id, "-")}>less</button><input type="number" value={item.qty} onChange={e => addToBasket(e, item)} className="form-control w-50" /><button onClick={() => changeQty(item.id, "+")}>more</button>
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


