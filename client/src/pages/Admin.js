import React, { useState, useEffect, useContext } from 'react'
import API from '../utils/API'
import AppContext from '../utils/AppContext';
import { useHistory } from "react-router-dom";
import './Admin.css'
import Notifier from '../components/Notifier';
export default function Admin() {
    const categories = ["Hot Food", "Beverage", "Kids", "Deserts"].sort()
    const history = useHistory();
    const [user, setUser] = useState('');
    const [users, setUsers] = useState([])
    const [shops, setShops] = useState([])
    const [newshop, setNewshop] = useState({ name: '', category: categories[0] })
    const [searchText, setSearchText] = useState('')
    const { dispatch, state } = useContext(AppContext);
    const display = state.display
    useEffect(() => {
        let tempToken = localStorage.getItem("conmmFete")
        if (tempToken === null) {
            history.replace(`/`)
            return
        }
        API.getThisUser(tempToken).then(res => {
            dispatch({ type: 'update_token', token: res.data.token })
            dispatch({ type: 'update_balance', balance: res.data.balance })
            dispatch({ type: 'update_role', role: res.data.role })
            dispatch({ type: 'update_email', email: res.data.email })
        })
            .catch(err => console.warn(err))

    }, [])

    const toBeUpdated = {}
    const update = (e, email, attr) => {
        const toUpdate = users.filter(user => user.email === email)[0];
        switch (attr) {
            case "role":
                toUpdate.role = e.target.value
                break;
            case "balance":
                toUpdate.balance = parseInt(e.target.value)
                break
            case "shop":
                toUpdate.ShopId = parseInt(e.target.value)
                break
            default:
                break;
        }
        toBeUpdated[email] = toUpdate;
    }
    const handleUpdate = (e, email) => {
        console.log(toBeUpdated[email]);
        e.preventDefault();
        if (!toBeUpdated[email]) {
            return
        }
        toBeUpdated[email]["role"] === "merchant" ? toBeUpdated[email]["balance"] = 0 : toBeUpdated[email]["ShopId"] = null
        API.updateBalanceRole(toBeUpdated[email], state.token)
            .then(res => {
                setUser(res.data);
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-success', text: 'User Updated Successfully' } })
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
    useEffect(() => {
        API.getUsers(state.token)
            .then(res => setUsers(res.data))
            .catch(err => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `${err.response}` } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })
        API.getShops()
            .then(res => setShops(res.data))
            .catch(err => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `${err.response}` } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })
        if (state.role !== "" && state.role !== "admin") {
            history.replace(`/${state.role}`)
        }
    }, [display, state])
    return (
        <div className="container">
            <Notifier />

            <div className="row">
                <div className="col-12 col-md-6 admin__users__container  d-flex flex-column mx-auto mt-3 p-2">
                    <div className="w-75 mx-auto">
                        <div className="form-group">
                            <label htmlFor="admin__search_input">Search Users</label>
                            <input type="text" name="admin__search_input" id="admin__search_input" className="form-control mb-2" onChange={(e) => setSearchText(e.target.value)} />
                        </div>
                    </div>
                    <hr />

                    {users.filter(filtered => filtered.email.toLowerCase().includes(searchText.trim().toLowerCase()))
                        .map(user => <div key={user.email} className="admin__users card my-2">
                            <div className="card-header">
                                <h5 className="text-center"> {user.email}</h5>
                            </div>
                            <div className="card-body d-flex flex-wrap justify-content-between align-items-center">
                                <div className="form-group d-flex justify-content-around p-2 flex-grow-1">
                                    <div>Role </div>
                                    <select defaultValue={user.role} onChange={e => update(e, user.email, "role")}>
                                        <option value="user" >user</option>
                                        <option value="merchant" >merchant</option>
                                    </select>
                                </div>
                                {user.role === "merchant" ?
                                    <div className="form-group d-flex justify-content-around p-2 flex-grow-1">

                                        <div>Shop </div>
                                        <select onChange={e => update(e, user.email, "shop")}>
                                            {shops.map(shop => <option key={`shop-${shop.id}`} value={shop.id} selected={user.ShopId === shop.id}>{shop.name}</option>)}
                                        </select>
                                    </div> : null}
                                {user.role === "user" ?
                                    <div className="form-group d-flex justify-content-around p-2 flex-grow-1">
                                        <div>Top up Balance</div> <input type="number" name="user__topup" onChange={e => update(e, user.email, "balance")} className="admin__user__topup" />
                                    </div> : null}
                                <button type="submit" className="btn btn-warning w-100" onClick={e => handleUpdate(e, user.email, user.balance)}>Update</button>
                            </div>

                        </div>)}

                </div>
                <div className="col-12 col-md-6 admin__users__container  d-flex flex-column mx-auto mt-3 p-2">
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
                            <button className="btn btn-primary" type="submit" onClick={newShopCreator}>Create Shop</button>
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
            </div>
        </div>
    )
}