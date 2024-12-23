import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Image, SafeAreaView, Platform, Dimensions, ScrollView,FlatList, TouchableHighlight,ActivityIndicator } from 'react-native';
import { useAuth } from './context/AuthContext';
const wallet = require("./assets/wallet.png");


const SplashScreen = ({navigation}) => {
    const {getToken} = useAuth()

    async function checkAuthStatus() {
        const token = await getToken()
        console.log(token)
        setTimeout(() => {
            if(token != null) {
                console.log("home")
                navigation.navigate('Home')
            } else {
                console.log("Login")
                navigation.navigate('Login')
            }
        }, 1000);
       
    }

    useEffect(() => {
        checkAuthStatus()
    },[])

    return (
        <View style = {styleSheet.container}>
            <Image source={wallet} style={{width:233,height: 57,marginTop: 100}}/>
        </View>
    );

}

const styleSheet = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        backgroundColor: 'white',
    },
})

export default SplashScreen