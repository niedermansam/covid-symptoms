import { router, publicProcedure } from "@/server/api/trpc";
import { createId } from "@paralleldrive/cuid2";
import { TRPCError } from "@trpc/server";
import { cases, casesSymptoms, symptoms } from "@/server/db/schema";
import { db } from "@/server/db";
import { caseValidator, checkDateLogic } from "@/utils/validation";
import {faker} from '@faker-js/faker'
import type { z } from "zod";


export type CaseData = z.infer<typeof caseValidator>;

export const addCaseToDb = async (input: CaseData, ) => {
  const { start: caseStart, peaked: casePeak, end: caseEnd } = input.case;
  const caseId = createId();

    try {
      await db.transaction(async (tx) => {
        await tx.insert(cases).values({
          id: caseId,
          start: caseStart,
          peaked: casePeak,
          end: caseEnd,
          fake: input.case.fake,
        });
        await tx.insert(casesSymptoms).values(
          input.symptoms.map((symptom) => ({
            caseId,
            symptomId: symptom.symptomId,
            severity: symptom.severity,
            start: symptom.start,
            peaked: symptom.peaked,
            end: symptom.end,
            notes: symptom.notes,
            fake: symptom.fake,
          })),
        );
      });

      return { caseId };
    } catch (error) {
      if (
        typeof error === "object" &&
        error &&
        "message" in error &&
        typeof error.message === "string"
      ) {
        throw new TRPCError({ code: "BAD_REQUEST", message: error.message });
      } else {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown error" });
      }
    }
  };


export const appRouter = router({
  addCase: publicProcedure.input(caseValidator).mutation(async ({ input }) => {
    const { start: caseStart, peaked: casePeak, end: caseEnd } = input.case;
    
    const casesValid = checkDateLogic(input.case);

    if (!casesValid.success) {
      throw new TRPCError({ code: "BAD_REQUEST", message: casesValid.message });
    }

    input.symptoms.forEach((symptom) => {
      const symptomValid = checkDateLogic(symptom);
      if (!symptomValid.success) {
        throw new TRPCError({ code: "BAD_REQUEST", message: symptomValid.message });
      }
    } );


    // teturn { success: false, message: "Start date must be before end date" };
    return addCaseToDb(input);
  }),

});

export type AppRouter = typeof appRouter;
