type ScriptName = "iconfont" | "message_iconfont";

export default function IconfontJavaScript({
  scriptName,
}: {
  scriptName: ScriptName;
}) {
  return <script async src={`/svg/iconfont/${scriptName}.js`}></script>;
}

export const revalidate = false;
