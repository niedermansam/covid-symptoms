"use client";
import { GROUPS } from "@/app/api/long-covid/types";
import { useRouter } from "next/navigation";
import React from "react";
import ReactSelect from "react-select";

const options = GROUPS.map((group) => {
  return {
    value: group,
    label: decodeURI(group).replace(/%2F/g, "/"),
  };
});

function GroupSelect({
  value,
}: {
  value: {
    value: string;
    label: string;
  };
}) {
  const router = useRouter();

  const onChange = (value: { value: string; label: string }) => {
    router.push(`/long-covid/${value.value}`);
  };

  return <div className="w-full"> 
  <p className="text-sm font-bold">Grouping Variable</p>
  <ReactSelect onChange={(e) => onChange(e as {
    value: string;
    label: string;
  })}
  value={value} options={options} /></div>;
}

export default GroupSelect;
