import React, { useEffect } from "react"
import clsx from 'clsx';
import { Container, Avatar, Typography, TextField, Button, Grid, Link, Box, CssBaseline, CircularProgress, FormControlLabel, Checkbox, AppBar, Drawer, Toolbar, IconButton, Divider, GridList, GridListTile, ListSubheader, GridListTileBar, Dialog, DialogTitle, DialogContent, FormControl, InputLabel, Select, Input, MenuItem, DialogActions, Tooltip } from '@material-ui/core'
import { Menu, Notifications, ChevronLeft, ChevronRight, ExpandMore, AllOut, Info, Settings, ExitToApp, Videocam, VideocamOff, 
    Mic, MicOff, VolumeMute, VolumeOff, VolumeUp, ScreenShare, StopScreenShare, ViewComfy, ViewCompact } from '@material-ui/icons'
import { createMuiTheme, makeStyles, ThemeProvider, withStyles } from '@material-ui/core/styles';
import routes from "../constants/routes"
import { useHistory } from "react-router-dom"
import { useSignInState } from "../providers/SignInStateProvider"
import { useAppState } from "../providers/AppStateProvider";
import { useMeetingState } from "../providers/MeetingStateProvider";
import { AttendeesTable } from "../components/AttendeesTable";

import { CustomAccordion } from "../components/CustomAccordion";
import { VideoTilesView } from "../components/VideoTileView";
import { useMessageState } from "../providers/MessageStateProvider";
import { useDeviceState } from "../providers/DeviceStateProvider";
import { ChatArea } from "../components/ChatArea";
import { useEnvironmentState } from "../providers/EvironmentStateProvider";
import { useState } from "react";

const toolbarHeight = 20
const drawerWidth = 240;
const accordionSummaryHeight = 20
const bufferHeight = 20
const theme = createMuiTheme({
    mixins: {
        toolbar: {
            minHeight: toolbarHeight,
        }
    },
});

type ViewMode = "FeatureView" | "GridView"


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        width:'100%',
        height:'100%',
        overflowX:'hidden',
        overflowY:'hidden',
    },

    ////////////////
    // ToolBar
    ////////////////
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        height: toolbarHeight
    },
    toolbar: {
        height: toolbarHeight
    },
    menuSpacer: {
        width: toolbarHeight, height: toolbarHeight,
    },

    menuButton: {
        width: toolbarHeight, height: toolbarHeight,
    },

    menuButtonActive: {
        width: toolbarHeight, height: toolbarHeight,
        color: "#ee7777"
    },


    title: {
        flexGrow: 1,
    },
    appBarSpacer: {
        height: toolbarHeight
    },

    ////////////////
    // SideBar
    ////////////////
    drawerPaper: {
        // marginLeft: drawerWidth,
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        // width: theme.spacing(3),
        [theme.breakpoints.up('xs')]: {
            // width: theme.spacing(0),
            width: 0,
        },
    },
    toolbarIcon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },



    ////////////////
    // Main
    ////////////////
    content: {
        flexGrow: 1,
        // width: `calc(100%-drawerWidth)`,
        // height: "100%",
        // height: `calc(100%-toolbarHeight)`,
        // width: 'auto',
        // height: 'auto',
        // overflow:'auto',
        overflow:'hidden',

    },

    ////////////////////
    // dialog
    ////////////////////
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    formControl: {
        margin: theme.spacing(1),
        width: '100%'
        // minWidth: 120,
    },    
}));


export const MeetingRoom = () => {
    const { screenHeight, screenWidth } = useEnvironmentState()
    const { audioInputList, videoInputList, audioOutputList } = useDeviceState()    
    const { meetingName, meetingSession, attendees, videoTileStates, leaveMeeting, setAudioOutputElement, 
            shareScreen, stopShareScreen, isScreenSharing,
             audioInput, audioInputEnable, setAudioInputEnable,
             videoInput, videoInputEnable, setVideoInputEnable,
             audioOutput, audioOutputEnable, setAudioOutputEnable,
             setVideoInput, setVirtualBG, setAudioInput, setAudioOutput,
             virtualBG } = useMeetingState()
    const classes = useStyles()
    const history = useHistory()
    
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [settingDialogOpen, setSettingDialogOpen] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
    const [viewMode, setViewMode] = useState("FeatureView" as ViewMode)


    const toggleDrawerOpen = () => {
        setDrawerOpen(!drawerOpen);
    };
    const toggleAudioInputEnable = () =>{
        setAudioInputEnable(!audioInputEnable)
    }
    const toggleVideoInputEnable = () =>{
        setVideoInputEnable(!videoInputEnable)
    }
    const toggleAudioOutputEnable = () =>{
        setAudioOutputEnable(!audioOutputEnable)
    }


    const onInputVideoChange = async (e: any) => {
        if (e.target.value === "None") {
            setVideoInput(null)
        } else if (e.target.value === "File") {
            // fileInputRef.current!.click()
        } else {
            setVideoInput(e.target.value)
        }
    }
    const onVirtualBGChange = async (e: any) => {
        if (e.target.value === "None") {
            setVirtualBG(null)
        } else {
            setVirtualBG(e.target.value)
        }
    }

    const onInputAudioChange = async (e: any) => {
        if (e.target.value === "None") {
            setAudioInput(null)
        } else {
            setAudioInput(e.target.value)
        }
    }
    const onOutputAudioChange = async (e: any) => {
        if (e.target.value === "None") {
            setAudioOutput(null)
        } else {
            setAudioOutput(e.target.value)
        }
    }

    const handleOnClickScreenShare = async()=>{
        shareScreen()
    }
    const handleOnClickStopScreenShare = async() =>{
        stopShareScreen()
    }

    useEffect(()=>{
        const audioElement = document.getElementById("for-speaker")! as HTMLAudioElement
        audioElement.autoplay=false

        console.log("AUDIO ELEMENT SETTING!!!", audioElement)
        setAudioOutputElement(audioElement)
    },[])

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className={classes.root}>


                <AppBar position="absolute" className={clsx(classes.appBar)}>
                    <Toolbar className={classes.toolbar}>
                        {
                            drawerOpen ?
                                <Tooltip title="Drawer Close">
                                    <Button color="inherit" className={clsx(classes.menuButton)} startIcon={<ChevronLeft />} onClick={toggleDrawerOpen}>
                                        menu
                                    </Button>
                                </Tooltip>
                                :
                                <Tooltip title="Drawer Open">
                                    <Button color="inherit" className={clsx(classes.menuButton)} endIcon={<ChevronRight />} onClick={toggleDrawerOpen}>
                                        menu
                                    </Button>
                                </Tooltip>
                        }
                        <Typography color="inherit" noWrap className={classes.title}>
                            {meetingName}
                        </Typography>

                        {audioInputEnable?
                            <Tooltip title="Mic Off">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={toggleAudioInputEnable}>
                                    <Mic />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Mic On">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={toggleAudioInputEnable}>
                                    <MicOff />
                                </IconButton>
                            </Tooltip>
                        }
                        {videoInputEnable?
                            <Tooltip title="Video Off">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={toggleVideoInputEnable}>
                                    <Videocam />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Video On">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={toggleVideoInputEnable}>
                                    <VideocamOff />
                                </IconButton>
                            </Tooltip>
                        }
                        {audioOutputEnable?
                            <Tooltip title="Speaker Off">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={toggleAudioOutputEnable}>
                                    <VolumeUp />
                                </IconButton>
                            </Tooltip>
                            :
                            <Tooltip title="Speaker On">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={toggleAudioOutputEnable}>
                                    <VolumeOff />
                                </IconButton>
                            </Tooltip>
                        }
                        <Tooltip title="Setting">
                            <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={(e)=>{setSettingDialogOpen(true)}}>
                                <Settings />
                            </IconButton>
                        </Tooltip>
                        <span className={clsx(classes.menuSpacer)}>  </span>
                        <span className={clsx(classes.menuSpacer)}>  </span>
                        {isScreenSharing?
                            <Tooltip title="Stop Share Screen">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={(e)=>{handleOnClickStopScreenShare()}}>
                                    <StopScreenShare />
                                </IconButton>
                            </Tooltip>
                        :
                            <Tooltip title="Share Screen">
                                <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={(e)=>{handleOnClickScreenShare()}}>
                                    <ScreenShare />
                                </IconButton>
                            </Tooltip>
                        }
                        <span className={clsx(classes.menuSpacer)}>  </span>
                        <span className={clsx(classes.menuSpacer)}>  </span>

                        <Tooltip title="Feature View">
                            <IconButton color="inherit" className={viewMode === "FeatureView" ? classes.menuButtonActive : classes.menuButton} onClick={(e)=>{setViewMode("FeatureView")}}>
                                <ViewCompact/>  
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Feature View">
                            <IconButton color="inherit" className={viewMode === "GridView" ? classes.menuButtonActive : classes.menuButton} onClick={(e)=>{setViewMode("GridView")}}>
                                <ViewComfy/>  
                            </IconButton>
                        </Tooltip>

                        <span className={clsx(classes.menuSpacer)}>  </span>
                        <span className={clsx(classes.menuSpacer)}>  </span>


                        <Tooltip title="Leave Meeting">
                            <IconButton color="inherit" className={clsx(classes.menuButton)} onClick={(e)=>{setLeaveDialogOpen(true)}}>
                                <ExitToApp />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>



                <Dialog disableBackdropClick disableEscapeKeyDown open={settingDialogOpen} onClose={(e)=>{setSettingDialogOpen(false)}} >
                    <DialogTitle>Setting</DialogTitle>
                    <DialogContent>
                        <form className={classes.form} noValidate>
                            <FormControl className={classes.formControl} >
                                <InputLabel>Camera</InputLabel>
                                <Select onChange={onInputVideoChange} value={videoInput}>
                                    <MenuItem disabled value="Video">
                                        <em>Video</em>
                                    </MenuItem>
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                    {videoInputList?.map(dev => {
                                        return <MenuItem value={dev.deviceId} key={dev.deviceId}>{dev.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                            <FormControl className={classes.formControl} >
                                <InputLabel>VirtualBG</InputLabel>
                                <Select onChange={onVirtualBGChange} value={virtualBG} >
                                    <MenuItem disabled value="Video">
                                        <em>VirtualBG</em>
                                    </MenuItem>
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="BodyPix">
                                        <em>BodyPix</em>
                                    </MenuItem>
                                    <MenuItem value="GoogleMeet">
                                        <em>GoogleMeet</em>
                                    </MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl className={classes.formControl} >
                                <InputLabel>Microhpone</InputLabel>
                                <Select onChange={onInputAudioChange} value={audioInput} >
                                    <MenuItem disabled value="Video">
                                        <em>Microphone</em>
                                    </MenuItem>
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                    {audioInputList?.map(dev => {
                                        return <MenuItem value={dev.deviceId} key={dev.deviceId}>{dev.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>

                            <FormControl className={classes.formControl} >
                                <InputLabel>Speaker</InputLabel>
                                <Select onChange={onOutputAudioChange} value={audioOutput} >
                                    <MenuItem disabled value="Video">
                                        <em>Speaker</em>
                                    </MenuItem>
                                    <MenuItem value="None">
                                        <em>None</em>
                                    </MenuItem>
                                    {audioOutputList?.map(dev => {
                                        return <MenuItem value={dev.deviceId} key={dev.deviceId} >{dev.label}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </form>                    
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>{setSettingDialogOpen(false)}} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>


                <Dialog disableBackdropClick disableEscapeKeyDown open={leaveDialogOpen} onClose={(e)=>{setLeaveDialogOpen(false)}} >
                    <DialogTitle>Leave meeting</DialogTitle>
                    <DialogContent>
                        You are leaving meeting.
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={(e)=>{setLeaveDialogOpen(false);leaveMeeting();history.push(routes.HOME)}} color="primary">
                            Ok
                        </Button>
                        <Button onClick={(e)=>{setLeaveDialogOpen(false)}} color="secondary">
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>

                <div style={{marginTop:toolbarHeight, position:"absolute", display:"flex"}}>
                    <Drawer
                        variant="permanent"
                        classes={{
                            paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
                        }}
                        open={drawerOpen}
                    >
                        <CustomAccordion title="Member">
                            <div style={{ height: 200, width: '100%' }}>
                                <AttendeesTable attendees={attendees}/>
                            </div>
                        </CustomAccordion>

                        <CustomAccordion title="Chat">
                            <div style={{ height: 400, width: '100%'}}>
                                <ChatArea/>
                            </div>
                        </CustomAccordion>
                    </Drawer>

                {/* <main className={classes.content} style={{height:`${screenHeight}px`}}> */}
                <main style={{height:`${screenHeight-toolbarHeight-bufferHeight}px`}}>
                    {
                        (()=>{
                            switch(viewMode){
                                case "FeatureView":
                                    return <VideoTilesView tiles={meetingSession!.audioVideo.getAllVideoTiles()} attendees={attendees} videoTileStates={videoTileStates}
                                                height={screenHeight-toolbarHeight-bufferHeight} width={drawerOpen?screenWidth-drawerWidth:screenWidth}/>
                                case "GridView":
                                    return <div>GRID</div>
                            }
                        })()
                    }
                </main>
                </div>
            </div>
            <div>
                <audio id="for-speaker" style={{display:"none"}}/>
            </div>

        </ThemeProvider>
    )
}
