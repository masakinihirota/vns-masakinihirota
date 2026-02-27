"use client";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    // フォーム送信ハンドラ (react-hook-form等)
    async function onSubmit(values: z.infer<typeof formSchema>) {
        await signIn.email(
            {
                email: values.email,
                password: values.password,
            },
            {
                onSuccess: () => {
                    router.refresh(); // セッション更新
                    router.push("/");
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
            }
        );
    }

    return ( /* JSX */ );
}
