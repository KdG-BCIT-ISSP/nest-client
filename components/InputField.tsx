
import { InputFieldProp } from "@/types/InputFieldProp";
import React from "react";

function InputField({ labelText, value, name, id, onChange, type = "text", placeholder = "" }: InputFieldProp) {
  return (
    <div className="flex flex-col w-full mb-4">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor={id}>{labelText}</label>
      <input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  );
}

export default InputField;