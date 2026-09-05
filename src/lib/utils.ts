export type ClassValue = string | number | boolean | undefined | null;

export function cx(...inputs: ClassValue[]): string {
  return inputs.filter(Boolean).join(" ");
}

export const cn = cx;
