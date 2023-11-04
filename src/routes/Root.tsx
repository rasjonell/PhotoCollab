import { Link } from 'react-router-dom';

const Root = () => {
  return (
    <div className="container">
      <h1>Welcome!</h1>
      <Link to="/app">Start Editing</Link>
    </div>
  );
};

export default Root;
