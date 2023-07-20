import React, { useEffect, useState } from "react";

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BackgroundTimer from "react-native-background-timer";
const App = () => {
  const [isStopwatchStart, setIsStopwatchStart] = useState(false);
  const [resetStopwatch, setResetStopwatch] = useState(false);
  const [sec, setSec] = useState(0);
  const [min, setMin] = useState(0);
  const [hours, setHours] = useState(0);
  const [flag, setFlag] = useState(0);
  const initialTime = new Date();
  useEffect(() => {
    if (flag == 1) {
      const storeTime = async () => {
        console.log("call");
        try {
          await AsyncStorage.setItem("hours", hours.toString());
          await AsyncStorage.setItem("minutes", min.toString());
          await AsyncStorage.setItem("seconds", sec.toString());
        } catch (e) {
          // saving error
          console.log("Error", e);
        }
      };
      const getData = async () => {
        try {
          const hrs = await AsyncStorage.getItem("hours");
          const mns = await AsyncStorage.getItem("minutes");
          const secs = await AsyncStorage.getItem("seconds");
          console.log("hrs", hrs);
          console.log("mns", mns);
          console.log("secs", secs);
        } catch (e) {
          // error reading value
        }
      };
      getData();
      storeTime();
    }
  }, [sec]);
  useEffect(() => {
    function addTimes(hours1, minutes1, seconds1, hours2, minutes2, seconds2) {
      // Convert each time to total seconds
      const totalSeconds1 = hours1 * 3600 + minutes1 * 60 + seconds1;
      const totalSeconds2 = hours2 * 3600 + minutes2 * 60 + seconds2;

      // Add the total seconds of both times
      const totalSecondsSum = totalSeconds1 + totalSeconds2;

      // Calculate hours, minutes, and seconds from the total seconds sum
      const hoursSum = Math.floor(totalSecondsSum / 3600);
      const minutesSum = Math.floor((totalSecondsSum % 3600) / 60);
      const secondsSum = totalSecondsSum % 60;

      // Return the result in the same format
      return { hours: hoursSum, minutes: minutesSum, seconds: secondsSum };
    }

    // Example usage

    const getData = async () => {
      try {
        const prevTime = await AsyncStorage.getItem("Initial-Time");
        const hrs = await AsyncStorage.getItem("hours");
        const mns = await AsyncStorage.getItem("minutes");
        const secs = await AsyncStorage.getItem("seconds");
        console.log("hrs", hrs);
        console.log("mns", mns);
        console.log("secs", mns);
        if (prevTime !== null) {
          let diff =
            new Date(initialTime).getTime() - new Date(prevTime).getTime();
          console.log("diff", diff);
          let msec = diff;
          let hh = Math.floor(msec / 1000 / 60 / 60);
          msec -= hh * 1000 * 60 * 60;
          let mm = Math.floor(msec / 1000 / 60);
          msec -= mm * 1000 * 60;
          let ss = Math.floor(msec / 1000);
          msec -= ss * 1000;
          const result = addTimes(hrs, mns, secs, hh, mm, ss);

          //   setHours(() => result.hours);
          //   setMin(() => result.minutes);
          //   setSec(() => result.seconds);
          console.log(result);
        }
      } catch (e) {
        // error reading value
      }
    };
    getData();
  }, []);
  useEffect(() => {
    if (isStopwatchStart) {
      const storeData = async () => {
        try {
          await AsyncStorage.setItem("Initial-Time", initialTime.toString());
        } catch (e) {
          // saving error
          console.log("Error", e);
        }
      };
      storeData();
    }
  }, [isStopwatchStart]);

  useEffect(() => {
    if (sec > 59) {
      setMin((time) => time + 1);
      setSec(() => 0);
    }
    if (isStopwatchStart) {
      const intervalId = BackgroundTimer.setInterval(() => {
        setSec((time) => time + 1);
        setFlag(1);
        console.log(sec);
      }, 1000);
      return () => BackgroundTimer.clearInterval(intervalId);
    }
  }, [sec, isStopwatchStart]);
  useEffect(() => {
    if (min > 59) {
      setHours((time) => time + 1);
    }

    setMin(() => min);
  }, [min]);
  useEffect(() => {
    if (hours > 23) {
      setHours(0);
      setMin(0);
      setSec(0);
    }
  }, [hours]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View>
          {hours >= 0 && hours <= 9 ? (
            <Text style={styles.timeText}>{"0" + hours + ":"}</Text>
          ) : (
            <Text style={styles.timeText}>{hours + ":"}</Text>
          )}
        </View>
        <View>
          {min >= 0 && min <= 9 ? (
            <Text style={styles.timeText}>{"0" + min + ":"}</Text>
          ) : (
            <Text style={styles.timeText}>{min + ":"}</Text>
          )}
        </View>
        <View>
          {sec >= 0 && sec <= 9 ? (
            <Text style={styles.timeText}>{"0" + sec}</Text>
          ) : (
            <Text style={styles.timeText}>{sec}</Text>
          )}
        </View>
      </View>
      <View style={styles.container}>
        <View style={styles.sectionStyle}>
          <TouchableHighlight
            onPress={() => {
              setIsStopwatchStart(!isStopwatchStart);
              setResetStopwatch(false);
            }}
          >
            <Text style={styles.buttonText}>
              {!isStopwatchStart ? "START" : "PAUSE"}
            </Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => {
              setIsStopwatchStart(false);
              setResetStopwatch(true);
              setHours(0);
              setMin(0);
              setSec(0);
              setFlag(0);
            }}
          >
            <Text style={styles.buttonText}>RESET</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontFamily: "Poppins",
    fontSize: 36,
    fontWeight: "600",
    lineHeight: 56,
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    padding: 20,
  },
  sectionStyle: {
    flex: 1,
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    marginTop: 10,
  },
});
