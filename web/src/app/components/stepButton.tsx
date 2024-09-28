import React from "react";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  classText: string;
};

export default function stepButton(props: ButtonProps) {
  const { text, onClick, classText } = props;
  return (
    <button className={`button__step ${classText}`} onClick={onClick}>
      <p className="button__step-text">{text}</p>
    </button>
  );
}
