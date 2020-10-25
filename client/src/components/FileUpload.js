import React from 'react'

export const FileUpload = ({ changeHandler, nameBtn='Добавить', sendBtn }) => (
    <div className="row">
        <div className="input-field col s6">
            <form action="#">
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Файл</span>
                        <input type="file" onChange={changeHandler} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
            </form>            
        </div>
        <div className="input-field col s6">
            <div className="file-field input-field">
                <div className="btn" onClick={sendBtn}>
                    <span>{nameBtn}</span>
                </div>
            </div>
        </div>
    </div>
)