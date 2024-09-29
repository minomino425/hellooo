import React, { useEffect, useState } from "react";
import { Templates } from "../../../../common";
import TemplateOption from "./templateOptoin";

type TemplateListProps = {};

export default function TemplateList(props: TemplateListProps) {
  // 開閉
  const [isOpen, setIsOpen] = useState(false);
  // 選択中のテンプレートID
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(
    Templates[0]!.id,
  );

  // テンプレート選択時にChrome拡張機能側に通知
  useEffect(() => {
    window.postMessage({ type: "selectTemplate", selectedTemplateId }, "*");
  }, [selectedTemplateId]);

  const onSelect = (id: string) => {
    if (isOpen) {
      setSelectedTemplateId(id);
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  };

  return (
    <ul className={`template-list ${isOpen ? "open" : ""}`}>
      {Templates.map((template, i) => {
        if (!isOpen && template.id != selectedTemplateId) {
          return null;
        }
        return (
          <TemplateOption
            key={i}
            data={template}
            selected={template.id == selectedTemplateId}
            onSelect={onSelect}
          />
        );
      })}
    </ul>
  );
}
