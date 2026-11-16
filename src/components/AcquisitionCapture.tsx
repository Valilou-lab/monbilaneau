"use client";

import { useEffect } from "react";
import { captureAcquisition } from "@/lib/acquisition";

/** Stores first-touch UTM / click ids on landing (sent with the lead). */
export function AcquisitionCapture() {
  useEffect(() => {
    captureAcquisition();
  }, []);
  return null;
}
