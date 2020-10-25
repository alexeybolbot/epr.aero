import React from 'react'
import './Modal.css'

export const Modal = ({ children, isModal, title, closeModal }) => (
    <React.Fragment>
        {isModal && <div className="modal1">
            <div className="modal1-body">
                <h4>{ title }</h4>
                { children }
                <button className="btn #9e9e9e grey" onClick={closeModal}>Отмена</button>
            </div>
        </div> }
    </React.Fragment>
)