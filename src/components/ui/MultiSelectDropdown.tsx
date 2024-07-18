import { useState, forwardRef, useImperativeHandle } from "react";
import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    ListItemText,
    Checkbox,
    SelectChangeEvent,
} from "@mui/material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type Option = {
  id: string;
  name: string;
};

type Props = {
  id: string;
  placeholder: string;
  options: Option[];
  onSelect: (value: string[]) => void;
  disabled: boolean;
};

const MultiSelectDropdown = forwardRef(
  ({ id, placeholder, options, onSelect, disabled }: Props, ref) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    useImperativeHandle(ref, () => ({
      resetSelection() {
        setSelectedValues([]);
        onSelect([]);
      },
    }));

    const handleChange = (event: SelectChangeEvent<string[]>) => {
      const {
        target: { value },
      } = event;
      let tempVal = typeof value === "string" ? [value] : value;
      setSelectedValues(tempVal);
      onSelect(tempVal);
    };

    const renderValue = (selected: string[]) =>
      selected
        .map((itemId) => options.find((option) => option.id === itemId)?.name)
        .filter(Boolean)
        .join(", ");

    return (
      <FormControl fullWidth margin="normal">
        <InputLabel id={`${id}-label`}>{placeholder}</InputLabel>
        <Select
          labelId={`${id}-label`}
          id={id}
          multiple
          value={selectedValues}
          onChange={handleChange}
          input={<OutlinedInput label={placeholder} />}
          renderValue={renderValue}
          MenuProps={MenuProps}
          disabled={disabled}
        >
          {options.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Checkbox checked={selectedValues.indexOf(item.id) > -1} />
              <ListItemText
                primary={item.name}
                primaryTypographyProps={{ style: { whiteSpace: "normal", wordWrap: "break-word" } }}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    );
  }
);

export default MultiSelectDropdown;
