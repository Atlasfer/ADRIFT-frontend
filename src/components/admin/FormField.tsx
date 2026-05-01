// src/components/admin/FormField.tsx
"use client";

import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

interface BaseProps {
  label: string;
  error?: string;
}

interface InputProps extends BaseProps, InputHTMLAttributes<HTMLInputElement> {
  as?: "input";
}

interface SelectProps extends BaseProps, SelectHTMLAttributes<HTMLSelectElement> {
  as: "select";
  children: ReactNode;
}

interface TextareaProps extends BaseProps, TextareaHTMLAttributes<HTMLTextAreaElement> {
  as: "textarea";
}

type FormFieldProps = InputProps | SelectProps | TextareaProps;

const inputClass =
  "w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors";

export function FormField(props: FormFieldProps) {
  const { label, error, as = "input", ...rest } = props;

  return (
    <div>
      <label className="block text-sm font-medium text-zinc-300 mb-1.5">{label}</label>
      {as === "select" ? (
        <select {...(rest as SelectHTMLAttributes<HTMLSelectElement>)} className={inputClass}>
          {(rest as SelectProps).children}
        </select>
      ) : as === "textarea" ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={`${inputClass} resize-none`}
          rows={3}
        />
      ) : (
        <input {...(rest as InputHTMLAttributes<HTMLInputElement>)} className={inputClass} />
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
