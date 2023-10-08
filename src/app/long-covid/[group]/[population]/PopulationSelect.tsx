
'use client';
import { POPULATIONS } from '@/app/long-covid/getData'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import ReactSelect from 'react-select';

const options = POPULATIONS.map((population) => {
    return {
        value: encodeURI(population),
        label: decodeURI(population).replace(/%2F/g, "/"),
    };
}   )

function PopulationSelect({value}: {
    value:  {
        value: string,
        label: string,
    }
}) {
    const router = useRouter()
    const params = useParams() ?? {
        group: "National Estimate",
        population: "all adults",
    }
    const currentGroup  = params.group ?? encodeURI("National Estimate")

    const currentValue = {
        value: params.population ?? encodeURI("all adults"),
        label: decodeURI(params.population as string ?? encodeURI("all adults")).replace(/%2F/g, "/"),
    }
  return (
    <ReactSelect className=' capitalize' options={options} onChange={
        (selectedOption) => {

            if(!selectedOption) return;
            router.push(`/long-covid/${currentGroup as string}/${selectedOption.value}/${params.experience as string}`)
        }


    }
        value={value}
     />
  )
}

export default PopulationSelect