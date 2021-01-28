import React, { useState } from 'react'
import './Loading.css'
export default function Loading({ loading }) {


    return (
        <div className="loading__main">
            {loading &&
                <img src="./imgs/loading.gif" alt="" srcset="" />}
        </div>
    )
}
