type PopoverActionButtonProps = {
  children: React.ReactNode;
};

export const PopoverActionButton: React.FC<PopoverActionButtonProps> = ({
  children,
}) => {
  return (
    <div className="bg-accent/65 flex size-8 items-center justify-center rounded-full">
      {children}
    </div>
  );
};
