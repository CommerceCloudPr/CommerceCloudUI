import { FormControl, FormGroup, FormLabel } from 'react-bootstrap';
import Feedback from 'react-bootstrap/esm/Feedback';
import { Controller } from 'react-hook-form';

const TextFormInput = ({
  name,
  containerClassName: containerClass,
  control,
  id,
  label,
  noValidate,
  labelClassName: labelClass,
  onChange,
  value,
  defaultValue = '',
  ...other
}) => {
  // Eğer control yoksa (yani react-hook-form kullanılmıyorsa)
  if (!control) {
    return (
      <FormGroup className={containerClass}>
        {label && (typeof label === 'string'
          ? <FormLabel htmlFor={id ?? name} className={labelClass}>{label}</FormLabel>
          : <>{label}</>)}

        <FormControl
          id={id ?? name}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          {...other}
        />
      </FormGroup>
    );
  }

  // Eğer react-hook-form kullanılıyorsa
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={defaultValue}
      render={({ field, fieldState }) => (
        <FormGroup className={containerClass}>
          {label && (typeof label === 'string'
            ? <FormLabel htmlFor={id ?? name} className={labelClass}>{label}</FormLabel>
            : <>{label}</>)}

          <FormControl
            id={id ?? name}
            {...other}
            {...field}
            value={value ?? field.value} // dışarıdan value geldiyse onu kullan
            onChange={(e) => {
              field.onChange(e); // react-hook-form state'i güncelle
              if (onChange) onChange(e); // dışarıdan gelen onChange de tetiklensin
            }}
            isInvalid={Boolean(fieldState.error?.message)}
          />

          {!noValidate && fieldState.error?.message && (
            <Feedback type="invalid">{fieldState.error.message}</Feedback>
          )}
        </FormGroup>
      )}
    />
  );
};

export default TextFormInput;
