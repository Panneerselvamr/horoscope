// components/HoroscopeSelector.jsx
import React from 'react';

const HoroscopeSelector = ({ horoscopeData, selectedName, onSelect }) => {
    if (!horoscopeData || Object.keys(horoscopeData).length === 0) {
        return null;
    }

    return (
        <div className="select-center">
            <select
                style={{ width: '60%' }}
                className="form-select"
                value={selectedName || '0'}
                onChange={(e) => onSelect(e.target.value)}
            >
                <option value="0">Select Horoscope</option>
                {Object.entries(horoscopeData).map(([key, value]) => {
                    const name = atob(key);
                    return (
                        <option
                            key={key}
                            className="added-horoscope"
                            value={JSON.stringify(value)}
                        >
                            {name}
                        </option>
                    );
                })}
            </select>
        </div>
    );
};

export default HoroscopeSelector;