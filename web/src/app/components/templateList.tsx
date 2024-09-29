import React from "react";
import { Templates } from "../../../../common";
import TemplateOption from "./templateOptoin";

type TemplateListProps = {};

export default function TemplateList(props: TemplateListProps) {
  Templates.map((template) => {});
  return (
    <ul className="template__list">
      {Templates.map((template) => {
        return <TemplateOption data={template} />;
      })}
    </ul>
  );
}
