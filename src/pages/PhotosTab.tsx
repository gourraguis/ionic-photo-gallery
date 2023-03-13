import {
  IonContent,
  IonFab,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonFabButton,
  IonIcon,
} from "@ionic/react";
import { camera } from "ionicons/icons";
import "./PhotosTab.css";

const PhotosTab: React.FC = () => {
  const takePhoto = () => {
    console.log("Taking photo");
  };

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

        <IonFab vertical="bottom" horizontal="center" slot="fixed">
          <IonFabButton onClick={takePhoto}>
            <IonIcon icon={camera} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default PhotosTab;
