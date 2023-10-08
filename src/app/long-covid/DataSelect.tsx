import React from 'react'
import GroupSelect from './[group]/GroupSelect';
import PopulationSelect from './[group]/[population]/PopulationSelect';
import ExperienceSelect from './[group]/[population]/[experience]/ExperienceSelect';

function DataSelect({
    group,
    population,
    experience,
}: {
    group: {value: string; label: string}
    population: {value: string; label: string}
    experience: {value: string; label: string   }
}) {
  return (
    <div className='flex w-full flex-col md:flex-row'>
      <GroupSelect value={group} />
      <PopulationSelect value={population} />
      <ExperienceSelect value={experience} />
    </div>
  );
}

export default DataSelect