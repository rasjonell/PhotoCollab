import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div>
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{isRouteErrorResponse(error) ? error.statusText : 'Something Went Wrong :/'}</i>
      </p>
      <p>
        <Link to="/">Go Home</Link>
      </p>
    </div>
  );
};

export default ErrorPage;
