
import { buildQuery, dataValidator } from "./buildQuery";


export async function GET() {
  const query = buildQuery({
    group: "By Sex",
    timePeriodLabel: "Jul 26 - Aug 7, 2023"

  });
  
  const consumer = await fetch(
     query
  );
  const data = (await consumer.json()) as unknown[];

  const validatedData = dataValidator.safeParse(data);

  if (!validatedData.success) {
    throw new Error("Invalid data");
  }

  const IndicatorSet = new Set<Date | string | number>();

  const GroupMap = new Map<string, Set<string>>();

  validatedData.data.map((d) =>{
   const currentGroup = GroupMap.get(d.group) ?? new Set<string>();

    currentGroup.add(d.subgroup);

    GroupMap.set(d.group, currentGroup);

    IndicatorSet.add(d.indicator);}
  );

  type GroupObject =  Record<string, string[] | Set<string>>;
  const groupObject:GroupObject = Object.fromEntries(GroupMap.entries());

  for (const [key, value] of GroupMap.entries()) {
    groupObject[key] = [...value];
  }

  console.log(groupObject)

  const response = JSON.stringify([...IndicatorSet]);

  return new Response(response);
}
