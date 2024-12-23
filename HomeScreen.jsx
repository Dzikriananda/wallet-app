import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, SafeAreaView, Platform, Dimensions, ScrollView,FlatList, TouchableHighlight,ActivityIndicator,Alert,TouchableOpacity } from 'react-native';
import { Eye,EyeClosed, Plus,Send,LogOut } from 'lucide-react-native';
import Status from './status';
import { useEffect, useState } from "react";
import ApiService from './api/RestApi';
import { useAuth } from './context/AuthContext';
import { CommonActions } from '@react-navigation/native';

const avatar = require("./assets/avatar.png");
const appBarIcon = require("./assets/appbar_icon.png");
const group = require("./assets/Group.png");
const screenWidth = Dimensions.get('window').width;


class Transaction {
  constructor(name, type, amount, date) {
    this.name = name;       // e.g., "Adityo Gizwanda"
    this.type = type;       // "Topup" or "Transfer"
    this.amount = amount;   // Transaction amount
    this.date = date;       // Transaction date
  }
}

const HomeScreen = ({navigation,route}) =>  {
  const [userStatus, setUserStatus] = useState(Status.Idle);
  const [transactionStatus,setTransactionStatus] = useState(Status.Idle);
  const [userData,setUserData] = useState();
  const [transactionData,setTransactionData] = useState([]);
  const [hideAmount,setHideAmount] = useState(false);

  const apiService = new ApiService();
  const { getToken,logout } = useAuth();

  async function fetchUserData() {
    setUserStatus(Status.Idle);
    try {
      setUserStatus(Status.Loading);
      const token = await getToken()
      const result = await apiService.getUserData(token)
      setUserData(result)
      setUserStatus(Status.Success)
    } catch(e) {
      setUserStatus(Status.Error)
    }
  }

  async function fetchTransactionData() {
    setTransactionStatus(Status.Idle);
    try {
      setTransactionStatus(Status.Loading);
      const token = await getToken()
      const result = await apiService.getUserTransactions(token)
      // (result.data)
      setTransactionData(result)
      setTransactionStatus(Status.Success)
      console.log("status sukses")
    } catch(e) {
      console.log("error tukam")
      setTransactionStatus(Status.Error)
    }
  }

  async function signOut() {
    await logout();
    Alert.alert("Logout sukses")
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}]
      })
    )
  }


//Refresh data jika terjadi transfer atau top up
  useEffect(() => {
    if (route.params?.post) {
      fetchUserData();
      fetchTransactionData();
    }
  },[route.params?.post]);


  useEffect(
    () => {
      fetchUserData()
      fetchTransactionData()
    },[]
  );

  return (
    <SafeAreaView style={styles.safeAreaView}>
      {/* <ScrollView> */}
        <View style={styles.container}>
          <View style={styles.appBar}>
            <Image source={avatar} style={styles.avatar} />
            <View style={styles.userInfoContainer}>
              <Text style={styles.userName}>{userData?.data?.full_name || "..."}</Text>
              <Text style={styles.userAccountType}>Personal Account</Text>
            </View>
            <View style={styles.flexSpacer} />
            <Image source={appBarIcon}  style={styles.appBarIcon} />
            <TouchableHighlight onPress={() => {signOut()}}>
                <View style={styles.addButton}>
                  <LogOut color="white" size={20} />
                </View>
              </TouchableHighlight>
          </View>

          <View style={styles.greetingContainer}>
            <View style={styles.greetingTextContainer}>
              <Text style={styles.greetingTitle}>Good Morning, Dzikri</Text>
              <Text style={styles.greetingSubtitle}>Check all your incoming and outgoing transactions here</Text>
            </View>
            <View style={styles.flexSpacer} />
            <Image source={group} style={styles.groupImage} />
          </View>

          <View style={styles.accountNumberContainer}>
            <Text style={styles.accountNumberLabel}>Account No. </Text>
            <View style={styles.flexSpacer} />
            <Text style={styles.accountNumberValue}>{userData?.data?.account_no || "..."}</Text>
          </View>

          <View style={styles.balanceContainer}>
            <View>
              <Text style={styles.balanceLabel}>Balance </Text>
              <View style={styles.balanceRow}>
                <Text style={styles.balanceValue}>Rp. {
                userData?.data?.balance ? (hideAmount ? new Intl.NumberFormat('id-ID', { style: 'decimal' }).format(userData.data.balance) : "******") : "..."
                    }
                </Text>
                {
                  <TouchableOpacity onPress={() => {setHideAmount(!hideAmount)}}>
                      {
                         !hideAmount ? <EyeClosed style={styles.eyeIcon} color="#19918F" size={20} />
                         : <Eye style={styles.eyeIcon} color="#19918F" size={20} />
                      }
                  </TouchableOpacity>
                }
              </View>
            </View>
            <View style={styles.flexSpacer} />
            <View>
              <TouchableHighlight onPress={() => navigation.navigate('TopUpScreen')}>
                <View style={styles.addButton}>
                  <Plus color="white" size={20} />
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={() => navigation.navigate('TransferScreen')}>
                <View style={styles.addButton}>
                    <Send color="white" size={20} />
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <TransactionList 
                transactionStatus={transactionStatus}
                transactionData={transactionData}>
          </TransactionList>
          <StatusBar style="auto" />
        </View>
      {/* </ScrollView> */}
    </SafeAreaView>    
  );
}

const TransactionList = ({ transactionStatus, transactionData }) => {
  return (
    <View style={styles.transactionHistory}>
      <Text style={styles.greetingTitle}>Transaction History</Text>
      <View style={{height: 2,width: "100%",backgroundColor: "#E5E5E5",marginVertical: 10}}></View>
      <TrxList transactionStatus={transactionStatus}
                transactionData={transactionData}
      ></TrxList>
      
    </View>
  );
};

const TrxList = ( {transactionStatus, transactionData} )  => {
    const formatDate = (isoDateString) => {
      const date = new Date(isoDateString);
      return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const type = (value) => {
      if(value === "c") {
        return "Top Up"
      } else {
        return "Transfer"
      }
    }

    const amount = (value,trxType) => {
      const type = () => {
        if(trxType=== "c") {
          return "+"
        } else {
          return "-"
        }
      }
      const amt = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(value)
      return `${type()} ${amt}`
    }

    if(transactionStatus === Status.Loading) {
      return <ActivityIndicator size="large" color="#19918F" style={{ marginTop: 20 }} />
    } else if (transactionStatus === Status.Success) {
        (transactionData)
        return <FlatList
          data={transactionStatus === Status.Success ? transactionData.data : []}
          style={{paddingHorizontal: 10, width: "100%" }}
          ListEmptyComponent={() =>
            transactionStatus === Status.Error ? (
              <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>
                Failed to load transactions. Please try again.
              </Text>
            ) : (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No transactions available.
              </Text>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Image source={avatar} style={styles.avatar} />
              <View>
                <Text style={styles.balanceLabel}>Dzikri Ananda</Text>
                <Text style={styles.balanceLabel}> {type(item.type)}</Text>
                <Text style={styles.balanceLabel}> {formatDate(item.created_at)}</Text>
              </View>
              <View style={styles.flexSpacer} />
              <Text> {amount(item.amount,item.type)}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
      />
  } else {
    return <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>
        Failed to load transactions. Please try again.
    </Text>
  }
}

// const RenderList = (status,data) => {
//   let length = data.length
//   (length)
//   switch(status) {
//     case Status.Success: return <FlatList
//     data={data}
//     style = {{marginVertical: 10,paddingHorizontal: 10,width: "100%"}}
//     scrollEnabled = {true}
//     renderItem={({item}) => 
//       <View style={styles.transactionItem}>
//         <Image source={avatar} style={styles.avatar} />
//         <View>
//           <Text style={styles.balanceLabel}> {"Dziksrsi"}</Text>
//           <Text style={styles.balanceLabel}> {"Debit"}</Text>
//           <Text style={styles.balanceLabel}> {data.name}</Text>
//         </View>
//         <View style={styles.flexSpacer} />
//         <Text> {item.amount}</Text>
//       </View>
//     }
//   />;
//   case Status.Loading: return <ActivityIndicator size="large" color="#19918F" />
//   default:  return <ActivityIndicator size="large" color="#19918F" />
//   }
// }






const styles = StyleSheet.create({
  transactionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: 'center',
    marginVertical: 7,
    width: '100%',         
  },
  transactionHistory: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  safeAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFBFD',
  },
  appBar: {
    backgroundColor: 'white',
    height: 80,
    maxHeight: 100,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    shadowColor: '#171717',
    paddingHorizontal: 20,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    marginTop: Platform.OS === 'android' ? 35 : 0,
  },
  avatar: {
    width: 46,
    height: 46,
  },
  userInfoContainer: {
    marginStart: 10,
  },
  userName: {
    fontWeight: '700',
  },
  userAccountType: {},
  appBarIcon: {
    width: 46,
    height: 46,
    marginRight: 15
  },
  flexSpacer: {
    flex: 1,
  },
  greetingContainer: {
    marginHorizontal: 20,
    marginTop: 30,
    flexDirection: 'row',
  },
  greetingTextContainer: {
    maxWidth: '75%',
  },
  greetingTitle: {
    fontWeight: '700',
    fontSize: 20,
  },
  greetingSubtitle: {
    fontWeight: '400',
    fontSize: 16,
    marginTop: 15,
  },
  groupImage: {
    width: 81,
    height: 77,
  },
  accountNumberContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    height: 37,
    backgroundColor: '#19918F',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  accountNumberLabel: {
    fontWeight: '400',
    fontSize: 16,
    color: 'white',
  },
  accountNumberValue: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  balanceContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    height: 120,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  balanceLabel: {
    fontWeight: '400',
    fontSize: 14,
    color: 'black',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  balanceValue: {
    fontWeight: '600',
    fontSize: 24,
    color: 'black',
  },
  eyeIcon: {
    marginLeft: 10,
  },
  addButton: {
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: '#19918F',
    height: 38,
    width: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;