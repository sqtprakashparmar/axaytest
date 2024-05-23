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
// import './session.scss';
// import { QBConfig } from "./QBconfig";
import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./layout/Auth/Auth";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";
import { log } from "console";
import { Button } from "@mui/material";
import { DisabledByDefault } from "@mui/icons-material";

function App() {
  const QBConfig = {
    credentials: {
      appId: 103328,
      accountKey: "ack_NF5fngP3Hwfu5ZKnLHwJ",
      authKey: "ak_6SvXwvbpUAdU4hr",
      authSecret: "as_u2Uxeuj-xBsw8VC",
      sessionToken: "",
    },
    configAIApi: {
      AIAnswerAssistWidgetConfig: {
        organizationName: "Quickblox",
        openAIModel: "gpt-3.5-turbo",
        apiKey: "uZvhOkPqwN5Mt126Qppx7nVygrNG35Xbtkup0YWNyOg",
        maxTokens: 3584,
        useDefault: true,
        proxyConfig: {
          api: "v1/chat/completions",
          servername: "https://api.openai.com/",
          port: "",
        },
      },
      AITranslateWidgetConfig: {
        organizationName: "Quickblox",
        openAIModel: "gpt-3.5-turbo",
        apiKey: "uZvhOkPqwN5Mt126Qppx7nVygrNG35Xbtkup0YWNyOg",
        maxTokens: 3584,
        useDefault: true,
        defaultLanguage: "Ukrainian",
        languages: ["Ukrainian", "English", "French", "Portuguese", "German"],
        proxyConfig: {
          api: "v1/chat/completions",
          servername: "",
          port: "",
        },
        // proxyConfig: {
        //   api: 'v1/chat/completions',
        //   servername: 'http://localhost',
        //   port: '3012',
        // },
      },
      AIRephraseWidgetConfig: {
        organizationName: "Quickblox",
        openAIModel: "gpt-3.5-turbo",
        apiKey: "uZvhOkPqwN5Mt126Qppx7nVygrNG35Xbtkup0YWNyOg",
        maxTokens: 3584,
        useDefault: true,
        defaultTone: "Professional",
        Tones: [
          {
            name: "Professional Tone",
            description:
              "This would edit messages to sound more formal, using technical vocabulary, clear sentence structures, and maintaining a respectful tone. It would avoid colloquial language and ensure appropriate salutations and sign-offs",
            iconEmoji: "👔",
          },
          {
            name: "Friendly Tone",
            description:
              "This would adjust messages to reflect a casual, friendly tone. It would incorporate casual language, use emoticons, exclamation points, and other informalities to make the message seem more friendly and approachable.",
            iconEmoji: "🤝",
          },
          {
            name: "Encouraging Tone",
            description:
              "This tone would be useful for motivation and encouragement. It would include positive words, affirmations, and express support and belief in the recipient.",
            iconEmoji: "💪",
          },
          {
            name: "Empathetic Tone",
            description:
              "This tone would be utilized to display understanding and empathy. It would involve softer language, acknowledging feelings, and demonstrating compassion and support.",
            iconEmoji: "🤲",
          },
          {
            name: "Neutral Tone",
            description:
              "For times when you want to maintain an even, unbiased, and objective tone. It would avoid extreme language and emotive words, opting for clear, straightforward communication.",
            iconEmoji: "😐",
          },
          {
            name: "Assertive Tone",
            description:
              "This tone is beneficial for making clear points, standing ground, or in negotiations. It uses direct language, is confident, and does not mince words.",
            iconEmoji: "🔨",
          },
          {
            name: "Instructive Tone",
            description:
              "This tone would be useful for tutorials, guides, or other teaching and training materials. It is clear, concise, and walks the reader through steps or processes in a logical manner.",
            iconEmoji: "📖",
          },
          {
            name: "Persuasive Tone",
            description:
              "This tone can be used when trying to convince someone or argue a point. It uses persuasive language, powerful words, and logical reasoning.",
            iconEmoji: "☝️",
          },
          {
            name: "Sarcastic/Ironic Tone",
            description:
              "This tone can make the communication more humorous or show an ironic stance. It is harder to implement as it requires the AI to understand nuanced language and may not always be taken as intended by the reader.",
            iconEmoji: "😏",
          },
          {
            name: "Poetic Tone",
            description:
              "This would add an artistic touch to messages, using figurative language, rhymes, and rhythm to create a more expressive text.",
            iconEmoji: "🎭",
          },
        ],
        proxyConfig: {
          api: "v1/chat/completions",
          servername: "https://api.openai.com/",
          port: "",
        },
      },
    },
    appConfig: {
      maxFileSize: 10 * 1024 * 1024,
      sessionTimeOut: 122,
      chatProtocol: {
        active: 2,
      },
      debug: true,
      enableForwarding: true,
      enableReplying: true,
      regexUserName: "^(?=[a-zA-Z])[-a-zA-Z_ ]{3,49}(?<! )$",
      endpoints: {
        api: "api.quickblox.com",
        chat: "chat.quickblox.com",
      },
      // bot server endpoints:
      // endpoints: {
      //     api: 'apitest.quickblox.com',
      //     chat: 'chattest.quickblox.com',
      // },
      // on: {
      //     // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/require-await
      //     async sessionExpired(handleResponse: any, retry: any) {
      //         console.log(
      //             // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //             `QBconfig sessionExpired handle: ${handleResponse} ${retry}`,
      //         );
      //     },
      // },
      streamManagement: {
        enable: true,
      },
    },
    webrtc: {
      answerTimeInterval: 120,
      autoReject: true,
      incomingLimit: 1,
      dialingTimeInterval: 5,
      disconnectTimeInterval: 30,
      statsReportTimeInterval: true,
    },
    config: {
      debug: false,
      pingTimeout: 5,
      pingLocalhostTimeInterval: 5,
      webrtc: {
        answerTimeInterval: 120,
        autoReject: true,
        incomingLimit: 1,
        dialingTimeInterval: 5,
        disconnectTimeInterval: 30,
        statsReportTimeInterval: true,
      },
    },
  };
  const QB_Token = localStorage.getItem("qb_sessionToken");
  var mediaParams = {
    audio: true,
    video: true,
    options: {
      muted: true,
      mirror: true,
    },
    elemId: "localVideo",
  };
  const [CallesId, setCallesId] = useState<any>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null); // Define localVideoRef
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  // const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [remoteVideoState, setremoteVideoState] = useState("");
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [AllUsersInfo, setAllUsersInfo] = useState([]);

  useEffect(() => {
    QB?.webrtc?.getMediaDevices("videoinput").then((devices) => {
      if (devices.length > 0) {
        setSelectedDeviceId(devices[0].deviceId); // Select the first video device by default
      }
    });
  }, []);

  // const handleStartCall = async () => {
  //   try {
  //     const options: MediaStreamConstraints = {
  //       audio: true,
  //       video: selectedDeviceId
  //         ? { deviceId: { exact: selectedDeviceId } }
  //         : true,
  //     };
  //     const stream = await navigator.mediaDevices.getUserMedia(options);
  //     debugger;
  //     setLocalStream(stream);

  //     const sessionType = QB.webrtc.CallType.VIDEO;
  //     const calleesIds = [CallesId?.user?.id];

  //     const userInfo: any = {};
  //     const session = QB.webrtc.createNewSession(
  //       calleesIds,
  //       sessionType,
  //       userInfo
  //     );
  //     session.getUserMedia(mediaParams, function (error: any, stream: any) {
  //       if (error) {
  //       } else {
  //         var extension = {};
  //         session.call(extension, function (error: any) {});
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error starting call:", error);
  //     setErrorMessage("Error starting call.");
  //   }
  // };
  const [calleeStatus, setCalleeStatus] = useState<{ [key: number]: string }>(
    {}
  );

  const handleStartCall = async () => {
    const calleesIds = [CallesId?.user?.id]; // Array of user IDs to call
    const sessionType = QB?.webrtc?.CallType?.VIDEO;
    const userInfo: any = {};
    const session = QB.webrtc.createNewSession(
      calleesIds,
      sessionType,
      userInfo
      // {
      //   bandwidth: 0,
      // }
    );
    session.getUserMedia(mediaParams, function (error: any, stream: any) {
      if (error) {
        console.error("Error in getUserMedia:", error);
      } else {
        var extension = {};
        session.call(extension, function (error) {
          if (error) {
            console.error("Call failed:", error);
          } else {
            console.log("Call initiated...");
            if (localVideoRef.current && stream) {
              localVideoRef.current.srcObject = stream;
              session.attachMediaStream("localVideo", stream);
              // session.attachMediaStream("remoteVideo", stream);
            }
          }
        });
      }
    });
  };
  const handleEndCall = async () => {
    // Find the active session
    // const activeSession = QB.webrtc.sessions.find(session => session.state === QB.webrtc.SessionConnectionState.CONNECTED);
    // QB.webrtc.onCallListener = function (session: any, extension: any) {
    //   // if (session) {
    //     // End the call and clear the streams
    //     session.stop();

    //     // Reset local and remote video refs
    //     if (localVideoRef.current) {
    //       localVideoRef.current.srcObject = null;
    //     }
    //     if (remoteVideoRef.current) {
    //       remoteVideoRef.current.srcObject = null;
    //     }
    //   // }
    // };
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
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
  };
  useEffect(() => {
    test();
  }, []);
  function test() {
    QB?.webrtc?.getMediaDevices("videoinput").then(function (devices) {
      if (devices.length) {
        for (var i = 0; i < devices.length; i++) {
          var deviceInfo = devices[i];
          var deviceId = deviceInfo.deviceId;
          setSelectedDeviceId(deviceId);
        }
      }
    });
  }
  const qbUIKitContext: QBDataContextType = useQbUIKitDataContext();
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  useEffect(() => {
    qbUIKitContext.storage.CONNECTION_REPOSITORY.subscribe((status) => {
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

                await qbUIKitContext.authorize(authData);
                qbUIKitContext.setSubscribeOnSessionExpiredListener(() => {
                  console.timeLog("call OnSessionExpiredListener ... start");
                  logoutUIKitHandler();
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
        .catch((e) => {});
    }
  }, []);

  useEffect(() => {
    if (isSDKInitialized && QB.webrtc) {
      QB.webrtc.onCallListener = function (session, extension) {
        console.log("------------------------------------------------------");
        console.log("------------------------------------------------------");
        console.log("Remote session received from user " + session);
        let uname = AllUsersInfo.find(
          (element: any) => element.user.id === session.currentUserID
        );
        const acceptCall = window.confirm(
          `Incoming call from ${session.currentUserID}. Do you want to accept?`
        );
        if (acceptCall) {
          session.getUserMedia(
            mediaParams,
            function (err: any, remoteStream: any) {
              console.log("remoteStream ::", remoteStream);

              if (err) {
                console.log("error getting user media:", err);
              } else {
                // var extension = {};
                session.accept(extension);
                if (localVideoRef.current && remoteStream) {
                  localVideoRef.current.srcObject = remoteStream;
                  session.attachMediaStream("remoteVideo", remoteStream);
                }
                //session.attachMediaStream("localVideo", remoteStream);
                // if (remoteVideoRef.current) {
                //   session.attachMediaStream("remoteVideo", remoteStream);
                //   remoteVideoRef.current.srcObject = remoteStream;

                // }
              }
            }
          );
        } else {
          session.reject(extension);
        }
      };
      QB.webrtc.onSessionConnectionStateChangedListener = (
        session,
        userId,
        connectionState
      ) => {
        console.log("onSessionConnectionStateChangedListener", connectionState);

        const stateKey = Object.keys(QB.webrtc.SessionConnectionState).find(
          (key) =>
            QB.webrtc.SessionConnectionState[
              key as keyof typeof QB.webrtc.SessionConnectionState
            ] === connectionState
        );

        console.group("onSessionConnectionStateChangedListener.");
        console.log("Session: ", session);
        console.log("UserId: ", userId);
        console.log("Connection state: ", stateKey);
        console.groupEnd();

        if (connectionState === QB.webrtc.SessionConnectionState.CONNECTED) {
          for (const key in session.peerConnections) {
            const peer = session.peerConnections[key];
            const remoteStreams = peer
              .getReceivers()
              .map((receiver) => receiver.track)
              .filter((track) => track && track.kind === "video");
            if (remoteStreams.length > 0) {
              const stream = new MediaStream(remoteStreams);
              session.attachMediaStream("remoteVideo", stream);
            }
          }
        }
      };

     

      QB.webrtc.onAcceptCallListener = function (session, userId, extension) {
        console.log("------------------------------------------------------");
        console.log("Remote session received from user " + session);
        alert("Remote stream received from user " + userId);
      };
      QB.webrtc.onRemoteStreamListener = function (
        session: any,
        userId: any,
        remoteStream: any
      ) {
        console.log("------------------------------------------------------");
        console.log("Remote session received from user " + session);
        console.log("Remote stream received from user " + remoteStream);
        alert("Remote stream received from user " + userId);
        if (remoteVideoRef.current) {
          session.attachMediaStream("remoteVideo", remoteStream);
          // session.attachMediaStream("localVideo", remoteStream);
          remoteVideoRef.current.srcObject = remoteStream;
        }
      };
      // QB.webrtc.onRejectCallListener = function (session, userId, extension) {
      //   session.stop(extension);
      // };
      QB.webrtc.onCallStatsReport = function (
        session: any,
        userId: any,
        stats: any
      ) {
        console.log("------------------------------------------------------");
        console.log("------------------------------------------------------");
        console.log("userId: ", userId);
        console.log("session: ", session);
        console.log("stats: ", stats);
        alert(stats);
      };
    }
  }, [isSDKInitialized, AllUsersInfo]);

  function AllUsers(data1: any) {
    fetch("https://api.quickblox.com/users.json?page=1&per_page=50", {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "ApiKey 8yz6w5kz48OVa2qBKVPlPh7ReWAUlaZq2H72VYHl_VY",
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
                  <div
                    className="main-buttons-wrapper "
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button>Welcome,{currentUser?.login}</Button>
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
                            {currentUser?.login === itema.user.full_name ? (
                              ""
                            ) : (
                              <Button
                                style={{
                                  backgroundColor:
                                    CallesId?.user?.full_name ===
                                    itema.user.full_name
                                      ? "gray"
                                      : "blue",
                                  color: "#fff",
                                  marginBottom: 10,
                                }}
                                onClick={() => setCallesId(itema)}
                              >
                                {itema.user.full_name}
                              </Button>
                            )}
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
                      <div>
                        <video
                          id="localVideo"
                          autoPlay
                          muted
                          playsInline
                          ref={localVideoRef}
                        />
                      </div>
                      <div style={{ margin: 10 }}>
                        <video
                          id="remoteVideo"
                          autoPlay
                          playsInline
                          ref={remoteVideoRef}
                        />
                      </div>
                      <div>
                        <Button
                          style={{
                            backgroundColor: "red",
                            color: "#fff",
                            marginRight: 5,
                          }}
                          onClick={handleStartCall}
                        >
                          Start Call
                        </Button>
                        <Button
                          style={{ backgroundColor: "red", color: "#fff" }}
                          onClick={handleEndCall}
                        >
                          End Call
                        </Button>
                      </div>
                      {/* <button onClick={handleStartCall1}>Start Call ddd</button> */}
                    </div>
                  </div>
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
