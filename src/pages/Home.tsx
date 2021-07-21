import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSplitPane,
  IonMenu,
  IonList,
  IonItem,
  IonSearchbar
} from '@ionic/react';
import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { GeoJsonLayer, IconLayer } from '@deck.gl/layers'; // GeoJsonLayer 
import {
  StaticMap,
  NavigationControl,
  _MapContext as MapContext,
  Marker,
  LinearInterpolator,
  FlyToInterpolator
} from 'react-map-gl';
import axios from 'axios';
// import { pick } from 'lodash';
// import { Colorscale } from 'react-colorscales';
// import chroma from 'chroma-js';
import {
  BrowserView,
  MobileView,
  // isBrowser,
  // isMobile
} from "react-device-detect";

import './Home.css';

import { getFillColor, onHover } from '../utils';
import { COVID_DATA_ENDPOINT, MINI_PROXY_ENDPOINT } from '../constants'
import REGIONS from '../geo/regions.json';
import HOSPITALS from '../geo/hospitals.json';
import PHARMACIES from '../geo/pharmacies.json';
import POLICE_STATIONS from '../geo/police-stations.json';
import HOTELS from '../geo/data_clean.json';


// import RightPanel from '../components/RightPanel';

// const MAPBOX_STYLE = ''
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoia2FtaXJ1dmljZSIsImEiOiJjazgweHZxaWgwMTQzM2ZzM3c0djl1dXlrIn0.JnPVXLFeeQ_FgSjiC9El0w'

const initialViewState = {
  width: 400,
  height: 400,
  latitude: 3,
  longitude: 11.5,
  zoom: 6,
  pitch: 0,
  bearing: 0
};


interface FeatureData {
  "type": string;
  "id": string;
  "geometry"?: {
    "type": string;
    "coordinates": [
      number,
      number
    ]
  };
  "geometry_name"?: string;
  "properties": {
    "osm_id": string;
    "reg_ref_cog": string;
    "name": string;
    "pop_estim_2020": string;
    "nombre_total_de_cas": number;
    "nombre_de_victimes": number;
    "nombre_de_personnes_retablies": number;
  }
}

type GlobalData = {
  id: string,
  name: string,
  confirmed: number,
  deaths: number,
  recovered: number,
}

class CustomMarker extends React.PureComponent<{ markers: any[] }, {}> {
  render() {
    if (this.props.markers.length > 0) {
      return (
        this.props.markers.map((marker: any) => (
          <Marker
            key={marker.name}
            longitude={marker.longitude}
            latitude={marker.latitude}
            captureClick
          >
            <p>{marker.name}</p>
          </Marker>
        ))
      )
    }
  }
}

interface ContainerProps {
  metrics: any,
  setMetrics: any
}

const Home: React.FC<ContainerProps> = ({ metrics }) => {
  // eslint-disable-next-line no-unused-vars
  const [viewport, setViewport] = React.useState(initialViewState);
  const [staticMap, setStaticMap] = useState();
  const [geoJson, setGeoJson] = useState(REGIONS);
  const [toolTipData, setToolTip] = useState<any>(null); // { x, y, id, name, data: { confirmed, deaths, recovered } }
  const [markers, setMarkers] = useState([]);
  const [filtered, setFiltered] = useState<any>([]);

  function search(searchString: string) {
    let results = HOTELS.filter(function (item) {
      return item.properties.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
    })

    setFiltered(results)

  }

  function geocode(marker: any) {

    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${marker.properties.name + " ,Cameroun"}&key=AIzaSyCa_pW1E6mw931rPfTIlEBtZ-ZcY4blX1E`)
      .then(r => r.json())
      .then(rlt => {
        if (rlt.status == "OK") {
          let [address, placeID] = [
            rlt.results[0].formatted_address,
            rlt.results[0].place_id
          ];
          console.log(rlt)
          setToolTip({ ...marker, address, placeID })

          const url = 'https://geo-response.vercel.app/api/mini-proxy'
          const params = new URLSearchParams()
          params.append('url', `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=name,rating,formatted_phone_number,photos&key=AIzaSyCa_pW1E6mw931rPfTIlEBtZ-ZcY4blX1E`)

          const config = {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }

          axios.post(url, params, config)
            .then((result) => {
              // Do somthing

              let rlt = result.data

              if (rlt.status == "OK") {
                let [number, photos] = [
                  rlt.result.formatted_phone_number,
                  rlt.result.photos
                ];
                // console.log({number, photos})
                setToolTip({ ...marker, address, placeID, number, photos })

                console.log(photos[0].photo_reference)




              }

            })
            .catch((err) => {
              // Do somthing
            })



        }

      })
  }


  const _renderTooltip = () => {
    if (!toolTipData) {
      return null;
    }
    const { properties: { name }, address, placeID, number, photoURI, photos } = toolTipData;
    return (
      <React.Fragment>
        <BrowserView>
          <div className="tooltip" >
            {
              photos &&
              <div className="images">
                {
                  photos.map((photo: any, idx: any) => (
                    <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=3600&photoreference=${photos[idx].photo_reference}&key=AIzaSyCa_pW1E6mw931rPfTIlEBtZ-ZcY4blX1E`} alt=""></img>
                  ))
                }

              </div>
            }

            <div>
              <h2 style={{ margin: '0 0 1rem 0' }}>{name}</h2>
              <div>{address}</div>
              <div>{number}</div>
            </div>
          </div>
        </BrowserView>
        <MobileView>
          <div style={{ position: 'absolute', zIndex: 5, left: '1rem', right: '1rem', bottom: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '4px' }}>
            <h2 style={{ margin: '0 0 1rem 0' }}>{name}</h2>
            {
              photos &&
              <div className="images">
                {
                  photos.map((photo: any, idx: any) => (
                    <img src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=3600&photoreference=${photos[idx].photo_reference}&key=AIzaSyCa_pW1E6mw931rPfTIlEBtZ-ZcY4blX1E`} alt=""></img>
                  ))
                }

              </div>
            }
            <div>{address}</div>
            <div>{number}</div>
          </div>
        </MobileView>
      </React.Fragment>
    );
  }

  function onLayerClick(data: any) {
    geocode(data.object)
  }

  const layers = [
    new GeoJsonLayer({
      id: 'regions-geo-json',
      data: geoJson,
      highlightColor: [0, 0, 0, 50],
      autoHighlight: true,
      getFillColor: (data: any) => [37, 150, 190, 0.2],
      updateTriggers: {
        getFillColor: [37, 150, 190, 0.2]
      },
      stroked: true,
      filled: true,
      strokeColor: [255, 0, 0],
      getStrokeColor: () => [0, 0, 0, 255],

      /* interact */
      pickable: true,
      // onHover: (data: any) => onHover(data, metrics, setToolTip),
      // onClick: (data: any) => {

      //   console.log('clicked:', data)
      //   // console.log('country data:', metrics[data.object.id]);
      // }
    }),
    new IconLayer({
      id: 'hotels',
      data: HOTELS,
      getIcon: () => ({
        url: 'https://img.icons8.com/office/40/000000/place-marker--v1.png',
        width: 128,
        height: 128,
        anchorY: 128
      }),
      pickable: true,
      sizeScale: 30,
      getPosition: (d: any) => d.geometry.coordinates,
      onClick: (d: any) => onLayerClick(d),
    })
  ]

  return (
    <IonPage>
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Site touristique du Cameroun</IonTitle>
        </IonToolbar>
      </IonHeader> */}



      <IonSplitPane contentId="main">

        {/*--  the side menu  --*/}
        <IonMenu contentId="main">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Site touristique du Cameroun</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonSearchbar
              placeholder="Recherche"
              // value={searchText}
              // onIonChange={e => setSearchText(e.detail.value!)}
              onIonChange={e => search(e.detail.value!)}
            ></IonSearchbar>
            <IonList>
              {
                (filtered.length <= 0 && HOTELS.length > 0) && HOTELS.map((marker: any, idx: any) => (
                  <IonItem
                    key={idx + ''}
                    button
                    onClick={() => {
                      geocode(marker)
                      setViewport({
                        width: 400,
                        height: 400,
                        latitude: marker.geometry.coordinates[1],
                        longitude: marker.geometry.coordinates[0],
                        zoom: 16,
                        pitch: 0,
                        bearing: 0
                      });
                    }}
                  >
                    {marker.properties.name}
                  </IonItem>
                ))
              }
              {
                filtered.length > 0 && filtered.map((marker: any) => (
                  <IonItem
                    key={marker.properties.name}
                    button
                    onClick={() => {
                      geocode(marker)
                      setViewport({
                        width: 400,
                        height: 400,
                        latitude: marker.geometry.coordinates[1],
                        longitude: marker.geometry.coordinates[0],
                        zoom: 16,
                        pitch: 0,
                        bearing: 0
                      });
                    }}
                  >
                    {marker.properties.name}
                  </IonItem>
                ))
              }
            </IonList>
          </IonContent>
        </IonMenu>

        <IonContent id="main">
          {/*-- the main content --*/}
          <DeckGL
            initialViewState={viewport}
            onViewportChange={setViewport}
            controller={true}
            layers={layers}
            Style={{ width: '100vw', height: '100vh' }}
            ContextProvider={MapContext.Provider}
            transitionDuration={1000}
            transitionInterpolator={new FlyToInterpolator()}
            onClick={() => setToolTip(null)}
          >
            <StaticMap
              ref={ref => setStaticMap(ref)} width='100%' height='100%'
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            // Uncomment to add custom styles
            // mapStyle={MAPBOX_STYLE}
            />
            <div style={{ position: "absolute", right: '1rem', bottom: '6rem', zIndex: 10 }}>
              <NavigationControl showCompass={false} />
            </div>
            {
              markers.length > 0 && <CustomMarker markers={markers} />
            }
          </DeckGL>


          {/* <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Site touristique du Cameroun</IonTitle>
            </IonToolbar>
        </IonHeader> */}


          {_renderTooltip()}

        </IonContent>
      </IonSplitPane>

    </IonPage>
  );
};

export default Home;
