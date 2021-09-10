import React, { useCallback, useEffect, useState } from 'react';
import CheckToken from '../../api/checkToken';
import Api from '../../api/dataControllerApi';
import ReportContentHeader from './reportContentHeader';
import './reportCreate.css';

function ReportCreate({ reportReadyData }) {
  var testWeek = reportReadyData.stage.length === 2 ? reportReadyData.stage : '0' + reportReadyData.stage;
  testWeek = 'TIME' + testWeek;
  const title = `${reportReadyData.division} - ${reportReadyData.level} - ${reportReadyData.stage}주차`;
  const subTitle = `'${reportReadyData.subject}'의 과제를 생성합니다`;

  const [token, setToken] = useState(window.localStorage.getItem('accessToken'));
  const refreshToken = window.localStorage.getItem('refreshToken');

  const [voca_test_time, setVocaTestTime] = useState('');
  const [voca_list, setVocaList] = useState([]);
  const [sentence_test_time, setSentenceTestTime] = useState('');
  const [sentence_list, setSentenceList] = useState([]);
  const [grammar_short_test_time, setGrammarShortTestTime] = useState('');
  const [grammar_short_list, setGrammarShortList] = useState([]);
  const [grammar_choice_test_time, setGrammarChoiceTestTime] = useState('');
  const [grammar_choice_list, setGrammarChoiceList] = useState([]);

  const [show_voca, setShowVoca] = useState(false);
  const [show_sentence, setShowSentence] = useState(false);
  const [show_grammar_short, setShowGrammarShort] = useState(false);
  const [show_grammar_choice, setShowGrammarChoice] = useState(false);
  //pre
  // const [voca_handle, setVocaHandle] = useState(false);
  // const [sentence_handle, setSentenceHandle] = useState(false);
  // const [grammar_short_handle, setGrammarShortHandle] = useState(false);
  // const [grammar_choice_handle, setGrammarChoiceHandle] = useState(false);
  const setVocaHandle = useState(false)[1];
  const setSentenceHandle = useState(false)[1];
  const setGrammarShortHandle = useState(false)[1];
  const setGrammarChoiceHandle = useState(false)[1];
  const getVocaListFromServer = useCallback(() => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    Api.getData(`/api/vocaTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header)
      .then((res) => {
        if (res.data.description === '조회성공') {
          if (res.data.data.assignment.length !== 0) {
            const data = res.data.data.assignment.map((data) => {
              return { id: data.id, eng: data.voca, kor: data.meaning, selected: false };
            });
            setVocaList(data);
            setVocaTestTime(res.data.data.timer);
          }
        } else {
          CheckToken(refreshToken, token, setToken, res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [refreshToken, token, reportReadyData.id, testWeek]);

  const getSentenceListFromServer = useCallback(() => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    Api.getData(`/api/sentenceTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header)
      .then((res) => {
        if (res.data.description === '조회성공' && res.data.data.assignment.length) {
          var data = res.data.data.assignment.map((data) => {
            var subject = [data.subject1 ? data.subject1 : '', data.subject2, data.subject3];
            subject = subject.filter((data) => data !== null);
            var verb = [data.verb1 ? data.verb1 : '', data.verb2, data.verb3];
            verb = verb.filter((data) => data !== null);
            var object = [data.object1 ? data.object1 : '', data.object2, data.object3];
            object = object.filter((data) => data !== null);
            var objectiveComplement = [
              data.objective_complement1 ? data.objective_complement1 : '',
              data.objective_complement2,
              data.objective_complement3,
            ];
            objectiveComplement = objectiveComplement.filter((data) => data !== null);
            var complement = [data.complement1 ? data.complement1 : '', data.complement2, data.complement3];
            complement = complement.filter((data) => data !== null);
            var indirectObject = [
              data.indirect_object1 ? data.indirect_object1 : '',
              data.indirect_object2,
              data.indirect_object3,
            ];
            indirectObject = indirectObject.filter((data) => data !== null);
            var directObject = [
              data.direct_object1 ? data.indirect_object1 : '',
              data.direct_object2,
              data.direct_object3,
            ];
            directObject = directObject.filter((data) => data !== null);
            var nounClause = [data.noun_clause1 ? data.noun_clause1 : '', data.noun_clause2, data.noun_clause3];
            nounClause = nounClause.filter((data) => data !== null);
            var relative = [data.relative1 ? data.relative1 : '', data.relative2, data.relative3];
            relative = relative.filter((data) => data !== null);
            var adverbClause = [
              data.adverb_clause1 ? data.adverb_clause1 : '',
              data.adverb_clause2,
              data.adverb_clause3,
            ];
            adverbClause = adverbClause.filter((data) => data !== null);
            var coordinator = [data.coordinator1 ? data.coordinator1 : '', data.coordinator2, data.coordinator3];
            coordinator = coordinator.filter((data) => data !== null);
            var modifier = [
              data.modifier1 ? data.modifier1 : '',
              data.modifier2,
              data.modifier3,
              data.modifier4,
              data.modifier5,
              data.modifier6,
              data.modifier7,
            ];
            modifier = modifier.filter((data) => data !== null);

            return {
              id: data.id,
              question: data.question,
              form: data.form,
              subject: subject,
              verb: verb,
              object: object,
              objectiveComplement: objectiveComplement,
              complement: complement,
              indirectObject: indirectObject,
              directObject: directObject,
              nounClause: nounClause,
              relative: relative,
              adverbClause: adverbClause,
              coordinator: coordinator,
              modifier: modifier,
              selected: false,
            };
          });
          setSentenceList(data);
          setSentenceTestTime(res.data.data.timer);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, reportReadyData.id, testWeek]);

  const getGrammarChoiceFromServer = useCallback(() => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    Api.getData(`/api/grammarShortAnswerTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header)
      .then((res) => {
        if (res.data.description === '조회성공') {
          if (res.data.data.assignment.length !== 0) {
            const data = res.data.data.assignment.map((data) => {
              return { id: data.id, question: data.question, answer: data.answer, selected: false };
            });
            setGrammarShortList(data);
            setGrammarShortTestTime(res.data.data.timer);
          }
        } else {
          CheckToken(refreshToken, token, setToken, res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, refreshToken, reportReadyData.id, testWeek]);

  const getGrammarListFromServer = useCallback(() => {
    const header = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    Api.getData(`/api/grammarMultipleChoiceTests?subjectId=${reportReadyData.id}&testWeek=${testWeek}`, header)
      .then((res) => {
        if (res.data.description === '조회성공') {
          if (res.data.data.assignment.length !== 0) {
            const data = res.data.data.assignment.map((data) => {
              return {
                id: data.id,
                question: data.question,
                answer: data.answer.toString(),
                example1: data.example1,
                example2: data.example2,
                example3: data.example3,
                example4: data.example4,
                example5: data.example5,
                selected: false,
              };
            });
            setGrammarChoiceList(data);
            setGrammarChoiceTestTime(res.data.data.timer);
          }
        } else {
          CheckToken(refreshToken, token, setToken, res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [token, refreshToken, reportReadyData.id, testWeek]);

  useEffect(() => {
    getVocaListFromServer();
    getGrammarListFromServer();
    getSentenceListFromServer();
    getGrammarChoiceFromServer();
  }, [getVocaListFromServer, getGrammarListFromServer, getSentenceListFromServer, getGrammarChoiceFromServer]);

  const releaseReport = () => {};

  return (
    <div className="ReportBody" style={{ marginBottom: '32px' }}>
      <ReportContentHeader title={title} subTitle={subTitle} />
      {voca_list.length ? (
        <ReportVoca
          setHandle={setVocaHandle}
          vocaList={voca_list}
          testTime={voca_test_time}
          show={show_voca}
          setShow={setShowVoca}
        />
      ) : null}
      {sentence_list.length ? (
        <ReportSentence
          setHandle={setSentenceHandle}
          sentenceList={sentence_list}
          testTime={sentence_test_time}
          show={show_sentence}
          setShow={setShowSentence}
        />
      ) : null}
      {grammar_short_list.length ? (
        <ReportGrammarShort
          setHandle={setGrammarShortHandle}
          grammarShortList={grammar_short_list}
          testTime={grammar_short_test_time}
          show={show_grammar_short}
          setShow={setShowGrammarShort}
        />
      ) : null}
      {grammar_choice_list.length ? (
        <ReportGrammarChoice
          setHandle={setGrammarChoiceHandle}
          grammarChoiceList={grammar_choice_list}
          testTime={grammar_choice_test_time}
          show={show_grammar_choice}
          setShow={setShowGrammarChoice}
        />
      ) : null}
      <div className="ReportCreate__FootWrap">
        <ReportMessage reportReadyData={reportReadyData} />
      </div>
      <div className="ReportCreate__ReleaseButtonWrap">
        <button className="ReportCreate__ButtonRelease" onClick={releaseReport}>
          출제하기
        </button>
      </div>
    </div>
  );
}

function ReportVoca({ setHandle, vocaList, testTime, show, setShow }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <div className="ReportVoca__Header">
        <ReportSetting setHandle={setHandle} testTime={testTime} domain={'단어'} show={show} setShow={setShow} />
        <div className="ReportVoca__ModeButtonWrap">
          <button className="ReportVoca__ModeButton">단어 시험 출제</button>
          <button className="ReportVoca__ModeButton">뜻 시험 출제</button>
        </div>
      </div>
      <div className="ReportVoca__ContentWrap" style={{ marginTop: '16px' }}>
        {show ? (
          <div className="ReportVoca__Content">
            <ReportVocaContent vocaList={vocaList} mode={'even'} />
            {vocaList.length > 1 ? <ReportVocaContent vocaList={vocaList} mode={'odd'} /> : null}
          </div>
        ) : (
          <span className="ReportCreateTemp">펼치면 데이터가 보입니다</span>
        )}
      </div>
    </div>
  );

  function ReportVocaContent({ vocaList, mode }) {
    const vocaTableBody = vocaList.map((voca, index) => {
      if (mode === 'odd') {
        if (index % 2 !== 0) {
          return (
            <tr key={voca.id} id="vocaTable">
              <td className="ReportVoca__TbodyNo">{index + 1}</td>
              <td className="ReportVoca__SpanVoca">{voca.eng}</td>
              <td className="ReportVoca__SpanVoca">{voca.kor}</td>
            </tr>
          );
        }
      } else {
        if (index % 2 === 0) {
          return (
            <tr key={voca.id} id="vocaTable">
              <td className="ReportVoca__TbodyNo">{index + 1}</td>
              <td className="ReportVoca__SpanVoca">{voca.eng}</td>
              <td className="ReportVoca__SpanVoca">{voca.kor}</td>
            </tr>
          );
        }
      }
      return null;
    });

    return (
      <table className="ReportVoca__Table">
        <thead>
          <tr id="vocaTable" className="ReportVcoa__Thead">
            <td id="vocaTable" className="ReportVoca__TheadNo">
              No.
            </td>
            <td id="vocaTable" className="ReportVoca__TheadEng">
              단어
            </td>
            <td id="vocaTable" className="ReportVoca__TheadKor">
              뜻
            </td>
          </tr>
        </thead>
        <tbody>{vocaTableBody}</tbody>
      </table>
    );
  }
}

function ReportSentence({ setHandle, sentenceList, testTime, show, setShow }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <ReportSetting setHandle={setHandle} testTime={testTime} domain={'문장 구조'} show={show} setShow={setShow} />
      <div className="ReportSentence__ContentWrap">
        {show ? (
          <div className="ReportSentence__Content">
            {sentenceList.map((sentence, index) => {
              return <ReportSentenceContent key={sentence.id} sentence={sentence} index={index} />;
            })}
          </div>
        ) : (
          <span className="ReportCreateTemp">펼치면 데이터가 보입니다</span>
        )}
      </div>
    </div>
  );

  function ReportSentenceContent({ sentence, index }) {
    var form = null;
    if (sentence.form === 'FORM1') {
      form = '1형식';
    } else if (sentence.form === 'FORM2') {
      form = '2형식';
    } else if (sentence.form === 'FORM3') {
      form = '3형식';
    } else if (sentence.form === 'FORM4') {
      form = '4형식';
    } else {
      form = '5형식';
    }
    return (
      <div className="ReportSentence__Table">
        <div className="ReportSentence__Thead">
          <span className="ReportSentence__NoLabel">No.</span>
          <span className="ReportSentence__InputLabel">문제</span>
          <span className="ReportSentence__SelectLabel" style={{ flexBasis: '69px' }}>
            문장형식
          </span>
        </div>
        <div className="ReportSentence__Tbody">
          <span className="ReportSentence__No">{index + 1}</span>
          <div style={{ width: '100%' }}>
            <div className="ReportSentence__InputWrap">
              <span className="ReportSentence__Input">{sentence.question}</span>
              <span className="ReportSentence__Select">{form}</span>
            </div>
            {sentence.subject.map((subject, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="주어" value={subject} />;
            })}
            {sentence.verb.map((verb, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="동사" value={verb} />;
            })}
            {sentence.object.map((object, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="목적어" value={object} />;
            })}
            {sentence.indirectObject.map((indirectObject, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="간접 목적어" value={indirectObject} />;
            })}
            {sentence.directObject.map((directObject, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="직접 목적어" value={directObject} />;
            })}
            {sentence.complement.map((complement, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="보어" value={complement} />;
            })}
            {sentence.objectiveComplement.map((objectiveComplement, index) => {
              return (
                <ReportSentenceAnswer key={index} id={sentence.id} tag="목적격 보어" value={objectiveComplement} />
              );
            })}
            {sentence.relative.map((relative, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="관계사" value={relative} />;
            })}
            {sentence.nounClause.map((nounClause, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="명사절 접속사" value={nounClause} />;
            })}
            {sentence.adverbClause.map((adverbClause, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="부사절 접속사" value={adverbClause} />;
            })}
            {sentence.coordinator.map((coordinator, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="등위 접속사" value={coordinator} />;
            })}
            {sentence.modifier.map((modifier, index) => {
              return <ReportSentenceAnswer key={index} id={sentence.id} tag="수식어구" value={modifier} />;
            })}
          </div>
        </div>
      </div>
    );
  }

  function ReportSentenceAnswer({ tag, value }) {
    return (
      <div className="ReportSentence__InputWrap">
        <span className="ReportSentence__AnswerLabel">{tag}</span>
        <span className="ReportSentence__Input">{value}</span>
      </div>
    );
  }
}

function ReportGrammarShort({ setHandle, grammarShortList, testTime, show, setShow }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <ReportSetting setHandle={setHandle} testTime={testTime} domain={'문법 (주관식)'} show={show} setShow={setShow} />
      <div className="ReportGrammarShort__ContentWrap" style={{ marginTop: '16px' }}>
        {show ? (
          <div className="ReportGrammarShort__Content">
            <ReportGrammarShortContent grammarShortList={grammarShortList} />
          </div>
        ) : (
          <span className="ReportCreateTemp">펼치면 데이터가 보입니다</span>
        )}
      </div>
    </div>
  );

  function ReportGrammarShortContent({ grammarShortList }) {
    const grammarShortTableBody = grammarShortList.map((grammarShort, index) => {
      return (
        <tr key={grammarShort.id}>
          <td id="ReportGrammarShort__TableStyle" className="ReportGrammarShort__No">
            {index + 1}
          </td>
          <td className="ReportGrammarShort__TableContent">{grammarShort.question}</td>
          <td className="ReportGrammarShort__TableContent">{grammarShort.answer}</td>
        </tr>
      );
    });

    return (
      <table className="ReportGrammarShort__Table">
        <thead>
          <tr className="ReportGrammarShort__Thead">
            <td className="ReportGrammarShort__NoLabel">No.</td>
            <td className="ReportGrammarShort__InputLabel">문제</td>
            <td className="ReportGrammarShort__InputLabel">정답</td>
          </tr>
        </thead>
        <tbody>{grammarShortTableBody}</tbody>
      </table>
    );
  }
}

function ReportGrammarChoice({ setHandle, grammarChoiceList, testTime, show, setShow }) {
  return (
    <div style={{ marginTop: '32px' }}>
      <ReportSetting setHandle={setHandle} testTime={testTime} domain={'문법 (객관식)'} show={show} setShow={setShow} />
      <div className="ReportGrammarChoice__ContentWrap" style={{ marginTop: '16px' }}>
        {show ? (
          <div className="ReportGrammarChoice__Content">
            {grammarChoiceList.map((grammarProblem, index) => {
              return <ReportGrammarChoiceTable key={grammarProblem.id} grammarProblem={grammarProblem} index={index} />;
            })}
          </div>
        ) : (
          <span className="ReportCreateTemp">펼치면 데이터가 보입니다</span>
        )}
      </div>
    </div>
  );

  function ReportGrammarChoiceTable({ grammarProblem, index }) {
    const inputStyle = {
      backgroundColor: '#9162FF',
      color: 'white',
    };

    return (
      <div className="ReportGrammarChoice__Table">
        <div className="ReportGrammarChoice__Thead">
          <span className="ReportGrammarChoice__NoLabel">No.</span>
          <span className="ReportGrammarChoice__InputLabel">문제</span>
        </div>
        <div className="ReportGrammarChoice__Tbody">
          <span className="ReportGrammarChoice__No">{index + 1}</span>
          <div style={{ width: '100%' }}>
            <span className="ReportGrammarChoice__TableContent">{grammarProblem.question}</span>
            <span className="ReportGrammarChoice__AnswerLabel">{'정답: ' + grammarProblem.answer}</span>
            <span
              className="ReportGrammarChoice__TableContent"
              style={grammarProblem.answer === '1' ? inputStyle : null}
            >
              {grammarProblem.example1}
            </span>
            <span
              className="ReportGrammarChoice__TableContent"
              style={grammarProblem.answer === '2' ? inputStyle : null}
            >
              {grammarProblem.example2}
            </span>
            <span
              className="ReportGrammarChoice__TableContent"
              style={grammarProblem.answer === '3' ? inputStyle : null}
            >
              {grammarProblem.example3}
            </span>
            <span
              className="ReportGrammarChoice__TableContent"
              style={grammarProblem.answer === '4' ? inputStyle : null}
            >
              {grammarProblem.example4}
            </span>
            <span
              className="ReportGrammarChoice__TableContent"
              style={grammarProblem.answer === '5' ? inputStyle : null}
            >
              {grammarProblem.example5}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

function ReportMessage({ reportReadyData }) {
  const title = `강의자의 메세지`;
  const subTitle = `'${reportReadyData.subject}'의 학생에게 남길 메세지를 입력해 주세요`;
  return (
    <div className="ReportMessage">
      <ReportContentHeader title={title} subTitle={subTitle} />
      <div className="ReportMessage__ContentWrap">
        <textarea className="ReportMessage__Content" />
      </div>
    </div>
  );
}

function ReportSetting({ setHandle, testTime, domain, show, setShow }) {
  const onHandleClick = (e) => {
    console.log(e.target.checked);
    setHandle(e.target.checked);
  };

  return (
    <div className="ReportSetting">
      <div className="ReportSetting__HandleWrap">
        <label className="ReportSetting__HandleLabel">
          핸들
          <input className="ReportSetting__Handle" type="checkbox" onChange={onHandleClick} />
        </label>
        <label className="ReportSetting__BoxLabel">
          시험 영역<span className="ReportSetting__Box">{domain}</span>
        </label>
        <label className="ReportSetting__BoxLabel">
          시험 영역<span className="ReportSetting__Box">{testTime + '분'}</span>
        </label>
      </div>
      <button
        className="ReportSetting__ButtonShowContent"
        onClick={() => {
          show ? setShow(false) : setShow(true);
        }}
      >
        {show ? '접힘' : '펼침'}
      </button>
    </div>
  );
}

export default ReportCreate;
