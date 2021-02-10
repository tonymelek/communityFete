import React, { useState } from 'react'
import axios from 'axios'

export default function Tininfy() {
    const [photo, setPhoto] = useState(null)
    const onChangeHandler = e => {
        setPhoto(e.target.files[0]);
    }
    const handleSavePhoto = e => {
        e.preventDefault();
        const data = new FormData()
        data.append('userPhoto', photo)
        axios({
            method: 'post',
            url: '/tinify/test',
            data
        }).then(res => console.log(res.data))
            .catch(err => console.log(err.response.data))
    }
    return (
        <div className="w-50 mx-auto">
            <form onSubmit={e => handleSavePhoto(e)}>

                <div className="form-group my-3">
                    <label htmlFor="photo">Upload a Photo</label>
                    <input type="file" id='photo' name="file" className='form-control' onChange={e => onChangeHandler(e)} />
                </div>
                <button type="submit" className="btn btn-success">Upload</button>
            </form>
        </div>
    )
}
