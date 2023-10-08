export const INDICATORS = [
  "Ever experienced long COVID, % of all adults",
  "Ever experienced long COVID, % of adults who ever had COVID",
  "Currently experiencing long COVID, % of all adults",
  "Currently experiencing long COVID, % of adults who ever had COVID",
  "Ever had COVID",
] as const;

export type LongCovidDataIndicator = (typeof INDICATORS)[number];


export const TIME_PERIOD_LABELS = [
  "Jun 1 - Jun 13, 2022",
  "Jun 29 - Jul 11, 2022",
  "Jul 27 - Aug 8, 2022",
  "Aug 24 - Sep 13, 2022",
  "Sep 14 - Sep 26, 2022",
  "Oct 5 - Oct 17, 2022",
  "Nov 2 - Nov 14, 2022",
  "Nov 30 - Dec 8, 2022",
  "Dec 9 - Dec 19, 2022",
  "Jan 4 - Jan 16, 2023",
  "Feb 1 - Feb 13, 2023",
  "Mar 1 - Mar 13, 2023",
  "Mar 29 - Apr 10, 2023",
  "Apr 26 - May 8, 2023",
  "Jun 7 - Jun 19, 2023",
  "Jun 28 - Jul 10, 2023",
  "Jul 26 - Aug 7, 2023",
] as const;

export type LongCovidDataTimePeriodLabel = (typeof TIME_PERIOD_LABELS)[number];

export const GROUPS = [
  "National Estimate",
  "By Age",
  "By Sex",
  "By Gender identity",
  "By Sexual orientation",
  "By Race%2FHispanic ethnicity",
  "By Education",
  "By Disability status",
  "By State",
] as const;

export type LongCovidDataGroup = (typeof GROUPS)[number];

export const SUBGROUP_OBJECT = {
  "National Estimate": ["United States"],
  "By Age": [
    "18 - 29 years",
    "30 - 39 years",
    "40 - 49 years",
    "50 - 59 years",
    "60 - 69 years",
    "70 - 79 years",
    "80 years and above",
  ],
  "By Sex": ["Male", "Female"],
  "By Gender identity": ["Cis-gender male", "Cis-gender female", "Transgender"],
  "By Sexual orientation": ["Gay or lesbian", "Straight", "Bisexual"],
  "By Race%2FHispanic ethnicity": [
    "Hispanic or Latino",
    "Non-Hispanic White, single race",
    "Non-Hispanic Black, single race",
    "Non-Hispanic Asian, single race",
    "Non-Hispanic, other races and multiple races",
  ],
  "By Education": [
    "Less than a high school diploma",
    "High school diploma or GED",
    "Some college%2FAssociate's degree",
    "Bachelor's degree or higher",
  ],
  "By Disability status": ["With disability", "Without disability"],
  "By State": [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ],
} as const;

export type LongCovidDataSubgroup = typeof SUBGROUP_OBJECT;

export type LongCovidDataSubgroupByGroup<TGroup> =  TGroup extends LongCovidDataGroup ? LongCovidDataSubgroup[TGroup][number] : never;


