import galleryImages from "./galleryImages";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
const MasonryImagesGallery = () => {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 768: 3, 992: 4 }}>
      <Masonry gutter="1rem">
        {galleryImages.map((item, index) => (
          <div
            className="masonry__item"
            key={index}
            style={{
              width: "100%",
              paddingBottom: "100%",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <img
              className="masonry__img"
              src={item}
              alt=""
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                display: "block",
                borderRadius: "15px",
              }}
            />
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryImagesGallery;
