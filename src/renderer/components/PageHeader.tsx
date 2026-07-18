type PageHeaderProps = {
  title: string;
};

function PageHeader({ title }: PageHeaderProps) {
  return (
    <h1 className="mb-4 text-2xl font-semibold tracking-tight">{title}</h1>
  );
}

export default PageHeader;
