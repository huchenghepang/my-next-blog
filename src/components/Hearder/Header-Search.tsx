import { fetcherClient } from "@/utils/fetcher/fetcherClient";
import { FC, useRef } from "react";
import SearchIcon from "../Icons/Search";

interface HeaderSearchProps {
  // 这里是组件的属性
  placeholder?: string;
}

const HeaderSearch: FC<HeaderSearchProps> = ({ placeholder }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const keyword = inputRef.current?.value;
    if (keyword !== "") {
      fetcherClient<{ redirect: string }>(
        "/api/article/keyword?" + "keyword=" + keyword,
        { method: "GET" }
      )
        .then((res) => {
          if (res.body) {
            window.location.href = res.body.data.redirect;
          }
        })
        .catch();
    }
  };
  return (
    <form className="relative flex md:block" onSubmit={handleSubmit}>
      <span className="absolute inset-y-0 left-1 flex items-center pl-2">
        <button
          type="submit"
          className="p-2 focus:outline-none focus:ring mr-2"
        >
          <SearchIcon></SearchIcon>
        </button>
      </span>

      <input
        type="search"
        ref={inputRef}
        name="Search"
        placeholder={placeholder}
        autoComplete="off"
        className="w-40 py-2 pl-6  text-sm text-black dark:text-gray-800 rounded-md focus:outline-none ml-4"
      />
    </form>
  );
};

export default HeaderSearch;
