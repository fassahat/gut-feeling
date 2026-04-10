import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatProvider } from "./src/context/ChatContext";
import { ChatScreen } from "./src/screens/ChatScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ChatProvider>
        <ChatScreen />
        <StatusBar style="light" />
      </ChatProvider>
    </SafeAreaProvider>
  );
}
