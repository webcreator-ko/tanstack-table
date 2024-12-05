import styles from "./app.module.scss";
import ComplexHeadTable from "./parts/complexHeadTable";
import TanstackTable from "./parts/tanstack-table";
import TanstackTableCheckbox from "./parts/tanstack-table-checkbox";
import TanstackTableTwoSort from "./parts/tanstack-table-two-sort";

function App() {
 return (
  <div className={styles.wrap}>
   <TanstackTable />
   <TanstackTableCheckbox />
   <TanstackTableTwoSort />
   <ComplexHeadTable />
  </div>
 );
}

export default App;
