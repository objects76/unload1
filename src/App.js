import "./App.css";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { Button } from "@material-ui/core";

// unnload test.
let handled = false;
function App() {
  const [message, setmessage] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  // https://github.com/jacobbuck/react-beforeunload/blob/master/src/useBeforeunload.js
  useEffect(() => {
    const handleBeforeunload = (event) => {
      console.log("event:", event);

      const task = async () => {
        function async_sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await async_sleep(500);
        handled = true;
        setmessage("handled before unload...");
      };
      task();

      if (handled) return;

      const saveTask = async (key) => {
        function async_sleep(ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
        await async_sleep(500);
        handled = true;
        closeSnackbar(key);
        window.close();
      };

      // save toast:
      // https://iamhosseindhv.com/notistack/demos#customizing-snackbars-individually
      const action = (key) => (
        <>
          <br />
          <Button onClick={() => saveTask(key)}>Save</Button>
          <Button onClick={() => closeSnackbar(key)}>Cancel</Button>
        </>
      );
      const warn_msg = "You have to save recording before exit!";
      enqueueSnackbar(warn_msg, {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        persist: true,
        action: action,
      });

      // show warn popup.
      // Chrome requires `returnValue` to be set.
      // if (event.defaultPrevented) {
      //   event.returnValue = "";
      // }
      // Some browsers like chrome display a fixed message.
      event.returnValue = warn_msg;
      return event.returnValue;
    };

    window.addEventListener("beforeunload", handleBeforeunload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeunload);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Edit <code>{message}</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
