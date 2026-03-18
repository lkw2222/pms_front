import React, {useState} from "react";
import TextInput from "@/components/input/TextInput.jsx";
import CheckboxInput from "@/components/input/CheckboxInput.jsx";
import DateInput from "@/components/input/DateInput.jsx";
import EmailInput from "@/components/input/EmailInput.jsx";
import FileInput from "@/components/input/FileInput.jsx";

const InputFeature = ({}) => {
    {/*input 관련 변수*/}
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;

    {/*날짜 관련 변수*/}
    const [selectedDate, setSelectedDate] = useState('');
    const [dateRange, setDateRange] = useState('');

    {/*이메일 관련 변수*/}
    const [email, setEmail] = useState('');

    {/*파일 관련 변수*/}
    const [selectedFiles, setSelectedFiles] = useState([]);
    // 파일 업로드 버튼 클릭 시 (서버로 전송하는 로직)
    const handleUploadSubmit = () => {
        if (selectedFiles.length === 0) {
            alert("업로드할 파일을 선택해주세요.");
            return;
        }

        // 서버 전송을 위한 FormData 객체 생성
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('files', file); // 'files'는 서버에서 받을 변수명
        });

        console.log(`총 ${selectedFiles.length}개의 파일 전송 준비 완료!`);

        // axios.post('/api/upload', formData, {
        //   headers: { 'Content-Type': 'multipart/form-data' }
        // }).then(...)
    };

    return (
        <div style={{padding : '10px', color:'#fff'}}>
            <h3>Input Components</h3>
            <TextInput placeholder={'Text 입력창'} label={'Text 입력창'} />
            <TextInput placeholder={'필수 Text 입력창'} label={'필수 Text 입력창'} isNotNull={true}/>
            <TextInput placeholder={'비밀번호 입력창'} label={'비밀번호 입력창'} type={'password'}
                       isNotNull={true} regex={passwordRegex} errorMessage={'영문과 숫자를 최소 1자 이상 포함하여 8자리 이상 입력해주세요.'}
            />

            <CheckboxInput label={'Checkbox Input'}/>

            <DateInput label={'일자선택'} value={selectedDate}
                       onChange={(dateStr) => setSelectedDate(dateStr)} placeholder='일자선택'/>
            <DateInput label={'기간선택'} value={dateRange}
                       onChange={(dateStr) => setDateRange(dateStr)} options={{mode:'range',minDate:'today'}} placeholder='시작일자 - 종료일자'/>

            <EmailInput label={'이메일 주소'} value={email} onChange={(newEmail) => setEmail(newEmail)}/>

            <FileInput
                label="파일 업로드"
                onChange={(files) => setSelectedFiles(files)} // File 객체 배열이 넘어옵니다.
                accept=".pdf, .doc, .docx, .xls, .xlsx, image/*" // 특정 확장자만 허용하고 싶을 때 속성 전달
            />
            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button onClick={handleUploadSubmit} style={{ padding: '8px 16px', cursor: 'pointer' }}>
                    서버로 전송
                </button>
            </div>

        </div>
    )
}

export default InputFeature;