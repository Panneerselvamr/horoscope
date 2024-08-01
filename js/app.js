import {
    EntryMap,
    GOD_COUNT,
    godToNumberMap, MUDAKU_NACHATRAM, NACHATRAM_DASA_AND_PUSHKARAM,
    numberToGodMap,
    outputEntries,
    RASI_COUNT,
    SUPER_GOD, THIRI_SUNIYAM,
    transitionDayMap, YOGI_AVA_YOGI
} from "./const";

let horoscopeData;
let selectedHoroscopeName;

async function loadJSON(key) {
    try {
        const response = await fetch('https://api.jsoneditoronline.org/v2/docs/' + key + '/data')
        if (response.status === 200)
            horoscopeData = await response.json();
        return horoscopeData;
    } catch (error) {
        console.error("error loading JSON", error);
    }
}

async function saveJSON(key) {
    try {
        const response = await fetch('https://api.jsoneditoronline.org/v2/docs/' + key + '/data', {
            method: 'PUT',
            body: JSON.stringify(horoscopeData)
        })
        return horoscopeData;
    } catch (error) {
        console.error("error loading JSON", error);
    }
}

$(document).ready(function () {
    const thriSuniayamInput = $('#horoscope-thri-suniayam-selector');
    const mudukuNachatramInput = $('#horoscope-mudaku-nachatram-selector');
    const mudukuNachatramResult = $('#mudaku-nachatram-result');
    const thriSuniayamResult = $('#thri-suniayam-result');
    const horoscopeDetailFields = {
        name: $('#horoscope-details-name'),
        dateTime: $('#horoscope-details-date-time'),
        place: $('#horoscope-details-place')
    }
    const karmaVinaikalSelector = $('#horoscope-karma-vinaikal-selector');
    const karmaVinaikalResult = $("#karma-vinaikal-result");
    const yogamAvayogamSelector = $("#horoscope-yogam-avayogam-selector");
    const yogamResult = $("#yogam-result");
    const avaYogamResult = $("#avayogam-result");
    const nakshatramDasaPushpakaramSelector = $("#horoscope-nakshatram-dasa-pushpakaram");
    const nakshatDasamPushpakaramResult = $("#nakshatram-dasa-pushpakaram-result");
    const nakshatDasamPushpakaramTitle = $("#nakshatram-dasa-pushpakaram-title");

    const bagasdanamMaragasdanamSelector = $("#horoscope-bagasdanam-maragasdanam-selector");
    const bagasdanamResult = $("#bagasdanam-result");
    const maragasdanamResult = $("#maragasdanam-result");

    function generateTable(entryNumber, rasiNumber, currentValues) {

        const output = currentValues.toString().split(/\s+/);
        if (!output.length)
            return;
        for (let god of output) {
            let godNumber = godToNumberMap[god];
            if (!EntryMap[entryNumber] || godNumber === undefined) continue;
            const currentEntry = EntryMap[entryNumber][godNumber]
            if (!currentEntry) continue;
            currentEntry.forEach(entry => {
                let rowNumber = ((rasiNumber - 1) + entry)
                if (rowNumber > 12)
                    rowNumber = rowNumber % 12;
                $(`td[data-index='entry${entryNumber}-${godNumber}-${rowNumber}']`).text(1);
            });
        }
    }


    function clearTextValues() {
        mudukuNachatramInput.val(0);
        mudukuNachatramResult.text('');
        thriSuniayamInput.val("திதி");
        thriSuniayamResult.text('');
        karmaVinaikalSelector.val("நட்சத்திரம்")
        thriSuniayamResult.text('');
        yogamResult.text('');
        avaYogamResult.text('');
        yogamAvayogamSelector.val('select');
        nakshatramDasaPushpakaramSelector.val("நட்சத்திரம்");
        bagasdanamMaragasdanamSelector.val("ராசி");
    }

    function clearTables(clearAll) {

        outputEntries.map(entryNumber => {
            $(`#entry${entryNumber}-finaloutput`).text(`output ${entryNumber}:`);
            $(`#entry${entryNumber}-table td`).each(function () {
                if ($(this).hasClass('title')) return;
                $(this).text('');
            })
        })
        $('#entry-table td').each(function () {
            if ($(this).hasClass('laknam-highlight')) {
                $(this).removeClass('laknam-highlight');
            }
            $(this).text('');
        })
        $('#entry-table-navamsam td').each(function () {
            if ($(this).hasClass('laknam-highlight')) {
                $(this).removeClass('laknam-highlight');
            }
            $(this).text('');
        })
        $(`#output-table td`).each(function () {
            if ($(this).hasClass('laknam-highlight')) {
                $(this).removeClass('laknam-highlight');
            }
            if ($(this).hasClass('title')) return;
            $(this).text('');
        })
        $(`#output-table td[data-index='super-3-god-value']`).text('');
        $(`#output-table td[data-index='super-3-god-total-value']`).text('');
        clearTextValues();
        Object.entries(horoscopeDetailFields).forEach(([key, field]) => {
            field.val('')
        })
        if (clearAll) {
            selectedHoroscopeName = null;
            $(`#horoscope-selector`).val(0)
        }
    }

    function regenerateTables() {
        $(`#entry-table td`).each(function () {
            let currentValues = $(this).text().trim();
            if (currentValues === 'invalid') return;
            if (!currentValues) return;
            // currentValues = Number(currentValues);

            // if (isNaN(currentValues)) return;
            const currentIndex = $(this).data('index');

            if (currentValues.toString().includes('லக்') || currentValues.toString().includes('8')) {
                $(this).addClass('laknam-highlight');
                $(`#output-table td[data-index=${currentIndex}]`).addClass('laknam-highlight')
            }

            processTables(currentIndex, currentValues);
        });
    }

    function finalOutTable() {
        for (let rasi = 1; rasi <= RASI_COUNT; rasi++) {
            let total = 0
            outputEntries.map(entryNumber => {
                const value = Number($(`td[data-index='entry${entryNumber}-total-${rasi}']`).text());
                if (isNaN(value)) return;
                total += value;
            })
            $(`#output-table td[data-index=${rasi}]`).text(total);
        }
    }


    function calculateTotal(entryNumber) {
        let grandTotal = 0;
        for (let rasi = 1; rasi <= RASI_COUNT; rasi++) {
            let total = 0;
            for (let god = 1; god <= GOD_COUNT; god++) {
                if ($(`td[data-index='entry${entryNumber}-${god}-${rasi}']`).text() === '1') {
                    total++;
                }
            }
            grandTotal += total;
            $(`td[data-index='entry${entryNumber}-total-${rasi}']`).text(total);
        }
        $(`#entry${entryNumber}-finaloutput`).text(`output ${entryNumber} : ${grandTotal} / ${EntryMap[entryNumber]?.total} `)
    }

    function generateSpecialGodValues() {
        const houseMapping = {}
        let finalOutput = ''
        let grandTotal = 0;
        for (let house = 1; house <= RASI_COUNT; house++) {
            const value = $(`#entry-table td[data-index='${house}']`).text()
            if (value?.trim().length) houseMapping[house] = value;
        }
        SUPER_GOD.lookFor.forEach(lookupGod => {
            let currentTotalForLookUpGod = 0
            const table = Object.entries(houseMapping)
            const specialGodTable = Object.entries(SUPER_GOD.god);
            const found = table.find(([, gods]) => gods.includes(lookupGod));
            if (found) {

                let currentNumber = +found[0];
                table.forEach(([houseNumber, gods]) => {
                    if (currentNumber !== +houseNumber) {
                        houseNumber = (+houseNumber) - (currentNumber - 1);
                        if (houseNumber <= 0) {
                            houseNumber = 12 + houseNumber;
                        }
                    } else { //god found in the same as special god so changing it to starting house
                        houseNumber = 1;
                    }
                    if (SUPER_GOD.positions[houseNumber]) {
                        specialGodTable.forEach(([god, godValue]) => {
                            if (gods.includes(god)) {
                                currentTotalForLookUpGod += (+godValue) * (+SUPER_GOD.positions[houseNumber]);
                            }
                        })
                    }
                })
            }
            finalOutput += `${lookupGod} : ${currentTotalForLookUpGod},   \n`
            grandTotal += currentTotalForLookUpGod;
        })
        $(`#output-table td[data-index='super-3-god-value']`).text(finalOutput);
        if (grandTotal) {
            $(`#output-table td[data-index='super-3-god-total-value']`).text(grandTotal);
        }
    }

    function processTables(rasiNumber, currentValues) {
        outputEntries.map(entryNumber => generateTable(entryNumber, rasiNumber, currentValues))
        outputEntries.map(entryNumber => calculateTotal(entryNumber));
        finalOutTable();
        generateSpecialGodValues()
    }

    function changeNumberToGodOnOtherCells(tableSelector, currentIndex) {
        tableSelector.each(function () {
            const currentValues = $(this).text().trim();
            if (!currentValues.length) return;
            const index = $(this).data('index');
            //if (index === currentIndex) return;
            let convertedValues = '';
            const output = currentValues.toString().split(/\s+/);
            output.forEach(currentValue => {
                const converted = numberToGodMap[currentValue];
                if (converted) {
                    convertedValues += converted + ' ';
                } else
                    convertedValues += currentValue + ' ';
            })
            $(this).text(convertedValues.trim());
            if (convertedValues.includes('லக்') || convertedValues.includes('8')) {
                $(this).addClass('laknam-highlight');
            }
        })
    }


    // $('#entry-table td').on('focusout',function (event){
    //     changeNumberToGodOnOtherCells($(this).data('index'))
    // })

    let processedTransition;

    function getCurrentConfig() {
        const horoscope = {}
        const navamsam = {}
        $(`#entry-table td`).each(function () {
            let currentValues = $(this).text().trim();
            if (currentValues === 'invalid') return;
            if (!currentValues) return;
            // currentValues = Number(currentValues);

            // if (isNaN(currentValues)) return;
            const currentIndex = $(this).data('index');
            horoscope[currentIndex] = currentValues;
        });


        $(`#entry-table-navamsam td`).each(function () {
            let currentValues = $(this).text().trim();
            if (currentValues === 'invalid') return;
            if (!currentValues) return;

            const currentIndex = $(this).data('index');
            navamsam[currentIndex] = currentValues;
        });

        return {
            navamsam,
            horoscope,
            details: Object.entries(horoscopeDetailFields).reduce((obj, [key, field]) => {
                obj[key] = field.val()
                return obj;
            }, {}),
            thriSuniyam: {
                input: thriSuniayamInput.val().trim(),
                result: thriSuniayamResult.text().trim(),
            },
            mudukuNachatram: {
                input: mudukuNachatramInput.val().trim(),
                result: mudukuNachatramResult.text().trim(),
            },
            karmaVinaikal: {
                input: karmaVinaikalSelector.val().trim(),
                result: karmaVinaikalSelector.find("option:selected")?.text?.(),
            },
            yogamAvayogam: {
                input: yogamAvayogamSelector.val().trim(),
                result: {
                    yogi: yogamResult.text().trim(),
                    avaYogi: avaYogamResult.text().trim(),
                }
            },
            nakshatramDasaPushpakaram: {
                input: nakshatramDasaPushpakaramSelector.val().trim(),
            },
            bagasdanamMaragasdanam: {
                input: bagasdanamMaragasdanamSelector.val().trim(),
                result: {bagasdanam: bagasdanamResult.text(), maragasdanam: maragasdanamResult.text()},

            }
        };
    }

    function loadSelectedHoroscope(config) {
        if (!config)
            return;
        let horoscope = config.horoscope || config; //backward compatability
        const navamsam = config.navamsam;
        if (horoscope)
            $(`#entry-table td`).each(function () {
                const currentIndex = $(this).data('index');
                const currentValues = horoscope[currentIndex];
                if (currentValues) {
                    $(this).text(currentValues);
                }
            });
        if (navamsam)
            $(`#entry-table-navamsam td`).each(function () {
                const currentIndex = $(this).data('index');
                const currentValues = navamsam[currentIndex];
                if (currentValues) {
                    $(this).text(currentValues);
                }
            });
        if (config.thriSuniyam) {
            thriSuniayamInput.val(config.thriSuniyam.input || "திதி");
            thriSuniayamResult.text(config.thriSuniyam.result || '');
        }

        if (config.mudukuNachatram) {
            mudukuNachatramInput.val(config.mudukuNachatram.input || 0);
            mudukuNachatramResult.text(config.mudukuNachatram.result || '');
        }
        if (config.details) {
            Object.entries(horoscopeDetailFields).forEach(([key, field]) => {
                field.val(config.details[key] || '')
            })
        }
        if (config.karmaVinaikal) {
            let value = config.karmaVinaikal.input;
            karmaVinaikalSelector.val(config.karmaVinaikal.input || "நட்சத்திரம்");
            karmaVinaikalResult.text(value?.split?.(":")[0] || '');
        }
        if (config.yogamAvayogam) {
            yogamAvayogamSelector.val(config.yogamAvayogam.input || "select");
            yogamResult.text(config.yogamAvayogam.result?.yogi || "");
            avaYogamResult.text(config.yogamAvayogam.result?.avaYogi || "");
        }
        if (config.nakshatramDasaPushpakaram) {
            nakshatramDasaPushpakaramSelector.val(config.nakshatramDasaPushpakaram.input || "நட்சத்திரம்");
            const found = getNakshatramDasaPushpakaramResult(config.nakshatramDasaPushpakaram.input)
            nakshatDasamPushpakaramResult.text(found.result);
            nakshatDasamPushpakaramTitle.text(found.title);
        }
        if (config.bagasdanamMaragasdanam) {
            bagasdanamMaragasdanamSelector.val(config.bagasdanamMaragasdanam.input || "ராசி");
            bagasdanamResult.text(config.bagasdanamMaragasdanam?.result?.bagasdanam || "")
            maragasdanamResult.text(config.bagasdanamMaragasdanam?.result?.maragasdanam || "")
        }
        regenerateTables();
    }

    function getNakshatramDasaPushpakaramResult(val) {
        const result = NACHATRAM_DASA_AND_PUSHKARAM.find((item) => item.nakshatras.includes(val))
        if (!result) return {result: '', title: ''};
        return {result: `${result.name}-${result.gender}-${result.number}-${result.houses}`, title: result.description}
    }

    function loadSelector() {
        if (!horoscopeData || !Object.keys(horoscopeData).length) return;
        $('#horoscope-selector-div').removeClass('hidden');
        $('.added-horoscope').remove();
        Object.entries(horoscopeData).forEach(([key, value]) => {
            const name = atob(key)
            if (name && value) {
                $('#horoscope-selector').append($('<option>', {
                    'class': 'added-horoscope',
                    text: name,
                    ...(selectedHoroscopeName === name ? {selected: true} : {}),
                    value: JSON.stringify(value)
                }));
            }
        })
    }

    async function loadHoroscopeJSON(value) {
        await loadJSON(value.trim());
        loadSelector();
    }

    function mark(number, box) {
        if (box > 12) {
            box = box % 12
        }
        const findGod = Object.entries(godToNumberMap).find(([god, index]) => {
            if (index === Number(number)) return god;
        })
        let valueToUpdate = findGod?.[0];
        if (valueToUpdate && box) {
            const selector = $(`#transition-table td[data-index=${box}]`)
            const existingValue = selector.text();
            if (existingValue?.includes?.(valueToUpdate)) return;
            if (existingValue) {
                valueToUpdate = existingValue + ' ' + valueToUpdate;
            }
            selector.text(valueToUpdate);
            for (let i = 1; i <= GOD_COUNT; i++) {
                $(`#entry${number}-table td[data-index=entry${number}-${i}-${box}]`).addClass('yellow-background')
            }
        }
    }

    function showTransition() {
        if (processedTransition)
            return;
        processedTransition = true;
        const currentDate = Math.round(Date.now() / (24 * 60 * 60 * 1000));
        for (let transitionKey in transitionDayMap) {
            const value = transitionDayMap[transitionKey];
            const tillDate = value.till.getTime() / (24 * 60 * 60 * 1000);
            if (tillDate > currentDate)
                mark(transitionKey, value.box);
            else {
                const dayDifference = currentDate - tillDate;
                if (dayDifference < value.move) {
                    mark(transitionKey, value.box + 1);
                } else {
                    const numberOfMove = Math.ceil(dayDifference / value.move);
                    mark(transitionKey, value.box + numberOfMove);
                }
            }
        }
    }

    (async function init() {
        showTransition();
        const key = localStorage.getItem('userSelectedKey')
        if (key?.length > 0) {
            $('#horoscopeInputKey').val(key);
            loadHoroscopeJSON(key).then(() => console.log("loaded horoscope from localstorage"))
                .catch(error => console.error('error loading horoscope on init'));
        }
    })()

    const entryTableTdSelector = $('#entry-table td');
    const entryTableNavamsamTdSelector = $('#entry-table-navamsam td')
    entryTableTdSelector.on('focusout', function (event) {
        changeNumberToGodOnOtherCells(entryTableTdSelector, $(this).data('index'))
        regenerateTables();
    });


    entryTableNavamsamTdSelector.on('focusout', function (event) {
        changeNumberToGodOnOtherCells(entryTableNavamsamTdSelector, $(this).data('index'))
    });

    $('#horoscope-new, #horoscope-clear').on('click', () => clearTables(true));
    $('#horoscope-open').on('click', () => {
        $('.horoscope-key-elements').addClass('show').removeClass('hide')
        $('.horoscope-name-elements').addClass('hide').removeClass('show')
    })
    $('#load-horoscope').on('click', async () => {
        const value = $('#horoscopeInputKey').val()
        if (!value)
            return;
        localStorage.setItem('userSelectedKey', value);
        await loadHoroscopeJSON(value)
    });


    $('#save-horoscope-button').on('click', async () => {
        if (!horoscopeData)
            return;
        const nameToBeSaved = $('#horoscopeNameKey').val();
        const currentKey = $('#horoscopeInputKey').val();

        if (!nameToBeSaved)
            return console.log("name invalid");
        if (!currentKey)
            return console.log("key not found");
        const base64Key = btoa(nameToBeSaved);
        horoscopeData[base64Key] = getCurrentConfig();
        await saveJSON(currentKey, horoscopeData);
        loadSelector();
    });

    $('#horoscope-save').on('click', async () => {
        const value = $('#horoscopeInputKey').val()
        if (!value) {
            $('.horoscope-key-elements').addClass('show').removeClass('hide');
            $('.horoscope-name-elements').addClass('hide').removeClass('show');

        } else {
            if (selectedHoroscopeName) {
                $('#horoscopeNameKey').val(selectedHoroscopeName);
            }
            $('.horoscope-name-elements').addClass('show').removeClass('hide');
            $('.horoscope-key-elements').addClass('hide').removeClass('show');
        }
    })
    $('#horoscope-selector').on('change', (event) => {
        if (!event.currentTarget.value) clearTables(true);
        try {
            if (event.currentTarget.selectedIndex !== 0)
                selectedHoroscopeName = $('#horoscope-selector option:selected').text();
            clearTables();
            loadSelectedHoroscope(JSON.parse(event.currentTarget.value));
        } catch (error) {
            clearTables(true)
        }
    })

    thriSuniayamInput.on('change', (event) => {
        const value = event.currentTarget.value
        if (!value) return
        thriSuniayamResult.text(THIRI_SUNIYAM[value] || '');
    });
    karmaVinaikalSelector.on('change', event => {
        let value = event.currentTarget.value;
        value = value.split(":")[0]
        karmaVinaikalResult.text(value || '');
    });

    yogamAvayogamSelector.on('change', event => {
        const map = YOGI_AVA_YOGI[event.currentTarget.value];
        yogamResult.text(map?.yogi || "");
        avaYogamResult.text(map?.avayogi || "");
    })

    nakshatramDasaPushpakaramSelector.on('change', event => {
        const found = getNakshatramDasaPushpakaramResult(event.currentTarget.value);
        nakshatDasamPushpakaramResult.text(found.result);
        nakshatDasamPushpakaramTitle.text(found.title);
    })
    bagasdanamMaragasdanamSelector.on('change', event => {
        const values = event.currentTarget.value?.split(":")
        bagasdanamResult.text(values?.[1] || "")
        maragasdanamResult.text(values?.[2] || "")
    })

    mudukuNachatramInput.on('change', () => {
        const value = event.currentTarget.value;
        if (value) {
            let converted = MUDAKU_NACHATRAM[value];
            if (!converted) return;
            converted = value + "." + converted
            if (value === 19) {
                return mudukuNachatramResult.text(converted);
            }

            let result = (19 - value) + 1;
            if (result <= 0) {
                result = result + 27;
            }
            result = ((19 + result) % 27)
            mudukuNachatramResult.text(result + "." + MUDAKU_NACHATRAM[result]);
        } else {
            mudukuNachatramResult.text("");
        }
    });
});
