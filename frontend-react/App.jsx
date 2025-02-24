// App.jsx
import React, { useState, useEffect } from 'react';
import HoroscopeTable from './components/HoroscopeTable';
import HoroscopeDetails from './components/HoroscopeDetails';
import ControlButtons from './components/ControlButtons';
import HoroscopeSelector from './components/HoroscopeSelector';
import AdditionalFields from './components/AdditionalFields';
import Modal from './components/Modal';

const App = () => {
    const [horoscopeData, setHoroscopeData] = useState(null);
    const [selectedHoroscopeName, setSelectedHoroscopeName] = useState(null);
    const [currentConfig, setCurrentConfig] = useState({
        horoscope: {},
        navamsam: {},
        details: {},
        planets_patham_degree: {},
        thriSuniyam: { input: '', result: '' },
        mudukuNachatram: { input: '', result: '' },
        karmaVinaikal: { input: '', result: '' },
        yogamAvayogam: { input: '', result: { yogi: '', avaYogi: '' } },
        nakshatramDasaPushpakaram: { input: '' },
        bagasdanamMaragasdanam: { input: '', result: { bagasdanam: '', maragasdanam: '' } }
    });

    useEffect(() => {
        const key = localStorage.getItem('userSelectedKey');
        if (key?.length > 0) {
            loadHoroscopeJSON(key);
        }
    }, []);

    const loadHoroscopeJSON = async (key) => {
        try {
            const response = await fetch(`https://api.jsoneditoronline.org/v2/docs/${key}/data`);
            if (response.status === 200) {
                const data = await response.json();
                setHoroscopeData(data);
            }
        } catch (error) {
            console.error("error loading JSON", error);
        }
    };

    const saveHoroscopeJSON = async (key) => {
        try {
            await fetch(`https://api.jsoneditoronline.org/v2/docs/${key}/data`, {
                method: 'PUT',
                body: JSON.stringify(horoscopeData)
            });
        } catch (error) {
            console.error("error saving JSON", error);
        }
    };

    const clearTables = (clearAll) => {
        setCurrentConfig({
            horoscope: {},
            navamsam: {},
            details: {},
            planets_patham_degree: {},
            thriSuniyam: { input: '', result: '' },
            mudukuNachatram: { input: '', result: '' },
            karmaVinaikal: { input: '', result: '' },
            yogamAvayogam: { input: '', result: { yogi: '', avaYogi: '' } },
            nakshatramDasaPushpakaram: { input: '' },
            bagasdanamMaragasdanam: { input: '', result: { bagasdanam: '', maragasdanam: '' } }
        });

        if (clearAll) {
            setSelectedHoroscopeName(null);
        }
    };

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Horoscope table generator</h1>

            <Modal />

            <ControlButtons
                onNew={() => clearTables(true)}
                onSave={saveHoroscopeJSON}
                onOpen={loadHoroscopeJSON}
            />

            <HoroscopeSelector
                horoscopeData={horoscopeData}
                selectedName={selectedHoroscopeName}
                onSelect={setSelectedHoroscopeName}
            />

            <HoroscopeDetails
                details={currentConfig.details}
                onChange={(details) => setCurrentConfig(prev => ({ ...prev, details }))}
            />

            <div id="horoscope-table-collections" style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '50px',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <HoroscopeTable
                    type="entry"
                    data={currentConfig.horoscope}
                    onChange={(horoscope) => setCurrentConfig(prev => ({ ...prev, horoscope }))}
                />

                <HoroscopeTable
                    type="navamsam"
                    data={currentConfig.navamsam}
                    onChange={(navamsam) => setCurrentConfig(prev => ({ ...prev, navamsam }))}
                />
            </div>

            <AdditionalFields
                config={currentConfig}
                onChange={(field, value) => setCurrentConfig(prev => ({ ...prev, [field]: value }))}
            />
        </div>
    );
};

export default App;