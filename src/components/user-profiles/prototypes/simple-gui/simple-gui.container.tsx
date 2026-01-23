"use client";

import React from "react";
import { SimpleGuiView } from "./simple-gui";
import { useSimpleGui } from "./simple-gui.logic";

export const SimpleGuiContainer = () => {
  const logic = useSimpleGui();
  return <SimpleGuiView {...logic} />;
};
