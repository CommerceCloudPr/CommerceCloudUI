'use client';

import Choices from 'choices.js';
import { useEffect, useRef } from 'react';
const ChoicesFormInput = ({
  children,
  multiple,
  className,
  onChange,
  allowInput,
  options,
  defaultValue,
  value,
  ...props
}) => {
  const choicesRef = useRef(null);
  const choicesInstanceRef = useRef(null);
  
  useEffect(() => {
    if (choicesRef.current) {
      // Eğer zaten bir Choices instance varsa, önce onu temizle
      if (choicesInstanceRef.current) {
        try {
          choicesInstanceRef.current.destroy();
        } catch (e) {
          // Ignore destroy errors
        }
      }
      
      try {
        const choices = new Choices(choicesRef.current, {
          ...options,
          placeholder: true,
          allowHTML: true,
          shouldSort: false
        });
        choicesInstanceRef.current = choices;
        
        // defaultValue veya value varsa set et
        if (defaultValue !== undefined && defaultValue !== null) {
          choices.setChoiceByValue(String(defaultValue));
        } else if (value !== undefined && value !== null) {
          choices.setChoiceByValue(String(value));
        }
        
        choices.passedElement.element.addEventListener('change', e => {
          if (!(e.target instanceof HTMLSelectElement)) return;
          if (onChange) {
            onChange(e.target.value);
          }
        });
      } catch (error) {
        // Choices zaten initialize edilmişse hata verme
        if (!error.message.includes('already initialised')) {
          console.error('Choices initialization error:', error);
        }
      }
    }
    
    // Cleanup function
    return () => {
      if (choicesInstanceRef.current) {
        try {
          choicesInstanceRef.current.destroy();
          choicesInstanceRef.current = null;
        } catch (e) {
          // Ignore destroy errors
        }
      }
    };
  }, [choicesRef, onChange, options, defaultValue, value]);
  
  const selectProps = {
    ...props,
    defaultValue: defaultValue !== undefined ? defaultValue : undefined,
    value: value !== undefined ? value : undefined
  };
  
  return allowInput ? <input ref={choicesRef} multiple={multiple} className={className} {...selectProps} /> : <select ref={choicesRef} multiple={multiple} className={className} {...selectProps}>
      {children}
    </select>;
};
export default ChoicesFormInput;