/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
import { z } from "zod";
const getNoonDate = (x: string) => {
  return new Date(`${x}T12:00:00`);
};
const dateTransform = (x: string | null | undefined) =>
  x ? getNoonDate(x) : undefined;
export const TimeValidator = z.object({
  start: z.string().transform(getNoonDate),
  peaked: z.string().transform(dateTransform),
  end: z.string().transform(dateTransform),
  fake: z.boolean().optional(),
});

export const symptomValidatorBackend = z.object({
  symptomId: z.string(),
  severity: z.number().optional(),
  start: z.string().transform(getNoonDate),
  peaked: z.string().optional().transform(dateTransform),
  end: z.string().optional().transform(dateTransform),
  notes: z.string().optional(),
  fake: z.boolean().optional(),
});
export const symptomArrayValidatorBackend = z.array(
  symptomValidatorBackend
);


export const symptomValidatorFrontend = z.array(
  z.object({
    symptomId: z.string(),
    severity: z
      .string()
      .optional()
      .transform((x) => (x ? parseInt(x) : undefined)),
    start: z.string(),
    peaked: z.string().optional(),
    end: z.string().optional(),
    notes: z.string().optional(),
  }),
);

export const caseValidator = z.object({
  case: TimeValidator,
  symptoms: symptomArrayValidatorBackend,
});

export const checkDateLogic = (caseDates: {
  start: Date;
  peaked?: Date;
  end?: Date;
}) => {
  if (caseDates.peaked && caseDates.start > caseDates.peaked)
    return {
      success: false,
      message: "Peaked date must be after start date",
    };
  //if end exists, make sure it's after start
  if (caseDates.end && caseDates.start > caseDates.end)
    return {
      success: false,
      message: "End date must be after start date",
    };
  //if end exists, make sure it's after peaked
  if (caseDates.end && caseDates.peaked && caseDates.peaked > caseDates.end)
    return {
      success: false,
      message: "End date must be after peaked date",
    };

  return {
    success: true,
    message: "",
  };
};

export const checkDatesAreValid = (caseDates: {
  start?: string;
  peaked?: string;
  end?: string;
}) => {
  if (!caseDates.start)
    return {
      success: false,
      message: "Start date is required. When were you first symptomatic?",
    };

  if (!caseDates.peaked && !caseDates.end)
    return {
      success: false,
      message:
        "Sorry if you're not feeling better yet. We need to know when you felt the worst or when your symptoms ended.",
    };

  const safeDates = TimeValidator.safeParse(caseDates);

  if (!safeDates.success)
    return {
      success: false,
      message: safeDates.error.message,
    };

  const dateLogic = checkDateLogic(safeDates.data);

  return dateLogic;
};
