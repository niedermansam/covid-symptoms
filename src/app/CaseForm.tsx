"use client";
import { api } from "@/utils/api";
import type{  PartialExcept, UnwrapTRPCMutation } from "@/utils/types";
import {
  checkDateLogic,
  checkDatesAreValid,
  symptomValidatorBackend,
  symptomValidatorFrontend,
} from "@/utils/validation";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";

const StartPeakEnd = ({
  handleChange,
  values,
}: {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  values?: Partial<{
    start: string;
    peaked: string;
    end: string;
  }>;
}) => {
  return (
    <div className="flex flex-row gap-2 text-lg font-light">
      <div className="flex flex-col">
        <label htmlFor="start">started</label>
        <input
          className="rounded border p-2"
          type="date"
          onChange={handleChange}
          name="start"
          value={values?.start}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="peaked">peaked</label>
        <input
          className="rounded border p-2"
          type="date"
          onChange={handleChange}
          name="peaked"
          value={values?.peaked}
        />
      </div>
      <div className="flex flex-col">
        <label htmlFor="end">ended</label>
        <input
          className="rounded border p-2"
          type="date"
          onChange={handleChange}
          name="end"
          value={values?.end}
        />
      </div>
    </div>
  );
};



type AddCaseData = UnwrapTRPCMutation<typeof api.addCase.useMutation>;

// create a type for the symptom object with everything optional but the symptomId
type PartialSymptom = PartialExcept<AddCaseData['symptoms'][number], 'symptomId'>;

const SuccessPage = () => <div className="w-full text-center max-w-xl">
  <h2 className="text-3xl font-extrabold text-stone-600 pt-4">Thank you for sharing your experience!</h2>
  <p className="text-stone-500">Your submission has been added to our database. Check back to see if we get enough data to do anything interesting with it.</p>
</div>


const CaseDatesForm = ({
  handleChange,
  next,
  valid,
}: {
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  next: () => void;
  valid: {
    success: boolean;
    message: string;
  };
}) => (
  <>
    <p className="font-bold text-stone-600 text-sm py-4">To begin the survey, tell us when your symptoms started, when you felt your worst, and when your symptoms ended (if applicable).
    </p>
    <StartPeakEnd handleChange={handleChange} />
    <button
      className={twMerge(
        "mt-4 w-full rounded border  p-2 text-center text-white",
        valid.success === false
          ? "cursor-not-allowed bg-stone-500 opacity-50"
          : "bg-teal-600 hover:bg-teal-700",
      )}
      onClick={(e) => {
        e.preventDefault();
        next();
      }}
    >
      Next
    </button>
    <p className="text-red-500">{valid.message}</p>
  </>
);



function CaseForm({
  allSymptoms,
}: {
  allSymptoms: { id: string; symptom: string }[];
}) {
  const addCase = api.addCase.useMutation({
    onSuccess: () => {
      setShowSuccess(true);
    },
  });

  const [showSymptom, setShowSymptom] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [symptoms, setSymptoms] = React.useState<Map<string, PartialSymptom>>(
    new Map(),
  );

  const [caseDates, setCaseDates] = React.useState({
    start: "",
    peaked: "",
    end: "",
  });

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;

    setCaseDates({
      ...caseDates,
      [name]: value,
    });
  };

  const [valid, setValid] = React.useState({
    success: false,
    message: "",
  });

  useEffect(() => {
    setValid(checkDatesAreValid(caseDates));
  }, [caseDates]);

  const handleSymptomChange = (
    symptomId: string,
    payload: PartialSymptom | null,
  ) => {
    if (!payload) {
      setSymptoms((prev) => {
        const next = new Map(prev);
        next.delete(symptomId);

        return next;
      });
      return;
    }
    setSymptoms((prev) => {
      const next = new Map(prev);
      next.set(symptomId, payload);

      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const symptomsArray = Array.from(symptoms.values());

    const safeSymptoms = symptomValidatorFrontend.safeParse(symptomsArray);

    if (!safeSymptoms.success) return;

    const payload: AddCaseData = {
      case: caseDates,
      symptoms: safeSymptoms.data,
    };

    addCase.mutate(payload);
  };

  if (showSuccess) {
    return <SuccessPage />;
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-[600px] flex-col pb-60">
      {!showSymptom && (
        <CaseDatesForm
          handleChange={handleDateChange}
          next={() => setShowSymptom(true)}
          valid={valid}
        />
      )}
      {showSymptom && (
        <SymptomFormGen
          allSymptoms={allSymptoms}
          handleChange={handleSymptomChange}
          caseData={caseDates}
          symptoms={symptoms}
        />
      )}
    </form>
  );
}

const SymptomFormGen = ({
  allSymptoms,
  handleChange,
  caseData,
  symptoms,
}: {
  allSymptoms: { id: string; symptom: string }[];
  handleChange: (symptomId: string, payload: PartialSymptom | null) => void;
  caseData: AddCaseData["case"];
  symptoms: Map<string, PartialSymptom>;
}) => {
  const [valid, setValid] = React.useState({
    success: true,
    message: "",
  });

  useEffect(() => {
    //check symptoms are valid
    const symptomsArray = Array.from(symptoms.values());
    symptomsArray.forEach((symptom) => {
      const safeSymptom = symptomValidatorBackend.safeParse(symptom);
      if (!safeSymptom.success) return;

      const dateLogic = checkDateLogic(safeSymptom.data);

      if (!dateLogic.success) {
        setValid({
          success: false,
          message: "Please check your dates",
        });
        return;
      }
    });
  }, [symptoms]);

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-stone-600 text-sm py-4">Now, tell us about your symptoms.</p>
      {allSymptoms.map((symptom) => {
        return (
          <SymptomInput
            key={symptom.id}
            symptom={symptom}
            handleChange={handleChange}
            caseData={caseData}
            symptomData={symptoms.get(symptom.id)}
          />
        );
      })}
      <button
        className={twMerge(
          "mt-4 w-full rounded border  p-2 text-center text-white",
          valid.success === false
            ? "cursor-not-allowed bg-stone-500 opacity-50"
            : "bg-teal-600 hover:bg-teal-700",
        )}
        type="submit"
        disabled={valid.success === false}
      >
        Submit
      </button>
    </div>
  );
};

const SymptomInput = ({
  symptom,
  handleChange,
  caseData,
  symptomData,
}: {
  symptom: { id: string; symptom: string };
  handleChange: (symptomId: string, payload: PartialSymptom | null) => void;
  caseData: AddCaseData["case"];
  symptomData?: PartialSymptom;
}) => {
  const [checked, setChecked] = React.useState(false);

  const [valid, setValid] = React.useState({
    success: true,
    message: "",
  });

  useEffect(() => {
    if (checked && symptomData) {
      const safeSymptom = checkDatesAreValid(symptomData);
      if (!safeSymptom.success) {
        setValid({
          success: false,
          message: safeSymptom.message,
        });
      } 

      if (symptomData.severity)  {
        if(symptomData.severity < 1 || symptomData.severity > 10) {
          setValid({
            success: false,
            message: "Severity must be between 1 and 10",
          });
        }
      }
      
        setValid({
          success: true,
          message: "",
        });
      
    }
  }, [symptomData, checked]);

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const name = e.currentTarget.name;
    const value  = e.currentTarget.value;
    handleChange(symptom.id, {
      symptomId: symptom.id,
      start: symptomData?.start,
      peaked: symptomData?.peaked,
      end: symptomData?.end,
      notes: symptomData?.notes,
      severity: symptomData?.severity,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.currentTarget.checked);

    if (!e.currentTarget.checked) {
      handleChange(symptom.id, null);
    } else {
      handleChange(symptom.id, {
        symptomId: symptom.id,
        start: caseData.start,
        peaked: caseData.peaked,
        end: caseData.end,
      });
    }
  };

  return (
    <div className={twMerge("flex flex-col min-h-[40px] max-w-xl gap-2 text-lg font-light", 
    checked ? "bg-gray-100 p-2 rounded" : "bg-gray-50 p-2 rounded"
    )}>
      <div className="flex gap-1">
        <input
          type="checkbox"
          id={symptom.id}
          name={symptom.id}
          value={symptom.id}
          onChange={handleCheckboxChange}
        />
        <label htmlFor={symptom.id}>{symptom.symptom}</label>
      </div>
      <div>
        {checked && (
          <>
            <StartPeakEnd
              handleChange={handleDateChange}
              values={symptomData}
            />
            {valid.success === false && (
              <p className="text-red-500">{valid.message}</p>
            )}
            <label htmlFor="severity">severity (1-10)</label>
            <input
              type="text"
              name="severity"
              onChange={handleDateChange}
              className="w-full rounded border"
              placeholder="On a scale of 1-10, how severe was this symptom?"
              min={1}
              max={10}
              inputMode="numeric"
              pattern="[1-9]|10"
            />
            <label htmlFor="notes">notes</label>
            <textarea
              name="notes"
              onChange={handleDateChange}
              placeholder="Optional notes about your experience..."
              className="w-full rounded border"
              value={symptomData?.notes}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default CaseForm;
