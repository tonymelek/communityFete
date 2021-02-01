import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from "react-router-dom";
import API from '../../utils/API';
import AppContext from '../../utils/AppContext';

export default function AdminUsers() {
    const history = useHistory();
    const [users, setUsers] = useState([])
    const [shops, setShops] = useState([])
    const [searchText, setSearchText] = useState('')
    const { dispatch, state } = useContext(AppContext);
    const toBeUpdated = {}

    useEffect(() => {
        if (state.role === "") {
            return
        }
        if (state.role !== "admin") {
            history.replace(`/${state.role}`)
        }

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

    }, [state])
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
        e.preventDefault();
        if (!toBeUpdated[email]) {
            return
        }
        toBeUpdated[email]["role"] === "merchant" ? toBeUpdated[email]["balance"] = 0 : toBeUpdated[email]["ShopId"] = null
        API.updateBalanceRole(toBeUpdated[email], state.token)
            .then(res => {
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
    return (
        <div>
            <div>
                <div className="w-75 mx-auto">
                    <div className="form-group">
                        <label htmlFor="admin__search_input">Search Users</label>
                        <input type="text" autoComplete="off" name="admin__search_input" id="admin__search_input" className="form-control mb-2" onChange={(e) => setSearchText(e.target.value)} />
                    </div>
                </div>
                <hr />
                <div className="d-flex flex-row flex-wrap justify-content-around">
                    {users.filter(filtered => filtered.email.toLowerCase().includes(searchText.trim().toLowerCase()))
                        .map(user => <div key={user.email} className="admin__users  card m-2">
                            <div className="card-header">
                                <h5 className="text-center"> {user.email}</h5>
                            </div>
                            <div className="card-body d-flex flex-wrap justify-content-between align-items-center">
                                <div className="form-group d-flex justify-content-between align-items-center px-2 my-1 flex-grow-1">
                                    <p className="px-2 m-0">Role </p>
                                    <select defaultValue={user.role} onChange={e => update(e, user.email, "role")}>
                                        <option value="user" >user</option>
                                        <option value="merchant" >merchant</option>
                                    </select>
                                </div>
                                {user.role === "merchant" ?
                                    <div className="form-group d-flex justify-content-between align-items-center p-2 my-2 flex-grow-1">

                                        <p className="px-2 m-0">Shop </p>
                                        <select onChange={e => update(e, user.email, "shop")}>
                                            <option value=""></option>
                                            {shops.map(shop => <option key={`shop-${shop.id}`} value={shop.id} selected={user.ShopId === shop.id}>{shop.name}</option>)}
                                        </select>
                                    </div> : null}
                                {user.role === "user" ?
                                    <div className="d-flex flex-row justify-content-between align-items-center my-2 p-2 flex-grow-1">
                                        <p className="px-2 m-0">Top up Balance</p>

                                        <input type="number" name="user__topup" onChange={e => update(e, user.email, "balance")} className="admin__user__topup" />

                                    </div> : null}
                                <button type="submit" className="btn btn-warning w-100" onClick={e => handleUpdate(e, user.email, user.balance)}>Update</button>
                            </div>

                        </div>)}
                </div>
            </div>
        </div>
    )
}

