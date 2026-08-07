"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "./actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitContactForm,
    initialState,
  );

  if (state.status === "success") {
    return (
      <div className="border border-line bg-white px-8 py-10 text-center">
        <p className="font-serif text-xl text-ink">送信が完了しました</p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8" noValidate>
      <div>
        <label htmlFor="name" className="text-sm tracking-wide text-ink-soft">
          お名前
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
        {state.fieldErrors?.name && (
          <p className="mt-2 text-xs text-accent">{state.fieldErrors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="text-sm tracking-wide text-ink-soft">
          メールアドレス
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-2 w-full border-b border-line bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
        {state.fieldErrors?.email && (
          <p className="mt-2 text-xs text-accent">{state.fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="text-sm tracking-wide text-ink-soft">
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className="mt-2 w-full resize-none border-b border-line bg-transparent py-2 text-ink outline-none focus:border-accent"
        />
        {state.fieldErrors?.message && (
          <p className="mt-2 text-xs text-accent">{state.fieldErrors.message}</p>
        )}
      </div>

      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm text-accent">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="bg-ink px-8 py-3 text-sm tracking-wide text-paper transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "送信中..." : "送信する"}
      </button>
    </form>
  );
}
