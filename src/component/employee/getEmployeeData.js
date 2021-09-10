import CheckToken from "../../api/checkToken";
import Api from "../../api/dataControllerApi";

const GetEmployeeData = {
    getEmployeeList(token, setToken, refreshToken, setEmployeeList){
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.getData(`/adminApi/userSearch?name=`, header).then(res => {
            if(res.data.description === "조회성공"){
                setEmployeeList(res.data.data);
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    },

    getEmployeeDetail(token, setToken, refreshToken, mode, setInputs, userId){
        const header = {
            headers:{
                Authorization: `Bearer ${token}`
            }
        }
        Api.getData(`/adminApi/employees/${userId}`, header).then(res => {
            console.log(res);
            if(res.data.description === "조회성공"){
                const data = res.data.data;
                const start_time = data.start_time.split(":");
                const end_time = data.end_time.split(":");
                const subject_list = data.subject_list;
                if(mode === "Detail"){
                    setInputs({
                        employee_name:data.user_name + "-" + data.user_account,
                        employee_grade:data.user_grade,
                        task:data.task,
                        start_hour:start_time[0],
                        start_min:start_time[1],
                        end_hour:end_time[0],
                        end_min:end_time[1],
                        monday:data.monday,
                        tuesday:data.tuesday,
                        wednesday:data.wednesday,
                        thursday:data.thursday,
                        friday:data.friday,
                        saturday:data.saturday,
                        sunday:data.sunday
                    })
                }else if(mode === "GetSubject"){
                    setInputs(subject_list)
                }
            }else{
                CheckToken(refreshToken, token, setToken, res);
            }
        }).catch(err => {
            console.log(err);
        })
    }

}

export default GetEmployeeData;