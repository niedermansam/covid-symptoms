'use client'
import { ResponsiveBar } from "@nivo/bar";
import { INDICATORS } from "../api/long-covid/types";

const defaultData = [
  {
    country: "AD",
    "hot dog": 82,
    "hot dogColor": "hsl(319, 70%, 50%)",
    burger: 61,
    burgerColor: "hsl(307, 70%, 50%)",
    sandwich: 44,
    sandwichColor: "hsl(114, 70%, 50%)",
    kebab: 194,
    kebabColor: "hsl(130, 70%, 50%)",
    fries: 195,
    friesColor: "hsl(98, 70%, 50%)",
    donut: 155,
    donutColor: "hsl(343, 70%, 50%)",
  },
  {
    country: "AE",
    "hot dog": 95,
    "hot dogColor": "hsl(234, 70%, 50%)",
    burger: 131,
    burgerColor: "hsl(90, 70%, 50%)",
    sandwich: 123,
    sandwichColor: "hsl(35, 70%, 50%)",
    kebab: 88,
    kebabColor: "hsl(123, 70%, 50%)",
    fries: 14,
    friesColor: "hsl(310, 70%, 50%)",
    donut: 77,
    donutColor: "hsl(165, 70%, 50%)",
  },
  {
    country: "AF",
    "hot dog": 17,
    "hot dogColor": "hsl(161, 70%, 50%)",
    burger: 28,
    burgerColor: "hsl(278, 70%, 50%)",
    sandwich: 200,
    sandwichColor: "hsl(26, 70%, 50%)",
    kebab: 95,
    kebabColor: "hsl(142, 70%, 50%)",
    fries: 1,
    friesColor: "hsl(126, 70%, 50%)",
    donut: 40,
    donutColor: "hsl(132, 70%, 50%)",
  },
  {
    country: "AG",
    "hot dog": 34,
    "hot dogColor": "hsl(156, 70%, 50%)",
    burger: 34,
    burgerColor: "hsl(298, 70%, 50%)",
    sandwich: 141,
    sandwichColor: "hsl(192, 70%, 50%)",
    kebab: 101,
    kebabColor: "hsl(283, 70%, 50%)",
    fries: 59,
    friesColor: "hsl(254, 70%, 50%)",
    donut: 50,
    donutColor: "hsl(285, 70%, 50%)",
  },
  {
    country: "AI",
    "hot dog": 20,
    "hot dogColor": "hsl(8, 70%, 50%)",
    burger: 163,
    burgerColor: "hsl(185, 70%, 50%)",
    sandwich: 33,
    sandwichColor: "hsl(115, 70%, 50%)",
    kebab: 6,
    kebabColor: "hsl(356, 70%, 50%)",
    fries: 57,
    friesColor: "hsl(156, 70%, 50%)",
    donut: 60,
    donutColor: "hsl(320, 70%, 50%)",
  },
  {
    country: "AL",
    "hot dog": 107,
    "hot dogColor": "hsl(246, 70%, 50%)",
    burger: 133,
    burgerColor: "hsl(168, 70%, 50%)",
    sandwich: 34,
    sandwichColor: "hsl(76, 70%, 50%)",
    kebab: 34,
    kebabColor: "hsl(51, 70%, 50%)",
    fries: 121,
    friesColor: "hsl(132, 70%, 50%)",
    donut: 121,
    donutColor: "hsl(162, 70%, 50%)",
  },
  {
    country: "AM",
    "hot dog": 174,
    "hot dogColor": "hsl(71, 70%, 50%)",
    burger: 0,
    burgerColor: "hsl(191, 70%, 50%)",
    sandwich: 183,
    sandwichColor: "hsl(353, 70%, 50%)",
    kebab: 45,
    kebabColor: "hsl(83, 70%, 50%)",
    fries: 161,
    friesColor: "hsl(263, 70%, 50%)",
    donut: 77,
    donutColor: "hsl(330, 70%, 50%)",
  },
];
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
type DataType = Record<string, string | number>[];

export const MyResponsiveBar = ({ data /* see data tab */ }: {data: 
DataType }) => {
  if(!data?.[0] ) return null;


  // console.log(data)
  const keys =  Object.keys(data[0]).filter((key) => key !== 'group')

  return (
  <ResponsiveBar
    data={data}
    keys={
      keys
    }
    indexBy="group"
    groupMode="grouped"
    margin={{ top: 50, right: 60, bottom: 50, left: 70 }}
    padding={0.3}
    valueScale={{ type: "linear" }}
    indexScale={{ type: "band", round: true }}
    colors={{ scheme: "nivo" }}
    borderColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    axisTop={null}
    axisRight={null}
    axisBottom={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      
    }}
    axisLeft={{
      tickSize: 5,
      tickPadding: 5,
      tickRotation: 0,
      legend: "Percent",
      legendPosition: "middle",
      legendOffset: -40,
    }}
    labelSkipWidth={12}
    labelSkipHeight={12}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1.6]],
    }}
    legends={[
      {
        dataFrom: "keys",
        anchor: "top",
        direction: "column",
        justify: false,
        translateX: 120,
        translateY: -50,
        itemsSpacing: 10,
        itemWidth: 300,
        itemHeight: 20,
        itemDirection: "left-to-right",
        itemOpacity: 0.85,
        symbolSize: 20,
        effects: [
          {
            on: "hover",
            style: {
              itemOpacity: 1,
            },
          },
        ],
      },
    ]}
    role="application"
  />
)};

export default function NivoBar() {
  return (
    <div style={{ height: 400 }}>
      <MyResponsiveBar data={defaultData} />
    </div>
  );
}
