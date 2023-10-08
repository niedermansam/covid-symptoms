"use client";
import { POPULATIONS } from "@/app/long-covid/getData";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import ReactSelect from "react-select";

const options = POPULATIONS.map((population) => {
  return {
    value: encodeURI(population),
    label: decodeURI(population).replace(/%2F/g, "/"),
  };
});

function PopulationSelect({
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
  };
  const currentGroup = params.group ?? encodeURI("National Estimate");

  const currentValue = {
    value: params.population ?? encodeURI("all adults"),
    label: decodeURI(
      (params.population as string) ?? encodeURI("all adults"),
    ).replace(/%2F/g, "/"),
  };


  const experience = params.experience ?? encodeURI("long COVID");

  console.log(decodeURI(params.population as string))
  
  return (
    <div className="w-full">
    <p className="text-sm font-bold">Population</p>
      <ReactSelect
        className=" capitalize"
        options={options}
        onChange={(selectedOption) => {
          if (!selectedOption) return;

          let experience = params.experience ?? encodeURI("long COVID");

          console.log(selectedOption.label)

          if(selectedOption.label === "adults who currently have long COVID"){
            experience = "activity limitations"
          }

          if(selectedOption.label === "adults who ever had COVID") {
            experience = "long COVID"
          }

          router.push(
            `/long-covid/${currentGroup as string}/${selectedOption.value}/${
              experience as string
            }`,
          );
        }}
        value={value}
      />
    </div>
  );
}

export default PopulationSelect;
