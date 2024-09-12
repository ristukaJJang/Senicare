import React, { ChangeEvent, useEffect, useState } from 'react'
import './style.css';
import InputBox from 'src/components/InputBox';
import axios from 'axios';
import { idCheckRequest, telAuthRequest } from 'src/apis';
import { IdCheckRequestDto, TelAuthRequestDto } from 'src/apis/dto/request/auth';
import { ResponseDto } from 'src/apis/dto/response';

type AuthPath = '회원가입' | '로그인';
interface SnsContainerProps {
  type: AuthPath;
}

function SnsContainer({type}: SnsContainerProps) {
  return (
    <div className="sns-container">
      <div className="title">SNS {type}</div>
      <div className="sns-button-container">
        <div className={`sns-button ${type === '회원가입'? 'md' : ''} kakao`}></div>
        <div className={`sns-button ${type === '회원가입'? 'md' : ''} naver`}></div>
      </div>
    </div>
  )
}

interface AuthComponentProps {
  onPathChange: (path: AuthPath) => void;
}

function SignUp({onPathChange}: AuthComponentProps) {

  const [name, setName] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCheck, setPasswordCheck] = useState<string>('');
  const [telNumber, setTelNumber] = useState<string>('');
  const [authNumber, setAuthNumber] = useState<string>('');

  const [nameMessage, setNameMessage] = useState<string>('');
  const [idMessage, setIdMessage] = useState<string>('');
  const [passwordMessage, setPasswordMessage] = useState<string>('');
  const [passwordCheckMessage, setPasswordCheckMessage] = useState<string>('');
  const [telNumberMessage, setTelNumberMessage] = useState<string>('');
  const [authNumberMessage, setAuthNumberMessage] = useState<string>('');

  const [nameMessageError, setNameMessageError] = useState<boolean>(false);
  const [idMessageError, setIdMessageError] = useState<boolean>(false);
  const [passwordMessageError, setPasswordMessageError] = useState<boolean>(false);
  const [passwordCheckMessageError, setPasswordCheckMessageError] = useState<boolean>(false);
  const [telNumberMessageError, setTelNumberCheckMessageError] = useState<boolean>(false);
  const [authNumberMessageError, setAuthNumberMessageError] = useState<boolean>(false);

  const [isCheckidId, setCheckedId] = useState<boolean>(false);
  const [isCheckedPassword, setCheckedPassword] = useState<boolean>(false);
  const [isSend, setSend] = useState<boolean>(false);
  const [isCheckedAuthNumber, setCheckedAuthNumber] = useState<boolean>(false);
  const [isMatchedPassword, setMatchedPassword] = useState<boolean>(false);

  // variable: 회원 가입 가능 여부 //
  const isComplete = name && id && isCheckidId && password && passwordCheck && isCheckedPassword && 
  telNumber && isSend && authNumber && isCheckedAuthNumber && isMatchedPassword; 

  // function: 아이디 중복 확인 Response 처리 함수 //
  const idCheckResponse = (responseBody: ResponseDto | null)=> {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '올바른 데이터가 아닙니다.' :
      responseBody.code === 'DI' ? '이미 사용 중인 아이디입니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'SU' ? '사용 가능한 아이디입니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    setIdMessage(message);
    setIdMessageError(!isSuccessed);
    setCheckedId(isSuccessed);
  }

  // function: 전화번호 인증 response 처리 함수 //
  const telAuthResponse = (responseBody: ResponseDto | null) => {
    const message = 
      !responseBody ? '서버에 문제가 있습니다.' :
      responseBody.code === 'VF' ? '숫자 11자 입력해주세요.' :
      responseBody.code === 'DT' ? '중복된 전화번호입니다.' :
      responseBody.code === 'TF' ? '서버에 문제가 있습니다.' :
      responseBody.code === 'DBE' ? '서버에 문제가 있습니다' :
      responseBody.code === 'SU' ? '인증번호가 전송되었습니다.' : '';

    const isSuccessed = responseBody !== null && responseBody.code === 'SU';
    setTelNumberMessage(message);
    setTelNumberCheckMessageError(!isSuccessed);
    setSend(isSuccessed);
  };

  // event Handler: 이름 변경 이벤트 처리 //
  const onNameChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setName(value);
  };

  const onIdChangeHandler = (evnet: ChangeEvent<HTMLInputElement>) => {
    const {value} = evnet.target;
    setId(value);
    setCheckedId(false);
    setIdMessage('');
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setPassword(value);

    const pattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,13}$/;
    const isMatched = pattern.test(value);
    const Message = (isMatched || !value) ? '' : '영문, 숫자를 혼용하여 8-13자 입력해주세요.';
    setPasswordMessage(Message);
    setPasswordMessageError(!isMatched);
    setMatchedPassword(isMatched);
    // if(!passwordCheck) return;
    // const isEqual = passwordCheck === value;
    // const checkmessage = isEqual? '': '비밀번호가 일치하지 않습니다.';
    // setPasswordCheckMessage(checkmessage);
    // setPasswordCheckMessageError(!isEqual);
  }

  const onPasswordCheckChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setPasswordCheck(value);

    
  };

  const onTelNumberChangeHandler = (event : ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setTelNumber(value);
    setSend(false);
    setTelNumberMessage('');
  };

  const onAuthNumberChangeHandler = (evnet: ChangeEvent<HTMLInputElement>) => {
    const {value} = evnet.target;
    setAuthNumber(value);
    setCheckedAuthNumber(false);
    setAuthNumberMessage('');
  };

  // event Handler: 중복 확인 버튼 클릭 이벤트 처리 //
  const onIdcheckClickHandler = () => {
    if(!id) return;

    const requestBody: IdCheckRequestDto = {
      userId: id
    };
    idCheckRequest(requestBody).then(idCheckResponse);
  };

  // event Handler: 전화번호 인증 버튼 클릭 이벤트 처리 //
  const onTelNumberSendClickHandler = () => {
    if(!telNumber) return;

    const pattern = /^[0-9]{11}$/;
    const isMatched = pattern.test(telNumber);

    if(!isMatched) {
      setTelNumberMessage('숫자 11자 입력해주세요.');
      setTelNumberCheckMessageError(true);
      return;
    }

    const requestBody: TelAuthRequestDto = {telNumber};
    telAuthRequest(requestBody).then(telAuthResponse);  
  };

  // event Handler: 인증 확인 버튼 클릭 이벤트 처리 //
  const onAuthNumberCheckClickHandler = () => {
    if(!authNumber) return;
    

    const isMatched = authNumber === 'Q1W2';
    const message = isMatched? '인증번호가 확인되었습니다.' : '인증번호가 일치하지 않습니다.';
    setAuthNumberMessage(message);
    setAuthNumberMessageError(!isMatched);
    setCheckedAuthNumber(isMatched);
  };

  const onSignUpButtonHandler= () => {
    if(!isComplete) return;
    alert('회원가입 완료');
    onPathChange('로그인');
  };

  useEffect(()=> {
    if(!password || !passwordCheck) return;
    
    const isEqual = password === passwordCheck;
    const Message = isEqual? '' : '비밀번호가 일치하지 않습니다.';
    setPasswordCheckMessage(Message);
    setPasswordCheckMessageError(!isEqual);
    setCheckedPassword(isEqual);
  }, [password, passwordCheck]);

  return (

    <div style={{ gap: '16px' }} className="auth-box">
      <div className="title-box">
        <div className="title">시니케어</div>
        <div className="logo"></div>
      </div>
      <SnsContainer type='회원가입'/>
      <div style={{ width: '64px' }} className="divider"></div>

      <div className="input-container">
        <InputBox value={name} label='이름' type='text' placeholder='이름을 입력해주세요.'
          onChange={onNameChangeHandler} message={nameMessage} messageError={nameMessageError} />

        <InputBox value={id} label='아이디' type='text' placeholder='아이디를 입력해주세요.' buttonName='중복확인'
          onChange={onIdChangeHandler} onButtonClick={onIdcheckClickHandler} message={idMessage} messageError={idMessageError} />

        <InputBox value={password} label='비밀번호' type='password' placeholder='비밀번호를 입력해주세요'
          onChange={onPasswordChangeHandler} message={passwordMessage} messageError={passwordMessageError} />

        <InputBox value={passwordCheck} label='비밀번호 확인' type='password' placeholder='비밀번호를 입력해주세요.'
          onChange={onPasswordCheckChangeHandler} message={passwordCheckMessage} messageError={passwordCheckMessageError} />

        <InputBox value={telNumber} label='전화번호' type='text' placeholder='- 빼고 입력해주세요.' buttonName='전화번호 인증'
          onChange={onTelNumberChangeHandler} onButtonClick={onTelNumberSendClickHandler} message={telNumberMessage} messageError={telNumberMessageError} />

        {isSend &&
          <InputBox value={authNumber} label='인증번호' type='text' placeholder='인증번호 4자리를 입력해주세요.' buttonName='인증 확인'
            onChange={onAuthNumberChangeHandler} onButtonClick={onAuthNumberCheckClickHandler} message={authNumberMessage} messageError={authNumberMessageError} />
        }
      </div>

      <div className="button-container">
        <div className={`button ${isComplete ? 'primary' : 'disable'} full-width`}
          onClick={onSignUpButtonHandler}>회원가입</div>
        <div className="link" onClick={()=>onPathChange('로그인')}>로그인</div>
      </div>
    </div>

  )
}

// component: 회원가입 컴포넌트 //
function SignIn({onPathChange}: AuthComponentProps) {

  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const onIdChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setId(value);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setPassword(value);
  };

  const onSignInButtonHandeler = () => {
    if(!id || !password) return;
    if(id !== 'qwer1234' || password !== 'asdf0987') {
      setMessage('로그인 정보가 일치하지 않습니다.');
      return;
    }
    alert('로그인 성공');
  };

  useEffect(()=> {
    setMessage('');
  }, [id, password]);
  

  return (
    <div className="auth-box">
      <div className="title-box">
        <div className="title">시니케어</div>
        <div className="logo"></div>
      </div>
      <div className="input-container">
        <InputBox value={id} onChange={onIdChangeHandler} message='' messageError type='text' label='아이디' placeholder='아이디를 입력해주세요.'/>
        <InputBox value={password} onChange={onPasswordChangeHandler} message={message} messageError type='password' label='비밀번호' placeholder='비밀번호를 입력해주세요.'/>
      </div>
      <div className="button-container">
        <div className="button primary full-width" onClick={onSignInButtonHandeler}>로그인</div>
        <div className="link" onClick={()=> onPathChange('회원가입')}>회원가입</div>
      </div>
      <div style={{width: "64px"}} className="divider"></div>
      <SnsContainer type='로그인'/>
    </div>
  );
}

// component: 인증 화면 컴포넌트 //
export default function Auth() {

  // state: 선택 화면 상태 //
  const [path, setPath] = useState<AuthPath>('로그인');

  // event Handler: 화면 변경 이벤트 처리 //
  const onPathChangeHandler = (path: AuthPath) => {
    setPath(path);
  };

  // render: 인증 화면 컴포넌트 렌더링 //
  return (
    <div id="auth-wrapper">
      <div className="auth-image"></div>
      <div className="auth-container">
        {path === '로그인'? <SignIn onPathChange={onPathChangeHandler}/> 
        : <SignUp onPathChange={onPathChangeHandler}/>}
      </div>
        {/**/}
        
    </div>
  );
}