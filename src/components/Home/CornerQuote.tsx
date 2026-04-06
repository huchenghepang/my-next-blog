import { FC } from "react";
import CornerQuoteStyle from "./CornerQuote.module.scss";

interface TopLeftTipProps {
  title: string;
  text: string;
}

const CornerQuote: FC<TopLeftTipProps> = ({ title, text }) => {
  return (
    <div className={CornerQuoteStyle["CornerQuote-Container"]}>
      <div className={CornerQuoteStyle.ornament}>
        <span className={CornerQuoteStyle.dot}></span>
        <span className={CornerQuoteStyle.line}></span>
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
};

export default CornerQuote;
