import { statusBadgeClass } from '../../utils/inventoryUtils';

export default function Badge({ children, variant }) {
  const className = variant || statusBadgeClass(children);
  return <span className={className}>{children}</span>;
}
