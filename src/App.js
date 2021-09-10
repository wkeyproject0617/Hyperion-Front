import React, { useRef } from 'react';
import { Route } from 'react-router-dom';

import Header from './views/common/header';
import LoginHeader from './views/common/loginHeader';

import Login from './views/pages/login';
import FindIdPw from './views/pages/findIdPw';
import Register from './views/pages/register';
import TeacherMain from './views/pages/teacherMain';

function App() {
  const usermode = useRef(null);

  return (
    <>
      {/*
      <Route path="/login/student" render={
          props => <Login {...props} mode={usermode.current="student"}/>
        }
      />
      */}
      <Route path="/" exact component={Login} />

      <Route
        path="/register"
        render={(props) => <Register {...props} mode={usermode.current} />}
      />

      <Route
        path="/teacherMain"
        render={(props) => (
          <>
            <Header />
            <TeacherMain {...props} />
          </>
        )}
      />

      <Route
        path="/findIdPw"
        render={(props) => (
          <>
            <LoginHeader {...props} />
            <FindIdPw {...props} />
          </>
        )}
      />
    </>
  );
}

export default App;
