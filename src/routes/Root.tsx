import { Link } from 'react-router-dom';

const Root = () => {
  return (
    <div className="container">
      <h1>Root</h1>
      <Link to="/app">PhotoCollab</Link>
    </div>
  );
};

export default Root;
