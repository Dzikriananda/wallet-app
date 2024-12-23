import { StyleSheet, Text, View, Image, SafeAreaView, TextInput,Button,Alert,TouchableHighlight,ActivityIndicator,Modal } from 'react-native';
import { useEffect, useState } from "react";
import fetchUser from './api/RestApi';
import Status from './status';
import ApiService from './api/RestApi';
import { useAuth } from './context/AuthContext';
const wallet = require("./assets/wallet.png");


const LoginScreen = ({navigation}) => {
    const [email,setEmail] = useState("")
    const [pwd,setPwd] = useState("")
    const [status, setStatus] = useState(Status.Idle);
    const apiService = new ApiService()
    const { login } = useAuth();
    


    async function signIn() {
        setStatus(Status.Idle);
        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required.");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex
        if (!emailRegex.test(email)) {
            Alert.alert("Validation Error", "Please enter a valid email address.");
            return;
        }

        if (!pwd.trim()) {
            Alert.alert("Validation Error", "Password is required.");
            return;
        }

        if (pwd.length < 8) {
            Alert.alert("Validation Error", "Password must be at least 8 characters.");
            return;
        }
        try {
          setStatus(Status.Loading);
          const result = await apiService.login(
            {
                "email": email,
                "password": pwd
            }
          ) 
          const token = result.data.data.token
          login(token)
          setStatus(Status.Success)
          Alert.alert('Login Sukses')
          navigation.navigate('Home')
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
                <Image source={wallet} style={{width:233,height: 57,marginTop: 100}}/>
                <View style={{marginTop: 100,width: "100%"}}>
                    <TextInput placeholder="Email" style={styles.textForm} onChangeText={newText => setEmail(newText)} value={email}/>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Password"
                        style={styles.textForm}
                        onChangeText={newText => setPwd(newText)}
                        value={pwd}
                    />
                </View>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => signIn()}
                    underlayColor='#fff'>
                        <Text style={styles.submitText}>Login</Text>
                </TouchableHighlight>
                

                <Text style={{ marginVertical: 20,alignSelf: "flex-start",fontSize: 16 }}> Dont have an account?
                    <Text style={{ color: '#19918F',fontSize: 16,marginLeft: 20 }}onPress={() => { navigation.navigate('RegisterScreen') }}> 
                        {" "}Register here
                    </Text>
                </Text>

                {status===Status.Loading && (
                <Modal transparent={true} animationType="fade">
                    <View style={styles.loadingContainer}>
                        <View style={styles.loadingBox}>
                            <ActivityIndicator size="large" color="#19918F" />
                        </View>
                    </View>
                </Modal>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
    },
    loadingBox: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
    },
    container: {
        paddingHorizontal: 20,
        display: "flex",
        alignItems: "center",
        flex: 1,
        backgroundColor: 'white',
    },
    submit: {
        marginTop: 120,
        height: 50,
        width: "100%",
        borderRadius: 10,
        backgroundColor: '#19918F',
        textAlign:'center',
        

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


export default LoginScreen