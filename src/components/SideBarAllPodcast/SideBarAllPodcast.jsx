import "./Style/SideBarAllPodcast.css";
import Cookies from "js-cookie";
import axios from "../../Axios-API/Axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIdOfSelectedPodcast } from "../../store/selectedPodcastSlice";
import { setCurrentUser } from "../../store/currentUserSlice";


function SideBarAllPodcast() {
  
  const history = useNavigate();

  const [podcast, setPodcast] = useState();
  const [dataOfAllPodcastFromDatabase, setDataOfAllPodcastFromDatabase] = useState();
  const idOfPodcast = useSelector((state) => state.onePodcast.selectedPodcast);
  const dispatch = useDispatch();

  function fetchPodcast(data) {
    setDataOfAllPodcastFromDatabase(data);
    let urlforFetch = "";
    data.forEach((elem) => {
      urlforFetch += `&id=${elem.chanelId}`;
    });
    const urlApi = `https://youtube.googleapis.com/youtube/v3/channels?part=snippet%2CcontentDetails%2Cstatistics${urlforFetch}&key=AIzaSyC2YVRyg7s8EiUvepq6E5go2AiFQV1Mj2I`;
    const allPodcast = fetch(urlApi)
      .then((res) => res.json())
      .then((data) => {
        setPodcast(data.items);
      })
      .catch((error) => console.log(error));
  }

  const getAllPodcastFromDatabase = () => {
    axios
      .get("/app/getAllPodcast")
      .then((res) => fetchPodcast(res.data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
      const isCookie = Cookies.get("loginCookie");
      if (isCookie) {
        let cookieSend = { isCookie };
        const result = axios
          .post("/app/checkCookie", cookieSend)
          .then((res) => checkRes(res));
  
          async function checkRes(res) {
          console.log(res.status)
          if (res.status !== 201) {
            Cookies.remove("loginCookie");
            history("/");
          } else {
            dispatch(setCurrentUser(res.data[1]));
          }
        }
      } else {
        history("/");
      }

    getAllPodcastFromDatabase();
  }, []);

  const selectedPodcast = (e) => {
    const selectedPodcast = dataOfAllPodcastFromDatabase.filter(
      (elem) => elem.chanelId == e.target.dataset.id
    );
    const onePodcastData = podcast.filter(
      (elem) => elem.id == e.target.dataset.id
    );
    dispatch(setIdOfSelectedPodcast([selectedPodcast, onePodcastData]));
  };

  return (
    <section id="mainDivSideBar">
      {podcast?.map((elem) => (
        <article key={elem.id} className="onePodcast">
          <img
            className="imgOfPodcastSideBar"
            src={elem.snippet.thumbnails.medium.url}
            alt={elem.snippet.thumbnails.high.url}
          />
          <h2 className="nameOfPodcast">{elem.snippet.title}</h2>
          <button
            className="btnSideBar"
            data-id={elem.id}
            onClick={(e) => selectedPodcast(e)}
          >
            Watch
          </button>
        </article>
      ))}
    </section>
  );
}

export default SideBarAllPodcast;
