import React from 'react'
import Notifier from '../components/Notifier'
import ResviseItems from '../components/ResviseItems'
import UserHeader from '../components/UserHeader'

export default function Checkout() {
    return (
        <div>
            <Notifier />
            <h1>Checkout Page</h1>
            <UserHeader />
            <ResviseItems />
        </div>
    )
}


