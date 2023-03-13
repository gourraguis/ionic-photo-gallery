import { Camera, CameraResultType, CameraSource, Photo } from "@capacitor/camera";
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences'
import { useEffect, useState } from "react";
import { nanoid } from 'nanoid'
import { UserPhoto } from "../interfaces/UserPhoto";
import { isPlatform } from "@ionic/core";
import { Capacitor } from "@capacitor/core";

const PHOTO_STORAGE = "photos";

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
  const id = nanoid()
  const fileName = id + ".jpeg";

  let base64Data: string
  if (isPlatform('hybrid')) {
    const file = await Filesystem.readFile({
      path: photo.path!
    })
    base64Data = file.data
  } else {
    base64Data = await base64FromPath(photo.webPath!)
  }

  const savedFile = await Filesystem.writeFile({
    path: fileName,
    data: base64Data,
    directory: Directory.Data,
  })

  return {
    id,
    filePath: isPlatform('hybrid') ? savedFile.uri : fileName,
    webviewPath: isPlatform('hybrid') ? Capacitor.convertFileSrc(savedFile.uri) : photo.webPath,
  }
}

const loadSavedPhotos = async (): Promise<UserPhoto[]> => {
  const { value } = await Preferences.get({ key: PHOTO_STORAGE })

  if (!value) {
    return []
  }

  const photos = JSON.parse(value) as UserPhoto[]

  if (isPlatform('hybrid')) {
    return photos
  }

  const loadedPhotos = photos.map(async (photo) => {
    const file = await Filesystem.readFile({
      path: photo.filePath,
      directory: Directory.Data,
    })
    return {
      ...photo,
      webviewPath: `data:image/jpeg;base64,${file.data}`
    }
  })

  return Promise.all(loadedPhotos)
}

export const usePhotoGallery = () => {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  useEffect(() => {
    loadSavedPhotos().then(setPhotos)
  }, [])

  const takePhoto = async () => {
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });
    const savedPhoto = await savePhoto(photo);

    const newPhotos = [savedPhoto, ...photos];
    setPhotos(newPhotos);
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(newPhotos)
    })
  };

  const deletePhoto = async (photo: UserPhoto) => {
    const filename = photo.filePath.substr(photo.filePath.lastIndexOf('/') + 1)
    await Filesystem.deleteFile({
      path: filename,
      directory: Directory.Data
    })

    const updatedPhotos = photos.filter(p => p.id !== photo.id)
    Preferences.set({
      key: PHOTO_STORAGE,
      value: JSON.stringify(updatedPhotos)
    })
    setPhotos(updatedPhotos)
  }

  return { photos, takePhoto, deletePhoto };
};
