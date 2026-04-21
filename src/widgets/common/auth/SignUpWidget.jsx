import React from 'react'
import {UserPlus, Pencil, Lock, Save, X} from 'lucide-react'
import TextInput from "@/components/input/TextInput";
import SelectInput from "@/components/input/SelectInput";
import Textarea from "@/Components/input/Textarea";
import BasicButton from "@/Components/button/BasicButton";

export default function MyPageWidget({ onClose }) {

    return (
        <div style={{
                position:       'fixed',
                inset:          0,
                zIndex:         9999,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                background:     'rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)',
                animation:      'fadeIn 0.2s ease',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-lg)',
                    width: '500px',
                    boxShadow: 'var(--shadow-lg)'
                }}
                // 🌟 핵심: 모달 창 내부를 클릭했을 때 배경 클릭 이벤트로 전달(버블링)되는 것을 막음!
                onClick={(e) => e.stopPropagation()}
            >
                {/*헤더*/}
                <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 16px', borderBottom:'1px solid var(--color-border)', flexShrink:0 }}>
                    <UserPlus size={14} style={{ color:'var(--color-text-secondary)' }} />
                    <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)', flex:1 }}>신규 이용자 가입</span>
                </div>

                {/*바디*/}
                <div style={{ display:'flex', flexDirection:'column', padding:'10px 20px', gap: 8 }}>
                    <TextInput
                        label="이용자 이름"
                        placeholder="이용자 이름을 입력해주세요."
                        type="text"
                        isNotNull
                        icon={Pencil}
                    />
                    <SelectInput
                        label="지역본부"
                        isNotNull
                        options={[
                            {label:'서울본부', value:'서울본부'},
                            {label:'남서울본부', value:'남서울본부'},
                            {label:'인천본부', value:'인천본부'},
                            {label:'경기북부본부', value:'경기북부본부'},
                            {label:'경기본부', value:'경기본부'},
                            {label:'강원본부', value:'강원본부'},
                            {label:'충북본부', value:'충북본부'},
                            {label:'대전세종충남본부', value:'대전세종충남본부'},
                            {label:'전북본부', value:'전북본부'},
                            {label:'광주전남본부', value:'광주전남본부'},
                            {label:'대구본부', value:'대구본부'},
                            {label:'경북본부', value:'경북본부'},
                            {label:'부산울산본부', value:'부산울산본부'},
                            {label:'경남본부', value:'경남본부'},
                            {label:'제주본부', value:'제주본부'}
                        ]}
                    />
                    <SelectInput
                        label="사업소"
                        isNotNull
                        options={[
                            {label:'동대문중랑지사', value:'동대문중랑지사'},
                            {label:'서대문은평지사', value:'서대문은평지사'},
                            {label:'강북성북지사', value:'강북성북지사'},
                            {label:'광진성동지사', value:'광진성동지사'},
                            {label:'마포용산지사', value:'마포용산지사'},
                            {label:'노원도봉지사', value:'노원도봉지사'}
                        ]}
                    />
                    <TextInput
                        label="아이디"
                        placeholder="아이디는 6~14자의 영문 소문자, 숫자만 입력 가능합니다."
                        type="text"
                        isNotNull
                        icon={Pencil}
                        regex={/^[a-z0-9]{6,14}$/}
                        errorMessage="아이디는 6~14자의 영문 소문자, 숫자만 입력 가능합니다."
                    />
                    <TextInput
                        label="비밀번호"
                        type="password"
                        placeholder="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        isNotNull
                        regex={/^(?=.*[a-zA-Z])(?=.*\d).{8,}$/}
                        errorMessage="영문과 숫자를 포함한 8자리 이상 입력하세요."
                        icon={Lock}
                    />
                    <TextInput
                        label="비밀번호 확인"
                        type="password"
                        placeholder="비밀번호를 한번 더 입력해주세요."
                        isNotNull
                        icon={Lock}
                    />
                    <SelectInput
                        label="비밀번호 찾기 질문"
                        isNotNull
                        options={[
                            {label:'나의 초등학교 이름은?', value:'001'},
                            {label:'나의 고향은?', value:'002'}
                        ]}
                    />
                    <TextInput
                        label="비밀번호 찾기 답변"
                        placeholder="비밀번호 찾기 질문에 대한 답변을 입력하세요."
                        type="text"
                        isNotNull
                        icon={Pencil}
                    />
                    <Textarea
                        label="이용목적"
                        placeholder="이용목적을 입력해주세요."
                        rows={3}
                    />
                </div>

                {/*푸터*/}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '0 20px 10px' }}>
                    <BasicButton label="취소" icon={X} variant="secondary" size="sm" onClick={ onClose } />
                    <BasicButton
                        label="가입"
                        icon={Save}
                        variant="primary" size="sm"
                    />

                </div>
            </div>
        </div>
    )
}
