import PrivateTemplateErrorBoundary from './PrivateTemplateErrorBoundary';
import PrivateTemplateRoot from './PrivateTemplateRoot';

const PrivateTemplate = Object.assign(PrivateTemplateRoot, {
  Root: PrivateTemplateRoot,
  ErrorBoundary: PrivateTemplateErrorBoundary,
});

export default PrivateTemplate;
