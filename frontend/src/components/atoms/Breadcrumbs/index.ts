import BreadcrumbsLink from './BreadcrumbsLink';
import BreadcrumbsList from './BreadcrumbsList';
import BreadcrumbsRoot from './BreadcrumbsRoot';
import BreadcrumbsText from './BreadcrumbsText';

const Breadcrumbs = Object.assign(BreadcrumbsRoot, {
  Link: BreadcrumbsLink,
  List: BreadcrumbsList,
  Root: BreadcrumbsRoot,
  Text: BreadcrumbsText,
});

export default Breadcrumbs;
