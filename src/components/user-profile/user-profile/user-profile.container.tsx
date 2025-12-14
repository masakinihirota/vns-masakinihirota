"use client";

import { useSchrodingerProfile } from "./user-profile.logic";
import { UserProfile } from "./user-profile";

export function UserProfileContainer() {
  const { quantumState, currentPersona, observe, availablePersonas, switchMask } =
    useSchrodingerProfile();

  return (
    <UserProfile
      quantumState={quantumState}
      currentPersona={currentPersona}
      availablePersonas={availablePersonas}
      onObserve={observe}
      onSwitchMask={switchMask}
    />
  );
}
