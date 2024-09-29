import React from "react";
import { LabelTemplate } from "../../../../common/_interface";

type TemplateOptionProps = {
  data: LabelTemplate;
};

export default function TemplateOption(props: TemplateOptionProps) {
  const { data } = props;
  return (
    <li>
      <div className="template__icon">
        <img src={`/template-icons/${data.iconImage}`} width={60} height={60} />
      </div>
      <div>
        <ul>
          <li className="template__maker">{data.maker}</li>
          <li className="template__model">
            <a href={data.url} target="_blank">
              {data.modelNumber}
            </a>
          </li>
          <li className="template__amazon">
            <a href={data.amazonUrl} target="_blank">
              Amazonで購入
            </a>
          </li>
        </ul>
      </div>
    </li>
  );
}
