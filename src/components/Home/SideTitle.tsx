
import DownArrowWarpper from "../HotArticle/DownArrowWarpper";

const SideTitle = () => {
  return (
    <div className="flex justify-center items-center">
      <span className="text-2xl font-bold">生命中的每一步都意味着可能性</span>
      <DownArrowWarpper
        idTarget="step-second-life"
        block="end"
      ></DownArrowWarpper>
    </div>
  );
};
export default SideTitle;