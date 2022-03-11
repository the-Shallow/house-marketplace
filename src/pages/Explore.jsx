import { Link } from "react-router-dom";
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import SellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';
import Slider from "../components/Slider";

function Explore() {
  return (
    <div className="explore">
      <header className="pageHeader">
        <p className="pageHeader">Explore</p>
      </header>

      <main>
        <Slider />
        <p className="exploreCategoryHeading">Categories</p>

        <div className="exploreCategories">
          <Link to={'/category/rent'}>
            <img src={rentCategoryImage} alt="rent" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Places for rent</p>
          </Link>

          <Link to={'/category/sale'}>
            <img src={SellCategoryImage} alt="sell" className="exploreCategoryImg" />
            <p className="exploreCategoryName">Places for sell</p>
          </Link>
        </div>
      </main>
    </div>
  )
}

export default Explore