'use client';

import { useEffect, useMemo, useRef } from 'react';

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
  const elRef = useRef(null);
  const instRef = useRef(null);

  // options her render'da yeni obje geliyorsa sürekli destroy/init yapmasın
  const memoOptions = useMemo(() => options ?? {}, [options]);

  useEffect(() => {
    // input ise choices kurma (choices.js select/multiselect için)
    if (allowInput) return;

    let isMounted = true;
    let handler = null;

    (async () => {
      // prerender/SSR sırasında çık
      if (typeof window === 'undefined') return;
      if (!elRef.current) return;

      // choices.js'i sadece client'ta yükle
      const { default: Choices } = await import('choices.js');

      // eski instance temizle
      if (instRef.current) {
        try {
          instRef.current.destroy();
        } catch {}
        instRef.current = null;
      }

      // instance oluştur
      const inst = new Choices(elRef.current, {
        ...memoOptions,
        placeholder: true,
        allowHTML: true,
        shouldSort: false,
      });

      if (!isMounted) {
        try {
          inst.destroy();
        } catch {}
        return;
      }

      instRef.current = inst;

      // defaultValue/value set
      const v = defaultValue ?? value;
      if (v !== undefined && v !== null) {
        try {
          inst.setChoiceByValue(String(v));
        } catch {}
      }

      // change listener
      handler = (e) => {
        const t = e?.target;
        if (!t) return;
        if (onChange) onChange(t.value);
      };

      try {
        inst.passedElement.element.addEventListener('change', handler);
      } catch {}
    })();

    return () => {
      isMounted = false;

      if (instRef.current && handler) {
        try {
          instRef.current.passedElement.element.removeEventListener('change', handler);
        } catch {}
      }

      if (instRef.current) {
        try {
          instRef.current.destroy();
        } catch {}
        instRef.current = null;
      }
    };
  }, [allowInput, onChange, memoOptions, defaultValue, value]);

  // React controlled/uncontrolled çakışmasını engelle
  const inputProps =
    value !== undefined
      ? { ...props, value }
      : { ...props, defaultValue };

  if (allowInput) {
    return <input ref={elRef} className={className} {...inputProps} />;
  }

  return (
    <select ref={elRef} multiple={multiple} className={className} {...inputProps}>
      {children}
    </select>
  );
};

export default ChoicesFormInput;