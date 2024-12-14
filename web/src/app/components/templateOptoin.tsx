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
      <div className="template-list__inner">
        <div className="template-list__icon">
          <img
            src={`/template-icons/${data.iconImage}`}
            width={60}
            height={60}
          />
        </div>
        <div>
          <p className="template-list__model">
            <a href={data.url} target="_blank">
              {data.maker}&nbsp;/&nbsp;
              {data.modelNumber}
            </a>
          </p>
          <p className="template-list__amazon">
            <a href={data.amazonUrl} target="_blank">
              Amazonで購入
            </a>
          </p>
        </div>
      </div>
    </li>
  );
}
