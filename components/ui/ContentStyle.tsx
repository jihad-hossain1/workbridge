export const ContentStyle = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <fieldset className="border border-zinc-200 rounded-lg p-4 bg-white shadow-sm min-w-0">
      <legend className="px-2 font-medium text-gray-700">{title}</legend>
      {children}
    </fieldset>
  );
};
