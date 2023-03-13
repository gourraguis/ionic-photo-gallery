import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { useState } from "react";
import { nanoid } from 'nanoid'
import { UserPhoto } from "../interfaces/UserPhoto";

const base64FromPath = async (path: string): Promise<string> => {
  const response = await fetch(path);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert to base64'))
      }
    }

    reader.readAsDataURL(blob)
  })
}

const savePhoto = async (photo: Photo): Promise<UserPhoto> => {
  if (typeof photo.webPath !== 'string') {
    throw new Error('Photo webPath is not a string')
  }

  const id = nanoid()
  const fileName = id + ".jpeg";
  const base64Data = await base64FromPath(photo.webPath)
  await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  })

  return {
    id,
    fileName,
    webviewPath: photo.webPath,
  }
}

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const savedPhoto = await savePhoto(photo);

    setPhotos([savedPhoto, ...photos]);
  };

  return { photos, takePhoto };
};
