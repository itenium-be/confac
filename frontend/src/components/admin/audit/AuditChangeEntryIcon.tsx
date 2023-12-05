import { AuditChange } from "./audit-models";

/** Display an icon for the audit diff type */
export const AuditChangeEntryIcon = (props: { diff: AuditChange; }) => {
  const commonStyle = { marginRight: 8 };
  switch (props.diff.kind) {
    case 'A':
      return <i className=" tst-icon-empty" style={commonStyle} />;
    case 'D':
      return <i className="fa fa-trash tst-icon-delete" style={{ color: 'red', ...commonStyle }} />;
    case 'E':
      return <i className="far fa-edit tst-icon-edit" style={{ color: 'gray', ...commonStyle }} />;
    case 'N':
      return <i className="fa fa-plus tst-icon-add" style={commonStyle} />;
    default:
      return null;
  }
};
