import React from "react";
import { LabelTemplate } from "../../../../common/_interface";

type TemplateOptionProps = {
  data: LabelTemplate;
  selected: boolean;
  onSelect: (id: string) => void;
};

export default function TemplateOption(props: TemplateOptionProps) {
  const { data, selected, onSelect } = props;

  const onClick = () => {
    onSelect(data.id);
  };

  return (
    <li
      className={`template-list__option ${selected ? "selected" : ""}`}
      data-id={data.id}
      onClick={onClick}
    >
      <div className="template-list__icon">
        <img src={`/template-icons/${data.iconImage}`} width={60} height={60} />
      </div>
      <div>
        <ul>
          <li className="template-list__maker">{data.maker}</li>
          <li className="template-list__model">
            <a href={data.url} target="_blank">
              {data.modelNumber}
            </a>
          </li>
          <li className="template-list__amazon">
            <a href={data.amazonUrl} target="_blank">
              Amazonで購入
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
}
