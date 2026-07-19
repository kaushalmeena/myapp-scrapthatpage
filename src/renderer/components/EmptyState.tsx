export default function EmptyState({
  message = "Nothing here yet"
}: {
  message?: string;
}) {
  return (
    <p className="m-4 text-center text-sm text-muted-foreground">{message}</p>
  );
}
