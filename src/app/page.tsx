import React from "react";
import CaseForm from "./CaseForm";
import { db } from "@/server/db";

async function Page() {
  const symptoms = await db.query.symptoms.findMany();
  return (
    <div className="flex h-screen w-full flex-col items-center gap-2 pt-36 text-stone-700">
      <h1 className="font text-center text-5xl font-extrabold capitalize text-stone-500">
        Tell us about your
        <br /> COVID-19 experience
      </h1>
      <p className="text-center text-xl font-thin text-stone-500 drop-shadow">
        A simple, anonymous way to share your experience with COVID-19
      </p>

      <CaseForm allSymptoms={symptoms} />
    </div>
  );
}

export default Page;
