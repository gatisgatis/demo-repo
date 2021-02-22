import React, {useEffect, useRef, useState} from 'react';
import Button from '@material-ui/core/Button';
import {Box, Grid} from '@material-ui/core';
import {makeStyles, Theme, useTheme} from '@material-ui/core/styles';
import TextComponent from "./components/TextComponent";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import TextField from '@material-ui/core/TextField';
import usePlacesAutoComplete, {getGeocode, getLatLng} from 'use-places-autocomplete';
import mapboxgl from 'mapbox-gl'
import axios from 'axios'

const mbxClient = require('@mapbox/mapbox-sdk');

console.log("%cMy message%c Styled different here", "color: red; font-size: 25px", "font-weight: bold; color: blue; text-shadow: 1px 1px green; font-size: 30px")

const MAPBOX_TOKEN = 'pk.eyJ1IjoiZ2F0aXNnYXRpcyIsImEiOiJja2w5N2gxNXgzOGE4MnVtc2E5ZXp1dmFzIn0.M8Z2RD7BA3RbO8IZAO7uIg'

const useStyles = makeStyles((theme: Theme) => {
    return ({
        specialBtn: {
            padding: '50px',
            color: theme.palette.primary.main,
            backgroundColor: theme.palette.background.default,
        },
        mapContainer: {
            height: '500px',
            border: '2px solid blue',
            borderRadius: '5px',
            overflow: 'hidden',
            width: '80%',
            marginTop: '50px',
        }
    });
});



const Search = () => {
    const {value, setValue, ready, suggestions: {data}, clearSuggestions} = usePlacesAutoComplete({
        requestOptions: {
            componentRestrictions: {
                country: 'lv',
            },
            location: {lat: () => 57.83440371269999, lng: () => 24.74942942764394},
            radius: 500,
        },
        debounce: 600,
    })

    const handleSelect = (item: { description: string }) => {
        // When user selects a place, we can replace the keyword without request data from API
        // by setting the second parameter to "false"
        setValue(item.description, false);
        clearSuggestions();

        // Get latitude and longitude via utility functions
        getGeocode({address: item.description})
            .then((results) => {
                console.log(results);
                console.log(results[0]);
                return getLatLng(results[0])
            })
            .then(({lat, lng}) => {
                console.log("📍 Coordinates: ", {lat, lng});
            })
            .catch((error) => {
                console.log("😱 Error: ", error);
            });
    };


    return (
        <div>
            <input disabled={!ready} type="text" value={value} onChange={(event) => setValue(event.target.value)}/>
            <Box>
                <Box>
                    {data?.map((item, index) => {
                        return (
                            <h4 key={index} onClick={() => handleSelect(item)}>
                                {item.description}
                            </h4>
                        )
                    })}
                </Box>
            </Box>
        </div>
    )
};

const App = () => {
    const classes = useStyles();
    const [inputText, setInputText] = useState('')
    const mapContainer = useRef(null);
    const [mapCenter, setMapCenter] = useState({lng: 24.74, lat: 57.83});
    const mapRef = useRef<mapboxgl.Map>();

    useEffect(() => {
        axios.get('https://www.delfi.lv/').then((res) => {
            console.log(res);
            }
        )
    })

    useEffect(() => {
        mapboxgl.accessToken = MAPBOX_TOKEN
        // Initialize map
        const map = new mapboxgl.Map({
            container: mapContainer.current!, // container ref
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: {lng: 24.74, lat: 57.83}, // starting position [lng, lat]
            zoom: 12 // starting zoom
        });
        // Save map ref
        mapRef.current = map;
        // Add event listeners
        map.on('click', (event) => {
            setMapCenter(map.getCenter());
        })
    }, [])

    const setMapNew = () => {
        mapRef.current?.setCenter(mapCenter)
    }

    const updateClosestPlace = async (lngLat: {lng: number; lat: number}) => {
        getGeocode({
            location: lngLat,
        }).then(response => {
            console.log(response);
        }).catch(error => console.error(`getGeocode error: ${error}`));
    }

    return (
        <div>
            <TextComponent text='Testing' isRed={true}/>
            <Grid container>
                <Grid item container>
                    <Grid item xs={12} sm={6}>
                        <Search/>
                        <button onClick={setMapNew}>Set New Center</button>
                        <button onClick={() => updateClosestPlace(mapCenter)}>See Adress</button>
                        <div>
                            <div>{mapCenter.lat} {mapCenter.lng}</div>
                            <div className={classes.mapContainer} ref={mapContainer}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <h4>Ieraksti tekstu un tad vari to nokopēt</h4>
                        <Box m={2}>
                            <TextField
                                variant="outlined" value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </Box>
                        <CopyToClipboard text={inputText}>
                            <Button variant="contained">Copy Text</Button>
                        </CopyToClipboard>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default App;
