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
  productsByCategory: {
    [key: string]: Product[];
  };
};

interface ChartOption {
    chart: { type: string; height: string; };
    title: { text: string; };
    subtitle: { text: string; };
    tooltip: { pointFormat: string; };
    accessibility: { point: { valueSuffix: string; }; };
    plotOptions: { [key: string]: any; };
    series: {
        name: string;
        colorByPoint: boolean;
        data: { name: string; y: number; }[];
    }[];
}

const initialOptions: ChartOption = {
  chart: {
    type: "pie",
    height: "70%",
  },
  title: {
    text: "All Categories",
  },
  subtitle: {
    text: "Source: dummyjson.com",
  },
  tooltip: {
    pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
  },
  accessibility: {
    point: {
      valueSuffix: "%",
    },
  },
  plotOptions: {
    pie: {
      allowPointSelect: true,
      cursor: "pointer",
      dataLabels: {
        enabled: true,
        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
      },
    },
  },
  series: [
    {
      name: "Brands",
      colorByPoint: true,
      data: [],
    },
  ],
};

const Chart = ({ productsByCategory }: Props) => {
  const [options, setOptions] = useState(initialOptions);

  const seriesData = useMemo(
    () => [
      {
        name: "Brands",
        colorByPoint: true,
        data: Object.entries(productsByCategory).map(([slug, products]) => ({
          name: productNamesBySlug[slug] || slug,
          y: products.length,
        })),
      },
    ],
    [productsByCategory]
  );

  useEffect(() => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      series: seriesData,
    }));
  }, [seriesData]);

  return (
    <ChartArea>
      <HighchartsReact highcharts={Highcharts} options={options} fullHeight />
    </ChartArea>
  );
};

export default Chart;
