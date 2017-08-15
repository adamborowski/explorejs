import React from 'react';
import PropTypes from 'prop-types';
import Question from '../../../components/common/Question';
import {connect} from 'react-redux';
import {compose} from 'redux';
import trans from '../../../translations/trans';

const QuestionsView = ({questions, answers, colors}, {trans}) => {
  return <ul className="list-group">
    {
      questions.map((q, i) => {
        return <Question
          key={i}
          value={answers[i]}
          question={trans(`finalForm.questions.${i}.question`)}
          colors={colors}
          type={q.type}
          answers={q.type === 'range' ? trans(`finalForm.questions.${i}.answers`) : null}
        />
      })
    }
  </ul>
};

QuestionsView.propTypes = {
  questions: PropTypes.array.isRequired,
  answers: PropTypes.any
};


const mapStateToProps = (state) => ({
  questions: state.testing.finalForm.questions,
  colors: state.testing.answers.map(a => a.color)
});

export default compose(connect(mapStateToProps), trans())(QuestionsView); //fixme update blocking by connect
