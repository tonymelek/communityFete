import React, { useState, useContext } from 'react'
import API from '../../utils/API';
import AppContext from '../../utils/AppContext';

import './CreateMenuItem.css'

export default function CreateMenuItem({ values }) {

    const [newItem, setNewItem] = useState({ item_name: '', item_desc: '', unit: 'each', serve: 'sandwitch', price: 0 })
    const { dispatch, state } = useContext(AppContext);
    const [photo, setPhoto] = useState(null);
    const createNewMenuItem = (e) => {
        e.preventDefault();
        const { item_name, item_desc, unit, serve, price } = newItem
        const data = new FormData()
        data.append('userPhoto', photo)
        data.append('data', JSON.stringify(newItem));


        if (item_name.length < 2 || item_desc.length < 2 || price <= 0) {
            dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `All Fields are Mandatory, please fill and re-submit` } })
            setTimeout(() => {
                dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
            }, 2000);
            return
        }

        API.createMenuItem(data, state.token)
            .then(res => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-success', text: 'Item created Successfully' } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
                values.setCreate_appear('d-none')
            })
            .catch(err => {
                dispatch({ type: 'notifier', display: { class: 'd-block', color: 'bg-danger', text: `Error creating new Item` } })
                setTimeout(() => {
                    dispatch({ type: 'notifier', display: { class: 'd-none', color: '', text: '' } })
                }, 2000);
            })
    }

    const onChangeHandler = e => {
        setPhoto(e.target.files[0]);
    }
    return (
        <div className={`create__menu__item ${values.create_appear}`}>

            <div className="card m-3 create__menu__item__card">
                <div className="card-header">
                    <p onClick={() => { values.setCreate_appear('d-none') }} className="text-right">X</p>
                    <h4 className="text-center">Create New Menu Item</h4>
                </div>
                <form onSubmit={e => createNewMenuItem(e, newItem)}>
                    <div className="form-group m-2">
                        <label htmlFor="create_menu_name">Item Name</label>
                        <input type="text" className="form-control" name="create_menu_name" id="create_menu_name" onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value.trim() })} />
                    </div>
                    <div className="form-group m-2">
                        <label htmlFor="create_menu_desc">Item Description</label>
                        <input type="text" className="form-control" name="create_menu_desc" id="create_menu_desc" onChange={(e) => setNewItem({ ...newItem, item_desc: e.target.value.trim() })} />
                    </div>
                    <div className="form-group m-2">
                        <label htmlFor="create_menu_pic">Item Picture</label>
                        {/* <input type="text" className="form-control" name="create_menu_pic" id="create_menu_pic" onChange={(e) => setNewItem({ ...newItem, item_pic: `https://drive.google.com/uc?export=view&id=${e.target.value.trim()}` })} /> */}
                        <input type="file" id='photo' name="file" className='form-control' onChange={e => onChangeHandler(e)} />
                    </div>
                    <div className="form-group m-2">
                        <label htmlFor="">Unit</label>
                        <select defaultValue="each" className="form-select" name="create_menu_unit" id="create_menu_unit" onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}>
                            <option value="each">each</option>
                            <option value="100g">100g</option>
                        </select>
                    </div>
                    <div className="form-group m-2">
                        <label htmlFor="create_menu_serve">Serve</label>
                        <select className="form-select" name="create_menu_serve" id="create_menu_serve" onChange={(e) => setNewItem({ ...newItem, serve: e.target.value })}>
                            <option value="sandwitch">sandwitch</option>
                            <option value="cup">cup</option>
                            <option value="box">box</option>
                            <option value="ticket">ticket</option>
                        </select>
                    </div>
                    <div className="form-group m-2">
                        <label htmlFor="create_menu_price">Price</label>
                        <input type="number" className="form-control" name="create_menu_price" id="create_menu_price" onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} />
                    </div>
                    <button className="btn btn-primary m-2" type="submit" >Create Item</button>
                </form>
            </div>

        </div>
    )
}


