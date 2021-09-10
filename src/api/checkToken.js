import Swal from "sweetalert2";

function CheckToken(refreshToken, token, setToken, res){
    if(res.data.message === "토큰만료" && token === refreshToken){
        Swal.fire("토큰이 만료되어 로그인 페이지로 이동합니다", "", "warning");
        window.location.href = "/";
    }
    else if(res.data.message === "엑세스토큰 재발급"){
        window.localStorage.setItem("accessToken", res.data.accessToken);
        setToken(res.data.accessToken);
    }else{
        setToken(refreshToken);
    }
}

export default CheckToken;