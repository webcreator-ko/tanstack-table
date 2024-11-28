import { useEffect, useState } from "react";
import styles from "./app.module.scss";
import Pagination from "./components/pagination/pagination";
import { infoTable } from "./data/test";
import ComplexTable from "./parts/complexTable";

// どこの配列から表示するか
const FIRST_PAGE_NATION_INDEX = 1;

// 表示するアイテム数
const DISPLAY_ITEM_INDEX = 20;

function App() {
 const [currentPageNationIndex, setCurrentPageNationIndex] = useState(
  FIRST_PAGE_NATION_INDEX
 );
 const [displayItemIndex, setDisplayItemIndex] = useState(DISPLAY_ITEM_INDEX);
 const [endPageIndex, setEndPageIndex] = useState(displayItemIndex);
 const handlePageChange = (i: number) => setCurrentPageNationIndex(i);
 // 小数点は全て繰り上げ
 const totalPages = Math.ceil(infoTable.length / displayItemIndex);
 const startPageIndex = endPageIndex - displayItemIndex;

 useEffect(() => {
  const endPageIndex = displayItemIndex * currentPageNationIndex;
  setEndPageIndex(endPageIndex);
 }, [currentPageNationIndex, displayItemIndex]);

 const onChangeItemDisplaySelect = (
  e: React.ChangeEvent<HTMLSelectElement>
 ) => {
  // ページネーションの位置を初期値にする
  setCurrentPageNationIndex(FIRST_PAGE_NATION_INDEX);
  setEndPageIndex(DISPLAY_ITEM_INDEX);

  // 表示数を変更
  const index = Number(e.currentTarget.value);
  setDisplayItemIndex(index);
 };

 return (
  <div className={styles.wrap}>
   <p>
    全9,999件中
    <select onChange={onChangeItemDisplaySelect}>
     <option value="20">20</option>
     <option value="40">40</option>
    </select>
    件表示
   </p>
   <table className={styles.table}>
    <thead>
     <tr>
      <th>加入者番号</th>
      <th>受給者番号</th>
      <th>氏名</th>
      <th>生年月日</th>
      <th>住所</th>
      <th>ステータス</th>
     </tr>
    </thead>
    <tbody>
     {infoTable.slice(startPageIndex, endPageIndex).map((e) => (
      <tr key={e.id}>
       <td>{e.subscriberNumber}</td>
       <td>{e.beneficiaryNumber}</td>
       <td>{e.fullName}</td>
       <td>{e.birthDate}</td>
       <td>{e.address}</td>
       <td>{e.status}</td>
      </tr>
     ))}
    </tbody>
   </table>
   <Pagination
    currentPage={currentPageNationIndex}
    totalPages={totalPages}
    onPageChange={handlePageChange}
   />
   <ComplexTable />
  </div>
 );
}

export default App;
