import React from "react";
import "../../css/header.css";
import Logo from "../../img/logo.png";
import {Link} from "react-router-dom";

function Header() {
  const zoom = "https://google.zoom.us/google/oauth/client?st=ExaM5FvdTa-vhBsdNZ10lQ&code=4%2F0AY0e-g5uHHGsBcyvaybYSLOAb1rJfA98hNdELqHRteVTmITkiJKwvWTy1nwvP4Bwv2Yahg&scope=email%20profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email%20openid&reqId=FOWiTV-iJNarPGeELBU7B2tkjIQKxw7OAUxRZkrcXsU-&ver=5.4.59296.1207&mode=token2#";
  
  const DynamicOnMouseOver = () => {
    document.querySelector("#ButtonDynamic").innerHTML = "Logout";
  }
  const DynamicOnMouseOut = () => {
    document.querySelector("#ButtonDynamic").innerHTML = user;
  }
  const ButtonLogoutClick = () => {
    window.localStorage.removeItem("refreshToken");
    window.localStorage.removeItem("accessToken");
    window.localStorage.removeItem("userName");
    window.location.href = "/";
  }

  const user = window.localStorage.getItem("userName");
  
  return (
    <div className="Header">
      <div>
        <div id="HeaderWrap">
          <img id="Logo" src={Logo} alt="HyperionLogo"></img>
          <nav>
            <div>
              <a id="ButtonGoPage" href="https://band.us/home">네이버 밴드</a>
              <a id="ButtonGoPage" href={zoom}>ZOOM</a>
              <Link id="ButtonDynamic" to="/" onMouseOver={DynamicOnMouseOver} onMouseOut={DynamicOnMouseOut} onClick={ButtonLogoutClick}>{user}</Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Header;