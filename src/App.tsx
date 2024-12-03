import styles from "./app.module.scss";
import ComplexHeadTable from "./parts/complexHeadTable";
import TanstackTable from "./parts/tanstack-table";

function App() {
 return (
  <div className={styles.wrap}>
   <TanstackTable />
   <ComplexHeadTable />
  </div>
 );
}

export default App;
