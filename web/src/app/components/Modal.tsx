"use client";

import React, { SyntheticEvent, useEffect, useRef, useState } from "react";
import TemplateList from "./templateList";
import "@/styles/_modal.scss";
import { text } from "stream/consumers";

interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export default function Modal(props: ModalProps) {
  const { isOpen, onClose } = props;
  const [step, setStep] = useState(1);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [accountText, setAccountText] = useState<string>(
    "@hellooo_card\n@casestudy_info\n@kjkmr\n@WebMino",
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (step == 3 && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isOpen, step]);

  // 拡張機能がインストールされているかチェック
  const checkExtensionInstalled = () => {
    return document.documentElement.classList.contains("hellooo-installed");
  };

  // インストール済みの場合はステップ2に進む
  useEffect(() => {
    if (checkExtensionInstalled()) setStep(2);
  }, [isOpen]);

  // テキストエリアの設定
  useEffect(() => {
    if (!textareaRef.current) return;
    console.log(textareaRef.current);
    textareaRef.current.addEventListener("focus", () => {
      if (!textareaRef.current) return;
      console.log(textareaRef.current);
      // テキストエリアの内容を全選択
      textareaRef.current.select();
    });
  }, [textareaRef.current]);

  /**
   * テキストエリアの内容が変更された時
   */
  const onTextAreaChange = (event: SyntheticEvent) => {
    if (!textareaRef.current) return;
    const text = textareaRef.current.value;
    setAccountText(text);
  };

  /**
   * 作成ボタンクリック時
   */
  const handleCreate = () => {
    if (!checkExtensionInstalled()) {
      alert("Chrome拡張機能がインストールされていません。");
      setStep(1);
      return;
    }
  };

  /**
   *
   * @param id
   */
  const handleSelectTemplate = (id: string | null) => {
    setTemplateId(id);
    if (id) {
      window.postMessage(
        { type: "selectTemplate", selectedTemplateId: id },
        "*",
      );
    }
  };

  /**
   * テンプレートの決定ボタンクリック時
   */
  const handleSetTemplate = () => {
    setStep(3);
  };

  /**
   * Step1
   */
  const step1 = () => {
    return (
      <div className="modal__step1">
        <a href="" target="_blank">
          <img src="/images/extension-icon.svg" width="120" height="120" />
        </a>
        {checkExtensionInstalled() ? (
          <p className="modal__text">Chrome拡張機能はインストール済みです。</p>
        ) : (
          <p className="modal__text">
            Hellooo!をご利用いただくには、
            Xのアイコン画像取得のためのChrome拡張機能が必要です。
            <br />
            <a href="" target="_blank" className="modal__link">
              こちら
            </a>
            からインストールしてください。
          </p>
        )}
      </div>
    );
  };

  /**
   * Step2
   */
  const step2 = () => {
    return (
      <div className="modal__step2">
        <p className="modal__text">
          印刷するシール用紙を選択してください。
          <br />
          （選択肢にないものは未対応です）
        </p>
        <div className="modal__step2__list">
          <TemplateList
            onSelect={handleSelectTemplate}
            templateId={templateId}
          />
          <button className="modal__button" onClick={handleSetTemplate}>
            決定
          </button>
        </div>
      </div>
    );
  };

  /**
   * Step3
   */
  const step3 = () => {
    return (
      <div className="modal__step3">
        <textarea
          ref={textareaRef}
          onChange={onTextAreaChange}
          value={accountText}
        />
        <div>
          <p className="modal__text">
            シールを作成するアカウントのリスト（1行に1アカウント）を入力するか、テキストファイルをドラッグ&ドロップしてください。
          </p>
          <button className="modal__button" onClick={handleCreate}>
            作成開始！
          </button>
        </div>
      </div>
    );
  };

  /**
   * Tab
   */
  const stepNav = () => {
    return (
      <nav className="modal__nav">
        <ul>
          <li
            className={`modal__navItem ${step === 1 ? "active" : ""} ${checkExtensionInstalled() ? "done" : ""}`}
          >
            <a href="#" onClick={() => setStep(1)}>
              <span>1</span>
              拡張機能
            </a>
          </li>
          <li
            className={`modal__navItem ${step === 2 ? "active" : ""} ${templateId ? "done" : ""}`}
          >
            <a href="#" onClick={() => setStep(2)}>
              <span>2</span>
              用紙選択
            </a>
          </li>
          <li className={`modal__navItem ${step === 3 ? "active" : ""}`}>
            <a href="#" onClick={() => setStep(3)}>
              <span>3</span>
              Xアカウント
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <>
      {isOpen && (
        <>
          <div className="modal">
            <div className="modal__bg" onClick={onClose}></div>
            <div className="modal__wrapper">
              {stepNav()}
              <div className="modal__content">
                {step === 1 && step1()}
                {step === 2 && step2()}
                {step === 3 && step3()}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
