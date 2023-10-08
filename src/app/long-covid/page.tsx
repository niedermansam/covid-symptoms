"use client";
import { useRouter } from "next/navigation";

export default function Layout () {
    const router = useRouter();

        router.push(`/long-covid/server/National%20Estimate`)
return null
}