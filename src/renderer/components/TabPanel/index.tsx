import React, { ReactNode } from "react";

type TabPanelProps = {
  value: number;
  index: number;
  children: ReactNode;
};

const TabPanel = (props: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={props.value !== props.index}>
      {props.value === props.index && props.children}
    </div>
  );
};

export default TabPanel;
