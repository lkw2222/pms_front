import React, { useState, useRef, useEffect } from 'react'
import { LogOut, User } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore.js'

export default function MyPageWidget({ open }) {

    return (
        <>
            {/* 드롭다운 */}
            {open && (
                <div style={{
                    position:'absolute', top:'calc(100% + 8px)', right:0,
                    minWidth:220, width:'max-content', zIndex:1000,
                    background:'var(--color-bg-secondary)',
                    border:'1px solid var(--color-border)',
                    borderRadius:'var(--radius-lg)',
                    boxShadow:'var(--shadow-md)',
                    overflow:'hidden',
                    animation:'slideUp .15s ease',
                }}>

                    {/* 사용자 정보 */}
                    <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
                        <div style={{
                            width:40, height:40, borderRadius:'50%', flexShrink:0,
                            background:'linear-gradient(135deg, var(--color-accent), var(--color-purple))',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            color:'#fff',
                        }}>
                            <User size={20} strokeWidth={2} />
                        </div>
                        <div style={{ minWidth:0 }}>
                            <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:2 }}>
                                <span style={{ fontSize:11, color:'var(--color-text-muted)' }}>{role}</span>
                                <span style={{ fontSize:13, fontWeight:700, color:'var(--color-text-primary)', whiteSpace:'nowrap' }}>{name}</span>
                            </div>
                            <div style={{ fontSize:11, color:'var(--color-text-muted)', whiteSpace:'nowrap' }}>{subInfo}</div>
                        </div>
                    </div>

                    <div style={{ height:1, background:'var(--color-border)', margin:'0 12px' }} />

                    {/* 로그아웃 */}
                    <div style={{ padding:'6px' }}>
                        <button
                            onClick={handleLogout}
                            style={{
                                width:'100%', display:'flex', alignItems:'center', gap:8,
                                padding:'8px 10px', borderRadius:'var(--radius-md)',
                                border:'none', background:'transparent', cursor:'pointer',
                                fontSize:13, color:'var(--color-danger)',
                                fontWeight:500, transition:'background .12s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background='color-mix(in srgb, var(--color-danger) 10%, transparent)'}
                            onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        >
                            <LogOut size={14} />
                            로그아웃
                        </button>
                    </div>

                </div>
            )}
        </>
    )
}
