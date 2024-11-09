import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBox,
  faSearch,
  faShoppingBag,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/user/userSlice";
import { initialCart } from "../../features/cart/cartSlice";
import { color } from "@cloudinary/url-gen/qualifiers/background";
const weatherAPI = process.env.REACT_APP_WEATHER_API_KEY;

const Navbar = ({ user }) => {
  const dispatch = useDispatch();
  const { cartItemCount } = useSelector((state) => state.cart);
  const isMobile = window.navigator.userAgent.indexOf("Mobile") !== -1;
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [warning, setWarning] = useState("");
  const menuList = [
    "여성",
    "Divided",
    "남성",
    "신생아/유아",
    "아동",
    "H&M HOME",
    "Sale",
    "지속가능성",
  ];

  let [width, setWidth] = useState(0);
  let navigate = useNavigate();

  const onCheckEnter = (event) => {
    if (event.key === "Enter") {
      if (event.target.value === "") {
        return navigate("/");
      }
      navigate(`?name=${event.target.value}`);
    }
  };
  const handleLogout = () => {
    dispatch(initialCart());
    dispatch(logout());
    navigate("/");
  };

  const handleCityChange = (event) => {
    const input = event.target.value;
    setCity(input); // 입력값을 상태에 저장

    // 한국어가 포함되어 있을 경우 경고 메시지 출력
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(input)) {
      setWarning("도시 이름은 영어로 입력해주세요.");
    } else {
      setWarning(""); // 한국어가 없으면 경고 메시지 제거
    }
  };

  const fetchWeather = async () => {
    if (!city || warning) {
      setError("도시 이름을 입력하고 검색 버튼을 눌러주세요.");
      return;
    }

    try {
      // 도시 이름을 encodeURIComponent로 처리하여 안전하게 전달
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          city
        )}&appid=${weatherAPI}&units=metric&lang=kr`
      );
      if (!response.ok) {
        throw new Error("날씨 데이터를 불러오는 데 실패했습니다.");
      }
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const getWeatherColor = (description) => {
    switch (description.toLowerCase()) {
      case "clear sky":
        return "skyblue";
      case "few clouds":
        return "lightgray";
      case "scattered clouds":
        return "gray";
      case "broken clouds":
        return "darkgray";
      case "shower rain":
        return "blue";
      case "rain":
        return "darkblue";
      case "thunderstorm":
        return "purple";
      case "snow":
        return "white";
      case "mist":
        return "lightblue";
      default:
        return "#FFDAB9";
    }
  };

  return (
    <div>
      {showSearchBox && (
        <div className="display-space-between mobile-search-box w-100">
          <div className="search display-space-between w-100">
            <div>
              <FontAwesomeIcon className="search-icon" icon={faSearch} />
              <input
                type="text"
                placeholder="제품검색"
                onKeyPress={onCheckEnter}
              />
            </div>
            <button
              className="closebtn"
              onClick={() => setShowSearchBox(false)}
            >
              &times;
            </button>
          </div>
        </div>
      )}
      <div className="side-menu" style={{ width: width }}>
        <button className="closebtn" onClick={() => setWidth(0)}>
          &times;
        </button>

        <div className="side-menu-list" id="menu-list">
          {menuList.map((menu, index) => (
            <button key={index}>{menu}</button>
          ))}
        </div>
      </div>
      {user && user.level === "admin" && (
        <Link to="/admin/product?page=1" className="link-area">
          Admin page
        </Link>
      )}
      <div className="nav-header">
        <div className="burger-menu hide">
          <FontAwesomeIcon icon={faBars} onClick={() => setWidth(250)} />
        </div>

        <div>
          <div className="display-flex">
            {user ? (
              <div onClick={handleLogout} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && (
                  <span style={{ cursor: "pointer" }}>로그아웃</span>
                )}
              </div>
            ) : (
              <div onClick={() => navigate("/login")} className="nav-icon">
                <FontAwesomeIcon icon={faUser} />
                {!isMobile && <span style={{ cursor: "pointer" }}>로그인</span>}
              </div>
            )}
            <div onClick={() => navigate("/cart")} className="nav-icon">
              <FontAwesomeIcon icon={faShoppingBag} />
              {!isMobile && (
                <span style={{ cursor: "pointer" }}>{`쇼핑백(${
                  cartItemCount || 0
                })`}</span>
              )}
            </div>
            <div
              onClick={() => navigate("/account/purchase")}
              className="nav-icon"
            >
              <FontAwesomeIcon icon={faBox} />
              {!isMobile && <span style={{ cursor: "pointer" }}>내 주문</span>}
            </div>
            {isMobile && (
              <div className="nav-icon" onClick={() => setShowSearchBox(true)}>
                <FontAwesomeIcon icon={faSearch} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="nav-logo">
        <Link to="/">
          <img width={100} src="/image/texas-logo.png" alt="texas-logo.png" />
        </Link>
      </div>

      <div className="weather-search-box">
        <input
          type="text"
          placeholder="도시 이름을 입력하세요"
          value={city}
          onChange={handleCityChange} // 입력값 변경 시 상태 업데이트
        />
        <button onClick={fetchWeather}>날씨 검색</button>
      </div>

      {/* 경고 메시지 출력 */}
      {warning && (
        <div className="weather-warning" style={{ color: "red" }}>
          {warning}
        </div>
      )}

      {/* 날씨 정보 표시 */}
      <div className="weather-info">
        {error ? (
          <p>{error}</p> // 오류 메시지 표시
        ) : !weather ? (
          <p>날씨를 알고 싶은 도시를 검색하세요!</p>
        ) : (
          <p>
            <span style={{ color: "yellow" }}>{weather.name}</span>의 날씨:{" "}
            <span style={{ color: "yellow" }}>{weather.main.temp}°C</span>{" "}
            <span
              style={{
                color: getWeatherColor(weather.weather[0].description),
              }}
            >
              {weather.weather[0].description}
            </span>
          </p>
        )}
      </div>

      <div className="nav-menu-area">
        <ul className="menu">
          {menuList.map((menu, index) => (
            <li key={index}>
              <a href="#">{menu}</a>
            </li>
          ))}
        </ul>
        {!isMobile && ( // admin페이지에서 같은 search-box스타일을 쓰고있음 그래서 여기서 서치박스 안보이는것 처리를 해줌
          <div className="search-box landing-search-box ">
            <FontAwesomeIcon icon={faSearch} />
            <input
              type="text"
              placeholder="제품검색"
              onKeyPress={onCheckEnter}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
