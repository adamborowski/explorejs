import React, {PropTypes} from 'react';
const navButtons = (props) => {
  const {collection, currentItem, callback} = props;


  const index = collection.indexOf(currentItem);

  const hasPrev = index > 0;
  const hasNext = index < collection.length - 1;

  const leftButton = (
    <button onClick={hasPrev && (() => callback(collection[index - 1]))}
            type="button" className={`btn btn-sm btn-link`} disabled={!hasPrev}>
      <span className="glyphicon glyphicon-chevron-left" aria-hidden="true"/>
    </button>
  );

  const rightButton = (
    <button onClick={hasNext && (() => callback(collection[index + 1]))}
            type="button" className={`btn btn-sm btn-link`} disabled={!hasNext}>
      <span className="glyphicon glyphicon-chevron-right" aria-hidden="true"/>
    </button>
  );

  return <div>
    {leftButton}
    {rightButton}
  </div>
};

navButtons.propTypes = {
  collection: PropTypes.array,
  currentItem: PropTypes.any,
  callback: PropTypes.func
};

export default navButtons;


