"use client";

import { UserProfileCreation } from "./user-profile-creation";
import { useUserProfileCreation } from "./user-profile-creation.logic";

export type UserProfileCreationLogic = ReturnType<
  typeof useUserProfileCreation
>;

export type UserProfileCreationContainerProps = UserProfileCreationLogic & {
  onComplete?: (data: UserProfileCreationLogic["formData"]) => void;
  isSubmitting?: boolean;
};

export const UserProfileCreationContainer = (props: {
  onComplete?: (data: UserProfileCreationLogic["formData"]) => void;
  isSubmitting?: boolean;
}) => {
  const logic = useUserProfileCreation();

  return (
    <UserProfileCreation
      {...logic}
      onComplete={props.onComplete}
      isSubmitting={props.isSubmitting}
    />
  );
};
