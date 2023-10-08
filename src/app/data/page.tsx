import { db } from "@/server/db";
import { casesSymptoms, symptoms, cases } from "@/server/db/schema";
import { eq, sql } from "drizzle-orm";
import React from "react";

// sql query to get the duration of the case from "start" date to "end" date using full dates, not just the day
// const foo = await db.query.cases.findMany({
//   extras: {
//     duration: sql<number>`EXTRACT(DAY FROM (end - start))`.as('duration'),
//   }

//

async function Page() {

  
  

  type Symptom =typeof averages[number] & {medianDuration?: string}

  const SymptomMap = new Map<string, Symptom>()

  // join casesSymptoms to cases to compare symptom start/end dates to case start/end dates
  const averages = await db
    .select({
      symptomId: casesSymptoms.symptomId,
      symptom: symptoms.symptom,
      symptomDelay: sql<string>`AVG(DATEDIFF(${casesSymptoms.start}, ${cases.start}))`,
      caseStartToSymptomPeak: sql<string>`AVG(DATEDIFF(${casesSymptoms.peaked}, ${cases.start}))`,
      caseStartToSymptomEnd: sql<string>`AVG(DATEDIFF(${casesSymptoms.end}, ${cases.start}))`,
      symptomDuration: sql<string>`AVG(DATEDIFF(${casesSymptoms.end}, ${casesSymptoms.start}))`,
      caseDuration: sql<string>`AVG(DATEDIFF(${cases.end}, ${cases.start}))`,
      proportionOfIllness: sql<string>`AVG(DATEDIFF(${casesSymptoms.end}, ${casesSymptoms.start})) / AVG(DATEDIFF(${cases.end}, ${cases.start}))`,
      numberOfCases: sql<string>`count(*)`,
    })
    .from(cases)
    .rightJoin(casesSymptoms, eq(casesSymptoms.caseId, cases.id))
    .groupBy(casesSymptoms.symptomId)
    .leftJoin(symptoms, eq(symptoms.id, casesSymptoms.symptomId));

  averages.forEach(x => SymptomMap.set(x.symptomId, x))


  // get median duration of symptoms
  await Promise.all(averages.map(async (x) => {
      const current =  db
        .select({
          symptomId: casesSymptoms.symptomId,
          symptom: symptoms.symptom,
          medianDuration: sql<string>`DATEDIFF(${casesSymptoms.end}, ${casesSymptoms.start})`,
        })
        .from(casesSymptoms)
        .leftJoin(cases, eq(cases.id, casesSymptoms.caseId))
        .leftJoin(symptoms, eq(symptoms.id, casesSymptoms.symptomId))
        .where(eq(casesSymptoms.symptomId, x.symptomId))
        .orderBy(sql<string>`DATEDIFF(${casesSymptoms.start}, ${cases.start})`)
        .offset(Math.floor(parseInt(x.numberOfCases) / 2))
        .limit(1);


      return  current
    })).then(x => x.map(y => 
      {
        if(!y[0]) return;
        const oldEntry = SymptomMap.get(y[0].symptomId)
        if(!oldEntry) return;
        SymptomMap.set(y[0].symptomId, {...oldEntry, medianDuration: y[0].medianDuration})
      }));
      

  console.log([...SymptomMap]);
  /*
    const casesWithSymptoms = await db
    .select({
      caseId: casesSymptoms.caseId,
      caseStarted: cases.start,
      caseEnded: cases.end,
      casePeaked: cases.peaked,
      symptomId: casesSymptoms.symptomId,
      start: casesSymptoms.start,
      end: casesSymptoms.end,
      peaked: casesSymptoms.peaked,
    })
    .from(casesSymptoms)
    .leftJoin(cases, (foo) => eq(foo.caseId, casesSymptoms.caseId));

    console.log(casesWithSymptoms)
*/
  //.leftJoin(casesSymptoms, (foo) => eq(foo.caseId, casesSymptoms.caseId))


  return (
    <div>
      {[...SymptomMap].map((x) => {
          const [_id, symptomData] = x
        return (
          <div className="py-2" key={symptomData.symptomId}>
            {symptomData.symptom}
            <br /> {Number(symptomData.caseDuration).toFixed()} days of symptoms
            <br />
            {Number(symptomData.caseStartToSymptomPeak).toFixed()} days to peak
            <br />
            {parseInt((Number( symptomData.proportionOfIllness) * 100).toString())}% of illness
            duration <br />
          {symptomData.numberOfCases} cases with this symptom
          <br />
          </div>

        );})}
    </div>
  );
}

export default Page;
