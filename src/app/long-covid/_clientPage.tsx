"use client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { type IndicatorFilter, getData } from "./getData";
import { type LongCovidDataGroup } from "../api/long-covid/types";
import { MyResponsiveBar } from "./NivoBar";

const defaultGroup: LongCovidDataGroup = "By Sex";

const defaultFilter: IndicatorFilter = {
  population: "all adults",
  experience: "long COVID",
  everHadCovid: true,
} as const;

function Page() {
  const [currentFilter, setCurrentFilter] =
    React.useState<IndicatorFilter>(defaultFilter);
  const [currentGroup, setCurrentGroup] =
    React.useState<LongCovidDataGroup>(defaultGroup);

  const newResult = useQuery({
    queryKey: ["newData"],
    queryFn: async () => {
      return await getData({
        query: {
          group: currentGroup,
          timePeriodLabel: "Jul 26 - Aug 7, 2023",
        },
        filters: currentFilter,
      });
    },
  });

  const oldResult = useQuery({
    queryKey: ["oldData"],
    queryFn: async () => {
      return await getData({
        query: {
          group: currentGroup,
          timePeriodLabel: "Dec 9 - Dec 19, 2022",
        },
        filters: currentFilter,
      });
    },
  });

  React.useEffect(() => {
    async function resetQuery() {
      await newResult.refetch();
      await oldResult.refetch();
    }

    try {
      void resetQuery();
    } catch (e) {
      console.log(e);
    }
  }, [currentFilter, currentGroup, newResult, oldResult]);

  if (newResult.isLoading || oldResult.isLoading) return <div>Loading...</div>;

  if (newResult.isError || oldResult.isError) return <div>Error...</div>;

  const toggleEverHadCovid = () => {
    if (
      "experience" in currentFilter &&
      currentFilter.experience !== "long COVID" &&
      currentFilter.population !== "adults who currently have long COVID"
    )
      return;
    if (
      "experience" in currentFilter &&
      currentFilter.experience === "activity limitations"
    )
      return;

    if (
      "population" in currentFilter &&
      currentFilter.population === "adults who ever had COVID"
    )
      return;

    setCurrentFilter({
      ...currentFilter,
      everHadCovid: !currentFilter.everHadCovid,
    });
  };

  return (
    <div>
      <>
        <div>
        </div>
        <div style={{ height: 400 }}>
          <MyResponsiveBar data={newResult.data} label="" />
        </div>
        <div style={{ height: 400 }}>
          <MyResponsiveBar data={oldResult.data} label=""/>
        </div>
      </>
    </div>
  );
}

export default Page;
