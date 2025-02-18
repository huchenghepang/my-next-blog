export default async function Test() {
  const message = await new Promise<string>((resolve) => {
    console.log("in executing sleep!");
    setTimeout(() => resolve("after 3000 ms!"), 10000);
  });
  return <h1>{message}</h1>;
}
