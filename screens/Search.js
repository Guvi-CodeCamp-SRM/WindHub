import React,{useState,useEffect} from 'react';
import { StyleSheet, View,TextInput,FlatList,Text,TouchableOpacity, Alert,Button,Platform,StatusBar } from 'react-native';
import { Card } from 'react-native-paper';
import axios from 'axios';
import Constants from 'expo-constants';
import * as Location from 'expo-location';


export default function Search({navigation}){
    const [city,setCity] = useState('');
    const [cities,setCities] = useState([]);
    const [data,setdata] = useState({text:'city'});

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
  
    useEffect(() => {
      (async () => {
        if (Platform.OS === 'android' && !Constants.isDevice) {
          setErrorMsg(
            'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
          );
          return;
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      })();
    }, []);

    const clickHandler= ()=> {
  
        let text = 'Waiting..';
        if (errorMsg) {
          text = errorMsg;
        } else if (location) {
          text = JSON.stringify(location);
          console.log(JSON.stringify(location));
          console.log(JSON.stringify(location.coords.latitude));
          console.log(JSON.stringify(location.coords.longitude));
          const latitude = JSON.stringify(location.coords.latitude);
          const longitude=JSON.stringify(location.coords.longitude);
          axios.get("https://api.weatherbit.io/v2.0/forecast/daily?&lat="+latitude+"&lon="+longitude+"&key=c8a42097ee0148de82b6fe4c5e85b6b5")
          .then(info =>{
            const city = info.data.city_name;
          const check = info.data.timezone;
          console.log(city);
          axios.get("http://worldtimeapi.org/api/timezone/"+check+".json")
          .then(time=>{
  
              var sunrisets=parseInt(info.data.data[0].sunrise_ts)-parseInt(info.data.data[0].ts);
              sunrisets = sunrisets-(5.5*60*60);
              var sunsetts=parseInt(info.data.data[0].sunset_ts)-parseInt(info.data.data[0].ts);
              sunsetts = sunsetts-(5.5*60*60);
              const dateobj1 = new Date(sunrisets*1000);
              const dateobj2 = new Date(sunsetts*1000);
              const sr =dateobj1.toLocaleString().slice(11,16);
              const ss =dateobj2.toLocaleString().slice(11,16);
              const temprature=info.data.data[0].temp;
              const samay=time.data.datetime.slice(11,16);
              const max_temp=info.data.data[0].max_temp;
              const min_temp=info.data.data[0].min_temp;
             const wind=info.data.data[0].wind_spd;
             const pop=info.data.data[0].pop;
             const Sunrise=sr;
             const Sunset=ss;
             
             navigation.navigate('Weather',{city:city,country:'India',temprature:temprature,Time:samay,max:max_temp,min:min_temp,windspd:wind,rain:pop,sunrise:Sunrise,sunset:Sunset});
          })
          
          
  
          
          
      })
          
        }
        
      }



    

    const fetchCities = (val) => {
        setCity(val);
        if(val.length==0){
            val=val;
        }
        else{
            axios.get("https://api.weather.com/v3/location/search?apiKey=6532d6454b8aa370768e63d6ba5a832e&language=en-US&query="+val+"&locationType=city&format=json")
            .then(data=>{
                setCities(data.data.location.address.slice(0,7))
                })
            .catch(error=>{
                setCity('');
                Alert.alert('OOPS!','Something Went Wrong',[
                    {text:'OK',onPress:()=> console.log('error')}
                ])
            })

        }

            

        

        

        

    }

    const pressHandler = (item)=>{
        const length =item.split(',').length;
        const city = item.split(',')[0];
        const state = item.split(',')[length-1];
        axios.get("https://api.weatherbit.io/v2.0/forecast/daily?city="+city+","+state+"&key=c8a42097ee0148de82b6fe4c5e85b6b5")
        .then(info =>{
        const check = info.data.timezone;
        axios.get("http://worldtimeapi.org/api/timezone/"+check+".json")
        .then(time=>{

            var sunrisets=parseInt(info.data.data[0].sunrise_ts)-parseInt(info.data.data[0].ts);
            sunrisets = sunrisets-(5.5*60*60);
            var sunsetts=parseInt(info.data.data[0].sunset_ts)-parseInt(info.data.data[0].ts);
            sunsetts = sunsetts-(5.5*60*60);
            const dateobj1 = new Date(sunrisets*1000);
            const dateobj2 = new Date(sunsetts*1000);
            const sr =dateobj1.toLocaleString().slice(11,16);
            const ss =dateobj2.toLocaleString().slice(11,16);
            const temprature=info.data.data[0].temp;
            const samay=time.data.datetime.slice(11,16);
            const max_temp=info.data.data[0].max_temp;
            const min_temp=info.data.data[0].min_temp;
           const wind=info.data.data[0].wind_spd;
           const pop=info.data.data[0].pop;
           const Sunrise=sr;
           const Sunset=ss;
           
           navigation.navigate('Weather',{city:city,country:state,temprature:temprature,Time:samay,max:max_temp,min:min_temp,windspd:wind,rain:pop,sunrise:Sunrise,sunset:Sunset});
        })
        
        

        
        
    })
}


    
    return(

            <View style={{marginTop:'8%',alignItems:'center'}}>
                <StatusBar barStyle='light-content'/>
            <TextInput
                style={styles.input}
                placeholder='Enter Location'
                value={city}
                onChangeText={(val)=> fetchCities(val)} />
            
            <FlatList
            data={cities}
            renderItem={({item})=>{
                return(
                    <TouchableOpacity onPress={() => pressHandler(item)}>
                    <Card 
                    style={{margin:2,padding:12,justifyContent:'center',alignItems: 'center',width:300,borderWidth:1,borderColor:'black'}}>
                        
                            <Text>{item}</Text>
                        
                        
                    </Card>
                    </TouchableOpacity>

                )
            }}
            keyExtractor={item=>item}
        />
            <View style={styles.button}>
            <Button 
            title='Use my Location'
            onPress={() => clickHandler()}/>
            </View>
        
            
                
            
        </View>
        

    );
}

const styles = StyleSheet.create({

    input:{
        marginTop: '10%',
        marginBottom:'5%',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        padding:10,
        borderWidth:1,
        borderColor:'#777',
        width:300,
    },
    button:{
        marginTop:'5%',
        marginBottom:'20%',
        width:200,
    }
});
