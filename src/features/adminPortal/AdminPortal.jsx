import { Link } from "react-router-dom";

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
    </div>
  );
}

export default AdminPortal;
