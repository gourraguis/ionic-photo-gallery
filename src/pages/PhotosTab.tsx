import {
  IonContent,
  IonFab,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFabButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonActionSheet,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import { useState } from "react";
import { usePhotoGallery } from "../hooks/usePhotoGallery";
import { UserPhoto } from "../interfaces/UserPhoto";
import "./PhotosTab.css";

const PhotosTab: React.FC = () => {
  const { photos, takePhoto, deletePhoto } = usePhotoGallery();
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Photo Gallery</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Photo Gallery</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonGrid>
          <IonRow>
            {photos.map((photo) => (
                <IonCol size="6" key={photo.id}>
                  <IonImg onClick={() => setSelectedPhoto(photo)} src={photo.webviewPath} />
                </IonCol>
              ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={!!selectedPhoto}
          buttons={[{
            text: 'Delete',
            role: 'destructive',
            icon: 'trash',
            handler: () => {
              if (selectedPhoto) {
                deletePhoto(selectedPhoto);
                setSelectedPhoto(undefined);
              }
            }
          }, {
            text: 'Cancel',
            icon: 'close',
            role: 'cancel',
          }]}
          onDidDismiss={() => setSelectedPhoto(undefined)}
        />
      </IonContent>
    </IonPage>
  );
};

export default PhotosTab;
