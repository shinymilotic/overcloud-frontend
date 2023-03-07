import { Outlet } from "react-router-dom";
import BannerContainer from "../components/BannerContainer";
import ContainerRow from "../components/ContainerRow";
import FeedToggler from "../components/FeedToggler";
import { useAuth } from "../context/AuthContext";
import FeedProvider from "../context/FeedContext";
import PopularTags from "./../components/PopularTags";
import styles from "./../assets/css/Home.css"

function Home() {
  const { isAuth } = useAuth();

  return (
    <div className="home-page">
      {!isAuth && (
        <BannerContainer>
          <h1 className="logo-font">Overcloud</h1>
          <p>Somewhere over the cloud.</p>
        </BannerContainer>
      )}
      <ContainerRow type="page">
        <FeedProvider>
          <div className="col-md-9">
            <FeedToggler />


            <Outlet />


          </div>

          <PopularTags />
        </FeedProvider>
      </ContainerRow>
    </div>
  );
}

export default Home;
