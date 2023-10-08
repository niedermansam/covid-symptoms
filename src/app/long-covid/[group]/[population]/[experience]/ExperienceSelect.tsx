
'use client';
import { EXPERIENCES } from '@/app/long-covid/getData'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import ReactSelect from 'react-select';

const options = EXPERIENCES.map((experience) => {
    return {
        value: encodeURI(experience),
        label: decodeURI(experience).replace(/%2F/g, "/"),
    };
}   )

function ExperienceSelect({value}: {
    value:  {
        value: string,
        label: string,
    }
}) {
    const router = useRouter()
    const params = useParams() ?? {
        group: "National Estimate",
        population: "all adults",
        exoerience: "long COVID",
    }

    const currentGroup  = params.group ?? encodeURI("National Estimate")
    
    const currentPopulation = params.population ?? encodeURI("all adults")

    const currentValue = {
        value: params.population ?? encodeURI("all adults"),
        label: decodeURI(params.population as string ?? encodeURI("all adults")).replace(/%2F/g, "/"),
    }
  return (
    <ReactSelect className=' capitalize' options={options} onChange={
        (selectedOption) => {

            if(!selectedOption) return;
            router.push(`/long-covid/${currentGroup as string}/${currentPopulation as string}/${selectedOption.value }`)
        }


    }
        value={value}
     />
  )
}

export default ExperienceSelect