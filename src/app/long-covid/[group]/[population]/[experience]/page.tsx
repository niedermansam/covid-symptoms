import React from "react";
import { MyResponsiveBar } from "../../../NivoBar";
import {
  type GROUPS,
  type LongCovidDataGroup,
} from "@/app/api/long-covid/types";
import {
  type IndicatorFilter,
  getData,
  type POPULATIONS,
  type EXPERIENCES,
} from "../../../getData";
import GroupSelect from "../../GroupSelect";
import PopulationSelect from "../PopulationSelect";
import ExperienceSelect from "./ExperienceSelect";
import DataSelect from "@/app/long-covid/DataSelect";

const FIRST_DATE = "Jul 26 - Aug 7, 2023";
const SECOND_DATE = "Dec 9 - Dec 19, 2022";

async function Page({
  params,
}: {
  params: {
    group: LongCovidDataGroup;
    population: (typeof POPULATIONS)[number];
    experience: (typeof EXPERIENCES)[number];
  };
}) {
  const currentGroup: (typeof GROUPS)[number] =
    params.group || "National Estimate";

  const currentPopulation: (typeof POPULATIONS)[number] =
    (decodeURI(params.population) as (typeof POPULATIONS)[number]) ||
    "all adults";

  const currentExperience: (typeof EXPERIENCES)[number] =
    (decodeURI(params.experience) as (typeof EXPERIENCES)[number]) ||
    "long COVID";

  // console.log(currentPopulation);

  const currentFilter = //:IndicatorFilter
    {
      population: currentPopulation,
      experience: currentExperience,
    } as const;

  const group = decodeURI(currentGroup) as LongCovidDataGroup;

  const groupValue = {
    value: group,
    label: group.replace(/%2F/g, "/"),
  };

  const populationValue = {
    value: currentPopulation,
    label: currentPopulation.replace(/%2F/g, "/"),
  };

  const experienceValue = {
    value: currentExperience,
    label: currentExperience.replace(/%2F/g, "/"),
  };

  const newData = await getData({
    query: {
      group: group,
      timePeriodLabel: FIRST_DATE,
    },
    filters: currentFilter as IndicatorFilter,
  });

  const oldData = await getData({
    query: {
      group: group,
      timePeriodLabel: SECOND_DATE,
    },
    filters: currentFilter as IndicatorFilter,
  });

  return (
    <>
    <DataSelect group={groupValue} population={populationValue} experience={experienceValue} />

      <div style={{ height: 400 }}>
        <MyResponsiveBar
          data={newData}
          label={FIRST_DATE.split(" - ")[1] ?? ""}
        />
      </div>
      <div style={{ height: 400 }}>
        <MyResponsiveBar
          data={oldData}
          label={SECOND_DATE.split(" - ")[1] ?? ""}
        />
      </div>
    </>
  );
}

export default Page;
