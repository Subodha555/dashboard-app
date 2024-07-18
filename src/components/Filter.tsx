import { useState, useRef, useCallback } from "react";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "styled-components";
import Dropdown from "./ui/Dropdown";
import MultiSelectDropdown from "./ui/MultiSelectDropdown";

const FilterArea = styled(Box)`
  padding: 10px;
  border: 1px solid #000000;
  border-radius: 8px;
  min-height: 90%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Header = styled.section`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`;

type Option = {
  id: string;
  name: string;
};

type Props = {
  onSelectCategory: (category: string) => void;
  onSelectProducts: (products: string[]) => void;
  onRunReport: () => void;
  categories: Option[];
  products: Option[];
};

const Filter = ({
  onSelectCategory,
  onSelectProducts,
  onRunReport,
  categories,
  products,
}: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [runReportEnabled, setRunReportEnabled] = useState<boolean>(false);
  const dropdownRef = useRef<{ resetSelection: () => void }>(null);
  const multiSelectDropdownRef = useRef<{ resetSelection: () => void }>(null);

  const onSelectCategoryType = useCallback((category: string) => {
    if (!category) {
      multiSelectDropdownRef.current?.resetSelection();
      setRunReportEnabled(false);
    } else {
      setRunReportEnabled(true);
    }
    setSelectedCategory(category);
    onSelectCategory(category);
  }, [onSelectCategory]);

  const onSelectProduct = useCallback((selectedProducts: string[]) => {
    onSelectProducts(selectedProducts);
    setRunReportEnabled(true);
  }, [onSelectProducts]);

  const onClearFilter = useCallback(() => {
    dropdownRef.current?.resetSelection();
    multiSelectDropdownRef.current?.resetSelection();
    setRunReportEnabled(false);
  }, []);

  const onClickRunReport = useCallback(() => {
    onRunReport();
    setRunReportEnabled(false);
  }, [onRunReport]);

  return (
    <FilterArea>
      <section>
        <Header>
          <Typography variant="h5">Filters</Typography>
          <Button onClick={onClearFilter}>Clear</Button>
        </Header>
        <Dropdown
          ref={dropdownRef}
          id="category"
          placeholder="Select Category"
          options={categories}
          onSelect={onSelectCategoryType}
        />
        <MultiSelectDropdown
          ref={multiSelectDropdownRef}
          id="product"
          placeholder="Select Product"
          options={products}
          onSelect={onSelectProduct}
          disabled={!selectedCategory}
        />
      </section>
      <Button
        variant="contained"
        color="primary"
        disabled={!runReportEnabled}
        onClick={onClickRunReport}
      >
        Run Report
      </Button>
    </FilterArea>
  );
};

export default Filter;
