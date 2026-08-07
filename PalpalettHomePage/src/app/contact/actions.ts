"use server";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Partial<Record<"name" | "email" | "message", string>>;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const fieldErrors: ContactFormState["fieldErrors"] = {};
  if (!name) fieldErrors.name = "お名前を入力してください。";
  if (!email) {
    fieldErrors.email = "メールアドレスを入力してください。";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.email = "メールアドレスの形式が正しくありません。";
  }
  if (!message) fieldErrors.message = "お問い合わせ内容を入力してください。";

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: "error",
      message: "入力内容をご確認ください。",
      fieldErrors,
    };
  }

  // TODO: メール送信サービス（Resend など）と連携し、実際に通知を送信する。
  // 現状は受け付けログの出力のみ。
  console.info("[contact] new inquiry", { name, email, message });

  return {
    status: "success",
    message: "お問い合わせありがとうございます。内容を送信しました。",
  };
}
