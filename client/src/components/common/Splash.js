import React from 'react'
import './Splash.css'
export default function Splash() {
    return (
        <div className="splash__main text-center animate__animated animate__zoomIn  d-flex flex-column justify-content-between">
            <div>
                <h1 className=" mt-4">Welcome</h1>
                <h5 className=" my-1">to</h5>
                <img className="d-block mx-auto" src="./imgs/logo.png" alt="logo" />
                <h3 className=" my-1">Community Fete</h3>
                <h1>2021</h1>
            </div>
            <div className="fete___photo__container">
                <img src="./imgs/fete.png" alt="fete" className="fete__photo" />

            </div>
            <p>&copy; Copyright 2021 , Developed by <a href="mailto:tonymelek.au@gmail.com" className="text-purple">Tony Melek</a></p>
        </div >
    )
}
