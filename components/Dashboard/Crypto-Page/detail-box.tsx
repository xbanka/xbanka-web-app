export interface DetailBoxProp{
  label: string, 
  value: string | number
}

export const DetailBox = ({label, value}: DetailBoxProp) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-text font-medium text-xs leading-5">
        {label}
      </span>

      <span className="font-normal text-sm leading-6 text-card-text">
        {value}
      </span>
    </div>
  );
};
