"use client";

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose } = props;

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal__wrapper">
            <p className="modal__step">
              <span className="modal__stepNumber">1</span>
              <span className="modal__step">2</span>
              <span className="modal__step">3</span>
            </p>
            <p className="modal__title">Chrome拡張機能を追加</p>
            <div className="modal__content">
              <p className="modal__text">
                <a href="" className="modal__link">こちら</a>からChrome拡張機能を追加してください。
              </p>
            </div>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
