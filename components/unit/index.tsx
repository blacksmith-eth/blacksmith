import { Listbox } from "@headlessui/react";
import { Units } from "hooks/useEther";
import { Dispatch, SetStateAction } from "react";

type UnitProps = {
  units: string[];
  unit: string;
  setUnit: Dispatch<SetStateAction<Units>>;
};

const Unit = ({ units, unit, setUnit }: UnitProps) => (
  <Listbox value={unit} onChange={setUnit as (value: string) => void}>
    <Listbox.Label className="sr-only">unit</Listbox.Label>
    <div className="relative text-right select-none">
      <Listbox.Button className="border border-black dark:border-white h-full w-full px-2 text-sm hover:bg-black hover:text-white focus:bg-black focus:text-white dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none">
        {unit}
      </Listbox.Button>
      <Listbox.Options className="bg-white dark:bg-black border border-black dark:border-white absolute mt-1 right-0 focus:outline-none z-10">
        {units.map((unit) => (
          <Listbox.Option
            key={unit}
            value={unit}
            className={({ active }) =>
              `${
                active
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : ""
              } px-2`
            }
          >
            {unit}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </div>
  </Listbox>
);

export default Unit;
