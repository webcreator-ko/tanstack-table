import styles from "./app.module.scss";
import ComplexHeadTable from "./parts/complexHeadTable";
import TanstackTable from "./parts/tanstack-table";
import TanstackTableCheckbox from "./parts/tanstack-table-checkbox";
import TanstackTableFilter from "./parts/tanstack-table-filter";
import TanstackTableTwoSort from "./parts/tanstack-table-two-sort";

function App() {
 return (
  <div className={styles.wrap}>
   <TanstackTable />
   <TanstackTableCheckbox />
   <TanstackTableFilter />
   <TanstackTableTwoSort />
   <ComplexHeadTable />
  </div>
 );
}

export default App;
