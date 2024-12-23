import { StyleSheet, Text, View, Image, SafeAreaView, TextInput,Button,Alert,TouchableHighlight,Modal,Pressable } from 'react-native';
import { use, useState } from "react";
import { Checkbox } from 'react-native-paper';
import Status from './status';
import ApiService from './api/RestApi';
const wallet = require("./assets/wallet.png");

const toc = "Dengan menggunakan layanan ini, Anda setuju untuk mematuhi semua syarat dan ketentuan yang berlaku. Informasi yang Anda berikan harus akurat dan benar, serta Anda bertanggung jawab atas keamanan akun Anda. Layanan ini disediakan sebagaimana adanya dan dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Kami tidak bertanggung jawab atas kerugian yang timbul akibat penggunaan layanan ini. Semua data pribadi Anda akan dikelola sesuai dengan kebijakan privasi kami, dan setiap pelanggaran terhadap syarat dan ketentuan dapat mengakibatkan penghentian akses Anda. Dengan terus menggunakan layanan ini, Anda dianggap telah membaca, memahami, dan menyetujui syarat dan ketentuan ini."


const RegisterScreen = ({navigation}) => {
    const [email,setEmail] = useState("")
    const [fname,setFname] = useState("")
    const [avatarUrl,setAvatarUrl] = useState("")
    const [pwd,setPwd] = useState("")
    const [agreedToc,setAgreedToc] = useState(false)
    const [status, setStatus] = useState(Status.Idle);
    const [modalVisible, setModalVisible] = useState(false);
    const apiService = new ApiService()

    
    async function signUp() {
        setStatus(Status.Idle);
        if (!email.trim()) {
            Alert.alert("Validation Error", "Email is required.");
            return;
        }

        if (!avatarUrl.trim()) {
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

        if (!agreedToc) {
            Alert.alert("Validation Error", "Please agree to our term and condition!");
            return;
        }
        try {
          setStatus(Status.Loading);
          const result = await apiService.register(
            {
                "email": email,
                "password": pwd,
                "full_name": fname,
                "avatar_url" : avatarUrl
            }
          )
          console.log(result.data) +
          setStatus(Status.Success)
          Alert.alert('Register Sukses')
          navigation.goBack();
        } catch(e) {
         console.log(e)
          setStatus(Status.Error)
          Alert.alert(`Error ${e}`)
        } finally {
          setStatus(Status.Idle)
        }
    }


    return(
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <Modal
                    animationType="slide"
                    presentationStyle='pageSheet'
                    transparent={false}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                        <Text style={{textAlign: 'justify',}}>{toc}</Text>
                            <TouchableHighlight
                                style={styles.okButton}
                                onPress={() => setModalVisible(!modalVisible)}
                                underlayColor='#fff'>
                                <Text style={styles.submitText}>Ok</Text>
                            </TouchableHighlight>
                        </View>
                    </View>
                </Modal>
                <Image source={wallet} style={{width:233,height: 57,marginTop: 100}}/>
                <View style={{marginTop: 100,width: "100%"}}>
                    <TextInput placeholder="Fullname" style={styles.textForm} onChangeText={newText => setFname(newText)} value={fname}/>
                    <TextInput placeholder="Email" style={styles.textForm} onChangeText={newText => setEmail(newText)} value={email}/>
                    <TextInput
                        secureTextEntry={true}
                        placeholder="Password"
                        style={styles.textForm}
                        onChangeText={newText => setPwd(newText)}
                        value={pwd}
                    />
                    <TextInput placeholder="Avatar Url" style={styles.textForm} onChangeText={newText => setAvatarUrl(newText)} value={avatarUrl}/>
                </View>
                <TouchableHighlight
                    style={styles.submit}
                    onPress={() => signUp()}
                    underlayColor='#fff'>
                        <Text style={styles.submitText}>Register</Text>
                </TouchableHighlight>
                <View style ={{display: "flex",flexDirection: "row",alignItems: "center"}}>
                    <Checkbox
                        status={agreedToc ? 'checked' : 'unchecked'}
                        onPress={() => {
                            setAgreedToc(!agreedToc);
                        }}
                    />
                    <View style ={{}}>
                    </View>
                    <Text style={{ marginVertical: 20,alignSelf: "flex-start",fontSize: 16 }}> I have read and agree to the
                            <Text style={{ color: '#19918F',fontSize: 16,marginLeft: 20 }}onPress={() => {setModalVisible(true)}}> 
                                {" "}Terms and Conditions 
                            </Text>
                    </Text>

                </View>

               
                <Text style={{ marginVertical: 15,alignSelf: "flex-start",fontSize: 16 }}> Have an account?
                    <Text style={{ color: '#19918F',fontSize: 16,marginLeft: 20 }}onPress={() => { navigation.goBack() }}> 
                        {" "}Login here
                    </Text>
                </Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
      },
      buttonClose: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        backgroundColor: '#2196F3',
      },
    centeredView: {
        display: "flex",
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center'
      },
    container: {
        paddingHorizontal: 20,
        display: "flex",
        alignItems: "center",
        flex: 1,
        backgroundColor: 'white',
    },
    submit: {
        marginTop: 10,
        height: 50,
        width: "100%",
        borderRadius: 10,
        backgroundColor: '#19918F',
        textAlign:'center',
        

    },
    okButton: {
        marginTop: 10,
        height: 50,
        width: 80,
        alignSelf: 'center',
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


export default RegisterScreen