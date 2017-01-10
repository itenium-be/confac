import React, { PropTypes, Component } from 'react';
import { browserHistory } from 'react-router';
import cn from 'classnames';
import { Modal, Button } from 'react-bootstrap';
import { t } from '../util.js';

export class Icon extends Component {
  static propTypes = {
    fa: PropTypes.string.isRequired,
    color: PropTypes.string,
    style: PropTypes.object,
    onClick: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
    className: PropTypes.string,
    label: PropTypes.string,
  };

  render() {
    const {fa, color, style, onClick, className, label, ...props} = this.props;
    var realClick = onClick;
    if (typeof onClick === 'string') {
      realClick = () => {
        browserHistory.push(onClick);
      };
    }

    return (
      <i
        {...props}
        className={cn(fa, className, {clickable: !!onClick})}
        onClick={realClick}
        style={{color: color, ...style}}
      >
        {label ? <span style={{marginLeft: 6}}>{label}</span> : null}
      </i>
    );
  }
}

export class ConfirmationIcon extends Component {
  static propTypes = {
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
      onClick: () => this.setState({popupActive: false})
    }, {
      text: t('delete'),
      bsStyle: 'danger',
      onClick: () => onClick()
    }];
    return (
      <div>
        {this.state.popupActive ? (
          <div>
            <Popup title={title} buttons={buttons}>{children}</Popup>
            <Icon fa="fa fa-minus-circle fa-2x" color="#CC1100" {...props} onClick={() => this.setState({popupActive: false})} />
          </div>
        ) : (
          <Icon fa="fa fa-minus-circle fa-2x" color="#CC1100" {...props} onClick={() => this.setState({popupActive: true})} />
        )}
      </div>
    );
  }
}

class Popup extends Component {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node,
    buttons: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.required,
      onClick: PropTypes.func.isRequired,
      bsStyle: PropTypes.string,
    })),
  };
  constructor() {
    super();
    this.state = {popupActive: false};
  }
  render() {
    return (
      <Modal.Dialog>
        <Modal.Header>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          {this.props.buttons.map((button, i) => (
            <Button key={i} bsStyle={button.bsStyle} onClick={button.onClick}>{button.text}</Button>
          ))}
        </Modal.Footer>

      </Modal.Dialog>
    );
  }
}

export const DeleteIcon = ({...props}) => (
  <Icon fa="fa fa-minus-circle fa-2x" color="#CC1100" {...props} />
);

export const AddIcon = ({...props}) => {
  return <Icon fa="fa fa-plus fa-2x" color="#FF8C00" {...props} />;
};
