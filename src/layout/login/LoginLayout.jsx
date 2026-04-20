import React from "react";
import LoginFeature from "@/features/common/login/LoginFeature.jsx";
import {useMutation} from "@tanstack/react-query";
import {toast} from "sonner";
import {useAppStore} from "@/store/useAppStore.js";
import { loginApi }  from '@/services/common/login/loginService.js'

import kepco from "@/assets/image/kepco.png";
import loginSlide01 from "@/assets/image/login-slide-01.png";
import loginSlide02 from "@/assets/image/login-slide-02.png";
import logoKepri from "@/assets/image/logo-kepri.png";

export default function LoginLayout() {

    const { setSessionExpired, setAuth } = useAppStore();

    const loginMutation = useMutation({
        mutationFn: ({ id, password }) => loginApi.login(id, password),
        throwOnError: false,
        onSuccess: (result) => {
            setAuth(result.user, result.token);
            setSessionExpired(false);
            toast.success('로그인되었습니다. 작업을 계속하세요.');
        },
        onError: (error) => {
            toast.error(error.message || '로그인에 실패했습니다.', {style: {
                minWidth: '500px',
                    minHeight: '80px',
                    padding: '20px',
                    fontSize: '20px',
                    fontWeight : 'bolder',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, 0%)'
            }});
        },
    })

    return (
        <main id="main-content" className="login-page">
            <div className="login-shell">
                <section className="login-visual" aria-labelledby="visual-title">
                    <div className="visual-track">
                        <div className="visual-slide is-active" data-slide="0" aria-hidden="false">
                            <img src={ loginSlide01 } alt="" />
                        </div>
                        <div className="visual-slide" data-slide="1" aria-hidden="true">
                            <img src={ loginSlide02 } alt="" />
                        </div>
                    </div>
                    <div className="visual-copy">
                        <p className="eyebrow">지능형 전주 진단 플랫폼</p>
                        <h1 id="visual-title" className="headline">데이터가 알려주는<br />다음 교체 전주</h1>
                        <p className="description">
                            복합하중 계산과 SCC 인자 분석을 통한 지능형 전주 진단 플랫폼.<br />
                            700만본 전주의 위험도를 실시간으로 평가하고 관리합니다.
                        </p>
                    </div>
                    <div className="visual-footer-logo" aria-hidden="true">
                        <img src={ kepco } alt="" />
                    </div>
                    <div className="visual-controls">
                        <div className="visual-pager" role="group" aria-label="배경 이미지 선택">
                            <button className="visual-dot is-active" type="button" data-index="0" aria-label="첫 번째 배경 이미지 보기" aria-current="true">
                                <span className="visually-hidden">첫 번째 이미지</span>
                            </button>
                            <button className="visual-dot" type="button" data-index="1" aria-label="두 번째 배경 이미지 보기" aria-current="false">
                                <span className="visually-hidden">두 번째 이미지</span>
                            </button>
                        </div>
                        <button id="visualToggle" className="visual-toggle" type="button" aria-pressed="false">일시정지</button>
                    </div>
                </section>

                <section className="login-panel" aria-labelledby="login-title">
                    <div className="login-box">
                        <div className="brand">
                            <img className="brand-logo" src={ logoKepri } alt="전력연구원" />
                            <h2 id="login-title" className="brand-title">전주 진단우선순위 시스템</h2>
                        </div>
                        {/* 로그인 폼 — 기존 LoginFeature 재사용 */}
                        <LoginFeature isPending={loginMutation.isPending} onLogin={(id, password) => { loginMutation.mutate({ id, password })} } />
                    </div>
                </section>
            </div>
        </main>
    )
}