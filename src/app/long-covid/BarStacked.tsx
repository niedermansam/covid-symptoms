"use client"
import ResizableBox from "@/app/Components/ResizableBox";
import React from "react";
import {type  AxisOptions, Chart } from "react-charts";
import useDemoConfig from "../Components/useDemoConfig";

type MyDatum = {
  group: string;
  value: number;
}

type MyData = {
  label: string;
  data: MyDatum[];
}

export default function BarStacked({data}: {data: MyData[]}) {

  const primaryAxis = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.group,
    }),
    [],
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<(typeof data)[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.value,
        stacked: true,
      },
    ],
    [],
  );

  return (
    <>
      <br />
      <br />
      <ResizableBox>
        <Chart
          options={{
            data,
            primaryAxis,
            secondaryAxes,
          }}
        />
      </ResizableBox>
    </>
  );
}
