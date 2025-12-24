"use client";

import { UserProfile } from "./user-profile";
import { useSchrodingerProfile } from "./user-profile.logic";

export function UserProfileContainer() {
  const {
    quantumState,
    currentPersona,
    observe,
    availablePersonas,
    switchMask,
  } = useSchrodingerProfile();

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
