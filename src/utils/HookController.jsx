// ── react-hook-form Controller 래퍼 ──────────────────────────────────────────
import {Controller} from "react-hook-form";
import React from "react";
import TextInput from "@/components/input/TextInput.jsx";
import SelectInput from "@/components/input/SelectInput.jsx";
import Textarea from "@/components/input/Textarea.jsx";

// 공통 훅
function useControlledField({ name, control, rules, defaultValue = '' }) {
    return {
        name, control, rules, defaultValue,
    };
}

// 혹은 HOC 스타일로 팩토리 함수
function createControlled(Component) {
    return React.memo(function Controlled({ name, control, label, rules, defaultValue = '', ...rest }) {
        return (
            <Controller
                name={name}
                control={control}
                rules={rules}
                defaultValue={defaultValue}
                render={({ field: { ref, value, onChange, onBlur }, fieldState: { error } }) => (
                    <Component
                        {...rest}
                        ref={ref}
                        label={label}
                        value={value ?? ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        isNotNull={!!rules?.required}
                        errorMessage={error?.message}
                        aria-invalid={!!error}
                    />
                )}
            />
        );
    });
}

export const ControllerText = createControlled(TextInput);
export const ControllerSelect = createControlled(SelectInput);
export const ControllerTextarea = createControlled(Textarea);