import PageTemplateFooter from './PageTemplateFooter';
import PageTemplateHeader from './PageTemplateHeader';
import PageTemplateMain from './PageTemplateMain';
import PageTemplateRoot from './PageTemplateRoot';

const PageTemplate = Object.assign(PageTemplateRoot, {
  Footer: PageTemplateFooter,
  Header: PageTemplateHeader,
  Main: PageTemplateMain,
  Root: PageTemplateRoot,
});

export default PageTemplate;
