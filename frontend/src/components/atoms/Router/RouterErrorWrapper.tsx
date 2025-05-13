import React from 'react';
import {useRouteError} from 'react-router';

namespace RouterErrorWrapper {
  export type Props = {
    component: (props: {error: Error}) => React.JSX.Element;
  };
}

function RouterErrorWrapper({component: Component}: RouterErrorWrapper.Props) {
  const error = useRouteError() as Error;
  return <Component error={error} />;
}

export default RouterErrorWrapper;
