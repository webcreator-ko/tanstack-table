import { useMemo, useRef, useState } from "react";
import styles from "./tanstack-table-checkbox.module.scss";
import { infoTable, InfoTableType } from "../data/test";
import {
 ColumnDef,
 flexRender,
 getCoreRowModel,
 getSortedRowModel,
 SortingState,
 useReactTable,
} from "@tanstack/react-table";
import Pagination from "../components/pagination/pagination";
import Checkbox from "../components/checkbox/checkbox";

// どこの配列から表示するか
const FIRST_PAGE_NATION_INDEX = 1;

// 表示するアイテム数
const DISPLAY_ITEM_INDEX = 20;

/**
 * 参考にしたサンプルコード
 * https://tanstack.com/table/latest/docs/framework/react/examples/expanding
 */
const TanstackTableCheckbox = () => {
 const [currentPageNationIndex, setCurrentPageNationIndex] = useState(
  FIRST_PAGE_NATION_INDEX
 );
 const [displayItemIndex, setDisplayItemIndex] = useState(DISPLAY_ITEM_INDEX);
 const [endPageIndex, setEndPageIndex] = useState(displayItemIndex);
 const handlePageChange = (i: number) => {
  const endPageIndex = displayItemIndex * i;
  setEndPageIndex(endPageIndex);
  setCurrentPageNationIndex(i);
 };

 // 小数点は全て繰り上げ
 const totalPages = Math.ceil(infoTable.length / displayItemIndex);
 const startPageIndex = endPageIndex - displayItemIndex;

 const onChangeItemDisplaySelect = (
  e: React.ChangeEvent<HTMLSelectElement>
 ) => {
  // ページネーションの位置を初期値にする
  setCurrentPageNationIndex(FIRST_PAGE_NATION_INDEX);

  // 表示数を変更
  const index = Number(e.currentTarget.value);
  setEndPageIndex(index);
  setDisplayItemIndex(index);
 };

 const columns = useMemo<ColumnDef<InfoTableType>[]>(
  () => [
   {
    accessorKey: "checkbox",
    header: () => "選択",
   },
   {
    accessorKey: "subscriberNumber",
    header: () => "加入者番号",
   },
   {
    accessorKey: "beneficiaryNumber",
    header: () => "受給者番号",
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
  // テーブルを切り替えて表示する場合は、その切り替える変数を入れないとテーブルが切り替わらないので注意する
  []
 );

 const [sorting, setSorting] = useState<SortingState>([]);

 const table = useReactTable({
  columns,
  data: infoTable,
  debugTable: true, // テーブルのデバッグモードを有効にする
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(), // クライアントサイドの並び替え
  onSortingChange: setSorting, // 独自のスコープ内で並び替え状態を制御しやすくするためのオプション
  //   onSortingChange: (updater) => {
  //    // ソート状態を更新するだけでデータの並び替えは行わない
  //    setSorting(typeof updater === "function" ? updater(sorting) : updater);
  //   },
  // sortingFns: {
  //   sortStatusFn, // またはカスタム並び替え関数をグローバルに提供して、すべての列で使用可能にする
  // },
  // クライアントサイドのページネーションの場合、pageCount や rowCount を渡す必要はありません。自動的に計算されます。
  state: {
   sorting, // 並び替えの状態
  },
  // autoResetPageIndex: false, // 並び替えやフィルタリング時にページインデックスをリセットしないようにする - デフォルトはオン/true
  // enableMultiSort: false, // Shiftキーを使用した複数列の並び替えを無効化 - デフォルトはオン/true
  // enableSorting: false, // 並び替え機能を無効化 - デフォルトはオン/true
  // enableSortingRemoval: false, // 並び替えの解除を許可しない - デフォルトはオン/true
  // isMultiSortEvent: (e) => true, // すべてのクリックで複数列の並び替えを有効にする - デフォルトは Shiftキーが必要
  // maxMultiSortColCount: 3, // 同時に並び替え可能な列数を3に制限する - デフォルトは無制限 (Infinity)
 });

 // この ref を使用してないけど、使用サンプルとして残しとく
 //  const refs = useRef<RefObject<HTMLInputElement>[]>([]);

 //  const onClickInputElement = (index: number) => {
 //   console.log(index);
 //   console.log(refs.current[index].current?.checked);
 //   if (!refs.current[index].current) return;
 //   const isChecked = refs.current[index].current?.checked;
 //   refs.current[index].current.checked = !isChecked;
 //  };

 // チェックボックスの切り替え
 const toggleRowSelection = (rowId: string, isSelected: boolean) => {
  table.setRowSelection((prev) => ({
   ...prev,
   [rowId]: !isSelected,
  }));
 };

 // すべての行を選択または選択解除する関数
 const isCheckboxRef = useRef<boolean>(false);
 const toggleAllRowsSelection = () => {
  const newSelection: Record<string, boolean> = {};
  if (!isCheckboxRef.current) {
   // 表示している行
   table
    .getRowModel()
    .rows.slice(startPageIndex, endPageIndex)
    .forEach((row) => {
     newSelection[row.id] = true; // 表示されている行を選択
    });

   // 全ての行
   //  table.getCoreRowModel().rows.forEach((row) => {
   //   newSelection[row.id] = true;
   //  });

   isCheckboxRef.current = true;
  } else {
   // 表示している行
   table
    .getRowModel()
    .rows.slice(startPageIndex, endPageIndex)
    .forEach((row) => {
     newSelection[row.id] = false;
    });

   // 全ての行
   //  table.getCoreRowModel().rows.forEach((row) => {
   //   newSelection[row.id] = false;
   //  });

   isCheckboxRef.current = false;
  }
  table.setRowSelection(newSelection);
 };

 // 現在選択されている行のIDを取得
 const getSelectedCheckboxIds = () => {
  const selectedRowIds = Object.keys(table.getState().rowSelection).filter(
   (rowId) => table.getState().rowSelection[rowId] === true
  );
  console.log("選択された行のID:", selectedRowIds);
 };

 return (
  <>
   <h2 className={styles.title}>チェックボックス機能</h2>
   <aside className={styles.aside}>
    <div className={styles.displayIndex}>
     全{infoTable.length}件中
     <select onChange={onChangeItemDisplaySelect}>
      <option value="20">20</option>
      <option value="40">40</option>
     </select>
     件表示
    </div>
    <ul className={styles.button}>
     <li>
      <button type="button" onClick={toggleAllRowsSelection}>
       全選択
      </button>
     </li>
     <li>
      <button type="button" onClick={getSelectedCheckboxIds}>
       選択したチェックボックス
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
      .getRowModel()
      .rows.slice(startPageIndex, endPageIndex)
      .map((row) => {
       return (
        <tr
         key={row.id}
         onClick={() => toggleRowSelection(row.id, row.getIsSelected())}
        >
         {row.getVisibleCells().map((cell, i) => {
          // getValueでも取得可能
          //     const id =
          //     cell.column.id
          // const cellValue =
          //     cell.getValue() as string

          // 重要なポイント
          // cell.getValue() を使う
          // cell.getValue() は、指定したセルに紐付けられた実際のデータを返します。
          // これにより、flexRender を使用する必要がなくなります。

          // flexRender を使う場合
          // flexRender は、カスタムセルのレンダリングに必要です。ただし、単純なデータを取得する場合には不要です。
          // cell.getValue() と組み合わせることで、レンダリング前の値も取得できます。

          // もしカスタムセルが flexRender を使用しており、そこに値が埋め込まれている場合は以下のようにデバッグして値を探すことができます。
          // console.log(cell.getContext());

          if (cell.id.includes("checkbox")) {
           //  refs.current[r] = createRef<HTMLInputElement>();

           return (
            <td key={cell.id}>
             <Checkbox
              // ref={refs.current[r]}
              id={i.toString()}
              isChecked={row.getIsSelected()}
              onChange={row.getToggleSelectedHandler()}
             />
            </td>
           );
          } else {
           return (
            <td key={cell.id}>
             {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
           );
          }
         })}
        </tr>
       );
      })}
    </tbody>
   </table>
   <Pagination
    currentPage={currentPageNationIndex}
    totalPages={totalPages}
    onPageChange={handlePageChange}
   />
  </>
 );
};

export default TanstackTableCheckbox;
