import { useState } from "react";
import styles from "./app.module.scss";
import Pagination from "./components/pagination/pagination";
import Checkbox from "./components/checkbox/checkbox";

function App() {
 const [currentPageIndex, setCurrentPageIndex] = useState(1);
 const handlePageChange = (i: number) => setCurrentPageIndex(i);

 const totalPages = 100;

 return (
  <div className={styles.wrap}>
   <p>
    全9,999件中
    <select>
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
     <tr>
      <td>9999999999</td>
      <td>9999999999</td>
      <td>山田 太郎</td>
      <td>昭和30年11月4日</td>
      <td>東京都千代田区1-2-3</td>
      <td>対応完了</td>
     </tr>
     <tr>
      <td>9999999999</td>
      <td>9999999999</td>
      <td>山田 太郎</td>
      <td>昭和30年11月4日</td>
      <td>東京都千代田区1-2-3</td>
      <td>対応完了</td>
     </tr>
     <tr>
      <td>9999999999</td>
      <td>9999999999</td>
      <td>山田 太郎</td>
      <td>昭和30年11月4日</td>
      <td>東京都千代田区1-2-3</td>
      <td>対応完了</td>
     </tr>
     <tr>
      <td>9999999999</td>
      <td>9999999999</td>
      <td>山田 太郎</td>
      <td>昭和30年11月4日</td>
      <td>東京都千代田区1-2-3</td>
      <td>対応完了</td>
     </tr>
    </tbody>
   </table>
   <Pagination
    currentPage={currentPageIndex}
    totalPages={totalPages}
    onPageChange={handlePageChange}
   />
   <aside className={styles.aside}>
    <h2>複雑なth</h2>
    <table className={styles.asideTable}>
     <thead>
      {/* 1行目 */}
      <tr>
       <th rowSpan={3}>th1</th>
       <th colSpan={2}>th2</th>
       <th colSpan={2}>th6</th>
       {/* ここの colSpan は最終的に子の列数はいくつになるか */}
       <th colSpan={7}>th11</th>
      </tr>
      {/* 2行目 */}
      <tr>
       <th colSpan={2}>th3</th>
       <th>th7</th>
       <th>th8</th>
       <th colSpan={3}>th12</th>
       <th>th13</th>
       <th colSpan={2}>th14</th>
      </tr>
      {/* 3行目 */}
      <tr>
       <th>th4</th>
       <th>th5</th>
       <th>th9</th>
       <th>th10</th>
       <th>th15</th>
       <th>th16</th>
       <th>th17</th>
       <th>th18</th>
       <th>th19</th>
       <th>th20</th>
      </tr>
     </thead>
     <tbody>
      <tr>
       <td colSpan={11}>
        <Checkbox id="row1" className={styles.checkbox}>
         <span className={styles.number}>1</span>
         <span className={styles.text}>20年以上60歳以上</span>
        </Checkbox>
       </td>
      </tr>
      <tr>
       <td colSpan={11}>
        <Checkbox id="row2" className={styles.checkbox}>
         <span className={styles.number}>1</span>
         <span className={styles.text}>加入者期間20年以上60歳未満</span>
        </Checkbox>
       </td>
      </tr>
      <tr>
       <td colSpan={11}>
        <Checkbox id="row3" className={styles.checkbox}>
         <span className={styles.number}>1</span>
         <span className={styles.text}>加入者期間20年以上60歳以上</span>
        </Checkbox>
       </td>
      </tr>
     </tbody>
    </table>
   </aside>
  </div>
 );
}

export default App;
