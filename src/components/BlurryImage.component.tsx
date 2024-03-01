import React, { useState, useEffect } from "react";
import { Blurhash } from "react-blurhash";
const getImage = async (imageUrl: string) => {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl; // Set the source after the onload handler to trigger loading
  return new Promise((resolve) => {
    img.onload = () => {
      resolve("downloaded");
    };
  });
};

const BlurryImage = ({
  hash,
  imageUrl,
  className,
}: {
  hash: string;
  imageUrl: string;
  className: string;
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //getImage(imageUrl).then(() => {
    setLoading(false);
    //});
  }, [imageUrl]);

  return (
    <>
      {loading ? (
        <Blurhash hash={hash} className={className} width={100} height={100} />
      ) : (
        <img src={imageUrl} alt={imageUrl} className={className} />
      )}
    </>
  );
};

export default BlurryImage;
