export interface IInputErrorState {
  success: boolean;
  errors: {
    field: string;
    message: string;
  }[];
}

export function toInputErrorState(
  state: { success?: boolean; errors?: unknown } | null | undefined
): IInputErrorState {
  const errors: IInputErrorState["errors"] = [];
  if (Array.isArray(state?.errors)) {
    for (const item of state.errors) {
      if (!item || typeof item !== "object") continue;
      const field = "field" in item ? item.field : undefined;
      const message = "message" in item ? item.message : undefined;
      if (
        (typeof field === "string" || typeof field === "number") &&
        typeof message === "string"
      ) {
        errors.push({ field: String(field), message });
      }
    }
  }
  return {
    success: state?.success ?? false,
    errors,
  };
}

export const getInputFieldError = (
  fieldName: string,
  state: IInputErrorState | null | undefined
) => {
  const errors = state ? toInputErrorState(state).errors : [];
  const error = errors.find((err) => err.field === fieldName);
  return error ? error.message : null;
};
