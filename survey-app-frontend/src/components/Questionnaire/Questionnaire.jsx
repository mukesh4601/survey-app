import React, { PureComponent } from "react";
import "./Questionnaire.scss";
import { Radio, message, Progress } from "antd";
import { connect } from "react-redux";
import actions from "../../Store/Actions/index";
import { withRouter } from "react-router";
import Result from "./Result";
import Loader from "../Loader/Loader";

class Questionnaire extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      _questions: [],
      currentQuestion: [],
      curPos: 1,
      currentOptionsChoice: null,
      setQuestionWithAnswer: [],
      FinalScore: -1,
      riskscore: "",
      Response: "",
      SurveyID: "",
      LastQuestionId: "",
      value: null,
      ques: [],
      currentAnswer: null,
      SurveyShortCode: "",
      loader: true,
      welcome: true,
    };
    this.showNext = this.showNext.bind(this);
  }

  async componentDidMount() {
    this.props.riskquestions().then(() => {
      let nextProps = this.props;
      let tempId = nextProps.list_questions.risk_questions[0].firstItemId;
      let firstQuestion =
        nextProps.list_questions.risk_questions[0].questions.filter(
          (q) => q.id === tempId
        ) || [];
      this.setState({
        _questions: nextProps.list_questions.risk_questions[0].questions || [],
        setQuestionWithAnswer:
          nextProps.list_questions.risk_questions[0].questions || [],
        currentQuestion: firstQuestion[0],
        currentAnswer:
          nextProps.list_questions.risk_questions[0].questions[0].answer,
        SurveyID:
          nextProps.list_questions.risk_questions[0].survey.surveyMasterId,
        SurveyShortCode:
          nextProps.list_questions.risk_questions[0].survey.surveyShortCode,
      });
    });
  }

  loadBack = async (evt) => {
    evt.preventDefault();
    this.setState({
      currentQuestion: this.state.setQuestionWithAnswer[this.state.curPos - 2],
      curPos: this.state.curPos - 1,
      currentAnswer:
        this.state.setQuestionWithAnswer[this.state.curPos - 2].answer,
    });
  };

  async showNext(evt) {
    evt.preventDefault();
    if (!this.state.currentAnswer) {
      message.error("Please Choose One");
      return;
    }
    let lookUp = this.state.currentOptionsChoice;

    if (lookUp === null) {
      lookUp = this.state.currentQuestion.nextId;
    }
    let question = this.state._questions.filter((q) => q.id === lookUp);
    if (question.length > 0) {
      this.setState({
        currentAnswer: null || question[0].answer,
        currentQuestion: question[0],
        curPos: ++this.state.curPos,
      });
    } else {
      lookUp = null;
    }

    if (lookUp === null) {
      var x = 0;
      let { setQuestionWithAnswer } = { ...this.state };
      let _response = this.state.setQuestionWithAnswer.map((q) => {
        return { q: q.questionId, a: q.answer };
      });
      var last = _response[_response.length - 1];
      this.setState({
        Response: _response,
      });
      setQuestionWithAnswer.map((option) => {
        x += parseFloat(option.answerValue);
      });

      this.setState({
        FinalScore: x,
        LastQuestionId: last.q,
      });

      function between(x, min, max) {
        return x >= min && x <= max;
      }
      if (between(x, 0.0, 37)) {
        this.setState({
          riskscore: "Highly Conservative Investor",
        });
      } else if (between(x, 37, 50)) {
        this.setState({
          riskscore: "Conservative Investor",
        });
      } else if (between(x, 50, 60)) {
        this.setState({
          riskscore: "Moderate Investor",
        });
      } else if (between(x, 60, 85)) {
        this.setState({
          riskscore: "Aggressive Investor",
        });
      } else if (between(x, 85, 100)) {
        this.setState({
          riskscore: "Very Aggressive Investor",
        });
      }
    }
  }

  startagain = (evt) => {
    evt.preventDefault();
    this.setState({
      currentQuestion: this.state._questions[0],
      curPos: 1,
      currentOptionsChoice: null,
      setQuestionWithAnswer: [],
      FinalScore: -1,
      riskscore: "",
    });
  };

  handleChangeToogleChangeEvent(_t, index) {
    let sqwa = [];

    if (this.state.setQuestionWithAnswer.length > 0) {
      sqwa = this.state.setQuestionWithAnswer.map((q) => {
        if (q.id === this.state.currentQuestion.id) {
          return {
            ...this.state.currentQuestion,
            answer: _t.id,
            answerValue: _t.value,
          };
        }

        return q;
      });
    }

    let exists = this.state.setQuestionWithAnswer.filter(
      (q) => q.id === this.state.currentQuestion.id
    );

    if (exists.length === 0) {
      sqwa.push({
        ...this.state.currentQuestion,
        answer: _t.id,
        answerValue: _t.value,
      });
    }

    this.setState({
      currentAnswer: _t.id,
      currentOptionsChoice: _t.nextId,
      setQuestionWithAnswer: sqwa,
    });
  }

  render() {
    //    this.state.setQuestionWithAnswer.map((q) => {
    //         if (q.id == this.state.currentQuestion.id) {
    //             this.setState({
    //                 currentQuestion: q,
    //                 currentAnswer: q.answer,
    //             });
    //         }
    //     });

    let { curPos } = this.state;
    if (this.state.FinalScore >= 0) {
      this.props
        .SaverRiskQuestionRecord({
          Response: this.state.Response,
          SurveyID: this.state.SurveyID,
          IsComplete: true,
          LastQuestionId: this.state.LastQuestionId,
          Score: this.state.FinalScore,
          Profile: this.state.riskscore,
          SurveyShortCode: this.state.SurveyShortCode,
        })
        .then(() => {
          this.setState({ loader: false });
        });
      return (
        <div className="row dashboardtab">
          <div className="col-md-10 offset-md-1 md200 height100vh Questionnaire">
            {this.state.loader === true ? (
              <div className="row">
                <div className="col-md-12">
                  <Loader className="md200"></Loader>
                </div>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-8 offset-md-2 text-center md100 endhere">
                  <div className="row">
                    <div className="col-md-12">
                      <h5 className="heading-text">
                        Thank you for showing your interest.
                      </h5>
                    </div>
                    <div className="col-md-12 md50">
                      <Result score={this.state.FinalScore} />
                    </div>
                    <div className="col-md-12 md50">
                      <h2 className="md35 blue-text bold">
                        {" "}
                        {this.state.riskscore}{" "}
                      </h2>
                      <p
                        className="blue-text cursor underline md20"
                        onClick={() => this.props.history.goBack()}
                      >
                        Get back to dashboard
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      );
    } else {
      let _t = "";
      let _t_back = "";
      let _t_forward = "";
      return (
        <div className="row">
          <div className="col-md-10 offset-md-1 md100 Questionnaire">
            <div className="row">
              <div className="col-md-8 offset-md-2 md35">
                <div className="row">
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <label className="smaller-heading-text">General</label>
                      </div>
                      <div className="col-md-12">
                        <Progress
                          percent={curPos > 4 ? "100" : curPos * 33.3}
                          showInfo={false}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <label className="smaller-heading-text">Personal</label>
                      </div>
                      <div className="col-md-12">
                        {curPos === 4 ? (
                          <Progress percent={curPos * 12.5} showInfo={false} />
                        ) : curPos === 5 ? (
                          <Progress percent={75} showInfo={false} />
                        ) : curPos === 6 ? (
                          <Progress percent={100} showInfo={false} />
                        ) : curPos > 6 ? (
                          <Progress percent={100} showInfo={false} />
                        ) : (
                          <Progress percent={0} showInfo={false} />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="row">
                      <div className="col-md-12">
                        <label className="smaller-heading-text">
                          Financial
                        </label>
                      </div>
                      <div className="col-md-12">
                        {curPos > 6 ? (
                          <Progress percent={curPos * 10} showInfo={false} />
                        ) : (
                          <Progress percent={0} showInfo={false} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              {this.state.currentQuestion.length === 0 ? (
                <div className="col-md-8 offset-md-2 md100">
                  <Loader className="md100"></Loader>
                </div>
              ) : (
                <>
                  <div className="col-md-8 offset-md-2 md100">
                    <div className="row">
                      <div className="col-md-12 text-center">
                        <p className="blue-text"> Question {curPos}/9</p>
                      </div>
                      <div className="col-md-12 md20">
                        <h5 className="question-heading">
                          {this.state.currentQuestion.title}
                        </h5>
                      </div>
                      <div className="col-md-12 md35">
                        <Radio.Group value={this.state.currentAnswer}>
                          {this.state.currentQuestion &&
                            this.state.currentQuestion.options.map(
                              (_t, index) => {
                                if (this.state.currentQuestion !== 0) {
                                  _t_forward = (
                                    <button
                                      onClick={this.showNext}
                                      className="btn btn-primary padding10 cursor"
                                    >
                                      Next question
                                    </button>
                                  );
                                }
                                if (curPos > 1) {
                                  _t_back = (
                                    <button
                                      onClick={this.loadBack}
                                      className="btn btn-default padding10 cursor"
                                    >
                                      Prevoius question
                                    </button>
                                  );
                                }
                                return (
                                  <Radio.Button
                                    value={_t.id}
                                    onChange={() =>
                                      this.handleChangeToogleChangeEvent(
                                        _t,
                                        index
                                      )
                                    }
                                  >
                                    {_t.text}{" "}
                                  </Radio.Button>
                                );
                              }
                            )}
                        </Radio.Group>
                      </div>
                      <div className="col-md-12 text-center md100">
                        <div className="row">
                          <div className="col-md-6 text-left"> {_t_back}</div>
                          <div className="col-md-6 text-right">
                            {_t_forward}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 height100px"></div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => ({
  list_questions: state.risk,
});
const mapDispatchToProps = (dispatch) => ({
  riskquestions: (v) => dispatch(actions.riskquestions(v)),
  SaverRiskQuestionRecord: (v) => dispatch(actions.SaverRiskQuestionRecord(v)),
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Questionnaire)
);
