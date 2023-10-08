import {
  type BuildQueryParameter,
  buildQuery,
  dataValidator,
} from "../api/long-covid/buildQuery";
import type {
  LongCovidDataGroup,
  LongCovidDataIndicator,
} from "../api/long-covid/types";

type queryFields = BuildQueryParameter<LongCovidDataGroup>;

export type IndicatorFilter = {
  everHadCovid?: boolean;
  population:
    | "all adults"
    | "adults who ever had COVID"
    | "adults who currently have long COVID";
  experience: "long COVID" | "activity limitations";
};

export type TightFilter =
  | {
      population: "adults who ever had COVID";
      experience: "long COVID";
    }
  | {
      population: "adults who currently have long COVID";
      experience: "activity limitations";
    }
  | {
      population: "all adults";
      experience: "activity limitations";
    }
  | {
      everHadCovid?: boolean;
      population: "all adults";
      experience: "long COVID";
    }
  | {
      everHadCovid?: boolean;
    };

    export function getDefaultIndicatorFilter(
      filter: Partial<IndicatorFilter>,
    ): IndicatorFilter {
      if (isIndicatorFilter(filter)) {
        return filter;
      }

      if (filter.everHadCovid === undefined) {
        return {
          population: "all adults",
          experience: "long COVID",
        };
      }

      if (
        filter.population === "adults who ever had COVID" &&
        filter.experience === "activity limitations"
      ) {
        return {
          population: "adults who ever had COVID",
          experience: "long COVID",
        };
      }

      if (
        filter.population === "adults who currently have long COVID" &&        filter.experience === "long COVID"
      ) {
        return {
          population: "adults who currently have long COVID",
          experience: "activity limitations",
        };
      }

      if (
        filter.population === "all adults" &&
        filter.experience === "long COVID"
      ) {
        return {
          population: "all adults",
          experience: "activity limitations",
        };
      }

      return {
        population: "all adults",
        experience: "long COVID",
      };
    }

    function isIndicatorFilter(
      filter: Partial<IndicatorFilter>,
    ): filter is IndicatorFilter {
      return (
        filter.population !== undefined &&
        filter.experience !== undefined &&
        (filter.everHadCovid === undefined ||
          typeof filter.everHadCovid === "boolean")
      );
    }

export const EXPERIENCES = ["long COVID", "activity limitations"] as const;

export const POPULATIONS = [
  "all adults",
  "adults who ever had COVID",
  "adults who currently have long COVID",
] as const;

export async function getData({
  query,
  filters,
}: {
  query: queryFields;
  filters: IndicatorFilter;
}) {
  const newQuery = buildQuery(query);

  const response = await fetch(newQuery);

  const data = (await response.json()) as unknown;

  const safeData = dataValidator.parse(data);

  type DataRecord = Partial<
    Record<LongCovidDataIndicator, number> & {
      group: string;
    }
  >;

  const DataMap = new Map<string, DataRecord>();

  const handleDataUpdate = (row: (typeof safeData)[0]) => {
    const group = row.subgroup;
    const indicator = row.indicator as LongCovidDataIndicator;
    const value = row.value;

    if (!value) return;

    const dataRecord = DataMap.get(group) ?? {
      group,
      [indicator]: value,
    };

    DataMap.set(group, {
      ...dataRecord,
      [indicator]: value,
    });
  };

  safeData.map((row) => {
    if ("everHadCovid" in filters && row.indicator.includes("Ever had COVID")) {
      return handleDataUpdate(row);
    }

    if ("population" in filters !== true) return;

    if (
      filters.population === "all adults" &&
      filters.experience === "long COVID" &&
      row.indicator.includes("Ever had COVID") &&
      filters.everHadCovid
    )
      return handleDataUpdate(row);

    if (
      filters.population === "all adults" &&
      !row.indicator.includes("all adults")
    )
      return;

    if (
      filters.experience === "activity limitations" &&
      !row.indicator.includes("activity limitations")
    )
      return;

    if (
      filters.experience !== "activity limitations" &&
      row.indicator.includes("activity limitations")
    )
      return;

    if (
      filters.experience === "long COVID" &&
      !row.indicator.includes("long COVID")
    )
      return;

    if (
      filters.population === "adults who ever had COVID" &&
      !row.indicator.includes("adults who ever had COVID")
    )
      return;

    if (
      filters.population === "adults who currently have long COVID" &&
      !row.indicator.includes("adults who currently have long COVID")
    )
      return;

    handleDataUpdate(row);
  });

  // console.log(DataMap);

  const newData = Array.from(DataMap.values());

 //  console.log(newData);
  return newData;
}
