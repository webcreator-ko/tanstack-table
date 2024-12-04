import { useMemo, useState } from "react";
import styles from "./tanstack-table-two-sort.module.scss";
import { infoTable, InfoTableType } from "../data/test";
import {
 ColumnDef,
 flexRender,
 getCoreRowModel,
 SortingState,
 Updater,
 useReactTable,
} from "@tanstack/react-table";
import Pagination from "../components/pagination/pagination";

// どこの配列から表示するか
const FIRST_PAGE_NATION_INDEX = 1;

// 表示するアイテム数
const DISPLAY_ITEM_INDEX = 20;

const TanstackTableTwoSort = () => {
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

 //  TanStack Table のデフォルトのソート関数が「文字列用」に設計されてるので数字は文字列に変換しないとダメ
 //  デフォルトのソート関数の仕様:
 //  TanStack Table のデフォルトのソート関数は、内部で値を文字列に変換して比較します。
 //  そのため、数字が数値型のままだと正しく昇順→降順の切り替えができない場合があります。

 // 文字列化することで動作が安定:
 // 数値型を文字列に変換することで、デフォルトソート関数が正常に動作するようになり、ソートの切り替えが正しく行えるようになります。

 const columns = useMemo<ColumnDef<InfoTableType>[]>(
  () => [
   {
    accessorKey: "subscriberNumber",
    header: () => "加入者番号",
    // 文字列に変換しないとソートがばくる
    accessorFn: (row) => row.subscriberNumber.toString(),
   },
   {
    accessorKey: "beneficiaryNumber",
    header: () => "受給者番号",
    // 文字列に変換しないとソートがばくる
    accessorFn: (row) => row.beneficiaryNumber.toString(),
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

 const table = useReactTable({
  columns,
  data: infoTable,
  getCoreRowModel: getCoreRowModel(),
  state: {
   sorting, // ソート状態を保持
  },
  onSortingChange: (updaterOrValue: Updater<SortingState>) => {
   setSorting((currentSorting) => {
    // 2つのソートを可能にする
    // 2つのソートは被らない仕様にする
    const newSorting =
     typeof updaterOrValue === "function"
      ? updaterOrValue(currentSorting)
      : updaterOrValue;

    const pressedColumn = newSorting.find(
     (col) => !currentSorting.some((existing) => existing.id === col.id)
    );

    const current = pressedColumn || newSorting[0];

    if (!current) {
     // 全てのソートを解除
     return [];
    }

    const otherSorting = currentSorting.filter((col) => col.id !== current.id);

    const updatedSorting = [...currentSorting];

    const existingIndex = updatedSorting.findIndex(
     (col) => col.id === current.id
    );

    if (otherSorting.length === 0) {
     console.log("単一ソート中");

     const existingIndex = updatedSorting.findIndex(
      (col) => col.id === current.id
     );

     if (existingIndex !== -1) {
      const existing = updatedSorting[existingIndex];

      if (!existing.desc) {
       updatedSorting[existingIndex] = {
        ...existing,
        desc: true,
       };
      } else {
       updatedSorting.splice(existingIndex, 1);
      }
     } else {
      updatedSorting.push({ id: current.id, desc: false });
     }
    } else {
     console.log("複数ソート中");

     if (updatedSorting.length === 2 && existingIndex === -1) {
      // 3つめのソートを押した場合は、既存のソートは解除する
      return [{ id: current.id, desc: false }];
     }

     if (existingIndex !== -1) {
      // 押されたカラムが既存の場合
      console.log(1);
      const existing = updatedSorting[existingIndex];

      if (!existing.desc) {
       // 昇順 → 降順
       updatedSorting[existingIndex] = {
        ...existing,
        desc: true,
       };
      } else {
       // 降順 → 解除
       updatedSorting.splice(existingIndex, 1);
      }
     } else {
      console.log(2);
      // 押されたカラムが新規の場合（既存カラムの逆順から開始）
      updatedSorting.push({
       id: current.id,
       desc: !otherSorting[0].desc,
      });
     }

     // 他のソート済みカラムを調整
     if (updatedSorting.length === 2) {
      const [first, second] = updatedSorting;

      if (current.id === first.id) {
       console.log(3);
       // 押されたカラムが1つ目の場合、2つ目を逆順に調整
       updatedSorting[1] = { ...second, desc: !first.desc };
      } else {
       console.log(4);
       // 押されたカラムが2つ目の場合、1つ目を逆順に調整
       updatedSorting[0] = { ...first, desc: !second.desc };
      }

      // 特定のカラムが解除される場合
      if (updatedSorting[0].desc === updatedSorting[1].desc) {
       console.log(5);
       // 両方のソートが同じ方向になった場合、古い方を解除
       updatedSorting.splice(current.id === first.id ? 1 : 0, 1);
      }
     }
    }

    return updatedSorting;
   });
  },
  getSortedRowModel: undefined,
  enableMultiRowSelection: true,
  enableMultiSort: true,
  maxMultiSortColCount: 2,
 });

 return (
  <>
   <h2 className={styles.title}>2カラムだけソート可能にする</h2>
   <aside className={styles.aside}>
    全{infoTable.length}件中
    <select onChange={onChangeItemDisplaySelect}>
     <option value="20">20</option>
     <option value="40">40</option>
    </select>
    件表示
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
        <tr key={row.id}>
         {row.getVisibleCells().map((cell) => {
          return (
           <td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
           </td>
          );
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

export default TanstackTableTwoSort;
