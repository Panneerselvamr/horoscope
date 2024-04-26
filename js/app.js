import {EntryMap, GOD_COUNT, godToNumberMap, outputEntries, RASI_COUNT, transitionDayMap} from "./const";
let processedTransition;
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
        if(existingValue?.includes?.(valueToUpdate)) return;
        if (existingValue) {
            valueToUpdate = existingValue + ' ' + valueToUpdate;
        }
        selector.text(valueToUpdate);
        for (let i = 1; i <= GOD_COUNT; i++) {
            $(`#entry${number}-table td[data-index=entry${number}-${i}-${box}]`).addClass('yellow-background')
        }
    }
}
function displayTransition() {
    if(processedTransition)
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
                const numberOfMove = Math.round(dayDifference / value.move);
                mark(transitionKey, value.box + numberOfMove);
            }
        }
    }
}
$(document).ready(function () {
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

    function clearTables() {
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
        })
        $(`#output-table td`).each(function () {
            if ($(this).hasClass('laknam-highlight')) {
                $(this).removeClass('laknam-highlight');
            }
            if ($(this).hasClass('title')) return;
            $(this).text('');

        })

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

    function processTables(rasiNumber, currentValues) {
        outputEntries.map(entryNumber => generateTable(entryNumber, rasiNumber, currentValues))
        outputEntries.map(entryNumber => calculateTotal(entryNumber));
        finalOutTable();
    }





    $('#entry-table td').on('keyup', function (event) {
        let currentValues = $(this).text().trim()
        if (!currentValues) return clearTables();
        regenerateTables();
    });
    displayTransition();
});
