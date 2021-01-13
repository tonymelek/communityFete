import React, { useState } from 'react'
import CreateMenuItem from '../components/CreateMeuItem'

export default function Merchant() {
    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 col-12">View Orders</div>

                <div className="col-md-6 col-12">Create Menu Item
            <CreateMenuItem />
                </div>
            </div>
        </div>
    )
}


