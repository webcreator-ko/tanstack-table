import { useState } from "react";
import styles from "./app.module.scss";
import Pagination from "./components/pagination/pagination";

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
  </div>
 );
}

export default App;
