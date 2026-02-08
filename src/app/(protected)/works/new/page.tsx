import { RegistrationForm } from "@/components/works/registration";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "作品登録 | Anti-Gravity",
  description: "新しい作品を登録します",
};

export default function WorkRegistrationPage() {
  return (
    <div className="container py-10">
      <RegistrationForm />
    </div>
  );
}
