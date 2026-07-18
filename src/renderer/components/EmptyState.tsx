type EmptyStateProps = {
  message?: string;
};

function EmptyState({ message = "Nothing here yet" }: EmptyStateProps) {
  return (
    <p className="m-4 text-center text-sm text-muted-foreground">{message}</p>
  );
}

export default EmptyState;
