
import DownArrowWrapper from "../HotArticle/DownArrowWrapper";
interface Props {
  text: string;
}
const SideTitle = ({ text }: Props) => {
  return (
    <div className="flex justify-center items-center">
      <span className="text-2xl font-bold mr-2">{text}</span>
      <DownArrowWrapper
        idTarget="step-second-life"
        block="end"
      ></DownArrowWrapper>
    </div>
  );
};
export default SideTitle;