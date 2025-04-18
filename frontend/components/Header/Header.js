import React, { useState,useEffect } from 'react';
import { useDispatch } from 'react-redux';
import SearchIcon from '../../resource/images/svg/search.svg'
import {search} from '../../redux/searchReducer'
import history from '../../router/history'
import { Link } from 'react-router-dom';
import KeyboardVoiceIcon from '@material-ui/icons/KeyboardVoice';
import { ReactMic } from 'react-mic';
import "./style.css"

const Header = () => {
  const dispatch = useDispatch();
  const [research,setResearch] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const onSearchVoice = (value) =>{
    dispatch(search(value))
    history.push(`/search`)
}

  const handleImageUpload = (blob) => {
    const file = blob;
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'tesst123456'); // Thay thế bằng preset bạn đã tạo trên Cloudinary
    formData.append('cloud_name', 'dszbxqkvn'); // Thay thế với cloud name của bạn

    // Upload file lên Cloudinary
    fetch('https://api.cloudinary.com/v1_1/dszbxqkvn/upload', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        new Promise(async()=>{
        const a = await sendAudioToAssemblyAI(data.url)
          if(a){
            setResearch(a)
        onSearchVoice(a)
          }
      })
      })
      .catch(error => {
        console.error('Error uploading image:', error);
      });
  };
  
  const handleChangeSearch = (e) =>{
    setResearch(e.target.value)
    
  }
  const onSearch = () =>{
      dispatch(search(research))
      history.push(`/search`)
  }



  const startRecording = () => {
    setIsRecording(true);
  };

  const stopRecording = () => {
    setIsRecording(false);
  };

  const onData = (recordedBlob) => {
    console.log("Recording...", recordedBlob);
  };

  const onStop = async (recordedBlob) => {
    console.log("Recording stopped:", recordedBlob);
    const audioBlob = recordedBlob.blob; // Lấy Blob từ react-mic
    handleImageUpload(audioBlob)
  
  };
  
  

  const sendAudioToAssemblyAI = async (audioUrl) => {
    const apiKey = "1f645bb4f90543ac836099b86009a592";
    const uploadUrl = "https://api.assemblyai.com/v2/upload";
    const transcriptUrl = "https://api.assemblyai.com/v2/transcript";

    
    // Bước 2: Gửi request để nhận diện văn bản từ file audio
    const transcriptResponse = await fetch(transcriptUrl, {
      method: "POST",
      headers: {
        "Authorization": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ audio_url: audioUrl })
    });

    const transcriptData = await transcriptResponse.json();
    const transcriptId = transcriptData.id;

    // Bước 3: Kiểm tra trạng thái chuyển đổi
    let transcriptText = "";
    while (true) {
      const checkResponse = await fetch(`${transcriptUrl}/${transcriptId}`, {
        headers: { "Authorization": apiKey }
      });
      const checkData = await checkResponse.json();

      if (checkData.status === "completed") {
        transcriptText = checkData.text;
        // Loại bỏ dấu chấm ở cuối nếu có
      if (transcriptText.endsWith(".")) {
        transcriptText = transcriptText.slice(0, -1);
      }
        break;
      } else if (checkData.status === "failed") {
        transcriptText = "Lỗi nhận diện giọng nói!";
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Đợi 3s trước khi kiểm tra lại
    }
    return transcriptText;
  };

  return (
    <div className="ms_header">
      <div className="ms_top_left">
        

        <div className="ms_top_search">
        <input
          type="text"
          className="form-control"
          style={{position: 'relative'}}
          value={research}
          onChange={handleChangeSearch}
          placeholder="Tìm kiếm bài hát"
        />
        <span onClick={() => onSearch(research)} className="search_icon">
        <img src={SearchIcon} alt="" />
        </span>
        <span style={{position:'absolute' , top: '9px', right: '-30px', color: 'white', fontSize: '22px'}} onClick={startRecording} className="mic_icon">
        <KeyboardVoiceIcon/>
        </span>
     
       {
        isRecording && (
          <div className="recording-popup">
          <div className="popup-content">
            <span className="mic-icon"><KeyboardVoiceIcon/></span>
            <span style={{marginBottom : '20px'}}>Đang ghi âm...</span>
              <button onClick={stopRecording} style={{ backgroundColor: 'red' }}>Stop</button>
          </div>
        </div>
        )
       }
      </div>
      

       <div style={{ fontSize: '13rem', marginLeft: '100px' }} className="ms_top_trend">
          {/* <span><a href="_blank" className="ms_color">Trending Songs :</a></span> <span className="top_marquee"><a href="_blank">Chúng ta của hiện tại, bức tranh từ nước mắt</a></span> */}
          
        </div> 
      </div>
      <div className="ms_top_right">
      <ReactMic
        record={isRecording}
        className="sound-wave"
        onStop={onStop}
        onData={onData}
        strokeColor="#000000"
        backgroundColor="#FF4081"
        // style={{width: '100px!important'}}
        height={'40px'}
      />
        <div className="ms_top_btn">
          {/* <Link to={`/register`} style={{color:'white',fontSize:'small',fontWeight:'bold'}} className="ms_btn reg_btn" data-toggle="modal" ><span>Đăng ký</span></Link>
          <Link to={`/login`} style={{color:'white',fontSize:'small',fontWeight:'bold'}} className="ms_btn login_btn" data-toggle="modal"><span>Đăng nhập</span></Link> */}
        </div>
      </div>
    </div>

  );
}
export default Header;;

