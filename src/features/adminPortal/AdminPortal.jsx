import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ExcelReader from "../../components/ExcelReader/ExcelReader";

function AdminPortal() {
  return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/excel-reader">Excel Reader</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/excel-reader" element={<ExcelReader />} />
        </Routes>
      </div>
  );
}

export default AdminPortal;
