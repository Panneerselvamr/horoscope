const EntryMap = {
  1 : {
    1: [1, 2, 4, 7, 8, 9, 10, 11],
    2: [2, 5, 9, 10],
    3: [1, 2, 4, 7, 8, 9, 10, 11],
    4: [3, 5, 6, 9, 10, 11, 12],
    5: [5, 6, 9, 11],
    6: [5, 6, 11],
    7: [1, 2, 4, 7, 8, 9, 10, 11],
    8: [3, 4, 6, 10, 11, 12],
  },
  2:{
    1: [3, 6, 7, 8, 10, 11],
    2: [1, 3, 6, 7, 10, 11],
    3: [2, 3, 5, 6, 9, 10, 11],
    4: [1, 3, 4, 5, 7, 8, 10, 11],
    5: [1, 4, 7, 8, 10, 11, 12],
    6: [3, 4, 5, 7, 9, 10, 11],
    7: [3, 5, 6, 11],
    8: [3, 6, 10, 11],

  }
}


const GOD_COUNT = 8;
const RASI_COUNT = 12

const outputEntries = [1, 2]

document.addEventListener("DOMContentLoaded", function (event) {
  function generateTable(entryNumber, rasiNumber, currentValues) {

    const output = [];
    const sNumber = currentValues.toString();
    for (let i = 0, len = sNumber.length; i < len; i += 1) {
      output.push(+sNumber.charAt(i));
    }

    for (let godNumber of output) {
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
      $(`#entry${entryNumber}-table td`).each(function () {
        if ($(this).hasClass('title')) return;
        $(this).text('');
      })
    })
  }

  function regenerateTables() {
    $(`#entry-table td`).each(function () {
      let currentValues = $(this).text().trim();
      if (currentValues === 'invalid') return;
      if (!currentValues) return;
      currentValues = Number(currentValues);
      if (isNaN(currentValues)) return;
      processTables($(this).data('index'), currentValues);
    })
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
    $(`#entry${entryNumber}-finaloutput`).text(`output ${entryNumber} : ${grandTotal}`)
  }

  function processTables(rasiNumber, currentValues) {
    outputEntries.map(entryNumber => generateTable(entryNumber, rasiNumber, currentValues))
    outputEntries.map(entryNumber => calculateTotal(entryNumber));
  }

  $('#entry-table td').on('keyup', function (event) {
    let currentValues = $(this).text().trim()
    if (currentValues === 'invalid') return clearTables();
    if (!currentValues) return clearTables();
    currentValues = Number(currentValues);

    if (isNaN(currentValues)) {
      $(this).text('invalid')
      return clearTables()
    }
    regenerateTables();
  })
});
