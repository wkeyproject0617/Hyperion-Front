import React, { useState } from 'react';
import './employee.css';
// import EmployeeRegister from "./employeeReigster";
import EmployeeMain from './employeeMain';
import EmployeeCRUD from './employeeCRUD';

function Employee() {
  const [mode, setMode] = useState('Main');
  const [userId, setUserId] = useState(0);
  return (
    <div className="Employee">
      {mode === 'Main' ? <EmployeeMain mode={mode} setMode={setMode} setUserId={setUserId} /> : null}
      {mode === 'Register' || mode === 'Detail' ? <EmployeeCRUD mode={mode} setMode={setMode} userId={userId} /> : null}
    </div>
  );
}

export default Employee;
