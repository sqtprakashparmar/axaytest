import React, { useEffect, useRef, useState } from "react";
import {
  prepareSDK,
  createUserAction,
  logout,
  createUserSession,
  connectToChatServer,
  UserCreationStatus,
  UserData,
} from "./QBHeplers";
import {
  LoginData,
  MainButton,
  useQbUIKitDataContext,
  QuickBloxUIKitDesktopLayout,
  QuickBloxUIKitProvider,
  TypeButton,
  QBDataContextType,
} from "quickblox-react-ui-kit";
import QB, { QBUser } from "quickblox/quickblox";
// import './App.scss';
import { QBConfig } from "./QBconfig";
import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./layout/Auth/Auth";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import { log } from "console";
import { Button } from "@mui/material";

function App() {
  const QB_Token = localStorage.getItem("qb_sessionToken");
  const [session, setSession] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null); // Define localVideoRef
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [AllUsersInfo, setAllUsersInfo] = useState([]);
  console.log("QB >>>>>>>>>>>>>>>>>> ::", QB);
  useEffect(() => {
    QB?.webrtc?.getMediaDevices("videoinput").then((devices) => {
      if (devices.length > 0) {
        setSelectedDeviceId(devices[0].deviceId); // Select the first video device by default
      }
    });
  }, []);
  const handleStartCall = async () => {
    try {
      const options: MediaStreamConstraints = {
        audio: true,
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : true,
      };
      const stream = await navigator.mediaDevices.getUserMedia(options);
      setLocalStream(stream);

      const sessionType = QB.webrtc.CallType.VIDEO;
      const calleesIds = AllUsersInfo.map((user: any) => user.user.id);

      const userInfo: any = { key: "value" };

      QB.webrtc.createNewSession([139794999], sessionType, userInfo);
    } catch (error) {
      console.error("Error starting call:", error);
      setErrorMessage("Error starting call.");
    }
  };

  const handleStartCall1 = async () => {
    var calleesIds = [139794999]; // Users' ids
    var sessionType = QB.webrtc.CallType.VIDEO; // AUDIO is also possible

    var session = QB.webrtc.createNewSession(
      calleesIds,
      sessionType,
      undefined,
      {
        bandwidth: 0,
      }
    );
    debugger;
  };
  useEffect(() => {
    test();
  }, []);
  function test() {
    QB?.webrtc?.getMediaDevices("videoinput").then(function (devices) {
      if (devices.length) {
        // here is a list of all available cameras
        for (var i = 0; i < devices.length; i++) {
          var deviceInfo = devices[i];
          var deviceId = deviceInfo.deviceId;
          var deviceLabel = deviceInfo.label;
          console.log("deviceId __________________", deviceId);
          setSelectedDeviceId(deviceId);
        }
      }
    });
  }

  const qbUIKitContext: QBDataContextType = useQbUIKitDataContext();

  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    qbUIKitContext.storage.CONNECTION_REPOSITORY.subscribe((status) => {
      console.log(
        `Connection status: ${status ? "CONNECTED" : "DISCONNECTED"}`
      );
      if (status) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
        setErrorMessage("Error! No Connection.");
      }
    });
  }, [qbUIKitContext.storage.CONNECTION_REPOSITORY]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline) {
      setErrorMessage("");
    }
  }, [isOnline]);

  const [isUserAuthorized, setUserAuthorized] = React.useState(false);
  const [isSDKInitialized, setSDKInitialized] = React.useState(false);

  const [theme, setTheme] = useState("lightTheme");
  const [errorMessage, setErrorMessage] = useState("");

  const initLoginData: LoginData = {
    login: "",
    password: "",
  };

  const [currentUser, setCurrentUser] = React.useState(initLoginData);
  const navigate = useNavigate();

  const loginHandler = async (data: any): Promise<void> => {
    if (isOnline) {
      setErrorMessage("");
      const loginData: LoginData = {
        login: data.login,
        password: data.password,
      };
      setCurrentUser(loginData);
      setTheme(data.nameTheme);
      await loginAction(loginData);
      document.documentElement.setAttribute("data-theme", data.nameTheme);
    } else {
      setErrorMessage("Error! No connection.");
    }
  };

  const createUserHandler = async (data: UserData): Promise<void> => {
    if (isOnline) {
      setErrorMessage("");

      const resultCreateUser = await createUserAction(data);

      logout();
      switch (resultCreateUser) {
        case UserCreationStatus.UserCreated:
          setUserAuthorized(false);
          navigate("/sign-in");
          break;
        case UserCreationStatus.UserExists:
          setErrorMessage("User already exists");
          setUserAuthorized(false);
          navigate("/sign-up");
          break;
        default:
          setErrorMessage("Auth Fail");
          setUserAuthorized(false);
          navigate("/sign-up");
          break;
      }
    } else {
      setErrorMessage("Error! No connection.");
    }
  };

  const logoutUIKitHandler = async () => {
    if (isOnline) {
      qbUIKitContext.release();
      setCurrentUser({ login: "", password: "" });
      setUserAuthorized(false);
      document.documentElement.setAttribute("data-theme", "light");
      navigate("/sign-in");
    } else {
      setErrorMessage("Error! No connection.");
    }
  };

  const loginAction = async (loginData: LoginData): Promise<void> => {
    if (isSDKInitialized && !isUserAuthorized) {
      if (loginData.login.length > 0 && loginData.password.length > 0) {
        await createUserSession(loginData)
          .then(async (resultUserSession) => {
            await connectToChatServer(resultUserSession, currentUser.login)
              .then(async (authData) => {
                localStorage.setItem("qb_sessionToken", authData?.sessionToken);
                console.log("====================================");
                console.log(
                  "<<<<<<<<<<<<<< resultUserSession >>>>>>>>>>>>>>>>>> ::",
                  resultUserSession
                );
                console.log("====================================");
                console.log("====================================");
                console.log(
                  "<<<<<<<<<<<<<< loginData >>>>>>>>>>>>>>>>>> ::",
                  loginData
                );
                console.log("====================================");

                await qbUIKitContext.authorize(authData);
                qbUIKitContext.setSubscribeOnSessionExpiredListener(() => {
                  console.timeLog("call OnSessionExpiredListener ... start");
                  logoutUIKitHandler();
                  console.log("OnSessionExpiredListener ... end");
                });
                setSDKInitialized(true);
                setUserAuthorized(true);
                document.documentElement.setAttribute("data-theme", theme);
                navigate("/");
              })
              .catch((errorChatConnection) => {
                handleError(errorChatConnection);
              });
          })
          .catch((errorUserSession) => {
            handleError(errorUserSession);
          });
      }
    }
  };

  const handleError = (error: any): void => {
    console.log("error:", JSON.stringify(error));
    const errorToShow = error?.message?.errors[0] || "Unexpected error";
    setErrorMessage(errorToShow);
    setUserAuthorized(false);
    navigate("/sign-in");
  };

  useEffect(() => {
    if (isSDKInitialized) {
      if (
        currentUser &&
        currentUser.login.length > 0 &&
        currentUser.password.length > 0
      ) {
        loginAction(currentUser);
      } else {
        console.log("auth flow has canceled ...");
      }
    }
  }, [isSDKInitialized]);

  useEffect(() => {
    if (!isSDKInitialized) {
      prepareSDK()
        .then((result) => {
          setSDKInitialized(true);
          setUserAuthorized(false);
        })
        .catch((e) => {
          console.log("init SDK has error: ", e);
        });
    }
  }, []);
  useEffect(() => {
    if (localStream && localVideoRef.current) {
      // Add null check for localVideoRef.current
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  function AllUsers(data1: any) {
    fetch("https://api.quickblox.com/users.json", {
      method: "GET",
      headers: {
        "QB-Token": data1, // If authentication is required, replace 'your_access_token_here' with your actual access token
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setAllUsersInfo(data?.items);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  }

  useEffect(() => {
    if (QB_Token) {
      AllUsers(QB_Token);
    }
  }, [QB_Token]);

  console.log("====================================");
  console.log("AllUsersInfo ::", AllUsersInfo);
  console.log("====================================");
  const handleCallUser = (user: any) => {
    // Assuming QB.webrtc.createSession() is a function to initiate a call
    const sessionType = QB.webrtc.CallType.VIDEO;
    const calleeId = user.id; // Assuming the user object has an 'id' property
    const session = QB.webrtc.createNewSession([calleeId], sessionType);

    // You can further handle session events here if needed
    debugger;
    setSession(session); // Store the session in state for further handling
  };

  return (
    <QuickBloxUIKitProvider
      maxFileSize={100 * 1000000}
      accountData={{ ...QBConfig.credentials }}
      loginData={{
        login: currentUser.login,
        password: currentUser.password,
      }}
      qbConfig={{ ...QBConfig }}
    >
      <div>
        <Routes>
          <Route
            path="/"
            element={
              isUserAuthorized ? (
                <div>
                  <div className="main-buttons-wrapper">
                    <MainButton
                      typeButton={TypeButton.outlined}
                      title="Light Theme"
                      styleBox={{ width: "200px", height: "20px" }}
                      clickHandler={() => {
                        document.documentElement.setAttribute(
                          "data-theme",
                          "light"
                        );
                      }}
                    />
                    <MainButton
                      typeButton={TypeButton.defaultDisabled}
                      title="Dark Theme"
                      styleBox={{ width: "200px", height: "20px" }}
                      clickHandler={() => {
                        document.documentElement.setAttribute(
                          "data-theme",
                          "dark"
                        );
                      }}
                    />
                    <MainButton
                      typeButton={TypeButton.danger}
                      title="Log Out"
                      styleBox={{ width: "200px", height: "20px" }}
                      clickHandler={logoutUIKitHandler}
                    />
                  </div>
                  {/* <QuickBloxUIKitDesktopLayout theme={new CustomTheme()}  /> */}
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      {AllUsersInfo?.length > 0 &&
                        AllUsersInfo.map((itema: any, indexa) => (
                          <>
                            <Button onClick={() => handleCallUser(itema)}>
                              {itema.user.full_name}
                            </Button>
                          </>
                        ))}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <video
                        id="localVideo"
                        autoPlay
                        muted
                        playsInline
                        ref={localVideoRef}
                      />
                      <video
                        id="remoteVideo"
                        autoPlay
                        playsInline
                        ref={remoteVideoRef}
                      />
                      <button onClick={handleStartCall}>Start Call</button>
                      <button onClick={handleStartCall1}>Start Call ddd</button>
                    </div>
                  </div>

                  {/* <QuickBloxUIKitDesktopLayout uikitHeightOffset="32px" /> */}
                  {/* <video id="localVideo" className="qb-video_source" ></video> */}
                </div>
              ) : (
                <Auth
                  children={
                    <SignIn
                      signInHandler={loginHandler}
                      errorMessage={errorMessage}
                      isOnline={isOnline}
                    />
                  }
                />
              )
            }
          />
          <Route
            path="/sign-in"
            element={
              <Auth
                children={
                  <SignIn
                    signInHandler={loginHandler}
                    errorMessage={errorMessage}
                    isOnline={isOnline}
                  />
                }
              />
            }
          />
          <Route
            path="/sign-up"
            element={
              <Auth
                children={
                  <SignUp
                    signUpHandler={createUserHandler}
                    errorMessage={errorMessage}
                    isOnline={isOnline}
                  />
                }
              />
            }
          />
        </Routes>
      </div>
    </QuickBloxUIKitProvider>
  );
}

export default App;
