import React, { useCallback, useMemo } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { useFormReducer } from '../../hooks/useFormReducer';
import SearchStyle from "./Search.module.scss";

// 定义组件的 Props 类型
interface SearchProps {
  // 这里是组件的属性
    defaultValue?:string;
    onEnter?:(value:string)=>void
}

// 根据文件名生成组件
const Search: React.FC<SearchProps> = ({
  defaultValue = "",
  onEnter,
}: SearchProps) => {
  const { handleChange, formState, resetForm } = useFormReducer({
    searchValue: defaultValue,
  });

  const onEnterHanlder = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && onEnter) {
        onEnter(formState.searchValue); // 调用父组件传递的回调函数
      }
    },
    [formState.searchValue, onEnter],
  );

  return useMemo(
    () => (
      <div className={SearchStyle["search-container"]}>
        <IoIosSearch></IoIosSearch>
        <input
          type="text"
          className={SearchStyle["input-search"]}
          placeholder="search..."
          value={formState.searchValue}
          name="searchValue"
          onChange={handleChange}
          onKeyDown={onEnterHanlder}
          id="search-nav-top"
        />
        {formState.searchValue.length>0 && (
          <IoCloseCircleOutline onClick={resetForm}></IoCloseCircleOutline>
        )}
      </div>
    ),
    [formState.searchValue, handleChange, resetForm, onEnterHanlder],
  );
};

export default Search;