import React, { useState } from 'react'
import Notifier from './Notifier'

export default function CreateMeuItem() {
    const [display, setDisplay] = useState({ class: 'd-none', color: '', text: '' })
    return (
        <div className="create_menu_item">
            <Notifier display={display} />
            <div className="card p-3">
                <div className="form-group">
                    <label htmlFor="create_menu_name">Item Name</label>
                    <input type="text" className="form-control" name="create_menu_name" id="create_menu_name" />
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_desc">Item Description</label>
                    <input type="text" className="form-control" name="create_menu_desc" id="create_menu_desc" />
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_pic">Item Picture</label>
                    <input type="text" className="form-control" name="create_menu_pic" id="create_menu_pic" />
                </div>
                <div className="form-group">
                    <label htmlFor="">Unit</label>
                    <select defaultValue="each" className="form-select" name="create_menu_unit" id="create_menu_unit">
                        <option value="each">each</option>
                        <option value="100g">100g</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_serve">Serve</label>
                    <select className="form-select" name="create_menu_serve" id="create_menu_serve">
                        <option value="sandwitch">sandwitch</option>
                        <option value="cup">cup</option>
                        <option value="box">box</option>
                        <option value="ticket">ticket</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="create_menu_price">Price</label>
                    <input type="number" className="form-control" name="create_menu_price" id="create_menu_price" />
                </div>
                <button className="btn btn-primary" type="submit">Create Item</button>
            </div>
        </div>
    )
}


