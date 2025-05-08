import LoaderRoot from './LoaderRoot';
import LoaderSuspense from './LoaderSuspense';

const Loader = Object.assign(LoaderRoot, {
  Root: LoaderRoot,
  Suspense: LoaderSuspense,
});

export default Loader;
