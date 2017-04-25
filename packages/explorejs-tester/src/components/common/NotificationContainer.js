import React, {PropTypes} from 'react';
import {connect} from 'react-redux';
import  './NotificationContainer.scss';
import {closeNotification} from '../../actions/notificationActions.js';
export const NotificationContainer = (props) => {
  return (
    <div className="a-notification-container">
      {props.notifications.map(n =>
        <div key={n.id} className={`alert alert-dismissible alert-${n.type}`}>
          <button type="button" className="close" data-dismiss="alert" aria-label="Close"
                  onClick={() => props.onMessageClose(n.id)}>
            <span aria-hidden="true">&times;</span>
          </button>
          {n.message}
        </div>
      )}
    </div>
  );
};
NotificationContainer.propTypes = {
  notifications: PropTypes.array.isRequired
};

const mapStateToProps = ({notifications}) => ({notifications});

const mapDispatchToProps = (dispatch) => ({
  onMessageClose: (id) => {
    dispatch(closeNotification(id))
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(NotificationContainer);
