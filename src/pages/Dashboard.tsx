import { useState, useEffect, useCallback, useRef } from "react";
import { styled } from "styled-components";
import { Box, CircularProgress } from "@mui/material";
import Filter from "../components/Filter";
import PieChart from "../components/chart-components/PieChart";
import BarChart from "../components/chart-components/BarChart";
import { getCategories } from "../services/api/products";
import type { Product, Category, Option } from "../utils/types";

const DashboardContainer = styled(Box)`
  display: flex;
  height: 100%;

  @media (width < 890px) {
    flex-direction: column;
  }
`;

const ProgressBarWrapper = styled.section`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: calc(100% - 300px);

  @media (width < 890px) {
    max-width: inherit;
  }
`;

const FilterArea = styled.section`
  width: 300px;
  padding: 60px 40px 60px 40px;

  @media (width < 890px) {
    width: auto;
  }
`;

interface ProductsByCategory {
  [key: string]: Product[];
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Option[]>([]);
  const [products, setProducts] = useState<Option[]>([]);
  const [category, setCategory] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<string[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<ProductsByCategory>({});
  const filteredProductRef = useRef<string[]>([]);
  const categoryRef = useRef<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesResp = await getCategories();
        if (categoriesResp) {
          const categoryTemp = categoriesResp.categories.map((item: Category) => ({
            id: item.slug,
            name: item.name,
          }));
          setCategories(categoryTemp);
          setProductsByCategory(categoriesResp.productsByCategory);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSelectCategory = useCallback((selectedCategory: string) => {
    categoryRef.current = selectedCategory;
    const tempProducts = productsByCategory[selectedCategory]?.map(item => ({
      id: item.id,
      name: item.title,
    })) || [];

    setProducts(tempProducts);

    if (!selectedCategory) {
        setCategory(selectedCategory);
    }
  }, [productsByCategory]);

  const onSelectProducts = useCallback((selectedProducts: string[]) => {
    filteredProductRef.current = selectedProducts;
  }, []);

  const onRunReport = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setFilteredProducts(filteredProductRef.current);
      setCategory(categoryRef.current || "");
      setIsLoading(false);
    }, 0); // To show spinner for 3s
  }, []);

  return (
    <DashboardContainer>
      <FilterArea>
        <Filter
          categories={categories}
          products={products}
          onSelectCategory={onSelectCategory}
          onSelectProducts={onSelectProducts}
          onRunReport={onRunReport}
        />
      </FilterArea>
      {isLoading ? (
        <ProgressBarWrapper>
          <CircularProgress />
        </ProgressBarWrapper>
      ) : category ? (
        <BarChart
          productsByCategory={productsByCategory}
          category={category}
          filteredProducts={filteredProducts}
        />
      ) : (
        <PieChart productsByCategory={productsByCategory} />
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
