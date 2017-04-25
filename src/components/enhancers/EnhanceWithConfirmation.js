import React, {Component, PropTypes} from 'react';
import {Popup} from '../controls/Popup.js';
import {t} from '../util.js';

export const EnhanceWithConfirmation = ComposedComponent => class extends Component {
  static propTypes = {
    'data-tst': PropTypes.string.isRequired,
    onClick: PropTypes.func,
    title: PropTypes.string,
    children: PropTypes.node,
  };
  constructor() {
    super();
    this.state = {popupActive: false};
  }
  render() {
    const {onClick, title, children,...props} = this.props;
    const buttons = [{
      text: t('no'),
      onClick: () => this.setState({popupActive: false}),
      busy: true,
    }, {
      text: t('delete'),
      bsStyle: 'danger',
      onClick: () => {
        this.setState({popupActive: false});
        onClick();
      },
      busy: true,
    }];
    return (
      <div style={{display: 'inline'}}>
        {this.state.popupActive ? (
          <div style={{display: 'inline'}}>
            <Popup title={title} buttons={buttons} onHide={() => this.setState({popupActive: false})} data-tst={props['data-tst'] + '-popup'}>
              {children}
            </Popup>
            <ComposedComponent {...props} onClick={() => this.setState({popupActive: false})} />
          </div>
        ) : (
          <ComposedComponent {...props} onClick={() => this.setState({popupActive: true})} />
        )}
      </div>
    );
  }
};
