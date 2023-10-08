import { CaseData } from "@/server/api/root";
import { db } from "@/server/db";
import { faker } from "@faker-js/faker";

type FakeCaseData = CaseData["case"] & {
  fake: true;
};
type FakeSymptomData = CaseData["symptoms"][number] & {
  fake: true;
};
function createRandomCaseBase(): FakeCaseData {
  const start = faker.date.past({ years: 2 });
  const peaked = faker.date.between({
    from: start,
    to: faker.date.soon({ days: 14, refDate: start }),
  });

  const end = faker.date.between({
    from: peaked,
    to: faker.date.soon({ days: 30, refDate: peaked }),
  });

  return {
    start,
    peaked,
    end,
    fake: true,
  };
}
function createSymptom(
  symptomId: string,
  caseData: FakeCaseData,
): FakeSymptomData {
  const start = faker.date.soon({ days: 3, refDate: caseData.start });

  const peaked = faker.date.between({
    from: start,
    to: faker.date.soon({ days: 14, refDate: start }),
  });

  const getLastPossibleEndDate = (end?: Date, peaked?: Date) => {
    if (end) {
      return end;
    } else {
      if (!peaked) throw new Error("no peaked date");
      const generatedEndDate = faker.date.soon({ days: 30, refDate: peaked });
      return new Date(
        Math.max(
          generatedEndDate.getTime() + 60 * 60 * 24 * 7,
          peaked.getTime() + 60 * 60 * 24 * 7,
        ),
      );
    }
  };

  const end = faker.date.between({
    from: peaked,
    to: getLastPossibleEndDate(caseData.end, peaked),
  });

  return {
    symptomId: symptomId,
    severity: faker.number.int({
      min: 1,
      max: 10,
    }),
    start,
    peaked,
    end,
    fake: true,
  };
}
export async function createFakeCase(): Promise<
  | {
      case: FakeCaseData;
      symptoms: FakeSymptomData[];
    }
  | undefined
> {
  try {
    const symptomList = (await db.query.symptoms.findMany()).map((x) => x.id);
    const subset = faker.helpers.arrayElements(symptomList, {
      min: 1,
      max: symptomList.length,
    });
    const caseData = createRandomCaseBase();
    return {
      case: caseData,
      symptoms: subset.map((x) => createSymptom(x, caseData)),
    };
  } catch (e) {
    console.log(e);
  }
}
