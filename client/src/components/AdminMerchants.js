import React, { useState, useEffect, useContext } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext';
import { useHistory } from "react-router-dom";

export default function AdminMerchants() {
    const categories = ["Hot Food", "Beverage", "Kids", "Deserts"].sort()
    const [shops, setShops] = useState([])
    const [newshop, setNewshop] = useState({ name: '', category: categories[0] })
    const { dispatch, state } = useContext(AppContext);
    const history = useHistory();
    useEffect(() => {
        if (state.role === "") {
            return
        }
        if (state.role !== "admin") {
            history.replace(`/${state.role}`)
        }

        API.getShops()
            .then(res => setShops(res.data))
            .catch(err => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `${err.response}` } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })

    }, [state])
    const newShopCreator = () => {
        if (newshop.name.trim().length < 2) {
            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `Shop name can't be empty` } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);

            return
        }
        API.createNewShop(newshop, state.token)
            .then(res => {
                setNewshop({ name: '', category: categories[0] })
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-success', text: 'Shop created Successfully' } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })
            .catch(err => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `${err.response}` } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })
    }
    return (
        <div>
            <div className="w-100 mx-auto">
                <div className="card p-2">
                    <div className="form-group">
                        <label htmlFor="new__shop__name">Shop Name</label>
                        <input type="text" className="form-control" name="new__shop__name" id="new__shop__name" onChange={(e) => setNewshop({ ...newshop, name: e.target.value.trim() })} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="select__category">Category</label>
                        <select name="select__category" defaultValue={categories[0]} id="select__category" className="form-select" onChange={(e) => setNewshop({ ...newshop, category: e.target.value })}>
                            {categories.map((category, i) => <option key={`category-${i}`} value={category}>{category}</option>)}

                        </select>
                    </div>
                    <button className="btn btn-primary my-3 " type="submit" onClick={newShopCreator}>Create Shop</button>
                </div>
            </div>
            <h3 className="text-center my-3">Shops List</h3>
            <div className="card p-2 my-2">
                <ul className="d-flex flex-wrap list-unstyled">
                    {categories.map((category, i) => <><h5 className="w-100" key={i}>{category}</h5>

                        {shops.filter(item => item.category === category)
                            .map(shop => <li key={`shops-${shop.id}`} className="px-2 m-2 d-inline-flex bg-danger border-success rounded text-light">{shop.name}</li>
                            )}
                    </>)}
                </ul>

            </div>
        </div>
    )
}


