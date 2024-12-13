import { useMemo, useRef, useState } from "react";
import styles from "./tanstack-table-filter.module.scss";
import { infoTable, InfoTableType } from "../data/test";
import {
 ColumnDef,
 FilterFn,
 flexRender,
 getCoreRowModel,
 getFilteredRowModel,
 getSortedRowModel,
 SortingState,
 useReactTable,
} from "@tanstack/react-table";
import Pagination from "../components/pagination/pagination";

// どこの配列から表示するか
const FIRST_PAGE_NATION_INDEX = 1;

// 表示するアイテム数
const DISPLAY_ITEM_INDEX = 20;

/**
 * 参考にしたサンプルコード
 * https://tanstack.com/table/latest/docs/framework/react/examples/expanding
 */
const TanstackTableFilter = () => {
 const [currentPagiNationIndex, setCurrentPagiNationIndex] = useState(
  FIRST_PAGE_NATION_INDEX
 );
 const [displayItemIndex, setDisplayItemIndex] = useState(DISPLAY_ITEM_INDEX);
 const [endPageIndex, setEndPageIndex] = useState(displayItemIndex);
 const handlePageChange = (i: number) => {
  const endPageIndex = displayItemIndex * i;
  setEndPageIndex(endPageIndex);
  setCurrentPagiNationIndex(i);
 };

 // 検索の実装
 const filterInputRef = useRef<HTMLInputElement>(null);
 const globalFilterRef = useRef<HTMLInputElement>(null);
 const [selectedColumn, setSelectedColumn] = useState("subscriberNumber"); // 部分検索用

 const handlePagiNationReset = () => {
  setCurrentPagiNationIndex(FIRST_PAGE_NATION_INDEX);
  setEndPageIndex(displayItemIndex);
 };

 const onChangeItemDisplaySelect = (
  e: React.ChangeEvent<HTMLSelectElement>
 ) => {
  // ページネーションの位置を初期値にする
  setCurrentPagiNationIndex(FIRST_PAGE_NATION_INDEX);

  // 表示数を変更
  const index = Number(e.currentTarget.value);
  setEndPageIndex(index);
  setDisplayItemIndex(index);
 };

 const columns = useMemo<ColumnDef<InfoTableType>[]>(
  () => [
   {
    accessorKey: "subscriberNumber",
    header: () => "加入者番号",
    // 文字列に変換しないとソートと検索がバグる
    accessorFn: (row) => row.subscriberNumber.toString(),
    filterFn: (row, columnId, filterValue) => {
     return row.getValue(columnId) === filterValue; // 完全一致
    },
   },
   {
    accessorKey: "beneficiaryNumber",
    header: () => "受給者番号",
    // 文字列に変換しないとソートと検索がバグる
    accessorFn: (row) => row.beneficiaryNumber.toString(),
    filterFn: (row, columnId, filterValue) => {
     return row.getValue(columnId) === filterValue; // 完全一致
    },
   },
   {
    accessorKey: "fullName",
    header: () => "氏名",
   },
   {
    accessorKey: "birthDate",
    header: () => "生年月日",
   },
   {
    accessorKey: "address",
    header: () => "住所",
   },
   {
    accessorKey: "status",
    header: () => "ステータス",
   },
  ],

  []
 );

 const [sorting, setSorting] = useState<SortingState>([]);

 // 完全一致フィルタの型を定義
 const exactMatchFilter: FilterFn<InfoTableType> = (
  row,
  columnId,
  filterValue
 ) => {
  const cellValue = row.getValue(columnId);
  return cellValue === filterValue; // 完全一致チェック
 };

 const [globalFilter, setGlobalFilter] = useState(""); // フィルタ値を管理

 const table = useReactTable({
  columns,
  data: infoTable,
  debugTable: true, // テーブルのデバッグモードを有効にする
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // クライアントサイドの並び替え
  getFilteredRowModel: getFilteredRowModel(), // フィルタリングを有効化
  onSortingChange: setSorting, // 独自のスコープ内で並び替え状態を制御しやすくするためのオプション
  state: {
   sorting, // 並び替えの状態
   globalFilter: globalFilter, // グローバルフィルタの初期値
  },
  globalFilterFn: exactMatchFilter, // 完全一致フィルタを適用
 });

 // 小数点は全て繰り上げ
 const totalPages = Math.ceil(
  table.getFilteredRowModel().rows.length / displayItemIndex
 );
 const startPageIndex = endPageIndex - displayItemIndex;

 return (
  <>
   <h2 className={styles.title}>検索機能</h2>
   <aside className={styles.aside}>
    <div className={styles.displayIndex}>
     全{table.getFilteredRowModel().rows.length}件中
     <select onChange={onChangeItemDisplaySelect}>
      <option value="20">20</option>
      <option value="40">40</option>
     </select>
     件表示
    </div>
    <ul className={styles.searchWrap}>
     <li>
      <span>部分検索</span>
      <input type="text" ref={filterInputRef} />
      <select
       value={selectedColumn}
       onChange={(e) => setSelectedColumn(e.target.value)}
      >
       {table.getAllColumns().map((column) => {
        return (
         <option key={column.id} value={column.id}>
          {(column.columnDef.header as () => string)()}
         </option>
        );
       })}
      </select>
      <button
       onClick={() => {
        //ページネーションリセット
        handlePagiNationReset();

        const val = filterInputRef.current?.value;
        // table.setGlobalFilter([]);
        setGlobalFilter("");
        table.setColumnFilters([{ id: selectedColumn, value: val }]);
       }}
      >
       検索
      </button>
     </li>
     <li>
      <span>全検索</span>
      <input type="text" ref={globalFilterRef} />
      <button
       onClick={() => {
        //ページネーションリセット
        handlePagiNationReset();

        const val = globalFilterRef.current?.value;
        table.setColumnFilters([]);
        // table.setGlobalFilter(val);
        setGlobalFilter(val ?? "");
       }}
      >
       検索
      </button>
     </li>
    </ul>
   </aside>
   <table className={styles.table}>
    <thead>
     {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
       {headerGroup.headers.map((header) => {
        return (
         <th key={header.id} colSpan={header.colSpan}>
          {header.isPlaceholder ? null : (
           <div
            className={
             header.column.getCanSort() ? "cursor-pointer select-none" : ""
            }
            onClick={header.column.getToggleSortingHandler()}
            title={
             header.column.getCanSort()
              ? header.column.getNextSortingOrder() === "asc"
                ? "Sort ascending"
                : header.column.getNextSortingOrder() === "desc"
                ? "Sort descending"
                : "Clear sort"
              : undefined
            }
           >
            {flexRender(header.column.columnDef.header, header.getContext())}
            {{
             asc: " 🔼",
             desc: " 🔽",
            }[header.column.getIsSorted() as string] ?? null}
           </div>
          )}
         </th>
        );
       })}
      </tr>
     ))}
    </thead>
    <tbody>
     {table
      .getFilteredRowModel()
      .rows.slice(startPageIndex, endPageIndex) // フィルタリング後のデータにページネーションを適用
      .map((row) => (
       <tr key={row.id}>
        {row.getVisibleCells().map((cell) => (
         <td key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
         </td>
        ))}
       </tr>
      ))}
    </tbody>
   </table>
   {totalPages > 1 && (
    <Pagination
     currentPage={currentPagiNationIndex}
     totalPages={totalPages}
     onPageChange={handlePageChange}
    />
   )}
  </>
 );
};

export default TanstackTableFilter;
