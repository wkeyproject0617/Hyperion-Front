import React, {useState, useRef, forwardRef, useEffect} from 'react';

import './subjectCRUD.css';

import Api from '../../api/subjectControllerApi';
import SelectApi from '../../api/subjectSelectBoxController';
import CheckToken from "../../api/checkToken";

import Modal from '../../component/common/modal';

function SubjectC(props) {
  const [DivisionSelect, setDivisionSelect] = useState();
  const [NameSelect, setNameSelect] = useState();

  useEffect(() => {
    SelectApi.getSubjectsCategories()
      .then((res) => {
        const description = res.data.description;
  
        if(description === "조회성공"){
          setDivisionSelect(res.data.data); 
        } else if(description === "토큰에러"){
  
          const {
            refreshToken,
            token,
            setToken
          } = props;
  
          CheckToken(refreshToken, token, setToken, res);
  
        } else if(description === "데이터없음"){
  
        }
      })
      .catch((err) => {
        console.log(err);
      })
    
  }, [props])

  const [inputs, setInputs] = useState({
    division:'',
    name:'',
    level:'LEVEL01',
    time:'',
    book:'',
    writer:''
  })

  const {
    division,
    name,
    level,
    time,
    book,
    writer
  } = inputs;

  const onChange = (e) => {
    const {value, name} = e.target;

    setInputs({
      ...inputs,
      [name]:value
    });

    if(name === "division"){
      SelectApi.getSubjectsTitles(value)
        .then((res) => {
          setNameSelect(res.data.data);
        })
        .catch((err) => {
          return err;
        })
    }

  }

  const CancleClick = () => {
    props.setPage("main");
  }

  const [Modal, setModal] = useState();
  const ref = useRef();
  const onSubmit = (e) => {
    e.preventDefault();

    const subject = {
      created_by:writer,
      subject_book:book,
      subject_category:division,
      subject_level:level,
      subject_title:name,
      total_weeks:time
    }

    Api.getDuplicatSubjects(division, level, name)
      .then((res) => {
        const description = res.data.description;
        console.log(description)
        if(description === "중복아님"){

          Api.postSubjects(subject)
            .then((res) => {
              if(res.data.description === "생성성공") {
                setModal(<ModalView props={props} mode={"create"} ref={ref} result={"success"}/>)
      
              } else if(res.data.description === "토큰에러"){
      
                const {
                  refreshToken,
                  token,
                  setToken
                } = props;
      
                CheckToken(refreshToken, token, setToken, res);
      
              } else if(res.data.description === "권한없음"){
                //권한없음의 경우 추후 구현
              } else {
                //유효성 검사 에러
                setModal(<ModalView result={"error"} mode={"create"} ref={ref}/>)
              }
            })
            .catch((err) => {
              return err;
            })
        } else if(description === "토큰에러"){
          const {
            refreshToken,
            token,
            setToken
          } = props;

          CheckToken(refreshToken, token, setToken, res);

        } else if(description === "권한없음"){

        } else if(description === "중복"){
          setModal(<ModalView result={"duplicate"} mode={"create"} ref={ref}/>)
        }
      })
      .catch((err) => {
        return err;
      })
  }

  return(
    <div className="subjectCRUD_Wrap">
      <div className="subjectCRUD_title">과목 작성 카드</div>
      <div className="subjectCRUD_Subtitle">과목을 새로 작성합니다.</div>

      <div className="subjectCRUD_ContentsWrap">
        <form onSubmit={onSubmit} autoComplete="off">
          <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_ContentsTag">과목 구분</div>
            <select className="subjectCRUD_ContentsSelect" onChange={onChange} name="division" value={division}>
              <option>(선택)</option>
            {
              DivisionSelect && DivisionSelect.map((data, index) => (
                <option key={index} value={data}>{data}</option>
              ))
            }
            </select>
            <span className="subjectCRUD_ContentsSpan">과목 구분을 선택해주세요.</span>
          </div>

          <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_ContentsTag">과목명</div>
            <select className="subjectCRUD_ContentsWideSelect" onChange={onChange} name="name" value={name}>
              <option>(선택)</option>
            {
              NameSelect && NameSelect.map((data, index) => (
                <option key={index} value={data}>{data}</option>
              ))
            }
            </select>
            <span className="subjectCRUD_ContentsSpan">검색할 과목 이름을 선택해 주세요.</span>
          </div>

          <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_InlineContents">
              <div className="subjectCRUD_InlineContentsTag">과목 레벨</div>
              <select className="subjectCRUD_InlineContentsSelect" onChange={onChange} name="level" value={level}>
                    <option value="LEVEL01">level.1</option>
                    <option value="LEVEL02">level.2</option>
                    <option value="LEVEL03">level.3</option>
                    <option value="LEVEL04">level.4</option>
                    <option value="LEVEL05">level.5</option>
                    <option value="LEVEL06">level.6</option>
                    <option value="LEVEL07">level.7</option>
                    <option value="LEVEL08">level.8</option>
                    <option value="LEVEL09">level.9</option>
                    <option value="LEVEL10">level.10</option>
                    <option value="LEVEL11">level.11</option>
                    <option value="LEVEL12">level.12</option>
                </select>
              <span className="subjectCRUD_InlineContentsSpan">과목 레벨을 선택해 주세요.</span>
            </div>

            <div className="subjectCRUD_InlineContents">
              <div className="subjectCRUD_InlineContentsTag">과목 회차</div>
              <input className="subjectCRUD_InlineContentsInput subjectCRUD_InlineContentsRightInput" placeholder="ex) 1" name="time" onChange={onChange} value={time}/>
              <span>회차</span>
              <span className="subjectCRUD_InlineContentsSpan">과목의 총 회차 수를 입력해 주세요.</span>
            </div>
          </div>

          <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_ContentsTag">과목 교재</div>
            <input className="subjectCRUD_ContentsInput" placeholder="과목 교재" name="book" onChange={onChange} value={book}/>
            <span className="subjectCRUD_ContentsSpan">과목에 쓰일 교재를 입력해 주세요.</span>
          </div>

          <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_ContentsTag">작성자</div>
            <input className="subjectCRUD_ContentsInput" placeholder="작성자" name="writer" onChange={onChange} value={writer}/>
            <span className="subjectCRUD_ContentsSpan">작성자를 입력해 주세요.</span>
          </div>

          <div className="subjectCRUD_CtrlBtnWrap">
            <button className="subjectCRUD_CtrlBtnCancle" type="button" onClick={CancleClick}>목록으로</button>
            <button className="subjectCRUD_CtrlBtnWrite" >작성하기</button>
          </div>
        </form>

        <div className="subjectCRUD_ModalBox" ref={ref}>
          {Modal}
        </div>

      </div>
    </div>
  )
}

function SubjectR(props){
  //뒤로가기 방지 추후 구현
  // window.history.pushState(null, null, window.location.href);
  // window.onpopstate = function(event) {
  //   window.history.go(1);
  // };

  const [values, setValues] = useState({
    division:'',
    name:'',
    level:'',
    time:0,
    book:'',
    writer:'',
    created_at:''
  });

  const {
    division,
    name,
    level,
    time,
    book,
    writer,
    created_at
  } = values

  useEffect(() => {
    let mounted = true;

    Api.getSubjectsOne(props.id)
    .then((res) => {
      if(mounted) {
        setValues({
          division:res.data.data.subject_category,
          name:res.data.data.subject_title,
          level:res.data.data.subject_level,
          time:res.data.data.total_weeks,
          book:res.data.data.subject_book,
          writer:res.data.data.created_by,
          created_at:res.data.data.created_at
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })

    return () => (mounted = false);
  }, [props.id]);
  
  const CancleClick = () => {      
    props.setPage("main");
  }

  const [Modal, setModal] = useState();
  const ref = useRef();

  //SubjectD
  const DeleteClick = () => {
    Api.deleteSubjects(props.id)
      .then((res) => {
        const description = res.data.description;

        if(description === "삭제성공"){
          setModal(
            <ModalView 
              props={props}
              mode={"delete"} 
              ref={ref} 
              result={"success"}
            />
          )
        } else if(description === "토큰에러") {
  
          const {
            refreshToken,
            token,
            setToken
          } = props;
  
          CheckToken(refreshToken, token, setToken, res);
        } else if(description === "삭제불가능"){
          setModal(
            <ModalView 
              props={props}
              mode={"delete"} 
              ref={ref} 
              result={"error"}
            />
          )
        }
      })
      .catch((err) => {
        return err;
      })
  }

  const UpdateClick = () => {
    props.setPage("update");
  }

  return(
    <div className="subjectCRUD_Wrap">
      <div className="subjectCRUD_title">과목 카드</div>
      <div className="subjectCRUD_Subtitle">{name}</div>

      <div className="subjectCRUD_ContentsWrap">
        <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_InlineContents subjectCRUD_InlineContentsNospan">
              <div className="subjectCRUD_InlineContentsTag">과목 구분</div>
              <input className="subjectCRUD_InlineContentsInput" value={division} disabled/>
              <span className="subjectCRUD_InlineContentsSpan"></span>
            </div>

            <div className="subjectCRUD_InlineContents subjectCRUD_InlineContentsNospan">
              <div className="subjectCRUD_InlineContentsTag">등록일</div>
              <input className="subjectCRUD_InlineContentsInputCreated_at" value={created_at} disabled/>
              <span className="subjectCRUD_InlineContentsSpan"></span>
            </div>
          </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_ContentsTag">과목명</div>
          <input className="subjectCRUD_ContentsInput subjectCRUD_ContentsWideInput" value={name} disabled/>
          <span className="subjectCRUD_ContentsSpan"></span>
        </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_InlineContents subjectCRUD_InlineContentsNospan">
            <div className="subjectCRUD_InlineContentsTag">과목 레벨</div>
            <input className="subjectCRUD_InlineContentsInput" value={level} disabled/>
            <span className="subjectCRUD_InlineContentsSpan"></span>
          </div>

          <div className="subjectCRUD_InlineContents subjectCRUD_InlineContentsNospan">
            <div className="subjectCRUD_InlineContentsTag">과목 회차</div>
            <input className="subjectCRUD_InlineContentsInput subjectCRUD_InlineContentsRightInput" value={time} disabled/>
            <span>회차</span>
            <span className="subjectCRUD_InlineContentsSpan"></span>
          </div>
        </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_ContentsTag">과목 교재</div>
          <input className="subjectCRUD_ContentsInput" value={book} disabled/>
          <span className="subjectCRUD_ContentsSpan"></span>
        </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_ContentsTag">작성자</div>
          <input className="subjectCRUD_ContentsInput" value={writer} disabled/>
          <span className="subjectCRUD_ContentsSpan"></span>
        </div>

        <div className="subjectCRUD_CtrlBtnWrap">
          <button className="subjectCRUD_CtrlBtnCancle_Read" type="button" onClick={CancleClick}>목록으로</button>
          <button className="subjectCRUD_CtrlBtnWrite_Read" onClick={DeleteClick}>삭제하기</button>
          <button className="subjectCRUD_CtrlBtnUpdate_Read" type="button" onClick={UpdateClick}>수정하기</button>
        </div>

      <div className="subjectCRUD_ModalBox" ref={ref}>
        {Modal}
      </div>

    </div>
  </div>
  )
}

function SubjectU(props){

  const [DivisionSelect, setDivisionSelect] = useState();
  const [NameSelect, setNameSelect] = useState();

  useEffect(() => {
    SelectApi.getSubjectsCategories()
      .then((res) => {
        const description = res.data.description;
  
        if(description === "조회성공"){
          setDivisionSelect(res.data.data); 
        } else if(description === "토큰에러"){
  
          const {
            refreshToken,
            token,
            setToken
          } = props;
  
          CheckToken(refreshToken, token, setToken, res);
  
        } else if(description === "데이터없음"){
  
        }
      })
      .catch((err) => {
        console.log(err);
      })
    
  }, [props])

  const [values, setValues] = useState({
    division:'',
    name:'',
    level:'',
    time:0,
    book:'',
    writer:'',
    created_at:''
  });

  const {
    division,
    name,
    level,
    time,
    book,
    writer,
    created_at
  } = values

  const onChange = (e) => {
    const {value, name} = e.target;

    setValues({
      ...values,
      [name]:value
    });

    if(name === "division"){
      SelectApi.getSubjectsTitles(value)
        .then((res) => {
          setNameSelect(res.data.data);
        })
        .catch((err) => {
          return err;
        })
    }
  }

  useEffect(() => {
    let mounted = true;

    Api.getSubjectsOne(props.id)
    .then((res) => {
      if(mounted) {
        setValues({
          division:res.data.data.subject_category,
          name:res.data.data.subject_title,
          level:res.data.data.subject_level,
          time:res.data.data.total_weeks,
          book:res.data.data.subject_book,
          writer:res.data.data.created_by,
          created_at:res.data.data.created_at
        })
      }
    })
    .catch((err) => {
      console.log(err);
    })

    return () => (mounted = false);
  }, [props.id]);

  const CancleClick = () => {
    props.setPage("main");
  }

  const [Modal, setModal] = useState();
  const ref = useRef();
  const UpdateClick = () => {
    
    const PatchSubject = {
      id:props.id,
      created_by:writer,
      subject_book:book,
      subject_category:division,
      subject_level:level,
      subject_title:name,
      total_weeks:time
    }

    Api.getDuplicatSubjects(division, name, level)
      .then((res) => {
        const description = res.data.description;

        if(description === "중복아님"){
          Api.patchSubjects(PatchSubject)
            .then((res) => {
              const description = res.data.description;

              if(description === "업데이트성공"){
                setModal(
                  <ModalView
                    props={props}
                    mode={"update"}
                    ref={ref}
                    result={"success"}
                  />
                )
              } else if(description === "토큰에러"){
                const {
                  refreshToken,
                  token,
                  setToken
                } = props;

                CheckToken(refreshToken, token, setToken, res);

              } else if(description === "데이터없음"){

              } else if(description === "권한없음"){

              } else {
                //유효성 검사 에러
                setModal(<ModalView result={"error"} mode={"update"} ref={ref}/>)
              }
            })
            .catch((err) => {
              console.log(err);
            })
        } else if(description === "토큰에러"){
          const {
            refreshToken,
            token,
            setToken
          } = props;

          CheckToken(refreshToken, token, setToken, res);

        } else if(description === "권한없음"){

        } else if(description === "중복"){
          setModal(<ModalView result={"duplicate"} mode={"update"} ref={ref}/>)
        }
      })
      .catch((err) => {
        return err;
      })
    
  }

  return(
    <div className="subjectCRUD_Wrap">
      <div className="subjectCRUD_title">과목 수정 카드</div>
      <div className="subjectCRUD_Subtitle">과목을 수정합니다.</div>

      <div className="subjectCRUD_ContentsWrap">
      <form autoComplete="off">
        <div className="subjectCRUD_Contents">
            <div className="subjectCRUD_InlineContents">
              <div className="subjectCRUD_InlineContentsTag">과목 구분</div>
              <select className="subjectCRUD_InlineContentsSelect" onChange={onChange} name="division" value={division}>
              <option>(선택)</option>
            {
              DivisionSelect && DivisionSelect.map((data, index) => (
                <option key={index} value={data}>{data}</option>
              ))
            }
            </select>
              <span className="subjectCRUD_InlineContentsSpan">과목 구분을 선택해주세요.</span>
            </div>

            <div className="subjectCRUD_InlineContents">
              <div className="subjectCRUD_InlineContentsTag">등록일</div>
              <input className="subjectCRUD_InlineContentsInputCreated_at" value={created_at} onChange={onChange} name="created_at" disabled/>
              <span className="subjectCRUD_InlineContentsSpan">등록일자는 수정 불가합니다.</span>
            </div>
          </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_ContentsTag">과목명</div>
          <select className="subjectCRUD_ContentsWideSelect" onChange={onChange} name="name" value={name}>
              <option>(선택)</option>
            {
              NameSelect && NameSelect.map((data, index) => (
                <option key={index} value={data}>{data}</option>
              ))
            }
            </select>
          <span className="subjectCRUD_ContentsSpan">검색할 과목 이름을 선택해 주세요.</span>
        </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_InlineContents">
            <div className="subjectCRUD_InlineContentsTag">과목 레벨</div>
            <select className="subjectCRUD_InlineContentsSelect" onChange={onChange} name="level" value={level}>
                    <option value="LEVEL01">level.1</option>
                    <option value="LEVEL02">level.2</option>
                    <option value="LEVEL03">level.3</option>
                    <option value="LEVEL04">level.4</option>
                    <option value="LEVEL05">level.5</option>
                    <option value="LEVEL06">level.6</option>
                    <option value="LEVEL07">level.7</option>
                    <option value="LEVEL08">level.8</option>
                    <option value="LEVEL09">level.9</option>
                    <option value="LEVEL10">level.10</option>
                    <option value="LEVEL11">level.11</option>
                    <option value="LEVEL12">level.12</option>
                </select>
              <span className="subjectCRUD_InlineContentsSpan">과목 레벨을 선택해 주세요.</span>
          </div>

          <div className="subjectCRUD_InlineContents">
            <div className="subjectCRUD_InlineContentsTag">과목 회차</div>
            <input className="subjectCRUD_InlineContentsInput subjectCRUD_InlineContentsRightInput" value={time} onChange={onChange} name="time"/>
            <span>회차</span>
            <span className="subjectCRUD_InlineContentsSpan">과목의 총 회차 수를 입력해 주세요.</span>
          </div>
        </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_ContentsTag">과목 교재</div>
          <input className="subjectCRUD_ContentsInput" value={book} onChange={onChange} name="book"/>
          <span className="subjectCRUD_ContentsSpan">과목에 쓰일 교재를 입력해 주세요.</span>
        </div>

        <div className="subjectCRUD_Contents">
          <div className="subjectCRUD_ContentsTag">작성자</div>
          <input className="subjectCRUD_ContentsInput" value={writer} onChange={onChange} name="writer"/>
          <span className="subjectCRUD_ContentsSpan">작성자를 입력해 주세요.</span>
        </div>

        <div className="subjectCRUD_CtrlBtnWrap">
          <button className="subjectCRUD_CtrlBtnCancle_Read" type="button" onClick={CancleClick}>목록으로</button>
  
          <button className="subjectCRUD_CtrlBtnUpdate_Read" type="button" onClick={UpdateClick}>저장하기</button>
        </div>

      <div className="subjectCRUD_ModalBox" ref={ref}>
        {Modal}
      </div>
    </form>
    </div>
  </div>
  )
}

const ModalView = forwardRef(({result, props, mode}, ref) => {
  if(mode === "create") {
    document.body.style.overflow = "hidden";
    ref.current.style.display="block";

    if(result === "success"){
      const closeModal = () => {
        ref.current.style.display="none";
        document.body.style.overflow = "unset";
        props.setPage("main");
        props.setCurrentPage(0);
      }

      const HeaderStyle = {
        fontSize:"32px",
        marginTop:"2%",
        marginBottom:"5%"
      }

      const Header = 
        <div style={HeaderStyle}>과목 작성 성공</div>
      
      const Body = 
        <div>성공적으로 과목이 작성되었습니다.</div>;

      return(
        <Modal
          Header={Header}
          Body={Body}
          onClose={closeModal}
        />
      )
    } else if(result === "error"){
        const closeModal = () => {
          ref.current.style.display="none";
          document.body.style.overflow = "unset";
        }

        const HeaderStyle = {
          fontSize:"32px",
          marginTop:"2%",
          marginBottom:"5%"
        }

        const Header = 
          <div style={HeaderStyle}>과목 작성 실패</div>
        
        const Body = 
          <div>입력한 과목정보를 다시 확인해주세요.</div>;

        return(
          <Modal
            Header={Header}
            Body={Body}
            onClose={closeModal}
          />
        )
      } else if(result === "duplicate"){
        const closeModal = () => {
          ref.current.style.display="none";
          document.body.style.overflow = "unset";
        }

        const HeaderStyle = {
          fontSize:"32px",
          marginTop:"2%",
          marginBottom:"5%"
        }

        const Header = 
          <div style={HeaderStyle}>과목 작성 실패</div>
        
        const Body = 
          <div>이미 동일한 과목이 존재합니다.</div>;

        return(
          <Modal
            Header={Header}
            Body={Body}
            onClose={closeModal}
          />
        )
      }
  } else if(mode === "delete"){
    document.body.style.overflow = "hidden";
    ref.current.style.display="block";

    if(result === "success"){
      const closeModal = () => {
        ref.current.style.display="none";
        document.body.style.overflow = "unset";
        props.setPage("main");
        props.setCurrentPage(0);
      }

      const HeaderStyle = {
        fontSize:"32px",
        marginTop:"2%",
        marginBottom:"5%"
      }

      const Header = 
        <div style={HeaderStyle}>과목 삭제 성공</div>
      
      const Body = 
        <div>과목정보가 삭제되었습니다.</div>;

      return(
        <Modal
          Header={Header}
          Body={Body}
          onClose={closeModal}
        />
      )
    } else if(result === "error"){
      const closeModal = () => {
        ref.current.style.display="none";
        document.body.style.overflow = "unset";
      }

      const HeaderStyle = {
        fontSize:"32px",
        marginTop:"2%",
        marginBottom:"5%"
      }

      const Header = 
        <div style={HeaderStyle}>과목 삭제 실패</div>
      
      const Body = 
        <div>이 과목은 삭제할 수 없습니다.</div>;

      return(
        <Modal
          Header={Header}
          Body={Body}
          onClose={closeModal}
        />
      )
    } 
  } else if(mode === "update") {
    document.body.style.overflow = "hidden";
    ref.current.style.display="block";

    if(result === "success"){
      const closeModal = () => {
        ref.current.style.display="none";
        document.body.style.overflow = "unset";
        props.setPage("main");
        props.setCurrentPage(0);
      }

      const HeaderStyle = {
        fontSize:"32px",
        marginTop:"2%",
        marginBottom:"5%"
      }

      const Header = 
        <div style={HeaderStyle}>과목 수정 성공</div>
      
      const Body = 
        <div>과목정보가 수정되었습니다.</div>;

      return(
        <Modal
          Header={Header}
          Body={Body}
          onClose={closeModal}
        />
      )
    } else if(result === "error"){
      const closeModal = () => {
        ref.current.style.display="none";
        document.body.style.overflow = "unset";
      }

      const HeaderStyle = {
        fontSize:"32px",
        marginTop:"2%",
        marginBottom:"5%"
      }

      const Header = 
        <div style={HeaderStyle}>과목 수정 실패</div>
      
      const Body = 
        <div>작성한 정보를 다시 확인해주세요.</div>;

      return(
        <Modal
          Header={Header}
          Body={Body}
          onClose={closeModal}
        />
      )
    } else if(result === "duplicate"){
      const closeModal = () => {
        ref.current.style.display="none";
        document.body.style.overflow = "unset";
      }

      const HeaderStyle = {
        fontSize:"32px",
        marginTop:"2%",
        marginBottom:"5%"
      }

      const Header = 
        <div style={HeaderStyle}>과목 수정 실패</div>
      
      const Body = 
        <div>이미 동일한 과목이 존재합니다.</div>;

      return(
        <Modal
          Header={Header}
          Body={Body}
          onClose={closeModal}
        />
      )
    }
  }
})

export {SubjectC};
export {SubjectR};
export {SubjectU};