import { useEffect, useMemo, useState } from "react";
import { styled } from "styled-components";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { productNamesBySlug } from "../../services/api/products";
import type { Product } from "../../utils/types";

const ChartArea = styled.section`
  flex: 1;
  align-content: center;
  max-width: calc(100% - 300px);

  @media (width < 890px) {
    max-width: inherit;
  }
`;

type Props = {
  productsByCategory: Record<string, Product[]>;
  category: string;
  filteredProducts: string[];
};

type ChartOptions = {
    chart: {
        type: string;
        height: string;
    };
    title: {
        text: string;
    };
    legend: {
        enabled: boolean;
    };
    xAxis: {
        categories: string[];
        title: {
            text: string;
        };
    };
    series: {
        name: string;
        data: string[];
        type: string;
    }[];
    plotOptions: {
        [key: string]: any;
    };
    yAxis: {
        min: number;
        title: {
            text: string;
        };
    };
}

const initialOptions: ChartOptions = {
  chart: {
    type: "column",
    height: "70%",
  },
  title: {
    text: "Products in selected Category",
  },
  legend: {
    enabled: false,
  },
  xAxis: {
    categories: [],
    title: {
      text: "",
    },
  },
  series: [
    {
      name: "Price",
      data: [],
      type: "column",
    },
  ],
  plotOptions: {
    series: {
      dataLabels: {
        enabled: true,
        align: "center",
        verticalAlign: "top",
        crop: false,
        overflow: "none",
        y: -20,
        format: "{y} $",
        style: {
          fontWeight: "bold",
          color: "black",
        },
      },
    },
  },
  yAxis: {
    min: 0,
    title: {
      text: "",
    },
  },
};

const BarChart = ({ productsByCategory, category, filteredProducts }: Props) => {
  const [options, setOptions] = useState(initialOptions);

  const seriesData = useMemo(() => {
    const products = productsByCategory[category] || [];
    const filteredProductsList = filteredProducts?.length
      ? products.filter((product) => filteredProducts.includes(product.id))
      : products;

    return {
      categories: filteredProductsList.map((product) => product.title),
      data: filteredProductsList.map((product) => product.price),
    };
  }, [productsByCategory, category, filteredProducts]);

  useEffect(() => {
        setOptions((prevOptions) => ({
      ...prevOptions,
      xAxis: {
        categories: seriesData.categories,
        title: {
          text: "",
        },
      },
      series: [
        {
          name: "Price",
          data: seriesData.data,
          type: "column",
        },
      ],
      yAxis: {
        min: 0,
        title: {
          text: productNamesBySlug[category] || "",
        },
      },
    }));
  }, [seriesData, category]);

  return (
    <ChartArea>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </ChartArea>
  );
};

export default BarChart;
