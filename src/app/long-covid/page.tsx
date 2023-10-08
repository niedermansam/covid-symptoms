import React from "react";
import { MyResponsiveBar } from "./NivoBar";
import { type GROUPS, type LongCovidDataGroup } from "../api/long-covid/types";
import { type IndicatorFilter, getData } from "./getData";
import GroupSelect from "./[group]/GroupSelect";
import PopulationSelect from "./[group]/[population]/PopulationSelect";
import ExperienceSelect from "./[group]/[population]/[experience]/ExperienceSelect";

const FIRST_DATE = "Jul 26 - Aug 7, 2023";
const SECOND_DATE = "Dec 9 - Dec 19, 2022";

const currentFilter: IndicatorFilter = {
  population: "all adults",
  experience: "long COVID",
} as const;

async function Page() {
  const currentGroup: (typeof GROUPS)[number] ="National Estimate";

  const group = decodeURI(currentGroup) as LongCovidDataGroup;

  const groupValue = {
    value: group,
    label: group.replace(/%2F/g, "/"),
  };

  const populationValue = {
    value: "all adults",
    label: "all adults",
  };

  const experienceValue = {
    value: "long COVID",
    label: "long COVID",
  };

  const newData = await getData({
    query: {
      group: group,
      timePeriodLabel: FIRST_DATE,
    },
    filters: currentFilter,
  });

  const oldData = await getData({
    query: {
      group: group,
      timePeriodLabel: SECOND_DATE,
    },
    filters: currentFilter,
  });

  return (
    <>
      <GroupSelect value={groupValue} />
      <PopulationSelect value={populationValue} />
      <ExperienceSelect value={experienceValue} />

      <div style={{ height: 400 }}>
        <p className="pl-12">{FIRST_DATE.split(" - ")[1]}</p>
        <MyResponsiveBar data={newData} 
          label={FIRST_DATE.split(" - ")[1] ?? ""}
        />
      </div>
      <div style={{ height: 400 }}>
       <p className="pl-12">{SECOND_DATE.split(" - ")[1]}</p> 
        <MyResponsiveBar data={oldData} label={
          SECOND_DATE.split(" - ")[1] ?? ""
        } />
      </div>
    </>
  );
}

export default Page;
