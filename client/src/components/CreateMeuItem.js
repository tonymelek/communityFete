import React, { useState, useContext } from 'react'
import API from '../utils/API';
import AppContext from '../utils/AppContext';
import Notifier from './Notifier'

export default function CreateMenuItem() {
    const [display, setDisplay] = useState({ class: 'd-none', color: '', text: '' })
    const [newItem, setNewItem] = useState({ item_name: '', item_desc: '', item_pic: '', unit: 'each', serve: 'sandwitch', price: 0 })
    const { dispatch, state } = useContext(AppContext);
    const createNewMenuItem = (e, updateObj) => {
        e.preventDefault();
        const { item_name, item_desc, item_pic, unit, serve, price } = updateObj
        if (item_name.length < 2 || item_desc.length < 2 || item_pic.length < 2 || price <= 0) {
            setDisplay({ class: 'd-block', color: 'bg-danger', text: `All Fields are Mandatory, please fill and re-submit` })
            setTimeout(() => setDisplay({ class: 'd-none', color: '', text: '' }), 2000)
            return
        }
        console.log(updateObj);
        API.createMenuItem(updateObj, state.token)
            .then(res => {
                dispatch({ type: 'refreshAPI', refreshAPI: !state.refreshAPI })
                setDisplay({ class: 'd-block', color: 'bg-success', text: 'Item created Successfully' })
                setTimeout(() => setDisplay({ class: 'd-none', color: '', text: '' }), 2000)
            })
            .catch(err => {
                setDisplay({ class: 'd-block', color: 'bg-danger', text: `${err.response}` })
                setTimeout(() => setDisplay({ class: 'd-none', color: '', text: '' }), 2000)
            })
    }
    return (
        <div className="create_menu_item">
            <Notifier display={display} />
            <div className="card p-3">
                <div className="form-group">
                    <label htmlFor="create_menu_name">Item Name</label>
                    <input type="text" className="form-control" name="create_menu_name" id="create_menu_name" onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value.trim() })} />
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_desc">Item Description</label>
                    <input type="text" className="form-control" name="create_menu_desc" id="create_menu_desc" onChange={(e) => setNewItem({ ...newItem, item_desc: e.target.value.trim() })} />
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_pic">Item Picture</label>
                    <input type="text" className="form-control" name="create_menu_pic" id="create_menu_pic" onChange={(e) => setNewItem({ ...newItem, item_pic: `https://drive.google.com/uc?export=view&id=${e.target.value.trim()}` })} />
                </div>
                <div className="form-group">
                    <label htmlFor="">Unit</label>
                    <select defaultValue="each" className="form-select" name="create_menu_unit" id="create_menu_unit" onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
                        <option value="each">each</option>
                        <option value="100g">100g</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_serve">Serve</label>
                    <select className="form-select" name="create_menu_serve" id="create_menu_serve" onChange={(e) => setNewItem({ ...newItem, serve: e.target.value })}>
                        <option value="sandwitch">sandwitch</option>
                        <option value="cup">cup</option>
                        <option value="box">box</option>
                        <option value="ticket">ticket</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_price">Price</label>
                    <input type="number" className="form-control" name="create_menu_price" id="create_menu_price" onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                </div>
                <button className="btn btn-primary" type="submit" onClick={e => createNewMenuItem(e, newItem)}>Create Item</button>
            </div>
        </div>
    )
}


