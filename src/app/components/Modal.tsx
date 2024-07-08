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
          <div className="modal-content">
            <h2>Chrome拡張機能を追加</h2>
            <div>
              <p>
                <a href="">こちら</a>からChrome拡張機能を追加してください
              </p>
            </div>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      )}
    </>
  );
}
