import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';
import {
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import METRICS from '../geo/metrics.json'

interface DataItem {
  town: string;
  confirmed: number;
  recovered: number;
  death: number;
}


interface ContainerProps {
  metrics: any,
  setMetrics: any
}

const mapMmetrics = (m: any) => ({
  ...m
})

const Tab2: React.FC<ContainerProps> = ({ metrics, setMetrics }) => {
  let data = []
  if (metrics.length > 0) {
    data = metrics.map(mapMmetrics).sort((a: any, b: any) => a.confirmed > b.confirmed ? -1 : +1);
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Charts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Charts</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <div style={{
          left: 0,
          top: 0,
          right: 0,
          overflowX: "scroll"
        }}>
          <ResponsiveContainer
            height={300}
            width={'100%'}
          >
            <BarChart
              data={data}
              margin={{
                top: 20, right: 0, left: 0, bottom: 0
              }}

            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="confirmed" fill="#EA8C35" />
              <Bar dataKey="death" fill="#B50122" />
              <Bar dataKey="recovered" fill="#08725F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Tab2;
