// components/Modal.jsx
import React, { useState } from 'react';

const Modal = ({ onSave, onLoad }) => {
    const [key, setKey] = useState('');
    const [name, setName] = useState('');
    const [mode, setMode] = useState('key'); // 'key' or 'name'

    const handleAction = () => {
        if (mode === 'key') {
            onLoad(key);
        } else {
            onSave(name);
        }
    };

    return (
        <div className="modal" tabIndex="-1" id="modelDialog">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Horoscope</h5>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body">
                        <div className={`horoscope-key-elements ${mode === 'key' ? 'show' : 'hide'}`}>
                            <label htmlFor="horoscopeInputKey" className="form-label">
                                Enter Horoscope key:
                            </label>
                            <input
                                type="password"
                                className="form-control"
                                id="horoscopeInputKey"
                                placeholder="**************"
                                value={key}
                                onChange={(e) => setKey(e.target.value)}
                            />
                        </div>

                        <div className={`horoscope-name-elements ${mode === 'name' ? 'show' : 'hide'}`}>
                            <label htmlFor="horoscopeNameKey" className="form-label">
                                Enter Horoscope name to be saved:
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="horoscopeNameKey"
                                placeholder="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                        >
                            Close
                        </button>

                        <div className={`horoscope-key-elements ${mode === 'key' ? 'show' : 'hide'}`}>
                            <button
                                id="load-horoscope"
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleAction}
                            >
                                Load
                            </button>
                        </div>

                        <div className={`horoscope-name-elements ${mode === 'name' ? 'show' : 'hide'}`}>
                            <button
                                id="save-horoscope-button"
                                type="button"
                                className="btn btn-primary"
                                data-bs-dismiss="modal"
                                onClick={handleAction}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;