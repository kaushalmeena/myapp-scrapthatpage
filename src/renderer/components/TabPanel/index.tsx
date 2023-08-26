import { ReactNode } from "react";

type TabPanelProps = {
  value: number;
  index: number;
  children: ReactNode;
};

function TabPanel({ value, index, children }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && children}
    </div>
  );
}

export default TabPanel;
