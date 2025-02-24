// components/HoroscopeTable.jsx
import React from 'react';
import { EntryMap, godToNumberMap, numberToGodMap } from '../const';

const HoroscopeTable = ({ type, data, onChange }) => {
    const generateCellId = (index) => `${type}-table-${index}`;

    const handleCellChange = (index, value) => {
        const convertedValue = convertValueToGods(value);
        onChange({ ...data, [index]: convertedValue });
    };

    const convertValueToGods = (value) => {
        if (!value) return '';

        const output = value.toString().split(/\s+/);
        let convertedValues = output.map(currentValue => {
            const converted = numberToGodMap[currentValue];
            return converted || currentValue;
        }).join(' ');

        return convertedValues.trim();
    };

    const renderCell = (index) => {
        const isLaknam = data[index]?.includes('லக்') || data[index]?.includes('8');

        return (
            <td
                key={index}
                data-index={index}
                contentEditable={true}
                className={isLaknam ? 'laknam-highlight' : ''}
                onBlur={(e) => handleCellChange(index, e.target.textContent)}
                suppressContentEditableWarning={true}
            >
                {data[index] || ''}
            </td>
        );
    };

    return (
        <table id={`${type}-table`}>
            <caption>{type === 'entry' ? 'Enter horoscope' : 'Enter Navamsam'}</caption>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
            </colgroup>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
            </colgroup>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
            </colgroup>
            <colgroup>
                <col />
                <col />
                <col />
                <col />
            </colgroup>
            <tbody>
            <tr>
                {[12, 1, 2, 3].map(index => renderCell(index))}
            </tr>
            <tr>
                {[11, null, null, 4].map(index =>
                    index ? renderCell(index) : <td key={index} style={{ border: 'none' }} />
                )}
            </tr>
            <tr>
                {[10, null, null, 5].map(index =>
                    index ? renderCell(index) : <td key={index} style={{ border: 'none' }} />
                )}
            </tr>
            <tr>
                {[9, 8, 7, 6].map(index => renderCell(index))}
            </tr>
            </tbody>
        </table>
    );
};

// Styles
const styles = {
    table: {
        borderCollapse: 'collapse',
        fontFamily: '"Arial Black", sans-serif',
    },
    td: {
        border: 'solid thin',
        height: '5em',
        width: '5em',
        textAlign: 'center',
        padding: 0,
    },
    laknamHighlight: {
        color: 'red',
    }
};

// Add styles to the document
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .laknam-highlight {
    color: red;
  }
  
  table#entry-table,
  table#entry-table-navamsam {
    border-collapse: collapse;
    font-family: "Arial Black", sans-serif;
  }

  table#entry-table td,
  table#entry-table-navamsam td {
    border: solid thin;
    height: 5em;
    width: 5em;
    text-align: center;
    padding: 0;
  }

  colgroup, tbody {
    border: solid medium;
  }
`;
document.head.appendChild(styleSheet);

export default HoroscopeTable;