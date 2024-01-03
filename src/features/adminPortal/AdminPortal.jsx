import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExcelReader from '../../components/excelReader/ExcelReader';

function AdminPortal() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li><Link to="/excel-reader">Excel Reader</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/excel-reader" element={<ExcelReader />} />
        </Routes>
      </div>
    </Router>
  );
}

export default AdminPortal;
