import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useState } from "react";
import { nanoid } from 'nanoid'
import { UserPhoto } from "../interfaces/UserPhoto";

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const id = nanoid()
    const fileName = new Date().getTime() + ".jpeg";

    setPhotos([...photos, { id, fileName, webviewPath: photo.webPath }]);
  };

  return { photos, takePhoto };
};
