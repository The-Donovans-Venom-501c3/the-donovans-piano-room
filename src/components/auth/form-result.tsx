//message displaying success/failure of form
export interface FormResultProps {
  result?: string;
  message?: string;
}

export const FormResult = ({ result, message }: FormResultProps) => {
  // if (!message) return null;

  const styles =
    result === "success"
      ? "bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500"
      : "gap-x-2 rounded-md bg-red-100 p-3 text-sm text-red-600";

  return (
    <div className={styles}>
      <p>{message}</p>
    </div>
  );
};
