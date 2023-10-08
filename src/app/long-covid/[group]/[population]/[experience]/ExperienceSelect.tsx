"use client";
import { EXPERIENCES } from "@/app/long-covid/getData";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ReactSelect from "react-select";

const options = EXPERIENCES.map((experience) => {
  return {
    value: encodeURI(experience),
    label: decodeURI(experience).replace(/%2F/g, "/"),
  };
});

function ExperienceSelect({
  value,
}: {
  value: {
    value: string;
    label: string;
  };
}) {
  const router = useRouter();
  const params = useParams() ?? {
    group: "National Estimate",
    population: "all adults",
    exoerience: "long COVID",
  };

  const currentGroup = params.group ?? encodeURI("National Estimate");

  const currentPopulation = params.population ?? encodeURI("all adults");

  return (
    <div className="w-full">
      <p className="text-sm font-bold">Experience</p>
      <ReactSelect
      
        className=" capitalize"
        options={options}
        onChange={(selectedOption) => {
          if (!selectedOption) return;

          let population = params.population ?? encodeURI("all adults");

          if(selectedOption.label === "activity limitations"){
            population = "adults who currently have long COVID"
          }

          if(selectedOption.label === "long COVID") {
            population = "all adults"
          }
          router.push(
            `/long-covid/${currentGroup as string}/${
                population as string
            }/${selectedOption.value}`,
          );
        }}
        value={value}
      />
    </div>
  );
}

export default ExperienceSelect;
