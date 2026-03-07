import { Buffer } from "@craftzdog/react-native-buffer";
import "react-native-get-random-values";

if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer as unknown as typeof global.Buffer;
}
