import React from "react";
import PropTypes from "prop-types";
import VSensor from "react-visibility-sensor";
class VisibilitySensor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: true,
    };
  }
  render() {
    const { active } = this.state;
    const { once, children, ...theRest } = this.props;
    return (
      <VSensor
        active={active}
        partialVisibility
        {...theRest}
      >
        {({ isVisible }) => children({ isVisible })}
      </VSensor>
    );
  }
}
VisibilitySensor.propTypes = {
  once: PropTypes.bool,
  children: PropTypes.func.isRequired,
};
VisibilitySensor.defaultProps = {
  once: false,
}
export default VisibilitySensor