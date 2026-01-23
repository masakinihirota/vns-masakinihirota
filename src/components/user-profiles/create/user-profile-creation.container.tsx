"use client";

import React from "react";
import { UserProfileCreation } from "./user-profile-creation";
import { useUserProfileCreation } from "./user-profile-creation.logic";

export type UserProfileCreationLogic = ReturnType<
  typeof useUserProfileCreation
>;
export type UserProfileCreationContainerProps = UserProfileCreationLogic;

export const UserProfileCreationContainer = () => {
  const logic = useUserProfileCreation();

  return <UserProfileCreation {...logic} />;
};
