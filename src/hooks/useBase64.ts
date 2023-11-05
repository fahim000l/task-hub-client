import React, { useEffect, useState } from "react";

const useBase64 = (imageFile?: File) => {
  const [convertedImage, setConvertedImage] = useState<string>("");

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onload = () => {
        const base64String = reader.result as string;
        setConvertedImage(base64String);
      };

      reader.onerror = (err) => {
        console.error({ error: "Base64 convertion failed" });
      };
    }
  }, [imageFile]);

  return { convertedImage };
};

export default useBase64;
