const EntryMap = {
    1: {
        1: [1, 2, 4, 7, 8, 9, 10, 11],
        2: [2, 5, 9, 10],
        3: [1, 2, 4, 7, 8, 9, 10, 11],
        4: [3, 5, 6, 9, 10, 11, 12],
        5: [5, 6, 9, 11],
        6: [5, 6, 11],
        7: [1, 2, 4, 7, 8, 9, 10, 11],
        8: [3, 4, 6, 10, 11, 12],
        total: 48
    },
    2: {
        1: [3, 6, 7, 8, 10, 11],
        2: [1, 3, 6, 7, 10, 11],
        3: [2, 3, 5, 6, 9, 10, 11],
        4: [1, 3, 4, 5, 7, 8, 10, 11],
        5: [1, 4, 7, 8, 10, 11, 12],
        6: [3, 4, 5, 7, 9, 10, 11],
        7: [3, 5, 6, 11],
        8: [3, 6, 10, 11],
        total: 49,
    },
    3: {
        1: [3, 5, 6, 10, 11],
        2: [3, 6, 11],
        3: [1, 2, 4, 5, 6, 8, 9],
        4: [3, 5, 6, 11],
        5: [6, 10, 11, 12],
        6: [6, 8, 11, 12],
        7: [1, 4, 7, 8, 9, 10, 11],
        8: [1, 3, 6, 10, 11],
        total: 39
    },
    4: {
        1: [5, 6, 9, 11, 12],
        2: [2, 4, 6, 8, 10, 11],
        3: [1, 2, 4, 7, 8, 9, 10, 11],
        4: [1, 3, 5, 6, 9, 10, 11, 12],
        5: [6, 8, 11, 12],
        6: [1, 2, 3, 4, 5, 8, 9, 11],
        7: [1, 2, 4, 7, 8, 9, 10, 11],
        8: [1, 2, 4, 6, 8, 10, 11],
        total: 54
    },
    5: {
        1: [1, 2, 3, 4, 7, 8, 9, 10, 11],
        2: [2, 5, 7, 9, 11],
        3: [1, 2, 4, 7, 8, 10, 11],
        4: [1, 2, 4, 5, 6, 9, 10, 11],
        5: [1, 2, 3, 4, 7, 8, 10, 11],
        6: [2, 5, 6, 9, 10, 11],
        7: [3, 5, 6, 12],
        8: [1, 2, 4, 5, 6, 7, 9, 10, 11],
        total: 56
    },
    6: {
        1: [1, 9, 12],
        2: [1, 2, 3, 4, 5, 8, 9, 11, 12],
        3: [3, 5, 6, 9, 11, 12],
        4: [6, 9, 10, 11, 12],
        5: [5, 8, 9, 10, 11],
        6: [1, 2, 3, 4, 5, 8, 9, 10, 11],
        7: [3, 4, 5, 8, 9, 10, 11],
        8: [1, 2, 3, 4, 5, 8, 9, 11],
        total: 52
    },
    7: {
        1: [3, 4, 6, 7, 9, 10, 11],
        2: [3, 6, 11],
        3: [3, 5, 6, 10, 11, 12],
        4: [6, 8, 9, 10, 11, 12],
        5: [5, 6, 11, 12],
        6: [6, 11, 12],
        7: [3, 5, 6, 11],
        8: [1, 3, 4, 6, 10, 11],
        total: 39
    }
}

const godToNumberMap = {
    'சூரி': 1,
    'சந்': 2,
    'செவ்': 3,
    'புத': 4,
    'குரு': 5,
    'சுக்': 6,
    'சனி': 7,
    'லக்': 8
}

const transitionDayMap = {
    1: {
        box: 1,
        move: 30,
        till: new Date("2024-05-14"),
    },
    2: {
        box: 3,
        move: 2.5,
        till: new Date("2024-04-16"),
    },
    3: {
        box: 11,

        move: 45,
        till: new Date("2024-04-23")
    },
    4: {
        box: 12,
        move: 30,
        till: new Date("2024-05-10")
    },
    5: {
        box: 1,
        move: 365,
        till: new Date("2024-05-01")
    },
    6: {
        box: 12,
        move: 30,
        till: new Date("2024-04-24")
    },
    7: {
        box: 11,
        move: 2.5 * 365,
        till: new Date("2025-03-29")
    }

}


const GOD_COUNT = 8;
const RASI_COUNT = 12

const outputEntries = Object.keys(EntryMap)

document.addEventListener("DOMContentLoaded", function (event) {
    function generateTable(entryNumber, rasiNumber, currentValues) {

        const output = currentValues.toString().split(/\s+/);
        /*if (sNumber.includes("8")) {
            for (let i = 0, len = sNumber.length; i < len; i += 1) {
                output.push(+sNumber.charAt(i));
            }
        } else {
            output = sNumber.split(" ");
        }*/
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
        //if (currentValues === 'invalid') return clearTables();
        if (!currentValues) return clearTables();
        // currentValues = Number(currentValues);

        // if (isNaN(currentValues)) {
        //     $(this).text('invalid')
        //     return clearTables()
        // }
        regenerateTables();
    });

});
