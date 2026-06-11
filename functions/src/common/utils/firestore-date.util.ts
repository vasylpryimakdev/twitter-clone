type FirestoreTimestampLike = {
  toDate: () => Date;
};

export function mapTimestamp(value: unknown): Date | null {
  if (!value) return null;

  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as FirestoreTimestampLike).toDate === "function"
  ) {
    return (value as FirestoreTimestampLike).toDate();
  }

  return new Date(value as string);
}
