import { z } from "zod";
import type {
   LongCovidDataIndicator,
   LongCovidDataGroup,
   LongCovidDataTimePeriodLabel,
   LongCovidDataSubgroupByGroup,
} from "./types";

export const QUERY_FIELDS = {
  indicator: "indicator=",
  group: "$where=`group`=",
  state: "state=",
  subgroup: "subgroup=",
  timePeriodLabel: "time_period_label=",
  timePeriodStart: "time_period_start_date=",
  timePeriodEnd: "time_period_end_date=",
  value: "value=",
  lowci: "lowci=",
  highci: "highci=",
} as const;

export const dataValidator = z
  .object({
    indicator: z.string(),
    group: z.string(),
    state: z.string(),
    subgroup: z.string(),
    time_period_label: z.string(),
    time_period_start_date: z.string().transform((x) => new Date(x)),
    time_period_end_date: z.string().transform((x) => new Date(x)),
    value: z
      .string()
      .optional()
      .transform((x) => Number(x)),
    lowci: z
      .string()
      .optional()
      .transform((x) => Number(x)),
    highci: z
      .string()
      .optional()
      .transform((x) => Number(x)),
  })
  .array();

 export type BuildQueryParameter<TGroup> = {
   indicator?: LongCovidDataIndicator;
   group?: TGroup;
   state?: string;
   subgroup?: LongCovidDataSubgroupByGroup<TGroup>;
   timePeriodLabel?: LongCovidDataTimePeriodLabel;
   timePeriodStart?: string;
   timePeriodEnd?: string;
   value?: number;
   lowci?: number;
   highci?: number;
 };

export const buildQuery =<TGroup extends LongCovidDataGroup | undefined> ({
  indicator,
  group,
  state,
  subgroup,
  timePeriodLabel,
  timePeriodStart,
  timePeriodEnd,
  value,
  lowci,
  highci,
}:  
  BuildQueryParameter<TGroup>
) => {
  const groupString = QUERY_FIELDS.group + "'" + group + "'";

  const foo = [
    indicator ? QUERY_FIELDS.indicator + indicator : "",
    group ? groupString : "",
    state ? QUERY_FIELDS.state + state : "",
    subgroup ? QUERY_FIELDS.subgroup + subgroup : "",
    timePeriodLabel ? QUERY_FIELDS.timePeriodLabel + timePeriodLabel : "",
    timePeriodStart ? QUERY_FIELDS.timePeriodStart + timePeriodStart : "",
    timePeriodEnd ? QUERY_FIELDS.timePeriodEnd + timePeriodEnd : "",
    value ? QUERY_FIELDS.value + value : "",
    lowci ? QUERY_FIELDS.lowci + lowci : "",
    highci ? QUERY_FIELDS.highci + highci : "",
  ] as const;

  const query = foo.filter((x) => x);

  const queryString = query.join("&");

  const url = "https://data.cdc.gov/resource/gsea-w83j.json" + "?" + queryString;
  return new URL(url).href;
};
