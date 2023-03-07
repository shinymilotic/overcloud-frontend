import styles from "./../../assets/css/BannerContainer.css"

function BannerContainer({ children }) {
  return (
    <div className="banner background-image">
      <div className="container">
        {children}
      </div>
    </div>
  );
}

export default BannerContainer;