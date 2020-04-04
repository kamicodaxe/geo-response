import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import LeftPanel from '../components/LeftPanel';

interface ContainerProps {
  metrics: any,
  setMetrics: any
}


const Tab1: React.FC<ContainerProps> = ({ metrics, setMetrics }) => {
  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent>
        {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader> */}
        <LeftPanel metrics={metrics} setMetrics={setMetrics} />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
