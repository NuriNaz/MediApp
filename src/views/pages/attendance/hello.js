import React, { useState } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
    { label: 'Option 4', value: 'option4' }
];

function SearchableDropdown() {
    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleOptionChange = (event, options) => {
        setSelectedOptions(options);
    };
    console.log('heloo', selectedOptions);

    return (
        <div>
            <Autocomplete
                multiple
                options={options}
                getOptionLabel={(option) => option.label}
                renderInput={(params) => <TextField {...params} label="Select options" variant="outlined" />}
                value={selectedOptions}
                onChange={handleOptionChange}
            />
        </div>
    );
}

export default SearchableDropdown;
