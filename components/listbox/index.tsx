import { Listbox as HeadlessListbox } from "@headlessui/react";
import { Dispatch, SetStateAction } from "react";

type ListboxProps = {
  label: string;
  options: string[];
  selected: string;
  setSelected: Dispatch<SetStateAction<any>>;
};

export const Listbox = ({
  label,
  options,
  selected,
  setSelected,
}: ListboxProps) => (
  <HeadlessListbox value={selected} onChange={setSelected}>
    <HeadlessListbox.Label className="sr-only">{label}</HeadlessListbox.Label>
    <div className="relative text-right select-none">
      <HeadlessListbox.Button className="border border-black dark:border-white h-full w-full px-2 text-sm hover:bg-black hover:text-white focus:bg-black focus:text-white dark:hover:bg-white dark:hover:text-black dark:focus:bg-white dark:focus:text-black focus:outline-none">
        {selected}
      </HeadlessListbox.Button>
      <HeadlessListbox.Options className="bg-white dark:bg-black border border-black dark:border-white absolute mt-1 right-0 focus:outline-none z-10">
        {options.map((option) => (
          <HeadlessListbox.Option
            key={option}
            value={option}
            className={({ active }) =>
              `${
                active
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : ""
              } px-2`
            }
          >
            {option}
          </HeadlessListbox.Option>
        ))}
      </HeadlessListbox.Options>
    </div>
  </HeadlessListbox>
);
