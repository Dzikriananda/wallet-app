import { StyleSheet, Text, View, Image, SafeAreaView, TextInput,Button,Alert,TouchableHighlight } from 'react-native';
import { useState } from "react";
import { ChevronDown } from 'lucide-react-native';
import Status from './status';
import ApiService from './api/RestApi';
const wallet = require("./assets/wallet.png");
import { useAuth } from './context/AuthContext';


const TopUpScreen = ({navigation}) => {
    const [amount,setAmount] = useState("")
    const [note,setNote] = useState("")
    const [status, setStatus] = useState(Status.Idle);
    const apiService = new ApiService()
    const { getToken } = useAuth();


    async function initiateTopUp() {
        setStatus(Status.Idle);
        if (!amount.trim()) {
            Alert.alert("Validation Error", "Amount is required.");
            return;
        }
        const amt = (parseFloat(amount))
        if (amt === NaN) {
            Alert.alert("Validation Error", "Amount must be number.");
            return;
        }
        if (amt < 0) {
            Alert.alert("Validation Error", "Amount must be positive.");
            return;
        }
        try {
          console.log("amba")
          setStatus(Status.Loading);
          const token = await getToken()
          const result = await apiService.createTransaction(
            token,
            {
                 type : "c", 
                 from_to : "744635",
                 amount : amount,
                 description : note 

            }
          )
          setStatus(Status.Success)
          Alert.alert('Top up Sukses')
          const date = new Date().toJSON();
          navigation.popTo('Home', { post: date });
        } catch(e) {
          setStatus(Status.Error)
          Alert.alert(`Error ${e}`)
        } finally {
          setStatus(Status.Idle)
        }
    }


    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <View style={{marginTop: 30,width: "100%",height: 150,backgroundColor: "white",paddingHorizontal: 30}}>
                    <Text style={{fontSize: 16,color: "#B3B3B3",marginVertical: 20}}>
                        Amount
                    </Text>
                    <View style={{display: "flex", flexDirection: 'row'}}>
                        <Text style={{fontSize: 16}}>
                            IDR
                        </Text>
                        <TextInput 
                            placeholder="000.000,00" 
                            // style={styles.textForm} 
                            keyboardType='numeric'
                            onChangeText={newText => setAmount(newText)} 
                            value={amount}
                            underlineColorAndroid= "transparent"
                            fontSize = {36}
                        />
                    </View>
                    <View style={{height: 2,width: "100%", backgroundColor: "#E1E1E1"}}></View>
                </View>
                <View style={{
                    display: "flex", 
                    flexDirection: 'row',
                    marginTop: 30,
                    width: "100%",
                    height: 50,
                    backgroundColor: "white",
                    paddingHorizontal: 18,
                    alignItems: "center",
                    justifyContent: "center"
                    }}>
                        <Text style={{fontSize: 16}}>
                            BYOND Pay
                        </Text>
                        <View style={{flex: 1}}></View>
                        <ChevronDown color="black" size={20} />
                </View>
                <View style={{marginTop: 30,width: "100%",height: 110,backgroundColor: "white",paddingHorizontal: 30}}>
                        <Text style={{fontSize: 16,color: "#B3B3B3",marginTop: 20}}>
                            Notes
                        </Text>
                        <TextInput 
                                placeholder="" 
                                onChangeText={newText => setNote(newText)} 
                                value={note}
                                underlineColorAndroid= "transparent"
                                fontSize = {16}
                        />
                        <View style={{height: 2,width: "100%", backgroundColor: "#E1E1E1"}}></View>    
                </View>
                <View style={{flex: 1}}></View>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => {
                        initiateTopUp()
                    }}
                    underlayColor='#fff'>
                        <Text style={styles.submitText}>Top Up</Text>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        alignItems: "center",
        flex: 1,
        backgroundColor: '#FAFBFD',
    },
    submit: {
        height: 50,
        width: "90%",
        borderRadius: 10,
        backgroundColor: '#19918F',
        textAlign:'center',
        marginBottom: 20
    },
    submitText: {
        paddingTop:15,
        paddingBottom:15,
        color: '#fff',
        fontSize: 16,
        fontWeight: 700,
        textAlign: 'center',
    },
    textForm: {
        marginVertical: 10,
        width: "100%",
        height: 60,
        borderRadius: 10,
        backgroundColor: "#FAFBFD",
        padding: 10,
        fontWeight: 600,
    }
})


export default TopUpScreen