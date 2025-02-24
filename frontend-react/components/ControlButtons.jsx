// components/ControlButtons.jsx
import React from 'react';

const ControlButtons = ({ onNew, onSave, onOpen }) => {
    return (
        <div style={styles.container}>
            <button
                id="horoscope-new"
                className="btn btn-info"
                onClick={onNew}
            >
                New
            </button>

            <button
                id="horoscope-open"
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#modelDialog"
                onClick={onOpen}
            >
                Open
            </button>

            <button
                id="horoscope-save"
                className="btn btn-success"
                data-bs-toggle="modal"
                data-bs-target="#modelDialog"
                onClick={onSave}
            >
                Save
            </button>

            <button
                id="horoscope-clear"
                className="btn btn-danger"
                onClick={onNew}
            >
                Clear
            </button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        alignContent: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '50px',
        padding: '20px'
    }
};

export default ControlButtons;