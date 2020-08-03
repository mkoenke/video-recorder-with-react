import React from 'react';
import './TestVideoRecordPage.css';

class TestVideoRecordPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      videos: [],
      videoURL: '',
      hideStopButton: false,
    }
    
    this.startRecording = this.startRecording.bind(this)
    this.stopRecording = this.stopRecording.bind(this)
    this.saveVideo = this.saveVideo.bind(this)
  }

  async componentDidMount() {
    // const camera = navigator.mediaDevices.enumerateDevices()
    // .then((devices)=>{
    //   devices.forEach((device)=>{
    //     console.log(device.kind + " " + device.label + " "+ device.deviceId)
    //   })
    //  //list the mediadevices
    //   devices.filter((device)=> device.kind === 'videoinput' && device.label != `Microsoft IR Camera Front`)
    // }).catch((err)=>{console.log(err)})
    const supports = navigator.mediaDevices.getSupportedConstraints();
    if (!supports.width || !supports.height || !supports.facingMode) {
      // Treat like an error.
      console.log('not supported')
    }
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true, 
      video: true,
    });
    // show it to user
    // this.video.src = window.URL.createObjectURL(stream.blob);//this is deprecated
    this.video.srcObject = stream;
    console.log('stream----', stream)
    this.video.play();
    // initialize recording
    this.mediaRecorder = new MediaRecorder(stream);
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
  }

  startRecording(e) {
    e.preventDefault(); 
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    // say that we're recording
    this.setState({recording: true});
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    this.setState({
      recording: false,
      hideStopButton: true,
    });
    // save the video to memory
    this.saveVideo(); 
    //disconnect the mediarecorder access
    const stream = this.video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track)=> track.stop());
  }

  saveVideo() {
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, {type: 'video/webm;codecs=vp9,opus'});
    console.log('saveVideo blob: ', new Blob(this.chunks, {type: 'video/webm;codecs=vp9,opus'}))
    // generate temp video url from blob
    const videoURL = window.URL.createObjectURL(blob);
    console.log('videoURL: ', window.URL.createObjectURL(blob))
    const videos = this.state.videos.concat([videoURL]);
    this.setState({videos});
    this.setState({videoURL: videoURL})//need to remove later if doesnt work
    // this.componentWillUnmount() //initial placement for unmount
  }

  // componentWillUnmount(){
  //   console.log('component unmounted')
  //     //unmounts mediarecording and webcam
  //     // this.video.srcObject = this.state.videoURL
  //     const stream = this.video.srcObject;
  //     const tracks = stream.getTracks();
  //     tracks.forEach((track)=> track.stop());
  //     // this.video.srcObject = null;
  // }

 
  render() {
    const {recording, videos, videoURL} = this.state;
    console.log('videourl from render: ', videoURL)

    let display;
    if(!videoURL){
      display = <video 
      style={{width: "60%", height: "40%"}}
      muted={true}
      ref={v => {
        this.video = v;
      }}
      >
    </video> 
    } else if(this.stopRecording){
      display = videos.map((videoURL, i) => (
        <div key={`video_${i}`}>
          <video controls style={{width: "60%", height: "40%"}} src={videoURL}/> 
        </div>
      ))
    }

    return (
      <div className="camera">
          {display}
        <div className="buttons" hidden = {this.state.hideStopButton}>
          {!recording && <button onClick={e => this.startRecording(e)}>Record</button>}
          {recording &&  <button onClick={e => this.stopRecording(e)} >Stop</button>}
        </div>
          {/* <button>Upload this Video</button> */}
      </div>
    );
  }
}

export default TestVideoRecordPage;