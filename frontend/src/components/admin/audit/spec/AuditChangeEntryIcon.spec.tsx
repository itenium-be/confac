import renderer from 'react-test-renderer';
import {AuditChange} from '../audit-models';
import {AuditChangeEntryIcon} from '../AuditChangeEntryIcon';

describe('AuditChangeEntryIcon', () => {
  it('creates a fa-plus for NEW entries', () => {
    const diff = {kind: 'N'} as AuditChange;
    const tree = renderer.create(<AuditChangeEntryIcon diff={diff} />);

    expect(tree).toMatchInlineSnapshot(`
<i
  className="fa fa-plus"
  style={
    {
      "marginRight": 8,
    }
  }
/>
`);
  });

  it('creates a fa-trash for deleted entries', () => {
    const diff = {kind: 'D'} as AuditChange;
    const tree = renderer.create(<AuditChangeEntryIcon diff={diff} />);

    expect(tree).toMatchInlineSnapshot(`
<i
  className="fa fa-trash"
  style={
    {
      "color": "red",
      "marginRight": 8,
    }
  }
/>
`);
  });
});
