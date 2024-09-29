"use client";

import React, { useEffect, useState } from "react";
import StepButton from "./stepButton";
import TemplateList from "./templateList";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose } = props;
  const [step, setStep] = useState(1);

  // window.postMessageを受け取って、ステップを進める
  useEffect(() => {
    const onGetMessage = (event: MessageEvent) => {
      if (event.data.type == "openStep" && event.data.step === 2) setStep(2);
    };
    window.addEventListener("message", onGetMessage);
    return () => {
      window.removeEventListener("message", onGetMessage);
    };
  }, []);

  // モーダルの開閉状態とステップを監視してChrome拡張機能側に伝える
  useEffect(() => {
    const s = isOpen ? step : 0;
    window.postMessage({ type: "step", step: s }, "*");
  }, [isOpen, step]);

  // 拡張機能がインストールされているかチェック
  const checkExtensionInstalled = () => {
    return document.documentElement.classList.contains("hellooo-installed");
  };

  // インストール済みの場合はステップ2に進む
  useEffect(() => {
    if (checkExtensionInstalled()) setStep(2);
  }, [isOpen]);

  const handleNext = () => {
    if (step === 1 && !checkExtensionInstalled()) {
      alert("Chrome拡張機能がインストールされていません。");
      return;
    }
    setStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div className="modal__wrapper">
            <p className="modal__step">
              <span
                className={`modal__stepNumber ${step === 1 ? "active" : ""}`}
              >
                1
              </span>
              <span
                className={`modal__stepNumber ${step === 2 ? "active" : ""}`}
              >
                2
              </span>
              <span
                className={`modal__stepNumber ${step === 3 ? "active" : ""}`}
              >
                3
              </span>
            </p>
            <p className="modal__title">
              {step === 1 && "Chrome拡張機能を追加"}
              {step === 2 && "用紙の選択"}
              {step === 3 && "アカウントリストをドラッグ&ドロップ"}
            </p>
            <div className="modal__content">
              <p className="modal__text">
                {step === 1 && (
                  <>
                    <a href="" className="modal__link">
                      こちら
                    </a>
                    からChrome拡張機能を追加してください。
                  </>
                )}
                {step === 2 && "用紙を選択してください。"}
                {step === 3 &&
                  "このような形式で1アカウント1行のテキストファイルを用意してください。"}
              </p>
              {step == 2 && <TemplateList />}
            </div>
            <button onClick={onClose} className="modal__close"></button>
            <div className="modal__buttons">
              {step > 1 && (
                <StepButton
                  text="戻る"
                  onClick={handleBack}
                  classText="button__back"
                />
              )}
              {step < 3 && (
                <StepButton
                  text="次へ"
                  onClick={handleNext}
                  classText="button__next"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
