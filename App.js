import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert} from 'react-native';
import { theme } from './colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Fontisto } from '@expo/vector-icons'

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  useEffect(()=> { 
    loadToDos()
  }, []);


  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  
  const saveToDos = async (toSave) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  };
  
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY);
    if (s){
      setToDos(JSON.parse(s));
    }
  };
  
  const addToDo = async () => {
    if (text==="") {
      return;
    }
    // const newToDos = Object.assign({}, toDos, {[Date.now()]: {text, work:working}});
    const newToDos = {
      ...toDos, 
      [Date.now()]: {text, working}
    };
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  // console.log(toDos);

  const deleteToDo = (key) => {
    Alert.alert(
      "Delete To Do?", 
      "Are you sure?", [
        {text: "Cancel"},
        {
          text: "I'm Sure", 
          onPress: async () => {
            const newToDos = {...toDos};
            delete newToDos[key];
            setToDos(newToDos);
            await saveToDos(newToDos);
          },
        },
      ])
    };
    
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnTxt, color: working? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnTxt, color: !working? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>

      <View>
        <TextInput 
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType = "done"
          value={text}
          placeholder = {
            working? "Add a To-DO": "Where do you want to go?"
          } 
          style={styles.input}
        />
        <ScrollView>{
          Object.keys(toDos).map((key) => (
            toDos[key].working === working ? (
              <View style={styles.toDo} key={key}>
                <Text style={styles.toDoText} >{toDos[key].text}</Text>
                <TouchableOpacity onPress={() => deleteToDo(key)}>
                 <Fontisto name="trash" size={15} color="white" />
                </TouchableOpacity>
              </View>
            ) : null
        ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 30,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100
  },
  btnTxt: {
    fontSize: 40, 
    fontWeight: "600",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginVertical: 25,
    fontSize: 15

  },
  toDo: {
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 20,
    flexDirection:"row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toDoText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500"
  }

});
